# Drone Control Backend

Real-time WebSocket server for drone control using Socket.IO.

## Features

- ✅ Real-time bidirectional communication
- ✅ Multi-drone support
- ✅ Emergency stop functionality
- ✅ Command validation and safety limits
- ✅ Heartbeat monitoring
- ✅ Telemetry data relay

## Installation

```powershell
cd backend
npm install
```

## Running the Server

### Development mode (with auto-reload):
```powershell
npm run dev
```

### Production mode:
```powershell
npm start
```

Server runs on port **3001** by default (configurable in `.env`).

## API Endpoints

### HTTP
- `GET /health` - Server health check and status

### WebSocket Events

#### Client → Server
- `identify` - Register as controller or drone
- `control-command` - Send control command to drone
- `emergency-stop` - Trigger emergency stop
- `heartbeat` - Keep-alive signal from drone
- `telemetry` - Send telemetry data (from drone)

#### Server → Client
- `drone-list` - List of available drones
- `drone-connected` - New drone available
- `drone-disconnected` - Drone went offline
- `command` - Control command (to drone)
- `drone-telemetry` - Telemetry data (to controller)
- `error` - Error message
- `warning` - Warning message

## Configuration

Edit `.env` file:
```
PORT=3001
NODE_ENV=development
CORS_ORIGIN=*
```

## Security Notes

- Commands are validated for range (-100 to 100)
- Heartbeat monitoring detects connection issues
- CORS can be restricted to specific origins
- Add JWT authentication for production use
