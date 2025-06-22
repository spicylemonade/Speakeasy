// Auto-detect network IP for API calls
const getNetworkIP = () => {
  // Try to get the local network IP
  // This will work when accessing from other devices on the same network
  const hostname = window.location.hostname;
  
  // If accessing via localhost, try to detect network IP
  if (hostname === '10.0.0.145' || hostname === '127.0.0.1') {
    // For development, you can manually set your IP here
    // Find your IP by running: ipconfig (Windows) or ifconfig (Mac/Linux)
    // Look for something like 192.168.x.x or 10.0.x.x
    return '10.0.0.145'; // Will be replaced by actual IP when needed
  }
  
  return hostname;
};

const API_HOST = getNetworkIP();
const API_PORT = '5000';

export const API_BASE_URL = `http://${API_HOST}:${API_PORT}`;

// Helper function to get full API endpoint
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

// Export for easy debugging
export const config = {
  API_HOST,
  API_PORT,
  API_BASE_URL
};

console.log('CareAware API Config:', config); 
