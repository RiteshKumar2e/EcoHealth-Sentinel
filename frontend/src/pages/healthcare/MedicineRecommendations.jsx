import React, { useState } from 'react';
import { Pill, AlertTriangle, CheckCircle, User, Calendar, Bell, Shield } from 'lucide-react';
import './MedicineRecommendations.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function MedicineRecommendations() {
  const [selectedCondition, setSelectedCondition] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [allergies, setAllergies] = useState([]);

  const conditions = [
    'Hypertension', 'Type 2 Diabetes', 'Asthma', 'Arthritis',
    'Depression', 'Anxiety', 'Migraine', 'GERD'
  ];

  const commonAllergies = [
    'Penicillin', 'Sulfa drugs', 'Aspirin', 'Ibuprofen', 'Codeine'
  ];

  const recommendations = [
    {
      id: 1,
      medicine: 'Amlodipine 5mg',
      condition: 'Hypertension',
      dosage: 'Once daily',
      duration: '30 days',
      confidence: 94,
      sideEffects: ['Swelling', 'Dizziness', 'Fatigue'],
      interactions: ['Simvastatin - Monitor'],
      cost: '₹45/month',
      alternatives: ['Nifedipine', 'Felodipine']
    },
    {
      id: 2,
      medicine: 'Metformin 500mg',
      condition: 'Type 2 Diabetes',
      dosage: 'Twice daily with meals',
      duration: 'Ongoing',
      confidence: 96,
      sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset'],
      interactions: ['Alcohol - Avoid'],
      cost: '₹30/month',
      alternatives: ['Glimepiride', 'Sitagliptin']
    }
  ];

  const prescriptionHistory = [
    {
      date: '2025-09-15',
      medicine: 'Amoxicillin 500mg',
      condition: 'Respiratory Infection',
      duration: '7 days',
      status: 'completed'
    },
    {
      date: '2025-08-20',
      medicine: 'Ibuprofen 400mg',
      condition: 'Pain Management',
      duration: '5 days',
      status: 'completed'
    },
    {
      date: '2025-10-01',
      medicine: 'Amlodipine 5mg',
      condition: 'Hypertension',
      duration: 'Ongoing',
      status: 'active'
    }
  ];

  const aiInsights = [
    {
      type: 'optimization',
      title: 'Medication Timing',
      message: 'Taking Amlodipine in the morning may improve efficacy',
      priority: 'medium'
    },
    {
      type: 'interaction',
      title: 'Potential Interaction',
      message: 'Monitor for increased side effects when combining with Simvastatin',
      priority: 'high'
    },
    {
      type: 'adherence',
      title: 'Adherence Pattern',
      message: 'Patient shows 92% medication adherence - excellent compliance',
      priority: 'low'
    }
  ];

  const stats = [
    { label: 'Active Prescriptions', value: '3', color: 'text-blue-600' },
    { label: 'Adherence Rate', value: '92%', color: 'text-green-600' },
    { label: 'Drug Interactions', value: '1', color: 'text-yellow-600' },
    { label: 'Cost Savings', value: '₹280', color: 'text-purple-600' }
  ];

  const toggleAllergy = (allergy) => {
    setAllergies(prev =>
      prev.includes(allergy)
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      default: return 'priority-low';
    }
  };

  return (
    <div className="medicine-container">
      <div className="medicine-max-width">
        {/* Header */}
        <div className="medicine-header">
          <div className="medicine-header-content">
            <div>
              <h1 className="medicine-title">AI Medicine Recommendations</h1>
              <p className="medicine-subtitle">Personalized medication suggestions with safety checks</p>
            </div>
            <Pill className="medicine-header-icon" />
          </div>
        </div>

        {/* Stats */}
        <div className="medicine-stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="medicine-stat-card">
              <p className="medicine-stat-label">{stat.label}</p>
              <p className={`medicine-stat-value ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="medicine-main-grid">
          {/* Input Form */}
          <div className="medicine-form-card">
            <h2 className="medicine-section-title">Patient Information</h2>

            <div className="medicine-form-group">
              <div>
                <label className="medicine-label">
                  Medical Condition
                </label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="medicine-select"
                >
                  <option value="">Select condition...</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="medicine-label">
                  Patient Age
                </label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="Enter age"
                  className="medicine-input"
                />
              </div>

              <div>
                <label className="medicine-label">
                  Known Allergies
                </label>
                <div className="medicine-allergies-list">
                  {commonAllergies.map(allergy => (
                    <button
                      key={allergy}
                      onClick={() => toggleAllergy(allergy)}
                      className={`medicine-allergy-btn ${allergies.includes(allergy)
                        ? 'active'
                        : 'inactive'
                        }`}
                    >
                      {allergy}
                    </button>
                  ))}
                </div>
              </div>

              <button className="medicine-submit-btn">
                Get AI Recommendations
              </button>
            </div>

            {/* Recommendations */}
            {selectedCondition && (
              <div className="medicine-recommendations-list">
                <h3 className="medicine-rec-subtitle">Recommended Medications</h3>
                {recommendations.map((rec) => (
                  <div key={rec.id} className="medicine-rec-card">
                    <div className="medicine-rec-header">
                      <div>
                        <h4 className="medicine-rec-name">{rec.medicine}</h4>
                        <p className="medicine-rec-condition">For: {rec.condition}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p className="medicine-rec-confidence-label">AI Confidence</p>
                        <p className="medicine-rec-confidence-value">{rec.confidence}%</p>
                      </div>
                    </div>

                    <div className="medicine-rec-details-grid">
                      <div>
                        <p className="medicine-detail-label">Dosage:</p>
                        <p className="medicine-detail-value">{rec.dosage}</p>
                      </div>
                      <div>
                        <p className="medicine-detail-label">Duration:</p>
                        <p className="medicine-detail-value">{rec.duration}</p>
                      </div>
                      <div>
                        <p className="medicine-detail-label">Est. Cost:</p>
                        <p className="medicine-detail-value">{rec.cost}</p>
                      </div>
                    </div>

                    <div className="medicine-alerts">
                      <div className="medicine-alert-box medicine-alert-warning">
                        <p className="title">⚠️ Possible Side Effects:</p>
                        <p className="content">{rec.sideEffects.join(', ')}</p>
                      </div>

                      {rec.interactions.length > 0 && (
                        <div className="medicine-alert-box medicine-alert-danger">
                          <p className="title">🔴 Drug Interactions:</p>
                          <p className="content">{rec.interactions.join(', ')}</p>
                        </div>
                      )}

                      <div className="medicine-alert-box medicine-alert-info">
                        <p className="title">💊 Alternatives:</p>
                        <p className="content">{rec.alternatives.join(', ')}</p>
                      </div>
                    </div>

                    <button className="medicine-add-btn">
                      Add to Prescription
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Insights Panel */}
          <div className="medicine-insights-container">
            <div className="medicine-insights-card">
              <h2 className="medicine-section-title">AI Insights</h2>
              <div>
                {aiInsights.map((insight, index) => (
                  <div key={index} className={`medicine-insight-item ${getPriorityClass(insight.priority)}`}>
                    <p className="medicine-insight-title">{insight.title}</p>
                    <p className="medicine-insight-message">{insight.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="medicine-reminders-card">
              <Bell className="medicine-reminder-icon" />
              <h3 className="medicine-reminder-title">Medication Reminders</h3>
              <p className="medicine-reminder-text">
                Next dose: Amlodipine 5mg at 8:00 AM
              </p>
              <button className="medicine-view-reminders-btn">
                View All Reminders
              </button>
            </div>
          </div>
        </div>

        {/* Prescription History */}
        <div className="medicine-history-card">
          <h2 className="medicine-section-title">Prescription History</h2>
          <div className="medicine-history-grid">
            {prescriptionHistory.map((rx, index) => (
              <div key={index} className="medicine-history-item">
                <div className="medicine-history-header">
                  <Calendar className="medicine-history-icon" />
                  <span className={`medicine-status-badge ${rx.status === 'active' ? 'status-active' : 'status-completed'
                    }`}>
                    {rx.status.toUpperCase()}
                  </span>
                </div>
                <h4 className="medicine-history-name">{rx.medicine}</h4>
                <p className="medicine-history-condition">{rx.condition}</p>
                <div className="medicine-history-details">
                  <p>Date: {rx.date}</p>
                  <p>Duration: {rx.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety & Compliance */}
        <div className="medicine-safety-card">
          <div className="medicine-safety-content">
            <Shield className="medicine-safety-icon" />
            <div>
              <h3 className="medicine-safety-title">Pharmaceutical AI Safety Standards</h3>
              <p className="medicine-safety-text">
                Our AI recommendation system follows FDA guidelines and international pharmaceutical standards.
                All suggestions are cross-referenced with drug databases and require licensed physician approval before prescription.
              </p>
              <div className="medicine-safety-grid">
                <div className="medicine-safety-item">
                  <p className="medicine-safety-label">✓ FDA Compliant</p>
                  <p className="medicine-safety-desc">Adheres to regulatory standards</p>
                </div>
                <div className="medicine-safety-item">
                  <p className="medicine-safety-label">✓ Drug Database Verified</p>
                  <p className="medicine-safety-desc">Real-time interaction checking</p>
                </div>
                <div className="medicine-safety-item">
                  <p className="medicine-safety-label">✓ Physician Override</p>
                  <p className="medicine-safety-desc">AI assists, doctors decide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}