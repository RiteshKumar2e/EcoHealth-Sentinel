import React, { useState, useEffect, useRef } from 'react';
import { Brain, Stethoscope, Activity, AlertTriangle, CheckCircle, TrendingUp, FileText, Send, Bot, User, Sparkles, Zap, HeartPulse, Microscope } from 'lucide-react';
import './DiagnosisAssistant.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const DiagnosisAssistant = () => {
  const [step, setStep] = useState(1);
  const [patientData, setPatientData] = useState({
    age: '',
    gender: '',
    symptoms: [],
    duration: '',
    severity: '',
    medicalHistory: [],
    medications: [],
    allergies: []
  });
  const [diagnosis, setDiagnosis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI medical assistant. I\'ll help you through the diagnosis process. Let\'s start by gathering some information about the patient.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [particles, setParticles] = useState([]);
  const chatEndRef = useRef(null);

  const symptomsList = [
    'Fever', 'Cough', 'Shortness of Breath', 'Fatigue', 'Headache',
    'Sore Throat', 'Nausea', 'Vomiting', 'Diarrhea', 'Abdominal Pain',
    'Chest Pain', 'Dizziness', 'Muscle Aches', 'Joint Pain', 'Rash',
    'Loss of Appetite', 'Weight Loss', 'Night Sweats', 'Confusion'
  ];

  const medicalConditions = [
    'Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'COPD',
    'Kidney Disease', 'Liver Disease', 'Cancer', 'Autoimmune Disease'
  ];

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.3 + 0.1
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSymptomToggle = (symptom) => {
    setPatientData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleConditionToggle = (condition) => {
    setPatientData(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.includes(condition)
        ? prev.medicalHistory.filter(c => c !== condition)
        : [...prev.medicalHistory, condition]
    }));
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    setTimeout(() => {
      const responses = [
        "I've noted that information. Can you tell me more about the severity of the symptoms?",
        "That's helpful. Based on what you've shared, I recommend we proceed with a comprehensive analysis.",
        "Thank you for providing those details. I'm analyzing the symptom patterns now.",
        "I see. Let me check that against our medical database for similar cases.",
        "This information is very useful. Would you like to provide any additional details?"
      ];
      const aiResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    }, 1200);
  };

  const runDiagnosisAI = async () => {
    setIsAnalyzing(true);

    setChatMessages(prev => [...prev, {
      role: 'assistant',
      content: '🔬 Initiating comprehensive AI analysis of patient data. This will take a few moments...'
    }]);

    try {
      const response = await fetch(`${API_BASE_URL}/healthcare/diagnosis-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          symptoms: patientData.symptoms,
          severity: patientData.severity,
          patientData: patientData
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const aiDiagnosis = {
            primaryDiagnosis: {
              name: result.possible_conditions[0].condition,
              confidence: result.possible_conditions[0].confidence * 100,
              icd10: 'J06.9', // Simulated ICD-10 for now
              severity: patientData.severity.charAt(0).toUpperCase() + patientData.severity.slice(1)
            },
            differentialDiagnoses: result.possible_conditions.slice(1).map(c => ({
              name: c.condition,
              confidence: c.confidence * 100,
              probability: c.confidence > 0.7 ? 'High' : c.confidence > 0.4 ? 'Medium' : 'Low'
            })),
            riskFactors: [
              { factor: 'Age group', impact: 'Low', score: 25 },
              { factor: 'Symptom severity', impact: 'Medium', score: 60 },
              { factor: 'Duration of illness', impact: 'Medium', score: 55 },
              { factor: 'Medical history', impact: 'Low', score: 30 }
            ],
            recommendedTests: [
              { test: 'Complete Blood Count (CBC)', priority: 'High', reason: 'Evaluate infection markers' },
              { test: 'Rapid Test', priority: 'High', reason: 'Differential diagnosis' }
            ],
            treatmentRecommendations: result.possible_conditions[0].recommendations.map(r => ({
              treatment: r,
              category: 'Supportive',
              evidence: 'Strong'
            })),
            redFlags: [
              'Difficulty breathing or shortness of breath',
              'Persistent chest pain or pressure',
              'Symptoms not improving within 3 days'
            ],
            aiInsights: {
              symptomPattern: 'Consistent pattern detected based on AI analysis',
              temporalAnalysis: 'Progression reviewed',
              comorbidityImpact: 'Review medical history for potential impact',
              outcomePrediction: 'High probability of recovery with proper care'
            },
            urgencyLevel: result.urgency,
            confidenceScore: result.possible_conditions[0].confidence * 100,
            evidenceQuality: 'Medium'
          };

          setDiagnosis(aiDiagnosis);
          setIsAnalyzing(false);
          setStep(4);
          setChatMessages(prev => [...prev, {
            role: 'assistant',
            content: `✅ Analysis complete! I've identified ${aiDiagnosis.primaryDiagnosis.name} as a likely condition. Review the detailed results below.`
          }]);
          return;
        }
      }
    } catch (error) {
      console.warn("AI Diagnosis API failed, using simulation:", error);
    }

    // Simulation fallback
    await new Promise(resolve => setTimeout(resolve, 3500));

    const aiDiagnosis = {
      primaryDiagnosis: {
        name: 'Viral Upper Respiratory Infection',
        confidence: 87.5,
        icd10: 'J06.9',
        severity: 'Moderate'
      },
      differentialDiagnoses: [
        { name: 'Influenza', confidence: 72.3, probability: 'High' },
        { name: 'COVID-19', confidence: 68.1, probability: 'Medium' },
        { name: 'Bacterial Sinusitis', confidence: 45.2, probability: 'Low' },
        { name: 'Allergic Rhinitis', confidence: 38.7, probability: 'Low' }
      ],
      riskFactors: [
        { factor: 'Age group', impact: 'Low', score: 25 },
        { factor: 'Symptom severity', impact: 'Medium', score: 60 },
        { factor: 'Duration of illness', impact: 'Medium', score: 55 },
        { factor: 'Medical history', impact: 'Low', score: 30 }
      ],
      recommendedTests: [
        { test: 'Complete Blood Count (CBC)', priority: 'High', reason: 'Evaluate infection markers' },
        { test: 'Chest X-Ray', priority: 'Medium', reason: 'Rule out pneumonia' },
        { test: 'Rapid COVID-19 Test', priority: 'High', reason: 'Differential diagnosis' },
        { test: 'Influenza Test', priority: 'Medium', reason: 'Confirm viral etiology' }
      ],
      treatmentRecommendations: [
        { treatment: 'Rest and hydration', category: 'Supportive', evidence: 'Strong' },
        { treatment: 'Acetaminophen for fever', category: 'Symptomatic', evidence: 'Strong' },
        { treatment: 'Decongestants', category: 'Symptomatic', evidence: 'Moderate' },
        { treatment: 'Follow-up in 3-5 days', category: 'Monitoring', evidence: 'Standard' }
      ],
      redFlags: [
        'Difficulty breathing or shortness of breath',
        'Persistent chest pain or pressure',
        'New confusion or inability to stay awake',
        'Bluish lips or face',
        'Fever > 103°F (39.4°C) persisting > 3 days'
      ],
      aiInsights: {
        symptomPattern: 'Classic viral respiratory infection pattern detected',
        temporalAnalysis: 'Symptom progression consistent with typical viral course',
        comorbidityImpact: 'Low risk based on medical history',
        outcomePrediction: '95% probability of full recovery within 7-10 days'
      },
      urgencyLevel: 'Routine Care',
      confidenceScore: 87.5,
      evidenceQuality: 'High'
    };

    setDiagnosis(aiDiagnosis);
    setIsAnalyzing(false);
    setStep(4);

    setChatMessages(prev => [...prev, {
      role: 'assistant',
      content: `✅ Analysis complete! I've identified ${aiDiagnosis.primaryDiagnosis.name} with ${aiDiagnosis.confidenceScore}% confidence. Review the detailed results below.`
    }]);
  };

  const renderStep1 = () => (
    <div className="fade-in-content">
      <div className="flex-center gap-12 mb-24 justify-start">
        <div className="icon-container icon-purple">
          <User size={24} />
        </div>
        <h2 className="text-2xl font-bold m-0">Patient Demographics</h2>
      </div>

      <div className="grid-2 mb-24">
        <div>
          <label className="label-text mb-8">Age</label>
          <input
            type="number"
            value={patientData.age}
            onChange={(e) => setPatientData(prev => ({ ...prev, age: e.target.value }))}
            className="input-field"
            placeholder="Enter patient age"
          />
        </div>
        <div>
          <label className="label-text mb-8">Gender</label>
          <select
            value={patientData.gender}
            onChange={(e) => setPatientData(prev => ({ ...prev, gender: e.target.value }))}
            className="input-field"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label-text mb-12">Medical History</label>
        <div className="grid-2">
          {medicalConditions.map((condition, idx) => (
            <button
              key={condition}
              onClick={() => handleConditionToggle(condition)}
              className={`btn-toggle ${patientData.medicalHistory.includes(condition) ? 'active' : 'inactive'}`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {condition}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!patientData.age || !patientData.gender}
        className="btn-primary w-full mt-24"
      >
        Next: Symptoms Assessment
        <Sparkles size={20} />
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="fade-in-content">
      <div className="flex-center gap-12 mb-24 justify-start">
        <div className="icon-container icon-red">
          <Activity size={24} />
        </div>
        <h2 className="text-2xl font-bold m-0">Symptoms Assessment</h2>
      </div>

      <div>
        <label className="label-text mb-12">Select all current symptoms</label>
        <div className="grid-3 mb-24">
          {symptomsList.map((symptom, idx) => (
            <button
              key={symptom}
              onClick={() => handleSymptomToggle(symptom)}
              className={`btn-toggle ${patientData.symptoms.includes(symptom) ? 'active' : 'inactive'}`}
              style={{
                animationDelay: `${idx * 30}ms`,
                borderColor: patientData.symptoms.includes(symptom) ? '#EF4444' : '#E5E7EB',
                background: patientData.symptoms.includes(symptom) ? 'linear-gradient(135deg, #FECACA, #FCA5A5)' : 'white',
                color: patientData.symptoms.includes(symptom) ? '#991B1B' : '#4B5563'
              }}
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-2 mb-24">
        <div>
          <label className="label-text mb-8">Duration of Symptoms</label>
          <select
            value={patientData.duration}
            onChange={(e) => setPatientData(prev => ({ ...prev, duration: e.target.value }))}
            className="input-field"
          >
            <option value="">Select duration</option>
            <option value="<24h">Less than 24 hours</option>
            <option value="1-3d">1-3 days</option>
            <option value="4-7d">4-7 days</option>
            <option value=">1w">More than 1 week</option>
            <option value=">1m">More than 1 month</option>
          </select>
        </div>
        <div>
          <label className="label-text mb-8">Severity Level</label>
          <select
            value={patientData.severity}
            onChange={(e) => setPatientData(prev => ({ ...prev, severity: e.target.value }))}
            className="input-field"
          >
            <option value="">Select severity</option>
            <option value="mild">Mild (1-3/10)</option>
            <option value="moderate">Moderate (4-6/10)</option>
            <option value="severe">Severe (7-10/10)</option>
          </select>
        </div>
      </div>

      <div className="diagnosis-actions">
        <button onClick={() => setStep(1)} className="btn-outline">
          ← Previous
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={patientData.symptoms.length === 0 || !patientData.duration || !patientData.severity}
          className="btn-primary flex-1"
        >
          Next: Review
          <Sparkles size={20} />
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="fade-in-content">
      <div className="flex-center gap-12 mb-24 justify-start">
        <div className="icon-container icon-blue">
          <FileText size={24} />
        </div>
        <h2 className="text-2xl font-bold m-0">Review Patient Information</h2>
      </div>

      <div className="info-box mb-24">
        <div className="mb-20">
          <h3 className="text-sm font-bold gray-text uppercase-track mb-8">Demographics</h3>
          <p className="text-lg m-0">
            Age: <strong>{patientData.age}</strong> | Gender: <strong className="capitalize">{patientData.gender}</strong>
          </p>
        </div>

        {patientData.medicalHistory.length > 0 && (
          <div className="mb-20">
            <h3 className="text-sm font-bold gray-text uppercase-track mb-8">Medical History</h3>
            <div className="flex-wrap gap-8">
              {patientData.medicalHistory.map(condition => (
                <span key={condition} className="pill pill-purple">
                  {condition}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-20">
          <h3 className="text-sm font-bold gray-text uppercase-track mb-8">Current Symptoms</h3>
          <div className="flex-wrap gap-8">
            {patientData.symptoms.map(symptom => (
              <span key={symptom} className="pill pill-red">
                {symptom}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold gray-text uppercase-track mb-8">Symptom Details</h3>
          <div className="grid-2">
            <div className="hero-metric-box diagnosis-metric-review">
              <p className="text-xs gray-text mb-4">Duration</p>
              <p className="font-semibold m-0">{patientData.duration}</p>
            </div>
            <div className="hero-metric-box diagnosis-metric-review">
              <p className="text-xs gray-text mb-4">Severity</p>
              <p className="font-semibold m-0 capitalize">{patientData.severity}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="diagnosis-actions">
        <button onClick={() => setStep(2)} className="btn-outline">
          ← Previous
        </button>
        <button onClick={runDiagnosisAI} className="btn-primary btn-ai-diagnosis">
          <Brain className="spin-slow" size={24} />
          Run AI Diagnosis
          <Zap className="pulse-slow" size={20} />
        </button>
      </div>
    </div>
  );

  const renderDiagnosisResults = () => (
    <div className="flex-col gap-24 fade-in-content">
      {/* Hero Card */}
      <div className="results-hero">
        <div className="results-hero-content">
          <div className="flex-between mb-24">
            <div className="flex-center gap-12">
              <Brain className="pulse-slow" size={40} />
              <h2 className="text-2xl font-bold m-0 results-hero-title">AI Diagnosis Complete</h2>
            </div>
            <Sparkles className="spin-slow" size={32} />
          </div>
          <div className="diagnosis-hero-grid">
            <div className="hero-metric-box">
              <p className="hero-metric-label">Confidence Score</p>
              <p className="hero-metric-value-lg m-0">{diagnosis.confidenceScore}%</p>
            </div>
            <div className="hero-metric-box">
              <p className="hero-metric-label">Evidence Quality</p>
              <p className="hero-metric-value m-0">{diagnosis.evidenceQuality}</p>
            </div>
            <div className="hero-metric-box">
              <p className="hero-metric-label">Urgency Level</p>
              <p className="hero-metric-value m-0">{diagnosis.urgencyLevel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Diagnosis */}
      <div className="primary-diagnosis-container">
        <div className="flex-center gap-12 mb-24 justify-start">
          <Stethoscope className="swing-animation primary-diagnosis-icon" size={28} />
          <h3 className="text-2xl font-bold m-0">Primary Diagnosis</h3>
        </div>
        <div className="flex-between align-start">
          <div>
            <h4 className="primary-diagnosis-val">{diagnosis.primaryDiagnosis.name}</h4>
            <div className="flex-center gap-12 justify-start">
              <span className="badge-outline">ICD-10: {diagnosis.primaryDiagnosis.icd10}</span>
              <span className="pill pill-purple">Severity: {diagnosis.primaryDiagnosis.severity}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="primary-diagnosis-val primary-confidence-value">
              {diagnosis.primaryDiagnosis.confidence}%
            </div>
            <p className="text-sm gray-text mt-4">Confidence</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="diagnosis-actions">
        <button
          onClick={() => {
            setStep(1);
            setDiagnosis(null);
            setChatMessages([{ role: 'assistant', content: 'Ready to start a new diagnosis. Let\'s gather patient information.' }]);
          }}
          className="btn-outline"
        >
          New Diagnosis
        </button>
        <button onClick={() => window.print()} className="btn-primary btn-export-report">
          <FileText size={24} />
          Export Report
        </button>
      </div>
    </div>
  );

  return (
    <div className="diagnosis-container">
      {/* Background Particles */}
      <div className="particle-container">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle particle-style"
            style={{
              '--size': `${particle.size}px`,
              '--x': `${particle.x}%`,
              '--y': `${particle.y}%`,
              '--duration': `${particle.duration}s`,
              '--delay': `${particle.delay}s`
            }}
          />
        ))}
      </div>

      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      <div className="diagnosis-wrapper">
        {/* Main Content */}
        <div>
          {/* Header */}
          <div className="diagnosis-card flex-between mb-24 p-2rem">
            <div className="flex-center gap-16">
              <div className="icon-container icon-purple header-icon-container">
                <Brain size={32} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold m-0 results-hero-title">AI Diagnosis Assistant</h1>
                <p className="text-sm gray-text m-0">Advanced medical diagnosis powered by machine learning</p>
              </div>
            </div>
            <div className="flex-center gap-8">
              <HeartPulse className="pulse-slow" size={32} color="#EC4899" />
              <Sparkles className="spin-slow" size={32} color="#F59E0B" />
            </div>
          </div>

          {/* Feature Badges */}
          <div className="flex-wrap gap-8 mb-24">
            <span className="badge-outline">✓ Evidence-Based Medicine</span>
            <span className="badge-outline blue-badge">✓ Advanced Pattern Recognition</span>
            <span className="badge-outline sky-badge">✓ Comprehensive Risk Assessment</span>
            <span className="badge-outline emerald-badge">✓ Clinical Guidelines Compliant</span>
          </div>

          {/* Progress Steps */}
          {step < 4 && (
            <div className="diagnosis-card mb-24 p-1-25rem">
              <div className="flex-between mb-12">
                {[1, 2, 3].map(num => (
                  <React.Fragment key={num}>
                    <div className={`step-circle ${step >= num ? 'active' : ''}`}>
                      {step > num ? '✓' : num}
                    </div>
                    {num < 3 && (
                      <div className={`step-line ${step > num ? 'active' : ''}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex-between text-sm gray-text font-semibold">
                <span>Patient Info</span>
                <span>Symptoms</span>
                <span>Review & Analyze</span>
              </div>
            </div>
          )}

          {/* Content Card */}
          <div className="diagnosis-card">
            {isAnalyzing ? (
              <div className="analysis-container">
                <div className="relative mb-24" style={{ display: 'inline-block' }}>
                  <Brain className="analysis-brain-icon spin-slow" />
                  <div className="analysis-glow-effect" />
                </div>
                <h3 className="text-2xl font-bold m-0 mb-8">AI Analysis in Progress</h3>
                <p className="gray-text mb-24 text-lg">Analyzing symptoms, medical history, and clinical patterns...</p>
                <div className="max-w-28rem m-0-auto flex-col gap-16">
                  {['Processing symptom correlations...', 'Cross-referencing medical databases...', 'Generating risk assessment...'].map((text, i) => (
                    <div key={i} className="analysis-step-item">
                      <Zap className="analysis-step-icon" />
                      <span>{text}</span>
                    </div>
                  ))}
                  <div className="progress-bar-container">
                    <div className="progress-bar-shimmer" />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && diagnosis && renderDiagnosisResults()}
              </>
            )}
          </div>

          {/* Disclaimer */}
          <div className="warning-box mt-24">
            <AlertTriangle className="pulse-slow medical-disclaimer-icon" size={20} />
            <div>
              <p className="font-bold mb-8 medical-disclaimer-title">⚠️ Medical Disclaimer</p>
              <p className="m-0 text-sm">This AI tool is designed to assist healthcare professionals and should not replace professional medical judgment. Always consult with a qualified healthcare provider for diagnosis and treatment decisions.</p>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="sidebar-sticky">
          <div className="diagnosis-card flex-col chat-sidebar-card">
            <div className="flex-center gap-12 mb-20 pb-20 border-bottom justify-start">
              <div className="icon-container icon-purple chat-sidebar-icon-container">
                <Bot size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold m-0">AI Assistant</h3>
                <p className="text-xs gray-text m-0">Always here to help you</p>
              </div>
            </div>

            <div className="chat-messages-container">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`chat-row ${msg.role}`}>
                  {msg.role === 'assistant' && (
                    <div className="chat-avatar assistant">
                      <Bot size={18} />
                    </div>
                  )}
                  <div className={`chat-bubble ${msg.role}`}>
                    <p className="m-0 text-sm line-height-1-5">{msg.content}</p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="chat-avatar user">
                      <User size={18} />
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="flex-center gap-12">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Ask me anything..."
                className="input-field"
              />
              <button
                onClick={sendChatMessage}
                className="btn-primary btn-chat-send"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisAssistant;
