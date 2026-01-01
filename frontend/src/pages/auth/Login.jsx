import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, User } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../../components/Logo';
import './Login.css';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Login Logic
  const handleLoginSuccess = async (userData) => {
    if (window.UserStorage) {
      window.UserStorage.addUser({
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: userData.role || 'Team Member',
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        avatar: userData.name.split(' ').map((n) => n[0]).join('').toUpperCase(),
      });
    }
    navigate('/auth/dashboard');
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) newErrors.email = 'Email address is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    return newErrors;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    // Simulate API Call
    setTimeout(() => {
      handleLoginSuccess({
        name: formData.email.split('@')[0],
        email: formData.email,
      });
      setIsLoading(false);
    }, 1500);
  };

  // Google Login
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('Google login successful:', tokenResponse);
      handleLoginSuccess({ name: 'Google User', email: 'googleuser@example.com' });
    },
    onError: () => console.log('Google login failed'),
  });

  return (
    <div className="login-page-wrapper">
      <div className="login-content-container">

        {/* Brand Logo - Centered above card */}
        <Link to="/" className="brand-header">
          <Logo />
          <div className="brand-text-stack">
            <span className="brand-name">EcoHealth</span>
            <span className="brand-tagline">SENTINEL</span>
          </div>
        </Link>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="auth-card"
        >
          <div className="auth-header">
            <div className="icon-badge">
              <User size={32} />
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Log in to your profile</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email Field */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="email">Email Address</label>
              </div>
              <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="form-input"
                />
              </div>
              {errors.email && (
                <span className="error-text">
                  <AlertCircle size={14} /> {errors.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">Enter Password</label>
                <Link to="/auth/forgot-password" className="forgot-link-sm">
                  Forgot Access?
                </Link>
              </div>
              <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="error-text">
                  <AlertCircle size={14} /> {errors.password}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="primary-btn"
            >
              {isLoading ? <div className="spinner" /> : "Login"}
            </button>
          </form>

          <div className="divider">
            <span>OR CONNECT VIA</span>
          </div>

          <button
            type="button"
            className="google-btn"
            onClick={() => googleLogin()}
          >
            <svg className="google-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sync with Google
          </button>

          <div className="auth-footer" style={{ marginTop: '2rem' }}>
            Don't have an account? <Link to="/auth/register">Signup</Link>
          </div>
        </motion.div>

        <footer className="page-footer">
          © 2025 EcoHealth Sentinel. All rights reserved.
        </footer>
      </div>
    </div>
  );
}