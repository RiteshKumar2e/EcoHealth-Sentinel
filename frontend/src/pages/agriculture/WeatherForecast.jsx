import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, AlertTriangle, TrendingUp, Shield, Loader, MapPin, X } from 'lucide-react';
import './WeatherForecast.css';

const WeatherForecast = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ city: 'Patna', state: 'Bihar', country: 'IN' });
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [tempLocation, setTempLocation] = useState({ city: 'Patna', state: 'Bihar' });

  // Indian states and major cities
  const indianStates = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati'],
    'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Tezpur'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg'],
    'Delhi': ['New Delhi', 'Delhi'],
    'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    'Haryana': ['Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Karnal'],
    'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Manali', 'Kullu', 'Mandi'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar'],
    'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    'Manipur': ['Imphal', 'Thoubal', 'Bishnupur'],
    'Meghalaya': ['Shillong', 'Tura', 'Jowai'],
    'Mizoram': ['Aizawl', 'Lunglei', 'Champhai'],
    'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri', 'Brahmapur'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
    'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
    'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Meerut'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Nainital', 'Rishikesh'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri']
  };

  // OpenWeatherMap API Key - Replace with your actual API key
  const API_KEY = 'bd5e378503939ddaee76f12ad7a97608'; // Get free key from https://openweathermap.org/api
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  // Fetch weather data from OpenWeatherMap API
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch current weather
        const currentResponse = await fetch(
          `${BASE_URL}/weather?q=${location.city},${location.state},${location.country}&units=metric&appid=${API_KEY}`
        );

        if (!currentResponse.ok) {
          throw new Error('Failed to fetch weather data. Please check your API key.');
        }

        const currentData = await currentResponse.json();

        // Fetch 7-day forecast
        const forecastResponse = await fetch(
          `${BASE_URL}/forecast?q=${location.city},${location.state},${location.country}&units=metric&appid=${API_KEY}`
        );
        const forecastData = await forecastResponse.json();

        // Process current weather
        const processedCurrent = {
          temperature: Math.round(currentData.main.temp),
          feelsLike: Math.round(currentData.main.feels_like),
          humidity: currentData.main.humidity,
          windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
          rainfall: currentData.rain ? currentData.rain['1h'] || 0 : 0,
          condition: currentData.weather[0].main,
          description: currentData.weather[0].description,
          uvIndex: 6, // UV data requires separate API call (One Call API)
          icon: currentData.weather[0].icon,
          pressure: currentData.main.pressure,
          visibility: currentData.visibility / 1000 // Convert to km
        };

        setCurrentWeather(processedCurrent);

        // Process 7-day forecast (group by day and take one reading per day)
        const dailyForecasts = [];
        const processedDays = new Set();

        forecastData.list.forEach((item) => {
          const date = new Date(item.dt * 1000);
          const dayKey = date.toDateString();

          if (!processedDays.has(dayKey) && dailyForecasts.length < 7) {
            processedDays.add(dayKey);
            dailyForecasts.push({
              day: date.toLocaleDateString('en-US', { weekday: 'short' }),
              date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              temp: Math.round(item.main.temp),
              condition: item.weather[0].main,
              description: item.weather[0].description,
              rain: item.pop ? Math.round(item.pop * 100) : 0,
              icon: getLocalIcon(item.weather[0].main),
              humidity: item.main.humidity,
              windSpeed: Math.round(item.wind.speed * 3.6)
            });
          }
        });

        setForecast(dailyForecasts);

        // Generate AI-based alerts based on weather data
        const generatedAlerts = generateAlerts(processedCurrent, dailyForecasts);
        setAlerts(generatedAlerts);

        // Generate AI recommendations
        const generatedRecs = generateRecommendations(processedCurrent, dailyForecasts);
        setRecommendations(generatedRecs);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWeatherData();

    // Refresh data every 10 minutes
    const interval = setInterval(fetchWeatherData, 600000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Convert OpenWeather condition to local icon type
  const getLocalIcon = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear') || conditionLower.includes('sun')) return 'sun';
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return 'rain';
    return 'cloud';
  };

  // Generate smart alerts based on weather conditions
  const generateAlerts = (current, forecast) => {
    const alerts = [];

    // Check for heavy rain in forecast
    const rainyDays = forecast.filter(day => day.rain > 50);
    if (rainyDays.length > 0) {
      alerts.push({
        type: 'warning',
        title: 'Heavy Rainfall Expected',
        message: `Plan to complete irrigation before ${rainyDays[0].day}. Expected rainfall probability: ${rainyDays[0].rain}%`,
        action: 'Reduce irrigation by 50%',
        severity: 'medium'
      });
    }

    // Check for high temperature
    const hotDays = forecast.filter(day => day.temp > 32);
    if (hotDays.length > 0) {
      alerts.push({
        type: 'warning',
        title: 'High Temperature Alert',
        message: 'Increased water requirements for crops. Monitor soil moisture closely.',
        action: 'Increase irrigation frequency',
        severity: 'medium'
      });
    }

    // Check for good weather window
    const clearDays = forecast.filter(day => day.rain < 20 && day.temp < 30);
    if (clearDays.length >= 3) {
      alerts.push({
        type: 'info',
        title: 'Optimal Harvesting Window',
        message: 'Clear weather expected. Ideal conditions for harvesting and field operations.',
        action: `Schedule harvest for ${clearDays[0].day}-${clearDays[2].day}`,
        severity: 'low'
      });
    }

    // Check for high humidity
    if (current && current.humidity > 80) {
      alerts.push({
        type: 'warning',
        title: 'High Humidity Alert',
        message: 'Increased risk of fungal diseases. Monitor crops closely.',
        action: 'Apply preventive fungicide',
        severity: 'high'
      });
    }

    return alerts.length > 0 ? alerts : [{
      type: 'info',
      title: 'Normal Conditions',
      message: 'Weather conditions are stable. Continue regular farm operations.',
      action: 'Maintain routine schedule',
      severity: 'low'
    }];
  };

  // Generate AI-powered farming recommendations
  const generateRecommendations = (current, forecast) => {
    const recs = [];

    // Irrigation recommendation
    const upcomingRain = forecast.slice(0, 3).some(day => day.rain > 40);
    if (upcomingRain) {
      recs.push({
        title: 'Irrigation',
        advice: 'Pause irrigation for 48-72 hours due to expected rainfall',
        impact: 'Save 300-500L of water',
        icon: Droplets
      });
    } else if (current && current.humidity < 40) {
      recs.push({
        title: 'Irrigation',
        advice: 'Increase irrigation frequency due to low humidity and dry conditions',
        impact: 'Maintain optimal soil moisture',
        icon: Droplets
      });
    } else {
      recs.push({
        title: 'Irrigation',
        advice: 'Continue regular irrigation schedule',
        impact: 'Optimal water usage',
        icon: Droplets
      });
    }

    // Pest control recommendation
    if (current && (current.humidity > 70 || upcomingRain)) {
      recs.push({
        title: 'Pest Control',
        advice: 'Apply organic pest spray before rainfall to prevent fungal growth and pest attacks',
        impact: 'Prevent 30-40% crop damage',
        icon: Shield
      });
    } else {
      recs.push({
        title: 'Pest Control',
        advice: 'Regular monitoring recommended. No immediate action needed.',
        impact: 'Maintain crop health',
        icon: Shield
      });
    }

    // Harvesting recommendation
    const goodHarvestDays = forecast.filter(day => day.rain < 20 && day.temp > 20 && day.temp < 32);
    if (goodHarvestDays.length >= 2) {
      recs.push({
        title: 'Harvesting',
        advice: `Ideal harvesting window: ${goodHarvestDays[0].day} to ${goodHarvestDays[1].day}. Clear and dry conditions.`,
        impact: 'Maximize crop quality',
        icon: TrendingUp
      });
    } else {
      recs.push({
        title: 'Harvesting',
        advice: 'Wait for better weather conditions before harvesting',
        impact: 'Preserve crop quality',
        icon: TrendingUp
      });
    }

    return recs;
  };

  const handleLocationChange = () => {
    setLocation({ ...tempLocation, country: 'IN' });
    setShowLocationModal(false);
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setTempLocation({
      state: newState,
      city: indianStates[newState]?.[0] || ''
    });
  };

  const getWeatherIcon = (icon) => {
    switch (icon) {
      case 'sun': return <Sun style={{ width: '40px', height: '40px', color: '#eab308' }} />;
      case 'cloud': return <Cloud style={{ width: '40px', height: '40px', color: '#6b7280' }} />;
      case 'rain': return <CloudRain style={{ width: '40px', height: '40px', color: '#3b82f6' }} />;
      default: return <Cloud style={{ width: '40px', height: '40px', color: '#6b7280' }} />;
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'high': return { border: '#ef4444', bg: '#fef2f2' };
      case 'medium': return { border: '#f97316', bg: '#fff7ed' };
      case 'low': return { border: '#3b82f6', bg: '#eff6ff' };
      default: return { border: '#6b7280', bg: '#f9fafb' };
    }
  };

  if (loading) {
    return (
      <div className="weather-container">
        <div className="weather-content-wrapper">
          <div className="weather-card">
            <div className="loading-box">
              <Loader className="spin-anim" style={{ width: '48px', height: '48px', color: '#3b82f6' }} />
              <p style={{ fontSize: '18px', color: '#374151', fontWeight: 600 }}>Loading weather data...</p>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Fetching real-time data from OpenWeatherMap</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-container">
        <div className="weather-content-wrapper">
          <div className="error-box">
            <AlertTriangle style={{ width: '48px', height: '48px', color: '#ef4444', margin: '0 auto 16px' }} />
            <h2 style={{ color: '#991b1b', marginBottom: '8px' }}>Error Loading Weather Data</h2>
            <p style={{ color: '#7f1d1d', marginBottom: '16px' }}>{error}</p>
            <p style={{ fontSize: '14px', color: '#991b1b' }}>
              Please ensure you have a valid OpenWeatherMap API key.<br />
              Get a free key at: <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>openweathermap.org/api</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-container">
      {/* Background Blobs */}
      <div className="weather-blob blob-1"></div>
      <div className="weather-blob blob-2"></div>
      <div className="weather-blob blob-3"></div>

      <div className="weather-content-wrapper">
        {/* Header */}
        <div className="weather-card">
          <div className="weather-header">
            <div className="header-left">
              <div className="icon-glow-container">
                <div className="icon-glow-inner"></div>
                <Cloud style={{ width: '32px', height: '32px', color: '#2563eb', position: 'relative', zIndex: 10 }} />
              </div>
              <div>
                <h1 className="weather-title">Weather Forecast</h1>
                <p className="weather-subtitle">AI-powered predictions for smart farming</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <button
                className="location-btn"
                onClick={() => setShowLocationModal(true)}
              >
                <MapPin style={{ width: '14px', height: '14px' }} />
                {location.city}, {location.state}
              </button>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>Updated just now</p>
            </div>
          </div>
        </div>

        {/* Current Weather */}
        {currentWeather && (
          <div className="current-weather-main">
            <div className="current-overlay"></div>
            <div className="weather-grid grid-md-2" style={{ position: 'relative', zIndex: 10 }}>
              <div>
                <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Current Weather</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div className="temp-display">{currentWeather.temperature}°C</div>
                  <Cloud style={{ width: '64px', height: '64px' }} />
                </div>
                <p style={{ fontSize: '20px', marginBottom: '8px', margin: 0, textTransform: 'capitalize' }}>{currentWeather.description}</p>
                <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>Feels like {currentWeather.feelsLike}°C</p>
              </div>

              <div className="weather-grid weather-grid-2">
                <div className="weather-stat-card">
                  <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Humidity</p>
                  <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{currentWeather.humidity}%</p>
                  <Droplets style={{ width: '16px', height: '16px', opacity: 0.8 }} />
                </div>
                <div className="weather-stat-card">
                  <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Wind</p>
                  <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{currentWeather.windSpeed} km/h</p>
                  <Wind style={{ width: '16px', height: '16px', opacity: 0.8 }} />
                </div>
                <div className="weather-stat-card">
                  <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Visibility</p>
                  <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{currentWeather.visibility} km</p>
                  <Sun style={{ width: '16px', height: '16px', opacity: 0.8 }} />
                </div>
                <div className="weather-stat-card">
                  <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Rainfall</p>
                  <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{currentWeather.rainfall} mm</p>
                  <CloudRain style={{ width: '16px', height: '16px', opacity: 0.8 }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="weather-grid grid-md-3">
          {/* 7-Day Forecast */}
          <div className="weather-card" style={{ gridColumn: 'span 2' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
              7-Day Forecast
            </h2>
            <div className="weather-grid grid-md-7" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))' }}>
              {forecast.map((day, index) => (
                <div key={index} className="forecast-card">
                  <p style={{ fontWeight: 600, color: '#374151', fontSize: '14px', marginBottom: '8px' }}>{day.day}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>{day.date}</p>
                  <div style={{ margin: '8px 0' }}>
                    {getWeatherIcon(day.icon)}
                  </div>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '4px 0' }}>{day.temp}°</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '12px', color: '#4b5563' }}>
                    <Droplets style={{ width: '10px', height: '10px' }} />
                    {day.rain}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Alerts */}
          <div className="weather-card">
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1f2937' }}>
              <AlertTriangle style={{ width: '20px', height: '20px', color: '#ea580c' }} />
              Smart Alerts
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {alerts.map((alert, index) => {
                const colors = getAlertColor(alert.severity);
                return (
                  <div
                    key={index}
                    className="alert-card"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.bg
                    }}
                  >
                    <p style={{ fontWeight: 'bold', color: '#374151', fontSize: '14px', marginBottom: '4px' }}>
                      {alert.title}
                    </p>
                    <p style={{ fontSize: '13px', color: '#4b5563', marginBottom: '8px', lineHeight: '1.4' }}>
                      {alert.message}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#ea580c', fontWeight: 600 }}>
                      <TrendingUp style={{ width: '12px', height: '12px' }} />
                      Action: {alert.action}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div style={{ marginTop: '24px' }} className="weather-card">
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1f2937' }}>
            <Shield style={{ width: '24px', height: '24px', color: '#059669' }} />
            AI Farming Recommendations
          </h2>
          <div className="weather-grid grid-md-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="rec-card"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div className="icon-box-rec">
                    <rec.icon style={{ width: '20px', height: '20px', color: '#059669' }} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    {rec.title}
                  </h3>
                </div>
                <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '12px', lineHeight: '1.5' }}>
                  {rec.advice}
                </p>
                <div style={{ fontSize: '13px', color: '#059669', fontWeight: 600, paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                  Impact: {rec.impact}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Features Highlight */}
        <div className="ai-feature-card">
          <div className="weather-grid grid-md-2" style={{ alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>
                Powered by Advanced AI
              </h2>
              <p style={{ opacity: 0.9, lineHeight: '1.6', marginBottom: '24px' }}>
                Our system analyzes satellite data, historical patterns, and real-time sensors to provide hyper-local forecasts tailored for your farm.
              </p>
              <button style={{
                padding: '10px 20px',
                background: 'white',
                color: '#2563eb',
                borderRadius: '8px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer'
              }}>
                Learn More
              </button>
            </div>
            <div className="weather-grid weather-grid-2">
              <div className="ai-stat-card">
                <p style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '4px', margin: 0 }}>94%</p>
                <p style={{ fontSize: '12px', opacity: 0.9 }}>Forecast Accuracy</p>
              </div>
              <div className="ai-stat-card">
                <p style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '4px', margin: 0 }}>24/7</p>
                <p style={{ fontSize: '12px', opacity: 0.9 }}>Real-time Monitoring</p>
              </div>
              <div className="ai-stat-card">
                <p style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '4px', margin: 0 }}>15+</p>
                <p style={{ fontSize: '12px', opacity: 0.9 }}>Data Parameters</p>
              </div>
              <div className="ai-stat-card">
                <p style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '4px', margin: 0 }}>30%</p>
                <p style={{ fontSize: '12px', opacity: 0.9 }}>Water Saved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="location-modal-overlay">
          <div className="location-modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Select Location</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowLocationModal(false)}
              >
                <X style={{ width: '24px', height: '24px' }} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <select
                className="form-select"
                value={tempLocation.state}
                onChange={handleStateChange}
              >
                {Object.keys(indianStates).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">City / District</label>
              <select
                className="form-select"
                value={tempLocation.city}
                onChange={(e) => setTempLocation({ ...tempLocation, city: e.target.value })}
              >
                {indianStates[tempLocation.state]?.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <button
              className="modal-submit-btn"
              onClick={handleLocationChange}
            >
              Update Location
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;