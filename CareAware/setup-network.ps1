# CareAware Network Setup Script
# This script finds your network IP and updates the config for multi-device access

Write-Host "[...] Finding your network IP address..." -ForegroundColor Green

# Get network adapters and find the active one
$networkAdapters = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
    $_.IPAddress -ne "127.0.0.1" -and 
    $_.IPAddress -notlike "169.254.*" -and
    $_.PrefixOrigin -eq "Dhcp"
}

# Try to find the best IP (usually starts with 192.168 or 10.0)
$bestIP = $networkAdapters | Where-Object { 
    $_.IPAddress -like "192.168.*" -or 
    $_.IPAddress -like "10.0.*" -or 
    $_.IPAddress -like "172.16.*" 
} | Select-Object -First 1

if (-not $bestIP) {
    $bestIP = $networkAdapters | Select-Object -First 1
}

if ($bestIP) {
    $networkIP = $bestIP.IPAddress
    Write-Host "[OK] Found network IP: $networkIP" -ForegroundColor Green
    
    # Update the config file
    $configPath = "frontend\src\config.js"
    if (Test-Path $configPath) {
        $configContent = Get-Content $configPath -Raw
        # A more robust way to replace the IP address
        $newConfigContent = $configContent -replace "'localhost'", "'$networkIP'"
        Set-Content $configPath $newConfigContent
        Write-Host "[OK] Updated config.js with IP: $networkIP" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Could not find config.js file" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host ">> Setup Complete!" -ForegroundColor Cyan
    Write-Host "Your friends can now access the app at:" -ForegroundColor Yellow
    Write-Host "http://$networkIP:3000" -ForegroundColor White
    Write-Host ""
    Write-Host "[NOTE] Make sure all devices are connected to the same network/hotspot!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "[TIP] To switch users, change currentUserId in App.js:" -ForegroundColor Cyan
    Write-Host "   1 = Geby" -ForegroundColor White
    Write-Host "   2 = Connie" -ForegroundColor White
    Write-Host "   3 = William" -ForegroundColor White
    
} else {
    Write-Host "[ERROR] Could not detect network IP address" -ForegroundColor Red
    Write-Host "[INFO] You can manually find your IP by running: ipconfig" -ForegroundColor Yellow
    Write-Host "[INFO] Look for 'IPv4 Address' under your active network adapter" -ForegroundColor Yellow
} 