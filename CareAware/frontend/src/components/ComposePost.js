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
    <div className="main-column">
      <div className="page-header">
        <h1>Compose Post</h1>
      </div>
      <div className="compose-container">
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

        {/* Mindful Posting Tips */}
        <div className="card" style={{ marginTop: '2rem' }}>
          <h3 className="card-title">
            <Icon name="lightbulb" size={20} />
            Mindful Posting Tips
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mindfulTips.map((tip, index) => (
              <div 
                key={index}
                style={{ 
                  display: 'flex', 
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  borderLeft: '4px solid var(--empathy-green)'
                }}
              >
                <Icon name="checkCircle" size={16} color="var(--empathy-green)" />
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3 className="card-title">
            <Icon name="shield" size={20} />
            Community Guidelines
          </h3>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <p>Our community thrives on empathy and mutual support. Please:</p>
            <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
              <li>Be respectful and kind in all interactions</li>
              <li>Avoid sharing personal information of others</li>
              <li>Offer support, not unsolicited advice</li>
              <li>Report content that feels harmful or inappropriate</li>
              <li>Remember that behind every post is a real person with real feelings</li>
            </ul>
            <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
              Together, we can create a space where everyone feels heard and supported.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposePost;