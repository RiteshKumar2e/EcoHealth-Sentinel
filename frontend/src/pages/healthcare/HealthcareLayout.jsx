import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Calendar, Stethoscope, Activity, AlertCircle, Video, Heart, FileText, MessageSquare, Settings, Menu, X, User } from 'lucide-react';
import './HealthOverview.css'; // Reusing dashboard styles for consistent sidebar
import HealthFloatingChatbot from '../../components/healthcare/HealthFloatingChatbot';

const HealthcareLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
    const location = useLocation();
    const navigate = useNavigate();

    // Auto-close sidebar on mobile after navigation
    const handleNavigation = (path) => {
        navigate(path);
        if (window.innerWidth <= 1024) {
            setIsSidebarOpen(false);
        }
    };

    // Handle window resize
    useEffect(() => {
        let lastWidth = window.innerWidth;
        const handleResize = () => {
            const currentWidth = window.innerWidth;
            if (lastWidth <= 1024 && currentWidth > 1024) {
                setIsSidebarOpen(true);
            } else if (lastWidth > 1024 && currentWidth <= 1024) {
                setIsSidebarOpen(false);
            }
            lastWidth = currentWidth;
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const menuItems = [
        { path: '/healthcare/profile', icon: User, label: 'My Profile' },
        { path: '/healthcare/overview', icon: Home, label: 'Health Overview' },
        { path: '/healthcare/medical-vault', icon: FileText, label: 'My Records' },
        { path: '/healthcare/bookings', icon: Calendar, label: 'Bookings' },
        { path: '/healthcare/symptom-checker', icon: Stethoscope, label: 'Symptom Checker' },
        { path: '/healthcare/my-scans', icon: Activity, label: 'My Scans' },
        { path: '/healthcare/health-risks', icon: AlertCircle, label: 'Health Risks' },
        { path: '/healthcare/consultations', icon: Video, label: 'Consult Doctor' },
        { path: '/healthcare/vitals-hub', icon: Heart, label: 'Vitals Sync' },
        { path: '/healthcare/my-meds', icon: Activity, label: 'My Meds' },
        { path: '/healthcare/health-reports', icon: FileText, label: 'Med Reports' },

    ];

    return (
        <div className="dashboard-container">
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && window.innerWidth <= 1024 && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 999
                    }}
                />
            )}

            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-brand-container">
                        <div className="brand-logo-hex">
                            <Heart size={22} color="white" fill="white" />
                        </div>
                        <div className="brand-text-block">
                            <h1 className="brand-title">PatientAid</h1>
                            <p className="brand-subtitle">PERSONAL HEALTH</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="sidebar-close-btn"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="sidebar-nav">
                    {menuItems.map((item) => (
                        <div
                            key={item.path}
                            onClick={() => handleNavigation(item.path)}
                            className={`sidebar-item ${location.pathname === item.path ? 'sidebar-item-active' : ''}`}
                            style={{ cursor: 'pointer' }}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                            {location.pathname === item.path && <div className="sidebar-indicator" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className={`main-content ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
                {/* Mobile Menu Toggle */}
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="menu-toggle"
                    >
                        <Menu size={24} />
                    </button>
                )}

                <div className="healthcare-content-wrapper">
                    <div className="healthcare-content-inner">
                        <Outlet />
                    </div>
                </div>
                <HealthFloatingChatbot />
            </div>
        </div>
    );
};


export default HealthcareLayout;
