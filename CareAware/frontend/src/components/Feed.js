import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

const Feed = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    fetchPosts();
    fetchTrending();
  }, []);

  const fetchPosts = async () => {
    try {
      // Mock posts with empathy context
      const mockPosts = [
        {
          id: 1,
          user: {
            id: 1,
            name: "Maddy Johnson",
            username: "maddy_j",
            avatar: "https://i.pravatar.cc/100?img=1"
          },
          content: "Grateful for the support from friends during this difficult time. Small gestures mean everything.",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          likes: 12,
          comments: 3,
          isLiked: false,
          empathyInsight: {
            type: 'grief_support',
            message: 'Maddy is processing grief - showing support would be meaningful',
            context: 'Recent loss of mother',
            suggestedResponse: 'Consider offering specific help or sharing a fond memory'
          }
        },
        {
          id: 2,
          user: {
            id: 3,
            name: "Sarah Williams",
            username: "sarah_w",
            avatar: "https://i.pravatar.cc/100?img=3"
          },
          content: "Study break well earned! Nature has the best therapy sessions. The autumn colors on the hiking trail were absolutely stunning today.",
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          likes: 8,
          comments: 2,
          isLiked: true,
          empathyInsight: {
            type: 'stress_relief',
            message: 'Sarah is managing medical school stress with outdoor activities',
            context: 'Balancing intensive studies',
            suggestedResponse: 'Ask about her favorite hiking spots or offer study support'
          }
        },
        {
          id: 3,
          user: {
            id: 4,
            name: "Alex Chen",
            username: "alex_c",
            avatar: "https://i.pravatar.cc/100?img=4"
          },
          content: "Team project deadline coming up. Anyone else feeling the pressure? Looking for some motivation to push through.",
          timestamp: new Date(Date.now() - 21600000).toISOString(),
          likes: 5,
          comments: 7,
          isLiked: false,
          empathyInsight: {
            type: 'stress_support',
            message: 'Alex is experiencing academic pressure and seeking motivation',
            context: 'Deadline stress',
            suggestedResponse: 'Offer encouragement or study group collaboration'
          }
        }
      ];

      setPosts(mockPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const fetchTrending = () => {
    // Mock trending topics
    const mockTrending = [
      { topic: '#MentalHealthMatters', posts: '2.4K' },
      { topic: '#StudySupport', posts: '1.8K' },
      { topic: '#GriefJourney', posts: '987' },
      { topic: '#MindfulMoments', posts: '654' },
      { topic: '#CommunitySupport', posts: '432' }
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
                  <img
                    src={post.user.avatar}
                    alt={post.user.name}
                    className="post-avatar"
                  />
                  <div className="post-meta">
                    <span className="post-author">{post.user.name}</span>
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
            <h3 className="widget-title">Trending in CareAware</h3>
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
              <Icon name="empathy" size={18} color="#8bc34a" />
              <div>
                <h5>Practice Empathy</h5>
                <p>Consider what others might be going through before responding</p>
              </div>
            </div>
            <div className="tip-item">
              <Icon name="support" size={18} color="#00ba7c" />
              <div>
                <h5>Offer Support</h5>
                <p>Sometimes just letting someone know you care makes all the difference</p>
              </div>
            </div>
            <div className="tip-item">
              <Icon name="lightbulb" size={18} color="#f4b942" />
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
              <img
                src="https://i.pravatar.cc/100?img=5"
                alt="Jamie"
                style={{ width: '48px', height: '48px', borderRadius: '50%' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700' }}>Jamie Lee</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  @jamie_lee
                </div>
              </div>
              <button className="btn btn-secondary">Support</button>
            </div>
          </div>
          <div className="widget-item">
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img
                src="https://i.pravatar.cc/100?img=6"
                alt="Morgan"
                style={{ width: '48px', height: '48px', borderRadius: '50%' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700' }}>Morgan Davis</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  @morgan_d
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