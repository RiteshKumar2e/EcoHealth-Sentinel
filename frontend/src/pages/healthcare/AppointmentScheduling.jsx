import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Bell, Activity, Sparkles, Database, Trash2, Edit, Eye, Download, Filter, Search, RefreshCw } from 'lucide-react';
import './AppointmentScheduling.css';

// MongoDB API Simulation (Replace with actual MongoDB API calls)
class MongoDBService {
  constructor() {
    // Simulating MongoDB connection
    this.dbName = 'appointmentDB';
    this.collection = 'appointments';
    this.connectionStatus = 'connected';
    // In-memory storage to simulate MongoDB
    this.appointments = [];
    this.doctors = [
      { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', aiRating: 4.8, avatar: '👩‍⚕️', available: true },
      { id: 2, name: 'Dr. Michael Chen', specialty: 'Neurology', aiRating: 4.9, avatar: '👨‍⚕️', available: true },
      { id: 3, name: 'Dr. Emily Davis', specialty: 'Pediatrics', aiRating: 4.7, avatar: '👩‍⚕️', available: true },
      { id: 4, name: 'Dr. James Wilson', specialty: 'Orthopedics', aiRating: 4.6, avatar: '👨‍⚕️', available: false }
    ];
  }

  // MongoDB Insert Operation
  async insertAppointment(appointmentData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newAppointment = {
      _id: `apt_${Date.now()}`,
      ...appointmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'confirmed',
      paymentStatus: 'pending'
    };
    this.appointments.push(newAppointment);
    return { success: true, data: newAppointment };
  }

  // MongoDB Find Operation
  async findAppointments(query = {}) {
    await new Promise(resolve => setTimeout(resolve, 600));
    let results = [...this.appointments];

    if (query.date) {
      results = results.filter(apt => apt.date === query.date);
    }
    if (query.status) {
      results = results.filter(apt => apt.status === query.status);
    }
    if (query.doctor) {
      results = results.filter(apt => apt.doctor === query.doctor);
    }

    return { success: true, data: results };
  }

  // MongoDB Update Operation
  async updateAppointment(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = this.appointments.findIndex(apt => apt._id === id);
    if (index !== -1) {
      this.appointments[index] = {
        ...this.appointments[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      return { success: true, data: this.appointments[index] };
    }
    return { success: false, error: 'Appointment not found' };
  }

  // MongoDB Delete Operation
  async deleteAppointment(id) {
    await new Promise(resolve => setTimeout(resolve, 700));
    const index = this.appointments.findIndex(apt => apt._id === id);
    if (index !== -1) {
      const deleted = this.appointments.splice(index, 1);
      return { success: true, data: deleted[0] };
    }
    return { success: false, error: 'Appointment not found' };
  }

  // Get available doctors
  getDoctors() {
    return this.doctors.filter(doc => doc.available);
  }

  // Get connection status
  getConnectionStatus() {
    return this.connectionStatus;
  }
}

const mongoService = new MongoDBService();

const AppointmentScheduling = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    email: '',
    reason: '',
    doctor: '',
    timeSlot: '',
    emergencyContact: '',
    age: '',
    gender: ''
  });
  const [notification, setNotification] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ total: 0, today: 0, upcoming: 0, completed: 0 });
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  useEffect(() => {
    loadAppointments();
    optimizeTimeSlots(selectedDate);
    checkConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, filterStatus]);

  useEffect(() => {
    updateStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointments]);

  const checkConnection = () => {
    const status = mongoService.getConnectionStatus();
    setConnectionStatus(status);
  };

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const query = filterStatus !== 'all' ? { status: filterStatus } : {};
      const response = await mongoService.findAppointments(query);
      if (response.success) {
        setAppointments(response.data);
        showNotification('success', '✅ Data loaded from MongoDB successfully!');
      }
    } catch (error) {
      showNotification('error', '❌ Failed to load from MongoDB');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = () => {
    const today = new Date().toISOString().split('T')[0];
    setStats({
      total: appointments.length,
      today: appointments.filter(apt => apt.date === today).length,
      upcoming: appointments.filter(apt => apt.date >= today && apt.status === 'confirmed').length,
      completed: appointments.filter(apt => apt.status === 'completed').length
    });
  };

  const optimizeTimeSlots = (date) => {
    const baseSlots = [
      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
    ];

    const optimizedSlots = baseSlots.map(slot => ({
      time: slot,
      availability: Math.random() > 0.3 ? 'available' : 'booked',
      waitTime: Math.floor(Math.random() * 15),
      aiScore: (Math.random() * 100).toFixed(1),
      patients: Math.floor(Math.random() * 3)
    }));

    setAvailableSlots(optimizedSlots);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const predictNoShow = (patientData) => {
    const factors = {
      timeOfDay: parseInt(patientData.timeSlot) < 10 ? 0.15 : 0.08,
      dayOfWeek: new Date(selectedDate).getDay() === 1 ? 0.12 : 0.05,
      advance: 0.06,
      age: patientData.age < 30 ? 0.10 : 0.04
    };

    const noShowProbability = Object.values(factors).reduce((a, b) => a + b, 0);
    return (noShowProbability * 100).toFixed(1);
  };

  const handleSubmit = async () => {
    if (!formData.patientName || !formData.phone || !formData.email || !formData.doctor || !formData.reason || !formData.timeSlot) {
      showNotification('error', '⚠️ Please fill all required fields');
      return;
    }

    setSaving(true);

    try {
      const noShowRisk = predictNoShow(formData);

      const appointmentData = {
        ...formData,
        date: selectedDate,
        noShowRisk: noShowRisk,
        reminderSent: false,
        confirmationSent: true
      };

      if (editingId) {
        // Update existing appointment
        const response = await mongoService.updateAppointment(editingId, appointmentData);
        if (response.success) {
          setAppointments(prev => prev.map(apt => apt._id === editingId ? response.data : apt));
          showNotification('success', `✅ Appointment updated in MongoDB! ID: ${editingId}`);
          setEditingId(null);
        }
      } else {
        // Create new appointment
        const response = await mongoService.insertAppointment(appointmentData);
        if (response.success) {
          setAppointments(prev => [...prev, response.data]);
          showNotification('success', `✅ Saved to MongoDB! ID: ${response.data._id} | Risk: ${noShowRisk}%`);
        }
      }

      setFormData({
        patientName: '',
        phone: '',
        email: '',
        reason: '',
        doctor: '',
        timeSlot: '',
        emergencyContact: '',
        age: '',
        gender: ''
      });

      optimizeTimeSlots(selectedDate);
    } catch (error) {
      showNotification('error', '❌ MongoDB operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment from MongoDB?')) return;

    try {
      const response = await mongoService.deleteAppointment(id);
      if (response.success) {
        setAppointments(prev => prev.filter(apt => apt._id !== id));
        showNotification('success', '✅ Deleted from MongoDB successfully!');
      }
    } catch (error) {
      showNotification('error', '❌ Failed to delete from MongoDB');
    }
  };

  const handleEdit = (appointment) => {
    setFormData({
      patientName: appointment.patientName,
      phone: appointment.phone,
      email: appointment.email,
      reason: appointment.reason,
      doctor: appointment.doctor,
      timeSlot: appointment.timeSlot,
      emergencyContact: appointment.emergencyContact || '',
      age: appointment.age || '',
      gender: appointment.gender || ''
    });
    setSelectedDate(appointment.date);
    setEditingId(appointment._id);
    showNotification('info', '✏️ Editing mode - Update the form and save');
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await mongoService.updateAppointment(id, { status: newStatus });
      if (response.success) {
        setAppointments(prev => prev.map(apt => apt._id === id ? response.data : apt));
        showNotification('success', `✅ Status updated to ${newStatus} in MongoDB`);
      }
    } catch (error) {
      showNotification('error', '❌ Failed to update status');
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(appointments, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `appointments_${new Date().toISOString()}.json`;
    link.click();
    showNotification('success', '✅ Appointments exported successfully!');
  };

  const handleRefresh = () => {
    loadAppointments();
    optimizeTimeSlots(selectedDate);
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const filteredAppointments = appointments.filter(apt =>
    apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.phone.includes(searchTerm)
  );

  return (
    <div className="apt-scheduling-container">
      {/* Animated Background */}
      <div className="apt-background-blobs">
        <div className="apt-blob apt-blob-1"></div>
        <div className="apt-blob apt-blob-2"></div>
        <div className="apt-blob apt-blob-3"></div>
      </div>

      <div className="apt-content-wrapper">
        {/* Header */}
        <div className="apt-card-3d apt-no-hover">
          <div className="apt-header-content">
            <div className="apt-title-group">
              <div className="apt-icon-wrapper">
                <Calendar className="apt-main-icon" />
                <Sparkles className="apt-sparkle-icon" />
              </div>
              <div>
                <h1 className="apt-title">
                  AI-Powered Appointment System
                </h1>
                <p className="apt-subtitle">
                  <Database className="apt-status-icon" style={{ color: connectionStatus === 'connected' ? '#10b981' : '#ef4444' }} />
                  MongoDB {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'} • Real-time Sync • Collection: appointments
                </p>
              </div>
            </div>
            <div className="apt-header-actions">
              <button onClick={handleRefresh} className="apt-btn apt-btn-refresh">
                <RefreshCw className="apt-btn-icon" />
                Refresh
              </button>
              <button onClick={handleExport} className="apt-btn apt-btn-export">
                <Download className="apt-btn-icon" />
                Export
              </button>
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="apt-stats-grid">
            <div className="apt-stat-card apt-stat-green">
              <div className="apt-stat-content">
                <Activity className="apt-stat-icon" />
                <div>
                  <div className="apt-stat-value">{stats.total}</div>
                  <div className="apt-stat-label">Total Appointments</div>
                </div>
              </div>
            </div>
            <div className="apt-stat-card apt-stat-blue">
              <div className="apt-stat-content">
                <Calendar className="apt-stat-icon" />
                <div>
                  <div className="apt-stat-value">{stats.today}</div>
                  <div className="apt-stat-label">Today's Schedule</div>
                </div>
              </div>
            </div>
            <div className="apt-stat-card apt-stat-amber">
              <div className="apt-stat-content">
                <Bell className="apt-stat-icon apt-status-icon" />
                <div>
                  <div className="apt-stat-value">{stats.upcoming}</div>
                  <div className="apt-stat-label">Upcoming</div>
                </div>
              </div>
            </div>
            <div className="apt-stat-card apt-stat-purple">
              <div className="apt-stat-content">
                <CheckCircle className="apt-stat-icon" />
                <div>
                  <div className="apt-stat-value">{stats.completed}</div>
                  <div className="apt-stat-label">Completed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="apt-features">
            <span className="apt-feature-pill apt-pill-cyan">
              ✓ MongoDB Integration
            </span>
            <span className="apt-feature-pill apt-pill-green">
              ✓ CRUD Operations
            </span>
            <span className="apt-feature-pill apt-pill-purple">
              ✓ AI Prediction
            </span>
            <span className="apt-feature-pill apt-pill-blue">
              ✓ Real-time Updates
            </span>
            <span className="apt-feature-pill apt-pill-amber">
              ✓ Export Data
            </span>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`apt-notification ${notification.type === 'success' ? 'apt-notif-success' : notification.type === 'error' ? 'apt-notif-error' : 'apt-notif-info'}`}>
            {notification.type === 'success' ? <CheckCircle className="apt-spinner" style={{ width: '24px', height: '24px', color: '#10b981', border: 'none' }} /> : notification.type === 'error' ? <XCircle style={{ width: '24px', height: '24px', color: '#ef4444', flexShrink: 0 }} /> : <AlertCircle style={{ width: '24px', height: '24px', color: '#3b82f6', flexShrink: 0 }} />}
            <span className={`apt-notif-text ${notification.type}`}>{notification.message}</span>
          </div>
        )}

        <div className="apt-main-grid">
          {/* Booking Form */}
          <div className="apt-form-card">
            <h2 className="apt-section-title">
              <User className="apt-section-icon" />
              {editingId ? 'Edit Appointment' : 'Schedule Appointment'}
            </h2>

            <div className="apt-form-group">
              <div className="apt-input-group">
                <label className="apt-label">Patient Name *</label>
                <input type="text" name="patientName" value={formData.patientName} onChange={handleInputChange} className="apt-input" placeholder="Enter full name" />
              </div>

              <div className="apt-grid-2">
                <div className="apt-input-group">
                  <label className="apt-label">Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="apt-input" placeholder="+1234567890" />
                </div>
                <div className="apt-input-group">
                  <label className="apt-label">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="apt-input" placeholder="email@example.com" />
                </div>
              </div>

              <div className="apt-grid-3">
                <div className="apt-input-group">
                  <label className="apt-label">Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="apt-input" placeholder="Age" />
                </div>
                <div className="apt-input-group">
                  <label className="apt-label">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} className="apt-select">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="apt-input-group">
                  <label className="apt-label">Emergency</label>
                  <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} className="apt-input" placeholder="Contact" />
                </div>
              </div>

              <div className="apt-input-group">
                <label className="apt-label">Select Doctor *</label>
                <select name="doctor" value={formData.doctor} onChange={handleInputChange} className="apt-select">
                  <option value="">Choose a doctor</option>
                  {mongoService.getDoctors().map(doc => (
                    <option key={doc.id} value={doc.name}>
                      {doc.avatar} {doc.name} - {doc.specialty} (★ {doc.aiRating})
                    </option>
                  ))}
                </select>
              </div>

              <div className="apt-input-group">
                <label className="apt-label">Appointment Date *</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="apt-input" />
              </div>

              <div className="apt-input-group">
                <label className="apt-label">Reason for Visit *</label>
                <textarea name="reason" value={formData.reason} onChange={handleInputChange} rows="3" className="apt-textarea" placeholder="Brief description of symptoms" />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleSubmit} disabled={saving || !formData.timeSlot || !formData.patientName} className={`apt-btn ${editingId ? 'apt-btn-update' : 'apt-btn-save'}`} style={{ flex: 1, opacity: saving || !formData.timeSlot || !formData.patientName ? 0.5 : 1, cursor: saving || !formData.timeSlot || !formData.patientName ? 'not-allowed' : 'pointer' }}>
                  {saving ? (
                    <>
                      <div className="apt-spinner"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Database style={{ width: '20px', height: '20px' }} />
                      {editingId ? 'Update MongoDB' : 'Save to MongoDB'}
                    </>
                  )}
                </button>
                {editingId && (
                  <button onClick={() => { setEditingId(null); setFormData({ patientName: '', phone: '', email: '', reason: '', doctor: '', timeSlot: '', emergencyContact: '', age: '', gender: '' }); }} className="apt-btn apt-btn-cancel">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Available Slots */}
          <div className="apt-form-card">
            <h2 className="apt-section-title">
              <Clock className="apt-section-icon" />
              AI-Optimized Slots
            </h2>

            <div className="apt-info-box">
              <p className="apt-info-text">
                <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                Slots optimized using AI predictive analytics
              </p>
            </div>

            <div className="apt-slots-grid">
              {availableSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => slot.availability === 'available' && setFormData(prev => ({ ...prev, timeSlot: slot.time }))}
                  disabled={slot.availability === 'booked'}
                  className={`apt-slot-card ${slot.availability === 'booked' ? 'booked' : 'available'} ${formData.timeSlot === slot.time ? 'selected' : ''}`}
                >
                  <div className="apt-slot-time">{slot.time}</div>
                  {slot.availability === 'available' ? (
                    <>
                      <div className="apt-slot-detail apt-text-green">✓ Available</div>
                      <div className="apt-slot-detail apt-text-slate">Wait: ~{slot.waitTime}m</div>
                      <div className="apt-slot-detail apt-text-cyan">AI: {slot.aiScore}%</div>
                      <div className="apt-slot-detail apt-text-purple">{slot.patients} patients</div>
                    </>
                  ) : (
                    <div className="apt-slot-detail apt-text-red-bold">✗ Booked</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="apt-card-3d apt-no-hover" style={{ marginTop: '24px' }}>
          <div className="apt-list-header">
            <h2 className="apt-section-title">
              <Database className="apt-section-icon" style={{ color: '#10b981' }} />
              MongoDB Records ({filteredAppointments.length})
            </h2>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div className="apt-search-wrapper">
                <Search className="apt-search-icon" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search appointments..." className="apt-search-input" />
              </div>

              <div className="apt-filter-group">
                <Filter style={{ width: '18px', height: '18px', color: '#64748b' }} />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="apt-select-small">
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="apt-empty-state">
              <div className="apt-loading-spinner"></div>
              <p>Loading from MongoDB...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="apt-empty-state">
              <Calendar className="apt-empty-icon" />
              <p style={{ fontSize: '16px' }}>{searchTerm ? 'No appointments found matching your search' : 'No appointments in MongoDB database'}</p>
            </div>
          ) : (
            <div className="apt-list-container">
              {filteredAppointments.map((apt, index) => (
                <div key={apt._id} className="apt-item-card">
                  <div className="apt-item-content">
                    <div className="apt-patient-info">
                      <div className="apt-patient-header">
                        <div className="apt-avatar">
                          {apt.patientName.charAt(0)}
                        </div>
                        <div className="apt-patient-details">
                          <h3>{apt.patientName}</h3>
                          <p>{apt.doctor}</p>
                        </div>
                      </div>
                      <p className="apt-reason">{apt.reason}</p>
                      <div className="apt-tags">
                        <span className="apt-tag">📧 {apt.email}</span>
                        <span className="apt-tag">📱 {apt.phone}</span>
                        {apt.age && <span className="apt-tag">👤 {apt.age}y</span>}
                        {apt.gender && <span className="apt-tag">⚧ {apt.gender}</span>}
                      </div>
                      <div className="apt-id">
                        ID: {apt._id}
                      </div>
                    </div>

                    <div className="apt-appointment-meta">
                      <div className="apt-time">{apt.timeSlot}</div>
                      <div className="apt-date">📅 {apt.date}</div>

                      <div className="apt-status-actions">
                        <div className="apt-risk-badge" style={{
                          background: parseFloat(apt.noShowRisk) < 10 ? 'rgba(16, 185, 129, 0.1)' : parseFloat(apt.noShowRisk) < 20 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: parseFloat(apt.noShowRisk) < 10 ? '#10b981' : parseFloat(apt.noShowRisk) < 20 ? '#f59e0b' : '#ef4444',
                          border: `1px solid ${parseFloat(apt.noShowRisk) < 10 ? '#10b981' : parseFloat(apt.noShowRisk) < 20 ? '#f59e0b' : '#ef4444'}`
                        }}>
                          AI Risk: {apt.noShowRisk}%
                        </div>

                        <select value={apt.status} onChange={(e) => handleStatusChange(apt._id, e.target.value)} className="apt-status-select" style={{
                          background: apt.status === 'confirmed' ? 'rgba(16, 185, 129, 0.1)' : apt.status === 'completed' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: apt.status === 'confirmed' ? '#10b981' : apt.status === 'completed' ? '#8b5cf6' : '#ef4444'
                        }}>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="apt-action-buttons">
                        <button onClick={() => handleEdit(apt)} className="apt-btn-small apt-btn-edit">
                          <Edit style={{ width: '14px', height: '14px' }} />
                          Edit
                        </button>
                        <button onClick={() => setViewDetails(apt)} className="apt-btn-small apt-btn-view">
                          <Eye style={{ width: '14px', height: '14px' }} />
                          View
                        </button>
                        <button onClick={() => handleDelete(apt._id)} className="apt-btn-small apt-btn-delete">
                          <Trash2 style={{ width: '14px', height: '14px' }} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View Details Modal */}
        {viewDetails && (
          <div className="apt-modal-overlay" onClick={() => setViewDetails(null)}>
            <div className="apt-modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="apt-section-title">
                <Eye style={{ width: '28px', height: '28px', color: '#3b82f6' }} />
                Appointment Details
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="apt-modal-details">
                  <strong className="apt-text-slate">Patient:</strong>
                  <span style={{ color: '#1e293b' }}>{viewDetails.patientName}</span>

                  <strong className="apt-text-slate">Doctor:</strong>
                  <span style={{ color: '#1e293b' }}>{viewDetails.doctor}</span>

                  <strong className="apt-text-slate">Date & Time:</strong>
                  <span style={{ color: '#1e293b' }}>{viewDetails.date} at {viewDetails.timeSlot}</span>

                  <strong className="apt-text-slate">Phone:</strong>
                  <span style={{ color: '#1e293b' }}>{viewDetails.phone}</span>

                  <strong className="apt-text-slate">Email:</strong>
                  <span style={{ color: '#1e293b' }}>{viewDetails.email}</span>

                  {viewDetails.age && (
                    <>
                      <strong className="apt-text-slate">Age:</strong>
                      <span style={{ color: '#1e293b' }}>{viewDetails.age} years</span>
                    </>
                  )}

                  {viewDetails.gender && (
                    <>
                      <strong className="apt-text-slate">Gender:</strong>
                      <span style={{ color: '#1e293b' }}>{viewDetails.gender}</span>
                    </>
                  )}

                  {viewDetails.emergencyContact && (
                    <>
                      <strong className="apt-text-slate">Emergency:</strong>
                      <span style={{ color: '#1e293b' }}>{viewDetails.emergencyContact}</span>
                    </>
                  )}

                  <strong className="apt-text-slate">Reason:</strong>
                  <span style={{ color: '#1e293b' }}>{viewDetails.reason}</span>

                  <strong className="apt-text-slate">Status:</strong>
                  <span style={{ color: '#1e293b', fontWeight: '600', textTransform: 'capitalize' }}>{viewDetails.status}</span>

                  <strong className="apt-text-slate">No-Show Risk:</strong>
                  <span style={{ color: parseFloat(viewDetails.noShowRisk) < 10 ? '#10b981' : parseFloat(viewDetails.noShowRisk) < 20 ? '#f59e0b' : '#ef4444', fontWeight: '600' }}>{viewDetails.noShowRisk}%</span>

                  <strong className="apt-text-slate">MongoDB ID:</strong>
                  <span style={{ color: '#8b5cf6', fontFamily: 'monospace', fontSize: '12px' }}>{viewDetails._id}</span>

                  <strong className="apt-text-slate">Created:</strong>
                  <span style={{ color: '#64748b', fontSize: '13px' }}>{new Date(viewDetails.createdAt).toLocaleString()}</span>

                  <strong className="apt-text-slate">Updated:</strong>
                  <span style={{ color: '#64748b', fontSize: '13px' }}>{new Date(viewDetails.updatedAt).toLocaleString()}</span>
                </div>
              </div>

              <button onClick={() => setViewDetails(null)} className="apt-btn apt-btn-close">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentScheduling;