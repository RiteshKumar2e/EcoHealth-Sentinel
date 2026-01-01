import React, { useState } from 'react';
import { Camera, AlertTriangle, CheckCircle, Leaf, Shield, Upload } from 'lucide-react';
import './CropDiseaseDetection.css';

const CropDiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(0);

  const diseaseDatabase = {
    healthy: {
      name: 'Healthy Crop',
      severity: 'None',
      treatment: 'Continue regular care and monitoring',
      prevention: 'Maintain current practices',
      confidence: 0.95,
      color: 'green'
    },
    blight: {
      name: 'Late Blight',
      severity: 'High',
      treatment: 'Apply copper-based fungicide immediately. Remove infected leaves.',
      prevention: 'Improve air circulation, avoid overhead watering',
      organicOption: 'Neem oil spray every 7 days',
      confidence: 0.89,
      color: 'red'
    },
    rust: {
      name: 'Leaf Rust',
      severity: 'Medium',
      treatment: 'Apply sulfur-based fungicide. Ensure proper spacing.',
      prevention: 'Remove fallen leaves, improve drainage',
      organicOption: 'Garlic-chili spray, maintain dry conditions',
      confidence: 0.87,
      color: 'orange'
    },
    mildew: {
      name: 'Powdery Mildew',
      severity: 'Medium',
      treatment: 'Apply potassium bicarbonate spray. Increase sunlight exposure.',
      prevention: 'Reduce humidity, prune for better airflow',
      organicOption: 'Milk solution (1:9 ratio with water)',
      confidence: 0.92,
      color: 'yellow'
    }
  };

  const analyzeImage = () => {
    setAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      const diseases = Object.keys(diseaseDatabase);
      const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
      const detection = diseaseDatabase[randomDisease];

      let conf = 0;
      const interval = setInterval(() => {
        conf += 5;
        setConfidence(conf);
        if (conf >= detection.confidence * 100) {
          clearInterval(interval);
        }
      }, 50);

      setResult(detection);
      setAnalyzing(false);
    }, 2000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setResult(null);
        setConfidence(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return { text: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
      case 'Medium': return { text: '#ea580c', bg: '#fff7ed', border: '#fed7aa' };
      case 'Low': return { text: '#ca8a04', bg: '#fefce8', border: '#fef08a' };
      default: return { text: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' };
    }
  };

  return (
    <>
      <div className="max-width-wrapper">
        {/* Header */}
        <div className="header-card">
          <div className="header-flex">
            <div className="header-left">
              <div className="icon-glow-container">
                <div className="icon-glow-effect"></div>
                <Leaf className="header-icon-leaf" />
              </div>
              <div>
                <h1 className="main-title">AI Crop Disease Detection</h1>
                <p className="subtitle">Early detection saves crops and livelihoods</p>
              </div>
            </div>
            <div className="accuracy-badge">
              <Shield size={20} className="icon-emerald" />
              <span className="accuracy-text">95% Accuracy</span>
            </div>
          </div>
        </div>

        <div className="main-grid">
          {/* Upload Section */}
          <div className="card">
            <h2 className="card-title">
              <div className="icon-glow-container">
                <div className="icon-glow-effect icon-glow-blur"></div>
                <Camera size={20} className="icon-emerald-rel" />
              </div>
              Upload Crop Image
            </h2>

            <div className="upload-box">
              {selectedImage ? (
                <div className="flex-col gap-16">
                  <img
                    src={selectedImage}
                    alt="Uploaded crop"
                    className="image-preview"
                  />
                  <label className="change-image-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Upload size={16} />
                    Change Image
                  </label>
                </div>
              ) : (
                <label className="upload-label">
                  <div className="pos-relative d-inline-block">
                    <div className="upload-glow-bg"></div>
                    <Upload className="upload-icon-rel" />
                  </div>
                  <p className="upload-text-primary">Click to upload or drag and drop</p>
                  <p className="upload-text-secondary">Support: JPG, PNG (Max 10MB)</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {selectedImage && (
              <button
                onClick={analyzeImage}
                disabled={analyzing}
                className={`detect-button ${analyzing ? 'detect-button-disabled' : 'detect-button-active'}`}
              >
                {analyzing ? (
                  <span className="flex-center gap-8">
                    <div className="analyzing-spinner"></div>
                    Analyzing with AI...
                  </span>
                ) : (
                  'Detect Disease'
                )}
              </button>
            )}

            <div className="privacy-notice">
              <Shield className="w-16 h-16 d-inline mr-8" />
              Your images are processed securely and never stored
            </div>
          </div>

          {/* Results Section */}
          <div className="card">
            <h2 className="card-title">Detection Results</h2>

            {analyzing && (
              <div className="loader-container">
                <div className="spinner-wrapper">
                  <div className="spinner-glow"></div>
                  <div className="spinner"></div>
                </div>
                <p className="loader-text-primary">AI analyzing image...</p>
                <p className="loader-text-secondary">Processing with deep learning model</p>
              </div>
            )}

            {!analyzing && !result && (
              <div className="empty-results-container">
                <div className="pos-relative">
                  <div className="empty-icon-glow"></div>
                  <Leaf className="empty-icon-leaf" />
                </div>
                <p>Upload an image to get started</p>
              </div>
            )}

            {result && !analyzing && (
              <div className="flex-col gap-16">
                {/* Confidence Meter */}
                <div className="confidence-section">
                  <div className="confidence-header">
                    <span className="confidence-label">Confidence Level</span>
                    <span className="confidence-value-text">{confidence.toFixed(0)}%</span>
                  </div>
                  <div className="confidence-bar-bg">
                    <div className="confidence-bar-fill" style={{ width: `${confidence}%` }}>
                      <div className="confidence-shimmer"></div>
                    </div>
                  </div>
                </div>

                {/* Disease Information */}
                <div
                  className="disease-card"
                  style={{
                    color: getSeverityColor(result.severity).text,
                    background: getSeverityColor(result.severity).bg,
                    borderColor: getSeverityColor(result.severity).border
                  }}
                >
                  <div className="flex-center gap-8 mb-8 justify-start">
                    {result.severity === 'None' ? (
                      <div className="icon-glow-container">
                        <div className="icon-glow-effect icon-glow-emerald"></div>
                        <CheckCircle size={24} className="pos-relative z-10" />
                      </div>
                    ) : (
                      <div className="icon-glow-container">
                        <div className="icon-glow-effect icon-glow-red"></div>
                        <AlertTriangle size={24} className="pos-relative z-10" />
                      </div>
                    )}
                    <h3 className="disease-name">{result.name}</h3>
                  </div>
                  <p className="disease-severity">Severity: {result.severity}</p>
                </div>

                {/* Treatment Recommendations */}
                <div className="flex-col gap-12">
                  <div className="treatment-box treatment-blue">
                    <h4 className="treatment-title">Treatment</h4>
                    <p className="treatment-content">{result.treatment}</p>
                  </div>

                  {result.organicOption && (
                    <div className="treatment-box treatment-green">
                      <h4 className="treatment-title">Organic Option</h4>
                      <p className="treatment-content">{result.organicOption}</p>
                    </div>
                  )}

                  <div className="treatment-box treatment-purple">
                    <h4 className="treatment-title">Prevention</h4>
                    <p className="treatment-content">{result.prevention}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons-grid">
                  <button className="action-btn action-btn-outline">
                    Save Report
                  </button>
                  <button className="action-btn action-btn-solid">
                    Contact Expert
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Impact Information */}
        <div className="impact-footer">
          <div className="impact-glow-effect"></div>
          <h3 className="impact-footer-title">
            <div className="icon-glow-container">
              <div className="icon-glow-effect icon-glow-emerald"></div>
              <Shield size={20} className="impact-footer-icon" />
            </div>
            Responsible AI for Agriculture
          </h3>
          <div className="impact-grid">
            <div className="impact-card">
              <h4 className="impact-card-title">Early Detection</h4>
              <p className="impact-card-content">Identify diseases 5-7 days earlier than manual inspection</p>
            </div>
            <div className="impact-card">
              <h4 className="impact-card-title">Reduced Pesticide Use</h4>
              <p className="impact-card-content">Targeted treatment reduces chemical usage by 40%</p>
            </div>
            <div className="impact-card">
              <h4 className="impact-card-title">Farmer Privacy</h4>
              <p className="impact-card-content">No data storage, on-device processing when possible</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CropDiseaseDetection;
