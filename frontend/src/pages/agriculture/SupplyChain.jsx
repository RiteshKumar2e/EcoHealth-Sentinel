import React, { useState, useEffect } from 'react';
import { Truck, Package, MapPin, Clock, CheckCircle, Shield, RefreshCw, LogOut, TrendingUp } from 'lucide-react';
import './SupplyChain.css';

// API Configuration
const API_BASE_URL = 'https://api.yourbackend.com';

// JWT Token Management
const TokenManager = {
  getToken: () => localStorage.getItem('authToken'),
  setToken: (token) => localStorage.setItem('authToken', token),
  removeToken: () => localStorage.removeItem('authToken'),
  isAuthenticated: () => !!localStorage.getItem('authToken')
};

// API Service with JWT (Placeholder)
// eslint-disable-next-line no-unused-vars
const apiService = {
  async fetchWithAuth(endpoint, options = {}) {
    const token = TokenManager.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      if (response.status === 401) {
        TokenManager.removeToken();
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (data.token) TokenManager.setToken(data.token);
    return data;
  },

  async getShipments() {
    return this.fetchWithAuth('/shipments');
  },

  async getBuyers() {
    return this.fetchWithAuth('/buyers');
  },

  async createShipment(shipmentData) {
    return this.fetchWithAuth('/shipments', {
      method: 'POST',
      body: JSON.stringify(shipmentData)
    });
  }
};

const SupplyChain = () => {
  const [activeTab, setActiveTab] = useState('tracking');
  const [isAuthenticated, setIsAuthenticated] = useState(TokenManager.isAuthenticated());
  const [isLoading, setIsLoading] = useState(false);
  const [shipments, setShipments] = useState([]);
  const [buyers, setBuyers] = useState([]);

  const mockShipments = [
    {
      id: 'SH001',
      product: 'Tomatoes',
      quantity: '500 kg',
      from: 'Farm - Darbhanga',
      to: 'Mandi - Patna',
      status: 'in-transit',
      progress: 65,
      estimatedArrival: '2 hours',
      currentLocation: 'Near Muzaffarpur',
      temperature: '8°C',
      quality: 'Good'
    },
    {
      id: 'SH002',
      product: 'Wheat',
      quantity: '1000 kg',
      from: 'Farm - Darbhanga',
      to: 'Warehouse - Delhi',
      status: 'delivered',
      progress: 100,
      estimatedArrival: 'Delivered',
      currentLocation: 'Delhi Warehouse',
      temperature: 'N/A',
      quality: 'Excellent'
    },
    {
      id: 'SH003',
      product: 'Rice',
      quantity: '750 kg',
      from: 'Farm - Darbhanga',
      to: 'Processing Unit - Bihar',
      status: 'scheduled',
      progress: 0,
      estimatedArrival: 'Tomorrow 9 AM',
      currentLocation: 'Farm',
      temperature: 'N/A',
      quality: 'Good'
    }
  ];

  const mockBuyers = [
    {
      id: 1,
      name: 'Patna Agri Traders',
      rating: 4.5,
      orders: 23,
      payment: 'Immediate',
      verified: true
    },
    {
      id: 2,
      name: 'Bihar Food Corp',
      rating: 4.8,
      orders: 45,
      payment: 'Within 7 days',
      verified: true
    },
    {
      id: 3,
      name: 'Delhi Wholesale Market',
      rating: 4.2,
      orders: 12,
      payment: 'Within 15 days',
      verified: false
    }
  ];

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setShipments(mockShipments);
      setBuyers(mockBuyers);
      setIsLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    TokenManager.removeToken();
    setIsAuthenticated(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-transit': return { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' };
      case 'delivered': return { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' };
      case 'scheduled': return { bg: '#FFFBEB', text: '#B45309', border: '#FED7AA' };
      case 'delayed': return { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' };
      default: return { bg: '#F9FAFB', text: '#374151', border: '#E5E7EB' };
    }
  };

  return (
    <div className="sc-container-full">
      <div className="sc-wrapper">
        {/* Header */}
        <div className="sc-card">
          <div className="sc-header-flex">
            <div className="sc-header-title-box">
              <div className="sc-header-icon">
                <Truck style={{ width: '32px', height: '32px', color: 'white' }} />
              </div>
              <div>
                <h1 className="sc-title">Supply Chain Management</h1>
                <p className="sc-subtitle">
                  Track deliveries & connect with verified buyers
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="sc-secured-badge">
                <Shield style={{ width: '18px', height: '18px', color: '#059669' }} />
                <span className="sc-secured-text">Secured</span>
              </div>
              <button
                onClick={loadData}
                className="sc-icon-btn"
              >
                <RefreshCw className={isLoading ? 'sc-spin' : ''} style={{ width: '20px', height: '20px' }} />
              </button>
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="sc-icon-btn sc-icon-btn-danger"
                >
                  <LogOut style={{ width: '20px', height: '20px' }} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="sc-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '2px solid #F3F4F6' }}>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`sc-tab-btn ${activeTab === 'tracking' ? 'sc-tab-btn-active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Package style={{ width: '18px', height: '18px' }} />
                Shipment Tracking
              </div>
            </button>
            <button
              onClick={() => setActiveTab('buyers')}
              className={`sc-tab-btn ${activeTab === 'buyers' ? 'sc-tab-btn-active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <CheckCircle style={{ width: '18px', height: '18px' }} />
                Verified Buyers
              </div>
            </button>
          </div>

          {/* Tracking Tab */}
          {activeTab === 'tracking' && (
            <div className="sc-tab-content">
              {isLoading ? (
                <div className="sc-loader-box">
                  <RefreshCw className="sc-spin" style={{ width: '32px', height: '32px', color: '#7C3AED' }} />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {shipments.map((shipment) => {
                    const statusStyle = getStatusColor(shipment.status);
                    return (
                      <div
                        key={shipment.id}
                        className="sc-card sc-card-bordered"
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                              width: '56px',
                              height: '56px',
                              background: '#F3F4F6',
                              borderRadius: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Package style={{ width: '28px', height: '28px', color: '#7C3AED' }} />
                            </div>
                            <div>
                              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '4px', margin: 0 }}>
                                {shipment.product}
                              </h3>
                              <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>ID: {shipment.id}</p>
                            </div>
                          </div>
                          <span className="sc-status-badge" style={{
                            background: statusStyle.bg,
                            color: statusStyle.text,
                            border: `1px solid ${statusStyle.border}`
                          }}>
                            {shipment.status.replace('-', ' ')}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ marginBottom: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <MapPin style={{ width: '16px', height: '16px' }} />
                              {shipment.from}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {shipment.to}
                              <MapPin style={{ width: '16px', height: '16px' }} />
                            </span>
                          </div>
                          <div className="sc-progress-bar">
                            <div className="sc-progress-fill" style={{ width: `${shipment.progress}%` }}>
                              {shipment.progress > 0 && shipment.progress < 100 && (
                                <div className="sc-truck-icon">
                                  <Truck style={{ width: '24px', height: '24px', color: '#7C3AED' }} />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="sc-grid-4" style={{ marginBottom: '16px' }}>
                          <div className="sc-detail-box">
                            <div className="sc-detail-label">
                              <Package style={{ width: '16px', height: '16px', color: '#6B7280' }} />
                              <span className="sc-detail-label-text">Quantity</span>
                            </div>
                            <div className="sc-detail-value">{shipment.quantity}</div>
                          </div>
                          <div className="sc-detail-box">
                            <div className="sc-detail-label">
                              <MapPin style={{ width: '16px', height: '16px', color: '#6B7280' }} />
                              <span className="sc-detail-label-text">Location</span>
                            </div>
                            <div className="sc-detail-value">{shipment.currentLocation}</div>
                          </div>
                          <div className="sc-detail-box">
                            <div className="sc-detail-label">
                              <Clock style={{ width: '16px', height: '16px', color: '#6B7280' }} />
                              <span className="sc-detail-label-text">ETA</span>
                            </div>
                            <div className="sc-detail-value">{shipment.estimatedArrival}</div>
                          </div>
                          <div className="sc-detail-box">
                            <div className="sc-detail-label">
                              <CheckCircle style={{ width: '16px', height: '16px', color: '#6B7280' }} />
                              <span className="sc-detail-label-text">Quality</span>
                            </div>
                            <div className="sc-detail-value">{shipment.quality}</div>
                          </div>
                        </div>

                        {/* Temperature */}
                        {shipment.temperature !== 'N/A' && (
                          <div className="sc-iot-box">
                            <Shield style={{ width: '18px', height: '18px', color: '#1E40AF' }} />
                            <span className="sc-iot-text">
                              IoT Temperature: {shipment.temperature} - Optimal Range
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                className="sc-btn sc-btn-secondary sc-create-btn"
              >
                + Create New Shipment
              </button>
            </div>
          )}

          {/* Buyers Tab */}
          {activeTab === 'buyers' && (
            <div className="sc-tab-content">
              <div className="sc-grid-2">
                {buyers.map((buyer) => (
                  <div
                    key={buyer.id}
                    className="sc-card sc-card-bordered"
                  >
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>{buyer.name}</h3>
                        {buyer.verified && (
                          <CheckCircle style={{ width: '20px', height: '20px', color: '#10B981' }} />
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '18px' }}>⭐</span>
                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>{buyer.rating}</span>
                        <span style={{ color: '#6B7280', fontSize: '14px' }}>({buyer.orders} orders)</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                      <div style={{
                        padding: '12px',
                        background: '#F9FAFB',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        border: '1px solid #E5E7EB'
                      }}>
                        <span style={{ color: '#6B7280', fontWeight: '500', fontSize: '14px' }}>Payment Terms</span>
                        <span style={{ fontWeight: '700', color: '#111827', fontSize: '14px' }}>{buyer.payment}</span>
                      </div>
                      <div style={{
                        padding: '12px',
                        background: buyer.verified ? '#D1FAE5' : '#F3F4F6',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: `1px solid ${buyer.verified ? '#A7F3D0' : '#E5E7EB'}`
                      }}>
                        <span style={{ color: buyer.verified ? '#059669' : '#6B7280', fontWeight: '500', fontSize: '14px' }}>Status</span>
                        <span style={{ fontWeight: '700', color: buyer.verified ? '#059669' : '#6B7280', fontSize: '14px' }}>
                          {buyer.verified ? '✓ Verified' : 'Unverified'}
                        </span>
                      </div>
                    </div>

                    <div className="sc-grid-2" style={{ gap: '12px' }}>
                      <button className="sc-btn sc-btn-primary">Contact</button>
                      <button className="sc-btn sc-btn-secondary">Profile</button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="sc-btn sc-btn-secondary sc-create-btn"
              >
                + Find More Buyers
              </button>
            </div>
          )}
        </div>

        {/* AI Features */}
        <div className="sc-grid-3" style={{ marginBottom: '24px' }}>
          {[
            { icon: Truck, title: 'Route Optimization', desc: 'AI finds fastest routes, reducing delivery time by 25%', color: '#7C3AED', bg: '#F5F3FF' },
            { icon: Shield, title: 'Blockchain Tracking', desc: 'Every transaction recorded for complete transparency', color: '#2563EB', bg: '#EFF6FF' },
            { icon: CheckCircle, title: 'Quality Monitoring', desc: 'IoT sensors ensure product quality throughout transit', color: '#059669', bg: '#D1FAE5' }
          ].map((feature, idx) => (
            <div key={idx} className="sc-card" style={{ padding: '20px', marginBottom: 0 }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: feature.bg,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <feature.icon style={{ width: '24px', height: '24px', color: feature.color }} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.5' }}>{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Impact Metrics */}
        <div className="sc-card sc-impact-card">
          <h3 className="sc-impact-title">
            <TrendingUp style={{ width: '28px', height: '28px' }} />
            Supply Chain Impact
          </h3>
          <div className="sc-grid-4">
            {[
              { value: '25%', label: 'Faster Delivery' },
              { value: '15%', label: 'Reduced Spoilage' },
              { value: '100%', label: 'Transparency' },
              { value: '98%', label: 'On-Time Delivery' }
            ].map((metric, idx) => (
              <div
                key={idx}
                className="sc-impact-metric"
              >
                <p className="sc-metric-val">{metric.value}</p>
                <p className="sc-metric-lbl">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyChain;