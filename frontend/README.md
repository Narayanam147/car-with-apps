# Frontend README

React PWA for real-time drone control with virtual joystick interface.

## Features

- 🎮 Dual virtual joysticks for flight control
- 📊 Real-time telemetry display
- 🔌 WebSocket connection with Socket.IO
- 📱 Responsive design (mobile + desktop)
- 🚨 Emergency stop button
- ⚙️ Speed limiting controls
- 🎨 Modern glassmorphic UI

## Installation

```powershell
npm install
```

## Development

```powershell
npm run dev
```

Runs on **http://localhost:3000**

## Production Build

```powershell
npm run build
npm run preview
```

## Configuration

Edit `src/App.jsx`:

```javascript
const SERVER_URL = 'http://localhost:3001'; // Backend server URL
```

For production, change to your server's IP:
```javascript
const SERVER_URL = 'http://192.168.1.100:3001';
```

## PWA Features

The app is installable as a Progressive Web App:
- Works offline (cached assets)
- Add to home screen on mobile
- Full-screen mode on mobile
- Push notifications (future)

## Controls

### Left Joystick
- **Up/Down**: Throttle (altitude)
- **Left/Right**: Yaw (rotation)

### Right Joystick
- **Up/Down**: Pitch (forward/back)
- **Left/Right**: Roll (left/right)

### Settings
- **Speed Limit Slider**: Reduces max control output (safety)
- **Emergency Stop**: Immediately stops all motors

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Mobile Usage

1. Connect phone to same Wi-Fi as backend server
2. Navigate to `http://[server-ip]:3000`
3. Add to home screen for app-like experience
4. Control drone with touch joysticks

## Troubleshooting

### Can't Connect to Server

1. Check server is running on port 3001
2. Verify `SERVER_URL` matches backend address
3. Check firewall/network settings
4. Try `http://` (not `https://`) for local networks

### Joysticks Not Responsive

1. Refresh the page
2. Check browser console for errors
3. Try different browser
4. Ensure JavaScript is enabled

### UI Too Small/Large on Mobile

- Adjust browser zoom
- Check viewport meta tag in `index.html`
- Clear browser cache

## Dependencies

- **react** 18.2.0 - UI framework
- **socket.io-client** 4.6.1 - WebSocket client
- **react-joystick-component** 6.1.0 - Virtual joystick
- **vite** 5.0.12 - Build tool
- **vite-plugin-pwa** 0.17.5 - PWA support

## File Structure

```
src/
├── App.jsx        # Main component (controls + UI)
├── App.css        # Styles
├── main.jsx       # Entry point
└── index.css      # Global styles

index.html         # HTML template
vite.config.js     # Vite configuration
package.json       # Dependencies
```

## Customization

### Change Colors

Edit `src/App.css`:
```css
.status-indicator.connected {
  background: rgba(16, 185, 129, 0.2);  /* Change this */
  color: #10b981;                        /* And this */
}
```

### Adjust Joystick Sensitivity

Edit `src/App.jsx`:
```javascript
const limitedSpeed = speedLimit / 100; // Adjust multiplier
joystickRef.current.throttle = Math.round(stick.y * 100 * limitedSpeed);
```

### Change Command Rate

```javascript
// Current: 50ms = 20Hz
commandIntervalRef.current = setInterval(() => {
  // ... send commands
}, 50); // Change this value
```

## Performance

- Command rate: 20 Hz (50ms interval)
- Telemetry rate: 2 Hz (500ms interval)
- Typical latency: 10-50ms (local network)

## Security Notes

⚠️ **Current version is for development/testing only**

For production:
1. Add authentication (JWT tokens)
2. Use HTTPS/WSS
3. Restrict CORS origins
4. Add rate limiting
5. Validate all inputs

## License

MIT
