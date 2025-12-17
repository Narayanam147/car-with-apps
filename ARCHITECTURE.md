# Drone Control System - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         LOCAL NETWORK (Wi-Fi)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐         ┌────────────────┐                  │
│  │   Web Browser    │         │  Mobile Phone  │                  │
│  │  (Controller 1)  │         │ (Controller 2) │                  │
│  │                  │         │                │                  │
│  │  ┌────────────┐  │         │ ┌────────────┐ │                  │
│  │  │ React PWA  │  │         │ │ React PWA  │ │                  │
│  │  │            │  │         │ │            │ │                  │
│  │  │ ┌────┐┌──┐ │  │         │ │ ┌────┐┌──┐ │ │                  │
│  │  │ │Joy││EM│ │  │         │ │ │Joy││EM│ │ │                  │
│  │  │ └────┘└──┘ │  │         │ │ └────┘└──┘ │ │                  │
│  │  └─────┬──────┘  │         │ └──────┬─────┘ │                  │
│  └────────┼─────────┘         └────────┼───────┘                  │
│           │                             │                          │
│           │ Socket.IO                   │ Socket.IO                │
│           │ (Port 3000)                 │ (Port 3000)              │
│           │                             │                          │
│           └──────────┬──────────────────┘                          │
│                      │                                             │
│                      ▼                                             │
│           ┌──────────────────────┐                                │
│           │   Backend Server     │                                │
│           │   (Node.js)          │                                │
│           │                      │                                │
│           │  ┌────────────────┐  │                                │
│           │  │  Socket.IO Hub │  │                                │
│           │  │                │  │                                │
│           │  │  - Commands    │  │                                │
│           │  │  - Telemetry   │  │                                │
│           │  │  - Heartbeat   │  │                                │
│           │  └────────────────┘  │                                │
│           │   Port: 3001         │                                │
│           └──────────┬───────────┘                                │
│                      │                                             │
│                      │ Socket.IO                                   │
│                      │                                             │
│                      ▼                                             │
│           ┌──────────────────────┐                                │
│           │   Raspberry Pi       │                                │
│           │   (Drone Client)     │                                │
│           │                      │                                │
│           │  ┌────────────────┐  │                                │
│           │  │ Python Client  │  │                                │
│           │  │                │  │                                │
│           │  │ - Cmd Process  │  │                                │
│           │  │ - Motor Control│  │                                │
│           │  │ - Telemetry    │  │                                │
│           │  └────────┬───────┘  │                                │
│           └───────────┼──────────┘                                │
│                       │                                            │
│                       ▼                                            │
│              ┌─────────────────┐                                  │
│              │  Drone Hardware │                                  │
│              │                 │                                  │
│              │  ┌─┐  ┌─┐      │                                  │
│              │  │M│  │M│  ←FL,FR                                 │
│              │  └─┘  └─┘      │                                  │
│              │                 │                                  │
│              │  ┌─┐  ┌─┐      │                                  │
│              │  │M│  │M│  ←RL,RR                                 │
│              │  └─┘  └─┘      │                                  │
│              │                 │                                  │
│              │  [ESC] [ESC]   │                                  │
│              │  [ESC] [ESC]   │                                  │
│              │                 │                                  │
│              │  [Battery]     │                                  │
│              │  [Sensors]     │                                  │
│              └─────────────────┘                                  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

Legend:
  M = Motor (brushless)
  Joy = Joystick control
  EM = Emergency Stop
  ESC = Electronic Speed Controller
  FL/FR = Front Left/Front Right
  RL/RR = Rear Left/Rear Right
```

## Data Flow Diagram

```
Controller → Server → Drone → Hardware
   ↓          ↓        ↓         ↓
Joystick   Command   Motor    Propeller
 Input     Relay     Mixing   Rotation
   ↓          ↓        ↓         ↓
Control    Validate  PWM      Physical
Command    Range     Signal   Movement
   ↓          ↓        ↓         ↓
Socket.IO  Forward   GPIO     Sensor
Emit       to Drone  Output   Reading
           ↓                     ↓
           ←────────Telemetry────┘
```

## Command Flow

```
1. USER MOVES JOYSTICK
   │
   ├─ Left Joystick (Throttle/Yaw)
   │  └─ Outputs: throttle (-100 to 100), yaw (-100 to 100)
   │
   └─ Right Joystick (Pitch/Roll)
      └─ Outputs: pitch (-100 to 100), roll (-100 to 100)
   │
   ▼

2. FRONTEND PROCESSES INPUT
   │
   ├─ Apply speed limit (multiply by speedLimit%)
   ├─ Bundle into command object
   └─ Emit via Socket.IO @ 20Hz (every 50ms)
   │
   ▼

3. BACKEND RECEIVES COMMAND
   │
   ├─ Validate command structure
   ├─ Check value ranges (-100 to 100)
   ├─ Verify drone exists
   └─ Forward to selected drone
   │
   ▼

4. DRONE CLIENT RECEIVES COMMAND
   │
   ├─ Check not emergency stopped
   ├─ Extract throttle, yaw, pitch, roll
   └─ Calculate motor speeds
   │
   ▼

5. MOTOR MIXING ALGORITHM
   │
   FL = throttle + yaw + pitch - roll
   FR = throttle - yaw + pitch + roll
   RL = throttle + yaw - pitch - roll
   RR = throttle - yaw - pitch + roll
   │
   ├─ Normalize to 0-100 range
   └─ Clamp values
   │
   ▼

6. APPLY TO HARDWARE
   │
   ├─ [Simulator Mode] Print to console
   └─ [Hardware Mode] Output PWM to GPIO pins
      │
      └─ ESCs convert to motor speeds
         │
         └─ Motors spin propellers
            │
            └─ Drone moves!
```

## Telemetry Flow (Reverse Direction)

```
Sensors → Drone Client → Backend → Controllers
   │           │            │          │
Battery     Read Data    Relay     Display
Voltage        ↓            ↓          ↓
   │        Package      Forward   Update UI
GPS           ↓            ↓          ↓
Status     Emit @2Hz    Broadcast Battery%
   │           ↓            ↓       Altitude
Altitude   Socket.IO    To Room    Signal
   │           ↓            ↓       GPS
Signal      JSON          All       Status
Strength    Format      Controllers
```

## Emergency Stop Flow

```
USER PRESSES EMERGENCY STOP BUTTON
   │
   ▼
Frontend emits 'emergency-stop' event
   │
   ▼
Backend receives and forwards to drone
   │
   ▼
Drone Client:
   ├─ Sets emergency_stopped = True
   ├─ Sets all motor speeds to 0
   ├─ Disarms drone
   └─ Blocks further movement commands
   │
   ▼
Motors stop immediately
```

## Network Topology

### Local Network (Recommended)

```
Internet
   │
   ▼
[Router] ← Wi-Fi
   │
   ├─────────────┬──────────────┬────────────┐
   │             │              │            │
[PC]         [Phone]      [Tablet]    [Raspberry Pi]
Backend      Controller   Controller   Drone Client
:3001        :3000        :3000        Python
Frontend
:3000

IP: 192.168.1.100 (example)
All devices on same subnet
Low latency: 10-50ms
```

### Internet Access (Advanced)

```
[PC with Backend] ←─ Port Forward ─→ [Router] ←─ Internet ─→ [Mobile Device]
   │                    :3001                                       │
   └────────────────────────────────────────────────────────────────┘
                    WebSocket over WSS (TLS)
                    Requires:
                    - Static IP or Dynamic DNS
                    - Port forwarding (3001)
                    - SSL certificate
                    - Authentication
```

## Port Usage

| Service  | Port | Protocol | Purpose                |
|----------|------|----------|------------------------|
| Backend  | 3001 | HTTP/WS  | Socket.IO server       |
| Frontend | 3000 | HTTP     | Vite dev server        |
| Frontend | 5173 | HTTP     | Vite (alternative)     |

## Security Layers

```
Layer 1: Network
   └─ Local Wi-Fi only (no internet exposure)

Layer 2: Input Validation
   └─ Range check: -100 to 100
   └─ Type checking
   └─ Command structure validation

Layer 3: Speed Limiting
   └─ User-adjustable speed cap (10-100%)

Layer 4: Emergency Stop
   └─ Hardware kill switch
   └─ Blocks all commands

Layer 5: Heartbeat Monitoring
   └─ Detects connection loss
   └─ Warns on timeout (10s)

Layer 6: (Future) Authentication
   └─ JWT tokens
   └─ User sessions
```

## File Structure

```
d:\car with app\
│
├── backend/                    # Node.js server
│   ├── server.js              # Main server (250 lines)
│   ├── package.json           # Dependencies
│   ├── .env                   # Configuration
│   └── README.md              # Backend docs
│
├── frontend/                   # React PWA
│   ├── src/
│   │   ├── App.jsx            # Main component (300 lines)
│   │   ├── App.css            # Styles (400 lines)
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── index.html             # HTML template
│   ├── vite.config.js         # Build config
│   ├── package.json           # Dependencies
│   └── README.md              # Frontend docs
│
├── drone-client/               # Python client
│   ├── drone_client.py        # Main client (400 lines)
│   ├── requirements.txt       # Python deps
│   └── README.md              # Client docs
│
├── README.md                   # Main documentation
├── QUICKSTART.md              # Quick start guide
├── ARCHITECTURE.md            # This file
├── start.ps1                  # Windows start script
└── package.json               # Root package file
```

## Technology Stack

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **WebSocket**: Socket.IO 4.6
- **Config**: dotenv
- **CORS**: cors middleware

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **WebSocket**: socket.io-client 4.6
- **UI Component**: react-joystick-component 6.1
- **PWA**: vite-plugin-pwa 0.17

### Drone Client
- **Language**: Python 3.7+
- **WebSocket**: python-socketio 5.10
- **GPIO**: RPi.GPIO 0.7 (optional)
- **Hardware**: Raspberry Pi 3/4/5

## Performance Metrics

| Metric              | Value      | Notes                    |
|---------------------|------------|--------------------------|
| Command Rate        | 20 Hz      | 50ms interval            |
| Telemetry Rate      | 2 Hz       | 500ms interval           |
| Heartbeat Rate      | 0.5 Hz     | 2s interval              |
| Local Latency       | 10-50ms    | Same Wi-Fi network       |
| Internet Latency    | 100-300ms  | Depends on connection    |
| Concurrent Drones   | Unlimited  | Limited by bandwidth     |
| Concurrent Users    | Unlimited  | Limited by server        |

## Scalability Considerations

### Current Limitations
- Single server instance
- No load balancing
- No database persistence
- In-memory state only

### Scaling Options
1. **Horizontal Scaling**: Multiple server instances with Redis pub/sub
2. **Database**: Add MongoDB for logging/analytics
3. **Load Balancer**: NGINX for multiple servers
4. **CDN**: Static asset delivery
5. **Microservices**: Separate command/telemetry services

## Future Architecture Enhancements

```
Planned additions:

1. Video Streaming Layer
   ├─ WebRTC peer connection
   ├─ Camera stream (H.264)
   └─ Adaptive bitrate

2. Authentication Layer
   ├─ JWT token generation
   ├─ User management
   └─ Session handling

3. Persistence Layer
   ├─ MongoDB for logs
   ├─ Flight data recording
   └─ User preferences

4. Analytics Layer
   ├─ Real-time metrics
   ├─ Performance monitoring
   └─ Error tracking
```

## Deployment Scenarios

### Scenario 1: Local Testing (Current)
- Backend: localhost:3001
- Frontend: localhost:3000
- Drone: localhost (simulator)
- Use case: Development

### Scenario 2: Home Network
- Backend: 192.168.1.100:3001
- Frontend: 192.168.1.100:3000
- Drone: 192.168.1.150 (Raspberry Pi)
- Use case: Indoor testing

### Scenario 3: Cloud Deployment
- Backend: AWS/Heroku (cloud server)
- Frontend: Netlify/Vercel (static hosting)
- Drone: Public internet connection
- Use case: Remote operation

## Safety Architecture

```
Multiple safety layers:

1. Client-Side (Frontend)
   └─ Speed limit enforcement
   └─ UI-level emergency stop

2. Server-Side (Backend)
   └─ Command validation
   └─ Range checking
   └─ Connection monitoring

3. Device-Side (Drone)
   └─ Emergency stop flag
   └─ Motor failsafe
   └─ Command filtering

4. Physical-Level
   └─ ESC cutoff
   └─ Battery protection
   └─ Propeller guards (recommended)
```
