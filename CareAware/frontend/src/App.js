import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { getApiUrl } from './config';

// Components
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Feed from './components/Feed';
import Messages from './components/Messages';
import Profile from './components/Profile';
import Settings from './components/Settings';
import ComposePost from './components/ComposePost';
import CallPage from './components/CallPage';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Hardcoded current user ID
  const currentUserId = 1; // Geby

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(getApiUrl(`/api/users/${currentUserId}`));
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error fetching current user:", error);
        // Handle error, maybe show an error message
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [currentUserId]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading CareAware...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className={`app ${darkMode ? 'dark' : ''}`}>
        <Navbar 
          currentUser={currentUser}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard currentUser={currentUser} />} />
            <Route path="/feed" element={<Feed currentUser={currentUser} />} />
            <Route path="/messages" element={<Messages currentUser={currentUser} />} />
            <Route path="/profile" element={<Profile currentUser={currentUser} />} />
            <Route path="/profile/:userId" element={<Profile currentUser={currentUser} />} />
            <Route path="/settings" element={
              <Settings 
                currentUser={currentUser}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            } />
            <Route path="/compose" element={<ComposePost currentUser={currentUser} />} />
            <Route path="/call/:userId" element={<CallPage currentUser={currentUser} />} />
          </Routes>
        </div>
    </div>
    </Router>
  );
}

export default App;
