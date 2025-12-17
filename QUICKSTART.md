# 🚀 Quick Start Guide

## Get the system running in 3 steps!

### Step 1: Install Dependencies

```powershell
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install drone client dependencies
cd ../drone-client
pip install socketio-client python-socketio
```

### Step 2: Start All Services

**Option A: Use the Start Script (Windows)**

```powershell
cd "d:\car with app"
powershell -ExecutionPolicy Bypass -File start.ps1
```

**Option B: Manual Start (Any OS)**

Open 3 separate terminals:

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

**Terminal 3 - Drone Client:**
```powershell
cd drone-client
python drone_client.py --simulator
```

### Step 3: Control Your Drone!

1. Open **http://localhost:3000** in your browser
2. Wait for "Drone-Alpha" to appear in the drone list
3. Click on the drone to select it
4. Use the joysticks to control!

## 🎮 Controls

### Left Joystick (Blue)
- **↑ Up**: Increase throttle (go up)
- **↓ Down**: Decrease throttle (go down)
- **← Left**: Yaw left (rotate left)
- **→ Right**: Yaw right (rotate right)

### Right Joystick (Green)
- **↑ Up**: Pitch forward (move forward)
- **↓ Down**: Pitch backward (move backward)
- **← Left**: Roll left (strafe left)
- **→ Right**: Roll right (strafe right)

### Safety Controls
- **Speed Limit Slider**: Adjust max speed (default 80%)
- **🛑 Emergency Stop**: Stop all motors immediately

## 📱 Mobile Access

To control from your phone:

1. Find your computer's IP address:
   ```powershell
   ipconfig
   ```
   Look for IPv4 Address (e.g., 192.168.1.100)

2. Update frontend config in `frontend/src/App.jsx`:
   ```javascript
   const SERVER_URL = 'http://192.168.1.100:3001';
   ```

3. Restart frontend:
   ```powershell
   cd frontend
   npm run dev
   ```

4. On your phone (same Wi-Fi), open:
   ```
   http://192.168.1.100:3000
   ```

## 🔧 Common Issues

### "No drones connected"
- Make sure drone client is running
- Check that it says "✓ Connected to server"
- Restart the drone client

### "Disconnected" status
- Check backend server is running (port 3001)
- Verify server URL in frontend matches backend
- Check firewall settings

### Joysticks not responding
- Click on a drone in the list to select it
- Check connection status is "Connected"
- Refresh the page

## 📊 What You Should See

**Backend Terminal:**
```
╔════════════════════════════════════════════╗
║   Drone Control Server Running             ║
║   Port: 3001                               ║
║   Environment: development                 ║
╚════════════════════════════════════════════╝
```

**Drone Client Terminal:**
```
══════════════════════════════════════════════════
🚁 DRONE CONTROL CLIENT
══════════════════════════════════════════════════
Server: http://localhost:3001
Drone: Drone-Alpha
Mode: SIMULATOR
══════════════════════════════════════════════════

✓ Connected to server at http://localhost:3001
✓ Registered as: Drone-Alpha
✓ Mode: SIMULATOR

✓ Drone client running. Press Ctrl+C to stop.

[MOTORS] FL:0 FR:0 RL:0 RR:0
```

**Web Interface:**
- Green "● Connected" indicator
- "Drone-Alpha" in the available drones list
- Telemetry showing battery, altitude, signal
- Two joysticks ready to use

## 🎯 Test Checklist

- [ ] Backend server starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] Drone client connects successfully
- [ ] Drone appears in web interface
- [ ] Can select drone (turns green)
- [ ] Joysticks respond to touch/mouse
- [ ] Motor values change in drone client terminal
- [ ] Telemetry updates (battery, altitude)
- [ ] Emergency stop works
- [ ] Speed limit slider adjusts control

## 🚁 On Actual Hardware (Raspberry Pi)

When ready to use real hardware:

1. Copy `drone-client/` folder to your Raspberry Pi

2. Install dependencies on Pi:
   ```bash
   pip3 install -r requirements.txt
   pip3 install RPi.GPIO
   ```

3. Update server URL:
   ```bash
   python3 drone_client.py --server http://YOUR_PC_IP:3001 --name "MyDrone"
   ```

4. **Safety First:**
   - Remove propellers for testing!
   - Test motor directions individually
   - Start with low speed limits (20%)
   - Have emergency stop ready

## 📝 Next Steps

Once the basic system works:

1. **Tune controls**: Adjust joystick sensitivity
2. **Add video**: Implement camera streaming
3. **Authentication**: Add user login
4. **GPS waypoints**: Autonomous navigation
5. **Flight modes**: Stabilize, altitude hold, etc.

## 💡 Tips

- Use Chrome/Edge for best performance
- Close other network-heavy apps
- Test on local Wi-Fi before internet
- Monitor battery in telemetry display
- Practice with simulator before real drone

## 🆘 Need Help?

Check the main README.md for:
- Detailed troubleshooting
- Configuration options
- Security recommendations
- Full architecture documentation

**Happy Flying! 🚁**
