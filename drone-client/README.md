# Drone Control Client

Python client for connecting a drone to the control server.

## Features

- ✅ WebSocket connection to control server
- ✅ Real-time command processing
- ✅ Motor control mixing (throttle, yaw, pitch, roll)
- ✅ Emergency stop safety feature
- ✅ Telemetry reporting
- ✅ Heartbeat monitoring
- ✅ Simulator mode (no hardware required)
- ✅ Raspberry Pi GPIO support

## Installation

### On Raspberry Pi (Hardware Mode)

```bash
cd drone-client
pip3 install -r requirements.txt
```

For GPIO support, uncomment the GPIO libraries in `requirements.txt`:
```bash
pip3 install RPi.GPIO
```

### On Development Machine (Simulator Mode)

```bash
cd drone-client
pip3 install socketio-client python-socketio
```

## Usage

### Simulator Mode (No Hardware)

```bash
python drone_client.py --simulator
```

### Hardware Mode (Raspberry Pi)

```bash
python drone_client.py
```

### Custom Server/Name

```bash
python drone_client.py --server http://192.168.1.100:3001 --name "Drone-Beta"
```

## Command Line Options

- `--server URL` - Server URL (default: http://localhost:3001)
- `--name NAME` - Drone name (default: Drone-Alpha)
- `--simulator` - Force simulator mode even if GPIO available

## Hardware Setup (Raspberry Pi)

### GPIO Pin Mapping

Default pins (BCM numbering):
- Front Left Motor: GPIO 17
- Front Right Motor: GPIO 27
- Rear Left Motor: GPIO 22
- Rear Right Motor: GPIO 23

Edit `MOTOR_PINS` in `drone_client.py` to match your setup.

### Wiring

Connect ESCs (Electronic Speed Controllers) to the GPIO pins via PWM.
Make sure to use proper power distribution and isolation.

⚠️ **Safety Warning**: Always remove propellers during testing!

## Control Mapping

The client uses a quadcopter mixing algorithm:

- **Throttle**: Overall vertical thrust
- **Yaw**: Rotation around vertical axis
- **Pitch**: Forward/backward tilt
- **Roll**: Left/right tilt

Motor speeds are calculated automatically based on these inputs.

## Telemetry

Sends the following data to controllers:
- Battery level (%)
- Altitude (meters)
- Signal strength (%)
- GPS status
- Armed status

## Emergency Stop

The emergency stop command will:
1. Set all motor speeds to zero
2. Disarm the drone
3. Prevent further commands until reset

## Troubleshooting

### "RPi.GPIO not available"
- This is normal on non-Raspberry Pi systems
- Client runs in simulator mode automatically

### Connection Issues
- Check server URL and port
- Verify server is running
- Check firewall settings

### Motor Not Responding
- Verify GPIO pin numbers
- Check ESC connections
- Ensure proper power supply
- Test in simulator mode first

## Integration with Flight Controllers

For real drone hardware with flight controllers (Pixhawk, ArduPilot, etc.):

1. Install MAVLink/DroneKit:
   ```bash
   pip3 install pymavlink dronekit
   ```

2. Modify `drone_client.py` to send commands via MAVLink instead of GPIO

3. Connect to flight controller serial port (e.g., `/dev/ttyACM0`)

## Safety Guidelines

⚠️ **IMPORTANT**: 
- Always test in simulator mode first
- Remove propellers during testing
- Have an emergency stop button ready
- Follow local drone regulations
- Never fly near people or property
- Monitor battery levels
- Test in open areas only
