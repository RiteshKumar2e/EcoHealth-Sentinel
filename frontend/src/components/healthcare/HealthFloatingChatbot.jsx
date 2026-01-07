import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, X, MessageSquare, Sparkles, User, Heart, Activity, AlertTriangle } from 'lucide-react';
import './HealthFloatingChatbot.css';

const HealthFloatingChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: "Hello! I'm your AI PatientAid Assistant. I'm here to help you understand your health metrics and provide general wellness guidance. How can I help you today?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = {
            role: "user",
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMsg]);
        const userInput = input;
        setInput("");
        setLoading(true);

        try {
            const sessionId = localStorage.getItem('healthChatSessionId') || `health-${Date.now()}`;
            localStorage.setItem('healthChatSessionId', sessionId);

            const response = await fetch('http://localhost:5000/api/chatbot', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userInput,
                    sessionId: sessionId,
                    domain: 'healthcare'
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessages(prev => [...prev, {
                    role: "bot",
                    text: data.response,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            } else {
                throw new Error(data.error || 'Failed to get response');
            }
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, {
                role: "bot",
                text: "⚠️ Unable to connect to my medical knowledge base. Please check your connection or try again later.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="health-floating-wrapper">
            {/* Toggle Button */}
            {!isOpen && (
                <button className="health-chat-trigger" onClick={() => setIsOpen(true)}>
                    <div className="trigger-icon-container">
                        <Heart size={28} color="white" fill="white" className="heart-pulse" />
                        <Activity className="activity-overlay" size={12} color="#10b981" strokeWidth={3} />
                    </div>
                    <div className="trigger-pulse"></div>
                </button>
            )}

            {/* Chat Panel */}
            <div className={`health-chat-panel ${isOpen ? 'open' : ''}`}>
                <header className="health-panel-header">
                    <div className="header-status-badge">
                        <div className="status-dot"></div>
                        <span>Secure AI Link Active</span>
                    </div>
                    <div className="header-title-main">
                        <div className="header-bot-icon">
                            <Bot size={22} color="white" strokeWidth={2.5} />
                        </div>
                        <div className="header-text">
                            <h3>PatientAid AI</h3>
                            <p>Health Companion</p>
                        </div>
                    </div>
                    <button className="close-btn" onClick={() => setIsOpen(false)}>
                        <X size={20} />
                    </button>
                </header>

                <div className="health-panel-body">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`health-msg-row ${msg.role}`}>
                            <div className="health-msg-bubble">
                                <p>{msg.text}</p>
                                <span className="msg-time">{msg.time}</span>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="health-msg-row bot">
                            <div className="health-msg-bubble thinking">
                                <Sparkles size={14} className="sparkle-anim" />
                                <span>Analyzing symptoms...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="health-panel-footer">
                    <div className="disclaimer-mini">
                        <AlertTriangle size={10} />
                        AI Info Only • Call 911 for Emergencies
                    </div>
                    <div className="health-input-box">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask me anything about your health..."
                            disabled={loading}
                        />
                        <button
                            className={`health-send-btn ${input.trim() ? 'active' : ''}`}
                            onClick={handleSendMessage}
                            disabled={!input.trim() || loading}
                        >
                            {loading ? <Sparkles size={18} className="sparkle-anim" /> : <Send size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthFloatingChatbot;
