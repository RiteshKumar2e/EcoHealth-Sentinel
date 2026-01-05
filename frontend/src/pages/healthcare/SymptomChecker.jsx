import React, { useState, useEffect, useRef } from 'react';
import { Brain, Stethoscope, Activity, AlertTriangle, CheckCircle, TrendingUp, FileText, Send, Bot, User, Sparkles, Zap, HeartPulse, Microscope } from 'lucide-react';
import './SymptomChecker.css';

const SymptomChecker = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    age: '26',
    gender: 'male',
    symptoms: [],
    duration: '',
    severity: '',
    medicalHistory: ['Hypertension'],
  });
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hi Anmol! I\'m your AI Health Assistant. Tell me how you\'re feeling today, and I\'ll help you understand what might be going on.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  const symptomsList = [
    'Fever', 'Cough', 'Shortness of Breath', 'Fatigue', 'Headache',
    'Sore Throat', 'Nausea', 'Dizziness', 'Muscle Aches', 'Joint Pain', 'Rash',
    'Back Pain', 'Insomnia', 'Anxiety', 'Indigestion'
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSymptomToggle = (symptom) => {
    setUserData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'assistant', content: "I've logged that symptom. It helps me provide a more accurate assessment. Would you like to start the full AI scan now?" }]);
    }, 1000);
  };

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));

    const results = {
      condition: 'Common Viral Cold',
      confidence: 92,
      urgency: 'Self-Care',
      summary: 'Your symptoms align with a typical viral upper respiratory infection.',
      steps: [
        'Stay hydrated with warm fluids',
        'Rest for at least 8 hours tonight',
        'Monitor temperature every 6 hours'
      ],
      warnings: ['If fever exceeds 102°F', 'If you experience chest pain']
    };

    setAnalysis(results);
    setIsAnalyzing(false);
    setStep(4);
    setChatMessages(prev => [...prev, { role: 'assistant', content: 'Scan complete! I\'ve found some insights. You can view them in the dashboard now.' }]);
  };

  return (
    <div className="diagnosis-container">
      <div className="diagnosis-wrapper">
        <div>
          <div className="diagnosis-card flex-between mb-24 p-2rem">
            <div className="flex-center gap-16">
              <div className="icon-container icon-purple">
                <Brain size={32} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold m-0" style={{ color: 'white' }}>AI Symptom Checker</h1>
                <p className="text-sm gray-text m-0">Understand your symptoms with medical-grade AI</p>
              </div>
            </div>
            <HeartPulse className="pulse-slow" size={32} color="#EC4899" />
          </div>

          {step < 4 && (
            <div className="diagnosis-card mb-24 p-1-25rem">
              <div className="flex-between mb-12">
                {[1, 2, 3].map(num => (
                  <React.Fragment key={num}>
                    <div className={`step-circle ${step >= num ? 'active' : ''}`}>{num}</div>
                    {num < 3 && <div className={`step-line ${step > num ? 'active' : ''}`} />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          <div className="diagnosis-card">
            {isAnalyzing ? (
              <div className="analysis-container">
                <Brain className="analysis-brain-icon spin-slow" size={64} style={{ color: '#8b5cf6' }} />
                <h3 className="text-2xl font-bold mt-24">Analyzing Symptoms...</h3>
                <p className="gray-text">Comparing against 50,000+ medical scenarios</p>
              </div>
            ) : step === 1 ? (
              <div className="fade-in-content">
                <h2 className="text-xl font-bold mb-20 text-white">Select Your Symptoms</h2>
                <div className="grid-3 mb-24">
                  {symptomsList.map((s, i) => (
                    <button key={i} onClick={() => handleSymptomToggle(s)} className={`btn-toggle ${userData.symptoms.includes(s) ? 'active' : ''}`}>
                      {s}
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(2)} className="btn-primary w-full">Next: Details</button>
              </div>
            ) : step === 2 ? (
              <div className="fade-in-content">
                <h2 className="text-xl font-bold mb-20 text-white">Few more details</h2>
                <div className="grid-2">
                  <select className="input-field" value={userData.duration} onChange={e => setUserData({ ...userData, duration: e.target.value })}>
                    <option value="">How long?</option>
                    <option value="1d">1 Day</option>
                    <option value="3d">3 Days</option>
                  </select>
                  <select className="input-field" value={userData.severity} onChange={e => setUserData({ ...userData, severity: e.target.value })}>
                    <option value="">Severity?</option>
                    <option value="mild">Mild</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
                <div className="diagnosis-actions mt-24">
                  <button onClick={() => setStep(1)} className="btn-outline">Back</button>
                  <button onClick={() => setStep(3)} className="btn-primary flex-1">Review</button>
                </div>
              </div>
            ) : step === 3 ? (
              <div className="fade-in-content">
                <h2 className="text-xl font-bold mb-20 text-white">Review Summary</h2>
                <div className="info-box mb-24">
                  <p>Symptoms: {userData.symptoms.join(', ') || 'None selected'}</p>
                  <p>Duration: {userData.duration}</p>
                  <p>Severity: {userData.severity}</p>
                </div>
                <button onClick={runAIAnalysis} className="btn-primary w-full">Run AI Analysis</button>
              </div>
            ) : (
              <div className="fade-in-content">
                <div className="results-hero mb-24">
                  <h2 className="text-2xl font-bold">{analysis.condition}</h2>
                  <p>{analysis.confidence}% Confidence | {analysis.urgency}</p>
                </div>
                <div className="info-box">
                  <h3 className="font-bold mb-12">Recommended Care Steps</h3>
                  <ul className="m-0 p-0" style={{ listStyle: 'none' }}>
                    {analysis.steps.map((s, i) => <li key={i} className="mb-8">✅ {s}</li>)}
                  </ul>
                </div>
                <div className="warning-box mt-24">
                  <AlertTriangle size={20} color="#f59e0b" />
                  <p className="m-0 ml-12">Watch out for: {analysis.warnings.join(', ')}</p>
                </div>
                <button onClick={() => setStep(1)} className="btn-outline mt-24 w-full">Check Again</button>
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-sticky">
          <div className="diagnosis-card flex-col chat-sidebar-card">
            <div className="chat-messages-container">
              {chatMessages.map((m, i) => (
                <div key={i} className={`chat-row ${m.role}`}>
                  <div className={`chat-bubble ${m.role}`}>{m.content}</div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="flex-center gap-12">
              <input className="input-field" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask anything..." />
              <button onClick={sendChatMessage} className="btn-primary"><Send size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
