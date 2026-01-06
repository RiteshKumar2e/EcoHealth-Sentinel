import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, CloudRain, Thermometer, Wind, Droplets, Download, RefreshCw, Share2, Maximize2, Minimize2, Satellite, Globe, Activity, MapPin, Calendar, Info, Zap, Cloud } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './ClimatePredictions.css';

export default function ClimatePredictions() {
  const [selectedState, setSelectedState] = useState('Select State');
  const [selectedCity, setSelectedCity] = useState('Select City');
  const [selectedRegion, setSelectedRegion] = useState(''); // Empty initially
  const [timeframe, setTimeframe] = useState('Choose Timeframe');
  const [predictionType, setPredictionType] = useState('Select Prediction Type');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [temperatureData, setTemperatureData] = useState([]);
  const [rainfallData, setRainfallData] = useState([]);
  const [extremeEventsData, setExtremeEventsData] = useState([]);
  const [nasaData, setNasaData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [insights, setInsights] = useState({});
  const [aiPredictions, setAiPredictions] = useState([]);
  const [satelliteData, setSatelliteData] = useState(null);

  const indianStates = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati'],
    'Arunachal Pradesh': ['Itanagar', 'Naharlagun'],
    'Assam': ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat'],
    'Bihar': ['Patna', 'Gaya', 'Muzaffarpur', 'Darbhanga', 'Bhagalpur', 'Purnia'],
    'Chandigarh': ['Chandigarh'],
    'Chhattisgarh': ['Raipur', 'Bilaspur', 'Durg'],
    'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
    'Goa': ['Panaji', 'Margao'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
    'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Rohtak', 'Hisar'],
    'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Manali'],
    'Jammu & Kashmir': ['Srinagar', 'Jammu'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur'],
    'Ladakh': ['Leh'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Thane'],
    'Manipur': ['Imphal'],
    'Meghalaya': ['Shillong'],
    'Mizoram': ['Aizawl'],
    'Nagaland': ['Kohima', 'Dimapur'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Chandigarh'],
    'Puducherry': ['Puducherry'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
    'Sikkim': ['Gangtok'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad'],
    'Tripura': ['Agartala'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Noida'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Rishikesh', 'Nainital'],
    'West Bengal': ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur', 'Darjeeling']
  };

  useEffect(() => {
    // Reset city when state changes
    if (selectedState !== 'Select State') {
      setSelectedCity('Select City');
    }
  }, [selectedState]);

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setSelectedRegion(city);
  };

  const cityCoordinates = {
    // Andhra Pradesh
    'Visakhapatnam': { lat: 17.6868, lon: 83.2185 }, 'Vijayawada': { lat: 16.5062, lon: 80.6480 }, 'Guntur': { lat: 16.3067, lon: 80.4365 }, 'Nellore': { lat: 14.4426, lon: 79.9865 }, 'Tirupati': { lat: 13.6288, lon: 79.4192 },
    // Arunachal Pradesh
    'Itanagar': { lat: 27.0844, lon: 93.6053 }, 'Naharlagun': { lat: 27.1000, lon: 93.6167 },
    // Assam
    'Guwahati': { lat: 26.1445, lon: 91.7362 }, 'Dibrugarh': { lat: 27.4728, lon: 94.9120 }, 'Silchar': { lat: 24.8333, lon: 92.7789 }, 'Jorhat': { lat: 26.7509, lon: 94.2037 },
    // Bihar
    'Patna': { lat: 25.5941, lon: 85.1376 }, 'Gaya': { lat: 24.7914, lon: 85.0002 }, 'Muzaffarpur': { lat: 26.1197, lon: 85.3910 }, 'Darbhanga': { lat: 26.1542, lon: 85.8918 }, 'Bhagalpur': { lat: 25.2425, lon: 87.0111 }, 'Purnia': { lat: 25.7771, lon: 87.4753 },
    // Chandigarh
    'Chandigarh': { lat: 30.7333, lon: 76.7794 },
    // Chhattisgarh
    'Raipur': { lat: 21.2514, lon: 81.6296 }, 'Bilaspur': { lat: 22.0797, lon: 82.1409 }, 'Durg': { lat: 21.1904, lon: 81.2849 },
    // Delhi
    'New Delhi': { lat: 28.6139, lon: 77.2090 }, 'North Delhi': { lat: 28.7041, lon: 77.1025 }, 'South Delhi': { lat: 28.4817, lon: 77.1873 }, 'East Delhi': { lat: 28.6277, lon: 77.2924 }, 'West Delhi': { lat: 28.6473, lon: 77.1084 },
    // Goa
    'Panaji': { lat: 15.4909, lon: 73.8278 }, 'Margao': { lat: 15.2832, lon: 73.9862 },
    // Gujarat
    'Ahmedabad': { lat: 23.0225, lon: 72.5714 }, 'Surat': { lat: 21.1702, lon: 72.8311 }, 'Vadodara': { lat: 22.3072, lon: 73.1812 }, 'Rajkot': { lat: 22.3039, lon: 70.8022 }, 'Gandhinagar': { lat: 23.2156, lon: 72.6369 },
    // Haryana
    'Gurugram': { lat: 28.4595, lon: 77.0266 }, 'Faridabad': { lat: 28.4089, lon: 77.3178 }, 'Panipat': { lat: 29.3909, lon: 76.9635 }, 'Rohtak': { lat: 28.8955, lon: 76.6066 }, 'Hisar': { lat: 29.1492, lon: 75.7217 },
    // Himachal Pradesh
    'Shimla': { lat: 31.1048, lon: 77.1734 }, 'Dharamshala': { lat: 32.2190, lon: 76.3239 }, 'Manali': { lat: 32.2432, lon: 77.1892 },
    // J&K
    'Srinagar': { lat: 34.0837, lon: 74.7973 }, 'Jammu': { lat: 32.7266, lon: 74.8570 },
    // Jharkhand
    'Ranchi': { lat: 23.3441, lon: 85.3096 }, 'Jamshedpur': { lat: 22.8046, lon: 86.2029 }, 'Dhanbad': { lat: 23.7957, lon: 86.4304 }, 'Bokaro': { lat: 23.6693, lon: 86.1511 },
    // Karnataka
    'Bangalore': { lat: 12.9716, lon: 77.5946 }, 'Mysore': { lat: 12.2958, lon: 76.6394 }, 'Hubli': { lat: 15.3647, lon: 75.1240 }, 'Mangalore': { lat: 12.9141, lon: 74.8560 }, 'Belgaum': { lat: 15.8497, lon: 74.4977 },
    // Kerala
    'Thiruvananthapuram': { lat: 8.5241, lon: 76.9366 }, 'Kochi': { lat: 9.9312, lon: 76.2673 }, 'Kozhikode': { lat: 11.2588, lon: 75.7804 }, 'Thrissur': { lat: 10.5276, lon: 76.2144 },
    // Ladakh
    'Leh': { lat: 34.1526, lon: 77.5770 },
    // Madhya Pradesh
    'Bhopal': { lat: 23.2599, lon: 77.4126 }, 'Indore': { lat: 22.7196, lon: 75.8577 }, 'Gwalior': { lat: 26.2183, lon: 78.1828 }, 'Jabalpur': { lat: 23.1815, lon: 79.9490 }, 'Ujjain': { lat: 23.1765, lon: 75.7885 },
    // Maharashtra
    'Mumbai': { lat: 19.0760, lon: 72.8777 }, 'Pune': { lat: 18.5204, lon: 73.8567 }, 'Nagpur': { lat: 21.1458, lon: 79.0882 }, 'Nashik': { lat: 19.9975, lon: 73.7898 }, 'Aurangabad': { lat: 19.8762, lon: 75.3433 }, 'Thane': { lat: 19.2183, lon: 72.9781 },
    // Manipur, Meghalaya, Mizoram, Nagaland
    'Imphal': { lat: 24.8170, lon: 93.9368 }, 'Shillong': { lat: 25.5788, lon: 91.8933 }, 'Aizawl': { lat: 23.7271, lon: 92.7176 }, 'Kohima': { lat: 25.6701, lon: 94.1077 }, 'Dimapur': { lat: 25.9060, lon: 93.7272 },
    // Odisha
    'Bhubaneswar': { lat: 20.2961, lon: 85.8245 }, 'Cuttack': { lat: 20.4625, lon: 85.8828 }, 'Rourkela': { lat: 22.2604, lon: 84.8536 }, 'Puri': { lat: 19.8135, lon: 85.8312 },
    // Punjab
    'Ludhiana': { lat: 30.9010, lon: 75.8573 }, 'Amritsar': { lat: 31.6340, lon: 74.8723 }, 'Jalandhar': { lat: 31.3260, lon: 75.5762 }, 'Patiala': { lat: 30.3398, lon: 76.3869 },
    // Puducherry
    'Puducherry': { lat: 11.9416, lon: 79.8083 },
    // Rajasthan
    'Jaipur': { lat: 26.9124, lon: 75.7873 }, 'Jodhpur': { lat: 26.2389, lon: 73.0243 }, 'Udaipur': { lat: 24.5854, lon: 73.7125 }, 'Kota': { lat: 25.2138, lon: 75.8648 }, 'Ajmer': { lat: 26.4499, lon: 74.6399 },
    // Sikkim -> Gangtok, Tamil Nadu
    'Gangtok': { lat: 27.3314, lon: 88.6138 },
    'Chennai': { lat: 13.0827, lon: 80.2707 }, 'Coimbatore': { lat: 11.0168, lon: 76.9558 }, 'Madurai': { lat: 9.9252, lon: 78.1198 }, 'Trichy': { lat: 10.7905, lon: 78.7047 }, 'Salem': { lat: 11.6643, lon: 78.1460 },
    // Telangana
    'Hyderabad': { lat: 17.3850, lon: 78.4867 }, 'Warangal': { lat: 17.9689, lon: 79.5941 }, 'Nizamabad': { lat: 18.6725, lon: 78.0941 },
    // Tripura, UP
    'Agartala': { lat: 23.8315, lon: 91.2868 },
    'Lucknow': { lat: 26.8467, lon: 80.9462 }, 'Kanpur': { lat: 26.4499, lon: 80.3319 }, 'Ghaziabad': { lat: 28.6692, lon: 77.4538 }, 'Agra': { lat: 27.1767, lon: 78.0081 }, 'Varanasi': { lat: 25.3176, lon: 82.9739 }, 'Noida': { lat: 28.5355, lon: 77.3910 },
    // Uttarakhand
    'Dehradun': { lat: 30.6280, lon: 78.0322 }, 'Haridwar': { lat: 29.9457, lon: 78.1642 }, 'Rishikesh': { lat: 30.0869, lon: 78.2676 }, 'Nainital': { lat: 29.3919, lon: 79.4542 },
    // West Bengal
    'Kolkata': { lat: 22.5726, lon: 88.3639 }, 'Howrah': { lat: 22.5958, lon: 88.2636 }, 'Siliguri': { lat: 26.7271, lon: 88.3953 }, 'Durgapur': { lat: 23.5204, lon: 87.3119 }, 'Darjeeling': { lat: 27.0410, lon: 88.2663 }
  };

  const adaptationStrategies = [
    { title: 'Drought-Resistant Crops', description: 'Implement climate-resilient seed varieties', icon: '🌾', priority: 'High' },
    { title: 'Water Harvesting', description: 'Enhance rainwater storage infrastructure', icon: '💧', priority: 'Critical' },
    { title: 'Early Warning Systems', description: 'AI-powered disaster prediction alerts', icon: '⚠️', priority: 'High' },
    { title: 'Smart Agriculture', description: 'IoT-based precision farming techniques', icon: '🚜', priority: 'Medium' },
    { title: 'Urban Heat Mitigation', description: 'Green roofs and cool pavement technology', icon: '🏙️', priority: 'High' },
    { title: 'Flood Management', description: 'Improved drainage and retention systems', icon: '🌊', priority: 'Critical' }
  ];

  useEffect(() => {
    if (selectedCity && selectedCity !== 'Select City') {
      fetchAllData();
    }
  }, [selectedRegion, timeframe, predictionType]);

  const fetchAllData = async () => {
    if (!selectedRegion || selectedRegion === 'Select City') return;

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

  const getCoordinates = () => {
    return cityCoordinates[selectedRegion] || { lat: 0, lon: 0 };
  };

  const fetchClimateData = async () => {
    try {
      const { lat, lon } = getCoordinates();
      if (!lat || !lon) return;

      const response = await fetch(`${API_BASE_URL}/environment/climate-predictions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          region: selectedRegion,
          lat,
          lon,
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
      const { lat, lon } = getCoordinates();
      const response = await fetch(`${API_BASE_URL}/environment/nasa-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          lat,
          lon,
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
      const { lat, lon } = getCoordinates();
      const response = await fetch(`${API_BASE_URL}/environment/weather`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          lat,
          lon
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
      const { lat, lon } = getCoordinates();
      const response = await fetch(`${API_BASE_URL}/environment/aqi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          lat,
          lon
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
    // Reset data to empty to indicate no data found via backend
    setTemperatureData([]);
    setRainfallData([]);
    setExtremeEventsData([]);
    setInsights({});
    setAiPredictions([]);
    setNasaData(null);
    setWeatherData(null);
    setAqiData(null);
    setSatelliteData(null);

    if (selectedRegion && selectedRegion !== 'Select City') {
      showToast('⚠️ No backend data available for this region.');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
    showToast('✅ Data refreshed!');
  };

  const downloadReport = async () => {
    setIsDownloading(true);
    showToast('📜 Generating Professional PDF Report...');

    try {
      const element = document.querySelector('.climate-wrapper');

      // Professional capture configuration
      const canvas = await html2canvas(element, {
        scale: 3, // High DPI for print quality
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 1400,
        onclone: (clonedDoc) => {
          // Hide elements we don't want in the PDF (like action buttons)
          const actionArea = clonedDoc.querySelector('.flex-center.gap-12.flex-wrap');
          if (actionArea) actionArea.style.display = 'none';

          // Add a professional title to the top of the cloned document
          const header = clonedDoc.querySelector('.climate-wrapper');
          const reportTitle = clonedDoc.createElement('div');
          reportTitle.style.cssText = `
            text-align: center;
            padding: 20px;
            border-bottom: 2px solid #10b981;
            margin-bottom: 30px;
            color: #064e3b;
            font-family: 'Inter', sans-serif;
          `;
          reportTitle.innerHTML = `
            <div style="font-size: 28px; font-weight: 800;">EcoHealth Sentinel - Climate Analysis</div>
            <div style="font-size: 14px; margin-top: 5px; color: #64748b;">
              Official Environmental Report | Generated on ${new Date().toLocaleString()}
            </div>
          `;
          header.insertBefore(reportTitle, header.firstChild);
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const ratio = Math.min(pdfWidth / imgWidth, (pdfHeight - 40) / imgHeight); // Leave space for footer
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;

      // Center the content on the A4 page
      const xOffset = (pdfWidth - finalWidth) / 2;

      pdf.addImage(imgData, 'JPEG', xOffset, 15, finalWidth, finalHeight);

      // Add Footer with branding
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(`© ${new Date().getFullYear()} EcoHealth-Sentinel Environmental Monitoring`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
      pdf.text(`Region: ${selectedRegion} | Page 1`, pdfWidth - 20, pdfHeight - 10, { align: 'right' });

      pdf.save(`Climate_Analysis_${selectedRegion}_${Date.now()}.pdf`);
      showToast('✅ Professional PDF Exported!');
    } catch (error) {
      console.error('PDF Generation Error:', error);
      showToast('❌ Error generating professional report');
    } finally {
      setIsDownloading(false);
    }
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
      position: fixed; bottom: 20px; right: 20px; background: #1e293b;
      color: white; padding: 16px 24px; border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.2);
      z-index: 10000; font-weight: 600;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const currentInsight = insights[predictionType] || {};

  return (
    <div className={`climate-container ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      <div className="climate-wrapper">
        {/* Header */}
        <div className="card">
          <div className="pos-relative z-1">
            <div className="flex-between flex-wrap gap-16">
              <div className="flex-center gap-16">
                <div className="header-icon-container">
                  <TrendingUp size={32} />
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-800 m-0">AI Climate Predictions</h1>
                  <p className="text-gray-500 m-0 flex-center gap-8 text-lg justify-start">
                    <Satellite size={16} className="text-blue-500" />
                    NASA & EPA powered • Real-time satellite data
                  </p>
                </div>
              </div>
              <div className="flex-center gap-12 flex-wrap">
                <button
                  className="action-btn"
                  onClick={downloadReport}
                  disabled={isDownloading}
                >
                  <Download size={18} />
                  <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
                </button>
                <button className="action-btn" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw size={18} />
                  <span>{refreshing ? 'Syncing...' : 'Sync Data'}</span>
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
                  Select State
                </label>
                <select value={selectedState} onChange={handleStateChange} className="input-field">
                  <option value="Select State">Select State</option>
                  {Object.keys(indianStates).map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-style">
                  <MapPin size={14} className="inline-block mr-6" />
                  Select City
                </label>
                <select
                  value={selectedCity}
                  onChange={handleCityChange}
                  className="input-field"
                  disabled={selectedState === 'Select State'}
                >
                  <option value="Select City">Select City</option>
                  {indianStates[selectedState]?.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-style">
                  <Calendar size={14} className="inline-block mr-6" />
                  Timeframe
                </label>
                <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="input-field">
                  <option value="Choose Timeframe">Choose Timeframe</option>
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
                  <option value="Select Prediction Type">Select Prediction Type</option>
                  <option value="temperature">Temperature</option>
                  <option value="rainfall">Rainfall</option>
                  <option value="events">Extreme Events</option>
                  <option value="aqi">Air Quality (AQI)</option>
                  <option value="humidity">Humidity Trends</option>
                  <option value="wind">Wind Patterns</option>
                  <option value="co2">CO2 Emissions</option>
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
                    <Icon size={24} style={{ color: pred.color }} />
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
                {predictionType === 'aqi' && 'Air Quality Forecast'}
                {predictionType === 'humidity' && 'Humidity Trend Analysis'}
                {predictionType === 'wind' && 'Wind Pattern Projections'}
                {predictionType === 'co2' && 'Carbon Emission Trends'}
              </h2>

              {loading ? (
                <div className="flex-col flex-center h-350">
                  <div className="loading-spinner"></div>
                  <p className="mt-16 text-gray-500 text-center">Loading predictions...</p>
                </div>
              ) : (
                <>
                  {predictionType === 'Temperature' && temperatureData.length > 0 && (
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

              {/* Placeholder for new types */}
              {!loading && ['aqi', 'humidity', 'wind', 'co2'].includes(predictionType) && (
                <div className="flex-col flex-center h-350 bg-gray-50 rounded-12 p-24 border-dashed-2">
                  <Info size={48} className="text-gray-400 mb-16" />
                  <h3 className="text-xl font-bold text-gray-600">Analysis Data Aggregating</h3>
                  <p className="text-gray-500 text-center max-w-400">
                    Our AI models are currently processing high-resolution {predictionType.toUpperCase()} inputs for this region.
                    Please try "Temperature" or "Rainfall" for immediate historical data.
                  </p>
                </div>
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
                    <p className="text-4xl font-extrabold">{currentInsight.trend || '--'}</p>
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
