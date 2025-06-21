import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';

const ComposePost = ({ currentUser }) => {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [mindfulTips, setMindfulTips] = useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Generate mindful posting tips
    const tips = [
      "Consider how your words might affect others who read your post",
      "Share experiences that could help someone going through similar struggles",
      "Ask yourself: Am I posting for genuine connection or validation?",
      "Remember that vulnerability can create meaningful connections"
    ];
    setMindfulTips(tips);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsPosting(true);
    
    try {
      // Simulate posting delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would send to backend
      console.log('Posting:', { content, userId: currentUser.id });
      
      // Reset form and navigate
      setContent('');
      navigate('/feed');
    } catch (error) {
      console.error('Error posting:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const characterCount = content.length;
  const maxCharacters = 500;
  const isOverLimit = characterCount > maxCharacters;

  return (
    <div className="main-layout">
      <div className="main-column">
        <div className="page-header">
          <h1>Compose Post</h1>
        </div>
        <div className="compose-container" style={{padding: '0 var(--space-lg)'}}>
          <div className="compose-form">
            <div className="compose-header">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="compose-avatar"
              />
              <div>
                <h3 style={{ margin: 0 }}>Share with your community</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Express yourself mindfully and authentically
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <textarea
                  className="form-textarea"
                  placeholder="What's on your mind? Share your thoughts, experiences, or ask for support..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  style={{
                    border: isOverLimit ? '2px solid var(--error)' : '1px solid var(--border-color)'
                  }}
                />
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: '0.5rem',
                  fontSize: '0.9rem'
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Be kind, be authentic, be supportive
                  </span>
                  <span style={{ 
                    color: isOverLimit ? 'var(--error)' : 'var(--text-muted)' 
                  }}>
                    {characterCount}/{maxCharacters}
                  </span>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate('/feed')}
                >
                  <Icon name="feed" size={16} />
                  Back to Feed
                </button>
                
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!content.trim() || isPosting || isOverLimit}
                >
                  <Icon name={isPosting ? 'loader' : 'send'} size={16} />
                  {isPosting ? 'Posting...' : 'Share Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="sidebar-column">
        {/* Mindful Posting Tips */}
        <div className="widget">
           <div className="widget-header">
            <h4 className="widget-title">Mindful Posting Tips</h4>
          </div>
          <div className="widget-item">
            <p>Consider how your words might affect others.</p>
          </div>
           <div className="widget-item">
            <p>Share experiences that could help someone.</p>
          </div>
           <div className="widget-item">
            <p>Are you posting for connection or validation?</p>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="widget">
           <div className="widget-header">
            <h4 className="widget-title">Community Guidelines</h4>
          </div>
          <div className="widget-item">
            <p>Our community thrives on empathy and mutual support. Please be respectful and kind in all interactions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposePost;