@echo off
echo Starting Chrome in debug mode for Playwright CDP connection...
echo.

REM Try different Chrome installation paths
set CHROME_PATH1="C:\Program Files\Google\Chrome\Application\chrome.exe"
set CHROME_PATH2="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

if exist %CHROME_PATH1% (
    echo Found Chrome at: %CHROME_PATH1%
    start "" %CHROME_PATH1% --remote-debugging-port=9222 --user-data-dir="%TEMP%\chrome-debug-profile"
    goto :success
)

if exist %CHROME_PATH2% (
    echo Found Chrome at: %CHROME_PATH2%
    start "" %CHROME_PATH2% --remote-debugging-port=9222 --user-data-dir="%TEMP%\chrome-debug-profile"
    goto :success
)

echo ERROR: Chrome not found at expected locations
echo Please install Google Chrome or update the paths in this script
goto :end

:success
echo.
echo Chrome started in debug mode!
echo.
echo Next steps:
echo 1. Go to X.com and log in to your account
echo 2. Navigate to the profile you want to scrape
echo 3. Test the connection by visiting: http://localhost:9222/json/version
echo 4. Run the scraper: python scrape.py [username]
echo.

:end
pause 