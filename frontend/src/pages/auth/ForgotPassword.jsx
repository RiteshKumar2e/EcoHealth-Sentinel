import { useState } from 'react';
import { Mail, ArrowRight, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import Logo from '../../components/Logo';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    if (e.preventDefault) e.preventDefault();
    if (!email) return setError('Email is required');
    if (!validateEmail(email)) return setError('Please enter a valid email address');

    setIsLoading(true);
    setError('');

    try {
      // Log for debugging
      console.log('Attempting to send reset email to:', email);

      const templateParams = {
        to_email: email,
        user_email: email,
        email: email,
        recipient: email,
        from_name: 'EcoHealth Sentinel Administrator',
        reply_to: 'support@ecohealth.com',
      };

      await emailjs.send(
        'service_7cdfbpu',
        'template_xxti9xw',
        templateParams,
        'opQ62Bt4yyh7VyL4I'
      );

      setIsLoading(false);
      setEmailSent(true);

      // For demo purposes, we provide a direct path to reset
      setTimeout(() => {
        navigate(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);

    } catch (err) {
      console.error(err);
      setError('EmailJS Error: Redirecting to reset page for demo...');
      setIsLoading(false);

      // Still navigate in demo mode so user isn't stuck
      setTimeout(() => {
        navigate(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      }, 3000);
    }
  };

  const handleResend = () => handleSubmit({ preventDefault: () => { } });

  // Light Theme Styles
  const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: '#f8fafc' },
    card: { width: '100%', maxWidth: '500px', backgroundColor: '#ffffff', borderRadius: '16px', padding: '2.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' },
    input: (hasError) => ({ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: `1px solid ${hasError ? '#ef4444' : '#cbd5e1'}`, backgroundColor: '#ffffff', color: '#1e293b', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s' }),
    label: { display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#334155' },
    icon: { position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', width: '20px', height: '20px' },
    error: { display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', color: '#ef4444', fontSize: '0.8rem' },
    button: { width: '100%', padding: '0.875rem', borderRadius: '8px', background: '#2563eb', color: '#fff', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '1rem', transition: 'background-color 0.2s', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
    infoBox: { backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '1rem', display: 'flex', gap: '0.75rem' },
    footer: { textAlign: 'center', marginTop: '2rem', color: '#94a3b8', fontSize: '0.8rem' },
    resendButton: { color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' },
    link: { color: '#2563eb', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' },
    title: { color: '#0f172a', fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem', marginTop: 0 },
    subtitle: { color: '#64748b', fontSize: '1rem', margin: 0 }
  };

  if (emailSent) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-block', padding: '1rem', backgroundColor: '#ecfdf5', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <CheckCircle style={{ width: '64px', height: '64px', color: '#10b981' }} />
            </div>
            <h1 style={{ ...styles.title, fontSize: '1.5rem' }}>Check Your Email</h1>
            <p style={{ ...styles.subtitle, marginBottom: '1rem' }}>We've sent password reset instructions to:</p>
            <p style={{ color: '#0f172a', fontWeight: '600', marginBottom: '1rem' }}>{email}</p>

            <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Didn't receive the email? Check your spam folder or</p>
              <button style={styles.resendButton} onClick={handleResend} disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Resend email'}
              </button>
            </div>

            <Link to="/auth/login" style={styles.link}>
              <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back to login
            </Link>
          </div>

          <div style={styles.footer}>© 2025 EcoHealth Sentinel. All rights reserved.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Logo />
          </div>
          <h1 style={styles.title}>Forgot Password?</h1>
          <p style={styles.subtitle}>No worries, we'll send you reset instructions</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail style={styles.icon} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="you@example.com"
                style={styles.input(error)}
              />
            </div>
            {error && <div style={styles.error}><AlertCircle style={{ width: '16px', height: '16px' }} />{error}</div>}
          </div>

          <div style={styles.infoBox}>
            <Mail style={{ width: '20px', height: '20px', color: '#3b82f6', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <h3 style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Reset Link Delivery</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>We'll send you a secure link to reset your password. The link will be valid for 1 hour.</p>
            </div>
          </div>

          <button type="submit" disabled={isLoading} style={styles.button}>
            {isLoading ? (
              <>
                <div style={{ width: '20px', height: '20px', border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                Sending...
              </>
            ) : (
              <>
                Send Reset Link
                <ArrowRight style={{ width: '20px', height: '20px' }} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/auth/login" style={styles.link}>
            <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back to login
          </Link>
        </div>

        <div style={{ marginTop: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', padding: '1rem', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', textAlign: 'center', fontSize: '0.875rem', margin: 0 }}>
            Need help? <a href="mailto:support@ecohealth.com" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>Contact Support</a>
          </p>
        </div>

        <div style={styles.footer}>© 2025 EcoHealth Sentinel. All rights reserved.</div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
