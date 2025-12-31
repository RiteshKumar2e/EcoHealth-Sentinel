import React, { useState, useEffect, useRef } from 'react';
import { Sprout, Target, TrendingDown, Leaf, AlertCircle, Shield } from 'lucide-react';
import './FertilizerRecommendations.css';

export default function FertilizerRecommendations() {
  const [soilData, setSoilData] = useState({
    nitrogen: 45,
    phosphorus: 38,
    potassium: 52,
    ph: 6.8
  });
  const [cropType, setCropType] = useState('tomato');
  const [growthStage, setGrowthStage] = useState('flowering');
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // For subtle 3D card tilt effect
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    function handleMove(e) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within element
      const y = e.clientY - rect.top; // y position within element
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx; // -1 .. 1
      const dy = (y - cy) / cy; // -1 .. 1
      const rotateX = (dy * 8).toFixed(2);
      const rotateY = (dx * -8).toFixed(2);
      el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
    }

    function reset() {
      el.style.transform = '';
    }

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', reset);

    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', reset);
    };
  }, []);

  // Try backend first; fallback to local algorithm if backend fails
  async function generateRecommendations() {
    setLoading(true);
    setError(null);
    setRecommendations(null);

    const payload = { soilData, cropType, growthStage };

    // Attempt to POST to backend. Endpoint should implement the same logic server-side.
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Backend error');

      const data = await res.json();
      setRecommendations(data);
      setLoading(false);
      return;
    } catch (e) {
      // Backend failed or not available -> use local fallback (same algorithm you had)
      console.warn('Backend request failed, using local fallback', e);
      const local = computeLocalRecommendations(soilData, cropType, growthStage);
      setRecommendations(local);
      setLoading(false);
    }
  }

  // Local fallback logic (keeps parity with the previous implementation)
  function computeLocalRecommendations(soil, crop, stage) {
    const { nitrogen, phosphorus, potassium, ph } = soil;

    const optimalLevels = {
      tomato: { N: 60, P: 50, K: 60, ph: [6.0, 7.0] },
      wheat: { N: 80, P: 40, K: 40, ph: [6.5, 7.5] },
      rice: { N: 70, P: 35, K: 35, ph: [5.5, 6.5] },
      corn: { N: 85, P: 45, K: 50, ph: [6.0, 7.0] }
    };

    const optimal = optimalLevels[crop];
    const nDef = Math.max(0, optimal.N - nitrogen);
    const pDef = Math.max(0, optimal.P - phosphorus);
    const kDef = Math.max(0, optimal.K - potassium);

    const ureaAmount = Number((nDef * 2.17).toFixed(1));
    const dapAmount = Number((Math.max(nDef, pDef) * 1.8).toFixed(1));
    const mopAmount = Number((kDef * 1.67).toFixed(1));

    const totalCost = (
      ureaAmount * 0.30 +
      dapAmount * 0.45 +
      mopAmount * 0.35
    ).toFixed(2);

    const organicOptions = [];
    if (nDef > 10) organicOptions.push('Compost (5 kg/m²), Vermicompost (3 kg/m²)');
    if (pDef > 10) organicOptions.push('Bone meal (2 kg/m²), Rock phosphate (1.5 kg/m²)');
    if (kDef > 10) organicOptions.push('Wood ash (1 kg/m²), Kelp meal (0.5 kg/m²)');

    const schedule = stage === 'seedling'
      ? 'Split application: 40% at planting, 30% at 3 weeks, 30% at 6 weeks'
      : stage === 'vegetative'
        ? 'Weekly light applications for steady growth'
        : 'Reduce nitrogen, increase potassium for fruit development';

    const co2Saved = organicOptions.length > 0 ? Number((ureaAmount * 0.9).toFixed(1)) : 0;

    return {
      synthetic: { urea: ureaAmount, dap: dapAmount, mop: mopAmount, cost: totalCost },
      organic: organicOptions,
      schedule,
      deficiencies: { nitrogen: nDef, phosphorus: pDef, potassium: kDef },
      phAdjustment: ph < optimal.ph[0] ? 'Add lime to increase pH' : ph > optimal.ph[1] ? 'Add sulfur to decrease pH' : 'pH is optimal',
      environmentalImpact: { co2Saved, waterQuality: 'Precision application reduces runoff by 40%' }
    };
  }

  // tiny visualization: circular nutrient gauge using SVG
  const NutrientGauge = ({ label, value, max = 100 }) => {
    const radius = 44;
    const circumference = 2 * Math.PI * radius;
    const pct = Math.min(1, Math.max(0, value / max));
    const stroke = circumference * (1 - pct);

    return (
      <div className="gauge-svg-wrapper">
        <svg width={110} height={110} viewBox="0 0 120 120">
          <defs>
            <linearGradient id={`g-${label}`} x1="0%" x2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          <g transform="translate(60,60)">
            <circle r={radius} fill="none" stroke="#e6f0ea" strokeWidth={12} />
            <circle
              r={radius}
              fill="none"
              stroke={`url(#g-${label})`}
              strokeWidth={12}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={stroke}
              strokeLinecap="round"
              transform="rotate(-90)"
              style={{ transition: 'stroke-dashoffset 600ms ease' }}
            />
            <text x="0" y="6" textAnchor="middle" fontSize={16} fontWeight={700} fill="#0f172a" className="gauge-text-val">
              {Math.round(value)}
            </text>
            <text x="0" y="26" textAnchor="middle" fontSize={10} fill="#475569" className="gauge-text-val">
              {label}
            </text>
          </g>
        </svg>
      </div>
    );
  };

  return (
    <div className="fertilizer-page">
      <div className="fertilizer-container">
        <div className="header-card">
          <div className="header-content">
            <Sprout className="header-icon" />
            <div>
              <h1 className="header-title">AI Fertilizer Recommendations</h1>
              <p className="header-subtitle">Precision nutrition for optimal crop growth</p>
            </div>
          </div>

          <div className="eco-badge">
            <Shield className="badge-icon" />
            <span>Eco-Friendly</span>
          </div>
        </div>

        <div className="two-cols-responsive">
          <div>
            <div className="card card-tilt" ref={cardRef}>
              <h3 className="card-heading">Soil Nutrient Levels</h3>

              <div className="soil-inputs">
                <div>
                  <label className="input-label">Nitrogen (N)</label>
                  <input
                    className="slider-input"
                    type="range"
                    min="0"
                    max="100"
                    value={soilData.nitrogen}
                    onChange={(e) => setSoilData({ ...soilData, nitrogen: parseInt(e.target.value) })}
                  />
                  <div className="control-row">
                    <span className="value-max">0</span>
                    <span className="value-current">{soilData.nitrogen} ppm</span>
                    <span className="value-max">100</span>
                  </div>
                </div>

                <div>
                  <label className="input-label">Phosphorus (P)</label>
                  <input
                    className="slider-input"
                    type="range"
                    min="0"
                    max="100"
                    value={soilData.phosphorus}
                    onChange={(e) => setSoilData({ ...soilData, phosphorus: parseInt(e.target.value) })}
                  />
                  <div className="control-row">
                    <span className="value-max">0</span>
                    <span className="value-current">{soilData.phosphorus} ppm</span>
                    <span className="value-max">100</span>
                  </div>
                </div>

                <div>
                  <label className="input-label">Potassium (K)</label>
                  <input
                    className="slider-input"
                    type="range"
                    min="0"
                    max="100"
                    value={soilData.potassium}
                    onChange={(e) => setSoilData({ ...soilData, potassium: parseInt(e.target.value) })}
                  />
                  <div className="control-row">
                    <span className="value-max">0</span>
                    <span className="value-current">{soilData.potassium} ppm</span>
                    <span className="value-max">100</span>
                  </div>
                </div>

                <div>
                  <label className="input-label">Soil pH</label>
                  <input
                    className="slider-input"
                    type="range"
                    min="4"
                    max="9"
                    step="0.1"
                    value={soilData.ph}
                    onChange={(e) => setSoilData({ ...soilData, ph: parseFloat(e.target.value) })}
                  />
                  <div className="control-row">
                    <span className="value-max">4.0</span>
                    <span className="value-current">{soilData.ph}</span>
                    <span className="value-max">9.0</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="card">
              <h3 className="card-heading">Crop Information</h3>

              <div className="crop-inputs">
                <div>
                  <label className="crop-label">Crop Type</label>
                  <select value={cropType} onChange={(e) => setCropType(e.target.value)} className="select-input">
                    <option value="tomato">Tomato</option>
                    <option value="wheat">Wheat</option>
                    <option value="rice">Rice</option>
                    <option value="corn">Corn</option>
                  </select>
                </div>

                <div>
                  <label className="crop-label">Growth Stage</label>
                  <select value={growthStage} onChange={(e) => setGrowthStage(e.target.value)} className="select-input">
                    <option value="seedling">Seedling</option>
                    <option value="vegetative">Vegetative</option>
                    <option value="flowering">Flowering</option>
                    <option value="fruiting">Fruiting</option>
                  </select>
                </div>

                <button
                  onClick={generateRecommendations}
                  className="btn-generate"
                >
                  {loading ? 'Generating…' : 'Generate AI Recommendations'}
                </button>

                {error && <div className="error-text">{error}</div>}

              </div>
            </div>
          </div>

          {/* Results column */}
          <div className="results-column">
            {/* Live gauges */}
            <div className="card gauges-card">
              <div className="gauges-wrapper">
                <NutrientGauge label="N" value={soilData.nitrogen} />
                <NutrientGauge label="P" value={soilData.phosphorus} />
                <NutrientGauge label="K" value={soilData.potassium} />
              </div>

              <div className="ph-display">
                <div className="ph-label">pH</div>
                <div className="ph-value">{soilData.ph}</div>
                <div>
                  <div className="live-badge">
                    Live Preview
                  </div>
                </div>
              </div>
            </div>

            {/* Results box */}
            <div className={`card results-box`}>
              {recommendations ? (
                <>
                  <h3 className="results-heading">Synthetic Fertilizers</h3>
                  <div className="synthetic-list">
                    <div className="synthetic-item item-urea">
                      <div className="item-name">Urea (46-0-0)</div>
                      <div className="item-qty">{recommendations.synthetic.urea} kg/hectare</div>
                    </div>

                    <div className="synthetic-item item-dap">
                      <div className="item-name">DAP (18-46-0)</div>
                      <div className="item-qty">{recommendations.synthetic.dap} kg/hectare</div>
                    </div>

                    <div className="synthetic-item item-mop">
                      <div className="item-name">MOP (0-0-60)</div>
                      <div className="item-qty">{recommendations.synthetic.mop} kg/hectare</div>
                    </div>

                    <div className="cost-row">
                      <div className="cost-label">Estimated Cost</div>
                      <div className="cost-value">₹{recommendations.synthetic.cost}</div>
                    </div>
                  </div>

                  <hr className="divider" />

                  <h3 className="results-heading">Organic Alternatives</h3>
                  {recommendations.organic.length > 0 ? (
                    <div className="organic-list">
                      {recommendations.organic.map((opt, i) => (
                        <div key={i} className="organic-item">{opt}</div>
                      ))}
                    </div>
                  ) : (
                    <div className="organic-empty">Current nutrient levels are adequate. Maintain with compost.</div>
                  )}

                </>
              ) : (
                <div className="loading-state">
                  <Sprout className="pulse-icon" />
                  <div className="loading-text">Enter soil data and crop information.</div>
                  <div className="loading-sub">AI will generate personalized recommendations.</div>
                </div>
              )}
            </div>

            {/* Environmental card with 3D tilt subtle gradient */}
            <div className="env-card">
              <div className="env-content">
                <div>
                  <div className="env-heading">
                    <TrendingDown className="env-icon" /> Environmental Impact
                  </div>
                  <div className="env-desc">{recommendations ? `${recommendations.environmentalImpact.co2Saved} kg CO₂ saved (organic option)` : 'Switch to organic supplements to reduce emissions.'}</div>
                </div>

                <div className="env-visual">
                  {/* a small animated icon / globe substitute */}
                  <div className="visual-box">
                    🌱
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Benefits footer */}
        <div className="benefits-footer">
          <div className="benefits-grid">
            <div>
              <div className="benefit-title">Precision Nutrition</div>
              <div className="benefit-desc">Apply exactly what crops need, when they need it</div>
            </div>
            <div>
              <div className="benefit-title">Cost Savings</div>
              <div className="benefit-desc">Reduce fertilizer waste by 30-40%</div>
            </div>
            <div>
              <div className="benefit-title">Environmental Protection</div>
              <div className="benefit-desc">Minimize runoff and groundwater contamination</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
