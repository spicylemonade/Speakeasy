import React, { useState, useEffect } from 'react';
import Icon from './Icon';

const Messages = ({ currentUser }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (message && selectedConversation) {
      const timeoutId = setTimeout(() => {
        analyzeMessage();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } else {
      setAiAnalysis(null);
    }
  }, [message, selectedConversation]);

  const fetchConversations = async () => {
    try {
      // Mock conversation data
      const mockConversations = [
        {
          id: 1,
          otherUser: {
            id: 1,
            name: "Maddy Johnson",
            username: "maddy_j",
            avatar: "https://i.pravatar.cc/100?img=1"
          },
          messages: [
            {
              id: 1,
              senderId: 1,
              content: "Hey Alex! Thanks for checking in on me. It's been really tough lately.",
              timestamp: new Date(Date.now() - 3600000).toISOString()
            },
            {
              id: 2,
              senderId: 2,
              content: "I'm here for you, Maddy. Do you want to talk about it?",
              timestamp: new Date(Date.now() - 3000000).toISOString(),
              aiSuggested: true
            }
          ]
        },
        {
          id: 2,
          otherUser: {
            id: 3,
            name: "Sarah Williams",
            username: "sarah_w",
            avatar: "https://i.pravatar.cc/100?img=3"
          },
          messages: [
            {
              id: 1,
              senderId: 3,
              content: "Just got back from an amazing hike! The autumn colors were incredible",
              timestamp: new Date(Date.now() - 7200000).toISOString()
            }
          ]
        }
      ];

      setConversations(mockConversations);
      setSelectedConversation(mockConversations[0]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const analyzeMessage = async () => {
    if (!selectedConversation || !message.trim()) return;

    try {
      // Mock AI analysis
      const analysis = await mockAIAnalysis(selectedConversation.otherUser.id, message);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing message:', error);
    }
  };

  const mockAIAnalysis = async (recipientId, messageContent) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    let response = {
      alert: null,
      suggestion: null,
      biometricAlert: null,
      confidence: 0.85
    };

    // Check for sensitive topics with Maddy (who lost her mom)
    if (recipientId === 1) {
      const sensitiveKeywords = ['mom', 'mother', 'family', 'parent', 'how is your mom'];
      const containsSensitive = sensitiveKeywords.some(keyword => 
        messageContent.toLowerCase().includes(keyword)
      );

      if (containsSensitive) {
        response.alert = {
          type: 'empathy_warning',
          message: 'Sensitivity Alert: Maddy recently lost her mother. This topic might be very painful for her right now. Consider a different approach or offer support instead.',
          severity: 'high'
        };
      }

      // Biometric alert for Maddy
      if (Math.random() > 0.6) {
        response.biometricAlert = {
          type: 'biometric_warning',
          message: 'Biometric Alert: Maddy\'s heart rate is elevated (85 BPM). She might be stressed - consider a gentle, supportive approach.',
          severity: 'medium'
        };
      }

      // Conversation suggestions
      if (!containsSensitive) {
        response.suggestion = {
          type: 'conversation_starter',
          message: 'Conversation Tip: Maddy loves Star Wars and photography. Maybe ask about her latest photo projects or favorite Star Wars moments to lift her spirits!',
          topics: ['Star Wars', 'Photography']
        };
      }
    }

    // Check for Sarah (medical student)
    if (recipientId === 3) {
      const stressKeywords = ['stress', 'exam', 'study', 'pressure'];
      const containsStress = stressKeywords.some(keyword => 
        messageContent.toLowerCase().includes(keyword)
      );

      if (containsStress) {
        response.suggestion = {
          type: 'empathy_tip',
          message: 'Empathy Tip: Sarah has been stressed about medical school. Show understanding and maybe suggest a study break or outdoor activity.',
          topics: ['Study Support', 'Outdoor Activities']
        };
      } else {
        response.suggestion = {
          type: 'conversation_starter',
          message: 'Conversation Tip: Sarah just posted about hiking! Ask her about the autumn colors or her favorite hiking spots.',
          topics: ['Hiking', 'Photography', 'Nature']
        };
      }
    }

    return response;
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedConversation || sendingMessage) return;

    setSendingMessage(true);

    try {
      const newMessage = {
        id: selectedConversation.messages.length + 1,
        senderId: currentUser.id,
        content: message.trim(),
        timestamp: new Date().toISOString(),
        aiSuggested: false
      };

      // Update conversation with new message
      const updatedConversations = conversations.map(conv => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage]
          };
        }
        return conv;
      });

      setConversations(updatedConversations);
      setSelectedConversation({
        ...selectedConversation,
        messages: [...selectedConversation.messages, newMessage]
      });

      setMessage('');
      setAiAnalysis(null);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor((now - date) / (1000 * 60))}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading your conversations...</p>
      </div>
    );
  }

  return (
    <div className="main-column">
      <div className="page-header">
        <h1>Messages</h1>
      </div>
      <div className="messages-container">
        <div className="conversations-list">
          <div className="search-bar" style={{ padding: 'var(--space-md)', borderBottom: '1px solid var(--border-primary)' }}>
            <input type="text" placeholder="Search conversations..." className="form-input" style={{ width: '100%', borderRadius: 'var(--radius-full)' }} />
          </div>
          {conversations.map(conversation => (
            <div
              key={conversation.id}
              className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <img
                src={conversation.otherUser.avatar}
                alt={conversation.otherUser.name}
                className="conversation-avatar"
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>{conversation.otherUser.name}</h4>
                <p style={{ 
                  margin: 0, 
                  fontSize: '0.9rem', 
                  color: 'var(--text-muted)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {conversation.messages[conversation.messages.length - 1]?.content || 'Start a conversation'}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="chat-container">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                  <img
                    src={selectedConversation.otherUser.avatar}
                    alt={selectedConversation.otherUser.name}
                    className="conversation-avatar"
                  />
                  <div>
                    <h4 style={{ margin: 0 }}>{selectedConversation.otherUser.name}</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                      @{selectedConversation.otherUser.username}
                    </p>
                  </div>
                </div>
              </div>
              <div className="chat-messages">
                {selectedConversation.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`message ${msg.senderId === currentUser.id ? 'sent' : 'received'}`}
                  >
                    <div className={`message-bubble ${msg.aiSuggested ? 'ai-suggested' : ''}`}>
                      {msg.content}
                      <div style={{ 
                        fontSize: '0.75rem', 
                        opacity: 0.7, 
                        marginTop: '0.25rem' 
                      }}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {aiAnalysis && (
                <div style={{ padding: '1rem', background: 'var(--bg-secondary)' }}>
                  {aiAnalysis.alert && (
                    <div className={`alert alert-${aiAnalysis.alert.severity}`}>
                      <Icon name="alert" size={16} style={{ marginRight: '0.5rem' }} />
                      {aiAnalysis.alert.message}
                    </div>
                  )}
                  
                  {aiAnalysis.biometricAlert && (
                    <div className={`alert alert-${aiAnalysis.biometricAlert.severity}`}>
                      <Icon name="watch" size={16} style={{ marginRight: '0.5rem' }} />
                      {aiAnalysis.biometricAlert.message}
                    </div>
                  )}

                  {aiAnalysis.suggestion && (
                    <div className="alert alert-success">
                      <Icon name="lightbulb" size={16} style={{ marginRight: '0.5rem' }} />
                      {aiAnalysis.suggestion.message}
                    </div>
                  )}
                </div>
              )}
              <div className="message-input-container">
                <div className="message-input-wrapper">
                  <textarea
                    className="message-input"
                    placeholder={`Message ${selectedConversation.otherUser.name}...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={sendingMessage}
                  />
                  <button
                    className="send-button"
                    onClick={sendMessage}
                    disabled={!message.trim() || sendingMessage}
                    title="Send message"
                  >
                    <Icon name={sendingMessage ? 'loader' : 'send'} size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <Icon name="message" size={48} />
              <h2>Select a message</h2>
              <p>Choose from your existing conversations, start a new one, or just keep swimming.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;