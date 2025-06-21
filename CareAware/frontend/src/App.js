import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Feed from './components/Feed';
import Messages from './components/Messages';
import Profile from './components/Profile';
import Settings from './components/Settings';
import ComposePost from './components/ComposePost';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  
  // Mock current user data
  const currentUser = {
    id: 2,
    name: "Alex Chen",
    username: "alex_c",
    avatar: "https://i.pravatar.cc/100?img=2"
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

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
            <Route path="/settings" element={
              <Settings 
                currentUser={currentUser}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            } />
            <Route path="/compose" element={<ComposePost currentUser={currentUser} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
