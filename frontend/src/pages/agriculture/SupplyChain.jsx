import React, { useState, useEffect } from 'react';
import {
  Truck,
  Package,
  MapPin,
  Clock,
  Thermometer,
  User,
  LogOut,
  Navigation,
  Send,
  X
} from 'lucide-react';
import './SupplyChain.css';

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const truckIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2554/2554978.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
  className: 'truck-marker-icon'
});

const SupplyChain = () => {
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    product: '', quantity: '', from: '', to: '',
    driverName: '', driverPhone: '', vehicle: ''
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/agriculture/supply-chain');
      if (response.ok) {
        const data = await response.json();
        setShipments(data.shipments);
        if (selectedShipment) {
          const updated = data.shipments.find(s => s.id === selectedShipment.id);
          if (updated) setSelectedShipment(updated);
        }
      }
    } catch (error) {
      // If the backend is down, shipments will remain empty or retain their last successful state.
      // No explicit action needed here to set to empty, as the instruction implies removing
      // "catch-block simulations" and ensuring it stays empty if backend is down (which it will
      // if no successful fetch occurs).
      console.error('Failed to fetch supply chain data:', error);
    }
  };

  const handleCreateShipment = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        product: formData.product,
        quantity: formData.quantity,
        from: formData.from,
        to: formData.to,
        driver: {
          name: formData.driverName,
          phone: formData.driverPhone,
          vehicle: formData.vehicle
        }
      };

      const response = await fetch('/api/agriculture/shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowModal(false);
        fetchData();
        setFormData({ product: '', quantity: '', from: '', to: '', driverName: '', driverPhone: '', vehicle: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-transit': return { bg: '#EFF6FF', text: '#2563EB' };
      case 'delivered': return { bg: '#F0FDF4', text: '#16A34A' };
      case 'scheduled': return { bg: '#FFFBEB', text: '#D97706' };
      default: return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  return (
    <div className="sc-container-full">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3>Create New Shipment</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateShipment} className="shipment-form">
              <div className="form-grid">
                <label className="form-label">
                  Product Name
                  <input required type="text" placeholder="e.g. Potatoes"
                    value={formData.product} onChange={e => setFormData({ ...formData, product: e.target.value })} />
                </label>
                <label className="form-label">
                  Quantity
                  <input required type="text" placeholder="e.g. 500 kg"
                    value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                </label>
                <label className="form-label">
                  Origin (From)
                  <input required type="text" placeholder="Start Location"
                    value={formData.from} onChange={e => setFormData({ ...formData, from: e.target.value })} />
                </label>
                <label className="form-label">
                  Destination (To)
                  <input required type="text" placeholder="End Location"
                    value={formData.to} onChange={e => setFormData({ ...formData, to: e.target.value })} />
                </label>
              </div>

              <div className="driver-section" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                <h4>Driver & Vehicle Details</h4>
                <div className="form-grid">
                  <label className="form-label">
                    Driver Name
                    <input required type="text" placeholder="Full Name"
                      value={formData.driverName} onChange={e => setFormData({ ...formData, driverName: e.target.value })} />
                  </label>
                  <label className="form-label">
                    Phone Number
                    <input required type="text" placeholder="+91 XXXXX XXXXX"
                      value={formData.driverPhone} onChange={e => setFormData({ ...formData, driverPhone: e.target.value })} />
                  </label>
                  <label className="form-label" style={{ gridColumn: 'span 2' }}>
                    Vehicle Number
                    <input required type="text" placeholder="e.g. BR-01-AB-1234"
                      value={formData.vehicle} onChange={e => setFormData({ ...formData, vehicle: e.target.value })} />
                  </label>
                </div>
              </div>

              <div className="modal-actions">
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
                <h1>Logistics COMMAND</h1>
                <p className="subtitle">Real-time Fleet Tracking & Intelligence</p>
              </div>
            </div>
            <div className="status-indicator">
              <span className="dot"></span> LIVE NETWORK ACTIVE
            </div>
          </div>
        </header>

        <div className="sc-main-layout">
          <div className="sc-list-panel glass-panel">
            <div className="panel-header">
              <h2>Active Fleet</h2>
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
                      <MapPin size={14} />
                      <small>{shipment.from}</small>
                      <span className="arrow">➝</span>
                      <small>{shipment.to}</small>
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ padding: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
              <button className="confirm-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onClick={() => setShowModal(true)}>
                <Package size={20} /> New Shipment
              </button>
            </div>
          </div>

          <div className="sc-detail-panel">
            {selectedShipment ? (
              <>
                <div className="map-visualization glass-panel" style={{ height: '450px', position: 'relative' }}>
                  <MapContainer
                    center={[selectedShipment.coordinates?.lat || 25.5941, selectedShipment.coordinates?.lng || 85.1376]}
                    zoom={10}
                    style={{ height: '100%', width: '100%' }}
                  >
                    {selectedShipment.coordinates && <ChangeView center={[selectedShipment.coordinates.lat, selectedShipment.coordinates.lng]} zoom={10} />}
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {selectedShipment.coordinates && (
                      <Marker position={[selectedShipment.coordinates.lat, selectedShipment.coordinates.lng]} icon={truckIcon}>
                        <Popup>{selectedShipment.product} - {selectedShipment.driver?.vehicle}</Popup>
                      </Marker>
                    )}
                  </MapContainer>
                </div>

                <div className="metrics-grid">
                  <div className="metric-card glass-panel">
                    <div className="metric-icon"><Clock size={20} color="#6366f1" /></div>
                    <div className="metric-content">
                      <label>ETA</label>
                      <div className="value">{selectedShipment.estimatedArrival || 'Calculating...'}</div>
                    </div>
                  </div>
                  <div className="metric-card glass-panel">
                    <div className="metric-icon"><Thermometer size={20} color="#ef4444" /></div>
                    <div className="metric-content">
                      <label>Cargo Temp</label>
                      <div className="value">{selectedShipment.temperature || 'Stable'}</div>
                    </div>
                  </div>
                  <div className="metric-card glass-panel">
                    <div className="metric-icon"><User size={20} color="#10b981" /></div>
                    <div className="metric-content">
                      <label>Driver</label>
                      <div className="value">{selectedShipment.driver?.name}</div>
                      <small>{selectedShipment.driver?.phone}</small>
                    </div>
                  </div>
                  <div className="metric-card glass-panel">
                    <div className="metric-icon"><Truck size={20} color="#f59e0b" /></div>
                    <div className="metric-content">
                      <label>Plate No.</label>
                      <div className="value">{selectedShipment.driver?.vehicle}</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state glass-panel" style={{ height: '100%' }}>
                <Package size={64} color="#cbd5e1" />
                <h3>Logistics Hub Ready</h3>
                <p>Select a vehicle from the fleet to view live telemetry.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyChain;