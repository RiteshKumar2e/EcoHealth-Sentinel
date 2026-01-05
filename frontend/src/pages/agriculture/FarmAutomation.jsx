import React, { useState, useMemo } from "react";
import {
  Zap, Activity, ShieldCheck, Search, Plus,
  Settings, Power, Battery, Wifi, MoreVertical,
  Droplets, Thermometer, Leaf, Navigation, Bell,
  ChevronRight, AlertCircle, TrendingUp, Cpu, Settings2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import './FarmAutomation.css';

const FarmAutomation = () => {
  // Sentinel State Management
  const [nodes, setNodes] = useState([]);



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
      {/* 1. LEFT NAVIGATION REMOVED - Metrics moved to Header */}
      {/* 2. MAIN WORKSPACE: SENTINEL NODES */}
      <main className="sentinel-main-frame">
        <header className="main-frame-header">
          <div className="sentinel-metrics-horizontal">
            <motion.div className="metric-pill-horizontal eco" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="pill-icon"><Leaf size={16} /></div>
              <div className="pill-data-row">
                <span className="p-label">ECO SAVINGS</span>
                <h3>{stats.ecoSavings}</h3>
              </div>
            </motion.div>

            <motion.div className="metric-pill-horizontal active" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="pill-icon"><Activity size={16} /></div>
              <div className="pill-data-row">
                <span className="p-label">ACTIVE NODES</span>
                <h3>{stats.active}/{nodes.length}</h3>
              </div>
            </motion.div>

            <motion.div className="metric-pill-horizontal system" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="pill-icon"><Cpu size={16} /></div>
              <div className="pill-data-row">
                <span className="p-label">AI INTEGRITY</span>
                <h3>{stats.integrity}</h3>
              </div>
            </motion.div>
          </div>

          <div className="header-actions-right">
            <div className="header-search-group">
              <div className="sentinel-search">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search Nodes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <nav className="filter-nav">
                <button
                  className={activeFilter === 'all' ? 'active' : ''}
                  onClick={() => setActiveFilter('all')}
                >All</button>
                <button
                  className={activeFilter === 'active' ? 'active' : ''}
                  onClick={() => setActiveFilter('active')}
                >Active</button>
              </nav>
            </div>

            <button className="btn-provision-prime" onClick={() => setShowModal(true)}>
              <Plus size={18} />
              <span>New Sentinel</span>
            </button>
          </div>
        </header>

        <section className="node-canvas-grid">
          {filteredNodes.length === 0 ? (
            <motion.div
              className="empty-sentinel-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="sentinel-hollow-logo">
                <ShieldCheck size={48} />
              </div>
              <h3>No Sentinels Provisioned</h3>
              <p>Initialize your first Sentinel Node to begin autonomous ecological protection.</p>
              <button className="btn-add-sentinel-empty" onClick={() => setShowModal(true)}>
                <Plus size={18} /> Provision Your First Sentinel
              </button>
            </motion.div>
          ) : (
            <div className="sentinel-cards-layout">
              <AnimatePresence mode="popLayout">
                {filteredNodes.map(node => (
                  <motion.div
                    key={node.id}
                    className={`sentinel-card-v2 ${node.status}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
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
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>

      {/* 3. RIGHT SIDEBAR: INTELLIGENCE & LOGS */}
      {/* 3. RIGHT SIDEBAR REMOVED */}      {/* 4. PROVISION MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="sentinel-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="sentinel-modal"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FarmAutomation;
