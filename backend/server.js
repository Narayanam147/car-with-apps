require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json());

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
});

// Store connected clients
const connectedClients = {
  controllers: new Map(), // Web/mobile controllers
  drones: new Map()       // Drone clients
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    controllers: connectedClients.controllers.size,
    drones: connectedClients.drones.size,
    timestamp: new Date().toISOString()
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`[${new Date().toISOString()}] Client connected: ${socket.id}`);

  // Client identification
  socket.on('identify', (data) => {
    const { type, name } = data;
    
    if (type === 'controller') {
      connectedClients.controllers.set(socket.id, { name, socket });
      console.log(`Controller registered: ${name} (${socket.id})`);
      
      // Notify controller of available drones
      const droneList = Array.from(connectedClients.drones.values()).map(d => ({
        id: d.socket.id,
        name: d.name,
        status: d.status || 'idle'
      }));
      socket.emit('drone-list', droneList);
      
    } else if (type === 'drone') {
      connectedClients.drones.set(socket.id, { 
        name, 
        socket,
        status: 'idle',
        lastHeartbeat: Date.now()
      });
      console.log(`Drone registered: ${name} (${socket.id})`);
      
      // Notify all controllers about new drone
      io.to('controllers').emit('drone-connected', {
        id: socket.id,
        name,
        status: 'idle'
      });
    }
  });

  // Join room for broadcasting
  socket.on('join-room', (room) => {
    socket.join(room);
  });

  // Control commands from controller to drone
  socket.on('control-command', (data) => {
    const { droneId, command } = data;
    
    // Validate command structure
    if (!droneId || !command || !command.type) {
      socket.emit('error', { message: 'Invalid command format' });
      return;
    }

    // Security: Validate command ranges
    if (command.type === 'move') {
      const { throttle, yaw, pitch, roll } = command;
      const isValid = 
        throttle >= -100 && throttle <= 100 &&
        yaw >= -100 && yaw <= 100 &&
        pitch >= -100 && pitch <= 100 &&
        roll >= -100 && roll <= 100;
      
      if (!isValid) {
        socket.emit('error', { message: 'Command values out of range (-100 to 100)' });
        return;
      }
    }

    // Forward to specific drone
    const drone = connectedClients.drones.get(droneId);
    if (drone) {
      drone.socket.emit('command', {
        controllerId: socket.id,
        command,
        timestamp: Date.now()
      });
    } else {
      socket.emit('error', { message: 'Drone not found' });
    }
  });

  // Telemetry data from drone to controller
  socket.on('telemetry', (data) => {
    // Broadcast telemetry to all controllers
    io.to('controllers').emit('drone-telemetry', {
      droneId: socket.id,
      ...data,
      timestamp: Date.now()
    });
  });

  // Heartbeat from drone
  socket.on('heartbeat', () => {
    const drone = connectedClients.drones.get(socket.id);
    if (drone) {
      drone.lastHeartbeat = Date.now();
    }
  });

  // Emergency stop
  socket.on('emergency-stop', (data) => {
    const { droneId } = data;
    const drone = connectedClients.drones.get(droneId);
    
    if (drone) {
      drone.socket.emit('command', {
        controllerId: socket.id,
        command: { type: 'emergency-stop' },
        timestamp: Date.now()
      });
      console.log(`[EMERGENCY STOP] Drone ${droneId} stopped by ${socket.id}`);
    }
  });

  // Disconnection handling
  socket.on('disconnect', () => {
    console.log(`[${new Date().toISOString()}] Client disconnected: ${socket.id}`);
    
    if (connectedClients.controllers.has(socket.id)) {
      connectedClients.controllers.delete(socket.id);
      console.log(`Controller disconnected: ${socket.id}`);
    }
    
    if (connectedClients.drones.has(socket.id)) {
      connectedClients.drones.delete(socket.id);
      console.log(`Drone disconnected: ${socket.id}`);
      
      // Notify controllers
      io.to('controllers').emit('drone-disconnected', { id: socket.id });
    }
  });
});

// Heartbeat monitoring (check for stale drone connections)
setInterval(() => {
  const now = Date.now();
  const timeout = 10000; // 10 seconds
  
  connectedClients.drones.forEach((drone, id) => {
    if (now - drone.lastHeartbeat > timeout) {
      console.log(`[WARNING] Drone ${id} heartbeat timeout`);
      drone.socket.emit('warning', { message: 'Connection unstable' });
    }
  });
}, 5000);

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   Drone Control Server Running             ║
║   Port: ${PORT}                              ║
║   Environment: ${process.env.NODE_ENV || 'development'}              ║
║   Time: ${new Date().toLocaleString()}     ║
╚════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
