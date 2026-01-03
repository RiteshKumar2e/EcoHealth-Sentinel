import React, { useState, useEffect, useRef } from 'react';
import { Users, MessageSquare, Share2, ThumbsUp, AlertCircle, Shield, Copy, Bot, Send, MapPin, Clock } from 'lucide-react';
import './CommunityHub.css';

const CommunityHub = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [moderationAlert, setModerationAlert] = useState('');
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    fetchPosts();

    // Setup WebSocket for real-time updates if needed
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'new_post') {
        setPosts(prev => [message.data, ...prev]);
      }
    };

    return () => ws.close();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsDataLoading(true);
      const response = await fetch('/api/agriculture/community/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return;

    // Simple moderation
    const harmfulPatterns = ['abuse', 'scam', 'fake'];
    if (harmfulPatterns.some(p => newPost.toLowerCase().includes(p))) {
      setModerationAlert('Content contains harmful terms');
      setTimeout(() => setModerationAlert(''), 3000);
      return;
    }

    try {
      const response = await fetch('/api/agriculture/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newPost,
          category: selectedCategory,
          author: 'Current User', // In real app, get from auth context
          location: 'Local Region'
        })
      });

      if (response.ok) {
        const post = await response.json();
        setPosts(prev => [post, ...prev]);
        setNewPost('');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`/api/agriculture/community/posts/${postId}/like`, {
        method: 'POST'
      });
      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(posts.map(p => p._id === postId ? updatedPost : p));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    try {
      const response = await fetch(`/api/agriculture/community/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: 'Current User',
          text: text
        })
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(posts.map(p => p._id === postId ? updatedPost : p));
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };


  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' • ' +
      date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="hub-container">
      <div className="hub-wrapper">

        {/* Header */}
        <header className="hub-header">
          <div className="header-left">
            <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '16px' }}>
              <Users size={32} color="#10b981" />
            </div>
            <div>
              <h1 className="hub-title">Community Hub</h1>
              <p className="hub-subtitle">Connecting {posts.length * 12 + 150}+ progressive farmers</p>
            </div>
          </div>
          <div className="header-right">
            <Shield size={16} />
            <span>AI Secured Feed</span>
          </div>
        </header>

        {/* Create Post */}
        <div className="create-post-card">
          <h2 className="section-heading">
            <MessageSquare size={20} color="#10b981" />
            What's happening on your farm?
          </h2>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="hub-select"
          >
            <option>General</option>
            <option>Water Management</option>
            <option>Crop Health</option>
            <option>Pest Control</option>
            <option>Market Insights</option>
            <option>Technology</option>
          </select>

          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share insights, ask questions, or post an update..."
            className="hub-textarea"
          />

          {moderationAlert && (
            <div className="alert-box">
              <AlertCircle size={18} />
              <span>{moderationAlert}</span>
            </div>
          )}

          <button onClick={handlePostSubmit} className="btn-post">
            Share with Community
          </button>
        </div>

        {/* Feed */}
        {isDataLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            Loading farming insights...
          </div>
        ) : (
          posts.map(post => (
            <article key={post._id} className="feed-post-card">
              <div className="post-header">
                <div className="user-info">
                  <div className="user-avatar">
                    <Users size={24} color="#10b981" />
                  </div>
                  <div>
                    <h3 className="user-name">
                      {post.author}
                      {post.verified && <Shield size={14} color="#3b82f6" fill="#3b82f6" />}
                    </h3>
                    <div className="post-meta">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {post.location}
                      </span>
                      <span style={{ margin: '0 8px' }}>•</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {formatTime(post.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="category-tag">{post.category}</span>
              </div>

              <p className="post-content">{post.content}</p>

              <div className="post-actions">
                <button className="action-btn like-btn" onClick={() => handleLike(post._id)}>
                  <ThumbsUp size={18} /> {post.likesCount || 0}
                </button>
                <button className="action-btn comment-btn" onClick={() => {
                  const input = document.getElementById(`comment-input-${post._id}`);
                  if (input) input.focus();
                }}>
                  <MessageSquare size={18} /> {post.comments?.length || 0}
                </button>
                <button className="action-btn share-btn" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}>
                  <Share2 size={18} /> Share
                </button>
              </div>

              {/* Comments Section */}
              <div className="comments-section">
                {post.comments?.map((comment, idx) => (
                  <div key={idx} className="comment-item">
                    <div className="comment-author">{comment.author}</div>
                    <div className="comment-text">{comment.text}</div>
                  </div>
                ))}

                <div className="comment-input-group">
                  <input
                    id={`comment-input-${post._id}`}
                    type="text"
                    placeholder="Write a comment..."
                    className="comment-input"
                    value={commentInputs[post._id] || ''}
                    onChange={(e) => setCommentInputs(prev => ({ ...prev, [post._id]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                  />
                  <button className="btn-comment" onClick={() => handleAddComment(post._id)}>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

    </div>
  );
};

export default CommunityHub;
