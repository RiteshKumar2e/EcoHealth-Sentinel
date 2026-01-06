import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Sun, Wind, Droplets, Zap, TrendingUp, Battery, DollarSign, Leaf, MessageSquare, Send, X, Mic, Download, RefreshCw, Bell, BarChart2, Maximize2, Minimize2, Users, Share2 } from 'lucide-react';
import './RenewableEnergy.css';

export default function RenewableEnergy() {
  const [selectedEnergy, setSelectedEnergy] = useState('all');
  const [timeRange, setTimeRange] = useState('month');
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [liveData, setLiveData] = useState(true);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const energyStats = [];
  const monthlyGeneration = [];
  const energyMix = [];
  const activeProjects = [];
  const aiPredictions = [];
  const renewableBenefits = [];
  const kpiMetrics = [];

  const energySources = [
    { type: 'Solar', icon: Sun, capacity: 2500, generation: 2180, efficiency: 87.2, color: '#f59e0b', bgColor: '#fef3c7', gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
    { type: 'Wind', icon: Wind, capacity: 1800, generation: 1440, efficiency: 80.0, color: '#3b82f6', bgColor: '#dbeafe', gradient: 'linear-gradient(135deg, #60a5fa, #3b82f6)' },
    { type: 'Hydro', icon: Droplets, capacity: 3200, generation: 2880, efficiency: 90.0, color: '#06b6d4', bgColor: '#cffafe', gradient: 'linear-gradient(135deg, #22d3ee, #06b6d4)' },
    { type: 'Biomass', icon: Leaf, capacity: 800, generation: 640, efficiency: 80.0, color: '#10b981', bgColor: '#d1fae5', gradient: 'linear-gradient(135deg, #34d399, #10b981)' }
  ];

  const [stats, setStats] = useState({
    totalCapacity: 0,
    currentGeneration: 0,
    co2Saved: 0,
    costSavings: 0,
    householdsPowered: 0
  });

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Solar efficiency increased by 3%', time: '5 mins ago', type: 'success' },
    { id: 2, message: 'Wind turbine maintenance scheduled', time: '1 hour ago', type: 'info' },
    { id: 3, message: 'New biomass project approved', time: '3 hours ago', type: 'success' }
  ]);

  const chatbotKnowledge = {
    greeting: ["👋 Hello! I'm your Renewable Energy AI Assistant. Ask me about energy production, efficiency, or sustainability!"],
    solar: [`Solar capacity: ${Math.round(stats.totalCapacity * 0.32)} kW generating ${Math.round(stats.currentGeneration * 0.32)} kW. Efficiency: 87.2%. Peak hours: 10 AM - 4 PM.`],
    wind: [`Wind capacity: ${Math.round(stats.totalCapacity * 0.21)} kW generating ${Math.round(stats.currentGeneration * 0.21)} kW. Efficiency: 80%. Optimal wind speed: 12-25 mph.`],
    hydro: [`Hydro capacity: ${Math.round(stats.totalCapacity * 0.38)} kW generating ${Math.round(stats.currentGeneration * 0.38)} kW. Efficiency: 90%. Most reliable 24/7 source.`],
    savings: [`Total savings: ₹${(stats.costSavings / 100000).toFixed(1)} Lakh/year. CO₂ reduction: ${(stats.co2Saved / 1000).toFixed(1)} tons. Powering ${stats.householdsPowered.toLocaleString()} homes!`],
    efficiency: [`Overall system efficiency: 85.8%. Solar: 87.2%, Wind: 80%, Hydro: 90%, Biomass: 80%. AI optimization increased efficiency by 12%.`]
  };

  useEffect(() => {
    if (autoRefresh && liveData) {
      const interval = setInterval(() => {
        updateLiveData();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, liveData]);

  useEffect(() => {
    if (showChatbot && chatMessages.length === 0) {
      setChatMessages([{
        id: 1,
        type: 'bot',
        text: chatbotKnowledge.greeting[0],
        timestamp: new Date(),
        suggestions: ['Solar Info', 'Cost Savings', 'Efficiency', 'Projects']
      }]);
    }
  }, [showChatbot]);

  useEffect(() => {
    scrollChatToBottom();
  }, [chatMessages]);

  const scrollChatToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const updateLiveData = () => {
    setStats(prev => ({
      ...prev,
      currentGeneration: prev.currentGeneration + Math.floor(Math.random() * 10 - 5),
      co2Saved: prev.co2Saved + Math.floor(Math.random() * 5)
    }));
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = chatInput.toLowerCase();
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';
      let suggestions = [];

      if (currentInput.includes('solar') || currentInput.includes('sun')) {
        botResponse = chatbotKnowledge.solar[0];
        suggestions = ['Wind Info', 'Hydro Info', 'Compare'];
      } else if (currentInput.includes('wind')) {
        botResponse = chatbotKnowledge.wind[0];
        suggestions = ['Solar Info', 'Efficiency'];
      } else if (currentInput.includes('hydro') || currentInput.includes('water')) {
        botResponse = chatbotKnowledge.hydro[0];
        suggestions = ['Biomass', 'Projects'];
      } else if (currentInput.includes('cost') || currentInput.includes('saving')) {
        botResponse = chatbotKnowledge.savings[0];
        suggestions = ['CO₂ Reduction', 'ROI'];
      } else if (currentInput.includes('efficiency')) {
        botResponse = chatbotKnowledge.efficiency[0];
        suggestions = ['Optimization', 'AI Features'];
      } else if (currentInput.includes('project')) {
        botResponse = `Active Projects:\n${projects.map(p => `• ${p.name} (${p.status}): ${p.completion}%`).join('\n')}`;
        suggestions = ['Timeline', 'Investment'];
      } else {
        botResponse = `I can help with:\n\n🌞 Solar, Wind, Hydro & Biomass\n💰 Cost savings & ROI\n📊 Efficiency data\n🏗️ Active projects\n🔮 Future predictions`;
        suggestions = ['Solar Info', 'Savings', 'Efficiency'];
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: botResponse,
        timestamp: new Date(),
        suggestions
      };

      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      if (voiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(botResponse.replace(/[🌞💰📊🏗️🔮•]/g, ''));
        window.speechSynthesis.speak(utterance);
      }
    }, 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    setChatInput(suggestion);
    inputRef.current?.focus();
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.onresult = (event) => {
        setChatInput(event.results[0][0].transcript);
      };
      recognition.start();
      showToast('🎤 Listening...');
    } else {
      showToast('❌ Voice not supported');
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      updateLiveData();
      setRefreshing(false);
      showToast('✅ Data refreshed!');
    }, 1000);
  };

  const downloadReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      stats,
      energySources,
      projects
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `renewable_energy_report_${Date.now()}.json`;
    a.click();
    showToast('✅ Report downloaded!');
  };

  const shareData = async () => {
    const text = `🌱 Renewable Energy Update\n\nCapacity: ${stats.totalCapacity} kW\nGeneration: ${stats.currentGeneration} kW\nCO₂ Saved: ${(stats.co2Saved / 1000).toFixed(1)} tons\nHomes Powered: ${stats.householdsPowered.toLocaleString()}`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (e) {
        navigator.clipboard.writeText(text);
        showToast('✅ Copied!');
      }
    } else {
      navigator.clipboard.writeText(text);
      showToast('✅ Copied!');
    }
  };

  const showToast = (msg) => {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.className = 'energy-toast';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  return (
    <div className={`renewable-energy-container ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      <div className="energy-main-wrapper" style={{ maxWidth: isFullscreen ? '100%' : '1400px' }}>
        {/* Header */}
        <div className="energy-card">
          <div className="flex-between flex-wrap gap-16">
            <div className="flex-center gap-16">
              <div className="header-icon-container">
                <Zap size={32} className="floating-icon" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-800 m-0">Renewable energy</h1>
                <p className="text-gray-500 m-0 flex-center gap-8 text-sm justify-start">
                  <Leaf size={16} className="text-green-500" />
                  AI-optimized clean energy • Real-time monitoring
                </p>
              </div>
            </div>
            <div className="flex-center gap-12 flex-wrap">
              <button onClick={() => setShowNotifications(!showNotifications)} className="btn btn-blue-gradient pos-relative">
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="notification-badge">{notifications.length}</span>
                )}
              </button>
              <button onClick={downloadReport} className="btn btn-amber-gradient">
                <Download size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stat-grid">
          <div className="stat-card stat-amber">
            <Zap size={32} className="floating-icon mb-12" />
            <p className="text-sm opacity-0-9 mb-4 m-0">Total Capacity</p>
            <p className="text-4xl font-extrabold mb-4 m-0">{stats.totalCapacity.toLocaleString()}</p>
            <p className="text-xs opacity-0-8 m-0">kW</p>
          </div>

          <div className="stat-card stat-green">
            <TrendingUp size={32} className="floating-icon mb-12" />
            <p className="text-sm opacity-0-9 mb-4 m-0">Current Output</p>
            <p className="text-4xl font-extrabold mb-4 m-0">{stats.currentGeneration.toLocaleString()}</p>
            <p className="text-xs opacity-0-8 m-0 flex-center gap-4 justify-start">
              kW {liveData && <span className="live-dot"></span>} Live
            </p>
          </div>

          <div className="stat-card stat-blue">
            <Leaf size={32} className="floating-icon mb-12" />
            <p className="text-sm opacity-0-9 mb-4 m-0">CO₂ Saved</p>
            <p className="text-4xl font-extrabold mb-4 m-0">{(stats.co2Saved / 1000).toFixed(1)}</p>
            <p className="text-xs opacity-0-8 m-0">tons/year</p>
          </div>

          <div className="stat-card stat-purple">
            <DollarSign size={32} className="floating-icon mb-12" />
            <p className="text-sm opacity-0-9 mb-4 m-0">Cost Savings</p>
            <p className="text-4xl font-extrabold mb-4 m-0">₹{(stats.costSavings / 100000).toFixed(1)}</p>
            <p className="text-xs opacity-0-8 m-0">Lakh/year</p>
          </div>

          <div className="stat-card stat-cyan">
            <Users size={32} className="floating-icon mb-12" />
            <p className="text-sm opacity-0-9 mb-4 m-0">Households</p>
            <p className="text-4xl font-extrabold mb-4 m-0">{(stats.householdsPowered / 1000).toFixed(1)}K</p>
            <p className="text-xs opacity-0-8 m-0">powered</p>
          </div>
        </div>

        {/* Energy Sources */}
        <div className="source-grid">
          {energySources.map((source, index) => {
            const Icon = source.icon;
            return (
              <div key={index} className="source-card" style={{ background: source.bgColor }}>
                <div className="flex-between mb-16">
                  <div className="source-icon-container" style={{ background: source.gradient }}>
                    <Icon size={28} className="white-text floating-icon" />
                  </div>
                  <span className="source-badge" style={{ color: source.color }}>
                    {source.efficiency}%
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-12 m-0">{source.type} Energy</h3>
                <div className="mb-12">
                  <div className="flex-between text-sm mb-4">
                    <span className="text-gray-500">Capacity:</span>
                    <span className="font-bold text-gray-800">{source.capacity} kW</span>
                  </div>
                  <div className="flex-between text-sm">
                    <span className="text-gray-500">Generation:</span>
                    <span className="font-bold text-gray-800">{source.generation} kW</span>
                  </div>
                </div>
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${source.efficiency}%`, background: source.gradient }}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          <div className="energy-card chart-card-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-16">Monthly Energy Generation</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyGeneration}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Bar dataKey="solar" stackId="a" fill="#f59e0b" name="Solar" radius={[4, 4, 0, 0]} />
                <Bar dataKey="wind" stackId="a" fill="#3b82f6" name="Wind" />
                <Bar dataKey="hydro" stackId="a" fill="#06b6d4" name="Hydro" />
                <Bar dataKey="biomass" stackId="a" fill="#10b981" name="Biomass" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="energy-card">
            <h2 className="text-lg font-bold text-gray-800 mb-16">Energy Mix Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={energyMix}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {energyMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projects */}
        <div className="energy-card mb-24">
          <h2 className="text-2xl font-bold text-gray-800 mb-16">Active & Planned Projects</h2>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div key={index} className="project-item">
                <div className="flex-between flex-start mb-12">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-4 m-0 text-lg">{project.name}</h3>
                    <p className="text-sm text-gray-500 m-0">{project.type} • {project.capacity} kW</p>
                  </div>
                  <span className="status-badge" style={{
                    background: project.status === 'Operational' ? '#10b981' : project.status === 'In Progress' ? '#3b82f6' : '#f59e0b'
                  }}>
                    {project.status}
                  </span>
                </div>
                <div className="mb-12">
                  <div className="flex-between text-sm mb-6">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-bold text-gray-800">{project.completion}%</span>
                  </div>
                  <div className="progress-container">
                    <div className="progress-bar project-progress-bar" style={{ width: `${project.completion}%` }}></div>
                  </div>
                </div>
                <div className="grid grid-2-col gap-12">
                  <div className="text-sm">
                    <p className="text-gray-500 mb-4 m-0">Investment</p>
                    <p className="font-bold text-gray-800 m-0">₹{(project.investment / 100000).toFixed(1)}L</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-500 mb-4 m-0">Completion</p>
                    <p className="font-bold text-gray-800 m-0">{project.expectedCompletion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predictions Chart */}
        <div className="energy-card mb-24">
          <h2 className="text-2xl font-bold text-gray-800 mb-16">AI-Powered Growth Predictions</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={predictions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="capacity" stroke="#3b82f6" strokeWidth={3} name="Capacity (kW)" dot={{ r: 6 }} />
              <Line type="monotone" dataKey="generation" stroke="#10b981" strokeWidth={3} name="Generation (kW)" dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Benefits */}
        <div className="benefits-grid">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="energy-card" style={{ background: benefit.bgColor }}>
                <Icon size={32} style={{ color: benefit.color }} className="mb-12" />
                <h3 className="font-bold text-gray-800 mb-8 m-0 text-lg">{benefit.title}</h3>
                <div className="flex-center justify-start mb-8 items-baseline">
                  <span className="text-4xl font-extrabold" style={{ color: benefit.color }}>{benefit.value}</span>
                  <span className="text-sm text-gray-500 ml-8">{benefit.unit}</span>
                </div>
                <p className="text-xs text-gray-500 m-0">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* AI Optimization Info */}
        <div className="ai-optimization-banner">
          <div className="flex-start gap-24">
            <Zap size={40} className="floating-icon flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold mb-16 m-0">AI-Powered Energy Optimization</h2>
              <div className="ai-knowledge-grid">
                <div className="ai-knowledge-item">
                  <h3 className="font-bold mb-8 m-0 text-lg">🤖 Smart Load Balancing</h3>
                  <p className="text-sm opacity-0-9 m-0 lh-1-6">AI algorithms dynamically distribute power based on weather, demand, and efficiency.</p>
                </div>
                <div className="ai-knowledge-item">
                  <h3 className="font-bold mb-8 m-0 text-lg">📊 Predictive Maintenance</h3>
                  <p className="text-sm opacity-0-9 m-0 lh-1-6">ML models predict failures, reducing downtime by 40%.</p>
                </div>
                <div className="ai-knowledge-item">
                  <h3 className="font-bold mb-8 m-0 text-lg">☀️ Weather Forecasting</h3>
                  <p className="text-sm opacity-0-9 m-0 lh-1-6">AI predicts patterns for optimal energy planning.</p>
                </div>
                <div className="ai-knowledge-item">
                  <h3 className="font-bold mb-8 m-0 text-lg">⚡ Grid Optimization</h3>
                  <p className="text-sm opacity-0-9 m-0 lh-1-6">Real-time AI balances generation with demand.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chatbot */}
      {showChatbot && (
        <div className="chat-panel">
          <div className="chat-header">
            <div className="flex-center gap-12">
              <Zap size={24} />
              <div>
                <p className="font-bold text-lg m-0">Energy AI Assistant</p>
                <p className="text-sm opacity-0-9 m-0">Online</p>
              </div>
            </div>
            <div className="flex-center gap-8">
              <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="p-8 border-none br-8 cursor-pointer voice-btn" style={{ background: voiceEnabled ? '#10b981' : 'rgba(255,255,255,0.2)' }}>
                <Mic size={18} className="white-text" />
              </button>
              <button onClick={() => setShowChatbot(false)} className="p-8 border-none br-8 cursor-pointer bg-trans-white-2 color-white">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {chatMessages.map((msg) => (
              <div key={msg.id}>
                <div className={`message-bubble ${msg.type === 'user' ? 'message-user' : 'message-bot'}`}>
                  {msg.text}
                </div>
                {msg.suggestions && (
                  <div className="flex-wrap gap-8 d-flex mt-8">
                    {msg.suggestions.map((sug, i) => (
                      <button key={i} onClick={() => handleSuggestionClick(sug)} className="suggestion-btn">{sug}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
                <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>

          <div className="chat-input-wrapper">
            <input ref={inputRef} type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleChatSend()} placeholder="Ask about renewable energy..." className="chat-input" />
            <button onClick={handleVoiceInput} className="p-12 border-none br-12 cursor-pointer bg-gray-100">
              <Mic size={20} className="text-gray-500" />
            </button>
            <button onClick={handleChatSend} className="p-12 border-none br-12 cursor-pointer text-white btn-green-gradient">
              <Send size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Notifications */}
      {showNotifications && (
        <div className="notification-panel">
          <div className="flex-between mb-16">
            <h3 className="font-bold text-lg text-gray-800 m-0">Notifications</h3>
            <button onClick={() => setShowNotifications(false)} className="p-4 border-none cursor-pointer bg-transparent">
              <X size={18} className="text-gray-500" />
            </button>
          </div>
          {notifications.map(notif => (
            <div key={notif.id} className={`p-12 br-8 mb-8 ${notif.type === 'success' ? 'bg-green-100' : 'bg-blue-100'}`}>
              <p className="text-sm font-bold text-gray-800 mb-4 m-0">{notif.message}</p>
              <p className="text-xs text-gray-500 m-0">{notif.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
