import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Leaf, Save, Bell, Shield, LogOut, Camera, Globe, Trash2 } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        name: 'Anmol Sharma',
        email: 'anmol.agri@example.com',
        phone: '+91 98765 43210',
        location: 'Punjab, India',
        farmSize: '15 Acres',
        primaryCrop: 'Wheat & Rice',
        joinedDate: 'March 2024',
        avatar: null // Will store image data URL
    });

    const [settings, setSettings] = useState({
        notifications: true,
        aiAnalysis: true,
        publicProfile: false
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            alert('Profile updated successfully! ✨');
        }, 1200);
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

                <button className="btn-logout" onClick={() => navigate('/')}>
                    <LogOut size={20} />
                    <span>Log Out</span>
                </button>

                {/* Profile Hero Card */}
                <div className="profile-card-hero">
                    <div className="profile-hero-bg"></div>
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar">
                            {profile.avatar ? (
                                <img src={profile.avatar} alt="Profile" className="avatar-img" style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '50%'
                                }} />
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
                    <h1 className="profile-name-title">{profile.name}</h1>
                    <div className="profile-role-badge">Premium Farmer Member</div>

                    <div className="profile-stats-grid">
                        <div className="stat-box">
                            <div className="stat-lab">Farm Size</div>
                            <div className="stat-val">{profile.farmSize}</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-lab">Total Harvest</div>
                            <div className="stat-val">240 Tons</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-lab">Member Since</div>
                            <div className="stat-val">{profile.joinedDate}</div>
                        </div>
                    </div>
                </div>

                <div className="profile-main-grid">
                    {/* Left Column: Editable Info */}
                    <div className="profile-content-left">
                        <section className="section-card">
                            <h2 className="section-title">
                                <span className="icon-box"><User size={20} color="#059669" /></span>
                                Personal Details
                            </h2>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        className="profile-input"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        className="profile-input"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
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
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        className="profile-input"
                                        value={profile.location}
                                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <h2 className="section-title" style={{ marginTop: '2rem' }}>
                                <span className="icon-box"><Leaf size={20} color="#059669" /></span>
                                Farming Profile
                            </h2>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Farm Size (Acres)</label>
                                    <input
                                        type="text"
                                        className="profile-input"
                                        value={profile.farmSize}
                                        onChange={(e) => setProfile({ ...profile, farmSize: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Primary Crop</label>
                                    <input
                                        type="text"
                                        className="profile-input"
                                        value={profile.primaryCrop}
                                        onChange={(e) => setProfile({ ...profile, primaryCrop: e.target.value })}
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
                                    <span className="pref-label">Push Notifications</span>
                                    <div
                                        className={`toggle ${settings.notifications ? 'active' : ''}`}
                                        onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                                    >
                                        <div className="toggle-knob"></div>
                                    </div>
                                </div>
                                <div className="pref-item">
                                    <span className="pref-label">AI Crop Analysis</span>
                                    <div
                                        className={`toggle ${settings.aiAnalysis ? 'active' : ''}`}
                                        onClick={() => setSettings({ ...settings, aiAnalysis: !settings.aiAnalysis })}
                                    >
                                        <div className="toggle-knob"></div>
                                    </div>
                                </div>
                                <div className="pref-item">
                                    <span className="pref-label">Public Feed Profile</span>
                                    <div
                                        className={`toggle ${settings.publicProfile ? 'active' : ''}`}
                                        onClick={() => setSettings({ ...settings, publicProfile: !settings.publicProfile })}
                                    >
                                        <div className="toggle-knob"></div>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
