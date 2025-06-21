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
          timestamp: new Date(Date.now() - 86400000).toISOString(),
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
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        {/* Main Profile Content */}
        <div>
          {/* Profile Header */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid var(--primary-orange)'
                }}
              />
              <div style={{ flex: 1 }}>
                <h1 style={{ margin: '0 0 0.5rem 0' }}>{currentUser.name}</h1>
                <p style={{ margin: '0 0 1rem 0', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                  @{currentUser.username}
                </p>
                <p style={{ margin: '0 0 1.5rem 0', fontSize: '1rem', lineHeight: 1.6 }}>
                  Creating connections through empathy and understanding. Passionate about mental health awareness, photography, and building supportive communities.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link to="/settings" className="btn btn-primary">
                    <Icon name="settings" size={16} />
                    Edit Profile
                  </Link>
                  <Link to="/compose" className="btn btn-outline">
                    <Icon name="compose" size={16} />
                    New Post
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-orange)' }}>
                {userStats.postsCount}
              </div>
              <div style={{ color: 'var(--text-muted)' }}>Posts</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--empathy-green)' }}>
                {userStats.empathyScore}%
              </div>
              <div style={{ color: 'var(--text-muted)' }}>Empathy Score</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--deep-teal)' }}>
                {userStats.conversationsStarted}
              </div>
              <div style={{ color: 'var(--text-muted)' }}>Conversations</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--golden-yellow)' }}>
                {userStats.supportGiven}
              </div>
              <div style={{ color: 'var(--text-muted)' }}>Support Given</div>
            </div>
          </div>

          {/* Recent Posts */}
          <div className="card">
            <h3 className="card-title">
              <Icon name="feed" size={20} />
              Recent Posts
            </h3>
            {recentPosts.map(post => (
              <div key={post.id} style={{ 
                padding: '1.5rem 0', 
                borderBottom: '1px solid var(--border-light)' 
              }}>
                <p style={{ margin: '0 0 1rem 0', fontSize: '1rem', lineHeight: 1.6 }}>
                  {post.content}
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)'
                }}>
                  <span>{formatTime(post.timestamp)}</span>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Icon name="heart" size={14} />
                      {post.likes}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Icon name="comment" size={14} />
                      {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link to="/feed" className="btn btn-outline">
                <Icon name="feed" size={16} />
                View All Posts
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Profile Insights */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title">
              <Icon name="activity" size={20} />
              Profile Insights
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.75rem',
                background: 'var(--bg-secondary)',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Icon name="calendar" size={16} color="var(--primary-orange)" />
                  <span>Joined</span>
                </div>
                <span style={{ fontWeight: '500' }}>{userStats.joinedDate}</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.75rem',
                background: 'var(--bg-secondary)',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Icon name="trendingUp" size={16} color="var(--empathy-green)" />
                  <span>Active Streak</span>
                </div>
                <span style={{ fontWeight: '500' }}>{userStats.activeStreak} days</span>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title">
              <Icon name="heartbeat" size={20} />
              Interests & Topics
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {interests.map((interest, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0',
                  borderBottom: index < interests.length - 1 ? '1px solid var(--border-light)' : 'none'
                }}>
                  <span style={{ fontWeight: '500' }}>{interest.name}</span>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    color: 'var(--text-muted)',
                    background: 'var(--bg-secondary)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px'
                  }}>
                    {interest.posts} posts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Empathy Badge */}
          <div className="card">
            <h3 className="card-title">
              <Icon name="empathy" size={20} />
              Empathy Recognition
            </h3>
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
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--empathy-green)' }}>
                Compassionate Listener
              </h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Recognized for providing thoughtful, empathetic responses and creating a safe space for others.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;