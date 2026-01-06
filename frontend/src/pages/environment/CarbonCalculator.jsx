import React, { useState, useEffect } from 'react';
import { Car, Zap, Home, Plane, ShoppingBag, Calculator, TrendingDown, Download, Save, RefreshCw, Share2, Leaf, History, Info, Award, Target, BarChart3, PieChart as PieChartIcon, ArrowUp, ArrowDown, Check } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import './CarbonCalculator.css';

export default function CarbonCalculator() {
  const [calculations, setCalculations] = useState({
    transportation: { distance: 0, vehicleType: '' },
    electricity: { usage: 0 },
    heating: { usage: 0, type: 'gas' },
    flights: { shortHaul: 0, longHaul: 0 },
    shopping: { amount: 0 }
  });

  const [totalEmissions, setTotalEmissions] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [comparisonMetric, setComparisonMetric] = useState('');
  const [breakdown, setBreakdown] = useState({});
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [savedHistory, setSavedHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showCharts, setShowCharts] = useState(true);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [showTips, setShowTips] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);

  const API_BASE_URL = 'http://localhost:5000/api';

  const emissionFactors = {
    car: 0.21,
    suv: 0.28,
    hybrid: 0.12,
    electric: 0.05,
    motorcycle: 0.103,
    bus: 0.089,
    train: 0.041,
    bicycle: 0,
    electricity: 0.82,
    naturalGas: 0.18,
    shortFlight: 0.255,
    longFlight: 0.195,
    shopping: 0.05
  };

  const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981'];

  useEffect(() => {
    calculateTotalEmissions();
    loadSavedHistory();
  }, [calculations]);

  const calculateTotalEmissions = () => {
    const transportFactor = emissionFactors[calculations.transportation.vehicleType] || 0;
    const transportEmissions = calculations.transportation.distance * transportFactor * 365;

    const electricityEmissions = calculations.electricity.usage *
      emissionFactors.electricity * 12;

    const heatingEmissions = calculations.heating.usage *
      emissionFactors.naturalGas * 12;

    const flightEmissions =
      (calculations.flights.shortHaul * emissionFactors.shortFlight) +
      (calculations.flights.longHaul * emissionFactors.longFlight);

    const shoppingEmissions = calculations.shopping.amount *
      emissionFactors.shopping * 12;

    const total = transportEmissions + electricityEmissions + heatingEmissions +
      flightEmissions + shoppingEmissions;

    const breakdownData = {
      transportation: (transportEmissions / 1000).toFixed(2),
      electricity: (electricityEmissions / 1000).toFixed(2),
      heating: (heatingEmissions / 1000).toFixed(2),
      flights: (flightEmissions / 1000).toFixed(2),
      shopping: (shoppingEmissions / 1000).toFixed(2)
    };

    setBreakdown(breakdownData);
    setTotalEmissions(total / 1000);
    generateRecommendations(total / 1000);
    setComparisonMetric(getComparisonMetric(total / 1000));

    const pieData = [
      { name: 'Transportation', value: parseFloat(breakdownData.transportation), color: COLORS[0] },
      { name: 'Electricity', value: parseFloat(breakdownData.electricity), color: COLORS[1] },
      { name: 'Heating', value: parseFloat(breakdownData.heating), color: COLORS[2] },
      { name: 'Flights', value: parseFloat(breakdownData.flights), color: COLORS[3] },
      { name: 'Shopping', value: parseFloat(breakdownData.shopping), color: COLORS[4] }
    ];
    setChartData(pieData);

    const compData = [
      { name: 'Your Footprint', value: (total / 1000).toFixed(2) },
      { name: 'India Avg', value: 1.9 },
      { name: 'Global Avg', value: 4.7 },
      { name: 'Target', value: 2.0 }
    ];
    setComparisonData(compData);
  };

  const generateRecommendations = (emissions) => {
    const recs = [];

    if (calculations.transportation.vehicleType === 'car' && calculations.transportation.distance > 0) {
      recs.push({
        icon: Car,
        title: "Switch to Public Transport",
        impact: "Reduce emissions by 40%",
        savings: (emissions * 0.4).toFixed(2) + " tons CO2/year",
        color: '#3b82f6',
        priority: 'high'
      });
    }

    if (calculations.electricity.usage > 200) {
      recs.push({
        icon: Zap,
        title: "Install Solar Panels",
        impact: "Reduce emissions by 30%",
        savings: (emissions * 0.3).toFixed(2) + " tons CO2/year",
        color: '#f59e0b',
        priority: 'high'
      });
    }

    if (calculations.flights.longHaul > 2) {
      recs.push({
        icon: Plane,
        title: "Consider Virtual Meetings",
        impact: "Reduce emissions by 25%",
        savings: (emissions * 0.25).toFixed(2) + " tons CO2/year",
        color: '#8b5cf6',
        priority: 'medium'
      });
    }

    if (calculations.electricity.usage > 0) {
      recs.push({
        icon: Zap,
        title: "Switch to LED Bulbs",
        impact: "Reduce emissions by 10%",
        savings: (emissions * 0.1).toFixed(2) + " tons CO2/year",
        color: '#f59e0b',
        priority: 'low'
      });
    }

    recs.push({
      icon: Home,
      title: "Energy-Efficient Appliances",
      impact: "Reduce emissions by 15%",
      savings: (emissions * 0.15).toFixed(2) + " tons CO2/year",
      color: '#10b981',
      priority: 'medium'
    });

    if (calculations.shopping.amount > 5000) {
      recs.push({
        icon: ShoppingBag,
        title: "Buy Local Products",
        impact: "Reduce emissions by 8%",
        savings: (emissions * 0.08).toFixed(2) + " tons CO2/year",
        color: '#10b981',
        priority: 'low'
      });
    }

    setRecommendations(recs);
  };

  const getComparisonMetric = (emissions) => {
    const trees = Math.round(emissions * 45);
    const cars = Math.round(emissions / 4.6);
    return {
      trees,
      cars,
      phones: Math.round(emissions * 121000),
      text: `Equivalent to ${trees} trees needed to offset your carbon footprint annually`
    };
  };

  const handleInputChange = (category, field, value) => {
    setCalculations(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: field === 'vehicleType' ? value : (parseFloat(value) || 0)
      }
    }));
  };

  const getEmissionLevel = (emissions) => {
    if (emissions < 5) return {
      text: 'Excellent',
      color: 'text-green-600',
      bg: 'bg-green-100',
      gradient: 'from-green-500 to-emerald-600',
      message: 'Outstanding! Your carbon footprint is well below average.'
    };
    if (emissions < 10) return {
      text: 'Good',
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      gradient: 'from-blue-500 to-cyan-600',
      message: 'Good job! Your footprint is below the global average.'
    };
    if (emissions < 15) return {
      text: 'Average',
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
      gradient: 'from-yellow-500 to-orange-600',
      message: 'Room for improvement. Try implementing our recommendations.'
    };
    return {
      text: 'High',
      color: 'text-red-600',
      bg: 'bg-red-100',
      gradient: 'from-red-500 to-pink-600',
      message: 'Action needed! Your footprint is above average. Follow our tips to reduce it.'
    };
  };

  const saveToBackend = async () => {
    setSaving(true);
    try {
      const authToken = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId') || 'guest-user';

      const dataToSave = {
        userId,
        calculations,
        totalEmissions,
        breakdown,
        timestamp: new Date().toISOString()
      };

      const savedData = JSON.parse(localStorage.getItem('carbonFootprintHistory') || '[]');
      savedData.unshift(dataToSave);
      if (savedData.length > 10) savedData.pop();
      localStorage.setItem('carbonFootprintHistory', JSON.stringify(savedData));

      try {
        const response = await fetch(`${API_BASE_URL}/environment/carbon-footprint/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(dataToSave)
        });

        if (response.ok) {
          alert('✅ Carbon footprint data saved successfully!');
        }
      } catch (apiError) {
        console.log('Backend save failed, data saved locally');
      }

      loadSavedHistory();
      alert('✅ Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('⚠️ Failed to save data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const loadSavedHistory = () => {
    const history = JSON.parse(localStorage.getItem('carbonFootprintHistory') || '[]');
    setSavedHistory(history);
  };

  const loadHistoryItem = (item) => {
    setCalculations(item.calculations);
    setSelectedHistory(item);
    setShowHistory(false);
  };

  const deleteHistoryItem = (index) => {
    const history = [...savedHistory];
    history.splice(index, 1);
    localStorage.setItem('carbonFootprintHistory', JSON.stringify(history));
    loadSavedHistory();
  };

  const downloadPDF = () => {
    setDownloading(true);
    try {
      const doc = new jsPDF();
      const level = getEmissionLevel(totalEmissions);
      const comparison = getComparisonMetric(totalEmissions);

      doc.setFillColor(34, 197, 94);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Carbon Footprint Report', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`, 105, 30, { align: 'center' });

      doc.setTextColor(0, 0, 0);

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Your Annual Carbon Footprint', 20, 55);

      doc.setFillColor(59, 130, 246);
      doc.roundedRect(20, 60, 170, 35, 5, 5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(36);
      doc.text(`${totalEmissions.toFixed(2)} tons CO2`, 105, 78, { align: 'center' });
      doc.setFontSize(14);
      doc.text(`Status: ${level.text}`, 105, 88, { align: 'center' });

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Emissions Breakdown', 20, 110);

      const breakdownTableData = [
        ['Category', 'Emissions (tons CO2)', 'Percentage'],
        ['Transportation', breakdown.transportation, `${((breakdown.transportation / totalEmissions) * 100).toFixed(1)}%`],
        ['Electricity', breakdown.electricity, `${((breakdown.electricity / totalEmissions) * 100).toFixed(1)}%`],
        ['Heating', breakdown.heating, `${((breakdown.heating / totalEmissions) * 100).toFixed(1)}%`],
        ['Flights', breakdown.flights, `${((breakdown.flights / totalEmissions) * 100).toFixed(1)}%`],
        ['Shopping', breakdown.shopping, `${((breakdown.shopping / totalEmissions) * 100).toFixed(1)}%`]
      ];

      doc.autoTable({
        startY: 115,
        head: [breakdownTableData[0]],
        body: breakdownTableData.slice(1),
        theme: 'grid',
        headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [240, 253, 244] },
        margin: { left: 20, right: 20 }
      });

      let yPos = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Environmental Impact', 20, yPos);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      yPos += 8;
      doc.text(`• ${comparison.trees} trees needed to offset your footprint`, 25, yPos);
      yPos += 7;
      doc.text(`• Equivalent to driving ${comparison.cars} cars for a year`, 25, yPos);
      yPos += 7;
      doc.text(`• Equal to charging ${comparison.phones.toLocaleString()} smartphones`, 25, yPos);
      yPos += 10;
      doc.text(`• Global average: 4.7 tons/person`, 25, yPos);
      yPos += 7;
      doc.text(`• India average: 1.9 tons/person`, 25, yPos);

      yPos += 15;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('AI-Powered Recommendations', 20, yPos);

      recommendations.forEach((rec, index) => {
        yPos += 10;
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${rec.title}`, 25, yPos);
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`   ${rec.impact} - Save: ${rec.savings}`, 25, yPos);
        yPos += 5;
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`   Priority: ${rec.priority.toUpperCase()}`, 25, yPos);
        doc.setTextColor(0, 0, 0);
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
        doc.text('Generated by EcoMonitor - Environmental Management System', 105, 285, { align: 'center' });
      }

      doc.save(`Carbon_Footprint_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      alert('✅ PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('⚠️ Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const shareResults = async () => {
    const level = getEmissionLevel(totalEmissions);
    const shareText = `My Carbon Footprint: ${totalEmissions.toFixed(2)} tons CO2/year\nStatus: ${level.text}\n\nCalculated using EcoMonitor's AI-powered Carbon Calculator`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Carbon Footprint', text: shareText });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('✅ Results copied to clipboard!');
    }
  };

  const resetCalculator = () => {
    if (window.confirm('Are you sure?')) {
      setCalculations({
        transportation: { distance: 0, vehicleType: 'car' },
        electricity: { usage: 0 },
        heating: { usage: 0, type: 'gas' },
        flights: { shortHaul: 0, longHaul: 0 },
        shopping: { amount: 0 }
      });
      alert('✅ Calculator reset!');
    }
  };

  const level = getEmissionLevel(totalEmissions);
  const comparison = typeof comparisonMetric === 'object' ? comparisonMetric : getComparisonMetric(totalEmissions);

  return (
    <div className="calculator-container">
      <div className="calculator-wrapper">
        {/* Header */}
        <div className="header-card">
          <div className="header-content">
            <div className="header-icon-container">
              <Calculator size={32} className="text-white floating-icon" />
            </div>
            <div className="header-text">
              <h1 className="header-title">AI-Powered Carbon Calculator</h1>
              <p className="header-subtitle">Calculate and reduce your environmental impact with smart recommendations</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="action-btn primary" onClick={saveToBackend} disabled={saving || totalEmissions === 0}>
              <div className="flex-center gap-8 pos-relative z-1">
                {saving ? <RefreshCw size={18} className="spin" /> : <Save size={18} />}
                <span>{saving ? 'Saving...' : 'Save Data'}</span>
              </div>
            </button>
            <button className="action-btn secondary" onClick={downloadPDF} disabled={downloading || totalEmissions === 0}>
              <div className="flex-center gap-8 pos-relative z-1">
                {downloading ? <RefreshCw size={18} className="spin" /> : <Download size={18} />}
                <span>{downloading ? 'Generating...' : 'Download PDF'}</span>
              </div>
            </button>
            <button className="action-btn outline" onClick={() => setShowHistory(true)}>
              <div className="flex-center gap-8 pos-relative z-1">
                <History size={18} />
                <span>History ({savedHistory.length})</span>
              </div>
            </button>
            <button className="action-btn outline" onClick={shareResults} disabled={totalEmissions === 0}>
              <div className="flex-center gap-8 pos-relative z-1">
                <Share2 size={18} />
                <span>Share</span>
              </div>
            </button>
            {/* Reset button removed */}
          </div>
        </div>

        <div className="grid-2-col">
          {/* Input Section */}
          <div className="col-flex">
            {/* Transportation */}
            <div className="input-card">
              <div className="card-header">
                <Car size={24} className="text-blue-500 mr-12 icon-bounce" />
                <h2 className="card-title">Daily Transportation</h2>
              </div>
              <div className="col-flex gap-16">
                <div>
                  <label className="input-label">Vehicle Type</label>
                  <select
                    value={calculations.transportation.vehicleType}
                    onChange={(e) => handleInputChange('transportation', 'vehicleType', e.target.value)}
                    className="input-field"
                  >
                    <option value="" disabled>Select a vehicle</option>
                    <option value="car">🚗 Car (Petrol/Diesel) (0.21 kg/km)</option>
                    <option value="suv">🚙 SUV / 4x4 (0.28 kg/km)</option>
                    <option value="hybrid">🔋 Hybrid Car (0.12 kg/km)</option>
                    <option value="electric">⚡ Electric Vehicle (0.05 kg/km)</option>
                    <option value="motorcycle">🏍️ Motorcycle (0.103 kg/km)</option>
                    <option value="bus">🚌 Bus (Public) (0.089 kg/km)</option>
                    <option value="train">🚆 Train / Metro (0.041 kg/km)</option>
                    <option value="bicycle">🚲 Bicycle / Walk (0 kg/km)</option>
                  </select>
                </div>
                <div>
                  <div className="flex-between mb-8">
                    <label className="input-label m-0">Daily Distance</label>
                    <span className="text-13 font-600 text-slate-500">{calculations.transportation.distance} km</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="1"
                    value={calculations.transportation.distance}
                    onChange={(e) => handleInputChange('transportation', 'distance', e.target.value)}
                    className="w-100 mb-8 cursor-pointer accent-blue-500"
                    style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', appearance: 'none' }}
                  />
                  <input
                    type="number"
                    min="0"
                    value={calculations.transportation.distance}
                    onChange={(e) => handleInputChange('transportation', 'distance', e.target.value)}
                    className="input-field"
                    placeholder="Enter distance (km)"
                  />
                </div>
              </div>
              {calculations.transportation.distance > 0 && (
                <div className="info-banner">
                  💡 Annual emissions: {(calculations.transportation.distance * emissionFactors[calculations.transportation.vehicleType] * 365 / 1000).toFixed(2)} tons CO2
                </div>
              )}
            </div>

            {/* Energy Usage */}
            <div className="input-card">
              <div className="card-header">
                <Zap size={24} className="text-amber-500 mr-12 icon-bounce" />
                <h2 className="card-title">Energy Consumption</h2>
              </div>
              <div className="col-flex gap-16">
                <div>
                  <div className="flex-between mb-8">
                    <label className="input-label m-0">Monthly Electricity</label>
                    <span className="text-13 font-600 text-slate-500">{calculations.electricity.usage} kWh</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={calculations.electricity.usage}
                    onChange={(e) => handleInputChange('electricity', 'usage', e.target.value)}
                    className="w-100 mb-8 cursor-pointer accent-amber-500"
                    style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', appearance: 'none' }}
                  />
                  <input
                    type="number"
                    min="0"
                    value={calculations.electricity.usage}
                    onChange={(e) => handleInputChange('electricity', 'usage', e.target.value)}
                    className="input-field"
                    placeholder="Enter kWh"
                  />
                </div>
                <div>
                  <div className="flex-between mb-8">
                    <label className="input-label m-0">Monthly Heating (Gas)</label>
                    <span className="text-13 font-600 text-slate-500">{calculations.heating.usage} m³</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="5"
                    value={calculations.heating.usage}
                    onChange={(e) => handleInputChange('heating', 'usage', e.target.value)}
                    className="w-100 mb-8 cursor-pointer accent-amber-500"
                    style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', appearance: 'none' }}
                  />
                  <input
                    type="number"
                    min="0"
                    value={calculations.heating.usage}
                    onChange={(e) => handleInputChange('heating', 'usage', e.target.value)}
                    className="input-field"
                    placeholder="Enter m³"
                  />
                </div>
              </div>
            </div>

            {/* Air Travel */}
            <div className="input-card">
              <div className="card-header">
                <Plane size={24} className="text-purple-500 mr-12 icon-bounce" />
                <h2 className="card-title">Annual Air Travel</h2>
              </div>
              <div className="input-grid">
                <div>
                  <label className="input-label">Short-haul (&lt;1500km)</label>
                  <input
                    type="number"
                    min="0"
                    value={calculations.flights.shortHaul}
                    onChange={(e) => handleInputChange('flights', 'shortHaul', e.target.value)}
                    className="input-field"
                    placeholder="Count"
                  />
                  <p className="text-12 text-slate-500 mt-8">e.g., Domestic flights</p>
                </div>
                <div>
                  <label className="input-label">Long-haul (&gt;1500km)</label>
                  <input
                    type="number"
                    min="0"
                    value={calculations.flights.longHaul}
                    onChange={(e) => handleInputChange('flights', 'longHaul', e.target.value)}
                    className="input-field"
                    placeholder="Count"
                  />
                  <p className="text-12 text-slate-500 mt-8">e.g., International</p>
                </div>
              </div>
            </div>

            {/* Shopping */}
            <div className="input-card">
              <div className="card-header">
                <ShoppingBag size={24} className="text-green-500 mr-12 icon-bounce" />
                <h2 className="card-title">Shopping & Consumption</h2>
              </div>
              <div>
                <div className="flex-between mb-8">
                  <label className="input-label m-0">Monthly Spending</label>
                  <span className="text-13 font-600 text-slate-500">₹{calculations.shopping.amount}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="500"
                  value={calculations.shopping.amount}
                  onChange={(e) => handleInputChange('shopping', 'amount', e.target.value)}
                  className="w-100 mb-8 cursor-pointer accent-green-500"
                  style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', appearance: 'none' }}
                />
                <input
                  type="number"
                  min="0"
                  value={calculations.shopping.amount}
                  onChange={(e) => handleInputChange('shopping', 'amount', e.target.value)}
                  className="input-field"
                  placeholder="Enter amount (₹)"
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="col-flex">
            {/* Merged Results & Breakdown Dashboard */}
            <div className="comparison-card p-0 overflow-hidden mb-24">
              <div className="grid-2-col gap-0">
                {/* Left Panel: Total Score */}
                <div className="p-40 bg-gradient-impact b-b-1">
                  <div className="flex-center gap-12 mb-12 justify-start">
                    <Leaf size={32} className="text-green-600" />
                    <h2 className="text-20 font-700 m-0 text-slate-700">Annual Footprint</h2>
                  </div>
                  <div className="text-56 font-800 mb-8 text-slate-800">{totalEmissions.toFixed(2)}</div>
                  <p className="text-18 opacity-0-9 mb-16 text-slate-600">tons CO2 equivalent</p>
                  <div className="d-inline-block p-10-20 br-12 bg-white font-700 text-16 mb-12 text-slate-700 shadow-sm">
                    Status: <span className={level.color === 'green' ? 'text-green-500' : level.color === 'amber' ? 'text-amber-500' : 'text-red-500'}>{level.text}</span>
                  </div>
                  <p className="text-14 text-slate-500 mt-8 max-w-xs">{level.message}</p>
                </div>

                {/* Right Panel: Chart */}
                <div className="p-40 bg-white min-h-300">
                  <div className="flex-between mb-16">
                    <h3 className="card-title m-0">Breakdown</h3>
                    <PieChartIcon size={20} className="text-blue-500" />
                  </div>
                  {showCharts && totalEmissions > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex-center flex-col h-100 justify-center opacity-50">
                      <PieChartIcon size={48} className="mb-12 text-slate-300" />
                      <p className="text-14 text-slate-400 text-center">Enter data to see breakdown</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comparison */}
            <div className="comparison-card">
              <h3 className="card-title mb-16">Impact Comparison</h3>
              {totalEmissions > 0 ? (
                <>
                  <div className="grid-2-col grid-2-equal gap-12 mb-16">
                    <div className="bg-green-soft p-12 br-8">
                      <div className="text-24 font-800 text-green-success mb-4">{comparison.trees}</div>
                      <div className="text-12 text-slate-500">Trees Needed</div>
                    </div>
                    <div className="bg-amber-soft p-12 br-8">
                      <div className="text-24 font-800 text-amber-warning mb-4">{comparison.cars}</div>
                      <div className="text-12 text-slate-500">Car Years</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 br-8 p-16 border-l-4 border-green-success">
                    <p className="text-14 text-slate-700 mb-8 flex-center gap-8 justify-start">
                      <strong>Global average:</strong> 4.7 tons/person
                      {totalEmissions > 4.7 ? <ArrowUp size={16} className="text-red-500" /> : <ArrowDown size={16} className="text-green-500" />}
                    </p>
                    <p className="text-14 text-slate-700 m-0 flex-center gap-8 justify-start">
                      <strong>India average:</strong> 1.9 tons/person
                      {totalEmissions > 1.9 ? <ArrowUp size={16} className="text-red-500" /> : <ArrowDown size={16} className="text-green-500" />}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-14 text-slate-500 text-center p-20">Enter data to see comparison</p>
              )}
            </div>

            {/* AI Recommendations */}
            <div className="comparison-card">
              <div className="card-header">
                <TrendingDown size={24} className="text-green-500 mr-12" />
                <h3 className="card-title">AI Recommendations</h3>
              </div>
              {recommendations.length > 0 ? (
                <div className="col-flex gap-12">
                  {recommendations.map((rec, index) => {
                    const Icon = rec.icon;
                    return (
                      <div key={index} className="recommendation-card" style={{ borderColor: rec.color, animationDelay: `${0.1 * (index + 1)}s` }}>
                        <div className="flex-start">
                          <Icon size={20} className="mr-12 flex-shrink-0 mt-4" style={{ color: rec.color }} />
                          <div className="w-full">
                            <div className="flex-between mb-4">
                              <h4 className="font-700 text-slate-700 text-15 m-0">{rec.title}</h4>
                              <span className="text-10 p-4-8 br-8 font-700 uppercase" style={{
                                padding: '4px 8px',
                                background: rec.priority === 'high' ? '#fef2f2' : rec.priority === 'medium' ? '#fef3c7' : '#f0fdf4',
                                color: rec.priority === 'high' ? '#dc2626' : rec.priority === 'medium' ? '#f59e0b' : '#16a34a',
                              }}>
                                {rec.priority}
                              </span>
                            </div>
                            <p className="text-13 text-slate-500 mb-4">{rec.impact}</p>
                            <p className="text-12 font-700 m-0" style={{ color: rec.color }}>💰 Save: {rec.savings}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-14 text-slate-500 text-center p-20">Enter data to get recommendations</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="history-modal" onClick={() => setShowHistory(false)}>
          <div className="history-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex-between mb-24">
              <div className="flex-center gap-12">
                <History size={28} className="text-blue-500" />
                <h2 className="text-24 font-800 text-slate-700 m-0">History</h2>
              </div>
              <button onClick={() => setShowHistory(false)} className="p-8 br-8 border-none bg-slate-100 cursor-pointer">✕</button>
            </div>

            {savedHistory.length > 0 ? (
              <div className="col-flex gap-16">
                {savedHistory.map((item, index) => (
                  <div key={index} className="history-item">
                    <div className="flex-between mb-12">
                      <div>
                        <div className="text-20 font-800 text-slate-700 mb-4">{item.totalEmissions.toFixed(2)} tons CO2</div>
                        <div className="text-13 text-slate-500">
                          {new Date(item.timestamp).toLocaleDateString('en-IN', {
                            year: 'numeric', month: 'long', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <div className="flex-center gap-8">
                        <button onClick={() => loadHistoryItem(item)} className="p-8-16 br-8 border-none bg-blue-primary text-white cursor-pointer text-13 font-600">Load</button>
                        <button onClick={() => deleteHistoryItem(index)} className="p-8-16 br-8 border-none bg-red-danger text-white cursor-pointer text-13 font-600">Delete</button>
                      </div>
                    </div>
                    <div className="grid-cols-auto gap-8 text-12">
                      <div>🚗 Transport: {item.breakdown.transportation}t</div>
                      <div>⚡ Electricity: {item.breakdown.electricity}t</div>
                      <div>🔥 Heating: {item.breakdown.heating}t</div>
                      <div>✈️ Flights: {item.breakdown.flights}t</div>
                      <div>🛍️ Shopping: {item.breakdown.shopping}t</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-40 text-slate-500">
                <History size={48} className="opacity-3 mb-16" />
                <p>No history yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
