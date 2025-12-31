import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Leaf, Droplets, Wind, Sun, Trash2, Download, Copy, Volume2, VolumeX, RefreshCw, Settings, Sparkles, CheckCircle, TrendingUp, Share2, Search, Minimize2, Maximize2, Clock, Star, ThumbsUp, ThumbsDown, BookOpen } from 'lucide-react';
import './Chatbot.css';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! 👋 I\'m your AI Environmental Assistant. I can help you with:\n\n🌍 Climate change & global warming\n💧 Water conservation\n⚡ Renewable energy\n♻️ Waste management\n🌱 Sustainable agriculture\n🦋 Wildlife conservation\n\nHow can I assist you today?',
      timestamp: new Date(),
      suggestions: ['Climate Tips', 'Water Conservation', 'Renewable Energy', 'Sustainable Living'],
      helpful: null
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settings, setSettings] = useState({
    voiceEnabled: true,
    autoScroll: true,
    showTimestamp: true,
    fontSize: 'medium',
    notifications: true,
    autoSave: true
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  const knowledgeBase = {
    climate: {
      keywords: ['climate', 'global warming', 'temperature', 'greenhouse', 'carbon', 'co2'],
      responses: [
        '🌡️ **Climate Change Overview:**\n\nClimate change is real and urgent. Key facts:\n• Global temperature +1.1°C since pre-industrial times\n• CO2 levels: 420 ppm (highest in 3 million years)\n• Sea levels rising 3.3mm/year\n\n**Actions you can take:**\n✅ Reduce energy use by 30%\n✅ Use public transport\n✅ Support renewable energy\n✅ Plant trees (1 tree = 48 lbs CO2/year)\n✅ Reduce meat consumption',
        '📊 **India\'s Climate Commitment:**\n\n✅ 500 GW renewable target by 2030\n✅ 45% emission intensity reduction\n✅ Net-zero by 2070\n✅ World\'s 4th largest renewable market\n\n**Progress:**\n• Renewable capacity: 175 GW achieved\n• Solar grew 20x in 8 years\n• On track to meet Paris goals'
      ]
    },
    water: {
      keywords: ['water', 'conservation', 'save water', 'drought'],
      responses: [
        '💧 **Water Conservation Tips:**\n\n**Daily Actions:**\n✅ Fix leaks - Save 30L/day\n✅ 5-min showers - Save 50L\n✅ Turn off tap while brushing\n✅ Use bucket instead of running water\n\n**Impact:**\nIndia has only 4% freshwater but 18% population. Every drop counts!',
        '🌊 **Water Pollution Solutions:**\n\n**Main sources:**\n• Industrial waste (40%)\n• Agricultural runoff (30%)\n• Sewage (25%)\n\n**What you can do:**\n✅ Use eco-friendly products\n✅ Proper waste disposal\n✅ Support wastewater treatment\n✅ Report pollution'
      ]
    },
    energy: {
      keywords: ['energy', 'solar', 'renewable', 'electricity'],
      responses: [
        '⚡ **Renewable Energy Benefits:**\n\n**Why switch?**\n✅ Zero emissions\n✅ Lower bills long-term\n✅ Energy independence\n✅ Creates jobs\n\n**India Progress:**\n• 175 GW renewable capacity\n• 500 GW target by 2030\n• 40% govt subsidy for solar',
        '☀️ **Solar Energy Guide:**\n\n**System Sizing:**\n• 1 kW = 4-5 units/day\n• 3-5 kW for average home\n• Cost: ₹50,000-60,000/kW\n\n**Benefits:**\n• 5-7 year payback\n• 25-year lifespan\n• Net metering available'
      ]
    },
    waste: {
      keywords: ['waste', 'plastic', 'recycle', 'garbage'],
      responses: [
        '♻️ **3R Hierarchy:**\n\n**1. REDUCE** (Most important)\n• Buy only what you need\n• Avoid single-use items\n\n**2. REUSE**\n• Repair instead of replace\n• Donate unwanted items\n\n**3. RECYCLE**\n• Segregate: Wet, Dry, Hazardous\n• Use recycling facilities',
        '🌊 **Plastic Crisis:**\n\n**Facts:**\n• 8M tons enter oceans yearly\n• 500+ years to decompose\n\n**Solutions:**\n✅ Reusable bags & bottles\n✅ Refuse straws & cutlery\n✅ Choose glass/steel\n✅ Join beach cleanups'
      ]
    },
    general: {
      keywords: ['help', 'what', 'tips', 'sustainable'],
      responses: [
        '🌟 **I can help with:**\n\n🌍 Climate change strategies\n💧 Water conservation tips\n⚡ Renewable energy options\n♻️ Waste management\n🌱 Sustainable agriculture\n🦋 Wildlife conservation\n\nWhat would you like to know?',
        '✨ **Quick Eco-Actions:**\n\n**Daily:**\n✅ LED bulbs (80% less energy)\n✅ Fix water leaks\n✅ Reusable bags\n✅ 5-min showers\n\n**Weekly:**\n✅ Meatless Monday\n✅ Bulk shopping\n✅ Composting\n\n**Impact: Save ₹15,000-30,000/year!**'
      ]
    }
  };

  const scrollToBottom = () => {
    if (settings.autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) setChatHistory(JSON.parse(saved));
    const savedFavorites = localStorage.getItem('chatFavorites');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    const savedSettings = localStorage.getItem('chatSettings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  const saveChatHistory = (newMessages) => {
    if (settings.autoSave) {
      const history = {
        id: Date.now(),
        messages: newMessages,
        timestamp: new Date().toISOString(),
        title: newMessages[1]?.text.slice(0, 50) + '...' || 'New Chat'
      };
      const updated = [history, ...chatHistory].slice(0, 20);
      setChatHistory(updated);
      localStorage.setItem('chatHistory', JSON.stringify(updated));
    }
  };

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('chatSettings', JSON.stringify(newSettings));
  };

  const getAIResponse = async (userInput) => {
    try {
      const response = await fetch(`${API_BASE_URL}/environment/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          message: userInput,
          context: messages.slice(-5)
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.response;
      }
    } catch (error) {
      console.log('Using local knowledge base');
    }
    return null;
  };

  const findBestResponse = (userInput) => {
    const input = userInput.toLowerCase();
    let bestMatch = { category: 'general', score: 0 };

    for (const [category, data] of Object.entries(knowledgeBase)) {
      const matchCount = data.keywords.filter(k => input.includes(k)).length;
      if (matchCount > bestMatch.score) {
        bestMatch = { category, score: matchCount };
      }
    }

    const responses = knowledgeBase[bestMatch.category].responses;
    const response = responses[Math.floor(Math.random() * responses.length)];

    const suggestions = bestMatch.category === 'climate'
      ? ['Carbon Calculator', 'Renewable Energy', 'Climate Action']
      : bestMatch.category === 'water'
        ? ['Rainwater Harvesting', 'Pollution Control', 'Conservation']
        : ['Energy Efficiency', 'Solar Guide', 'Green Schemes'];

    return { text: response, suggestions };
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    const aiResponse = await getAIResponse(currentInput);

    setTimeout(() => {
      const response = aiResponse || findBestResponse(currentInput);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: typeof response === 'string' ? response : response.text,
        timestamp: new Date(),
        suggestions: typeof response === 'object' ? response.suggestions : [],
        helpful: null
      };

      const newMessages = [...messages, userMessage, botMessage];
      setMessages(newMessages);
      setIsTyping(false);

      if (settings.voiceEnabled) speakText(botMessage.text);
      saveChatHistory(newMessages);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { icon: Leaf, text: 'Climate', query: 'Climate change tips', color: '#10b981' },
    { icon: Droplets, text: 'Water', query: 'Water conservation', color: '#3b82f6' },
    { icon: Sun, text: 'Solar', query: 'Solar energy guide', color: '#f59e0b' },
    { icon: Trash2, text: 'Waste', query: 'Waste management tips', color: '#ef4444' },
    { icon: Wind, text: 'Energy', query: 'Renewable energy', color: '#8b5cf6' },
    { icon: TrendingUp, text: 'Carbon', query: 'Reduce carbon footprint', color: '#06b6d4' }
  ];

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const cleanText = text.replace(/[*#•✓✅❌⚠️🌍💧⚡♻️🌱]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    showToast('✅ Copied!');
  };

  const shareChat = async (message) => {
    const text = `AI Environmental Insight:\n\n${message.text}`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (e) {
        copyMessage(text);
      }
    } else {
      copyMessage(text);
    }
  };

  const markHelpful = (id, isHelpful) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, helpful: isHelpful } : m));
    showToast(isHelpful ? '👍 Thanks!' : '👎 We\'ll improve!');
  };

  const addToFavorites = (message) => {
    const newFavorites = [...favorites, message];
    setFavorites(newFavorites);
    localStorage.setItem('chatFavorites', JSON.stringify(newFavorites));
    showToast('⭐ Added to favorites!');
  };

  const downloadChat = () => {
    const text = messages.map(m =>
      `[${m.timestamp.toLocaleTimeString()}] ${m.type === 'user' ? 'You' : 'AI'}:\n${m.text}\n\n`
    ).join('');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    showToast('✅ Downloaded!');
  };

  const clearChat = () => {
    if (window.confirm('Clear all messages?')) {
      setMessages([messages[0]]);
      showToast('✅ Cleared!');
    }
  };

  const showToast = (msg) => {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, #10b981, #3b82f6);
      color: white; padding: 16px 24px; border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.2);
      z-index: 10000; font-weight: 600; animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  return (
    <div className={`chat-container ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      <div className="chat-wrapper">
        {/* Header */}
        <div className="chat-header">
          <div className="flex-between">
            <div className="flex-center gap-16">
              <div className="bot-icon-container">
                <Bot size={28} className="text-white" />
              </div>
              <div>
                <h1 className="header-title">AI Environmental Assistant</h1>
                <p className="header-status">
                  <Sparkles size={12} className="text-green-500" />
                  Powered by AI • {messages.length - 1} messages
                </p>
              </div>
            </div>
            <div className="flex-center gap-6">
              {isSpeaking && (
                <button className="action-btn" onClick={stopSpeaking} title="Stop">
                  <VolumeX size={18} />
                </button>
              )}
              <button className="action-btn" onClick={() => setShowSearch(!showSearch)} title="Search">
                <Search size={18} />
              </button>
              <button className="action-btn" onClick={downloadChat} title="Download">
                <Download size={18} />
              </button>
              <button className="action-btn" onClick={() => setShowHistory(!showHistory)} title="History">
                <Clock size={18} />
              </button>
              <button className="action-btn" onClick={clearChat} title="Clear">
                <Trash2 size={18} />
              </button>
              <button className="action-btn" onClick={() => setShowSettings(!showSettings)} title="Settings">
                <Settings size={18} />
              </button>
              <button className="action-btn" onClick={() => setIsFullscreen(!isFullscreen)} title="Fullscreen">
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
            </div>
          </div>

          {showSearch && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search messages..."
              className="search-input"
            />
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-bar">
          <div className="flex-center gap-8 justify-start">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <button
                  key={i}
                  onClick={() => { setInputText(action.query); setTimeout(handleSend, 100); }}
                  className="quick-btn"
                  style={{ background: `${action.color}20`, color: action.color, border: `1px solid ${action.color}40` }}
                >
                  <Icon size={16} />
                  {action.text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Messages */}
        <div className="messages-area">
          {messages.filter(m => !searchQuery || m.text.toLowerCase().includes(searchQuery.toLowerCase())).map((msg) => (
            <div key={msg.id} className={`message-item ${msg.type === 'user' ? 'message-item-user' : 'message-item-bot'}`}>
              <div className={`message-content-wrapper ${msg.type === 'user' ? 'message-content-user' : 'message-content-bot'}`}>
                <div className="flex-shrink-0">
                  {msg.type === 'bot' ? (
                    <div className="bot-icon-container p-10 animation-none">
                      <Bot size={20} className="text-white" />
                    </div>
                  ) : (
                    <div className="user-icon-container">
                      <User size={20} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className={`message-bubble ${msg.type === 'user' ? 'message-bubble-user' : 'message-bubble-bot'}`}>
                    <p className="m-0 whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <div className="message-meta">
                    {settings.showTimestamp && <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                    {msg.type === 'bot' && (
                      <div className="message-actions">
                        <button onClick={() => copyMessage(msg.text)} className="message-action-btn" title="Copy">
                          <Copy size={14} />
                        </button>
                        {settings.voiceEnabled && (
                          <button onClick={() => speakText(msg.text)} className="message-action-btn" title="Speak">
                            <Volume2 size={14} />
                          </button>
                        )}
                        <button onClick={() => shareChat(msg)} className="message-action-btn" title="Share">
                          <Share2 size={14} />
                        </button>
                        <button onClick={() => addToFavorites(msg)} className="message-action-btn" title="Favorite">
                          <Star size={14} />
                        </button>
                        <button onClick={() => markHelpful(msg.id, true)} className={`message-action-btn ${msg.helpful === true ? 'active-helpful' : ''}`} title="Helpful">
                          <ThumbsUp size={14} />
                        </button>
                        <button onClick={() => markHelpful(msg.id, false)} className={`message-action-btn ${msg.helpful === false ? 'active-unhelpful' : ''}`} title="Not Helpful">
                          <ThumbsDown size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="suggestions-container">
                      {msg.suggestions.map((s, i) => (
                        <span
                          key={i}
                          onClick={() => { setInputText(s); setTimeout(handleSend, 100); }}
                          className="suggestion-tag"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message-item message-item-bot">
              <div className="message-content-wrapper message-content-bot">
                <div className="bot-icon-container p-10 animation-none">
                  <Bot size={20} className="text-white" />
                </div>
                <div className="message-bubble message-bubble-bot">
                  <div className="typing-bubble">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="typing-dot" style={{ animation: `pulse 1.4s infinite ${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          <div className="input-container">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about environment, sustainability, climate..."
              className="input-field"
              rows="2"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className={`send-btn ${inputText.trim() ? 'send-btn-active' : 'send-btn-disabled'}`}
            >
              <Send size={20} />
            </button>
          </div>
          <p className="footer-info">
            <CheckCircle size={12} className="text-green-500" />
            AI-powered • Verified data • {chatHistory.length} saved chats
          </p>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex-between mb-24">
              <h2 className="m-0 text-2xl font-extrabold">⚙️ Settings</h2>
              <button onClick={() => setShowSettings(false)} className="action-btn">✕</button>
            </div>
            <div className="flex-col gap-16">
              {Object.entries(settings).map(([key, value]) => (
                <label key={key} className="flex-center justify-start gap-12 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => saveSettings({ ...settings, [key]: e.target.checked })}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <span className="text-gray-800 capitalize" style={{ fontSize: '15px' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="modal" onClick={() => setShowHistory(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex-between mb-24">
              <h2 className="m-0 text-2xl font-extrabold">📜 Chat History</h2>
              <button onClick={() => setShowHistory(false)} className="action-btn">✕</button>
            </div>
            <div className="flex-col gap-12">
              {chatHistory.length > 0 ? (
                chatHistory.map(chat => (
                  <div key={chat.id} className="history-item"
                    onClick={() => { setMessages(chat.messages); setShowHistory(false); showToast('✅ Chat loaded!'); }}>
                    <div className="font-bold mb-4">{chat.title}</div>
                    <div className="text-xs text-gray-500">{new Date(chat.timestamp).toLocaleString()}</div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 p-40">No saved chats yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
