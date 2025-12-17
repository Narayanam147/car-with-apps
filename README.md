# 🚁 Drone Control System

Complete real-time drone control system with web/mobile interface, WebSocket backend, and Python client for Raspberry Pi.

## 📋 Table of Contents

- [Features](#features)
- [System Architecture](#system-architecture)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)

## ✨ Features

### Control System
- ✅ Real-time bidirectional WebSocket communication (Socket.IO)
- ✅ Dual joystick control (Throttle/Yaw + Pitch/Roll)
- ✅ Emergency stop button
- ✅ Speed limiting (adjustable 10-100%)
- ✅ Multi-drone support
- ✅ Connection monitoring with heartbeat

### Frontend (Web/Mobile)
- ✅ Responsive React PWA (works on desktop and mobile)
- ✅ Virtual joystick controls
- ✅ Real-time telemetry display (battery, altitude, signal, GPS)
- ✅ Drone selection interface
- ✅ Connection status indicators
- ✅ Modern, glassmorphic UI

### Backend Server
- ✅ Node.js + Express + Socket.IO
- ✅ Command validation and range checking
- ✅ Multi-client support (multiple controllers and drones)
- ✅ Telemetry relay
- ✅ Heartbeat monitoring
- ✅ Health check endpoint

### Drone Client
- ✅ Python client for Raspberry Pi
- ✅ Simulator mode (no hardware required)
- ✅ GPIO/PWM motor control support
- ✅ Quadcopter mixing algorithm
- ✅ Emergency stop handling
- ✅ Telemetry reporting
- ✅ Auto-reconnection

## 🏗️ System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│  Web/Mobile App │◄───────►│  Backend Server │◄───────►│   Drone Client  │
│   (React PWA)   │ Socket  │  (Node.js +     │ Socket  │  (Python on     │
│                 │   .IO   │   Socket.IO)    │   .IO   │   Raspberry Pi) │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                            │                            │
        │                            │                            │
    Joystick                    Command Relay                  Motors
    Controls                    + Telemetry                    + Sensors
```

### Communication Flow

1. **Controller → Server**: Joystick movements sent as control commands
2. **Server → Drone**: Commands forwarded to selected drone
3. **Drone → Server**: Telemetry data sent back (battery, altitude, etc.)
4. **Server → Controller**: Telemetry displayed to user

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ (for backend and frontend)
- **Python** 3.7+ (for drone client)
- **npm** or **yarn** (package manager)

### 1. Start the Backend Server

```powershell
cd backend
npm install
npm start
```

Server runs on **http://localhost:3001**

### 2. Start the Frontend (Web App)

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:3000**

### 3. Start the Drone Client (Simulator)

```powershell
cd drone-client
pip install socketio-client python-socketio
python drone_client.py --simulator
```

### 4. Control Your Drone!

1. Open **http://localhost:3000** in your browser
2. Wait for the drone to appear in the "Available Drones" list
3. Click on the drone to select it
4. Use the joysticks to control the drone
5. Press **EMERGENCY STOP** if needed

## 📦 Installation

### Backend Setup

```powershell
cd backend
npm install
```

**Dependencies:**
- `express` - Web server
- `socket.io` - WebSocket library
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment configuration

### Frontend Setup

```powershell
cd frontend
npm install
```

**Dependencies:**
- `react` + `react-dom` - UI framework
- `vite` - Build tool and dev server
- `socket.io-client` - WebSocket client
- `react-joystick-component` - Virtual joystick
- `vite-plugin-pwa` - Progressive Web App support

### Drone Client Setup

```powershell
cd drone-client
pip install -r requirements.txt
```

**Dependencies:**
- `socketio-client` - WebSocket client
- `python-socketio` - Socket.IO implementation
- `RPi.GPIO` - (Optional) Raspberry Pi GPIO control

## 🎮 Usage

### Running on Local Network

#### 1. Find Your Computer's IP Address

```powershell
ipconfig
```

Look for your local IP (e.g., `192.168.1.100`)

#### 2. Update Configuration

**Frontend** (`frontend/src/App.jsx`):
```javascript
const SERVER_URL = 'http://192.168.1.100:3001';
```

**Drone Client**:
```bash
python drone_client.py --server http://192.168.1.100:3001
```

#### 3. Access from Mobile

Open `http://192.168.1.100:3000` on your phone (same Wi-Fi network)

### Control Mapping

#### Left Joystick (Throttle + Yaw)
- **Up/Down**: Throttle (vertical thrust)
- **Left/Right**: Yaw (rotation)

#### Right Joystick (Pitch + Roll)
- **Up/Down**: Pitch (forward/backward)
- **Left/Right**: Roll (left/right strafe)

#### Safety Features
- **Speed Limit Slider**: Limits max speed (10-100%)
- **Emergency Stop**: Immediately stops all motors
- **Connection Monitor**: Shows connection status
- **Heartbeat**: Detects connection loss

## ⚙️ Configuration

### Backend (`.env`)

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=*
```

### Frontend

Edit `frontend/src/App.jsx`:
```javascript
const SERVER_URL = 'http://localhost:3001'; // Change to your server IP
```

### Drone Client

Command line options:
```bash
python drone_client.py \
  --server http://localhost:3001 \
  --name "Drone-Alpha" \
  --simulator
```

## 🔒 Security

### Current Implementation (Development)

- ✅ Command validation (range -100 to 100)
- ✅ Emergency stop mechanism
- ✅ Heartbeat monitoring
- ✅ Connection state tracking

### Production Recommendations

⚠️ **Before deploying to production:**

1. **Authentication**: Add JWT tokens
   ```javascript
   // Add to backend/server.js
   const jwt = require('jsonwebtoken');
   ```

2. **HTTPS/WSS**: Use TLS encryption
   ```javascript
   const https = require('https');
   const fs = require('fs');
   
   const server = https.createServer({
     key: fs.readFileSync('key.pem'),
     cert: fs.readFileSync('cert.pem')
   }, app);
   ```

3. **Rate Limiting**: Prevent command flooding
   ```javascript
   const rateLimit = require('express-rate-limit');
   ```

4. **Input Sanitization**: Already implemented (range checks)

5. **CORS Restriction**: Limit to specific domains
   ```javascript
   cors({ origin: 'https://yourdomain.com' })
   ```

## 🐛 Troubleshooting

### Frontend Won't Connect

**Problem**: "Disconnected" status

**Solutions:**
1. Check server is running: `npm start` in `backend/`
2. Verify server URL in `App.jsx` matches backend address
3. Check firewall settings (allow port 3001)
4. Try `http://` instead of `https://`

### Drone Not Appearing

**Problem**: No drones in list

**Solutions:**
1. Check drone client is running
2. Verify server URL in drone client matches backend
3. Check console for connection errors
4. Restart drone client

### Controls Not Working

**Problem**: Joysticks don't control drone

**Solutions:**
1. Select a drone from the list first
2. Check emergency stop isn't active
3. Verify connection status is "Connected"
4. Check browser console for errors

### High Latency

**Problem**: Delayed response

**Solutions:**
1. Use local network (not internet)
2. Reduce command rate in code (increase interval)
3. Check network quality (signal strength)
4. Close other network-heavy apps

### Raspberry Pi GPIO Errors

**Problem**: "RPi.GPIO not available"

**Solutions:**
1. Install GPIO library: `pip3 install RPi.GPIO`
2. Run with sudo: `sudo python drone_client.py`
3. Use simulator mode: `python drone_client.py --simulator`

## 🚀 Future Enhancements

### Planned Features

- [ ] **Video Streaming**: WebRTC camera feed
- [ ] **GPS Waypoints**: Autonomous navigation
- [ ] **Flight Modes**: Stabilize, Altitude Hold, Loiter
- [ ] **Native Mobile App**: React Native version
- [ ] **Multiple Controllers**: Collaborative control
- [ ] **Flight Logging**: Record telemetry data
- [ ] **Gesture Controls**: Motion-based input
- [ ] **Voice Commands**: Speech recognition
- [ ] **AR Overlay**: Augmented reality HUD

### Video Streaming Setup

To add camera streaming:

1. **Backend**: Add WebRTC signaling
   ```bash
   npm install wrtc
   ```

2. **Frontend**: Add video display
   ```javascript
   <video id="drone-feed" autoplay />
   ```

3. **Drone**: Setup camera stream
   ```bash
   pip install opencv-python
   ```

## 📁 Project Structure

```
d:\car with app\
├── backend/                 # Node.js WebSocket server
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies
│   ├── .env               # Configuration
│   └── README.md          # Backend docs
│
├── frontend/               # React PWA web app
│   ├── src/
│   │   ├── App.jsx        # Main component
│   │   ├── App.css        # Styles
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Build config
│   ├── package.json       # Dependencies
│   └── README.md          # Frontend docs
│
├── drone-client/           # Python drone client
│   ├── drone_client.py    # Main client
│   ├── requirements.txt   # Python dependencies
│   └── README.md          # Client docs
│
└── README.md              # This file
```

## 📝 License

MIT License - Feel free to use for personal or commercial projects

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Security enhancements
- Video streaming
- Additional flight modes
- Better error handling
- Mobile app version
- Documentation improvements

## ⚠️ Safety Warning

**IMPORTANT**: This is a drone control system. Always follow these safety guidelines:

- ✅ Test in simulator mode first
- ✅ Remove propellers during testing
- ✅ Use in open areas only
- ✅ Follow local regulations
- ✅ Keep emergency stop accessible
- ✅ Monitor battery levels
- ✅ Never fly near people/property
- ✅ Have a backup manual controller

**You are responsible for safe operation of your drone.**

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the README files in each directory
3. Check console logs for error messages
4. Verify all dependencies are installed

---

**Made with ❤️ for drone enthusiasts**
