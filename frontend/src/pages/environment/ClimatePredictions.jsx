import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, CloudRain, Thermometer, Wind, Droplets, Download, RefreshCw, Share2, Maximize2, Minimize2, Satellite, Globe, Activity, MapPin, Calendar, Info, Zap, Cloud } from 'lucide-react';
import './ClimatePredictions.css';

export default function ClimatePredictions() {
  const [selectedRegion, setSelectedRegion] = useState('Bihar');
  const [timeframe, setTimeframe] = useState('10years');
  const [predictionType, setPredictionType] = useState('temperature');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [temperatureData, setTemperatureData] = useState([]);
  const [rainfallData, setRainfallData] = useState([]);
  const [extremeEventsData, setExtremeEventsData] = useState([]);
  const [nasaData, setNasaData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [insights, setInsights] = useState({});
  const [aiPredictions, setAiPredictions] = useState([]);
  const [satelliteData, setSatelliteData] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  const regions = [
    { name: 'Bihar', lat: 25.0961, lon: 85.3131 },
    { name: 'Delhi', lat: 28.7041, lon: 77.1025 },
    { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
    { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
    { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
    { name: 'Kolkata', lat: 22.5726, lon: 88.3639 }
  ];

  const adaptationStrategies = [
    { title: 'Drought-Resistant Crops', description: 'Implement climate-resilient seed varieties', icon: '🌾', priority: 'High' },
    { title: 'Water Harvesting', description: 'Enhance rainwater storage infrastructure', icon: '💧', priority: 'Critical' },
    { title: 'Early Warning Systems', description: 'AI-powered disaster prediction alerts', icon: '⚠️', priority: 'High' },
    { title: 'Smart Agriculture', description: 'IoT-based precision farming techniques', icon: '🚜', priority: 'Medium' },
    { title: 'Urban Heat Mitigation', description: 'Green roofs and cool pavement technology', icon: '🏙️', priority: 'High' },
    { title: 'Flood Management', description: 'Improved drainage and retention systems', icon: '🌊', priority: 'Critical' }
  ];

  useEffect(() => {
    fetchAllData();
  }, [selectedRegion, timeframe, predictionType]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchClimateData(),
        fetchNASAData(),
        fetchWeatherData(),
        fetchAQIData(),
        fetchSatelliteData()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const fetchClimateData = async () => {
    try {
      const region = regions.find(r => r.name === selectedRegion);
      const response = await fetch(`${API_BASE_URL}/environment/climate-predictions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          region: selectedRegion,
          lat: region.lat,
          lon: region.lon,
          timeframe,
          predictionType
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTemperatureData(data.temperature || []);
        setRainfallData(data.rainfall || []);
        setExtremeEventsData(data.extremeEvents || []);
        setInsights(data.insights || {});
        setAiPredictions(data.aiPredictions || []);
      } else {
        loadFallbackData();
      }
    } catch (error) {
      console.error('Climate data fetch failed:', error);
      loadFallbackData();
    }
  };

  const fetchNASAData = async () => {
    try {
      const region = regions.find(r => r.name === selectedRegion);
      const response = await fetch(`${API_BASE_URL}/environment/nasa-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          lat: region.lat,
          lon: region.lon,
          date: new Date().toISOString().split('T')[0]
        })
      });

      if (response.ok) {
        const data = await response.json();
        setNasaData(data);
      }
    } catch (error) {
      console.log('NASA data unavailable');
    }
  };

  const fetchWeatherData = async () => {
    try {
      const region = regions.find(r => r.name === selectedRegion);
      const response = await fetch(`${API_BASE_URL}/environment/weather`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          lat: region.lat,
          lon: region.lon
        })
      });

      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
      }
    } catch (error) {
      console.log('Weather data unavailable');
    }
  };

  const fetchAQIData = async () => {
    try {
      const region = regions.find(r => r.name === selectedRegion);
      const response = await fetch(`${API_BASE_URL}/environment/aqi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          lat: region.lat,
          lon: region.lon
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAqiData(data);
      }
    } catch (error) {
      console.log('AQI data unavailable');
    }
  };

  const fetchSatelliteData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/environment/satellite-imagery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          region: selectedRegion
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSatelliteData(data);
      }
    } catch (error) {
      console.log('Satellite data unavailable');
    }
  };

  const loadFallbackData = () => {
    setTemperatureData([
      { year: '2025', current: 26.5, predicted: 26.8, optimistic: 26.6, pessimistic: 27.2 },
      { year: '2027', current: 26.7, predicted: 27.4, optimistic: 27.0, pessimistic: 28.0 },
      { year: '2029', current: 26.9, predicted: 28.0, optimistic: 27.5, pessimistic: 28.8 },
      { year: '2031', current: 27.1, predicted: 28.6, optimistic: 28.0, pessimistic: 29.5 },
      { year: '2033', current: 27.3, predicted: 29.2, optimistic: 28.5, pessimistic: 30.2 },
      { year: '2035', current: 27.5, predicted: 29.8, optimistic: 29.0, pessimistic: 30.9 }
    ]);

    setRainfallData([
      { month: 'Jan', historical: 15, predicted: 12 },
      { month: 'Feb', historical: 20, predicted: 18 },
      { month: 'Mar', historical: 25, predicted: 22 },
      { month: 'Apr', historical: 35, predicted: 30 },
      { month: 'May', historical: 65, predicted: 58 },
      { month: 'Jun', historical: 220, predicted: 240 },
      { month: 'Jul', historical: 310, predicted: 330 },
      { month: 'Aug', historical: 285, predicted: 295 },
      { month: 'Sep', historical: 240, predicted: 220 },
      { month: 'Oct', historical: 95, predicted: 85 },
      { month: 'Nov', historical: 25, predicted: 20 },
      { month: 'Dec', historical: 12, predicted: 10 }
    ]);

    setExtremeEventsData([
      { year: '2025', heatwaves: 3, floods: 2, droughts: 1, storms: 4 },
      { year: '2027', heatwaves: 4, floods: 3, droughts: 2, storms: 5 },
      { year: '2029', heatwaves: 5, floods: 4, droughts: 2, storms: 6 },
      { year: '2031', heatwaves: 6, floods: 5, droughts: 3, storms: 7 },
      { year: '2033', heatwaves: 7, floods: 6, droughts: 4, storms: 8 },
      { year: '2035', heatwaves: 9, floods: 7, droughts: 5, storms: 9 }
    ]);

    setInsights({
      temperature: {
        trend: '+2.3°C by 2035',
        confidence: 87,
        impact: 'High',
        description: 'Temperature increase will affect agriculture, water availability, and increase heat-related health risks.'
      },
      rainfall: {
        trend: 'Monsoon intensity +8%',
        confidence: 72,
        impact: 'Medium-High',
        description: 'More intense but shorter monsoon periods, increasing flood risks while potentially reducing overall water availability.'
      },
      events: {
        trend: '+180% extreme events',
        confidence: 81,
        impact: 'Very High',
        description: 'Significant increase in frequency and severity of heatwaves, floods, and storms requiring urgent adaptation measures.'
      }
    });

    setAiPredictions([
      { icon: Thermometer, title: 'Temperature Anomalies', prediction: 'Above-average temperatures expected for next 3 months', confidence: 85, color: '#ef4444', trend: '+1.2°C' },
      { icon: CloudRain, title: 'Monsoon Pattern', prediction: 'Delayed onset predicted by 7-10 days with increased intensity', confidence: 78, color: '#3b82f6', trend: '+8% intensity' },
      { icon: Wind, title: 'Air Quality Index', prediction: 'Moderate to poor AQI levels during winter months', confidence: 82, color: '#8b5cf6', trend: 'AQI 150-200' },
      { icon: Droplets, title: 'Water Stress', prediction: 'Increased groundwater depletion, requiring conservation', confidence: 90, color: '#f59e0b', trend: '-15% availability' }
    ]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
    showToast('✅ Data refreshed!');
  };

  const downloadReport = () => {
    const report = {
      region: selectedRegion,
      timeframe,
      predictionType,
      insights: insights[predictionType],
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `climate_predictions_${selectedRegion}_${Date.now()}.json`;
    a.click();
    showToast('✅ Report downloaded!');
  };

  const shareReport = async () => {
    const shareText = `Climate Predictions for ${selectedRegion}:\n${insights[predictionType]?.description}\n\nGenerated by EcoMonitor AI`;
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch (e) {
        navigator.clipboard.writeText(shareText);
        showToast('✅ Copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      showToast('✅ Copied to clipboard!');
    }
  };

  const showToast = (msg) => {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, #10b981, #3b82f6);
      color: white; padding: 16px 24px; border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.2);
      z-index: 10000; font-weight: 600; animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const currentInsight = insights[predictionType] || insights.temperature || {};

  return (
    <div className={`climate-container ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      <div className="climate-wrapper">
        {/* Header */}
        <div className="card">
          <div className="pos-relative z-1">
            <div className="flex-between flex-wrap gap-16">
              <div className="flex-center gap-16">
                <div className="header-icon-container">
                  <TrendingUp size={32} className="text-white floating-icon" />
                </div>
                <div>
                  <h1 className="text-5xl font-extrabold text-gray-800 m-0">AI Climate Predictions</h1>
                  <p className="text-gray-500 m-0 flex-center gap-8 text-lg justify-start">
                    <Satellite size={16} className="text-blue-500" />
                    NASA & EPA powered • Real-time satellite data
                  </p>
                </div>
              </div>
              <div className="flex-center gap-12 flex-wrap">
                <button className="action-btn" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw size={18} className={refreshing ? 'animate-spin-1s' : ''} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                <button className="action-btn" onClick={downloadReport}>
                  <Download size={18} />
                  Download
                </button>
                <button className="action-btn" onClick={shareReport}>
                  <Share2 size={18} />
                  Share
                </button>
                <button className="icon-btn" onClick={() => setIsFullscreen(!isFullscreen)}>
                  {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="card">
          <div className="pos-relative z-1">
            <div className="grid gap-16 grid-fit-250">
              <div>
                <label className="label-style">
                  <MapPin size={14} className="inline-block mr-6" />
                  Region
                </label>
                <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className="input-field">
                  {regions.map(r => (
                    <option key={r.name} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-style">
                  <Calendar size={14} className="inline-block mr-6" />
                  Timeframe
                </label>
                <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="input-field">
                  <option value="5years">Next 5 Years</option>
                  <option value="10years">Next 10 Years</option>
                  <option value="20years">Next 20 Years</option>
                </select>
              </div>
              <div>
                <label className="label-style">
                  <Activity size={14} className="inline-block mr-6" />
                  Prediction Type
                </label>
                <select value={predictionType} onChange={(e) => setPredictionType(e.target.value)} className="input-field">
                  <option value="temperature">Temperature</option>
                  <option value="rainfall">Rainfall</option>
                  <option value="events">Extreme Events</option>
                </select>
              </div>
            </div>

            {(weatherData || nasaData || aqiData) && (
              <div className="live-data-panel">
                <h3 className="text-lg font-bold text-gray-800 mb-12">
                  🛰️ Live Satellite & Weather Data
                </h3>
                <div className="grid gap-12 grid-fit-150">
                  {weatherData && (
                    <div className="flex-col">
                      <div className="text-xs text-gray-500">Current Temp</div>
                      <div className="text-3xl font-extrabold text-red-500">
                        {weatherData.temp}°C
                      </div>
                    </div>
                  )}
                  {aqiData && (
                    <div className="flex-col">
                      <div className="text-xs text-gray-500">Air Quality</div>
                      <div className="text-3xl font-extrabold text-purple-500">
                        AQI {aqiData.value}
                      </div>
                    </div>
                  )}
                  {nasaData && (
                    <div className="flex-col">
                      <div className="text-xs text-gray-500">NASA Data</div>
                      <div className="text-3xl font-extrabold text-blue-500">
                        ✓ Active
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Predictions Cards */}
        <div className="grid gap-16 mb-24 grid-fit-280">
          {aiPredictions.map((pred, index) => {
            const Icon = pred.icon;
            return (
              <div key={index} className="prediction-card" style={{ borderLeft: `4px solid ${pred.color}` }}>
                <div className="flex-between mb-16">
                  <div className="prediction-icon-container" style={{ background: `${pred.color}20` }}>
                    <Icon size={24} style={{ color: pred.color }} className="floating-icon" />
                  </div>
                  <div className="prediction-confidence-badge" style={{ background: `${pred.color}20`, color: pred.color }}>
                    {pred.confidence}% Confidence
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-8">{pred.title}</h3>
                <p className="text-base text-gray-500 mb-12 lh-1-6">{pred.prediction}</p>
                <div className="flex-between">
                  <span className="text-2xl font-extrabold" style={{ color: pred.color }}>{pred.trend}</span>
                  <div className="confidence-bar-bg">
                    <div className="confidence-bar-fill" style={{ width: `${pred.confidence}%`, background: pred.color }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-24 mb-24 charts-grid-cols">
          {/* Main Chart */}
          <div className="card col-span-2">
            <div className="pos-relative z-1">
              <h2 className="text-3xl font-extrabold text-gray-800 mb-20 flex-center gap-12 justify-start">
                <Globe size={28} className="text-blue-500" />
                {predictionType === 'temperature' && 'Temperature Projections'}
                {predictionType === 'rainfall' && 'Rainfall Pattern Analysis'}
                {predictionType === 'events' && 'Extreme Weather Events Forecast'}
              </h2>

              {loading ? (
                <div className="flex-col flex-center h-350">
                  <div className="loading-spinner"></div>
                  <p className="mt-16 text-gray-500 text-center">Loading predictions...</p>
                </div>
              ) : (
                <>
                  {predictionType === 'temperature' && temperatureData.length > 0 && (
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={temperatureData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#64748b" label={{ value: '°C', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Legend />
                        <Line type="monotone" dataKey="current" stroke="#10b981" strokeWidth={2} name="Historical" dot={{ fill: '#10b981', r: 4 }} />
                        <Line type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={3} name="AI Prediction" dot={{ fill: '#3b82f6', r: 5 }} />
                        <Line type="monotone" dataKey="optimistic" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" name="Best Case" />
                        <Line type="monotone" dataKey="pessimistic" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Worst Case" />
                      </LineChart>
                    </ResponsiveContainer>
                  )}

                  {predictionType === 'rainfall' && rainfallData.length > 0 && (
                    <ResponsiveContainer width="100%" height={350}>
                      <AreaChart data={rainfallData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#64748b" label={{ value: 'mm', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                        <Legend />
                        <Area type="monotone" dataKey="historical" stackId="1" stroke="#10b981" fill="#10b98150" name="Historical" />
                        <Area type="monotone" dataKey="predicted" stackId="2" stroke="#3b82f6" fill="#3b82f650" name="Predicted" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}

                  {predictionType === 'events' && extremeEventsData.length > 0 && (
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={extremeEventsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                        <Legend />
                        <Line type="monotone" dataKey="heatwaves" stroke="#ef4444" strokeWidth={2} name="Heatwaves" />
                        <Line type="monotone" dataKey="floods" stroke="#3b82f6" strokeWidth={2} name="Floods" />
                        <Line type="monotone" dataKey="droughts" stroke="#f59e0b" strokeWidth={2} name="Droughts" />
                        <Line type="monotone" dataKey="storms" stroke="#8b5cf6" strokeWidth={2} name="Storms" />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Insights Panel */}
          <div className="flex-col gap-20">
            <div className="insight-card">
              <div className="pos-relative z-1">
                <h3 className="text-2xl font-bold mb-20 flex-center gap-8 justify-start">
                  <Zap size={24} />
                  Key Insights
                </h3>
                <div className="flex-col gap-16">
                  <div>
                    <p className="text-sm opacity-0-9 mb-6">Projected Trend</p>
                    <p className="text-4xl font-extrabold">{currentInsight.trend || 'Loading...'}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-0-9 mb-6">Model Confidence</p>
                    <div className="flex-center justify-start">
                      <div className="confidence-bar-bg ml-0 bg-trans-white-30">
                        <div className="confidence-bar-fill bg-white" style={{ width: `${currentInsight.confidence || 0}%` }}></div>
                      </div>
                      <span className="text-xl font-bold ml-12">{currentInsight.confidence || 0}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm opacity-0-9 mb-6">Impact Level</p>
                    <p className="text-xl font-bold">{currentInsight.impact || 'Medium'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="alert-panel">
              <div className="flex-start gap-12">
                <AlertTriangle size={24} className="text-orange-500 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-bold text-amber-800 mb-8">Climate Analysis</h4>
                  <p className="text-base text-amber-900 lh-1-6">{currentInsight.description || 'No description available'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Adaptation Strategies */}
        <div className="card">
          <div className="pos-relative z-1">
            <h3 className="text-3xl font-extrabold text-gray-800 mb-20 flex-center gap-12 justify-start">
              <Cloud size={28} className="text-green-500" />
              Climate Adaptation Strategies
            </h3>
            <div className="grid gap-16 grid-fit-300">
              {adaptationStrategies.map((strategy, index) => (
                <div key={index} className="strategy-card">
                  <div className="flex-between mb-8">
                    <span className="text-3xl">{strategy.icon}</span>
                    <span className="priority-badge" style={{
                      background: strategy.priority === 'Critical' ? '#fee2e2' : strategy.priority === 'High' ? '#fef3c7' : '#dcfce7',
                      color: strategy.priority === 'Critical' ? '#b91c1c' : strategy.priority === 'High' ? '#b45309' : '#15803d'
                    }}>
                      {strategy.priority} Priority
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-4">{strategy.title}</h4>
                  <p className="text-sm text-gray-500 m-0">{strategy.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
