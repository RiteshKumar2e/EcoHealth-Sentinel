import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Share2, ThumbsUp, AlertCircle, Shield, Copy, Bot, Send } from 'lucide-react';
import './CommunityHub.css';

const CommunityHub = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [moderationAlert, setModerationAlert] = useState('');
  const [sharePopup, setSharePopup] = useState(null);

  // Chatbot states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Hello! I'm your farming assistant. Ask me anything 🌱" }
  ]);

  // Simulated backend fetch (posts)
  useEffect(() => {
    const fetchPosts = async () => {
      const data = [
        {
          id: 1,
          author: 'Rajesh Kumar',
          location: 'Punjab',
          content: 'Successfully implemented drip irrigation. Water usage reduced by 40%!',
          likes: 24,
          comments: ['Great work!', 'Inspiring initiative 👏'],
          category: 'Water Management',
          verified: true,
          timestamp: '2 hours ago'
        },
        {
          id: 2,
          author: 'Priya Sharma',
          location: 'Maharashtra',
          content: 'AI disease detection helped save my tomato crop. Early detection is key!',
          likes: 45,
          comments: ['This is so useful!', 'Which tool did you use?'],
          category: 'Crop Health',
          verified: true,
          timestamp: '5 hours ago'
        }
      ];
      setPosts(data);
    };
    fetchPosts();
  }, []);

  // AI Content Moderation
  const moderateContent = (content) => {
    const harmfulPatterns = ['abuse', 'scam', 'fake', 'cheat'];
    const lowerContent = content.toLowerCase();

    for (let pattern of harmfulPatterns) {
      if (lowerContent.includes(pattern)) {
        return { safe: false, reason: 'Content contains potentially harmful terms' };
      }
    }
    if (content.length < 10) {
      return { safe: false, reason: 'Content too short for meaningful contribution' };
    }
    return { safe: true };
  };

  // Post submission
  const handlePostSubmit = () => {
    const moderation = moderateContent(newPost);
    if (!moderation.safe) {
      setModerationAlert(moderation.reason);
      setTimeout(() => setModerationAlert(''), 3000);
      return;
    }
    const post = {
      id: posts.length + 1,
      author: 'Current User',
      location: 'Your Location',
      content: newPost,
      likes: 0,
      comments: [],
      category: selectedCategory,
      verified: false,
      timestamp: 'Just now'
    };
    setPosts([post, ...posts]);
    setNewPost('');
    setModerationAlert('');
  };

  // Like button
  const handleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  // Add comment
  const handleAddComment = (postId, comment) => {
    if (!comment.trim()) return;
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, comments: [...post.comments, comment] } : post
    ));
  };

  // Copy share link
  const handleShare = (postId) => {
    navigator.clipboard.writeText(`https://communityhub.com/post/${postId}`);
    setSharePopup(postId);
    setTimeout(() => setSharePopup(null), 2000);
  };

  // Chatbot send message
  const handleChatSend = async () => {
    if (!chatInput.trim()) return;

    // add user message
    const newMessages = [...chatMessages, { sender: "user", text: chatInput }];
    setChatMessages(newMessages);

    // send to backend
    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatInput })
      });
      const data = await response.json();
      setChatMessages([...newMessages, { sender: "bot", text: data.reply }]);
    } catch (err) {
      setChatMessages([...newMessages, { sender: "bot", text: "⚠️ Sorry, server not responding." }]);
    }
    setChatInput('');
  };

  return (
    <div className="hub-container">
      <div className="hub-wrapper">

        {/* Header */}
        <div className="hub-header">
          <div className="header-left">
            <Users size={32} color="#16a34a" />
            <div>
              <h1 className="hub-title">Community Hub</h1>
              <p className="hub-subtitle">Connect, Share, Grow Together</p>
            </div>
          </div>
          <div className="header-right">
            <Shield size={20} />
            <span>AI-Moderated</span>
          </div>
        </div>

        {/* Create Post */}
        <div className="post-card">
          <h2 className="section-heading">
            <MessageSquare size={20} color="#16a34a" /> Share Your Experience
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
            placeholder="Share your farming insights, success stories, or ask questions..."
            className="hub-textarea"
          />

          {moderationAlert && (
            <div className="alert-box">
              <AlertCircle size={16} />
              <span>{moderationAlert}</span>
            </div>
          )}

          <button onClick={handlePostSubmit} className="btn-post">
            Post to Community
          </button>
        </div>

        {/* Posts */}
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="user-info">
                <div className="user-avatar">
                  <Users size={24} color="#16a34a" />
                </div>
                <div>
                  <h3 className="user-name">
                    {post.author} {post.verified && <Shield size={14} color="blue" />}
                  </h3>
                  <p className="post-meta">{post.location} • {post.timestamp}</p>
                </div>
              </div>
              <span className="category-tag">{post.category}</span>
            </div>

            <p className="post-content">{post.content}</p>

            {/* Post Actions */}
            <div className="post-actions">
              <button onClick={() => handleLike(post.id)} className="action-btn">
                <ThumbsUp size={16} /> {post.likes} Likes
              </button>
              <button
                onClick={() => handleAddComment(post.id, prompt("Enter your comment:"))}
                className="action-btn"
              >
                <MessageSquare size={16} /> {post.comments.length} Comments
              </button>
              <button onClick={() => handleShare(post.id)} className="action-btn">
                <Share2 size={16} /> Share
              </button>
            </div>

            {/* Share Popup */}
            {sharePopup === post.id && (
              <div className="share-popup">
                <Copy size={14} /> Link copied!
              </div>
            )}

            {/* Comments */}
            {post.comments.length > 0 && (
              <div className="comments-section">
                {post.comments.map((c, i) => (
                  <p key={i} className="comment-text">💬 {c}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chatbot floating button */}
      <div className="chatbot-icon" onClick={() => setChatOpen(!chatOpen)}>
        <Bot size={45} color="white" />
      </div>

      {/* Chatbot window */}
      {chatOpen && (
        <div className="chatbot-window">
          <div className="chat-header">🌱 AgriBot</div>
          <div className="chat-body">
            {chatMessages.map((msg, i) => (
              <div key={i} className={msg.sender === "user" ? "msg-user" : "msg-bot"}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input-area">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask me anything..."
              className="chat-input"
              onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
            />
            <button onClick={handleChatSend} className="chat-send-btn">
              <Send size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityHub;
