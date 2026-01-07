import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, X, Sparkles, Leaf, Recycle, AlertTriangle, Wind } from 'lucide-react';
import './EnvironmentFloatingChatbot.css';

const EnvironmentFloatingChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: "Hello! I'm your AI EcoSentinel Assistant. I'm here to help you monitor environmental metrics, understand climate data, and provide eco-friendly tips. How can I help you today?",
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
            const sessionId = localStorage.getItem('chatSessionId') || `env-${Date.now()}`;
            localStorage.setItem('chatSessionId', sessionId);

            const response = await fetch('http://localhost:5000/api/chatbot', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userInput,
                    sessionId: sessionId,
                    domain: 'environment'
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
                text: "⚠️ Unable to connect to the eco-knowledge base. Please check your connection or try again later.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="env-floating-wrapper">
            {/* Toggle Button */}
            {!isOpen && (
                <button className="env-chat-trigger" onClick={() => setIsOpen(true)}>
                    <div className="trigger-icon-container">
                        <Leaf size={28} color="white" fill="white" className="leaf-bounce" />
                        <div className="activity-overlay">
                            <Wind size={12} color="#10b981" />
                        </div>
                    </div>
                    <div className="trigger-pulse"></div>
                </button>
            )}

            {/* Chat Panel */}
            <div className={`env-chat-panel ${isOpen ? 'open' : ''}`}>
                <header className="env-panel-header">
                    <div className="header-status-badge">
                        <div className="status-dot"></div>
                        <span>Eco-AI Online</span>
                    </div>
                    <div className="header-title-main">
                        <div className="header-bot-icon">
                            <Bot size={22} color="white" strokeWidth={2.5} />
                        </div>
                        <div className="header-text">
                            <h3>EcoSentinel AI</h3>
                            <p>Planet Guardian</p>
                        </div>
                    </div>
                    <button className="close-btn" onClick={() => setIsOpen(false)}>
                        <X size={20} />
                    </button>
                </header>

                <div className="env-panel-body">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`env-msg-row ${msg.role}`}>
                            <div className="env-msg-bubble">
                                <p>{msg.text}</p>
                                <span className="msg-time">{msg.time}</span>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="env-msg-row bot">
                            <div className="env-msg-bubble thinking">
                                <Sparkles size={14} className="sparkle-anim" />
                                <span>Processing data...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="env-panel-footer">
                    <div className="disclaimer-mini">
                        <AlertTriangle size={10} />
                        AI Info Only • Check Official Sources for Emergencies
                    </div>
                    <div className="env-input-box">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask about climate, pollution, etc..."
                            disabled={loading}
                        />
                        <button
                            className={`env-send-btn ${input.trim() ? 'active' : ''}`}
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

export default EnvironmentFloatingChatbot;
