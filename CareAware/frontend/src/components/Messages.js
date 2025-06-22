import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { getApiUrl } from '../config';

const Messages = ({ currentUser }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [enterPressCount, setEnterPressCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const response = await fetch(getApiUrl(`/api/conversations/${currentUser.id}`));
      const data = await response.json();
      setConversations(data);
      if (data.length > 0) {
        setSelectedConversation(data[0]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeMessage = async () => {
    if (!selectedConversation || !message.trim()) return;

    try {
      console.log('Analyzing message:', message);
      console.log('Recipient:', selectedConversation.otherUser.name);
      const response = await fetch(getApiUrl('/api/analyze-message'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: selectedConversation.otherUser.id,
          messageContent: message
        }),
      });
      const analysis = await response.json();
      console.log('AI Analysis received:', analysis);
      console.log('Analysis alert:', analysis.alert);
      console.log('Analysis suggestion:', analysis.suggestion);
      console.log('Analysis biometricAlert:', analysis.biometricAlert);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing message:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedConversation || sendingMessage) return;

    setSendingMessage(true);

    try {
      const response = await fetch(getApiUrl('/api/messages'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          senderId: currentUser.id,
          content: message.trim(),
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const newMessage = await response.json();

      // Update conversation with new message
      const updatedConversations = conversations.map(conv => {
        if (conv.id === selectedConversation.id) {
          // Check if the message is already there to prevent duplicates
          if (conv.messages.find(m => m.id === newMessage.id)) {
            return conv;
          }
          return { ...conv, messages: [...conv.messages, newMessage] };
        }
        return conv;
      });

      setConversations(updatedConversations);
      const newSelectedConversation = updatedConversations.find(c => c.id === selectedConversation.id);
      setSelectedConversation(newSelectedConversation);

      setMessage('');
      setAiAnalysis(null);
      setEnterPressCount(0); // Reset enter press count
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleStartCall = () => {
    if (!selectedConversation) return;
    navigate(`/call/${selectedConversation.otherUser.id}`, { 
      state: { user: selectedConversation.otherUser } 
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (enterPressCount === 0) {
        // First enter press: analyze message
        analyzeMessage();
        setEnterPressCount(1);
      } else {
        // Second enter press: send message
        sendMessage();
      }
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    // Reset analysis and enter count if user modifies the message
    if (enterPressCount > 0) {
      setEnterPressCount(0);
      setAiAnalysis(null);
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', width: '100%' }}>
      <div className="page-header">
        <h1>Messages</h1>
      </div>
      <div className="messages-container" style={{ flex: 1, minHeight: 0 }}>
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
                    placeholder="Type a message... (Press Enter to get AI suggestions)"
                    value={message}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    rows="1"
                    disabled={sendingMessage}
                  ></textarea>
                  <button
                    type="button"
                    className="send-button"
                    onClick={handleStartCall}
                    disabled={sendingMessage}
                    title="Start voice call"
                  >
                    <Icon name="mic" size={18} />
                  </button>
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