#!/usr/bin/env python3
"""
Drone Control Client
Connects to the control server and receives commands.
Can run in simulator mode or with actual hardware.
"""

import socketio
import time
import sys
import signal
import argparse
from datetime import datetime

# Try to import GPIO (will fail if not on Raspberry Pi)
try:
    import RPi.GPIO as GPIO
    GPIO_AVAILABLE = True
except ImportError:
    GPIO_AVAILABLE = False
    print("⚠️  RPi.GPIO not available - running in SIMULATOR mode")

# Socket.IO client
sio = socketio.Client(reconnection=True, reconnection_delay=1)

# Configuration
SERVER_URL = 'http://localhost:3001'
DRONE_NAME = 'Drone-Alpha'
SIMULATOR_MODE = not GPIO_AVAILABLE

# Telemetry data (simulated or real)
telemetry = {
    'battery': 100,
    'altitude': 0.0,
    'signal': 100,
    'gps': True,
    'armed': False
}

# Current motor speeds (0-100)
motor_speeds = {
    'front_left': 0,
    'front_right': 0,
    'rear_left': 0,
    'rear_right': 0
}

# GPIO Pin mapping (example for Raspberry Pi)
# Adjust these based on your actual hardware setup
MOTOR_PINS = {
    'front_left': 17,
    'front_right': 27,
    'rear_left': 22,
    'rear_right': 23
}

# Emergency stop flag
emergency_stopped = False

def setup_gpio():
    """Initialize GPIO pins for motor control."""
    if not GPIO_AVAILABLE:
        return
    
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    
    # Setup PWM for each motor
    for motor, pin in MOTOR_PINS.items():
        GPIO.setup(pin, GPIO.OUT)
        pwm = GPIO.PWM(pin, 50)  # 50Hz frequency
        pwm.start(0)
        motor_speeds[motor + '_pwm'] = pwm
    
    print("✓ GPIO initialized")

def cleanup_gpio():
    """Cleanup GPIO on exit."""
    if GPIO_AVAILABLE:
        for motor in MOTOR_PINS.keys():
            pwm_key = motor + '_pwm'
            if pwm_key in motor_speeds:
                motor_speeds[pwm_key].stop()
        GPIO.cleanup()
        print("✓ GPIO cleaned up")

def calculate_motor_speeds(throttle, yaw, pitch, roll):
    """
    Convert joystick inputs to individual motor speeds.
    
    Args:
        throttle: Vertical thrust (-100 to 100)
        yaw: Rotation (-100 to 100)
        pitch: Forward/backward tilt (-100 to 100)
        roll: Left/right tilt (-100 to 100)
    
    Returns:
        Dictionary with motor speeds (0-100)
    """
    # Normalize inputs to 0-1 range
    t = (throttle + 100) / 200  # 0 to 1
    y = yaw / 100               # -1 to 1
    p = pitch / 100             # -1 to 1
    r = roll / 100              # -1 to 1
    
    # Calculate individual motor contributions
    # This is a simplified mixing algorithm
    fl = t + y + p - r  # Front Left
    fr = t - y + p + r  # Front Right
    rl = t + y - p - r  # Rear Left
    rr = t - y - p + r  # Rear Right
    
    # Normalize to 0-100 range and clamp
    speeds = {
        'front_left': max(0, min(100, fl * 100)),
        'front_right': max(0, min(100, fr * 100)),
        'rear_left': max(0, min(100, rl * 100)),
        'rear_right': max(0, min(100, rr * 100))
    }
    
    return speeds

def apply_motor_speeds(speeds):
    """Apply calculated speeds to motors."""
    global motor_speeds
    motor_speeds.update(speeds)
    
    if GPIO_AVAILABLE and not emergency_stopped:
        # Apply PWM to actual motors
        for motor, speed in speeds.items():
            pwm_key = motor + '_pwm'
            if pwm_key in motor_speeds:
                duty_cycle = speed  # Convert 0-100 to duty cycle
                motor_speeds[pwm_key].ChangeDutyCycle(duty_cycle)
    
    # Print status (for simulator mode or debugging)
    if SIMULATOR_MODE:
        print(f"[MOTORS] FL:{speeds['front_left']:.0f} FR:{speeds['front_right']:.0f} "
              f"RL:{speeds['rear_left']:.0f} RR:{speeds['rear_right']:.0f}")

def emergency_stop():
    """Stop all motors immediately."""
    global emergency_stopped
    emergency_stopped = True
    
    print("\n🛑 EMERGENCY STOP ACTIVATED!")
    
    # Set all motors to zero
    stop_speeds = {
        'front_left': 0,
        'front_right': 0,
        'rear_left': 0,
        'rear_right': 0
    }
    apply_motor_speeds(stop_speeds)
    telemetry['armed'] = False

def send_telemetry():
    """Send telemetry data to server."""
    try:
        sio.emit('telemetry', telemetry)
    except Exception as e:
        print(f"Error sending telemetry: {e}")

# Socket.IO Event Handlers

@sio.on('connect')
def on_connect():
    """Handle connection to server."""
    print(f"✓ Connected to server at {SERVER_URL}")
    
    # Identify as drone
    sio.emit('identify', {
        'type': 'drone',
        'name': DRONE_NAME
    })
    
    print(f"✓ Registered as: {DRONE_NAME}")
    print(f"✓ Mode: {'SIMULATOR' if SIMULATOR_MODE else 'HARDWARE'}")

@sio.on('disconnect')
def on_disconnect():
    """Handle disconnection from server."""
    print("✗ Disconnected from server")
    emergency_stop()

@sio.on('command')
def on_command(data):
    """Handle control commands from controller."""
    global emergency_stopped
    
    command = data.get('command', {})
    cmd_type = command.get('type')
    
    if cmd_type == 'emergency-stop':
        emergency_stop()
        return
    
    if cmd_type == 'move' and not emergency_stopped:
        throttle = command.get('throttle', 0)
        yaw = command.get('yaw', 0)
        pitch = command.get('pitch', 0)
        roll = command.get('roll', 0)
        
        # Calculate and apply motor speeds
        speeds = calculate_motor_speeds(throttle, yaw, pitch, roll)
        apply_motor_speeds(speeds)
        
        # Update telemetry
        telemetry['armed'] = any(s > 5 for s in speeds.values())

@sio.on('warning')
def on_warning(data):
    """Handle warnings from server."""
    print(f"⚠️  Warning: {data.get('message')}")

def heartbeat_loop():
    """Send heartbeat to server periodically."""
    while True:
        try:
            if sio.connected:
                sio.emit('heartbeat')
            time.sleep(2)
        except Exception as e:
            print(f"Heartbeat error: {e}")
            time.sleep(2)

def telemetry_loop():
    """Update and send telemetry periodically."""
    while True:
        try:
            # Simulate telemetry changes (in real drone, read from sensors)
            if SIMULATOR_MODE:
                # Simulate battery drain
                if telemetry['armed']:
                    telemetry['battery'] = max(0, telemetry['battery'] - 0.01)
                
                # Simulate altitude based on throttle
                avg_speed = sum(motor_speeds[m] for m in ['front_left', 'front_right', 'rear_left', 'rear_right']) / 4
                telemetry['altitude'] = avg_speed / 10  # Simple simulation
            
            # Send telemetry
            if sio.connected:
                send_telemetry()
            
            time.sleep(0.5)  # 2Hz telemetry rate
            
        except Exception as e:
            print(f"Telemetry error: {e}")
            time.sleep(0.5)

def signal_handler(sig, frame):
    """Handle Ctrl+C gracefully."""
    print("\n\n🛑 Shutting down...")
    emergency_stop()
    cleanup_gpio()
    sio.disconnect()
    sys.exit(0)

def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description='Drone Control Client')
    parser.add_argument('--server', default=SERVER_URL, help='Server URL')
    parser.add_argument('--name', default=DRONE_NAME, help='Drone name')
    parser.add_argument('--simulator', action='store_true', help='Force simulator mode')
    args = parser.parse_args()
    
    global SERVER_URL, DRONE_NAME, SIMULATOR_MODE
    SERVER_URL = args.server
    DRONE_NAME = args.name
    
    if args.simulator:
        SIMULATOR_MODE = True
    
    # Setup
    print("\n" + "="*50)
    print("🚁 DRONE CONTROL CLIENT")
    print("="*50)
    print(f"Server: {SERVER_URL}")
    print(f"Drone: {DRONE_NAME}")
    print(f"Mode: {'SIMULATOR' if SIMULATOR_MODE else 'HARDWARE'}")
    print("="*50 + "\n")
    
    # Initialize GPIO if available
    if not SIMULATOR_MODE:
        setup_gpio()
    
    # Setup signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Connect to server
    try:
        print(f"Connecting to {SERVER_URL}...")
        sio.connect(SERVER_URL)
        
        # Start background loops
        import threading
        heartbeat_thread = threading.Thread(target=heartbeat_loop, daemon=True)
        telemetry_thread = threading.Thread(target=telemetry_loop, daemon=True)
        
        heartbeat_thread.start()
        telemetry_thread.start()
        
        print("\n✓ Drone client running. Press Ctrl+C to stop.\n")
        
        # Keep main thread alive
        sio.wait()
        
    except KeyboardInterrupt:
        signal_handler(None, None)
    except Exception as e:
        print(f"✗ Error: {e}")
        cleanup_gpio()
        sys.exit(1)

if __name__ == '__main__':
    main()
