import React, { useState, useMemo } from "react";
import {
  Zap, Activity, ShieldCheck, Search, Plus,
  Settings, Power, Battery, Wifi, MoreVertical,
  Droplets, Thermometer, Leaf, Navigation, Bell,
  ChevronRight, AlertCircle, TrendingUp, Cpu
} from "lucide-react";
import './FarmAutomation.css';

const FarmAutomation = () => {
  // Sentinel State Management
  const [nodes, setNodes] = useState([
    {
      id: 1,
      name: "Soil Sentinel Alpha",
      type: "Eco-Monitor",
      status: "active",
      health: 98,
      moisture: 62,
      battery: 88,
      signal: 5,
      lastAction: "Moisture analysis complete"
    },
    {
      id: 2,
      name: "Irrigation Node 02",
      type: "Automation",
      status: "idle",
      health: 100,
      flowRate: 0,
      battery: 92,
      signal: 4,
      lastAction: "Task scheduled: 06:00 PM"
    }
  ]);

  const [rules, setRules] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [feed, setFeed] = useState([
    { id: 1, text: "Sentinel Command Hub Initialized", time: "Just now", type: "success" }
  ]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "Soil Monitor",
    zone: "North Field"
  });

  const filteredNodes = useMemo(() => {
    return nodes.filter(n => {
      const matchesSearch = n.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === "all" || n.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [nodes, searchQuery, activeFilter]);

  const stats = useMemo(() => ({
    active: nodes.filter(n => n.status === 'active').length,
    ecoSavings: nodes.length > 0 ? (nodes.filter(n => n.status === 'active').length * 12.5).toFixed(1) + "%" : "0%",
    integrity: nodes.length > 0 ? "100%" : "0%"
  }), [nodes]);

  const addToFeed = (text, type = "success") => {
    setFeed(prev => [{ id: Date.now(), text, time: "Just now", type }, ...prev].slice(0, 5));
  };

  const provisionNode = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const id = Date.now();
    const newNode = {
      id,
      name: formData.name,
      type: formData.type,
      zone: formData.zone,
      status: "idle",
      health: 100,
      battery: 100,
      signal: 5,
      lastAction: `Assigned to ${formData.zone}. Initializing...`
    };

    setNodes([...nodes, newNode]);
    addToFeed(`New Sentinel Provisioned: ${formData.name}`);
    setShowModal(false);
    setFormData({ name: "", type: "Soil Monitor", zone: "North Field" });
  };

  const deleteNode = (id) => {
    const node = nodes.find(n => n.id === id);
    setNodes(nodes.filter(n => n.id !== id));
    addToFeed(`Sentinel Removed: ${node.name}`, "warning");
  };

  const addLogicRule = () => {
    const newRule = {
      id: Date.now(),
      condition: "Moisture < 45%",
      action: "Trigger Bio-Hydration"
    };
    setRules([...rules, newRule]);
    addToFeed("Autonomous Intelligence Rule Configured");
  };

  const toggleNode = (id) => {
    setNodes(nodes.map(n => {
      if (n.id === id) {
        if (n.status === 'idle') {
          addToFeed(`Initializing scanning for ${n.name}...`);
          return { ...n, status: 'scanning', lastAction: "Scanning environmental perimeter..." };
        }
        addToFeed(`${n.name} deactivated.`);
        return { ...n, status: 'idle', lastAction: "Sentinel enters standby mode" };
      }
      return n;
    }));

    setTimeout(() => {
      setNodes(prev => prev.map(n => {
        if (n.id === id && n.status === 'scanning') {
          addToFeed(`${n.name} Shield Activated!`);
          return { ...n, status: 'active', lastAction: "Autonomous protection active" };
        }
        return n;
      }));
    }, 1500);
  };

  return (
    <div className="sentinel-hub-root">
      {/* 1. LEFT NAVIGATION: BRAND & CORE METRICS */}
      <aside className="sentinel-sidebar-left">
        <div className="sentinel-brand">
          <div className="brand-hex-icon">
            <ShieldCheck size={28} fill="white" strokeWidth={2.5} />
          </div>
          <div className="brand-labels">
            <h1>EcoHealth</h1>
            <span>SENTINEL COMMAND</span>
          </div>
        </div>

        <div className="sentinel-metrics-vertical">
          <div className="metric-pill eco">
            <div className="pill-icon"><Leaf size={18} /></div>
            <div className="pill-data">
              <span className="p-label">ECO SAVINGS</span>
              <h3>{stats.ecoSavings}</h3>
              <span className="p-growth">Efficiency Optimized</span>
            </div>
          </div>

          <div className="metric-pill active">
            <div className="pill-icon"><Activity size={18} /></div>
            <div className="pill-data">
              <span className="p-label">ACTIVE SENTINELS</span>
              <h3>{stats.active} <small>/ {nodes.length}</small></h3>
              <span className="p-growth">Global coverage: {nodes.length > 0 ? 'Optimal' : 'None'}</span>
            </div>
          </div>

          <div className="metric-pill system">
            <div className="pill-icon"><Cpu size={18} /></div>
            <div className="pill-data">
              <span className="p-label">AI INTEGRITY</span>
              <h3>{stats.integrity}</h3>
              <span className="p-growth">Neural-Link: Stable</span>
            </div>
          </div>
        </div>

        <div className="sidebar-footer-info">
          <div className="uptime-status">
            <div className="dot pulse-green"></div>
            Online Protection: 24/7
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE: SENTINEL NODES */}
      <main className="sentinel-main-frame">
        <header className="main-frame-header">
          <div className="header-search-group">
            <div className="sentinel-search">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Locate Sentinel Nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <nav className="filter-nav">
              <button
                className={activeFilter === 'all' ? 'active' : ''}
                onClick={() => setActiveFilter('all')}
              >All Infrastructure</button>
              <button
                className={activeFilter === 'active' ? 'active' : ''}
                onClick={() => setActiveFilter('active')}
              >Shield Active</button>
            </nav>
          </div>

          <button className="btn-provision-prime" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            <span>Provision New Sentinel</span>
          </button>
        </header>

        <section className="node-canvas-grid">
          {filteredNodes.length === 0 ? (
            <div className="empty-sentinel-state">
              <div className="sentinel-hollow-logo">
                <ShieldCheck size={48} color="#e2e8f0" />
              </div>
              <h3>No Sentinels Provisioned</h3>
              <p>Initialize your first Sentinel Node to begin autonomous ecological protection.</p>
              <button className="btn-add-sentinel-empty" onClick={() => setShowModal(true)}>
                <Plus size={18} /> Provision Your First Sentinel
              </button>
            </div>
          ) : (
            <div className="sentinel-cards-layout">
              {filteredNodes.map(node => (
                <div key={node.id} className={`sentinel-card-v2 ${node.status}`}>
                  <div className="card-top-info">
                    <div className="node-identity">
                      <div className={`status-orb ${node.status}`}></div>
                      <div>
                        <h4>{node.name}</h4>
                        <span className="node-type-tag">{node.type}</span>
                      </div>
                    </div>
                    <button className="card-menu-btn" onClick={() => deleteNode(node.id)}>
                      <AlertCircle size={16} color="#ef4444" />
                    </button>
                  </div>

                  <div className="card-metrics-preview">
                    <div className="mini-metric">
                      <Battery size={14} />
                      <span>{node.battery}%</span>
                    </div>
                    <div className="mini-metric">
                      <Wifi size={14} />
                      <span>{node.signal}/5</span>
                    </div>
                    {node.moisture && (
                      <div className="mini-metric highlight">
                        <Droplets size={14} />
                        <span>{node.moisture}% Moisture</span>
                      </div>
                    )}
                  </div>

                  <div className="card-action-box">
                    <div className="last-action-text">
                      <Navigation size={12} />
                      {node.lastAction}
                    </div>
                    <button
                      className={`btn-node-trigger ${node.status === 'active' ? 'off' : 'on'}`}
                      disabled={node.status === 'scanning'}
                      onClick={() => toggleNode(node.id)}
                    >
                      <Power size={14} />
                      {node.status === 'scanning' ? 'Calibrating Sensors...' :
                        node.status === 'active' ? 'Deactivate Shield' : 'Activate Shield'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* 3. RIGHT SIDEBAR: INTELLIGENCE & LOGS */}
      <aside className="sentinel-sidebar-right">
        <section className="intelligence-panel">
          <div className="section-title-box">
            <TrendingUp size={20} className="title-icon" />
            <h3>Autonomous Logic</h3>
          </div>

          <div className="logic-card-sentinel">
            {rules.length === 0 ? (
              <div className="logic-empty-prompt">
                <Settings size={32} className="spin-icon-slow" />
                <h4>Zero Intelligence Rules</h4>
                <p>Automate your farm with eco-conscious triggers based on real-time climate data.</p>
                <button className="btn-add-logic" onClick={addLogicRule}>+ Configure Logic</button>
              </div>
            ) : (
              <div className="rules-list-v2">
                {rules.map(rule => (
                  <div key={rule.id} className="rule-item-v2">
                    <p><strong>IF:</strong> {rule.condition}</p>
                    <p><strong>THEN:</strong> {rule.action}</p>
                  </div>
                ))}
                <button className="btn-add-logic-small" onClick={addLogicRule}>+ Add Rule</button>
              </div>
            )}
          </div>
        </section>

        <section className="sentinel-log-panel">
          <div className="section-title-box">
            <Activity size={20} className="title-icon" />
            <h3>Sentinel Feed</h3>
          </div>

          <div className="feed-card-white">
            <div className="feed-scroll-box">
              {feed.map(item => (
                <div key={item.id} className={`feed-item ${item.type}`}>
                  <div className={`feed-marker ${item.type}`}></div>
                  <div className="feed-content">
                    <p>{item.text}</p>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="feed-placeholder">
              <ShieldCheck size={16} />
              Environmental Shield Status: Healthy
            </div>
          </div>
        </section>
      </aside>
      {/* 4. PROVISION MODAL */}
      {showModal && (
        <div className="sentinel-modal-overlay">
          <div className="sentinel-modal">
            <header className="modal-header">
              <h2>Provision New Sentinel</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </header>
            <form onSubmit={provisionNode}>
              <div className="input-group">
                <label>Sentinel Identity Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alpha Drone 01"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Service Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option>Soil Monitor</option>
                    <option>Drone Scouter</option>
                    <option>Irrigation Hub</option>
                    <option>Climate Sensor</option>
                    <option>Bio-Shield Generator</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Assigned Zone</label>
                  <select
                    value={formData.zone}
                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  >
                    <option>North Field</option>
                    <option>West Orchard</option>
                    <option>Greenhouse A-1</option>
                    <option>Hydroponic Bay</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Discard</button>
                <button type="submit" className="btn-confirm">Initialize Sentinel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmAutomation;