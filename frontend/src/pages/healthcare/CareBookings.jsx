import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Bell, Activity, Trash2, Edit, Eye, Download, Filter, Search } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './CareBookings.css';

const CareBookings = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
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
  const [stats, setStats] = useState({ total: 0, today: 0, upcoming: 0, completed: 0 });
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);
  const navigate = useNavigate();

  // Static doctors list
  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', available: true },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Neurology', available: true },
    { id: 3, name: 'Dr. Emily Davis', specialty: 'Pediatrics', available: true },
    { id: 4, name: 'Dr. James Wilson', specialty: 'Orthopedics', available: false }
  ];

  // Static slots for simplicity
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = () => {
    if (!formData.patientName || !formData.phone || !formData.email || !formData.doctor || !formData.reason || !formData.timeSlot) {
      showNotification('error', 'Please fill all required fields');
      return;
    }

    const newAppointment = {
      _id: editingId || `apt_${Date.now()}`,
      ...formData,
      date: selectedDate,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingId) {
      setAppointments(prev => prev.map(apt => apt._id === editingId ? newAppointment : apt));
      showNotification('success', 'Appointment updated successfully');
      setEditingId(null);
    } else {
      setAppointments(prev => [...prev, newAppointment]);
      showNotification('success', 'Appointment booked successfully');
    }

    // Reset form
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

    // Update stats logic
    const currentAppointments = editingId
      ? appointments.map(apt => apt._id === editingId ? newAppointment : apt)
      : [...appointments, newAppointment];
    updateLocalStats(currentAppointments);
  };

  const updateLocalStats = (currentAppointments) => {
    const today = new Date().toISOString().split('T')[0];
    setStats({
      total: currentAppointments.length,
      today: currentAppointments.filter(apt => apt.date === today).length,
      upcoming: currentAppointments.filter(apt => apt.date >= today && apt.status === 'confirmed').length,
      completed: currentAppointments.filter(apt => apt.status === 'completed').length
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    const updated = appointments.filter(apt => apt._id !== id);
    setAppointments(updated);
    updateLocalStats(updated);
    showNotification('success', 'Appointment deleted');
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
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = appointments.map(apt => apt._id === id ? { ...apt, status: newStatus } : apt);
    setAppointments(updated);
    updateLocalStats(updated);
    showNotification('success', `Status updated to ${newStatus}`);
  };

  const handleExport = () => {
    const doc = new jsPDF();
    const primaryColor = [59, 130, 246]; // Blue-500

    doc.setFontSize(22);
    doc.setTextColor(...primaryColor);
    doc.text("Care Bookings Report", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.line(14, 32, 196, 32);

    const tableData = appointments.map(apt => [
      apt.date,
      apt.timeSlot,
      apt.patientName,
      apt.doctor,
      apt.status,
      apt.phone
    ]);

    if (tableData.length > 0) {
      autoTable(doc, {
        startY: 40,
        head: [['Date', 'Time', 'Patient', 'Doctor', 'Status', 'Phone']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: primaryColor, textColor: 255 }
      });
    } else {
      doc.text("No appointments found.", 14, 45);
    }

    doc.save(`Care_Bookings_${new Date().toISOString().split('T')[0]}.pdf`);
    showNotification('success', 'PDF exported successfully');
  };

  const filteredAppointments = appointments.filter(apt =>
    apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.phone.includes(searchTerm)
  );

  return (
    <div className="apt-scheduling-container">
      <div className="apt-content-wrapper">
        {/* Header */}
        <div className="apt-card-3d">
          <div className="apt-header-content">
            <div className="apt-title-group">
              <div className="apt-icon-wrapper">
                <Calendar className="apt-main-icon" />
              </div>
              <div>
                <h1 className="apt-title">Personal Care Booking</h1>
                <p className="apt-subtitle">
                  Private Consultation Scheduling
                </p>
              </div>
            </div>
            <div className="apt-header-actions">
              <button
                onClick={() => navigate('/healthcare/consultations')}
                className="apt-btn"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}
              >
                <Activity size={18} /> My Consultations
              </button>
              <button onClick={handleExport} className="apt-btn apt-btn-export">
                <Download className="apt-btn-icon" />
                Export PDF
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
                  <div className="apt-stat-label">Total Bookings</div>
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
                <Bell className="apt-stat-icon" />
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
        </div>

        {/* Notification */}
        {notification && (
          <div className={`apt-notification ${notification.type === 'success' ? 'apt-notif-success' : notification.type === 'error' ? 'apt-notif-error' : 'apt-notif-info'}`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : notification.type === 'error' ? <XCircle size={20} /> : <AlertCircle size={20} />}
            <span className="apt-notif-text">{notification.message}</span>
          </div>
        )}

        <div className="apt-main-grid">
          {/* Booking Form */}
          <div className="apt-form-card">
            <h2 className="apt-section-title">
              <User className="apt-section-icon" />
              {editingId ? 'Reschedule Booking' : 'Book a Consultation'}
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
                  {doctors.filter(d => d.available).map(doc => (
                    <option key={doc.id} value={doc.name}>{doc.name} - {doc.specialty}</option>
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
                <button onClick={handleSubmit} className="apt-btn apt-btn-save" style={{ flex: 1, color: '#fff' }}>
                  {editingId ? 'Update Booking' : 'Confirm Booking'}
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
              Available Time Slots
            </h2>
            <div className="apt-slots-grid">
              {timeSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => setFormData(prev => ({ ...prev, timeSlot: slot }))}
                  className={`apt-slot-card ${formData.timeSlot === slot ? 'selected' : 'available'}`}
                >
                  <div className="apt-slot-time">{slot}</div>
                  <div className="apt-slot-detail">Tap to select</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="apt-card-3d" style={{ marginTop: '24px' }}>
          <div className="apt-list-header">
            <h2 className="apt-section-title">
              My Appointment History ({filteredAppointments.length})
            </h2>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div className="apt-search-wrapper">
                <Search className="apt-search-icon" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search appointments..." className="apt-search-input" />
              </div>

              <div className="apt-filter-group">
                <Filter size={16} color="#64748b" />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="apt-select-small">
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="apt-empty-state">
              <Calendar className="apt-empty-icon" />
              <p>No appointments found</p>
            </div>
          ) : (
            <div className="apt-list-container">
              {filteredAppointments.map((apt) => (
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
                      </div>
                    </div>

                    <div className="apt-appointment-meta">
                      <div className="apt-time">{apt.timeSlot}</div>
                      <div className="apt-date">📅 {apt.date}</div>

                      <div className="apt-status-actions">
                        <div className={`apt-risk-badge`} style={{
                          background: apt.status === 'confirmed' ? '#ecfdf5' : '#fef2f2',
                          color: apt.status === 'confirmed' ? '#047857' : '#991b1b'
                        }}>
                          {apt.status.toUpperCase()}
                        </div>
                      </div>

                      <div className="apt-action-buttons">
                        <button onClick={() => handleEdit(apt)} className="apt-btn-small apt-btn-edit">
                          <Edit size={14} /> Edit
                        </button>
                        <button onClick={() => setViewDetails(apt)} className="apt-btn-small apt-btn-view">
                          <Eye size={14} /> View
                        </button>
                        <button onClick={() => handleDelete(apt._id)} className="apt-btn-small apt-btn-delete">
                          <Trash2 size={14} /> Delete
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
                Appointment Details
              </h2>
              <div className="apt-modal-details">
                <strong className="apt-text-slate">Patient:</strong>
                <span>{viewDetails.patientName}</span>
                <strong className="apt-text-slate">Doctor:</strong>
                <span>{viewDetails.doctor}</span>
                <strong className="apt-text-slate">Date & Time:</strong>
                <span>{viewDetails.date} at {viewDetails.timeSlot}</span>
                <strong className="apt-text-slate">Status:</strong>
                <span style={{ textTransform: 'capitalize' }}>{viewDetails.status}</span>
                <strong className="apt-text-slate">Reason:</strong>
                <span>{viewDetails.reason}</span>
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

export default CareBookings;