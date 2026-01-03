import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, FileText, Download, Bot, User, Loader, CheckCircle, AlertCircle, TrendingUp, Droplet, Sun, DollarSign, X, Trash2, RefreshCw } from 'lucide-react';
import './ReportsChatbot.css';

const ReportsChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I\'m your AgriBot assistant. I can help you generate reports, answer farming questions, and provide insights. What would you like to know?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [messageCount, setMessageCount] = useState(1);
  const messagesEndRef = useRef(null);

  // Backend API configuration (Placeholder)
  // eslint-disable-next-line no-unused-vars
  const API_CONFIG = {
    baseURL: 'https://api.yourfarm.com/v1',
    endpoints: {
      chat: '/chat/message',
      reports: '/reports/generate',
      download: '/reports/download',
      weather: '/weather/forecast',
      market: '/market/prices'
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY_HERE'
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // Simulate backend API call
  const callBackendAPI = async (endpoint, data) => {
    try {
      // PRODUCTION: Uncomment this for real API integration
      /*
      const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
        method: 'POST',
        headers: API_CONFIG.headers,
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
      */

      // DEMO MODE: Simulated response
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(generateResponse(data.message));
        }, 1500);
      });
    } catch (error) {
      console.error('API Error:', error);
      setIsConnected(false);
      showNotification('Backend connection failed. Using offline mode.', 'error');
      throw error;
    }
  };

  // AI Response Engine - API-driven responses
  const generateResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();

    // Report generation with proper metadata
    if (lowerMsg.includes('report') || lowerMsg.includes('generate')) {
      if (lowerMsg.includes('crop') || lowerMsg.includes('yield')) {
        return {
          text: 'I\'ve generated your Crop Yield Report with the following insights:\n\nTotal Yield: 4,850 kg/hectare\nIncrease from last season: 15%\nEstimated revenue: ₹1,21,250\nTop performing crop: Wheat (32% of total)\n\nClick below to download the detailed PDF report.',
          hasReport: true,
          reportType: 'Crop Yield Analysis',
          reportData: {
            id: 'crop_' + Date.now(),
            filename: `crop_yield_report_${new Date().toISOString().split('T')[0]}.pdf`,
            size: '2.4 MB',
            generated: new Date().toLocaleString(),
            reportType: 'Crop Yield Analysis'
          }
        };
      }
      if (lowerMsg.includes('soil') || lowerMsg.includes('nutrient')) {
        return {
          text: 'Soil Health Report has been generated:\n\nNitrogen (N): 45 ppm - Needs improvement\nPhosphorus (P): 38 ppm - Adequate\nPotassium (K): 52 ppm - Good\npH Level: 6.8 - Optimal\n\nRecommendation: Add 50kg urea-based fertilizer per hectare to boost nitrogen levels.',
          hasReport: true,
          reportType: 'Soil Health Report',
          reportData: {
            id: 'soil_' + Date.now(),
            filename: `soil_health_report_${new Date().toISOString().split('T')[0]}.pdf`,
            size: '1.8 MB',
            generated: new Date().toLocaleString(),
            reportType: 'Soil Health Report'
          }
        };
      }
      if (lowerMsg.includes('water') || lowerMsg.includes('irrigation')) {
        return {
          text: 'Water Management Report generated successfully:\n\nTotal consumption: 450L this week\nReduction vs. last month: 30%\nEfficiency score: 92%\nCost savings: ₹3,200\n\nYour smart irrigation system is performing excellently! Download the full report for detailed analytics.',
          hasReport: true,
          reportType: 'Water Management Report',
          reportData: {
            id: 'water_' + Date.now(),
            filename: `water_usage_report_${new Date().toISOString().split('T')[0]}.pdf`,
            size: '1.5 MB',
            generated: new Date().toLocaleString(),
            reportType: 'Water Management Report'
          }
        };
      }
      // Generic report request
      return {
        text: 'I can generate the following reports for you:\n\n1. Crop Yield Analysis\n2. Soil Health Report\n3. Water Management Report\n4. Pest Control Summary\n5. Market Price Trends\n\nWhich report would you like me to generate?'
      };
    }

    if (lowerMsg.includes('disease') || lowerMsg.includes('pest')) {
      return {
        text: 'Based on current weather and crop conditions, here are pest management recommendations:\n\n1. Monitor for aphids in tomato and cotton crops\n2. Apply neem oil spray (5ml/L) as prevention\n3. Check leaf undersides weekly for early detection\n4. Maintain 30-45cm plant spacing\n5. Remove infected leaves immediately\n\nWould you like specific treatment recommendations or a pest control report?'
      };
    }

    if (lowerMsg.includes('fertilizer') || lowerMsg.includes('nutrient')) {
      return {
        text: 'Based on your crop stage and soil analysis, I recommend:\n\nNPK ratio: 10-26-26\nApplication method: Split in 3 doses\nSchedule: Days 0, 15, 30 after sowing\nQuantity: 150 kg/hectare\nEstimated cost: ₹850/hectare\n\nOrganic alternative: Vermicompost (5 tons/hectare) + neem cake (200kg/hectare)\n\nWould you like a detailed fertilizer schedule report?'
      };
    }

    if (lowerMsg.includes('price') || lowerMsg.includes('market')) {
      return {
        text: 'Current market prices (updated today):\n\nTomato: ₹25/kg (↑ 8% this week)\nWheat: ₹22/kg (↑ 13% forecast)\nRice: ₹28/kg (↓ 11% expected)\nCotton: ₹6,500/quintal (stable)\n\nBest selling window: Next 3-4 days for tomatoes\nNearby mandis: Check Azadpur, Ghazipur\n\nWould you like detailed 7-day price predictions?'
      };
    }

    if (lowerMsg.includes('weather') || lowerMsg.includes('forecast')) {
      return {
        text: '7-Day Weather Forecast for your location:\n\nToday: Sunny, 28°C, Humidity 65%\nTomorrow: Partly cloudy, 26°C\nDay 3-4: Light rain expected (10-15mm)\nDay 5-7: Clear skies, 25-27°C\n\nFarming recommendations:\n• Postpone irrigation till Day 5\n• Apply fertilizers after rain (Day 5)\n• Good conditions for sowing from Day 5\n\nWould you like hourly weather updates?'
      };
    }

    if (lowerMsg.includes('help') || lowerMsg.includes('what can you')) {
      return {
        text: 'I\'m your AgriBot AI assistant. Here\'s what I can help you with:\n\n📊 Generate Reports:\n• Crop yield analysis\n• Soil health assessment\n• Water usage tracking\n\n🌱 Farm Management:\n• Pest & disease identification\n• Fertilizer recommendations\n• Irrigation scheduling\n\n💰 Market Intelligence:\n• Real-time crop prices\n• Best selling windows\n• Nearby mandi information\n\n🌤️ Weather:\n• 7-day forecasts\n• Rainfall predictions\n• Farming activity suggestions\n\nJust ask me anything about your farm!'
      };
    }

    if (lowerMsg.includes('thank') || lowerMsg.includes('thanks')) {
      return {
        text: 'You\'re welcome! I\'m here 24/7 to help you grow better crops and make smarter farming decisions. Feel free to ask anything else or request any reports you need.'
      };
    }

    // Default intelligent response
    return {
      text: 'I understand you\'re asking about farming. I can help with:\n\n• Generate reports (yield, soil, water)\n• Crop health & disease management\n• Fertilizer & nutrient recommendations\n• Irrigation scheduling\n• Market prices & forecasts\n• Weather updates\n\nCould you please be more specific about what information you need?'
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = {
      id: messages.length + 1,
      sender: 'user',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setMessageCount(prev => prev + 1);
    const queryText = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call backend API
      const response = await callBackendAPI(API_CONFIG.endpoints.chat, {
        message: queryText,
        userId: 'demo_user_123',
        sessionId: Date.now(),
        messageCount: messageCount
      });

      const botMsg = {
        id: messages.length + 2,
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toLocaleTimeString(),
        hasReport: response.hasReport,
        reportType: response.reportType,
        reportData: response.reportData
      };

      setMessages(prev => [...prev, botMsg]);
      setMessageCount(prev => prev + 1);

      if (response.hasReport) {
        showNotification(`Report generated: ${response.reportType}`, 'success');
      }
    } catch (error) {
      const errorMsg = {
        id: messages.length + 2,
        sender: 'bot',
        text: 'Sorry, I\'m having trouble connecting to the server. Please try again in a moment.',
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
      showNotification('Connection error. Please check your internet.', 'error');
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: 'Hello! I\'m your AgriBot assistant. I can help you generate reports, answer farming questions, and provide insights. What would you like to know?',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    setMessageCount(1);
    showNotification('Chat history cleared', 'success');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDownloadReport = async (reportData) => {
    showNotification(`Preparing ${reportData.filename} for download...`, 'success');

    try {
      // DEMO MODE: Generate sample PDF
      setTimeout(() => {
        generateAndDownloadPDF(reportData);
        showNotification(`${reportData.filename} downloaded successfully!`, 'success');
      }, 1000);

    } catch (error) {
      console.error('Download error:', error);
      showNotification('Download failed. Please try again.', 'error');
    }
  };

  // Generate sample PDF for demo
  const generateAndDownloadPDF = (reportData) => {
    // Create PDF content
    const pdfContent = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj
4 0 obj
<<
/Length 200
>>
stream
BT
/F1 24 Tf
50 750 Td
(${reportData.reportType || 'AgriBot Report'}) Tj
/F1 12 Tf
50 700 Td
(Generated: ${reportData.generated || new Date().toLocaleDateString()}) Tj
50 670 Td
(This is a sample report generated by AgriBot AI Assistant.) Tj
50 640 Td
(For production use, connect to your backend API.) Tj
ET
endstream
endobj
5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000274 00000 n
0000000524 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
609
%%EOF`;

    // Convert to blob and download
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = reportData.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const quickActions = [
    { text: 'Generate yield report', icon: TrendingUp },
    { text: 'Soil health status', icon: FileText },
    { text: 'Water usage this month', icon: Droplet },
    { text: 'Market prices today', icon: DollarSign },
    { text: 'Weather forecast', icon: Sun }
  ];

  return (
    <div className="reports-chatbot-container">
      {/* Notification */}
      {notification && (
        <div className={`notification-toast fade-in ${notification.type === 'success' ? 'notif-success' : 'notif-error'}`}>
          {notification.type === 'success' ? (
            <CheckCircle style={{ width: '20px', height: '20px', color: '#10B981', flexShrink: 0 }} />
          ) : (
            <AlertCircle style={{ width: '20px', height: '20px', color: '#EF4444', flexShrink: 0 }} />
          )}
          <span className={`notif-text ${notification.type === 'success' ? 'notif-text-success' : 'notif-text-error'}`}>
            {notification.message}
          </span>
          <button
            onClick={() => setNotification(null)}
            className="notif-close"
          >
            <X style={{ width: '16px', height: '16px', color: notification.type === 'success' ? '#065F46' : '#991B1B' }} />
          </button>
        </div>
      )}

      <div className="chatbot-wrapper">
        {/* Header */}
        <div className="chat-header">
          <div className="header-content">
            <div className="header-title-section">
              <div className="bot-avatar-large">
                <Bot style={{ width: '32px', height: '32px', color: 'white' }} />
              </div>
              <div>
                <h1 className="header-title">AgriBot Assistant</h1>
                <p className="header-subtitle">AI-powered farming insights & reports</p>
              </div>
            </div>
            <div className={`status-badge ${isConnected ? 'status-connected' : 'status-disconnected'}`}>
              <div className={`status-dot ${isConnected ? 'status-pulse' : ''}`} style={{ background: isConnected ? '#10B981' : '#EF4444' }}></div>
              <span style={{ color: isConnected ? '#065F46' : '#991B1B', fontWeight: '600', fontSize: '13px' }}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <button
              onClick={handleClearChat}
              className="clear-chat-btn"
            >
              <Trash2 style={{ width: '14px', height: '14px' }} />
              Clear Chat
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="chat-main-card">
          {/* Messages Area */}
          <div className="chat-scroll-area">
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`message-enter message-row ${msg.sender === 'user' ? 'message-row-user' : 'message-row-bot'}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`avatar-small ${msg.sender === 'bot' ? 'avatar-bot' : 'avatar-user'}`}>
                  {msg.sender === 'bot' ? (
                    <Bot style={{ width: '22px', height: '22px', color: 'white' }} />
                  ) : (
                    <User style={{ width: '22px', height: '22px', color: 'white' }} />
                  )}
                </div>

                <div className={`message-bubble-wrapper ${msg.sender === 'user' ? 'wrapper-right' : 'wrapper-left'}`}>
                  <div className={`message-bubble ${msg.sender === 'bot' ? (msg.isError ? 'bubble-bot-error' : 'bubble-bot') : 'bubble-user'}`}>
                    <p className="message-text">
                      {msg.text}
                    </p>

                    {msg.hasReport && msg.reportData && (
                      <button
                        onClick={() => handleDownloadReport(msg.reportData)}
                        className="download-btn"
                      >
                        <Download style={{ width: '16px', height: '16px' }} />
                        Download {msg.reportType}
                        <span style={{ fontSize: '11px', opacity: 0.8 }}>({msg.reportData.size})</span>
                      </button>
                    )}
                  </div>
                  <p className="timestamp">
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message-enter message-row message-row-bot">
                <div className="avatar-small avatar-bot">
                  <Bot style={{ width: '22px', height: '22px', color: 'white' }} />
                </div>
                <div className="typing-indicator-box">
                  <div className="typing-dots-flex">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-area">
            <p className="quick-actions-label">
              Quick Actions:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputMessage(action.text)}
                  className="quick-action-btn"
                >
                  <action.icon style={{ width: '14px', height: '14px' }} />
                  {action.text}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="input-area">
            <div className="input-flex">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about crops, reports, weather, market prices..."
                disabled={!isConnected}
                className="chat-input"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || !isConnected}
                className="send-btn"
              >
                {isTyping ? (
                  <Loader className="spin-anim" style={{ width: '20px', height: '20px' }} />
                ) : (
                  <Send style={{ width: '20px', height: '20px' }} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsChatbot;