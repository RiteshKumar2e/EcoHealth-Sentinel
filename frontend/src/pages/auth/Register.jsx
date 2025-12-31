import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Building, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organization: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    agreeToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.organization.trim()) newErrors.organization = 'Organization is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    return newErrors;
  };

  // Success Handler: Add user to global storage + Navigate Dashboard
  const handleRegisterSuccess = async (userData) => {
    if (window.UserStorage) {
      window.UserStorage.addUser({
        id: Date.now(),
        name: userData.fullName,
        email: userData.email,
        role: userData.role,
        domain: userData.organization,
        phone: userData.phone || '',
        location: userData.location || '',
        projects: 0,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        avatar: userData.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
      });
    }

    // Go to dashboard
    navigate('/Users');
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

    // Simulate API call
    setTimeout(() => {
      console.log('Register data:', formData);
      setIsLoading(false);

      // Call Success handler
      handleRegisterSuccess(formData);
    }, 2000);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Logo/Brand */}
        <div className="brand-section">
          <div className="brand-logo-bg">
            <User className="brand-logo-icon" />
          </div>
          <h1 className="brand-title">Create Your Account</h1>
          <p className="brand-subtitle">Join us in building responsible AI solutions</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="register-form">
          {/* Full Name & Email */}
          <div className="form-grid-md">
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <div className="input-wrapper">
                <User className="form-icon" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter Full Name"
                  className={`form-input ${errors.fullName ? 'input-error' : ''}`}
                />
              </div>
              {errors.fullName && <div className="error-text"><AlertCircle size={12} />{errors.fullName}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-wrapper">
                <Mail className="form-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email id"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                />
              </div>
              {errors.email && <div className="error-text"><AlertCircle size={12} />{errors.email}</div>}
            </div>
          </div>

          {/* Organization & Phone */}
          <div className="form-grid-md">
            <div className="form-group">
              <label htmlFor="organization" className="form-label">Organization</label>
              <div className="input-wrapper">
                <Building className="form-icon" />
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Your company/org"
                  className={`form-input ${errors.organization ? 'input-error' : ''}`}
                />
              </div>
              {errors.organization && <div className="error-text"><AlertCircle size={12} />{errors.organization}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <div className="input-wrapper">
                <Phone className="form-icon" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 xxxxxxxxx"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Role */}
          <div className="form-group">
            <label htmlFor="role" className="form-label">Role</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange} className="form-select">
              <option value="Select Option">Select Option</option>
              <option value="healthcare">Healthcare Specialist</option>
              <option value="agriculture">Agriculture Expert</option>
              <option value="environment">Environmental Scientist</option>
              <option value="education">Education Coordinator</option>
              <option value="researcher">Researcher</option>
            </select>
          </div>

          {/* Password & Confirm */}
          <div className="form-grid-md">
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock className="form-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  className={`form-input input-password ${errors.password ? 'input-error' : ''}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <div className="error-text"><AlertCircle size={12} />{errors.password}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <Lock className="form-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className={`form-input input-password ${errors.confirmPassword ? 'input-error' : ''}`}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="password-toggle">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <div className="error-text"><AlertCircle size={12} />{errors.confirmPassword}</div>}
            </div>
          </div>

          {/* Terms */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className={`checkbox-input ${errors.agreeToTerms ? 'checkbox-error' : ''}`}
              />
              <span>I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a></span>
            </label>
            {errors.agreeToTerms && <div className="error-text"><AlertCircle size={12} />{errors.agreeToTerms}</div>}
          </div>

          {/* Submit */}
          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? <> <div className="loading-spinner"></div> <span>Creating account...</span> </> : <> <span>Create Account</span> <ArrowRight size={20} /> </>}
          </button>
        </form>

        {/* Sign In */}
        <div className="signin-section">
          Already have an account? <Link to="/auth/login" className="signin-link">Sign in</Link>
        </div>

        {/* Footer */}
        <div className="footer-section">
          <p className="footer-text">© 2025 AI Solutions. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
