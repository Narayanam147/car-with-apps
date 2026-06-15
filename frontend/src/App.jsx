import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Joystick } from 'react-joystick-component';
import './App.css';

// Backend server URL - change this to your server IP
const SERVER_URL = 'http://localhost:3003';

function App() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [drones, setDrones] = useState([]);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [telemetry, setTelemetry] = useState({});
  const [controllerName, setControllerName] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [speedLimit, setSpeedLimit] = useState(80); // 80% max speed
  
  const joystickRef = useRef({ throttle: 0, yaw: 0, pitch: 0, roll: 0 });
  const commandIntervalRef = useRef(null);
  const prevLeftJoystickRef = useRef({ throttle: 0, yaw: 0 });
  const prevRightJoystickRef = useRef({ pitch: 0, roll: 0 });

  // Trigger tactile vibration (haptic feedback) on supported devices
  const triggerHaptic = (pattern) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (err) {
        console.warn('Haptic feedback failed:', err);
      }
    }
  };

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
      
      // Identify as controller
      const name = controllerName || `Controller-${Date.now()}`;
      newSocket.emit('identify', { type: 'controller', name });
      newSocket.emit('join-room', 'controllers');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    newSocket.on('drone-list', (list) => {
      setDrones(list);
    });

    newSocket.on('drone-connected', (drone) => {
      setDrones(prev => [...prev, drone]);
    });

    newSocket.on('drone-disconnected', ({ id }) => {
      setDrones(prev => prev.filter(d => d.id !== id));
      if (selectedDrone?.id === id) {
        setSelectedDrone(null);
      }
    });

    newSocket.on('drone-telemetry', (data) => {
      if (data.droneId === selectedDrone?.id) {
        setTelemetry(data);
      }
    });

    newSocket.on('error', (error) => {
      console.error('Server error:', error);
      alert(`Error: ${error.message}`);
    });

    setSocket(newSocket);

    return () => {
      if (commandIntervalRef.current) {
        clearInterval(commandIntervalRef.current);
      }
      newSocket.close();
    };
  }, [controllerName]);

  // Send commands at regular intervals (50ms = 20Hz)
  useEffect(() => {
    if (selectedDrone && connected) {
      commandIntervalRef.current = setInterval(() => {
        const command = {
          type: 'move',
          throttle: joystickRef.current.throttle,
          yaw: joystickRef.current.yaw,
          pitch: joystickRef.current.pitch,
          roll: joystickRef.current.roll,
          timestamp: Date.now()
        };

        socket.emit('control-command', {
          droneId: selectedDrone.id,
          command
        });
      }, 50);
    } else {
      if (commandIntervalRef.current) {
        clearInterval(commandIntervalRef.current);
        commandIntervalRef.current = null;
      }
    }

    return () => {
      if (commandIntervalRef.current) {
        clearInterval(commandIntervalRef.current);
      }
    };
  }, [selectedDrone, connected, socket]);

  // Left joystick (Throttle + Yaw)
  const handleLeftJoystick = (stick) => {
    if (stick.type === 'move') {
      const limitedSpeed = speedLimit / 100;
      const nextThrottle = Math.round(stick.y * 100 * limitedSpeed);
      const nextYaw = Math.round(stick.x * 100 * limitedSpeed);
      
      // Haptic pulse when crossing zero centers
      if (Math.sign(prevLeftJoystickRef.current.throttle) !== Math.sign(nextThrottle) ||
          Math.sign(prevLeftJoystickRef.current.yaw) !== Math.sign(nextYaw)) {
        triggerHaptic(10);
      }
      
      joystickRef.current.throttle = nextThrottle;
      joystickRef.current.yaw = nextYaw;
      prevLeftJoystickRef.current = { throttle: nextThrottle, yaw: nextYaw };
    } else if (stick.type === 'stop') {
      joystickRef.current.throttle = 0;
      joystickRef.current.yaw = 0;
      prevLeftJoystickRef.current = { throttle: 0, yaw: 0 };
      triggerHaptic(15);
    }
  };

  // Right joystick (Pitch + Roll)
  const handleRightJoystick = (stick) => {
    if (stick.type === 'move') {
      const limitedSpeed = speedLimit / 100;
      const nextPitch = Math.round(stick.y * 100 * limitedSpeed);
      const nextRoll = Math.round(stick.x * 100 * limitedSpeed);
      
      // Haptic pulse when crossing zero centers
      if (Math.sign(prevRightJoystickRef.current.pitch) !== Math.sign(nextPitch) ||
          Math.sign(prevRightJoystickRef.current.roll) !== Math.sign(nextRoll)) {
        triggerHaptic(10);
      }
      
      joystickRef.current.pitch = nextPitch;
      joystickRef.current.roll = nextRoll;
      prevRightJoystickRef.current = { pitch: nextPitch, roll: nextRoll };
    } else if (stick.type === 'stop') {
      joystickRef.current.pitch = 0;
      joystickRef.current.roll = 0;
      prevRightJoystickRef.current = { pitch: 0, roll: 0 };
      triggerHaptic(15);
    }
  };

  // Emergency stop
  const handleEmergencyStop = () => {
    if (selectedDrone && socket) {
      joystickRef.current = { throttle: 0, yaw: 0, pitch: 0, roll: 0 };
      socket.emit('emergency-stop', { droneId: selectedDrone.id });
      triggerHaptic([100, 50, 100]); // Strong dual-pulse warning haptic
      alert('EMERGENCY STOP ACTIVATED!');
    }
  };

  return (
    <div className="app no-select">
      {/* Header */}
      <header className="header">
        <h1>🚁 Drone Control</h1>
        <div className="status">
          <span className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? '● Connected' : '○ Disconnected'}
          </span>
          <button className="settings-btn" onClick={() => setShowSettings(!showSettings)}>
            ⚙️
          </button>
        </div>
      </header>

      {/* Floating Emergency Stop Banner */}
      {selectedDrone && (
        <div className="emergency-banner-container">
          <button
            className="emergency-stop-floating pulse"
            onClick={handleEmergencyStop}
          >
            🛑 EMERGENCY STOP
          </button>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="settings-panel">
          <h3>Settings</h3>
          <div className="setting-item">
            <label>Speed Limit: {speedLimit}%</label>
            <input
              type="range"
              min="10"
              max="100"
              value={speedLimit}
              onChange={(e) => setSpeedLimit(Number(e.target.value))}
            />
          </div>
          <div className="setting-item">
            <label>Server URL:</label>
            <input type="text" value={SERVER_URL} disabled />
            <small>Edit in App.jsx to change</small>
          </div>
        </div>
      )}

      {/* Drone Selection */}
      <div className="drone-selection">
        <h2>Available Drones</h2>
        {drones.length === 0 ? (
          <p className="no-drones">No drones connected. Start the Python client on your drone.</p>
        ) : (
          <div className="drone-list">
            {drones.map((drone) => (
              <button
                key={drone.id}
                className={`drone-item ${selectedDrone?.id === drone.id ? 'selected' : ''}`}
                onClick={() => setSelectedDrone(drone)}
              >
                <span className="drone-name">{drone.name}</span>
                <span className={`drone-status status-${drone.status}`}>
                  {drone.status}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Telemetry Display */}
      {selectedDrone && (
        <div className="telemetry">
          <h3>Telemetry - {selectedDrone.name}</h3>
          <div className="telemetry-grid">
            <div className="telemetry-item">
              <span className="label">Battery:</span>
              <span className="value">{telemetry.battery || '--'}%</span>
            </div>
            <div className="telemetry-item">
              <span className="label">Altitude:</span>
              <span className="value">{telemetry.altitude || '--'}m</span>
            </div>
            <div className="telemetry-item">
              <span className="label">Signal:</span>
              <span className="value">{telemetry.signal || '--'}%</span>
            </div>
            <div className="telemetry-item">
              <span className="label">GPS:</span>
              <span className="value">{telemetry.gps ? '✓' : '✗'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Control Interface */}
      <div className="controls">
        <div className="joystick-container">
          <div className="joystick-wrapper">
            <label>Throttle / Yaw</label>
            <Joystick
              size={150}
              baseColor="#1e293b"
              stickColor="#3b82f6"
              move={handleLeftJoystick}
              stop={handleLeftJoystick}
            />
            <div className="joystick-info">
              <span>↑↓ Throttle: {joystickRef.current.throttle}</span>
              <span>←→ Yaw: {joystickRef.current.yaw}</span>
            </div>
          </div>

          <div className="joystick-wrapper">
            <label>Pitch / Roll</label>
            <Joystick
              size={150}
              baseColor="#1e293b"
              stickColor="#10b981"
              move={handleRightJoystick}
              stop={handleRightJoystick}
            />
            <div className="joystick-info">
              <span>↑↓ Pitch: {joystickRef.current.pitch}</span>
              <span>←→ Roll: {joystickRef.current.roll}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {!selectedDrone && (
        <div className="instructions">
          <h3>Instructions:</h3>
          <ol>
            <li>Make sure the backend server is running</li>
            <li>Start the Python drone client on your Raspberry Pi</li>
            <li>Select a drone from the list above</li>
            <li>Use the joysticks to control the drone</li>
            <li>Press EMERGENCY STOP if needed</li>
          </ol>
        </div>
      )}
    </div>
  );
}

export default App;
