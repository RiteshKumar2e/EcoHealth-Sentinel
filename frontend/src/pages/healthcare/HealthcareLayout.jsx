import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Calendar, Stethoscope, Activity, AlertCircle, Video, Heart, FileText, MessageSquare, Settings, Menu, X, User } from 'lucide-react';
import './Dashboard.css'; // Reusing dashboard styles for consistent sidebar

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
        const handleResize = () => {
            if (window.innerWidth > 1024) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const menuItems = [
        { path: '/healthcare/profile', icon: User, label: 'My Profile' },
        { path: '/healthcare/dashboard', icon: Home, label: 'Health Overview' },
        { path: '/healthcare/patients', icon: FileText, label: 'My Records' },
        { path: '/healthcare/appointments', icon: Calendar, label: 'Bookings' },
        { path: '/healthcare/diagnosis', icon: Stethoscope, label: 'Symptom Checker' },
        { path: '/healthcare/medical-images', icon: Activity, label: 'My Scans' },
        { path: '/healthcare/emergency', icon: AlertCircle, label: 'Health Risks' },
        { path: '/healthcare/telemedicine', icon: Video, label: 'Consult Doctor' },
        { path: '/healthcare/monitoring', icon: Heart, label: 'Vitals Sync' },
        { path: '/healthcare/reports', icon: FileText, label: 'Med Reports' },
        { path: '/healthcare/chatbot', icon: MessageSquare, label: 'Health Assistant' },
        { path: '/healthcare/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className={`sidebar ${!isSidebarOpen ? 'hidden' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-logo">PatientAid</h2>
                    <p className="sidebar-tagline">Your Personal Health Companion</p>
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
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`menu-toggle ${!isSidebarOpen ? 'sidebar-closed' : ''}`}
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div className="healthcare-content-wrapper">
                    <div className="healthcare-content-inner">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthcareLayout;
