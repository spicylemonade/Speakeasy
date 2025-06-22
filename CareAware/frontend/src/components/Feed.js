import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { getApiUrl } from '../config';

const Feed = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    fetchPosts();
    fetchTrending();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/posts'));
      const data = await response.json();
      setPosts(data.map(p => ({ ...p, isLiked: false }))); // Add client-side like tracking
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = () => {
    // Mock trending topics
    const mockTrending = [
      { topic: '#AIRevolution', posts: '15.2K' },
      { topic: '#MovieNight', posts: '8.1K' },
      { topic: '#DogsofSpeakeasy', posts: '5.6K' },
      { topic: '#VCFunding', posts: '3.9K' },
      { topic: '#LocalPolitics', posts: '1.2K' }
    ];
    setTrending(mockTrending);
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor((now - date) / (1000 * 60))}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return `${Math.floor(diffInHours / 24)}d`;
    }
  };

  const getEmpathyIcon = (type) => {
    switch (type) {
      case 'grief_support': return 'empathy';
      case 'stress_relief': return 'heartbeat';
      case 'stress_support': return 'support';
      default: return 'lightbulb';
    }
  };

  const getEmpathyColor = (type) => {
    switch (type) {
      case 'grief_support': return '#8B5CF6';
      case 'stress_relief': return '#10B981';
      case 'stress_support': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading your feed...</p>
      </div>
    );
  }

  return (
    <div className="main-layout">
      <div className="main-column">
        <div className="feed">
          <div className="feed-header">
            <h1>Home</h1>
            <p>Stay connected with empathy-powered insights</p>
            <Link to="/compose" className="btn btn-primary">
              <Icon name="compose" size={16} />
              Create Post
            </Link>
          </div>

          <div className="posts-container">
            {posts.map(post => (
              <div key={post.id} className="post">
                {/* Post Header */}
                <div className="post-header">
                  <Link to={`/profile/${post.user.id}`}>
                    <img
                      src={post.user.avatar}
                      alt={post.user.name}
                      className="post-avatar"
                    />
                  </Link>
                  <div className="post-meta">
                    <Link to={`/profile/${post.user.id}`} className="post-author">{post.user.name}</Link>
                    <span className="post-username">@{post.user.username}</span>
                    <span className="post-time">· {formatTime(post.timestamp)}</span>
                  </div>
                </div>

                {/* Post Content */}
                <div className="post-content">
                  <p>{post.content}</p>
                </div>

                {/* Empathy Insights */}
                {post.empathyInsight && (
                  <div 
                    className="empathy-insight"
                    style={{ 
                      borderLeft: `4px solid ${getEmpathyColor(post.empathyInsight.type)}` 
                    }}
                  >
                    <div className="insight-header">
                      <Icon 
                        name={getEmpathyIcon(post.empathyInsight.type)} 
                        size={16} 
                        color={getEmpathyColor(post.empathyInsight.type)}
                      />
                      <span className="insight-title">Empathy Insight</span>
                    </div>
                    <p className="insight-message">{post.empathyInsight.message}</p>
                    <div className="insight-details">
                      <small>
                        <strong>Context:</strong> {post.empathyInsight.context}
                      </small>
                      <br />
                      <small>
                        <strong>Mindful tip:</strong> {post.empathyInsight.suggestedResponse}
                      </small>
                    </div>
                  </div>
                )}

                {/* Post Actions */}
                <div className="post-actions">
                  <button
                    className={`post-action comment-action`}
                  >
                    <Icon name="comment" size={18} />
                    <span>{post.comments}</span>
                  </button>

                  <button
                    className={`post-action like-action ${post.isLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <Icon 
                      name={post.isLiked ? 'heartFilled' : 'heart'} 
                      size={18} 
                    />
                    <span>{post.likes}</span>
                  </button>

                  <button className="post-action share-action">
                    <Icon name="share" size={18} />
                  </button>

                  <button className="post-action">
                    <Icon name="support" size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar-column">
        {/* Trending Topics */}
        <div className="widget">
          <div className="widget-header">
            <h3 className="widget-title">Trending in Speakeasy</h3>
          </div>
          {trending.map((item, index) => (
            <div key={index} className="widget-item">
              <div className="trending-topic">
                <div className="trending-info">
                  <div className="trending-category">Trending</div>
                  <div className="trending-title">{item.topic}</div>
                  <div className="trending-stats">{item.posts} posts</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mindful Interaction Tips */}
        <div className="card mindful-tips">
          <h3 className="card-title">
            <Icon name="lightbulb" size={20} />
            Mindful Interaction Tips
          </h3>
          <div className="tips-grid">
            <div className="tip-item">
              <Icon name="empathy" size={18} />
              <div>
                <h5>Practice Empathy</h5>
                <p>Consider what others might be going through before responding</p>
              </div>
            </div>
            <div className="tip-item">
              <Icon name="support" size={18} />
              <div>
                <h5>Offer Support</h5>
                <p>Sometimes just letting someone know you care makes all the difference</p>
              </div>
            </div>
            <div className="tip-item">
              <Icon name="lightbulb" size={18} />
              <div>
                <h5>Ask Before Advising</h5>
                <p>Check if someone wants advice or just needs someone to listen</p>
              </div>
            </div>
          </div>
        </div>

        {/* Who to Support */}
        <div className="widget">
          <div className="widget-header">
            <h3 className="widget-title">Who to Support</h3>
          </div>
          <div className="widget-item">
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link to="/profile/2">
                <img
                  src="https://i.pravatar.cc/100?img=5"
                  alt="Connie"
                  style={{ width: '48px', height: '48px', borderRadius: '50%' }}
                />
              </Link>
              <div style={{ flex: 1 }}>
                <Link to="/profile/2" className="post-author" style={{ textDecoration: 'none' }}>Connie</Link>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  @connie_c
                </div>
              </div>
              <button className="btn btn-secondary">Support</button>
            </div>
          </div>
          <div className="widget-item">
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link to="/profile/3">
                <img
                  src="https://i.pravatar.cc/100?img=11"
                  alt="William"
                  style={{ width: '48px', height: '48px', borderRadius: '50%' }}
                />
              </Link>
              <div style={{ flex: 1 }}>
                <Link to="/profile/3" className="post-author" style={{ textDecoration: 'none' }}>William</Link>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  @will_w
                </div>
              </div>
              <button className="btn btn-secondary">Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;