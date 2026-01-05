import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Leaf, Sun, Droplets, Sprout, Settings, BarChart, Truck, Bug, MessageSquare, Users, User, Cog, Menu, X, Bot } from 'lucide-react';
import './Dashboard.css'; // Reusing existing styles
import AgriFloatingChatbot from '../../components/agriculture/AgriFloatingChatbot';

const AgricultureLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const location = useLocation();
    const navigate = useNavigate();

    // Auto-close sidebar on mobile after navigation
    const handleNavigation = (path) => {
        navigate(path);
        if (window.innerWidth <= 768) {
            setIsSidebarOpen(false);
        }
    };

    // Handle window resize
    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
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
        { path: '/agriculture/dashboard', icon: Home, label: 'Dashboard' },
        { path: '/agriculture/crop-disease', icon: Leaf, label: 'Crop Disease' },
        { path: '/agriculture/weather', icon: Sun, label: 'Weather Forecast' },
        { path: '/agriculture/irrigation', icon: Droplets, label: 'Smart Irrigation' },
        { path: '/agriculture/automation', icon: Settings, label: 'Farm Automation' },
        { path: '/agriculture/market', icon: BarChart, label: 'Market Forecast' },
        { path: '/agriculture/supply-chain', icon: Truck, label: 'Supply Chain' },
        { path: '/agriculture/pest-control', icon: Bug, label: 'Pest Control' },
        { path: '/agriculture/reports', icon: BarChart, label: 'Agri Reports' },
        { path: '/agriculture/community', icon: Users, label: 'Community Hub' }
    ];

    return (
        <div className="dashboard-page-container">
            <div className="agri-bg-overlay"></div>
            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <div className="sidebar-brand-container">
                        <div className="brand-logo-hex">
                            <Sprout size={22} color="white" fill="white" />
                        </div>
                        <div className="brand-text-block">
                            <h1 className="brand-title">AgriAI</h1>
                            <p className="brand-subtitle">SENTINEL COMMAND</p>
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
                            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Menu Toggle Button */}
            {!isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="menu-toggle closed"
                >
                    <Menu size={24} color="#1f2937" />
                </button>
            )}

            {/* Main Content Area */}
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <div className="main-content-inner">
                    <Outlet />
                </div>
            </div>
            {/* Floating Chatbot for all pages */}
            <AgriFloatingChatbot />
        </div>
    );
};

export default AgricultureLayout;
