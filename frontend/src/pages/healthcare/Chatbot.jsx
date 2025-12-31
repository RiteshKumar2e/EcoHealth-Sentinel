import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Send, Bot, User, AlertTriangle, CheckCircle, Info, Sparkles,
  Mic, Paperclip, Download, Calendar, Clock, FileText, Pill, Activity,
  Heart, Phone, MapPin, ChevronDown, Search, Bookmark, Share2, Image as ImageIcon, X
} from 'lucide-react';
import './Chatbot.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [userProfile, setUserProfile] = useState({
    name: '',
    age: null,
    conditions: [],
    medications: [],
    allergies: []
  });
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      addBotMessage({
        text: "👋 Hello! I'm HealthAI, your 24/7 medical assistant. I can help you with:\n\n✓ Symptom analysis & health assessment\n✓ Appointment scheduling\n✓ Medication information\n✓ Health records & history\n✓ Emergency guidance\n\nWhat can I help you with today?",
        type: 'greeting',
        timestamp: new Date()
      });
    }, 500);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addBotMessage = (messageData) => {
    const botMessage = {
      id: Date.now() + Math.random(),
      sender: 'bot',
      ...messageData
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const addUserMessage = (text) => {
    const userMessage = {
      id: Date.now() + Math.random(),
      sender: 'user',
      text,
      timestamp: new Date(),
      file: selectedFile
    };
    setMessages(prev => [...prev, userMessage]);
    setSelectedFile(null);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedFile) return;

    const userText = inputValue.trim();
    addUserMessage(userText);
    setInputValue('');
    setIsTyping(true);

    try {
      try {
        const response = await fetch(`${API_BASE_URL}/chatbot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userText,
            domain: 'healthcare',
            userProfile: userProfile,
            hasFile: !!selectedFile
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setIsTyping(false);
          addBotMessage({
            text: result.response,
            type: result.type || 'general',
            data: result.analysis,
            quickReplies: result.quickReplies,
            confidence: result.confidence,
            timestamp: new Date()
          });
          return;
        }
      } catch (error) {
        console.warn('Chatbot API failed, using simulation:', error);
      }

      // Simulating API response
      await new Promise(resolve => setTimeout(resolve, 1500));
      const data = {
        response: "I understand you're feeling unwell. Based on my analysis, these could be your options. Could you describe your symptoms in more detail?",
        type: 'response',
        timestamp: new Date()
      };

      setIsTyping(false);
      addBotMessage({
        text: data.response,
        type: data.type || 'general',
        data: data.analysis,
        quickReplies: data.quickReplies,
        confidence: data.confidence,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error:', error);
      setIsTyping(false);
      addBotMessage({
        text: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        type: 'error',
        timestamp: new Date()
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.type
      });
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInputValue("Voice input simulation - I have a headache");
      }, 2000);
    }
  };

  const handleQuickAction = (action) => {
    setInputValue(action);
  };

  const exportChat = () => {
    const chatContent = messages.map(m =>
      `${m.sender === 'user' ? 'You' : 'HealthAI'}: ${m.text}`
    ).join('\n\n');

    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `healthai-chat-${new Date().toISOString()}.txt`;
    a.click();
  };

  const bookmarkMessage = (messageId) => {
    console.log('Bookmarked message:', messageId);
  };

  const shareMessage = (messageId) => {
    console.log('Shared message:', messageId);
  };

  const renderMessage = (message) => {
    if (message.sender === 'user') {
      return (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="chat-message-flex chat-message-end"
        >
          <motion.div
            className="chat-message-bubble chat-bubble-user"
            whileHover={{ scale: 1.01, translateY: -2 }}
          >
            <p className="chat-message-text">{message.text}</p>
            {message.file && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.9 }}>
                📎 {message.file.name}
              </div>
            )}
          </motion.div>
          <motion.div
            className="chat-avatar chat-avatar-user"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <User style={{ width: '1.25rem', height: '1.25rem', color: '#2563eb' }} />
          </motion.div>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, x: -50, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="chat-message-flex chat-message-start"
      >
        <motion.div
          className="chat-avatar chat-avatar-bot"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Bot style={{ width: '1.25rem', height: '1.25rem', color: '#10b981' }} />
        </motion.div>
        <div style={{ flex: 1 }}>
          <motion.div
            className="chat-message-bubble chat-bubble-bot"
            whileHover={{ scale: 1.005, translateY: -2 }}
          >
            {message.type === 'emergency' && (
              <motion.div
                className="chat-emergency-alert"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <AlertTriangle style={{ width: '1.25rem', height: '1.25rem' }} />
                EMERGENCY ALERT
              </motion.div>
            )}

            <p className="chat-message-text">{message.text}</p>

            {message.type === 'symptom_analysis' && message.data && (
              <motion.div
                style={{ marginTop: '1rem' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  className="chat-analysis-card chat-card-symptom"
                  whileHover={{ scale: 1.01 }}
                >
                  <p className="chat-card-title" style={{ color: '#1e40af' }}>
                    <Activity style={{ width: '1.1rem', height: '1.1rem' }} />
                    Detected Symptoms
                  </p>
                  <div className="chat-symptom-tags">
                    {message.data.symptoms?.map((s, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                        className="chat-symptom-tag"
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  className={`chat-analysis-card ${message.data.riskLevel === 'high' ? 'chat-card-risk-high' :
                    message.data.riskLevel === 'medium' ? 'chat-card-risk-medium' :
                      'chat-card-risk-low'
                    }`}
                  whileHover={{ scale: 1.01 }}
                >
                  <p className="chat-card-title">
                    <AlertTriangle style={{ width: '1.1rem', height: '1.1rem' }} />
                    Risk Level: {message.data.riskLevel?.toUpperCase()}
                  </p>
                </motion.div>

                {message.data.possibleConditions?.length > 0 && (
                  <motion.div
                    className="chat-analysis-card chat-card-condition"
                    whileHover={{ scale: 1.01 }}
                  >
                    <p className="chat-card-title" style={{ color: '#6b21a8' }}>
                      <FileText style={{ width: '1.1rem', height: '1.1rem' }} />
                      Possible Conditions
                    </p>
                    {message.data.possibleConditions.map((cond, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="chat-list-item"
                        style={{ color: '#7c3aed' }}
                      >
                        • {cond.name} ({(cond.probability * 100).toFixed(0)}% match)
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                <motion.div
                  className="chat-analysis-card chat-card-recommendation"
                  whileHover={{ scale: 1.01 }}
                >
                  <p className="chat-card-title" style={{ color: '#065f46' }}>
                    <CheckCircle style={{ width: '1.1rem', height: '1.1rem' }} />
                    Recommendations
                  </p>
                  {message.data.recommendations?.map((rec, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="chat-list-item"
                      style={{ color: '#047857' }}
                    >
                      <CheckCircle style={{ width: '1rem', height: '1rem', marginTop: '0.15rem', flexShrink: 0 }} />
                      <span>{rec}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {message.quickReplies && (
              <motion.div
                className="chat-quick-reply-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {message.quickReplies.map((reply, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setInputValue(reply)}
                    className="chat-quick-reply-btn"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {reply}
                  </motion.button>
                ))}
              </motion.div>
            )}

            <div className="chat-message-actions">
              <button
                className="chat-action-btn"
                onClick={() => bookmarkMessage(message.id)}
              >
                <Bookmark style={{ width: '0.9rem', height: '0.9rem' }} />
              </button>
              <button
                className="chat-action-btn"
                onClick={() => shareMessage(message.id)}
              >
                <Share2 style={{ width: '0.9rem', height: '0.9rem' }} />
              </button>
            </div>
          </motion.div>

          {message.confidence && (
            <motion.div
              className="chat-confidence"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Confidence: {(message.confidence * 100).toFixed(0)}%
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="chat-container">
      <div className="chat-floating-orbs">
        <motion.div
          className="chat-orb chat-orb-1"
          animate={{
            y: [-30, 30, -30],
            x: [-15, 15, -15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="chat-orb chat-orb-2"
          animate={{
            y: [30, -30, 30],
            x: [15, -15, 15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="chat-orb chat-orb-3"
          animate={{
            y: [-20, 20, -20],
            x: [20, -20, 20],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="chat-max-width">
        {/* Sidebar */}
        <motion.div
          className="chat-sidebar"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="chat-sidebar-section">
            <h3 className="chat-section-title">Quick Actions</h3>

            <motion.button
              className="chat-quick-action-btn"
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction("Check my symptoms")}
            >
              <div className="chat-quick-action-icon">
                <Activity style={{ width: '1.1rem', height: '1.1rem' }} />
              </div>
              <span>Symptom Checker</span>
            </motion.button>

            <motion.button
              className="chat-quick-action-btn"
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction("Book an appointment")}
            >
              <div className="chat-quick-action-icon">
                <Calendar style={{ width: '1.1rem', height: '1.1rem' }} />
              </div>
              <span>Book Appointment</span>
            </motion.button>

            <motion.button
              className="chat-quick-action-btn"
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction("My medications")}
            >
              <div className="chat-quick-action-icon">
                <Pill style={{ width: '1.1rem', height: '1.1rem' }} />
              </div>
              <span>Medications</span>
            </motion.button>

            <motion.button
              className="chat-quick-action-btn"
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction("View my health records")}
            >
              <div className="chat-quick-action-icon">
                <FileText style={{ width: '1.1rem', height: '1.1rem' }} />
              </div>
              <span>Health Records</span>
            </motion.button>

            <motion.button
              className="chat-quick-action-btn"
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction("Emergency help")}
            >
              <div className="chat-quick-action-icon chat-quick-action-icon-emergency">
                <Phone style={{ width: '1.1rem', height: '1.1rem', color: '#dc2626' }} />
              </div>
              <span>Emergency</span>
            </motion.button>
          </div>

          <div className="chat-sidebar-section">
            <h3 className="chat-section-title">Your Stats</h3>

            <div className="chat-stats-card">
              <div className="chat-stat-label">Total Consultations</div>
              <div className="chat-stat-value">24</div>
            </div>

            <div className="chat-stats-card">
              <div className="chat-stat-label">Last Check-up</div>
              <div className="chat-stat-value">5 days</div>
            </div>
          </div>

          <div className="chat-sidebar-section">
            <motion.button
              className="chat-quick-action-btn chat-export-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportChat}
            >
              <Download style={{ width: '1.1rem', height: '1.1rem', color: '#2563eb' }} />
              <span style={{ color: '#1e40af' }}>Export Chat</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="chat-main-content">
          {/* Header */}
          <motion.div
            className="chat-header-card"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="chat-header-content">
              <motion.div
                className="chat-header-icon"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart style={{ width: '2rem', height: '2rem', color: 'white' }} />
              </motion.div>
              <div>
                <h1 className="chat-title">
                  HealthAI Assistant
                  <motion.span
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ display: 'inline-block' }}
                  >
                    ⚕️
                  </motion.span>
                </h1>
                <p className="chat-subtitle">Your 24/7 AI-Powered Medical Companion</p>
              </div>
            </div>
            <motion.div
              className="chat-status-badge"
              animate={{
                boxShadow: [
                  '0 4px 12px rgba(16, 185, 129, 0.2)',
                  '0 4px 20px rgba(16, 185, 129, 0.4)',
                  '0 4px 12px rgba(16, 185, 129, 0.2)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="chat-status-dot"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              Online
            </motion.div>
          </motion.div>

          {/* Chat Container */}
          <motion.div
            className="chat-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          >
            {/* Quick Actions Bar */}
            {showQuickActions && (
              <motion.div
                className="chat-quick-actions-bar"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {['🤒 Fever', '🤕 Headache', '🤧 Cold', '💊 Medication', '📅 Appointment', '🏥 Find Clinic'].map((chip, i) => (
                  <motion.button
                    key={i}
                    className="chat-quick-chip"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickAction(chip.split(' ')[1])}
                  >
                    {chip}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Messages Area */}
            <div className="chat-messages-container">
              <AnimatePresence>
                {messages.map(message => renderMessage(message))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="chat-message-flex chat-message-start"
                >
                  <div className="chat-avatar chat-avatar-bot">
                    <Bot style={{ width: '1.25rem', height: '1.25rem', color: '#10b981' }} />
                  </div>
                  <div className="chat-typing-indicator">
                    <motion.div
                      className="chat-typing-dot"
                      animate={{ y: [-5, 5, -5] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    />
                    <motion.div
                      className="chat-typing-dot"
                      animate={{ y: [-5, 5, -5] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="chat-typing-dot"
                      animate={{ y: [-5, 5, -5] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="chat-input-container">
              {selectedFile && (
                <motion.div
                  className="chat-file-preview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <FileText style={{ width: '1.25rem', height: '1.25rem', color: '#2563eb' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1e293b' }}>
                      {selectedFile.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {selectedFile.size}
                    </div>
                  </div>
                  <button
                    className="chat-icon-btn"
                    style={{ color: '#ef4444' }}
                    onClick={() => setSelectedFile(null)}
                  >
                    <X style={{ width: '1rem', height: '1rem' }} />
                  </button>
                </motion.div>
              )}

              <div className="chat-input-wrapper">
                <div className="chat-input-flex">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your health question or symptoms..."
                    className="chat-message-input"
                  />

                  <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />

                  <motion.button
                    className="chat-icon-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip style={{ width: '1.1rem', height: '1.1rem' }} />
                  </motion.button>

                  <motion.button
                    className={`chat-icon-btn ${isRecording ? 'chat-icon-btn-active' : ''}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleVoiceInput}
                    animate={isRecording ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: isRecording ? Infinity : 0 }}
                  >
                    <Mic style={{ width: '1.1rem', height: '1.1rem' }} />
                  </motion.button>
                </div>

                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() && !selectedFile}
                  className="chat-send-btn"
                  whileHover={inputValue.trim() || selectedFile ? { scale: 1.05 } : {}}
                  whileTap={inputValue.trim() || selectedFile ? { scale: 0.95 } : {}}
                  animate={(inputValue.trim() || selectedFile) ? {
                    boxShadow: [
                      "0 4px 15px rgba(59, 130, 246, 0.3)",
                      "0 6px 25px rgba(59, 130, 246, 0.5)",
                      "0 4px 15px rgba(59, 130, 246, 0.3)"
                    ]
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Send style={{ width: '1.25rem', height: '1.25rem' }} />
                </motion.button>
              </div>

              <motion.div
                className="chat-disclaimer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <AlertTriangle style={{ width: '0.9rem', height: '0.9rem' }} />
                <span>For emergencies, call 911. This AI provides information only, not medical advice.</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
