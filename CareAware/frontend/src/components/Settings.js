import React, { useState } from 'react';
import Icon from './Icon';

const Settings = ({ currentUser, darkMode, toggleDarkMode }) => {
  const [privacySettings, setPrivacySettings] = useState({
    reddit: true,
    instagram: true,
    discord: false,
    smartwatch: true,
    biometricData: true,
    aiAnalysis: true,
    empathyAlerts: true,
    conversationSuggestions: true
  });

  const [notifications, setNotifications] = useState({
    empathyAlerts: true,
    newMessages: true,
    supportRequests: true,
    weeklyInsights: true,
    biometricWarnings: true
  });

  const [savedMessage, setSavedMessage] = useState('');

  const handlePrivacyChange = (setting) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleNotificationChange = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const saveSettings = () => {
    // Simulate saving settings
    setSavedMessage('Settings saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div className="main-column">
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <div style={{ padding: '0 var(--space-lg)' }}>
        {/* Account Settings */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Icon name="user" /> Account
            </h3>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input type="text" className="form-input" defaultValue="alex_c" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" defaultValue="alex.chen@example.com" />
            </div>
            <button className="btn btn-primary">Save Changes</button>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Icon name="shield" /> Privacy and Data
            </h3>
          </div>
          <div className="card-body">
            <p className="text-secondary" style={{ marginBottom: 'var(--space-lg)' }}>
              Manage what information you share and how it's used to power your empathy insights. Your privacy is our priority.
            </p>
            {privacySettings.map(setting => (
              <div className="privacy-toggle" key={setting.id}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0' }}>{setting.label}</h4>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>{setting.description}</p>
                </div>
                <div
                  className={`toggle-switch ${setting.enabled ? 'active' : ''}`}
                  onClick={() => handleToggle(setting.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Icon name="bell" /> Notifications
            </h3>
          </div>
          <div className="card-body">
            <p className="text-secondary" style={{ marginBottom: 'var(--space-lg)' }}>
              Choose which notifications you want to receive to stay informed without feeling overwhelmed.
            </p>
            <div className="form-group">
              <label className="form-label">Empathy Alerts</label>
              <select className="form-input">
                <option>Real-time</option>
                <option>Summarized Digest</option>
                <option>Off</option>
              </select>
            </div>
             <div className="form-group">
              <label className="form-label">Biometric Warnings</label>
              <select className="form-input">
                <option>On</option>
                <option>Off</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;