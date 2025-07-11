import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { getApiUrl } from '../config';

const Dashboard = ({ currentUser }) => {
  const [insights, setInsights] = useState([]);
  const [smartwatchData, setSmartwatchData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchSmartwatchData, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [currentUser]);

  const fetchDashboardData = async () => {
    try {
      // Fetch recent activity insights
      const mockInsights = [
        {
          type: 'empathy_alert',
          title: 'Recent Activity Alert',
          message: 'Maddy has been posting about difficult times on social media. Consider reaching out with support.',
          severity: 'high',
          user: 'Maddy Johnson',
          timestamp: new Date().toISOString()
        },
        {
          type: 'conversation_starter',
          title: 'Conversation Opportunity',
          message: 'Sarah posted about her hiking trip. This could be a great conversation starter!',
          severity: 'low',
          user: 'Sarah Williams',
          timestamp: new Date().toISOString()
        },
        {
          type: 'biometric_alert',
          title: 'Wellness Check',
          message: 'Your heart rate has been elevated today. Consider taking breaks between social interactions.',
          severity: 'medium',
          user: 'You',
          timestamp: new Date().toISOString()
        }
      ];

      setInsights(mockInsights);
      setRecentActivity([
        { action: 'Received empathy alert for Maddy', time: '2 minutes ago', type: 'alert' },
        { action: 'Suggested conversation starter for Sarah', time: '15 minutes ago', type: 'suggestion' },
        { action: 'Biometric data updated', time: '30 minutes ago', type: 'biometric' },
        { action: 'New message from Alex', time: '1 hour ago', type: 'message' }
      ]);

      await fetchSmartwatchData();
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const fetchSmartwatchData = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(getApiUrl(`/api/smartwatch/${currentUser.id}`));
      if (!response.ok) {
        throw new Error('Failed to fetch smartwatch data');
      }
      const data = await response.json();
      
      // Format the data for the UI
      const formattedData = {
        heartRate: data.heartRate,
        stressLevel: data.stressLevel,
        activity: data.activity,
        timestamp: data.timestamp,
        batteryLevel: data.batteryLevel,
        mood: data.stressLevel === 'high' ? 'stressed' : 
              data.stressLevel === 'medium' ? 'focused' : 'calm',
        temperature: data.temperature,
        humidity: data.humidity,
        isRealData: data.isRealData || false,
        alerts: data.alerts || []
      };
      
      setSmartwatchData(formattedData);
    } catch (error) {
      console.error('Error fetching smartwatch data:', error);
      // Fallback to basic mock data on error
      setSmartwatchData({
        heartRate: 75,
        stressLevel: 'low',
        activity: 'sitting',
        timestamp: new Date().toISOString(),
        batteryLevel: 85,
        mood: 'calm',
        isRealData: false,
        alerts: []
      });
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'empathy_alert': return 'alert';
      case 'conversation_starter': return 'lightbulb';
      case 'biometric_alert': return 'watch';
      default: return 'bell';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'alert': return 'alert';
      case 'suggestion': return 'lightbulb';
      case 'biometric': return 'heartbeat';
      case 'message': return 'messages';
      default: return 'bell';
    }
  };

  const getStressLevelColor = (level) => {
    switch (level) {
      case 'high': return '#FF5722';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="main-content">
        <div className="page-header">
          <h1>Welcome back, {currentUser.name}!</h1>
          <p>Here's your mental health-aware social overview for today.</p>
        </div>

        {/* Quick Actions */}
        <div className="stats-grid">
          <Link to="/compose" className="stat-card" style={{ textDecoration: 'none' }}>
            <Icon name="compose" size={24} color="var(--primary)" />
            <div className="stat-label">Create Post</div>
          </Link>
          <Link to="/messages" className="stat-card" style={{ textDecoration: 'none' }}>
            <Icon name="messages" size={24} color="var(--info)" />
            <div className="stat-label">Messages</div>
          </Link>
          <Link to="/feed" className="stat-card" style={{ textDecoration: 'none' }}>
            <Icon name="feed" size={24} color="var(--success)" />
            <div className="stat-label">Browse Feed</div>
          </Link>
          <Link to="/profile" className="stat-card" style={{ textDecoration: 'none' }}>
            <Icon name="profile" size={24} color="var(--warning)" />
            <div className="stat-label">Profile</div>
          </Link>
        </div>

        {/* AI Insights */}
        <div className="card ai-insights" style={{ padding: 'var(--space-md)' }}>
          <h3 className="card-title">
            <Icon name="ai" size={20} />
            AI Insights & Alerts
          </h3>
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <div key={index} className="insight-item">
                <div className="insight-type">
                  <Icon name={getInsightIcon(insight.type)} size={16} />
                  {insight.type.replace('_', ' ').toUpperCase()}
                </div>
                <h4>{insight.title}</h4>
                <p>{insight.message}</p>
                <small>Regarding: {insight.user} • {new Date(insight.timestamp).toLocaleTimeString()}</small>
              </div>
            ))
          ) : (
            <p>No new insights at the moment. Keep connecting mindfully!</p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card" style={{ padding: 'var(--space-md)' }}>
          <h3 className="card-title">
            <Icon name="barChart" size={20} />
            Recent Activity
          </h3>
          <div>
            {recentActivity.map((activity, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                padding: '0.75rem',
                borderBottom: index < recentActivity.length - 1 ? '1px solid var(--border-primary)' : 'none',
                transition: 'all 0.2s ease'
              }}>
                <Icon name={getActivityIcon(activity.type)} size={18} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: '500', color: 'var(--text-primary)' }}>{activity.action}</p>
                  <small style={{ color: 'var(--text-muted)' }}>{activity.time}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        {/* Smartwatch Integration */}
        <div className="smartwatch-data">
          <h3 className="card-title">
            <Icon name="watch" size={20} />
            Live Biometric Data
          </h3>
          {smartwatchData ? (
            <div>
              <div className="biometric-grid">
                <div className="biometric-item">
                  <div className="biometric-value">{smartwatchData.heartRate}</div>
                  <div className="biometric-label">BPM</div>
                </div>
                <div className="biometric-item">
                  <div className="biometric-value">{smartwatchData.batteryLevel}%</div>
                  <div className="biometric-label">BATTERY</div>
                </div>
              </div>
              
              {/* Additional biometric data if available */}
              {smartwatchData.temperature && smartwatchData.humidity && (
                <div className="biometric-grid" style={{ marginTop: '1rem' }}>
                  <div className="biometric-item">
                    <div className="biometric-value">{smartwatchData.temperature.toFixed(1)}°C</div>
                    <div className="biometric-label">TEMP</div>
                  </div>
                  <div className="biometric-item">
                    <div className="biometric-value">{smartwatchData.humidity}%</div>
                    <div className="biometric-label">HUMIDITY</div>
                  </div>
                </div>
              )}
              
              <div style={{ marginTop: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ color: 'var(--text-primary)' }}>Stress Level:</span>
                  <span style={{ 
                    color: getStressLevelColor(smartwatchData.stressLevel),
                    fontWeight: 'bold',
                    textTransform: 'capitalize'
                  }}>
                    {smartwatchData.stressLevel}
                  </span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ color: 'var(--text-primary)' }}>Activity:</span>
                  <span style={{ textTransform: 'capitalize', color: 'var(--text-primary)' }}>{smartwatchData.activity}</span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <span style={{ color: 'var(--text-primary)' }}>Mood:</span>
                  <span style={{ textTransform: 'capitalize', color: 'var(--text-primary)' }}>{smartwatchData.mood.replace('_', ' ')}</span>
                </div>
              </div>
              
              {/* Health alerts if available */}
              {smartwatchData.alerts && smartwatchData.alerts.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  {smartwatchData.alerts.map((alert, index) => (
                    <div key={index} className={`alert alert-${alert.severity}`} style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                      <Icon name="alert" size={14} style={{ marginRight: '0.5rem' }} />
                      {alert.message}
                    </div>
                  ))}
                </div>
              )}
              
              <div style={{ 
                fontSize: '0.8rem', 
                color: 'var(--text-muted)', 
                textAlign: 'center', 
                marginTop: '1rem',
                padding: '0.5rem',
                background: smartwatchData.isRealData ? 'var(--empathy-tertiary)' : 'var(--bg-tertiary)',
                borderRadius: '8px',
                border: smartwatchData.isRealData ? '1px solid var(--empathy-primary)' : 'none'
              }}>
                <Icon name={smartwatchData.isRealData ? "watch" : "camera"} size={14} style={{ marginRight: '0.5rem' }} />
                {smartwatchData.isRealData ? (
                  <>
                    <strong style={{ color: 'var(--empathy-primary)' }}>🔴 LIVE GPIO DATA</strong>
                    <br />
                    Real-time from COM5 sensor
                  </>
                ) : (
                  <>
                    Camera capture every 5s
                    <br />
                    Simulated data
                  </>
                )}
                <br />
                Last updated: {new Date(smartwatchData.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ) : (
            <p>Connecting to smartwatch...</p>
          )}
        </div>

        {/* Empathy Score */}
        <div className="card" style={{ padding: 'var(--space-md)' }}>
          <h3 className="card-title">
            <Icon name="empathy" size={20} />
            Empathy Score
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div className="stat-value" style={{ fontSize: '3rem' }}>92%</div>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              Excellent! You're being very mindful in your interactions today.
            </p>
          </div>
          
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
            <h5 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Tips for today:</h5>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li>Check in on Maddy - she might need support</li>
              <li>Ask Sarah about her hiking adventures</li>
              <li>Take breaks when your heart rate is elevated</li>
            </ul>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card" style={{ padding: 'var(--space-md)' }}>
          <h3 className="card-title">
            <Icon name="trendingUp" size={20} />
            Today's Stats
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-primary)' }}>Empathy alerts:</span>
              <span style={{ fontWeight: 'bold', color: 'var(--warning)' }}>3</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-primary)' }}>Conversations started:</span>
              <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>2</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-primary)' }}>Mindful interactions:</span>
              <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>8</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-primary)' }}>Support given:</span>
              <span style={{ fontWeight: 'bold', color: 'var(--info)' }}>5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;