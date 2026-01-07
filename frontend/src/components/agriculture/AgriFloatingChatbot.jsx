import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, X, MessageSquare, Sparkles, User, Wheat } from 'lucide-react';
import './AgriFloatingChatbot.css';

const AgriFloatingChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: "Hello! I'm your AI Agri-Expert Agent. How can I assist you with your field or crops today?",
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
            const sessionId = localStorage.getItem('agriChatSessionId') || `agri-${Date.now()}`;
            localStorage.setItem('agriChatSessionId', sessionId);

            const response = await fetch('http://localhost:5000/api/chatbot', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userInput,
                    sessionId: sessionId,
                    domain: 'agriculture'
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
                text: "⚠️ AI se connection nahi ho pa raha. Kripya apna internet check karein ya baad mein try karein.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="agri-floating-wrapper">
            {/* Toggle Button */}
            {!isOpen && (
                <button className="agri-chat-trigger" onClick={() => setIsOpen(true)}>
                    <Bot size={32} color="white" strokeWidth={1.5} />
                    <div className="trigger-pulse"></div>
                </button>
            )}

            {/* Chat Panel */}
            <div className={`agri-chat-panel ${isOpen ? 'open' : ''}`}>
                <header className="agri-panel-header">
                    <div className="header-status-badge">
                        <div className="status-dot"></div>
                        <span>Sentinel AI Active</span>
                    </div>
                    <div className="header-title-main">
                        <div className="header-bot-icon">
                            <Bot size={22} color="white" strokeWidth={2.5} />
                        </div>
                        <div className="header-text">
                            <h3>EcoHealth Assistant</h3>
                            <p>Agricultural Intelligence</p>
                        </div>
                    </div>
                    <button className="close-btn" onClick={() => setIsOpen(false)}>
                        <X size={20} />
                    </button>
                </header>

                <div className="agri-panel-body">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`agri-msg-row ${msg.role}`}>
                            <div className="agri-msg-bubble">
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="agri-msg-row bot">
                            <div className="agri-msg-bubble thinking">
                                <Sparkles size={14} className="sparkle-anim" />
                                <span>Analyzing field data...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="agri-panel-footer">
                    <div className="agri-input-box">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type your message..."
                            disabled={loading}
                        />
                        <button
                            className={`agri-send-btn ${input.trim() ? 'active' : ''}`}
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

export default AgriFloatingChatbot;
