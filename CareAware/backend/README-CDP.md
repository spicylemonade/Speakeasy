# CareAware Social Media Scraping with Chrome DevTools Protocol (CDP)

This document explains how to use the new Chrome DevTools Protocol (CDP) approach for scraping social media data in CareAware.

## Why CDP?

The CDP approach is more reliable than launching a new browser instance because:
- **Uses your existing login sessions** - No need to handle authentication programmatically
- **More stable** - Connects to a browser you control
- **Better for debugging** - You can see exactly what's happening
- **Avoids detection** - Uses your real browser session

## Setup Instructions

### 1. Start Chrome in Debug Mode

#### Option A: Use the provided batch file (Windows)
```bash
# Double-click or run:
start-chrome-debug.bat
```

#### Option B: Manual command (Windows)
```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="%TEMP%\chrome-debug-profile"
```

#### Option C: MacOS
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir="/tmp/chrome-debug-profile"
```

#### Option D: Linux
```bash
google-chrome --remote-debugging-port=9222 --user-data-dir="/tmp/chrome-debug-profile"
```

### 2. Verify Chrome Debug Mode

Visit: http://localhost:9222/json/version

You should see a JSON response with Chrome version information.

### 3. Log in to X.com

1. In the Chrome instance you just started, navigate to https://x.com
2. Log in with your credentials
3. Navigate to any profile to test that you're logged in

### 4. Test the Scraper

#### Command Line Test
```bash
cd CareAware/backend
python scrape.py [twitter-username]
```

#### Via CareAware App
1. Start the backend server: `node server.js`
2. Open the CareAware frontend
3. Go to Settings → Platform Integration
4. Enter the Twitter username you want to scrape
5. Save settings - this will automatically trigger scraping

## Configuration

### Environment Variables

- `CDP_PORT`: Chrome DevTools Protocol port (default: 9222)

### Server Configuration

The backend automatically uses CDP when calling the scraper. No additional configuration needed.

## Troubleshooting

### "Could not connect to Chrome browser"
- Make sure Chrome is running with the `--remote-debugging-port=9222` flag
- Check that port 9222 is not blocked by firewall
- Try visiting http://localhost:9222/json/version to test the connection

### "It appears you are not logged in to X.com"
- Log in to X.com in the Chrome debug session
- Make sure you're not in incognito mode
- Clear browser cache and try again

### "No browser contexts found"
- Open at least one tab in the Chrome debug session
- Navigate to any webpage before running the scraper

### Chrome won't start in debug mode
- Close all existing Chrome instances first
- Check that Chrome is installed in the expected location
- Try using a different port: `--remote-debugging-port=9223`

## Security Notes

- The debug port (9222) allows full control over your browser
- Don't expose this port to external networks
- Close Chrome debug session when not needed
- Use a temporary user data directory to isolate from your main profile

## Advanced Usage

### Using a different port
```bash
# Start Chrome with custom port
chrome.exe --remote-debugging-port=9223

# Set environment variable for backend
set CDP_PORT=9223
node server.js
```

### Multiple browser sessions
You can run multiple Chrome instances with different ports:
```bash
chrome.exe --remote-debugging-port=9222 --user-data-dir="%TEMP%\chrome-session-1"
chrome.exe --remote-debugging-port=9223 --user-data-dir="%TEMP%\chrome-session-2"
```

## Files

- `scrape.py` - Main scraper using CDP
- `start-chrome-debug.bat` - Windows batch file to start Chrome in debug mode
- `server.js` - Backend API that calls the scraper
- `README-CDP.md` - This documentation

## Related Links

- [Chrome DevTools Protocol Documentation](https://chromedevtools.github.io/devtools-protocol/)
- [Playwright CDP Connection Docs](https://playwright.dev/docs/api/class-browsertype#browser-type-connect-over-cdp)
- [Stack Overflow: Connect to existing browser session](https://stackoverflow.com/questions/71251394/is-there-a-way-to-connect-to-my-existing-browser-session-using-playwright) 