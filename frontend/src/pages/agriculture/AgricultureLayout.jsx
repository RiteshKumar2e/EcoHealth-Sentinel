import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Home, Leaf, Sun, Droplets, Sprout, Settings, BarChart,
    Truck, Bug, MessageSquare, Users, User, X, Menu
} from 'lucide-react';
import '../healthcare/HealthOverview.css';
import AgriFloatingChatbot from '../../components/agriculture/AgriFloatingChatbot';

const AgricultureLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
        if (window.innerWidth <= 1024) {
            setIsSidebarOpen(false);
        }
    };

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
        { path: '/agriculture/profile', icon: User, label: 'My Profile' },
        { path: '/agriculture/dashboard', icon: Home, label: 'Agri Dashboard' },
        { path: '/agriculture/crop-disease', icon: Leaf, label: 'Crop Health' },
        { path: '/agriculture/weather', icon: Sun, label: 'Forecast' },
        { path: '/agriculture/irrigation', icon: Droplets, label: 'Smart Water' },
        { path: '/agriculture/automation', icon: Settings, label: 'Automation' },
        { path: '/agriculture/market', icon: BarChart, label: 'Market' },
        { path: '/agriculture/supply-chain', icon: Truck, label: 'Supply Chain' },
        { path: '/agriculture/pest-control', icon: Bug, label: 'Pest Guard' },
        { path: '/agriculture/reports', icon: BarChart, label: 'Analytics' },
        { path: '/agriculture/community', icon: Users, label: 'Community' }
    ];

    return (
        <div className="dashboard-container" style={{ background: '#f8fafc' }}>
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

            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} style={{ backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>
                <div className="sidebar-header" style={{ padding: '24px' }}>
                    <div className="sidebar-brand-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div className="brand-logo-hex" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Sprout size={24} color="white" fill="white" />
                            </div>
                            <div className="brand-text-block">
                                <h1 className="brand-title" style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#0f172a' }}>AgriAI</h1>
                                <p className="brand-subtitle" style={{ fontSize: '10px', color: '#10b981', fontWeight: '700', margin: 0 }}>SENTINEL COMMAND</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            style={{
                                background: '#f1f5f9',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '6px',
                                cursor: 'pointer',
                                color: '#64748b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                            className="sidebar-close-btn-inner"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="sidebar-nav" style={{ padding: '0 16px' }}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <div
                                key={item.path}
                                onClick={() => handleNavigation(item.path)}
                                className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: isActive ? '#ecfdf5' : 'transparent',
                                    color: isActive ? '#059669' : '#475569',
                                    borderRadius: '12px',
                                    marginBottom: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px 16px',
                                    transition: 'all 0.2s ease',
                                    fontWeight: isActive ? '700' : '500',
                                    position: 'relative'
                                }}
                            >
                                <item.icon size={20} color={isActive ? '#059669' : '#94a3b8'} />
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

            <div className={`main-content ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="menu-toggle"
                        style={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            color: 'white'
                        }}
                    >
                        <Menu size={20} />
                    </button>
                )}

                <div className="healthcare-content-wrapper">
                    <div className="healthcare-content-inner">
                        <Outlet />
                    </div>
                </div>
                <AgriFloatingChatbot />
            </div>
        </div>
    );
};

export default AgricultureLayout;
