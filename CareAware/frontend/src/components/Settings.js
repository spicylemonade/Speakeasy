import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import { API_BASE_URL } from '../config';

const Settings = () => {
  const [privacySettings, setPrivacySettings] = useState([
    { id: 'reddit', label: 'Reddit Integration', description: 'Analyze Reddit posts and comments for emotional context.', enabled: true, icon: 'reddit', username: '' },
    { id: 'instagram', label: 'Instagram Integration', description: 'Monitor Instagram stories and posts for mood indicators.', enabled: true, icon: 'instagram', username: '' },
    { id: 'twitter', label: 'Twitter/X Integration', description: 'Monitor tweets and interactions for emotional insights.', enabled: false, icon: 'twitter', username: '' },
    { id: 'discord', label: 'Discord Integration', description: 'Analyze Discord messages and activity patterns.', enabled: false, icon: 'discord', username: '' },
    { id: 'smartwatch', label: 'Smartwatch Integration', description: 'Connect biometric data for enhanced emotional insights.', enabled: true, icon: 'watch', username: '' },
  ]);

  const [notifications, setNotifications] = useState({
    empathyAlerts: true,
    newMessages: true,
    supportRequests: true,
    weeklyInsights: true,
    biometricWarnings: true
  });

  const [savedMessage, setSavedMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSetting, setCurrentSetting] = useState(null);
  const [integrationUsername, setIntegrationUsername] = useState('');
  const [user, setUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Mock fetching user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      // In a real app, you'd get the logged-in user's ID. We'll use user 1 (Geby).
      const userId = 1;
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
        const userData = await response.json();
        setUser(userData); // Save the full user object
        if (userData.integrationSettings) {
          setPrivacySettings(prevSettings =>
            prevSettings.map(setting => ({
              ...setting,
              username: userData.integrationSettings[setting.id]?.username || ''
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch user settings:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleOpenModal = (setting) => {
    if (setting.id === 'smartwatch') return; // Don't open modal for smartwatch
    setCurrentSetting(setting);
    setIntegrationUsername(setting.username || '');
    setIsModalOpen(true);
  };

  const handleSaveUsername = async () => {
    if (!currentSetting || !user || isSaving) return;
    
    setIsSaving(true);

    try {
      // Step 1: Save the integration username
      const saveSettingsResponse = await fetch(`${API_BASE_URL}/api/users/${user.id}/integration-settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          integrationId: currentSetting.id,
          username: integrationUsername,
        }),
      });

      if (!saveSettingsResponse.ok) {
        throw new Error('Failed to save username');
      }
      
      console.log(`Settings saved for ${currentSetting.label}.`);
      
      // Update local state immediately for responsiveness
      setPrivacySettings(prevSettings =>
        prevSettings.map(s =>
          s.id === currentSetting.id ? { ...s, username: integrationUsername, enabled: true } : s
        )
      );

      // Step 2: Trigger the scraping process
      if (currentSetting.id === 'twitter') { // Only scrape for Twitter for now
        console.log(`Triggering scrape for CareAware user: ${user.username}`);
        const scrapeResponse = await fetch(`${API_BASE_URL}/api/scrape/${user.username}`, {
          method: 'POST',
        });

        if (!scrapeResponse.ok) {
          throw new Error('Scraping process failed to start.');
        }
        console.log('Scraping initiated successfully.');
      }
      
      // Step 3: Close modal on success
      setIsModalOpen(false);

    } catch (error) {
      console.error("Error during save/scrape process:", error);
      // Optionally, show an error message to the user here
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (id) => {
    setPrivacySettings(
      privacySettings.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
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
      {isModalOpen && currentSetting && (
        <>
          <style>{`
            .modal-backdrop {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.75);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 1000;
              backdrop-filter: blur(5px);
            }
            .modal-content {
              background-color: var(--background-color-offset);
              padding: var(--space-xl);
              border-radius: 16px;
              width: 90%;
              max-width: 400px;
              box-shadow: 0 8px 30px rgba(0,0,0,0.25);
              border: 1px solid var(--border-color);
            }
            .modal-header {
              margin-bottom: var(--space-lg);
            }
            .modal-header h3 {
              margin: 0;
              color: var(--text-primary);
            }
            .modal-body .form-group {
              margin-bottom: var(--space-lg);
            }
            .modal-footer {
              display: flex;
              justify-content: flex-end;
              gap: var(--space-md);
            }
          `}</style>
          <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{currentSetting.label}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
                  Enter your username for this platform.
                </p>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-input"
                    value={integrationUsername}
                    onChange={(e) => setIntegrationUsername(e.target.value)}
                    placeholder={currentSetting.id === 'twitter' ? '@username' : 'username'}
                    autoFocus
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn" onClick={() => setIsModalOpen(false)} disabled={isSaving}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveUsername} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <div style={{ padding: '0 var(--space-lg)' }}>
        {/* Account Settings */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Icon name="profile" /> Account
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
            <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--text-secondary)' }}>
              Manage what information you share and how it's used to power your empathy insights. Your privacy is our priority.
            </p>
            {privacySettings.map(setting => (
              <div className="privacy-toggle" key={setting.id} onClick={() => handleOpenModal(setting)} style={{ cursor: setting.id === 'smartwatch' ? 'default' : 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)', flexGrow: 1 }}>
                  <Icon name={setting.icon} size={24} />
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)' }}>{setting.label}</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>{setting.description}</p>
                    {setting.username && (
                       <p style={{ margin: '4px 0 0 0', color: 'var(--accent-color-secondary)', fontSize: 'var(--font-size-sm)', fontWeight: '500' }}>
                         Username: {setting.username}
                       </p>
                    )}
                  </div>
                </div>
                <div
                  className={`toggle-switch ${setting.enabled ? 'active' : ''}`}
                  onClick={(e) => {
                      e.stopPropagation(); // Prevent modal from opening when clicking toggle
                      handleToggle(setting.id);
                  }}
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
            <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--text-secondary)' }}>
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