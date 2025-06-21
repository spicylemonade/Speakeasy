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
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div className="card-header" style={{ marginBottom: '2rem' }}>
        <h1>Settings & Privacy</h1>
        <p>Manage your data sources, privacy controls, and notification preferences</p>
      </div>

      {savedMessage && (
        <div className="alert alert-success" style={{ marginBottom: '2rem' }}>
          <Icon name="checkCircle" size={16} style={{ marginRight: '0.5rem' }} />
          {savedMessage}
        </div>
      )}

      {/* Data Sources */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="card-title">
          <Icon name="shield" size={20} />
          Data Sources & Privacy
        </h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Control which platforms CareAware can analyze to provide empathy insights. 
          All data analysis happens locally and privately.
        </p>

        <div className="privacy-toggle">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Icon name="reddit" size={18} />
              <strong>Reddit Integration</strong>
            </div>
            <small style={{ color: 'var(--text-muted)' }}>
              Analyze Reddit posts and comments for emotional context
            </small>
          </div>
          <div
            className={`toggle-switch ${privacySettings.reddit ? 'active' : ''}`}
            onClick={() => handlePrivacyChange('reddit')}
          />
        </div>

        <div className="privacy-toggle">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Icon name="instagram" size={18} />
              <strong>Instagram Integration</strong>
            </div>
            <small style={{ color: 'var(--text-muted)' }}>
              Monitor Instagram stories and posts for mood indicators
            </small>
          </div>
          <div
            className={`toggle-switch ${privacySettings.instagram ? 'active' : ''}`}
            onClick={() => handlePrivacyChange('instagram')}
          />
        </div>

        <div className="privacy-toggle">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Icon name="discord" size={18} />
              <strong>Discord Integration</strong>
            </div>
            <small style={{ color: 'var(--text-muted)' }}>
              Analyze Discord messages and activity patterns
            </small>
          </div>
          <div
            className={`toggle-switch ${privacySettings.discord ? 'active' : ''}`}
            onClick={() => handlePrivacyChange('discord')}
          />
        </div>

        <div className="privacy-toggle">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Icon name="watch" size={18} />
              <strong>Smartwatch Integration</strong>
            </div>
            <small style={{ color: 'var(--text-muted)' }}>
              Connect biometric data for enhanced emotional insights
            </small>
          </div>
          <div
            className={`toggle-switch ${privacySettings.smartwatch ? 'active' : ''}`}
            onClick={() => handlePrivacyChange('smartwatch')}
          />
        </div>
      </div>

      {/* AI Features */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="card-title">
          <Icon name="ai" size={20} />
          AI Features
        </h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Configure how CareAware's AI assists you in social interactions.
        </p>

        <div className="privacy-toggle">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Icon name="heartbeat" size={18} />
              <strong>Biometric Data Analysis</strong>
            </div>
            <small style={{ color: 'var(--text-muted)' }}>
              Use heart rate and stress levels for conversation insights
            </small>
          </div>
          <div
            className={`toggle-switch ${privacySettings.biometricData ? 'active' : ''}`}
            onClick={() => handlePrivacyChange('biometricData')}
          />
        </div>

        <div className="privacy-toggle">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Icon name="ai" size={18} />
              <strong>Real-time AI Analysis</strong>
            </div>
            <small style={{ color: 'var(--text-muted)' }}>
              Analyze messages as you type for empathy insights
            </small>
          </div>
          <div
            className={`toggle-switch ${privacySettings.aiAnalysis ? 'active' : ''}`}
            onClick={() => handlePrivacyChange('aiAnalysis')}
          />
        </div>

        <div className="privacy-toggle">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Icon name="alert" size={18} />
              <strong>Empathy Alerts</strong>
            </div>
            <small style={{ color: 'var(--text-muted)' }}>
              Get warnings about sensitive topics and emotional states
            </small>
          </div>
          <div
            className={`toggle-switch ${privacySettings.empathyAlerts ? 'active' : ''}`}
            onClick={() => handlePrivacyChange('empathyAlerts')}
          />
        </div>

        <div className="privacy-toggle">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Icon name="lightbulb" size={18} />
              <strong>Conversation Suggestions</strong>
            </div>
            <small style={{ color: 'var(--text-muted)' }}>
              Receive AI-powered conversation starters and topics
            </small>
          </div>
          <div
            className={`toggle-switch ${privacySettings.conversationSuggestions ? 'active' : ''}`}
            onClick={() => handlePrivacyChange('conversationSuggestions')}
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="card-title">
          <Icon name="bell" size={20} />
          Notifications
        </h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Choose which notifications you'd like to receive.
        </p>

        <div className="privacy-toggle">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Icon name="empathy" size={18} />
              <strong>Empathy Alerts</strong>
            </div>
            <small style={{ color: 'var(--text-muted)' }}>
              Notifications about friends who might need support
            </small>
          </div>
          <div
            className={`toggle-switch ${notifications.empathyAlerts ? 'active' : ''}`}
            onClick={() => handleNotificationChange('empathyAlerts')}
          />
        </div>

        <div className="privacy-toggle">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Icon name="messages" size={18} />
              <strong>New Messages</strong>
            </div>
            <small style={{ color: 'var(--text-muted)' }}>
              Push notifications for new direct messages
            </small>
          </div>
          <div
            className={`toggle-switch ${notifications.newMessages ? 'active' : ''}`}
            onClick={() => handleNotificationChange('newMessages')}
          />
        </div>

        <div className="privacy-toggle">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Icon name="support" size={18} />
              <strong>Support Requests</strong>
            </div>
            <small style={{ color: 'var(--text-muted)' }}>
              When someone reaches out for help or support
            </small>
          </div>
          <div
            className={`toggle-switch ${notifications.supportRequests ? 'active' : ''}`}
            onClick={() => handleNotificationChange('supportRequests')}
          />
        </div>

        <div className="privacy-toggle">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Icon name="barChart" size={18} />
              <strong>Weekly Insights</strong>
            </div>
            <small style={{ color: 'var(--text-muted)' }}>
              Weekly summary of your empathy score and social interactions
            </small>
          </div>
          <div
            className={`toggle-switch ${notifications.weeklyInsights ? 'active' : ''}`}
            onClick={() => handleNotificationChange('weeklyInsights')}
          />
        </div>

        <div className="privacy-toggle">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Icon name="watch" size={18} />
              <strong>Biometric Warnings</strong>
            </div>
            <small style={{ color: 'var(--text-muted)' }}>
              Alerts when stress levels are high during social interactions
            </small>
          </div>
          <div
            className={`toggle-switch ${notifications.biometricWarnings ? 'active' : ''}`}
            onClick={() => handleNotificationChange('biometricWarnings')}
          />
        </div>
      </div>

      {/* Appearance */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="card-title">
          <Icon name={darkMode ? 'moon' : 'sun'} size={20} />
          Appearance
        </h3>
        
        <div className="privacy-toggle">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Icon name={darkMode ? 'moon' : 'sun'} size={18} />
              <strong>Dark Mode</strong>
            </div>
            <small style={{ color: 'var(--text-muted)' }}>
              Switch between light and dark themes
            </small>
          </div>
          <div
            className={`toggle-switch ${darkMode ? 'active' : ''}`}
            onClick={toggleDarkMode}
          />
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="card-title">
          <Icon name="lock" size={20} />
          Data & Privacy
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ 
            padding: '1rem', 
            background: 'var(--bg-secondary)', 
            borderRadius: '8px',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Icon name="shield" size={16} color="var(--empathy-green)" />
              <strong>Local Processing</strong>
            </div>
            <small style={{ color: 'var(--text-muted)' }}>
              All AI analysis happens on your device. Your personal data never leaves your computer.
            </small>
          </div>
          
          <div style={{ 
            padding: '1rem', 
            background: 'var(--bg-secondary)', 
            borderRadius: '8px',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Icon name="eye" size={16} color="var(--primary-orange)" />
              <strong>Data Usage</strong>
            </div>
            <small style={{ color: 'var(--text-muted)' }}>
              We only access public posts and never store your social media credentials.
            </small>
          </div>

          <div style={{ 
            padding: '1rem', 
            background: 'var(--bg-secondary)', 
            borderRadius: '8px',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Icon name="lock" size={16} color="var(--deep-teal)" />
              <strong>Secure Connection</strong>
            </div>
            <small style={{ color: 'var(--text-muted)' }}>
              All connections are encrypted and your biometric data is anonymized.
            </small>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ textAlign: 'center' }}>
        <button 
          className="btn btn-primary"
          onClick={saveSettings}
          style={{ minWidth: '200px' }}
        >
          <Icon name="check" size={16} />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;