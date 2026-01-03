import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Leaf, Sun, Droplets, Sprout, Settings, BarChart, Truck, Bug, MessageSquare, Users, Cog, Menu, X } from 'lucide-react';
import './Dashboard.css'; // Reusing existing styles

const AgricultureLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/agriculture/dashboard', icon: Home, label: 'Dashboard' },
        { path: '/agriculture/crop-disease', icon: Leaf, label: 'Crop Disease' },
        { path: '/agriculture/weather', icon: Sun, label: 'Weather Forecast' },
        { path: '/agriculture/irrigation', icon: Droplets, label: 'Smart Irrigation' },
        { path: '/agriculture/automation', icon: Settings, label: 'Farm Automation' },
        { path: '/agriculture/market', icon: BarChart, label: 'Market Forecast' },
        { path: '/agriculture/supply-chain', icon: Truck, label: 'Supply Chain' },
        { path: '/agriculture/pest-control', icon: Bug, label: 'Pest Control' },
        { path: '/agriculture/chatbot', icon: MessageSquare, label: 'Reports & Chatbot' },
        { path: '/agriculture/community', icon: Users, label: 'Community Hub' },
        { path: '/agriculture/settings', icon: Cog, label: 'Settings' }
    ];

    return (
        <div className="dashboard-page-container">
            <div className="agri-bg-overlay"></div>
            {/* Sidebar */}
            <div className={`sidebar ${!isSidebarOpen ? 'hidden' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-logo">AgriAI</h2>
                    <p className="sidebar-tagline">Smart Farming Solutions</p>
                </div>
                <div className="sidebar-nav">
                    {menuItems.map((item) => (
                        <div
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Menu Toggle Button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`menu-toggle ${isSidebarOpen ? 'open' : 'closed'}`}
            >
                {isSidebarOpen ? <X size={24} color="#1f2937" /> : <Menu size={24} color="#1f2937" />}
            </button>

            {/* Main Content Area */}
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <div className="main-content-inner">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AgricultureLayout;
