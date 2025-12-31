import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // ✅ Success handler (common for email & Google login)
  const handleLoginSuccess = async (userData) => {
    if (window.UserStorage) {
      window.UserStorage.addUser({
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: userData.role || 'Team Member',
        domain: userData.domain || 'General',
        phone: userData.phone || '',
        location: userData.location || '',
        projects: 0,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        avatar: userData.name.split(' ').map(n => n[0]).join('').toUpperCase()
      });
    }
    // ✅ Redirect to Dashboard
    navigate('/auth/dashboard');
  };

  // Validate email/password
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    return newErrors;
  };

  // Handle email/password submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      console.log('Login data:', formData);
      // Fake user data (replace with API response later)
      handleLoginSuccess({
        name: formData.email.split('@')[0],
        email: formData.email,
      });
      setIsLoading(false);
    }, 1500);
  };

  // Google login
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('Google login successful:', tokenResponse);
      // Replace with real user data from backend
      handleLoginSuccess({
        name: 'Google User',
        email: 'googleuser@example.com',
      });
    },
    onError: () => {
      console.log('Google login failed');
    }
  });

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo-bg">
            <Lock className="login-lock-icon" />
          </div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to access your AI solutions dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="form-flex">
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <div className="input-wrapper-relative">
              <Mail className="field-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`form-input ${errors.email ? 'input-error' : ''}`}
              />
            </div>
            {errors.email && <div className="error-message"><AlertCircle size={16} />{errors.email}</div>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-wrapper-relative">
              <Lock className="field-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`form-input password-padding ${errors.password ? 'input-error' : ''}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-btn">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <div className="error-message"><AlertCircle size={16} />{errors.password}</div>}
          </div>

          {/* Remember & Forgot */}
          <div className="options-row">
            <label className="remember-label">
              <input type="checkbox" className="checkbox-input" />
              <span className="remember-text">Remember me</span>
            </label>
            <Link to="/auth/forgot-password" className="forgot-link">Forgot password?</Link>
          </div>

          {/* Submit */}
          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? (
              <>
                <div className="spinner"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* OR Divider */}
        <div className="divider-container">
          <div className="divider-line"></div>
          <span className="divider-text">OR</span>
          <div className="divider-line"></div>
        </div>

        {/* Google Login */}
        <button className="social-btn" onClick={() => googleLogin()}>
          <svg className="social-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        {/* Sign up */}
        <div className="signup-prompt">
          <p className="signup-text">
            Don't have an account? <Link to="/auth/register" className="signup-link">Sign up</Link>
          </p>
        </div>

        {/* Footer */}
        <div className="footer">
          <p className="footer-text">© 2025 AI Solutions. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
