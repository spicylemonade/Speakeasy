@echo off
echo Setting up Windows Firewall for CareAware...

REM Add firewall rules for Node.js backend (port 5000)
netsh advfirewall firewall add rule name="CareAware Backend" dir=in action=allow protocol=TCP localport=5000

REM Add firewall rules for React frontend (port 3000)  
netsh advfirewall firewall add rule name="CareAware Frontend" dir=in action=allow protocol=TCP localport=3000

echo.
echo ✅ Firewall rules added successfully!
echo.
echo Your friends can now connect to:
echo   Frontend: http://YOUR_IP:3000
echo   Backend:  http://YOUR_IP:5000
echo.
echo Run the network setup script next: .\setup-network.ps1
pause 