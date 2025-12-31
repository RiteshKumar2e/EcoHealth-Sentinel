import { useState } from 'react';
import {
  Sprout,
  Cloud,
  Droplets,
  TrendingUp,
  Activity,
  Leaf,
  ArrowRight,
  BarChart3,
  Zap,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './MainAgri.css';

export default function MainAgri() {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const navigate = useNavigate();

  // Go to Agriculture Dashboard (FarmDashboard.jsx)
  const handleGoToDashboard = () => {
    navigate("/agriculture/dashboard");
  };

  // Back to Main Dashboard (auth/MainDashboard.jsx)
  const handleBackToDomains = () => {
    navigate("/auth/mainDashboard");
  };
  const features = [
    {
      id: 'crop-monitoring',
      icon: Activity,
      title: 'Real-time Crop Monitoring',
      description: 'AI-powered surveillance of crop health with satellite imagery and IoT sensors',
      color: '#10b981',
      stats: '95% accuracy'
    },
    {
      id: 'weather-prediction',
      icon: Cloud,
      title: 'Weather Forecasting',
      description: 'Hyperlocal weather predictions to optimize farming schedules and protect crops',
      color: '#3b82f6',
      stats: '7-day forecast'
    },
    {
      id: 'water-management',
      icon: Droplets,
      title: 'Smart Irrigation',
      description: 'Optimize water usage with AI-driven irrigation recommendations',
      color: '#06b6d4',
      stats: '40% water saved'
    },
    {
      id: 'yield-prediction',
      icon: TrendingUp,
      title: 'Yield Prediction',
      description: 'Forecast crop yields using machine learning models and historical data',
      color: '#f59e0b',
      stats: '90% precision'
    },
    {
      id: 'soil-analysis',
      icon: Leaf,
      title: 'Soil Health Analysis',
      description: 'Comprehensive soil testing and nutrient recommendations',
      color: '#8b5cf6',
      stats: '15+ parameters'
    },
    {
      id: 'pest-detection',
      icon: Shield,
      title: 'Pest & Disease Detection',
      description: 'Early detection of pests and diseases using computer vision',
      color: '#ec4899',
      stats: 'Early warning'
    }
  ];

  const benefits = [
    { icon: TrendingUp, text: 'Increase crop yield by up to 30%' },
    { icon: Droplets, text: 'Reduce water consumption by 40%' },
    { icon: Zap, text: 'Optimize resource utilization' },
    { icon: BarChart3, text: 'Data-driven decision making' }
  ];

  return (
    <div className="main-agri-container">
      {/* Animated Background Elements */}
      <div className="blob-1" />
      <div className="blob-2" />

      <div className="content-wrapper">
        {/* Hero Section */}
        <div className="hero-section">
          {/* Icon */}
          <div className="hero-icon-box">
            <Sprout className="hero-icon" />
          </div>

          {/* Title */}
          <h1 className="hero-title">
            Smart Agriculture Solutions
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Revolutionize your farming with AI-powered insights, precision agriculture, and data-driven decision making for sustainable growth
          </p>

          {/* CTA Buttons */}
          <div className="hero-buttons">
            <button
              onClick={handleGoToDashboard}
              className="btn-primary"
            >
              <span>Go to Dashboard</span>
              <ArrowRight style={{ width: '20px', height: '20px' }} />
            </button>

            <button
              onClick={handleBackToDomains}
              className="btn-secondary"
            >
              Back to Domains
            </button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="benefits-grid">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="benefit-card">
              <div className="benefit-icon-box">
                <benefit.icon className="benefit-icon" />
              </div>
              <span className="benefit-text">
                {benefit.text}
              </span>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="features-section">
          <h2 className="features-title">
            Powerful Features for Modern Farming
          </h2>

          <div className="features-grid">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isHovered = hoveredFeature === feature.id;

              return (
                <div
                  key={feature.id}
                  onMouseEnter={() => setHoveredFeature(feature.id)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className="feature-card"
                  style={{
                    border: `2px solid ${isHovered ? feature.color : 'rgba(255, 255, 255, 0.2)'}`,
                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                    boxShadow: isHovered ? `0 20px 40px ${feature.color}33` : 'none'
                  }}
                >
                  <div className="feature-header">
                    <div
                      className="feature-icon-wrapper"
                      style={{
                        backgroundColor: `${feature.color}22`,
                        border: `1px solid ${feature.color}44`
                      }}
                    >
                      <Icon className="feature-icon" style={{ color: feature.color }} />
                    </div>
                    <div
                      className="feature-badge"
                      style={{
                        backgroundColor: `${feature.color}22`,
                        color: feature.color,
                      }}
                    >
                      {feature.stats}
                    </div>
                  </div>

                  <h3 className="feature-card-title">
                    {feature.title}
                  </h3>

                  <p className="feature-description">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action Footer */}
        <div className="footer-cta">
          <h2 className="cta-title">
            Ready to Transform Your Farm?
          </h2>
          <p className="cta-text">
            Join thousands of farmers already using our AI-powered solutions to maximize yields and minimize costs
          </p>
          <button
            onClick={handleGoToDashboard}
            className="btn-cta"
          >
            <span>Get Started Now</span>
            <ArrowRight style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
      </div>
    </div>
  );
}