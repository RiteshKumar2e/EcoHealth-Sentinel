import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Sun, Wind, Droplets, Zap, TrendingUp, Battery, DollarSign, Leaf, X, Download, RefreshCw, Bell, BarChart2, Users, Share2, PieChart as PieChartIcon } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './RenewableEnergy.css';

export default function RenewableEnergy() {
  const [selectedEnergy, setSelectedEnergy] = useState('all');
  const [timeRange, setTimeRange] = useState('month');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [liveData, setLiveData] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const energyStats = [];
  const monthlyGeneration = [];
  const energyMix = [];
  const projects = [];
  const predictions = [];
  const benefits = [];
  const energySources = [];

  const [stats, setStats] = useState({
    totalCapacity: 0,
    currentGeneration: 0,
    co2Saved: 0,
    costSavings: 0,
    householdsPowered: 0
  });

  useEffect(() => {
    // Live data update logic would go here
  }, [autoRefresh, liveData]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast('✅ Data refreshed!');
    }, 1000);
  };

  const downloadReport = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(59, 130, 246);
      doc.text('Renewable Energy Analytics', 20, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);

      doc.setFontSize(16);
      doc.setTextColor(30);
      doc.text('Performance Summary', 20, 50);

      doc.setFontSize(11);
      doc.text(`Total Capacity: ${stats.totalCapacity} kW`, 20, 60);
      doc.text(`Current Output: ${stats.currentGeneration} kW`, 20, 65);
      doc.text(`CO2 Saved: ${stats.co2Saved / 1000} tons`, 20, 70);

      doc.save(`renewable_report_${Date.now()}.pdf`);
      showToast('✅ Professional PDF Exported!');
    } catch (e) {
      console.error('Export error:', e);
      showToast('❌ Error exporting report.');
    }
  };

  const shareData = async () => {
    const text = `🌱 Renewable Energy Update\n\nCapacity: ${stats.totalCapacity} kW\nGeneration: ${stats.currentGeneration} kW`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (e) {
        navigator.clipboard.writeText(text);
        showToast('✅ Copied!');
      }
    } else {
      navigator.clipboard.writeText(text);
      showToast('✅ Copied!');
    }
  };

  const showToast = (msg) => {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.className = 'energy-toast';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  return (
    <div className={`renewable-energy-container ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      <div className="energy-main-wrapper" style={{ maxWidth: isFullscreen ? '100%' : '1400px' }}>
        {/* Header */}
        <div className="energy-card">
          <div className="flex-between flex-wrap gap-16">
            <div className="flex-center gap-16">
              <div className="header-icon-container">
                <Zap size={32} className="floating-icon" />
              </div>
              <div>
                <h1 className="text-5xl font-extrabold text-gray-800 m-0">Renewable energy</h1>
                <p className="text-gray-500 m-0 flex-center gap-8 text-lg justify-start">
                  <Leaf size={16} className="text-green-500" />
                  AI-optimized clean energy • Real-time monitoring
                </p>
              </div>
            </div>
            <div className="flex-center gap-12 flex-wrap" style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`btn btn-blue-gradient pos-relative ${showNotifications ? 'active' : ''}`}
              >
                <Bell size={22} color={showNotifications ? '#3b82f6' : '#4b5563'} />
                {notifications.length > 0 && (
                  <span className="notification-badge">{notifications.length}</span>
                )}
              </button>

              {showNotifications && (
                <div className="energy-notifications-dropdown">
                  <div className="notif-header">
                    <h3 className="m-0 text-sm font-bold">Alert Center</h3>
                    <X size={16} className="cursor-pointer" onClick={() => setShowNotifications(false)} />
                  </div>
                  <div className="notif-body">
                    {notifications.map(n => (
                      <div key={n.id} className="notif-item">
                        <p className="notif-title m-0 text-13 font-bold">{n.title}</p>
                        <p className="notif-msg m-0 text-11 text-gray-500">{n.message}</p>
                        <span className="notif-time text-10 text-gray-400">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={downloadReport} className="btn btn-amber-gradient">
                <Download size={22} color="#4b5563" />
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stat-grid">
          <div className="stat-card stat-amber">
            <Zap size={32} className="floating-icon mb-12" />
            <p className="text-sm opacity-0-9 mb-4 m-0">Total Capacity</p>
            <p className="text-4xl font-extrabold mb-4 m-0">{stats.totalCapacity.toLocaleString()}</p>
            <p className="text-xs opacity-0-8 m-0">kW</p>
          </div>

          <div className="stat-card stat-green">
            <TrendingUp size={32} className="floating-icon mb-12" />
            <p className="text-sm opacity-0-9 mb-4 m-0">Current Output</p>
            <p className="text-4xl font-extrabold mb-4 m-0">{stats.currentGeneration.toLocaleString()}</p>
            <p className="text-xs opacity-0-8 m-0 flex-center gap-4 justify-start">
              kW {liveData && <span className="live-dot"></span>} Live
            </p>
          </div>

          <div className="stat-card stat-blue">
            <Leaf size={32} className="floating-icon mb-12" />
            <p className="text-sm opacity-0-9 mb-4 m-0">CO₂ Saved</p>
            <p className="text-4xl font-extrabold mb-4 m-0">{(stats.co2Saved / 1000).toFixed(1)}</p>
            <p className="text-xs opacity-0-8 m-0">tons/year</p>
          </div>

          <div className="stat-card stat-purple">
            <DollarSign size={32} className="floating-icon mb-12" />
            <p className="text-sm opacity-0-9 mb-4 m-0">Cost Savings</p>
            <p className="text-4xl font-extrabold mb-4 m-0">₹{(stats.costSavings / 100000).toFixed(1)}</p>
            <p className="text-xs opacity-0-8 m-0">Lakh/year</p>
          </div>

          <div className="stat-card stat-cyan">
            <Users size={32} className="floating-icon mb-12" />
            <p className="text-sm opacity-0-9 mb-4 m-0">Households</p>
            <p className="text-4xl font-extrabold mb-4 m-0">{(stats.householdsPowered / 1000).toFixed(1)}K</p>
            <p className="text-xs opacity-0-8 m-0">powered</p>
          </div>
        </div>

        {/* Energy Sources */}
        <div className="source-grid">
          {energySources.map((source, index) => {
            const Icon = source.icon;
            return (
              <div key={index} className="source-card" style={{ background: source.bgColor }}>
                <div className="flex-between mb-16">
                  <div className="source-icon-container" style={{ background: source.gradient }}>
                    <Icon size={28} className="white-text floating-icon" />
                  </div>
                  <span className="source-badge" style={{ color: source.color }}>
                    {source.efficiency}%
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-12 m-0">{source.type} Energy</h3>
                <div className="mb-12">
                  <div className="flex-between text-sm mb-4">
                    <span className="text-gray-500">Capacity:</span>
                    <span className="font-bold text-gray-800">{source.capacity} kW</span>
                  </div>
                  <div className="flex-between text-sm">
                    <span className="text-gray-500">Generation:</span>
                    <span className="font-bold text-gray-800">{source.generation} kW</span>
                  </div>
                </div>
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${source.efficiency}%`, background: source.gradient }}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          <div className="energy-card chart-card-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-16">Monthly Energy Generation</h2>
            {monthlyGeneration.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlyGeneration}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="solar" stackId="a" fill="#f59e0b" name="Solar" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="wind" stackId="a" fill="#3b82f6" name="Wind" />
                  <Bar dataKey="hydro" stackId="a" fill="#06b6d4" name="Hydro" />
                  <Bar dataKey="biomass" stackId="a" fill="#10b981" name="Biomass" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex-center flex-col h-300 w-full bg-gray-50 br-12 border-dashed">
                <BarChart2 size={48} className="text-gray-300 mb-16" />
                <p className="text-gray-400 font-bold m-0">No Generation Data Available</p>
              </div>
            )}
          </div>

          <div className="energy-card">
            <h2 className="text-lg font-bold text-gray-800 mb-16">Energy Mix Distribution</h2>
            {energyMix.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={energyMix}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {energyMix.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex-center flex-col h-300 w-full bg-gray-50 br-12 border-dashed">
                <PieChartIcon size={48} className="text-gray-300 mb-16" />
                <p className="text-gray-400 font-bold m-0">No Distribution Data</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Optimization Info */}
        <div className="ai-optimization-banner">
          <div className="flex-start gap-24">
            <Zap size={40} className="floating-icon flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold mb-16 m-0">AI-Powered Energy Optimization</h2>
              <div className="ai-knowledge-grid">
                <div className="ai-knowledge-item">
                  <h3 className="font-bold mb-8 m-0 text-lg">🤖 Smart Load Balancing</h3>
                  <p className="text-sm opacity-0-9 m-0 lh-1-6">AI algorithms dynamically distribute power based on weather, demand, and efficiency.</p>
                </div>
                <div className="ai-knowledge-item">
                  <h3 className="font-bold mb-8 m-0 text-lg">📊 Predictive Maintenance</h3>
                  <p className="text-sm opacity-0-9 m-0 lh-1-6">ML models predict failures, reducing downtime by 40%.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {showNotifications && (
        <div className="notification-panel">
          <div className="flex-between mb-16">
            <h3 className="font-bold text-lg text-gray-800 m-0">Notifications</h3>
            <button onClick={() => setShowNotifications(false)} className="p-4 border-none cursor-pointer bg-transparent">
              <X size={18} className="text-gray-500" />
            </button>
          </div>
          {notifications.map(notif => (
            <div key={notif.id} className={`p-12 br-8 mb-8 ${notif.type === 'success' ? 'bg-green-100' : 'bg-blue-100'}`}>
              <p className="text-sm font-bold text-gray-800 mb-4 m-0">{notif.message}</p>
              <p className="text-xs text-gray-500 m-0">{notif.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
