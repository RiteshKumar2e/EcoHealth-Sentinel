import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Building2, Phone, Camera, X, ShieldCheck, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../components/Logo'; // Ensure this path is correct
import './Register.css';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    organization: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useState(null); // I'll use useRef instead

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('avatar-input').click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/dashboard');
    }, 2000);
  };

  // Modal State
  const [activeModal, setActiveModal] = useState(null); // 'terms' | 'privacy' | null

  // -- Modal Content --
  const getModalContent = () => {
    if (activeModal === 'terms') {
      return (
        <div className="policy-content">
          <section>
            <h3>1. Acceptance of Terms</h3>
            <p>By accessing and using EcoHealth Sentinel, you agree to be bound by these Terms of Service. This platform is designed for decentralized AI health monitoring and environmental protection.</p>
          </section>
          <section>
            <h3>2. User Responsibilities</h3>
            <p>Users must provide accurate information and maintain the security of their decentralized identity. Any misuse of AI agents or grid resources is strictly prohibited.</p>
          </section>
          <section>
            <h3>3. Data Usage</h3>
            <p>The platform operates on a decentralized grid. While your data is encrypted, the system uses anonymized health patterns to train collective intelligence models for the benefit of the community.</p>
          </section>
          <section>
            <h3>4. Intellectual Property</h3>
            <p>All AI models and algorithms hosted on the sentinel grid are protected by digital sovereignty laws. Users retain ownership of their raw data inputs.</p>
          </section>
        </div>
      );
    }
    if (activeModal === 'privacy') {
      return (
        <div className="policy-content">
          <section>
            <h3>1. Data Sovereignty</h3>
            <p>We believe in data ownership. Your personal health metrics and identification are stored securely and are only accessible via your unique cryptographic keys.</p>
          </section>
          <section>
            <h3>2. Information Security</h3>
            <p>We implement end-to-end encryption for all data transmissions between your nodes and the sentinel grid. Regular audits are conducted to ensure system integrity.</p>
          </section>
          <section>
            <h3>3. Third-Party Access</h3>
            <p>EcoHealth Sentinel does not sell your data. Third-party access is only granted for verified health researchers when users explicitly opt-in to specific studies.</p>
          </section>
          <section>
            <h3>4. Cookie Policy</h3>
            <p>We use localized tokens to maintain your session. No tracking cookies are used for advertising or external profiling purposes.</p>
          </section>
        </div>
      );
    }
    return null;
  };

  const getModalTitle = () => {
    return activeModal === 'terms' ? 'Terms of Service' : 'Privacy Policy';
  };

  return (
    <div className="register-page-wrapper">

      {/* Page Brand (Top Left) */}
      <Link to="/" className="page-brand">
        <Logo />
        <div className="brand-text-stack">
          <span className="brand-name">EcoHealth</span>
          <span className="brand-sub">Sentinel</span>
        </div>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="register-card"
      >
        {/* --- HEADER SECTION --- */}
        <div className="register-header-section">
          {/* 1. Blue Icon Badge (Left Aligned) */}
          <div className="header-icon-badge">
            <User size={28} strokeWidth={2} />
          </div>

          {/* 2. Title & Subtitle (Left Aligned) */}
          <h1 className="header-title">Create Your Account</h1>
          <p className="header-subtitle">Join us in the decentralized AI grid</p>
        </div>

        {/* 3. Avatar Upload (Centered) */}
        <div className="avatar-section-wrapper">
          <div className="avatar-upload-container">
            <input
              type="file"
              id="avatar-input"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div className="avatar-circle" onClick={triggerFileInput}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar Preview" className="avatar-preview-img" />
              ) : (
                <User size={38} strokeWidth={1.5} className="avatar-icon-main" />
              )}
              <div className="camera-badge">
                <Camera size={14} color="white" strokeWidth={2.5} />
              </div>
            </div>
            <span className="upload-label">Upload Identity Photo</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="register-form">

          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-wrapper">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 00000 00000"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@domain.com"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Organization</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Org/Company"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••"
                  className="form-input"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-eye">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••"
                  className="form-input"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="toggle-eye">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="terms-container">
            <label className="checkbox-wrapper">
              <input type="checkbox" name="agreeToTerms" onChange={handleChange} />
              <span className="checkbox-text">
                I have read and agree to the{' '}
                <button type="button" className="terms-link-btn" onClick={() => setActiveModal('terms')}>Terms of Service</button>
                {' '}and <button type="button" className="terms-link-btn" onClick={() => setActiveModal('privacy')}>Privacy Policy</button>.
              </span>
            </label>
          </div>

          <button type="submit" className="create-account-btn" disabled={isLoading}>
            {isLoading ? <div className="spinner-white"></div> : <>Create Account <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="card-footer">
          Already have an account? <Link to="/auth/login">Sign in</Link>
        </div>
      </motion.div>

      {/* --- Professional Modal --- */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="modal-title-group">
                  <div className={`modal-icon-box ${activeModal}`}>
                    {activeModal === 'terms' ? <FileText size={20} /> : <ShieldCheck size={20} />}
                  </div>
                  <h2 className="modal-title">{getModalTitle()}</h2>
                </div>
                <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                {getModalContent()}
              </div>
              <div className="modal-footer">
                <button className="modal-secondary-btn" onClick={() => setActiveModal(null)}>Dismiss</button>
                <button className="modal-primary-btn" onClick={() => setActiveModal(null)}>I Understand</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}