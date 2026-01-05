import React, { useState, useEffect, useRef } from 'react';
import {
  Video, Phone, MessageSquare, Calendar, Users, Clock, MapPin,
  FileText, Mic, MicOff, VideoOff, PhoneOff, Share2, Star,
  AlertCircle, CheckCircle2, Info, Settings, Bell, Search,
  ChevronRight, Activity, Heart, TrendingUp, Download,
  Plus, Filter, X, Loader, Grid, Maximize, AlertTriangle,
  BarChart3, Zap, Shield, User, Send, Trash2
} from 'lucide-react';

import './MyConsultations.css';

const MyConsultations = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    doctor: '',
    specialty: '',
    consultationType: 'video',
    date: '',
    time: '',
    reason: ''
  });

  const [stats, setStats] = useState(() => {
    const defaultStats = [
      { label: 'Upcoming', value: '0', icon: Calendar, color: '#3b82f6' },
      { label: 'Completed', value: '0', icon: CheckCircle2, color: '#10b981' },
      { label: 'Care Points', value: '0', icon: Star, color: '#f59e0b' },
      { label: 'Messages', value: '0', icon: MessageSquare, color: '#8b5cf6' }
    ];
    const savedStats = localStorage.getItem('consultation_stats');
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      return defaultStats.map(stat => {
        const saved = parsed.find(s => s.label === stat.label);
        return saved ? { ...stat, value: saved.value } : stat;
      });
    }
    return defaultStats;
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('consultation_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const availableDoctors = [
    { id: 1, name: 'Dr. Mehta', specialty: 'General Physician' },
    { id: 2, name: 'Dr. Sarah', specialty: 'Nutritionist' },
    { id: 3, name: 'Dr. Kumar', specialty: 'Cardiologist' },
    { id: 4, name: 'Dr. Priya', specialty: 'Dermatologist' },
    { id: 5, name: 'Dr. Anjali', specialty: 'Psychiatrist' },
    { id: 6, name: 'Dr. Vikram', specialty: 'Orthopedic' },
    { id: 7, name: 'Dr. Rahul', specialty: 'Pediatrician' },
    { id: 8, name: 'Dr. Sneha', specialty: 'Gynecologist' }
  ];

  const [activeChat, setActiveChat] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'doctor', text: 'Hello! How are you feeling today?', time: '10:00 AM' },
    { id: 2, sender: 'user', text: 'I am feeling much better, thank you.', time: '10:02 AM' },
    { id: 3, sender: 'doctor', text: 'That is good to hear. Did you take the prescribed medicine?', time: '10:05 AM' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Video/Audio State
  const localVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [aiDocStatus, setAiDocStatus] = useState('Connecting...');
  const [aiSpeechText, setAiSpeechText] = useState('');
  const [userSpeechText, setUserSpeechText] = useState('');
  const recognitionRef = useRef(null);
  const speechTimeoutRef = useRef(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Save to localStorage whenever sessions or stats change
  useEffect(() => {
    localStorage.setItem('consultation_sessions', JSON.stringify(sessions));
    localStorage.setItem('consultation_stats', JSON.stringify(stats));
  }, [sessions, stats]);

  // Handle booking new session
  const handleBookSession = () => {
    console.log('Book New Session clicked!');
    setShowBookingModal(true);
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setBookingForm({
      doctor: '',
      specialty: '',
      consultationType: 'video',
      date: '',
      time: '',
      reason: ''
    });
  };

  const handleFormChange = (field, value) => {
    setBookingForm(prev => ({ ...prev, [field]: value }));

    // Auto-fill specialty when doctor is selected
    if (field === 'doctor') {
      const selectedDoc = availableDoctors.find(d => d.name === value);
      if (selectedDoc) {
        setBookingForm(prev => ({ ...prev, specialty: selectedDoc.specialty }));
      }
    }
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    console.log('Booking submitted:', bookingForm);

    // Create new session object
    const newSession = {
      id: sessions.length + 1,
      doctor: bookingForm.doctor,
      specialty: bookingForm.specialty,
      type: bookingForm.consultationType === 'video' ? 'Video Call' :
        bookingForm.consultationType === 'audio' ? 'Audio Call' : 'Chat',
      time: `${new Date(bookingForm.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })}, ${bookingForm.time}`,
      status: 'Scheduled',
      priority: 'Medium',
      reason: bookingForm.reason
    };

    // Add to sessions list
    setSessions(prev => [...prev, newSession]);

    // Update stats - increment upcoming count
    setStats(prev => prev.map(stat =>
      stat.label === 'Upcoming'
        ? { ...stat, value: String(Number(stat.value) + 1) }
        : stat
    ));

    // Switch to upcoming tab to show the new booking
    setActiveTab('upcoming');

    // Show success message
    alert(`✅ Consultation Booked Successfully!\n\nDoctor: ${bookingForm.doctor}\nSpecialty: ${bookingForm.specialty}\nType: ${newSession.type}\nDate & Time: ${newSession.time}\n\n✓ Confirmation email sent\n✓ Calendar invite sent\n✓ Doctor notified\n\nYour consultation appears below!`);

    handleCloseModal();
  };

  // Handle joining consultation room
  const handleJoinRoom = async (session) => {
    setActiveCall(session);
    setAiDocStatus('Initializing Camera...');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setAiDocStatus('Doctor is online');

      // Start AI Doc Interaction
      startAIDoctorInteraction(session.doctor);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setAiDocStatus('Camera/Mic access denied');
      alert("Please allow Camera and Microphone access to join the call.");
    }
  };

  const startAIDoctorInteraction = (doctorName) => {
    // 1. Initial greeting
    speak(`Hello! I am ${doctorName}. I have reviewed your health profile. How are you feeling today?`);

    // 2. Setup Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript;
        console.log('User said:', text);

        // Update user caption
        setUserSpeechText(text);

        // Clear old caption after 3 seconds of silence
        if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
        speechTimeoutRef.current = setTimeout(() => setUserSpeechText(''), 3000);

        processUserVoice(text);
      };

      recognitionRef.current.start();
    }
  };

  const speak = (text) => {
    setAiSpeechText(text);
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    // Prefer a professional sounding voice if available
    utterance.voice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural')) || voices[0];
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const processUserVoice = (text) => {
    const lowerText = text.toLowerCase();
    let response = "";

    if (lowerText.includes('pain') || lowerText.includes('hurts')) {
      response = "I understand you're in pain. Based on your symptoms, I recommend resting and monitoring your temperature. Are you feeling any nausea?";
    } else if (lowerText.includes('fever') || lowerText.includes('cold')) {
      response = "It sounds like a viral infection. Please stay hydrated and keep track of your fever. If it exceeds 102 degrees, we should consider a prescription.";
    } else if (lowerText.includes('medicine') || lowerText.includes('tablet')) {
      response = "You should continue your previous dosage, but avoid taking it on an empty stomach. I'll send the updated prescription to your app.";
    } else {
      response = "I've noted that. Let's look at your recent vital signs summary. Your blood pressure has been slightly elevated lately.";
    }

    setTimeout(() => speak(response), 1000);
  };

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => (track.enabled = !isMicOn));
      setIsMicOn(!isMicOn);
    }
  };

  const toggleCam = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => (track.enabled = !isCamOn));
      setIsCamOn(!isCamOn);
    }
  };

  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setLocalStream(null);
    setActiveCall(null);
    setAiSpeechText('');
    setUserSpeechText('');
    setIsScreenSharing(false);
    setShowSettingsModal(false);
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    window.speechSynthesis.cancel();
  };

  const handleShare = async () => {
    if (isScreenSharing) {
      // Toggle back to camera
      setIsScreenSharing(false);
      handleJoinRoom(activeCall); // Restart camera stream
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setLocalStream(prev => {
          if (prev) prev.getTracks().forEach(t => t.stop());
          return screenStream;
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);

        // When screen sharing stops via browser UI
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          handleJoinRoom(activeCall);
        };
      } catch (err) {
        console.error("Screen share error:", err);
      }
    }
  };

  // Handle opening chat
  const handleOpenChat = (session) => {
    setActiveChat(session);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: chatMessages.length + 1,
      sender: 'user',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, msg]);
    setNewMessage('');

    // Simulate doctor reply
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'doctor',
        text: 'Thank you for the update. I will review this during our call.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    const chatBody = document.querySelector('.chat-body');
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }, [chatMessages, activeChat]);

  // Handle deleting session
  const handleDeleteSession = (id) => {
    if (window.confirm('Are you sure you want to cancel this consultation?')) {
      const sessionToDelete = sessions.find(s => s.id === id);
      setSessions(prev => prev.filter(s => s.id !== id));

      // Update stats if necessary
      if (sessionToDelete && (sessionToDelete.status === 'Confirmed' || sessionToDelete.status === 'Scheduled')) {
        setStats(prev => prev.map(stat =>
          stat.label === 'Upcoming'
            ? { ...stat, value: String(Math.max(0, Number(stat.value) - 1)) }
            : stat
        ));
      }
    }
  };

  // Handle stat card click
  const handleStatClick = (stat) => {
    console.log('Stat card clicked:', stat.label);

    if (stat.label === 'Upcoming') {
      setActiveTab('upcoming');
      console.log('Switched to upcoming tab');
    } else if (stat.label === 'Completed') {
      setActiveTab('history');
      console.log('Switched to history tab');
    } else if (stat.label === 'Messages') {
      alert(`📨 Messages Center\n\nYou have ${stat.value} unread messages\n\n✓ View all consultation messages\n✓ Chat with your doctors\n✓ Get prescription updates`);
    } else if (stat.label === 'Care Points') {
      alert(`⭐ Care Points Rewards\n\nYou have ${stat.value} Care Points!\n\n✓ Redeem for consultation discounts\n✓ Unlock premium features\n✓ Get priority booking\n\nKeep consulting to earn more!`);
    }
  };

  // Filter sessions based on active tab
  const getFilteredSessions = () => {
    if (activeTab === 'upcoming') {
      return sessions.filter(s => s.status === 'Confirmed' || s.status === 'Scheduled');
    } else if (activeTab === 'history') {
      return sessions.filter(s => s.status === 'Completed');
    }
    return sessions;
  };

  const filteredSessions = getFilteredSessions();

  return (
    <div className="consultations-container">
      <div className="consultations-header">
        <div>
          <h1 className="consultations-title">My Consultations</h1>
          <p className="consultations-subtitle">Connect with your healthcare provider anytime, anywhere</p>
        </div>
        <button
          className="btn-book"
          onClick={handleBookSession}
          type="button"
        >
          <Plus size={20} />
          Book New Session
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="stat-card stat-card-clickable"
            style={{ '--stat-color': stat.color }}
            onClick={() => handleStatClick(stat)}
            title={`Click to view ${stat.label}`}
          >
            <div className="stat-icon-wrapper">
              <stat.icon size={24} />
            </div>
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-label">{stat.label}</p>
            <span className="stat-live-badge">Live</span>
          </div>
        ))}
      </div>

      <div className="tabs-container">
        {['upcoming', 'history', 'doctors'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="sessions-section">
        <h2 className="section-title">
        </h2>

        {activeTab === 'doctors' ? (
          <div className="doctors-grid">
            {availableDoctors.map(doc => (
              <div key={doc.id} className="doctor-card-alt">
                <div className="doctor-avatar-large">
                  <User size={32} color="white" />
                </div>
                <h3>{doc.name}</h3>
                <p>{doc.specialty}</p>
                <div className="doctor-card-actions">
                  <button
                    className="btn-book-small"
                    onClick={() => {
                      setBookingForm(prev => ({ ...prev, doctor: doc.name, specialty: doc.specialty }));
                      setShowBookingModal(true);
                    }}
                  >
                    Book Now
                  </button>
                  <button className="btn-chat-small" onClick={() => handleOpenChat({ doctor: doc.name, specialty: doc.specialty })}>
                    <MessageSquare size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="sessions-table-container">
            <table className="sessions-table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialty</th>
                  <th>Type</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map(session => (
                  <tr key={session.id} className={session.priority === 'High' ? 'priority-high-row' : ''}>
                    <td>
                      <div className="doctor-cell">
                        <div className="doctor-avatar-small">
                          <User size={20} color="white" />
                        </div>
                        <span className="doctor-name">{session.doctor}</span>
                      </div>
                    </td>
                    <td>
                      <span className="specialty-badge">{session.specialty}</span>
                    </td>
                    <td>
                      <div className="type-cell">
                        {session.type === 'Video Call' && <Video size={16} color="#3b82f6" />}
                        {session.type === 'Audio Call' && <Phone size={16} color="#10b981" />}
                        {session.type === 'Chat' && <MessageSquare size={16} color="#8b5cf6" />}
                        <span>{session.type}</span>
                      </div>
                    </td>
                    <td>
                      <div className="time-cell">
                        <Clock size={16} color="#64748b" />
                        <span>{session.time}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${session.status.toLowerCase()}`}>
                        {session.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-join-small"
                          onClick={() => handleJoinRoom(session)}
                          title="Join consultation"
                        >
                          {session.type === 'Audio Call' ? <Phone size={16} /> : <Video size={16} />}
                          Join
                        </button>
                        <button
                          className="btn-action btn-chat-small"
                          onClick={() => handleOpenChat(session)}
                          title="Open chat"
                        >
                          <MessageSquare size={16} />
                        </button>
                        <button
                          className="btn-action btn-delete-small"
                          onClick={() => handleDeleteSession(session.id)}
                          title="Cancel consultation"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <Calendar size={64} />
            <p>
              {activeTab === 'history'
                ? 'No consultation history yet'
                : 'No consultations scheduled'}
            </p>
            <button className="btn-book" onClick={handleBookSession} style={{ marginTop: '16px' }}>
              <Plus size={20} />
              Book Your First Session
            </button>
          </div>
        )}
      </div>

      <div className="ai-insight-card">
        <div className="insight-header">
          <div className="insight-icon-box">
            <Zap size={28} />
          </div>
          <h2 className="insight-title">AI Consultation Insight</h2>
        </div>
        <p className="insight-text">
          Your upcoming session with Dr. Mehta is regarding your recent blood pressure trends.
          The AI has compiled a 7-day summary of your vitals to help the doctor make a faster assessment.
        </p>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book New Consultation</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitBooking} className="booking-form">
              <div className="form-group">
                <label>Select Doctor</label>
                <select
                  value={bookingForm.doctor}
                  onChange={(e) => handleFormChange('doctor', e.target.value)}
                  required
                >
                  <option value="">Choose a doctor...</option>
                  {availableDoctors.map(doc => (
                    <option key={doc.id} value={doc.name}>
                      {doc.name} - {doc.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Specialty</label>
                <input
                  type="text"
                  value={bookingForm.specialty}
                  readOnly
                  placeholder="Auto-filled based on doctor"
                />
              </div>

              <div className="form-group">
                <label>Consultation Type</label>
                <div className="consultation-type-options">
                  <label className={`type-option ${bookingForm.consultationType === 'video' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="consultationType"
                      value="video"
                      checked={bookingForm.consultationType === 'video'}
                      onChange={(e) => handleFormChange('consultationType', e.target.value)}
                    />
                    <Video size={20} />
                    <span>Video Call</span>
                  </label>
                  <label className={`type-option ${bookingForm.consultationType === 'audio' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="consultationType"
                      value="audio"
                      checked={bookingForm.consultationType === 'audio'}
                      onChange={(e) => handleFormChange('consultationType', e.target.value)}
                    />
                    <Phone size={20} />
                    <span>Audio Call</span>
                  </label>
                  <label className={`type-option ${bookingForm.consultationType === 'chat' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="consultationType"
                      value="chat"
                      checked={bookingForm.consultationType === 'chat'}
                      onChange={(e) => handleFormChange('consultationType', e.target.value)}
                    />
                    <MessageSquare size={20} />
                    <span>Chat</span>
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Date</label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => handleFormChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Preferred Time</label>
                  <input
                    type="time"
                    value={bookingForm.time}
                    onChange={(e) => handleFormChange('time', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reason for Consultation</label>
                <textarea
                  value={bookingForm.reason}
                  onChange={(e) => handleFormChange('reason', e.target.value)}
                  placeholder="Briefly describe your health concern..."
                  rows="4"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  <Calendar size={20} />
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Chat Overlay */}
      {activeChat && (
        <div className="chat-overlay">
          <div className="chat-window">
            <div className="chat-header">
              <div className="doctor-info">
                <div className="doctor-avatar-small">
                  <User size={20} color="white" />
                </div>
                <div>
                  <h3>{activeChat.doctor}</h3>
                  <span>{activeChat.specialty}</span>
                </div>
              </div>
              <button className="close-chat" onClick={() => setActiveChat(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="chat-body">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`message ${msg.sender}`}>
                  <div className="message-content">{msg.text}</div>
                  <div className="message-time">{msg.time}</div>
                </div>
              ))}
            </div>
            <form className="chat-footer" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="btn-send">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Call Overlay */}
      {activeCall && (
        <div className="call-overlay">
          <div className="call-container">
            <div className="main-video">
              <div className="ai-doctor-video">
                <div className={`ai-avatar-wrapper ${aiSpeechText ? 'speaking' : ''}`}>
                  <div className="ai-brain-pulse"></div>
                  <User size={120} color="#3b82f6" />
                </div>
                <div className="ai-status-tag">
                  <div className="pulse-dot"></div>
                  {aiDocStatus}
                </div>
                {aiSpeechText && (
                  <div className="ai-subtitle-box">
                    <p>{aiSpeechText}</p>
                  </div>
                )}
              </div>

              <div className="self-video">
                {isCamOn ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="local-video-feed"
                  />
                ) : (
                  <div className="video-off-placeholder">
                    <VideoOff size={40} color="#64748b" />
                    <span>Camera Off</span>
                  </div>
                )}
                {userSpeechText && (
                  <div className="user-subtitle-box">
                    <p>{userSpeechText}</p>
                  </div>
                )}
                <div className="self-name-tag">You</div>
              </div>

              <div className="call-info-overlay">
                <h3>{activeCall.doctor}</h3>
                <span>{activeCall.specialty}</span>
              </div>
            </div>

            <div className="call-controls">
              <button
                className={`control-btn ${!isMicOn ? 'off' : ''}`}
                onClick={toggleMic}
                title={isMicOn ? 'Mute' : 'Unmute'}
              >
                {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
              </button>
              <button
                className={`control-btn ${!isCamOn ? 'off' : ''}`}
                onClick={toggleCam}
                title={isCamOn ? 'Stop Video' : 'Start Video'}
              >
                {isCamOn ? <Video size={24} /> : <VideoOff size={24} />}
              </button>
              <button className="control-btn btn-end-call" onClick={handleEndCall} title="End Call">
                <PhoneOff size={24} />
              </button>
              <button
                className={`control-btn ${isScreenSharing ? 'active-share' : ''}`}
                onClick={handleShare}
                title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
              >
                <Share2 size={24} />
              </button>
              <button
                className={`control-btn ${showSettingsModal ? 'active-settings' : ''}`}
                onClick={() => setShowSettingsModal(!showSettingsModal)}
                title="Call Settings"
              >
                <Settings size={24} />
              </button>
            </div>

            {/* In-Call Settings Modal */}
            {showSettingsModal && (
              <div className="call-settings-dropdown">
                <div className="settings-header-small">
                  <h4>Call Settings</h4>
                  <button onClick={() => setShowSettingsModal(false)}><X size={16} /></button>
                </div>
                <div className="settings-options-list">
                  <div className="setting-item-small">
                    <label>Microphone</label>
                    <select><option>Default - System Mic</option></select>
                  </div>
                  <div className="setting-item-small">
                    <label>Camera</label>
                    <select><option>Default - HD WebCam</option></select>
                  </div>
                  <div className="setting-item-small">
                    <label>Output</label>
                    <select><option>Default - Speakers</option></select>
                  </div>
                  <div className="setting-item-small toggle">
                    <span>Noise Cancellation</span>
                    <input type="checkbox" checked readOnly />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


export default MyConsultations;
