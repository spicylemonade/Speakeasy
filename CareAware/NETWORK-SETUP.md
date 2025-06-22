# 🌐 CareAware Network Setup Guide

## Quick Setup (3 Steps)

### 1. **Run Firewall Setup** (Run as Administrator)
```bash
# Right-click PowerShell -> "Run as Administrator"
.\setup-firewall.bat
```

### 2. **Auto-Configure Network IP**
```bash
.\setup-network.ps1
```

### 3. **Start Your Servers**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm start
```

## 🔥 Switch Users

Edit `frontend/src/App.js` and change:
```javascript
const currentUserId = 1; // Change this number
```

- `1` = Geby
- `2` = Connie  
- `3` = William

## 📱 Connect Other Devices

1. Make sure all devices are on the **same Wi-Fi/hotspot**
2. Open browser and go to: `http://YOUR_IP:3000`
3. Each person changes their `currentUserId` to be different users

## 🛠️ Manual Setup (if scripts don't work)

### Find Your IP:
```bash
ipconfig
```
Look for "IPv4 Address" (usually `192.168.x.x` or `10.0.x.x`)

### Update Config Manually:
Edit `frontend/src/config.js` and replace:
```javascript
return 'localhost'; // Replace with your IP
```

## 🚨 Troubleshooting

- **Can't connect?** → Check Windows Firewall
- **Posts not saving?** → Make sure backend is running on port 5000
- **Different users?** → Each device needs different `currentUserId` 