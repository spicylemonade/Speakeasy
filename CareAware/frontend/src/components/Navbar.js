import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from './Icon';

const Navbar = ({ currentUser, darkMode, toggleDarkMode }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        <div className="logo">CA</div>
        CareAware
      </Link>
      
      <ul className="navbar-nav">
        <li>
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <Icon name="dashboard" size={16} />
            Dashboard
          </Link>
        </li>
        <li>
          <Link 
            to="/feed" 
            className={`nav-link ${isActive('/feed') ? 'active' : ''}`}
          >
            <Icon name="feed" size={16} />
            Feed
          </Link>
        </li>
        <li>
          <Link 
            to="/messages" 
            className={`nav-link ${isActive('/messages') ? 'active' : ''}`}
          >
            <Icon name="messages" size={16} />
            Messages
          </Link>
        </li>
        <li>
          <Link 
            to="/profile" 
            className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
          >
            <Icon name="profile" size={16} />
            Profile
          </Link>
        </li>
        <li>
          <Link 
            to="/settings" 
            className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
          >
            <Icon name="settings" size={16} />
            Settings
          </Link>
        </li>
      </ul>

      <div className="navbar-user">
        <button 
          className="theme-toggle"
          onClick={toggleDarkMode}
          title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        >
          <Icon name={darkMode ? 'sun' : 'moon'} size={16} />
        </button>
        <Link to="/profile">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name}
            className="user-avatar"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar; 