import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Wheat, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import './AgriChatbot.css';

const AgriChatbot = () => {
    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: "Namaste! I am your AI Agriculture Assistant. How can I help you today? 🌱",
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
        scrollToBottom();
    }, [messages]);

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

            const response = await fetch("http://localhost:5000/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userInput,
                    sessionId: sessionId,
                    domain: "agriculture"
                })
            });

            const data = await response.json();

            setMessages(prev => [...prev, {
                role: "bot",
                text: data.response || "I specialize in farming, crop health, and market trends. Could you please rephrase your agricultural query?",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, {
                role: "bot",
                text: "⚠️ I'm currently having trouble connecting to the agrarian node. Please try again later.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    const suggestions = [
        "Soil PH management tips",
        "Latest market price trends",
        "Organic pest control methods",
        "Smart irrigation optimization"
    ];

    return (
        <div className="agri-chat-container">
            <div className="agri-chat-wrapper">

                {/* Chat Header */}
                <header className="agri-chat-header">
                    <div className="header-info">
                        <div className="bot-status-icon">
                            <Bot size={28} color="white" />
                            <div className="status-dot"></div>
                        </div>
                        <div>
                            <h1>Agri-Expert AI</h1>
                            <p>Agricultural Domain Specialist</p>
                        </div>
                    </div>
                    <div className="header-badges">
                        <span className="domain-badge"><Wheat size={14} /> Agriculture Only</span>
                    </div>
                </header>

                {/* Suggestions */}
                <div className="chat-suggestions">
                    {suggestions.map((text, i) => (
                        <button key={i} onClick={() => setInput(text)} className="suggestion-pill">
                            {text}
                        </button>
                    ))}
                </div>

                {/* Chat Body */}
                <div className="agri-chat-body">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message-row ${msg.role}`}>
                            <div className="avatar-mini">
                                {msg.role === 'bot' ? <Bot size={18} /> : <User size={18} />}
                            </div>
                            <div className="message-bubble">
                                <p>{msg.text}</p>
                                <span className="msg-time">{msg.time}</span>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="message-row bot">
                            <div className="avatar-mini"><Bot size={18} /></div>
                            <div className="message-bubble typing">
                                <Sparkles size={16} className="sparkle-anim" />
                                <span>AI is analyzing field nodes...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Warning Bar */}
                <div className="domain-warning">
                    <AlertCircle size={14} />
                    <span>This assistant only answers questions related to farming and agriculture.</span>
                </div>

                {/* Chat Input */}
                <div className="agri-chat-input-area">
                    <div className="input-glass-wrapper">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask about crops, pests, soil, or markets..."
                        />
                        <button
                            className={`send-btn ${input.trim() ? 'active' : ''}`}
                            onClick={handleSendMessage}
                            disabled={loading || !input.trim()}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgriChatbot;
