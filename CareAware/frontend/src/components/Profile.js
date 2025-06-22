import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from './Icon';
import { getApiUrl } from '../config';

const Profile = ({ currentUser }) => {
  const { userId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const targetId = userId || currentUser.id.toString();
    setIsCurrentUser(!userId || userId === currentUser.id.toString());
    fetchProfileData(targetId);
  }, [userId, currentUser.id]);

  const fetchProfileData = async (id) => {
    setLoading(true);
    try {
      // Fetch user profile details
      const userResponse = await fetch(getApiUrl(`/api/users/${id}`));
      if (!userResponse.ok) throw new Error('User not found');
      const userData = await userResponse.json();
      
      // Fetch all posts and filter for the user
      const postsResponse = await fetch(getApiUrl('/api/posts'));
      const allPosts = await postsResponse.json();
      const userPostsData = allPosts.filter(post => post.userId === parseInt(id));
      setUserPosts(userPostsData);

      // Mocking stats and interests as they are not in the user model from the backend
      const mockStats = {
        postsCount: userPostsData.length,
        empathyScore: Math.floor(Math.random() * 20) + 80, // 80-99
        conversationsStarted: Math.floor(Math.random() * 20) + 5,
        supportGiven: Math.floor(Math.random() * 50) + 10,
        joinedDate: 'October 2023', // Static for now
        activeStreak: Math.floor(Math.random() * 15) + 1,
      };

      setProfileData({ user: userData, stats: mockStats });

    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
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

  if (loading || !profileData) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  const { user, stats } = profileData;
  const posts = userPosts;
  const interests = user.interests.map(interest => ({ name: interest, posts: Math.floor(Math.random() * 10) + 1 }));

  return (
    <div className="main-layout">
      <div className="main-column">
        <div className="page-header">
          <h1>{user.name}</h1>
          <p>{posts.length} posts</p>
        </div>

        {/* Profile Header */}
        <div className="card" style={{ border: 'none', boxShadow: 'none' }}>
          <div style={{ background: 'var(--primary-light)', height: '200px' }}></div>
          <div className="card-body" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <img
                src={user.avatar}
                alt={user.name}
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
                {!isCurrentUser && (
                  <>
                    <button className="btn btn-outline">
                      <Icon name="messages" />
                    </button>
                    <button className="btn btn-primary">
                      <Icon name="profile" /> Follow
                    </button>
                  </>
                )}
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-md)' }}>
              <h2 style={{ fontSize: 'var(--font-size-xl)', margin: 0, color: 'var(--text-primary)' }}>{user.name}</h2>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 var(--space-md) 0' }}>@{user.username}</p>
              <p style={{ color: 'var(--text-primary)' }}>{user.bio}</p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-lg)', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-md)' }}>
              <span><Icon name="calendar" /> Joined {stats.joinedDate}</span>
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
            <div style={{ fontWeight: 'bold', fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)' }}>{stats.postsCount}</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Posts</div>
          </div>
          <div style={{ padding: 'var(--space-md)', background: 'var(--bg-primary)', textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)' }}>{stats.empathyScore}%</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Empathy Score</div>
          </div>
          <div style={{ padding: 'var(--space-md)', background: 'var(--bg-primary)', textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)' }}>{stats.conversationsStarted}</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Conversations</div>
          </div>
          <div style={{ padding: 'var(--space-md)', background: 'var(--bg-primary)', textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)' }}>{stats.supportGiven}</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Support Given</div>
          </div>
        </div>

        {/* Recent Posts Section */}
        <div className="posts-container" style={{ marginTop: 'var(--space-xl)' }}>
           <h3 style={{ padding: '0 var(--space-lg) var(--space-md)', color: 'var(--text-primary)' }}>Recent Posts</h3>
          {posts.map(post => (
            <div key={post.id} className="post">
              <div className="post-header">
                <img src={user.avatar} alt={user.name} className="post-avatar" />
                <div className="post-meta">
                  <span className="post-author">{user.name}</span>
                  <span className="post-username">@{user.username}</span>
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
              <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats.activeStreak} days</span>
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