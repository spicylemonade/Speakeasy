import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Icon from './Icon';

const CallPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [callee, setCallee] = useState(location.state?.user || null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [callStatus, setCallStatus] = useState('Calling...');
  const [callDuration, setCallDuration] = useState(0);
  const [insights, setInsights] = useState(null);

  const mockCallAIAnalysis = async (recipientId) => {
    await new Promise(resolve => setTimeout(resolve, 5000)); // AI analysis starts after 5s

    let response = {
      biometricAlert: null,
      suggestion: null,
    };

    if (recipientId === 1) {
      response.biometricAlert = {
        type: 'voice_stress',
        message: "Biometric Alert: Maddy's voice tone suggests elevated stress. Consider a gentle, supportive approach.",
        severity: 'medium'
      };
      response.suggestion = {
        type: 'conversation_starter',
        message: 'Conversation Tip: You both love hiking. Maybe ask about her recent trip to lift her spirits?',
        topics: ['Hiking', 'Nature']
      };
    }
    setInsights(response);
  };

  useEffect(() => {
    if (!callee) {
      const mockUsers = [
        { id: 1, name: "Maddy Johnson", username: "maddy_j", avatar: "https://i.pravatar.cc/150?img=1", bio: "Photographer, hiker, and Star Wars enthusiast. Trying to find the beauty in everyday moments." },
        { id: 3, name: "Sarah Williams", username: "sarah_w", avatar: "https://i.pravatar.cc/150?img=3", bio: "Med student surviving on coffee and optimism. Loves trail running and fantasy novels." },
      ];
      const userToCall = mockUsers.find(u => u.id === parseInt(userId));
      if (userToCall) {
        setCallee(userToCall);
      } else {
        navigate('/messages');
      }
    }
  }, [callee, userId, navigate]);

  useEffect(() => {
    const connectTimeout = setTimeout(() => {
      setCallStatus('Connected');
      mockCallAIAnalysis(parseInt(userId)); 
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }, 3000);

    return () => clearTimeout(connectTimeout);
  }, [userId]);

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!callee) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Connecting...</p>
      </div>
    );
  }

  return (
    <div className="call-page-container animate-in">
      <div className="call-main-content">
        <div className="call-info">
          <h1 style={{fontSize: '2.5rem', margin: 0}}>{callee.name}</h1>
          <p style={{color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)', marginTop: 'var(--space-xs)'}}>
            {callStatus === 'Connected' ? formatDuration(callDuration) : callStatus}
          </p>
        </div>

        <div className="call-avatar-container">
          <div className="radiating-circle"></div>
          <img src={callee.avatar} alt={callee.name} className="call-avatar" />
        </div>

        <div className="call-actions">
          <button className={`btn-icon call-action-btn ${isMuted ? 'active' : ''}`} title={isMuted ? 'Unmute' : 'Mute'} onClick={() => setIsMuted(!isMuted)}>
            <Icon name={isMuted ? 'mic-off' : 'mic'} size={32} />
          </button>
          <button className={`btn-icon call-action-btn ${isSpeaker ? 'active' : ''}`} title={isSpeaker ? 'Disable Speaker' : 'Enable Speaker'} onClick={() => setIsSpeaker(!isSpeaker)}>
            <Icon name="volume-2" size={32} />
          </button>
          <button className="btn-icon call-end-btn" title="End Call" onClick={() => navigate(-1)}>
            <Icon name="phone-off" size={32} />
          </button>
        </div>
      </div>

      <div className="call-sidebar">
        <h3 className="widget-title" style={{marginBottom: 'var(--space-md)'}}>Call Insights</h3>
        <div className="card" style={{marginBottom: 'var(--space-md)'}}>
            <div className="card-body">
                <h4 className="card-title">{callee.name}</h4>
                <p className="text-secondary" style={{fontSize: 'var(--font-size-sm)'}}>@{callee.username}</p>
                <p style={{marginTop: 'var(--space-sm)', fontSize: 'var(--font-size-sm)'}}>{callee.bio}</p>
            </div>
        </div>
        
        {insights ? (
            <div className='animate-in'>
                {insights.biometricAlert && (
                    <div className={`alert alert-${insights.biometricAlert.severity}`} style={{marginBottom: 'var(--space-md)'}}>
                        <Icon name="watch" size={16} style={{ marginRight: '0.5rem' }} />
                        {insights.biometricAlert.message}
                    </div>
                )}
                {insights.suggestion && (
                    <div className="alert alert-success">
                        <Icon name="lightbulb" size={16} style={{ marginRight: '0.5rem' }} />
                        {insights.suggestion.message}
                    </div>
                )}
            </div>
        ) : (
             <div style={{textAlign: 'center', padding: 'var(--space-xl) 0'}}>
                <div className="spinner"></div>
                <p style={{color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-md)'}}>Analyzing call for helpful insights...</p>
             </div>
        )}
      </div>
    </div>
  );
};

export default CallPage; 