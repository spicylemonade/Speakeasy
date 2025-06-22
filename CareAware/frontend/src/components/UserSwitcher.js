import React, { useState, useEffect, useRef } from 'react';
import { getApiUrl } from '../config';
import Icon from './Icon';

const UserSwitcher = ({ currentUserId, onUserChange }) => {
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(getApiUrl('/api/users'));
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const usersData = await response.json();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currentUser = users.find(user => user.id === currentUserId);

  const handleUserSelect = (userId) => {
    onUserChange(userId);
    setIsOpen(false);
  };

  if (loading) {
    return <div className="user-switcher-loading">Loading users...</div>;
  }

  return (
    <div className="user-switcher" ref={dropdownRef}>
      <button 
        className="user-switcher-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Switch User"
      >
        <div className="current-user-info">
          <img 
            src={currentUser?.avatar || 'https://i.pravatar.cc/40?img=1'} 
            alt={currentUser?.name || 'User'} 
            className="user-avatar-small"
          />
          <span className="current-user-name">{currentUser?.name || 'User'}</span>
          <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} />
        </div>
      </button>

      {isOpen && (
        <div className="user-switcher-dropdown">
          <div className="user-switcher-header">
            <Icon name="users" size={16} />
            <span>Switch Account</span>
          </div>
          <div className="user-list">
            {users.map(user => (
              <button
                key={user.id}
                className={`user-option ${user.id === currentUserId ? 'active' : ''}`}
                onClick={() => handleUserSelect(user.id)}
              >
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="user-avatar-small"
                />
                <div className="user-details">
                  <div className="user-name">{user.name}</div>
                  <div className="user-username">@{user.username}</div>
                </div>
                {user.id === currentUserId && (
                  <Icon name="check" size={16} className="active-indicator" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSwitcher; 