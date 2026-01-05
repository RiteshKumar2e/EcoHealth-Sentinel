import React, { useState } from 'react';
import { Pill, AlertTriangle, CheckCircle, User, Calendar, Bell, Shield, Heart, Clock, Search } from 'lucide-react';
import './MedicineRecommendations.css';

export default function MyMedsCare() {
  const [selectedConcern, setSelectedConcern] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const activeMeds = [
    {
      id: 1,
      medicine: 'Atorvastatin 10mg',
      dosage: '1 tablet nightly',
      purpose: 'Cholesterol Management',
      remaining: '12 days left',
      adherence: 98
    },
    {
      id: 2,
      medicine: 'Multivitamin Gold',
      dosage: '1 capsule daily after breakfast',
      purpose: 'General Wellness',
      remaining: '45 days left',
      adherence: 85
    }
  ];

  const careInsights = [
    {
      type: 'optimization',
      title: 'Optimal Timing',
      message: 'You missed your Multivitamin yesterday. Try setting a reminder for 9:00 AM after breakfast.',
      priority: 'high'
    },
    {
      type: 'lifestyle',
      title: 'Hydration Check',
      message: 'Based on your recent higher heart rate, increase water intake to 3L today.',
      priority: 'medium'
    }
  ];

  const carePlans = [
    {
      condition: 'Hypertension Management',
      progress: 65,
      nextStep: 'Morning blood pressure log',
      status: 'In Progress'
    },
    {
      condition: 'Post-Flu Recovery',
      progress: 100,
      nextStep: 'All clear',
      status: 'Completed'
    }
  ];

  const stats = [
    { label: 'Active Meds', value: '2', color: 'text-blue-400' },
    { label: 'Adherence', value: '92%', color: 'text-green-400' },
    { label: 'Refills Due', value: '1', color: 'text-yellow-400' },
    { label: 'Health Score', value: '88', color: 'text-purple-400' }
  ];

  return (
    <div className="medicine-container">
      <div className="medicine-max-width">
        <div className="medicine-header">
          <div className="medicine-header-content">
            <div>
              <h1 className="medicine-title">My Meds & Care Plan</h1>
              <p className="medicine-subtitle">Your personalized regimen and AI-driven health insights</p>
            </div>
            <Heart className="medicine-header-icon" color="#ef4444" />
          </div>
        </div>

        <div className="medicine-stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="medicine-stat-card">
              <p className="medicine-stat-label" style={{ color: '#94a3b8' }}>{stat.label}</p>
              <p className={`medicine-stat-value ${stat.color}`} style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="medicine-main-grid">
          <div className="medicine-form-card">
            <h2 className="medicine-section-title">Current Medications</h2>
            <div className="medicine-recommendations-list">
              {activeMeds.map((med) => (
                <div key={med.id} className="medicine-rec-card">
                  <div className="medicine-rec-header">
                    <div>
                      <h4 className="medicine-rec-name">{med.medicine}</h4>
                      <p className="medicine-rec-condition">{med.purpose}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p className="medicine-rec-confidence-label">Adherence</p>
                      <p className="medicine-rec-confidence-value" style={{ color: '#10b981' }}>{med.adherence}%</p>
                    </div>
                  </div>
                  <div className="medicine-rec-details-grid">
                    <div><p className="medicine-detail-label">Dosage:</p><p className="medicine-detail-value">{med.dosage}</p></div>
                    <div><p className="medicine-detail-label">Status:</p><p className="medicine-detail-value">{med.remaining}</p></div>
                  </div>
                  <button className="medicine-add-btn">Mark as Taken</button>
                </div>
              ))}
            </div>

            <h2 className="medicine-section-title" style={{ marginTop: '30px' }}>Symptom Checker</h2>
            <div className="medicine-form-group">
              <textarea
                placeholder="Describe how you're feeling (e.g., persistent headache for 2 days)..."
                className="medicine-input"
                style={{ minHeight: '100px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', padding: '12px' }}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
              <button className="medicine-submit-btn">Analyze with AI</button>
            </div>
          </div>

          <div className="medicine-insights-container">
            <div className="medicine-insights-card" style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '16px', padding: '20px' }}>
              <h2 className="medicine-section-title">Care Insights</h2>
              {careInsights.map((insight, index) => (
                <div key={index} className={`medicine-insight-item priority-${insight.priority}`} style={{ marginBottom: '12px', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                  <p className="medicine-insight-title" style={{ fontWeight: '600', color: insight.priority === 'high' ? '#ef4444' : '#3b82f6' }}>{insight.title}</p>
                  <p className="medicine-insight-message" style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{insight.message}</p>
                </div>
              ))}
            </div>

            <div className="medicine-reminders-card" style={{ marginTop: '20px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', borderRadius: '16px', padding: '20px', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <Bell size={24} style={{ marginRight: '10px' }} />
                <h3 className="medicine-reminder-title">Up Next</h3>
              </div>
              <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Atorvastatin 10mg</p>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Today at 9:00 PM</p>
              <button style={{ marginTop: '15px', width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: 'white', color: '#2563eb', fontWeight: '600', cursor: 'pointer' }}>Set Reminder</button>
            </div>
          </div>
        </div>

        <div className="medicine-history-card">
          <h2 className="medicine-section-title">My Health Journeys</h2>
          <div className="medicine-history-grid">
            {carePlans.map((plan, index) => (
              <div key={index} className="medicine-history-item">
                <div className="medicine-history-header">
                  <Activity size={20} color="#3b82f6" />
                  <span className={`medicine-status-badge ${plan.status === 'In Progress' ? 'status-active' : 'status-completed'}`}>
                    {plan.status}
                  </span>
                </div>
                <h4 className="medicine-history-name">{plan.condition}</h4>
                <div style={{ marginTop: '10px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${plan.progress}%`, height: '100%', background: '#3b82f6' }} />
                </div>
                <p className="medicine-history-condition" style={{ fontSize: '0.8rem', marginTop: '8px' }}>Next: {plan.nextStep}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}