import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Home,
    Wind,
    CloudLightning,
    ThermometerSun,
    Trees,
    Recycle,
    Factory,
    Leaf,
    FileText,
    Settings,
    Menu,
    X,
    MessageSquare,
    User
} from 'lucide-react';
import '../healthcare/HealthOverview.css'; // Reusing consistent styles
import EnvironmentFloatingChatbot from '../../components/environment/EnvironmentFloatingChatbot';

const EnvironmentLayout = () => {
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
        { path: '/environment/profile', icon: User, label: 'My Profile' },
        { path: '/environment/dashboard', icon: Home, label: 'Eco Dashboard' },
        { path: '/environment/climate', icon: ThermometerSun, label: 'Climate Predictions' },
        { path: '/environment/disaster', icon: CloudLightning, label: 'Disaster Guard' },
        { path: '/environment/pollution', icon: Factory, label: 'Pollution Radar' },
        { path: '/environment/wildlife', icon: Trees, label: 'Wildlife Save' },
        { path: '/environment/renewable', icon: Wind, label: 'Green Energy' },
        { path: '/environment/carbon', icon: Leaf, label: 'Carbon Calculator' },
        { path: '/environment/waste', icon: Recycle, label: 'Waste Manager' },
        { path: '/environment/awareness', icon: MessageSquare, label: 'Eco Awareness' },
        { path: '/environment/reports', icon: FileText, label: 'Env Reports' }
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
                        <div className="brand-logo-hex" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                            <Leaf size={22} color="white" fill="white" />
                        </div>
                        <div className="brand-text-block">
                            <h1 className="brand-title">EcoSentinel</h1>
                            <p className="brand-subtitle" style={{ color: '#10b981' }}>PLANET GUARD</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="sidebar-close-btn"
                        style={{
                            background: 'linear-gradient(135deg, #10b981, #059669)'
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="sidebar-nav">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <div
                                key={item.path}
                                onClick={() => handleNavigation(item.path)}
                                className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: isActive ? '#ecfdf5' : 'transparent', // Light green background for active
                                    color: isActive ? '#059669' : '#475569', // Green text for active
                                    borderRadius: '12px',
                                    marginBottom: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px 16px', // Ensure consistent padding
                                    transition: 'all 0.2s ease',
                                    fontWeight: isActive ? '600' : '500'
                                }}
                            >
                                <item.icon size={20} color={isActive ? '#059669' : '#64748b'} />
                                <span style={{ marginLeft: '12px' }}>{item.label}</span>
                                {isActive && (
                                    <div
                                        className="sidebar-indicator"
                                        style={{
                                            position: 'absolute',
                                            left: '0',
                                            width: '4px',
                                            height: '24px',
                                            background: '#059669',
                                            borderTopRightRadius: '4px',
                                            borderBottomRightRadius: '4px'
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className={`main-content ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
                {/* Mobile Menu Toggle */}
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="menu-toggle"
                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                    >
                        <Menu size={24} />
                    </button>
                )}

                <div className="healthcare-content-wrapper">
                    <div className="healthcare-content-inner">
                        <Outlet />
                    </div>
                </div>
                <EnvironmentFloatingChatbot />
            </div>
        </div>
    );
};

export default EnvironmentLayout;
