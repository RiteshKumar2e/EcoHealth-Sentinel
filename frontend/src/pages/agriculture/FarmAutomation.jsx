import React, { useEffect, useRef, useState, useMemo } from "react";
import { Power, Zap, Clock, Activity, Shield, Send, TrendingUp } from "lucide-react";
import './FarmAutomation.css';

const SENSOR_COLORS = {
  irrigation: "#2DD4BF",
  fertilizer: "#FBBF24",
  pest: "#FB7185",
  sensor: "#60A5FA",
};

const FarmAutomation = () => {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "Irrigation System A",
      type: "irrigation",
      status: "active",
      mode: "auto",
      schedule: "6:00 AM - 8:00 AM",
      waterFlow: 45,
      energyUsage: 2.3,
      aiOptimized: true,
    },
    {
      id: 2,
      name: "Fertilizer Dispenser",
      type: "fertilizer",
      status: "idle",
      mode: "auto",
      schedule: "Every 3 days",
      lastRun: "2 days ago",
      energyUsage: 0.5,
      aiOptimized: true,
    },
    {
      id: 3,
      name: "Pest Control Sprayer",
      type: "pest",
      status: "idle",
      mode: "manual",
      schedule: "As needed",
      lastRun: "5 days ago",
      energyUsage: 0,
      aiOptimized: false,
    },
    {
      id: 4,
      name: "Weather Station",
      type: "sensor",
      status: "active",
      mode: "auto",
      temperature: 28,
      humidity: 72,
      energyUsage: 0.1,
      aiOptimized: true,
    },
  ]);

  const [automationRules, setAutomationRules] = useState([
    {
      id: 1,
      condition: "Soil moisture < 50%",
      action: "Activate irrigation for 30 minutes",
      enabled: true,
      triggered: 12,
    },
    {
      id: 2,
      condition: "Temperature > 35°C",
      action: "Increase irrigation by 20%",
      enabled: true,
      triggered: 3,
    },
    {
      id: 3,
      condition: "Disease detected",
      action: "Send alert + Schedule treatment",
      enabled: true,
      triggered: 1,
    },
  ]);

  const [chatMessages, setChatMessages] = useState([
    { id: "bot-1", author: "bot", text: "Hello! I'm your farm automation assistant. Ask me about devices status, energy optimization, or automation rules." },
  ]);
  const [chatText, setChatText] = useState("");
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const chatListRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const fetchDevices = async () => {
      setLoadingDevices(true);
      try {
        const res = await fetch("/api/devices");
        if (!mounted) return;
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json)) setDevices(json);
        }
      } catch (e) {
        console.log('Using local device data');
      } finally {
        if (mounted) setLoadingDevices(false);
      }
    };
    fetchDevices();
    const id = setInterval(fetchDevices, 30000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const toggleDevice = (deviceId) =>
    setDevices((ds) =>
      ds.map((device) =>
        device.id === deviceId ? { ...device, status: device.status === "active" ? "idle" : "active" } : device
      )
    );

  const toggleMode = (deviceId) =>
    setDevices((ds) => ds.map((device) => (device.id === deviceId ? { ...device, mode: device.mode === "auto" ? "manual" : "auto" } : device)));

  const toggleRule = (ruleId) => setAutomationRules((rs) => rs.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r)));

  const sendMessageToBot = async (messageText) => {
    if (!messageText || messageText.trim() === "") return;

    const userId = `user-${Date.now()}`;
    setChatMessages((m) => [...m, { id: userId, author: "you", text: messageText }]);
    setChatText("");
    setIsTyping(true);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ message: messageText }));
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          context: {
            devices: devices.map(d => ({ id: d.id, name: d.name, status: d.status, type: d.type })),
            rules: automationRules.map(r => ({ condition: r.condition, enabled: r.enabled }))
          }
        }),
      });
      const json = await (res.ok ? res.json() : Promise.resolve({ reply: "Sorry, chat service unavailable." }));
      setIsTyping(false);
      setChatMessages((m) => [...m, { id: `bot-${Date.now()}`, author: "bot", text: json.reply || String(json) }]);
    } catch (err) {
      setIsTyping(false);
      setChatMessages((m) => [...m, { id: `bot-${Date.now()}`, author: "bot", text: "Network error: cannot reach chat backend." }]);
    }
  };

  const handleChatKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessageToBot(chatText.trim());
    }
  };

  const totalEnergy = useMemo(() =>
    devices.reduce((s, d) => s + (Number(d.energyUsage) || 0), 0),
    [devices]
  );

  const activeDevices = useMemo(() =>
    devices.filter(d => d.status === 'active').length,
    [devices]
  );

  return (
    <div className="automation-container">
      <div className="automation-wrapper">

        {/* Header */}
        <div className="glass-card header-card">
          <div className="header-bg-glow"></div>

          <div className="header-content">
            <Zap className="header-icon" />
            <div>
              <h1 className="header-title">Farm Automation</h1>
              <p className="header-subtitle">AI-driven device control with real-time monitoring</p>
            </div>
          </div>

          <div className="header-stats">
            <div className="stats-label">Total Energy</div>
            <div className="stats-value">{totalEnergy.toFixed(1)} kW</div>
            <div className="stats-subtext">{activeDevices} of {devices.length} devices active</div>
          </div>
        </div>

        {/* Left: Devices */}
        <div className="device-grid">
          {devices.map((device) => (
            <div key={device.id} className="glass-card device-card" style={{ borderLeft: `4px solid ${SENSOR_COLORS[device.type]}` }}>
              <div className="device-glow" style={{ background: `radial-gradient(circle, ${SENSOR_COLORS[device.type]}20 0%, transparent 70%)` }} />

              <div className="device-header">
                <div className="device-info">
                  <div className={`status-dot ${device.status === 'active' ? 'active-dot' : 'idle-dot'}`} />
                  <div>
                    <div className="device-name">{device.name}</div>
                    <div className="device-type">{device.type}</div>
                  </div>
                </div>

                {device.aiOptimized && (
                  <div className="ai-badge">
                    <Shield className="ai-icon" />
                    AI
                  </div>
                )}
              </div>

              <div className="device-actions">
                <button
                  onClick={() => toggleDevice(device.id)}
                  className={`toggle-btn ${device.status === 'active' ? 'btn-active' : 'btn-inactive'}`}
                >
                  {device.status === 'active' ? 'Turn Off' : 'Turn On'}
                </button>

                <button
                  onClick={() => toggleMode(device.id)}
                  className={`mode-btn ${device.mode === 'auto' ? 'mode-auto' : 'mode-manual'}`}
                >
                  {device.mode}
                </button>
              </div>

              <div className="device-metrics">
                {device.waterFlow && (
                  <div>
                    <div className="metric-value">{device.waterFlow} L/min</div>
                    <div className="metric-label">Water Flow</div>
                    <div className="progress-container" style={{ width: `${Math.min(100, device.waterFlow)}%` }}>
                      <div className="progress-shimmer"></div>
                    </div>
                  </div>
                )}

                {device.temperature && (
                  <div>
                    <div className="metric-value">{device.temperature}°C</div>
                    <div className="metric-label">Temperature</div>
                  </div>
                )}

                {device.humidity && (
                  <div>
                    <div className="metric-value">{device.humidity}%</div>
                    <div className="metric-label">Humidity</div>
                  </div>
                )}

                <div>
                  <div className="metric-value">{device.energyUsage} kW</div>
                  <div className="metric-label">Energy</div>
                </div>

                <div>
                  <div className="metric-value" style={{ fontSize: 12 }}>{device.schedule}</div>
                  <div className="metric-label">Schedule</div>
                </div>
              </div>
            </div>
          ))}

          {/* Rules */}
          <div className="glass-card rules-section">
            <div className="rules-header">
              <TrendingUp className="rules-icon" />
              <h2 className="rules-title">AI Automation Rules</h2>
            </div>

            {automationRules.map((rule) => (
              <div key={rule.id} className={`rule-item ${rule.enabled ? 'rule-enabled' : 'rule-disabled'}`}>
                <div>
                  <div className="rule-info-if">IF: {rule.condition}</div>
                  <div className="rule-info-then">THEN: {rule.action}</div>
                  <div className="rule-triggered">Triggered {rule.triggered}x</div>
                </div>

                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`rule-btn ${rule.enabled ? 'mode-auto' : 'mode-manual'}`}
                >
                  {rule.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Chat & Impact */}
        <div className="right-panel">
          {/* Impact */}
          <div className="glass-card impact-card">
            <h3 className="impact-title">Automation Impact</h3>

            <div className="impact-grid">
              {[
                { value: '60%', label: 'Labor Saved' },
                { value: '35%', label: 'Energy Efficiency' },
                { value: '24/7', label: 'Monitoring' },
                { value: 'Zero', label: 'Human Errors' }
              ].map((item, i) => (
                <div key={i} className="impact-item">
                  <div className="impact-value">{item.value}</div>
                  <div className="impact-label">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="glass-card chat-card">
            <h3 className="chat-title">Assistant</h3>

            <div ref={chatListRef} className="chat-messages">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`chat-message ${msg.author === 'you' ? 'msg-user' : 'msg-bot'}`}>
                  {msg.text}
                </div>
              ))}

              {isTyping && (
                <div className="typing-indicator">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              )}
            </div>

            <div className="chat-input-area">
              <textarea
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                onKeyDown={handleChatKey}
                placeholder="Ask about devices or energy..."
                className="chat-input"
                rows={2}
              />

              <button onClick={() => sendMessageToBot(chatText.trim())} className="send-btn">
                <Send style={{ width: 20, height: 20 }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmAutomation;