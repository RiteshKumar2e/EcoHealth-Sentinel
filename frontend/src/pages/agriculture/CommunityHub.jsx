import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Share2, ThumbsUp, AlertCircle, Shield, Send, MapPin, Clock } from 'lucide-react';
import './CommunityHub.css';

const CommunityHub = () => {
  // Inject some pre-populated data for visual demo as per USER image
  const [posts, setPosts] = useState([
    {
      _id: 'p1',
      author: 'Priya Sharma',
      verified: true,
      location: 'Maharashtra',
      createdAt: new Date().toISOString(),
      category: 'Crop Health',
      content: 'AI disease detection helped save my tomato crop. Early detection is key!',
      likesCount: 46,
      comments: [
        { author: 'Anil K', text: 'This is so useful!' },
        { author: 'Farmer John', text: 'Which tool did you use?' }
      ]
    },
    {
      _id: 'p2',
      author: 'Rajesh Kumar',
      verified: true,
      location: 'Punjab',
      createdAt: new Date().toISOString(),
      category: 'Water Management',
      content: 'Successfully implemented drip irrigation. Water usage reduced by 40%!',
      likesCount: 25,
      comments: [
        { author: 'Suresh Raina', text: 'Great work!' },
        { author: 'Dr. Mehta', text: 'Inspiring initiative 👏' }
      ]
    }
  ]);

  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [moderationAlert, setModerationAlert] = useState('');
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    // fetchPosts(); // In production, this would fetch from real API
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

  const handlePostSubmit = () => {
    if (!newPost.trim()) return;

    // Simple moderation
    const harmfulPatterns = ['abuse', 'scam', 'fake'];
    if (harmfulPatterns.some(p => newPost.toLowerCase().includes(p))) {
      setModerationAlert('Content contains harmful terms');
      setTimeout(() => setModerationAlert(''), 3000);
      return;
    }

    const post = {
      _id: Date.now().toString(),
      content: newPost,
      category: selectedCategory,
      author: 'Agri Expert', // Mock current user
      verified: true,
      location: 'New Delhi',
      createdAt: new Date().toISOString(),
      likesCount: 0,
      comments: []
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
  };

  const handleLike = (postId) => {
    setPosts(posts.map(p => {
      if (p._id === postId) {
        return { ...p, likesCount: (p.likesCount || 0) + 1 };
      }
      return p;
    }));
  };

  const handleAddComment = (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    setPosts(posts.map(p => {
      if (p._id === postId) {
        return {
          ...p,
          comments: [...(p.comments || []), { author: 'Agri Expert', text: text }]
        };
      }
      return p;
    }));
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
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
                    <Users size={28} color="#10b981" />
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
                      <span>•</span>
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
