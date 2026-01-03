import React, { useState, useEffect, useRef } from 'react';
import {
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  Shield,
  RefreshCw,
  LogOut,
  TrendingUp,
  Thermometer,
  User,
  Phone,
  Navigation
} from 'lucide-react';
import './SupplyChain.css';

// Simple Token Manager
const TokenManager = {
  getToken: () => localStorage.getItem('authToken'),
  setToken: (token) => localStorage.setItem('authToken', token),
  removeToken: () => localStorage.removeItem('authToken'),
  isAuthenticated: () => !!localStorage.getItem('authToken')
};

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to updating map center
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

// Custom Truck Icon
const truckIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2554/2554978.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
  className: 'truck-marker-icon'
});

const SupplyChain = () => {
  const [activeTab, setActiveTab] = useState('tracking');
  const [isAuthenticated, setIsAuthenticated] = useState(TokenManager.isAuthenticated());
  const [isLoading, setIsLoading] = useState(false);
  const [shipments, setShipments] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);

  // Poll for live data
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); // 3-second live refresh
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/agriculture/supply-chain');
      if (response.ok) {
        const data = await response.json();
        setShipments(data.shipments);

        // Update selected shipment live if it exists
        if (selectedShipment) {
          const updated = data.shipments.find(s => s.id === selectedShipment.id);
          if (updated) setSelectedShipment(updated);
        } else if (data.shipments.length > 0) {
          // setSelectedShipment(data.shipments[0]); // Optional auto-select
        }
      }
    } catch (error) {
      console.error('Error fetching supply chain data:', error);
    }
  };


  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    product: '', quantity: '', from: '', to: '',
    driverName: '', driverPhone: '', vehicle: ''
  });

  // ... (keep fetchData and existing useEffects)

  const handleCreateShipment = async (e) => {
    e.preventDefault();
    try {
      // Hardcoded lat/lng for demo simplicity (Darbhanga -> Patna)
      // In a real app, you'd geocode this
      const demoCoords = {
        from: { lat: 26.1542, lng: 85.8918 + (Math.random() * 0.1) },
        to: { lat: 25.5941, lng: 85.1376 + (Math.random() * 0.1) }
      };

      const payload = {
        product: formData.product,
        quantity: formData.quantity,
        from: formData.from,
        to: formData.to,
        driver: {
          name: formData.driverName,
          phone: formData.driverPhone,
          vehicle: formData.vehicle
        },
        fromCoords: demoCoords.from,
        toCoords: demoCoords.to
      };

      const response = await fetch('/api/agriculture/shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowModal(false);
        fetchData(); // Refresh list immediately
        setFormData({ product: '', quantity: '', from: '', to: '', driverName: '', driverPhone: '', vehicle: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    TokenManager.removeToken();
    setIsAuthenticated(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-transit': return { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' };
      case 'delivered': return { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' };
      case 'scheduled': return { bg: '#FFFBEB', text: '#D97706', border: '#FED7AA' };
      default: return { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' };
    }
  };

  return (
    <div className="sc-container-full">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>Create New Shipment</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateShipment} className="shipment-form">
              <div className="form-grid">
                <label>Product Name
                  <input required type="text" placeholder="e.g. Potatoes"
                    value={formData.product} onChange={e => setFormData({ ...formData, product: e.target.value })} />
                </label>
                <label>Quantity
                  <input required type="text" placeholder="e.g. 500 kg"
                    value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                </label>
                <label>Origin (From)
                  <input required type="text" placeholder="Start Location"
                    value={formData.from} onChange={e => setFormData({ ...formData, from: e.target.value })} />
                </label>
                <label>Destination (To)
                  <input required type="text" placeholder="End Location"
                    value={formData.to} onChange={e => setFormData({ ...formData, to: e.target.value })} />
                </label>
              </div>

              <div className="driver-section" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#64748b' }}>Driver & Vehicle Details</h4>
                <div className="form-grid">
                  <label>Driver Name
                    <input required type="text" placeholder="Full Name"
                      value={formData.driverName} onChange={e => setFormData({ ...formData, driverName: e.target.value })} />
                  </label>
                  <label>Phone Number
                    <input required type="text" placeholder="+91 XXXXX XXXXX"
                      value={formData.driverPhone} onChange={e => setFormData({ ...formData, driverPhone: e.target.value })} />
                  </label>
                  <label style={{ gridColumn: 'span 2' }}>Vehicle Number
                    <input required type="text" placeholder="e.g. BR-01-AB-1234"
                      value={formData.vehicle} onChange={e => setFormData({ ...formData, vehicle: e.target.value })} />
                  </label>
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: '2rem' }}>
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="confirm-btn">Start Live Tracking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="sc-wrapper">
        <header className="sc-header-card glass-panel">
          <div className="sc-header-flex">
            <div className="sc-title-group">
              <div className="icon-box-lg">
                <Truck size={32} color="white" />
              </div>
              <div>
                <h1>Logistics COMMAND CENTER</h1>
                <p className="subtitle">Real-time Fleet Tracking & Cold Chain Monitoring</p>
              </div>
            </div>
            <div className="sc-header-actions">
              <div className="status-indicator live">
                <span className="dot"></span> Live Tracking
              </div>
              {isAuthenticated && (
                <button onClick={handleLogout} className="btn-icon-danger">
                  <LogOut size={20} />
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="sc-main-layout">
          {/* Left Panel: Shipment List */}
          <div className="sc-list-panel glass-panel">
            <div className="panel-header">
              <h2>Active Shipments</h2>
              <span className="badge-count">{shipments.length}</span>
            </div>
            <div className="shipment-list">
              {shipments.map(shipment => {
                const styles = getStatusColor(shipment.status);
                const isSelected = selectedShipment?.id === shipment.id;
                return (
                  <div
                    key={shipment.id}
                    className={`shipment-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedShipment(shipment)}
                  >
                    <div className="shipment-item-header">
                      <span className="item-id">{shipment.id}</span>
                      <span className="item-status" style={{ background: styles.bg, color: styles.text }}>{shipment.status}</span>
                    </div>
                    <div className="item-main-info">
                      <h3>{shipment.product}</h3>
                      <span>{shipment.quantity}</span>
                    </div>
                    <div className="item-route">
                      <small>{shipment.from}</small>
                      <span className="arrow">➝</span>
                      <small>{shipment.to}</small>
                    </div>
                    {shipment.status === 'in-transit' && (
                      <div className="mini-progress">
                        <div className="bar" style={{ width: `${shipment.progress}%` }}></div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div style={{ padding: '1rem', borderTop: '1px solid #f1f5f9' }}>
              <button
                className="sc-btn sc-btn-primary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onClick={() => setShowModal(true)}
              >
                <Package size={18} /> Create New Shipment
              </button>
            </div>
          </div>

          {/* Right Panel: Map & Details */}
          <div className="sc-detail-panel">
            {selectedShipment ? (
              <>
                <div className="map-visualization glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
                  {selectedShipment.coordinates && (
                    <MapContainer
                      center={[selectedShipment.coordinates.lat, selectedShipment.coordinates.lng]}
                      zoom={10}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <ChangeView center={[selectedShipment.coordinates.lat, selectedShipment.coordinates.lng]} zoom={10} />
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker
                        position={[selectedShipment.coordinates.lat, selectedShipment.coordinates.lng]}
                        icon={truckIcon}
                      >
                        <Popup>
                          <div style={{ textAlign: 'center' }}>
                            <strong>{selectedShipment.product}</strong><br />
                            {selectedShipment.driver?.vehicle}<br />
                            Speed: 45 km/h
                          </div>
                        </Popup>
                      </Marker>

                      {selectedShipment.fromCoords && selectedShipment.toCoords && (
                        <>
                          {/* Traveled Path (Solid) */}
                          <Polyline
                            positions={[
                              [selectedShipment.fromCoords.lat, selectedShipment.fromCoords.lng],
                              [selectedShipment.coordinates.lat, selectedShipment.coordinates.lng]
                            ]}
                            pathOptions={{ color: '#10b981', weight: 4 }}
                          />
                          {/* Remaining Path (Dashed) */}
                          <Polyline
                            positions={[
                              [selectedShipment.coordinates.lat, selectedShipment.coordinates.lng],
                              [selectedShipment.toCoords.lat, selectedShipment.toCoords.lng]
                            ]}
                            pathOptions={{ color: '#6366f1', weight: 4, dashArray: '10, 10', opacity: 0.6 }}
                          />
                          {/* Start Marker */}
                          <Marker position={[selectedShipment.fromCoords.lat, selectedShipment.fromCoords.lng]}>
                            <Popup>Start: {selectedShipment.from}</Popup>
                          </Marker>
                          {/* End Marker */}
                          <Marker position={[selectedShipment.toCoords.lat, selectedShipment.toCoords.lng]}>
                            <Popup>Data: {selectedShipment.to}</Popup>
                          </Marker>
                        </>
                      )}
                    </MapContainer>
                  )}

                  <div className="map-overlay-info" style={{ pointerEvents: 'none' }}>
                    <div className="map-status-pill">
                      <Navigation size={14} />
                      {selectedShipment.status === 'in-transit' ? 'Live GPS Signal' : 'Last Known Location'}
                    </div>
                  </div>
                </div>

                <div className="metrics-grid">
                  <div className="metric-card glass-panel">
                    <div className="metric-icon"><Clock size={20} color="#6366f1" /></div>
                    <div className="metric-content">
                      <label>Estimated Arrival</label>
                      <div className="value">{selectedShipment.estimatedArrival}</div>
                    </div>
                  </div>
                  <div className="metric-card glass-panel">
                    <div className="metric-icon"><Thermometer size={20} color="#ef4444" /></div>
                    <div className="metric-content">
                      <label>Cargo Temp</label>
                      <div className="value">{selectedShipment.temperature || '--'}</div>
                    </div>
                  </div>
                  <div className="metric-card glass-panel">
                    <div className="metric-icon"><User size={20} color="#10b981" /></div>
                    <div className="metric-content">
                      <label>Driver</label>
                      <div className="value">{selectedShipment.driver?.name || 'Assigned'}</div>
                      <small>{selectedShipment.driver?.phone}</small>
                    </div>
                  </div>
                  <div className="metric-card glass-panel">
                    <div className="metric-icon"><Truck size={20} color="#f59e0b" /></div>
                    <div className="metric-content">
                      <label>Vehicle No.</label>
                      <div className="value">{selectedShipment.driver?.vehicle || '--'}</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state glass-panel">
                <Package size={64} color="#cbd5e1" />
                <h3>Select a shipment to track</h3>
                <p>Real-time telemetry and route details will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyChain;