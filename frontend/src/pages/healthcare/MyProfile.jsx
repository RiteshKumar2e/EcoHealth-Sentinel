import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Activity, Save, Bell, Shield, LogOut, Camera, Heart, Stethoscope, Ruler, Scale, Hash } from 'lucide-react';
import './MyProfile.css';

const MyProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(() => {
        const saved = localStorage.getItem('userProfile');
        return saved ? JSON.parse(saved) : {
            name: 'Anmol Sharma',
            email: 'anmol.patient@example.com',
            phone: '+91 98765 43210',
            location: 'Chandigarh, India',
            bloodGroup: 'O+ Positive',
            age: '26 Years',
            height: '175 cm',
            weight: '72 kg',
            joinedDate: 'January 2024',
            avatar: null
        };
    });

    const [settings, setSettings] = useState({
        notifications: true,
        patientPrivacy: true,
        aiDiagnosis: true
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        localStorage.setItem('userProfile', JSON.stringify(profile));
        // Simulate API call to persist changes
        setTimeout(() => {
            setIsSaving(false);
            alert('Health profile updated successfully! ❤️');
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
        <>
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
                            <Camera size={18} color="#3b82f6" />
                        </button>
                    </div>
                </div>
                <h1 className="profile-name-title">{profile.name}</h1>
                <div className="profile-role-badge">Verified Health Sentinel User</div>

                <div className="profile-stats-grid">
                    <div className="stat-box">
                        <div className="stat-lab">Blood Group</div>
                        <div className="stat-val">{profile.bloodGroup}</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-lab">BMI Status</div>
                        <div className="stat-val">Healthy</div>
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
                            <span className="icon-box"><User size={20} color="#3b82f6" /></span>
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
                            <span className="icon-box"><Activity size={20} color="#3b82f6" /></span>
                            Health Vitals
                        </h2>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Blood Group</label>
                                <input
                                    type="text"
                                    className="profile-input"
                                    value={profile.bloodGroup}
                                    onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Age</label>
                                <input
                                    type="text"
                                    className="profile-input"
                                    value={profile.age}
                                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Height (cm)</label>
                                <input
                                    type="text"
                                    className="profile-input"
                                    value={profile.height}
                                    onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Weight (kg)</label>
                                <input
                                    type="text"
                                    className="profile-input"
                                    value={profile.weight}
                                    onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
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
                                <span className="pref-label">Health Alerts</span>
                                <div
                                    className={`toggle ${settings.notifications ? 'active' : ''}`}
                                    onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                                >
                                    <div className="toggle-knob"></div>
                                </div>
                            </div>
                            <div className="pref-item">
                                <span className="pref-label">Data Privacy Mode</span>
                                <div
                                    className={`toggle ${settings.patientPrivacy ? 'active' : ''}`}
                                    onClick={() => setSettings({ ...settings, patientPrivacy: !settings.patientPrivacy })}
                                >
                                    <div className="toggle-knob"></div>
                                </div>
                            </div>
                            <div className="pref-item">
                                <span className="pref-label">AI Health Analysis</span>
                                <div
                                    className={`toggle ${settings.aiDiagnosis ? 'active' : ''}`}
                                    onClick={() => setSettings({ ...settings, aiDiagnosis: !settings.aiDiagnosis })}
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
                            Manage your account security and health data privacy.
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
        </>
    );
};

export default MyProfile;
