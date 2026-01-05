import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Activity, Save, Bell, Shield, LogOut, Camera, Leaf, TreeDeciduous, Wind, Recycle, ChevronLeft, Zap } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(() => {
        const saved = localStorage.getItem('envUserProfile');
        return saved ? JSON.parse(saved) : {
            name: '',
            email: '',
            phone: '',
            location: '',
            carbonScore: '850',
            treesPlanted: '12',
            eventsJoined: '5',
            impactLevel: 'Eco-Warrior',
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            avatar: null
        };
    });

    const [settings, setSettings] = useState({
        notifications: true,
        publicProfile: true,
        newsletter: true
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        localStorage.setItem('envUserProfile', JSON.stringify(profile));
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            alert('Eco-Profile updated successfully! 🌍');
        }, 1200);
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            navigate('/auth/login');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({ ...prev, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-wrapper">
                {/* Profile Hero Card */}
                <div className="profile-card-hero">
                    <button className="back-portal-btn-profile" onClick={() => navigate('/auth/dashboard')}>
                        <ChevronLeft size={20} />
                        Back to Domain Portal
                    </button>
                    <button className="logout-btn-profile" onClick={handleLogout}>
                        <LogOut size={16} />
                        Logout
                    </button>

                    <div className="profile-hero-bg"></div>
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar">
                            {profile.avatar ? (
                                <img src={profile.avatar} alt="Profile" className="avatar-img" />
                            ) : (
                                <User size={80} strokeWidth={1.5} />
                            )}
                            <input
                                type="file"
                                id="avatar-input"
                                hidden
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <button
                                className="camera-btn"
                                onClick={() => document.getElementById('avatar-input').click()}
                                style={{
                                    position: 'absolute',
                                    bottom: '5px',
                                    right: '5px',
                                    background: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    padding: '8px',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                    cursor: 'pointer',
                                    zIndex: 10
                                }}
                            >
                                <Camera size={18} color="#10b981" />
                            </button>
                        </div>
                    </div>
                    <h1 className="profile-name-title">{profile.name || 'User'}</h1>
                    <div className="profile-role-badge">{profile.impactLevel}</div>

                    <div className="profile-stats-grid">
                        <div className="stat-box">
                            <div className="stat-lab">Carbon Score</div>
                            <div className="stat-val">{profile.carbonScore}</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-lab">Trees Planted</div>
                            <div className="stat-val">{profile.treesPlanted}</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-lab">Events Joined</div>
                            <div className="stat-val">{profile.eventsJoined}</div>
                        </div>
                    </div>
                </div>

                <div className="profile-main-grid">
                    {/* Left Column: Editable Info */}
                    <div className="profile-content-left">
                        <section className="section-card">
                            <h2 className="section-title">
                                <span className="icon-box"><User size={20} color="#10b981" /></span>
                                Personal Information
                            </h2>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        className="profile-input"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        className="profile-input"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        className="profile-input"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        placeholder="+91 999 999 9999"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        className="profile-input"
                                        value={profile.location}
                                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                        placeholder="City, Country"
                                    />
                                </div>
                            </div>

                            <h2 className="section-title" style={{ marginTop: '2rem' }}>
                                <span className="icon-box"><Leaf size={20} color="#10b981" /></span>
                                Eco Impact Stats
                            </h2>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Carbon Score (Pt)</label>
                                    <input
                                        type="text"
                                        className="profile-input"
                                        value={profile.carbonScore}
                                        readOnly
                                        style={{ background: '#f8fafc', cursor: 'default' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Trees Planted</label>
                                    <input
                                        type="text"
                                        className="profile-input"
                                        value={profile.treesPlanted}
                                        readOnly
                                        style={{ background: '#f8fafc', cursor: 'default' }}
                                    />
                                </div>
                            </div>

                            <button className="btn-save" onClick={handleSave} disabled={isSaving}>
                                <Save size={20} />
                                {isSaving ? 'Updating Profile...' : 'Save Changes'}
                            </button>
                        </section>
                    </div>

                    {/* Right Column: Preferences & Account */}
                    <div className="profile-content-right">
                        <section className="section-card">
                            <h2 className="section-title">
                                <span className="icon-box"><Bell size={20} color="#334155" /></span>
                                Preferences
                            </h2>
                            <div className="preferences-list">
                                <div className="pref-item">
                                    <span className="pref-label">Disaster Alerts</span>
                                    <div
                                        className={`toggle ${settings.notifications ? 'active' : ''}`}
                                        onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                                    >
                                        <div className="toggle-knob"></div>
                                    </div>
                                </div>
                                <div className="pref-item">
                                    <span className="pref-label">Public Eco-Profile</span>
                                    <div
                                        className={`toggle ${settings.publicProfile ? 'active' : ''}`}
                                        onClick={() => setSettings({ ...settings, publicProfile: !settings.publicProfile })}
                                    >
                                        <div className="toggle-knob"></div>
                                    </div>
                                </div>
                                <div className="pref-item">
                                    <span className="pref-label">Green Newsletter</span>
                                    <div
                                        className={`toggle ${settings.newsletter ? 'active' : ''}`}
                                        onClick={() => setSettings({ ...settings, newsletter: !settings.newsletter })}
                                    >
                                        <div className="toggle-knob"></div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="section-card danger-zone-section" style={{ borderTop: '2px dashed #fee2e2', marginTop: '1rem', paddingTop: '1rem' }}>
                            <h2 className="section-title" style={{ color: '#ef4444' }}>
                                <span className="icon-box" style={{ background: '#fef2f2', border: '1px solid #fee2e2' }}><Shield size={20} color="#ef4444" /></span>
                                Account Security
                            </h2>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                                Manage your account security and data privacy.
                            </p>
                            <button className="btn-delete" style={{
                                background: '#fef2f2',
                                color: '#ef4444',
                                border: '1px solid #fee2e2',
                                padding: '0.875rem',
                                borderRadius: '12px',
                                width: '100%',
                                fontWeight: '700',
                                cursor: 'pointer'
                            }}>
                                Request Data Deletion
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
