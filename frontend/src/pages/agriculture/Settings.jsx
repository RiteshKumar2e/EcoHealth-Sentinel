import React, { useState, useEffect } from 'react';
import { Settings, User, Bell, Shield, Globe, Database, HelpCircle, Download, Trash2, Save } from 'lucide-react';
import './Settings.css';

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    name: 'Enter Name',
    phone: 'Enter Phone No.',
    location: 'Enter Location',
    farmSize: 'Enter Farm Size',
    primaryCrop: 'Enter Primary Crop',
    email: 'Enter Email',
    lastUpdated: new Date().toISOString()
  });

  const [notifications, setNotifications] = useState({
    pestAlerts: true,
    priceUpdates: true,
    weatherWarnings: true,
    systemUpdates: false,
    communityPosts: true
  });

  const [privacy, setPrivacy] = useState({
    shareData: false,
    aiAnalytics: true,
    locationTracking: true,
    anonymousUsage: true
  });

  const [language, setLanguage] = useState('en');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Load saved data from memory on mount
  useEffect(() => {
    const savedProfile = window.savedProfileData;
    if (savedProfile) {
      setProfile(savedProfile);
    }
  }, []);

  const showNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const toggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    showNotification(`${key.replace(/([A-Z])/g, ' $1').trim()} ${!notifications[key] ? 'enabled' : 'disabled'}`);
  };

  const togglePrivacy = (key) => {
    setPrivacy({ ...privacy, [key]: !privacy[key] });
    showNotification(`${key.replace(/([A-Z])/g, ' $1').trim()} ${!privacy[key] ? 'enabled' : 'disabled'}`);
  };

  const handleSaveProfile = () => {
    const updatedProfile = {
      ...profile,
      lastUpdated: new Date().toISOString()
    };
    setProfile(updatedProfile);

    // Save to memory
    window.savedProfileData = updatedProfile;

    // Create CSV content
    const csvContent = `Field,Value
Name,${updatedProfile.name}
Phone,${updatedProfile.phone}
Email,${updatedProfile.email}
Location,${updatedProfile.location}
Farm Size,${updatedProfile.farmSize}
Primary Crop,${updatedProfile.primaryCrop}
Last Updated,${new Date(updatedProfile.lastUpdated).toLocaleString()}`;

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `profile_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Profile saved and downloaded successfully!');
  };

  const handleExportData = () => {
    // Create comprehensive data export
    // eslint-disable-next-line no-unused-vars
    const exportData = {
      profile: profile,
      notifications: notifications,
      privacy: privacy,
      language: language,
      exportDate: new Date().toISOString()
    };

    // Convert to CSV format
    let csvContent = 'Category,Setting,Value\n';

    // Profile data
    Object.entries(profile).forEach(([key, value]) => {
      csvContent += `Profile,${key},${value}\n`;
    });

    // Notifications
    Object.entries(notifications).forEach(([key, value]) => {
      csvContent += `Notifications,${key},${value}\n`;
    });

    // Privacy
    Object.entries(privacy).forEach(([key, value]) => {
      csvContent += `Privacy,${key},${value}\n`;
    });

    csvContent += `Settings,Language,${language}\n`;
    csvContent += `Settings,Export Date,${new Date().toLocaleString()}\n`;

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `complete_data_export_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Complete data exported and downloaded successfully!');
  };

  const handleClearCache = () => {
    // Simulate cache clearing
    const cacheSize = Math.floor(Math.random() * 50) + 10;

    // Clear any stored data
    delete window.savedProfileData;

    setTimeout(() => {
      showNotification(`Cache cleared! ${cacheSize}MB of space freed.`);
    }, 500);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('⚠️ WARNING: This will permanently delete your account and all data. This action cannot be undone. Are you absolutely sure?')) {
      // Create final data backup before deletion
      // eslint-disable-next-line no-unused-vars
      const backupData = {
        profile: profile,
        notifications: notifications,
        privacy: privacy,
        deletionDate: new Date().toISOString()
      };

      const csvContent = `ACCOUNT DELETION BACKUP
Generated: ${new Date().toLocaleString()}

Profile Data:
${Object.entries(profile).map(([k, v]) => `${k}: ${v}`).join('\n')}

Notification Settings:
${Object.entries(notifications).map(([k, v]) => `${k}: ${v}`).join('\n')}

Privacy Settings:
${Object.entries(privacy).map(([k, v]) => `${k}: ${v}`).join('\n')}`;

      const blob = new Blob([csvContent], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `account_backup_before_deletion_${Date.now()}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification('Account backup downloaded. Account deletion initiated.', 'warning');

      // Simulate account deletion
      setTimeout(() => {
        showNotification('Account deleted. You will be logged out shortly.', 'error');
      }, 2000);
    }
  };

  const handleHelpCenter = () => {
    showNotification('Opening Help Center...');
    setTimeout(() => {
      window.open('https://support.example.com/help', '_blank');
    }, 500);
  };

  const handleContactSupport = () => {
    const supportEmail = 'support@farmapp.com';
    const subject = 'Support Request';
    const body = `Hello Support Team,\n\nUser: ${profile.name}\nPhone: ${profile.phone}\nLocation: ${profile.location}\n\nIssue Description:\n`;

    window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showNotification('Opening email client...');
  };

  const handleSendFeedback = () => {
    const feedbackData = `Feedback Form
Submitted: ${new Date().toLocaleString()}
User: ${profile.name}
Location: ${profile.location}

Please write your feedback below:
`;

    const blob = new Blob([feedbackData], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `feedback_form_${Date.now()}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Feedback form downloaded. Please fill and email to support.');
  };

  return (
    <div className="settings-container">
      {/* Animated Background Elements */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div className="settings-orb orb-1"></div>
        <div className="settings-orb orb-2"></div>
        <div className="settings-orb orb-3"></div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="settings-toast">
          <div className="toast-inner hover-scale" style={{
            background: toastType === 'success' ? '#16a34a' : toastType === 'warning' ? '#ea580c' : '#dc2626'
          }}>
            <div className="sc-bg-pulse" style={{
              width: '8px',
              height: '8px',
              background: 'white',
              borderRadius: '50%'
            }}></div>
            <span style={{ fontWeight: 500 }}>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="settings-max-width">
        {/* Header */}
        <div className="settings-glass-card hover-scale">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="settings-header-icon-box">
              <Settings style={{ width: '32px', height: '32px', color: 'white' }} />
            </div>
            <div>
              <h1 className="settings-page-title">Settings</h1>
              <p style={{ fontSize: '14px', color: '#4b5563', margin: 0 }}>Manage your account and preferences</p>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="settings-glass-card hover-scale-sm">
          <h2 className="section-title">
            <div className="section-icon-box" style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' }}>
              <User style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <span className="text-gradient" style={{ background: 'linear-gradient(to right, #2563eb, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Profile Information
            </span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-grid-2">
              <div>
                <label className="settings-label">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="settings-input"
                />
              </div>
              <div>
                <label className="settings-label">Phone Number</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="settings-input"
                />
              </div>
            </div>
            <div className="form-grid-2">
              <div>
                <label className="settings-label">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="settings-input"
                />
              </div>
              <div>
                <label className="settings-label">Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="settings-input"
                />
              </div>
            </div>
            <div className="form-grid-2">
              <div>
                <label className="settings-label">Farm Size</label>
                <input
                  type="text"
                  value={profile.farmSize}
                  onChange={(e) => setProfile({ ...profile, farmSize: e.target.value })}
                  className="settings-input"
                />
              </div>
              <div>
                <label className="settings-label">Primary Crops</label>
                <input
                  type="text"
                  value={profile.primaryCrop}
                  onChange={(e) => setProfile({ ...profile, primaryCrop: e.target.value })}
                  className="settings-input"
                />
              </div>
            </div>
            <button
              onClick={handleSaveProfile}
              className="settings-btn-primary hover-scale"
            >
              <Save style={{ width: '20px', height: '20px' }} />
              Save & Download Profile
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-glass-card hover-scale-sm">
          <h2 className="section-title">
            <div className="section-icon-box" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #ea580c 100%)' }}>
              <Bell style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <span className="text-gradient" style={{ background: 'linear-gradient(to right, #d97706, #ea580c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Notification Preferences
            </span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="notification-row">
                <span style={{ color: '#374151', textTransform: 'capitalize', fontWeight: 500 }}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <button
                  onClick={() => toggleNotification(key)}
                  className={`toggle-switch ${value ? 'toggle-active' : 'toggle-inactive'}`}
                >
                  <div className={`toggle-knob ${value ? 'knob-active' : 'knob-inactive'}`}></div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="settings-glass-card hover-scale-sm">
          <h2 className="section-title">
            <div className="section-icon-box" style={{ background: 'linear-gradient(135deg, #4ade80 0%, #059669 100%)' }}>
              <Shield style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <span className="text-gradient" style={{ background: 'linear-gradient(to right, #16a34a, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Privacy & Security
            </span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(privacy).map(([key, value]) => (
              <div key={key} className="notification-row">
                <div>
                  <span style={{ color: '#1f2937', textTransform: 'capitalize', display: 'block', fontWeight: 500 }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    {key === 'shareData' && 'Share anonymized data for agricultural research'}
                    {key === 'aiAnalytics' && 'Use AI to analyze your farm data'}
                    {key === 'locationTracking' && 'Enable weather & market alerts for your area'}
                    {key === 'anonymousUsage' && 'Help improve the app with usage statistics'}
                  </span>
                </div>
                <button
                  onClick={() => togglePrivacy(key)}
                  className={`toggle-switch ${value ? 'toggle-active' : 'toggle-inactive'}`}
                >
                  <div className={`toggle-knob ${value ? 'knob-active' : 'knob-inactive'}`}></div>
                </button>
              </div>
            ))}
          </div>
          <div className="security-badge hover-scale-sm">
            <Shield className="sc-bg-pulse" style={{ width: '20px', height: '20px', display: 'inline', marginRight: '8px' }} />
            <span style={{ fontWeight: 600 }}>Your data is encrypted and never sold to third parties</span>
          </div>
        </div>

        {/* Language */}
        <div className="settings-glass-card hover-scale-sm">
          <h2 className="section-title">
            <div className="section-icon-box" style={{ background: 'linear-gradient(135deg, #c084fc 0%, #db2777 100%)' }}>
              <Globe className="sc-spin-slow" style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <span className="text-gradient" style={{ background: 'linear-gradient(to right, #9333ea, #db2777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Language & Region
            </span>
          </h2>
          <div className="form-grid-2">
            <div>
              <label className="settings-label">Display Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="settings-input"
                style={{ cursor: 'pointer' }}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
              </select>
            </div>
            <div>
              <label className="settings-label">Currency</label>
              <select className="settings-input" style={{ cursor: 'pointer' }}>
                <option>INR (₹)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="settings-glass-card hover-scale-sm">
          <h2 className="section-title">
            <div className="section-icon-box" style={{ background: 'linear-gradient(135deg, #94a3b8 0%, #475569 100%)' }}>
              <Database style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <span className="text-gradient" style={{ background: 'linear-gradient(to right, #64748b, #334155)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Data Management
            </span>
          </h2>
          <div className="form-grid-2">
            <button
              onClick={handleExportData}
              className="settings-btn-primary hover-scale"
              style={{ background: 'white', color: '#1f2937', border: '1px solid #e5e7eb' }}
            >
              <Download style={{ width: '18px', height: '18px' }} />
              Export All Data
            </button>
            <button
              onClick={handleClearCache}
              className="settings-btn-primary hover-scale"
              style={{ background: 'white', color: '#1f2937', border: '1px solid #e5e7eb' }}
            >
              <Trash2 style={{ width: '18px', height: '18px' }} />
              Clear App Cache
            </button>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="settings-btn-primary hover-scale"
            style={{
              marginTop: '16px',
              width: '100%',
              background: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fecaca'
            }}
          >
            Delete Account Data
          </button>
        </div>

        {/* Help & Support */}
        <div className="settings-glass-card hover-scale-sm">
          <h2 className="section-title">
            <div className="section-icon-box" style={{ background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)' }}>
              <HelpCircle style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <span className="text-gradient" style={{ background: 'linear-gradient(to right, #9333ea, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Help & Support
            </span>
          </h2>
          <div className="form-grid-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <button
              onClick={handleHelpCenter}
              className="settings-btn-primary hover-scale"
              style={{ background: 'white', color: '#374151', border: '1px solid #e5e7eb', flexDirection: 'column', padding: '16px' }}
            >
              <HelpCircle style={{ width: '24px', height: '24px', marginBottom: '4px' }} />
              Help Center
            </button>
            <button
              onClick={handleContactSupport}
              className="settings-btn-primary hover-scale"
              style={{ background: 'white', color: '#374151', border: '1px solid #e5e7eb', flexDirection: 'column', padding: '16px' }}
            >
              <User style={{ width: '24px', height: '24px', marginBottom: '4px' }} />
              Contact Support
            </button>
            <button
              onClick={handleSendFeedback}
              className="settings-btn-primary hover-scale"
              style={{ background: 'white', color: '#374151', border: '1px solid #e5e7eb', flexDirection: 'column', padding: '16px' }}
            >
              <Settings style={{ width: '24px', height: '24px', marginBottom: '4px' }} />
              Send Feedback
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '24px', opacity: 0.6 }}>
          <p style={{ fontSize: '14px', color: '#4b5563' }}>App Version 2.4.0 (Build 2024.12)</p>
          <p style={{ fontSize: '12px', color: '#6b7280' }}>© 2024 Smart Farm Assistant. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;