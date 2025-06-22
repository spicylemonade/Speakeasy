import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import Icon from './Icon';
import { getApiUrl } from '../config';

const CallPage = ({ currentUser }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [callee, setCallee] = useState(location.state?.user || null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [callStatus, setCallStatus] = useState('Calling...');
  const [callDuration, setCallDuration] = useState(0);
  const [insights, setInsights] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speechAnalysis, setSpeechAnalysis] = useState(null);
  const [biometricData, setBiometricData] = useState(null);
  const [realtimeInsights, setRealtimeInsights] = useState([]);
  const [lastTranscription, setLastTranscription] = useState('');
  
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const speechRecognitionRef = useRef(null);
  const callIdRef = useRef(`call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  // Initialize speech recognition (no Socket.IO for now)
  useEffect(() => {
    // Initialize Web Speech API if available
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        console.log('🎤 [FRONTEND] Speech recognized:', transcript);
        // Store the transcript for later use when user presses the AI button
        setLastTranscription(transcript);
      };

      recognition.onerror = (event) => {
        console.error('❌ [FRONTEND] Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log('🎤 [FRONTEND] Speech recognition ended');
        // Don't auto-restart - user controls when to listen
      };

      speechRecognitionRef.current = recognition;
    }

    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    };
  }, []);

  // Fetch biometric data periodically
  useEffect(() => {
    const fetchBiometrics = async () => {
      if (currentUser && callStatus === 'Connected') {
        try {
          const response = await fetch(getApiUrl(`/api/smartwatch/${currentUser.id}`));
          const data = await response.json();
          setBiometricData(data);
        } catch (error) {
          console.error('Error fetching biometric data:', error);
        }
      }
    };

    fetchBiometrics();
    const interval = setInterval(fetchBiometrics, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [currentUser, callStatus]);

  const startListening = () => {
    if (speechRecognitionRef.current && !isListening) {
      console.log('🎤 [FRONTEND] Starting speech recognition...');
      setIsListening(true);
      speechRecognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (speechRecognitionRef.current && isListening) {
      console.log('🎤 [FRONTEND] Stopping speech recognition...');
      setIsListening(false);
      speechRecognitionRef.current.stop();
    }
  };

  // Handle button press for AI guidance
  const handleAIGuidanceToggle = async () => {
    if (isListening) {
      // Stop listening and process what was said
      console.log('🧠 [FRONTEND] User pressed button - stopping listening and getting AI guidance');
      stopListening();
      
      // Use the last transcription or a default message
      const transcriptionToAnalyze = lastTranscription || "Hey, how are you doing today? I heard you've been working on some new projects.";
      
      try {
        console.log('🧠 [FRONTEND] Sending transcription for analysis:', transcriptionToAnalyze);
        
        // Send transcription to server for analysis
        const response = await fetch(getApiUrl('/api/analyze-call-speech'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callerId: currentUser?.id || 1,
            recipientId: parseInt(userId),
            transcription: transcriptionToAnalyze,
            biometricData: biometricData
          })
        });

        const analysis = await response.json();
        console.log('🧠 [FRONTEND] Received analysis:', analysis);

        // Update speech analysis state
        setSpeechAnalysis(analysis);
        setRealtimeInsights(prev => [...prev.slice(-4), {
          id: Date.now(),
          transcription: transcriptionToAnalyze,
          analysis: analysis,
          timestamp: new Date().toISOString()
        }]);

        // Play TTS if there's a suggestion
        if (analysis.suggestion) {
          console.log('🔊 [FRONTEND] Playing TTS for suggestion:', analysis.suggestion);
          await playTextToSpeech(analysis.suggestion);
        }

        // Clear the transcription after processing
        setLastTranscription('');

      } catch (error) {
        console.error('❌ [FRONTEND] Error getting AI guidance:', error);
      }
    } else {
      // Start listening
      console.log('🎤 [FRONTEND] User pressed button - starting to listen');
      setLastTranscription(''); // Clear any previous transcription
      startListening();
    }
  };

  const playTextToSpeech = async (text) => {
    console.log('🔊 [FRONTEND] Requesting TTS for text:', text);
    try {
      const response = await fetch(getApiUrl('/api/text-to-speech'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'lily' })
      });

      const result = await response.json();
      console.log('🔊 [FRONTEND] TTS response:', result);
      
      if (result.success && result.audioData) {
        console.log('🔊 [FRONTEND] Playing audio...');
        const audio = new Audio(result.audioData);
        audio.play()
          .then(() => console.log('✅ [FRONTEND] Audio played successfully'))
          .catch((error) => console.error('❌ [FRONTEND] Audio play failed:', error));
      } else {
        console.error('❌ [FRONTEND] TTS was not successful:', result);
      }
    } catch (error) {
      console.error('❌ [FRONTEND] Error with TTS request:', error);
    }
  };

  const mockCallAIAnalysis = async (recipientId) => {
    await new Promise(resolve => setTimeout(resolve, 3000)); // Initial analysis after 3s

    let response = {
      biometricAlert: null,
      suggestion: null,
    };

    if (recipientId === 1) {
      response.biometricAlert = {
        type: 'voice_stress',
        message: "Biometric Alert: Geby's heart rate is elevated. Consider a gentle, supportive approach.",
        severity: 'medium'
      };
      response.suggestion = {
        type: 'conversation_starter',
        message: 'Conversation Tip: You both love coding. Maybe ask about recent projects to lift their spirits?',
        topics: ['Coding', 'AI']
      };
    }
    setInsights(response);
    
    // Start listening for speech after initial analysis
    startListening();
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
          <button className={`btn-icon call-action-btn ${isListening ? 'active' : ''}`} title={isListening ? 'Stop & Get AI Guidance' : 'Start Listening'} onClick={handleAIGuidanceToggle}>
            <Icon name={isListening ? 'brain' : 'brain'} size={32} />
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
        
        {/* Real-time Status */}
        <div className="card" style={{marginBottom: 'var(--space-md)'}}>
          <div className="card-body">
            <h4 className="card-title" style={{display: 'flex', alignItems: 'center', gap: 'var(--space-xs)'}}>
              <Icon name={isListening ? 'mic' : 'mic-off'} size={16} />
              AI Assistant
              {isListening && <div className="spinner" style={{width: '12px', height: '12px'}}></div>}
            </h4>
            <p style={{fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', margin: 0}}>
              {isListening ? 'Listening... Click again when done talking to get AI guidance' : 'Click the brain icon to start listening'}
            </p>
            {biometricData && (
              <div style={{marginTop: 'var(--space-sm)', fontSize: 'var(--font-size-sm)'}}>
                <p style={{margin: 0}}>❤️ {biometricData.heartRate} BPM | 😌 {biometricData.stressLevel} stress</p>
              </div>
            )}
          </div>
        </div>

        {/* Real-time Insights */}
        {realtimeInsights.length > 0 && (
          <div style={{marginBottom: 'var(--space-md)'}}>
            <h4 style={{fontSize: 'var(--font-size-md)', marginBottom: 'var(--space-sm)'}}>Live Insights</h4>
            <div style={{maxHeight: '200px', overflowY: 'auto'}}>
              {realtimeInsights.slice(-3).map(insight => (
                <div key={insight.id} className="alert alert-info" style={{marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-sm)'}}>
                  {insight.type === 'alert' ? (
                    <>
                      <Icon name="alert-triangle" size={14} style={{ marginRight: '0.5rem' }} />
                      {insight.message}
                    </>
                  ) : (
                    <>
                      {insight.analysis.alert && (
                        <div style={{marginBottom: 'var(--space-xs)', color: 'var(--color-warning)'}}>
                          <Icon name="alert" size={14} style={{ marginRight: '0.5rem' }} />
                          {insight.analysis.alert}
                        </div>
                      )}
                      {insight.analysis.suggestion && (
                        <div style={{color: 'var(--color-success)'}}>
                          <Icon name="lightbulb" size={14} style={{ marginRight: '0.5rem' }} />
                          {insight.analysis.suggestion}
                        </div>
                      )}
                      {insight.analysis.biometricAlert && (
                        <div style={{marginTop: 'var(--space-xs)', color: 'var(--color-danger)'}}>
                          <Icon name="watch" size={14} style={{ marginRight: '0.5rem' }} />
                          {insight.analysis.biometricAlert}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Initial Insights */}
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