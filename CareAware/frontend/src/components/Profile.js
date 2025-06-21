import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

const Profile = ({ currentUser }) => {
  const [userStats, setUserStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      // Mock user stats
      const stats = {
        postsCount: 24,
        empathyScore: 92,
        conversationsStarted: 18,
        supportGiven: 45,
        joinedDate: 'October 2023',
        activeStreak: 12
      };

      const posts = [
        {
          id: 1,
          content: "Grateful for the small moments of joy today. Sometimes it's the little things that matter most.",
          timestamp: 'Yesterday',
          likes: 8,
          comments: 3
        },
        {
          id: 2,
          content: "Remember to be kind to yourself. You're doing better than you think.",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          likes: 15,
          comments: 7
        }
      ];

      const userInterests = [
        { name: 'Photography', posts: 12 },
        { name: 'Mental Health', posts: 8 },
        { name: 'Star Wars', posts: 6 },
        { name: 'Hiking', posts: 4 },
        { name: 'Cooking', posts: 3 }
      ];

      setUserStats(stats);
      setRecentPosts(posts);
      setInterests(userInterests);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="main-layout">
      <div className="main-column">
        <div className="page-header">
          <h1>{currentUser.name}</h1>
          <p>{recentPosts.length} posts</p>
        </div>

        {/* Profile Header */}
        <div className="card" style={{ border: 'none', boxShadow: 'none' }}>
          <div style={{ background: 'var(--primary-light)', height: '200px' }}></div>
          <div className="card-body" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{
                  width: '134px',
                  height: '134px',
                  borderRadius: '50%',
                  marginTop: '-75px',
                  border: '4px solid var(--bg-primary)',
                  backgroundColor: 'var(--bg-primary)',
                }}
              />
              <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
                <button className="btn btn-outline">
                  <Icon name="mail" />
                </button>
                <button className="btn btn-primary">
                  <Icon name="plus" /> Follow
                </button>
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-md)' }}>
              <h2 style={{ fontSize: 'var(--font-size-xl)', margin: 0, color: 'var(--text-primary)' }}>{currentUser.name}</h2>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 var(--space-md) 0' }}>@{currentUser.username}</p>
              <p style={{ color: 'var(--text-primary)' }}>{currentUser.bio}</p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-lg)', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-md)' }}>
              <span><Icon name="calendar" /> Joined {userStats.joinedDate}</span>
              <span><Icon name="mapPin" /> <a href="#" style={{ color: 'var(--text-link)', textDecoration: 'none' }}>speakeasy.com</a></span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px',
          background: 'var(--border-primary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          margin: 'var(--space-lg)'
        }}>
          <div style={{ padding: 'var(--space-md)', background: 'var(--bg-primary)', textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)' }}>{userStats.postsCount}</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Posts</div>
          </div>
          <div style={{ padding: 'var(--space-md)', background: 'var(--bg-primary)', textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)' }}>{userStats.empathyScore}%</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Empathy Score</div>
          </div>
          <div style={{ padding: 'var(--space-md)', background: 'var(--bg-primary)', textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)' }}>{userStats.conversationsStarted}</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Conversations</div>
          </div>
          <div style={{ padding: 'var(--space-md)', background: 'var(--bg-primary)', textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)' }}>{userStats.supportGiven}</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Support Given</div>
          </div>
        </div>

        {/* Recent Posts Section */}
        <div className="posts-container" style={{ marginTop: 'var(--space-xl)' }}>
           <h3 style={{ padding: '0 var(--space-lg) var(--space-md)', color: 'var(--text-primary)' }}>Recent Posts</h3>
          {recentPosts.map(post => (
            <div key={post.id} className="post">
              <div className="post-header">
                <img src={currentUser.avatar} alt={currentUser.name} className="post-avatar" />
                <div className="post-meta">
                  <span className="post-author">{currentUser.name}</span>
                  <span className="post-username">{currentUser.username}</span>
                  <span className="post-time">{formatTime(post.timestamp)}</span>
                </div>
              </div>
              <div className="post-content">
                <p>{post.content}</p>
              </div>
              <div className="post-actions">
                <button className="action-button"><Icon name="comment" /> {post.comments}</button>
                <button className="action-button"><Icon name="retweet" /> Repost</button>
                <button className="action-button like-action"><Icon name="heart" /> {post.likes}</button>
                <button className="action-button"><Icon name="upload" /> Share</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sidebar-column">
        {/* Profile Insights */}
        <div className="widget">
          <div className="widget-header">
            <h4 className="widget-title">Profile Insights</h4>
          </div>
          <div className="widget-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Active Streak</span>
              <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{userStats.activeStreak} days</span>
            </div>
          </div>
        </div>

        {/* Interests & Topics */}
        <div className="widget">
          <div className="widget-header">
            <h4 className="widget-title">Interests & Topics</h4>
          </div>
          {interests.map(interest => (
            <div key={interest.name} className="widget-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-primary)' }}>{interest.name}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>{interest.posts} posts</span>
              </div>
            </div>
          ))}
        </div>

        {/* Empathy Recognition */}
        <div className="widget">
          <div className="widget-header">
            <h4 className="widget-title">Empathy Recognition</h4>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: 'linear-gradient(135deg, var(--empathy-green), var(--sage-green))',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'white',
              fontSize: '2rem'
            }}>
              <Icon name="empathy" size={32} />
            </div>
            <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--empathy-primary)' }}>
              Compassionate Listener
            </h5>
            <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              Recognized for providing thoughtful, empathetic responses and creating a safe space for others.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;