# 📱 Mobile Preview Guide

This guide will help you preview your Finance Tracker app on your phone and ensure it works on all devices.

## 🚀 Quick Start - Preview on Phone

### Method 1: Local Network (Same WiFi) - Recommended

1. **Find your computer's local IP address:**

   **On macOS:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   Look for something like `192.168.1.xxx` or `10.0.0.xxx`

   **On Windows:**
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" under your active network adapter

   **On Linux:**
   ```bash
   hostname -I
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **On your phone:**
   - Make sure your phone is connected to the **same WiFi network** as your computer
   - Open your phone's browser (Safari on iPhone, Chrome on Android)
   - Navigate to: `http://YOUR_IP_ADDRESS:5173`
   - Example: `http://192.168.1.100:5173`

### Method 2: Using ngrok (For testing from anywhere)

1. **Install ngrok:**
   ```bash
   # macOS
   brew install ngrok
   
   # Or download from https://ngrok.com/
   ```

2. **Start your dev server:**
   ```bash
   npm run dev
   ```

3. **In another terminal, start ngrok:**
   ```bash
   ngrok http 5173
   ```

4. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`) and open it on your phone

### Method 3: Browser DevTools (Quick Testing)

1. **Open Chrome DevTools** (F12 or Cmd+Option+I)
2. **Click the device toggle** (or press Cmd+Shift+M)
3. **Select a device** from the dropdown (iPhone, iPad, etc.)
4. **Test responsive design** by resizing the viewport

## 🔧 Configuration Details

### Vite Dev Server
- Configured to accept connections from any network interface (`host: true`)
- Default port: `5173`
- API proxy: `/api` → `http://localhost:3000`

### Server Configuration
- Backend runs on port `3000`
- CORS enabled for development
- Accepts connections from any origin in development mode

## 📱 Testing Checklist

### iPhone/iOS Testing:
- [ ] Test on Safari browser
- [ ] Test "Add to Home Screen" functionality
- [ ] Verify safe area insets (notched devices)
- [ ] Test touch interactions
- [ ] Verify no zoom on input focus
- [ ] Test in portrait and landscape modes

### Android Testing:
- [ ] Test on Chrome browser
- [ ] Test "Add to Home Screen" functionality
- [ ] Verify touch targets (minimum 44x44px)
- [ ] Test responsive layouts
- [ ] Verify smooth scrolling

### Cross-Device Testing:
- [ ] Test on different screen sizes
- [ ] Verify responsive breakpoints
- [ ] Test on tablets (iPad, Android tablets)
- [ ] Verify PWA functionality
- [ ] Test offline behavior (if service worker added)

## 🛠️ Troubleshooting

### Can't connect from phone?

1. **Check firewall settings:**
   - macOS: System Preferences → Security & Privacy → Firewall
   - Windows: Windows Defender Firewall
   - Allow connections on port 5173

2. **Verify same network:**
   - Both devices must be on the same WiFi network
   - Check router settings if using guest network

3. **Try using IP address instead of localhost:**
   - Use your computer's local IP (e.g., `192.168.1.100:5173`)
   - Not `localhost:5173` or `127.0.0.1:5173`

4. **Check if ports are in use:**
   ```bash
   # macOS/Linux
   lsof -i :5173
   lsof -i :3000
   
   # Windows
   netstat -ano | findstr :5173
   ```

### API calls failing?

- Make sure both frontend (5173) and backend (3000) are running
- Check browser console for CORS errors
- Verify proxy configuration in `vite.config.js`

## 🌐 Production Deployment

For production deployment to work on all devices:

1. **Deploy to a hosting service:**
   - Vercel, Netlify, Heroku, Railway, etc.
   - The app will be accessible via HTTPS URL

2. **Update environment variables:**
   - Set `NODE_ENV=production`
   - Configure CORS origins
   - Set up database (if using cloud database)

3. **Build the app:**
   ```bash
   npm run build
   npm start
   ```

## 📝 Notes

- The app is configured with responsive design and mobile optimizations
- PWA support is enabled for "Add to Home Screen" functionality
- Safe area insets are configured for notched devices
- Touch interactions are optimized for mobile devices

## 🔗 Useful Links

- [Vite Dev Server Config](https://vitejs.dev/config/server-options.html)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [iOS Safari Web App](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)

