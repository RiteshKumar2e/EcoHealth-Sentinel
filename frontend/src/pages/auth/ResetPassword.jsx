import { useState } from 'react';
import { Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ResetPassword() {
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') || 'user@example.com';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters');
        }
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setIsLoading(true);

        // Simulate Reset Process
        setTimeout(() => {
            // Save to localStorage so Login can use it
            const userData = JSON.parse(localStorage.getItem('user_vault') || '{}');
            userData[email] = formData.password;
            localStorage.setItem('user_vault', JSON.stringify(userData));

            setIsLoading(false);
            setIsSuccess(true);
        }, 1500);
    };

    return (
        <div className="reset-page-wrapper" style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f8fafc',
            padding: '1.5rem',
            fontFamily: "'Inter', sans-serif"
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    background: '#ffffff',
                    borderRadius: '40px',
                    padding: '4rem 3rem',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                    textAlign: 'left'
                }}
            >
                {isSuccess ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-block', padding: '1rem', background: '#ecfdf5', borderRadius: '50%', marginBottom: '2rem' }}>
                            <CheckCircle size={64} color="#10b981" />
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Success!</h1>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2.5rem' }}>Your password has been reset successfully.</p>
                        <Link to="/auth/login" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            color: '#3b82f6',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '1.1rem'
                        }}>
                            <ArrowLeft size={20} /> Back to Login
                        </Link>
                    </div>
                ) : (
                    <>
                        <h1 style={{
                            fontSize: '3rem',
                            fontWeight: '800',
                            color: '#1e293b',
                            marginBottom: '0.75rem',
                            letterSpacing: '-0.03em'
                        }}>New Password</h1>

                        <p style={{
                            color: '#64748b',
                            fontSize: '1.15rem',
                            marginBottom: '2.5rem',
                            fontWeight: '450'
                        }}>
                            Set a secure password for <br />
                            <span style={{ color: '#3b82f6', fontWeight: '600' }}>{email}</span>
                        </p>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                            {/* New Password Field */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '1rem', fontWeight: '600', color: '#334155' }}>New Password</label>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        style={{
                                            width: '100%',
                                            padding: '1.1rem 1.25rem',
                                            borderRadius: '16px',
                                            border: '1.5px solid #000',
                                            fontSize: '1.1rem',
                                            outline: 'none',
                                            background: '#fff'
                                        }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '1.25rem',
                                            background: 'none',
                                            border: 'none',
                                            color: '#94a3b8',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '1rem', fontWeight: '600', color: '#334155' }}>Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    style={{
                                        width: '100%',
                                        padding: '1.1rem 1.25rem',
                                        borderRadius: '16px',
                                        border: '1.5px solid #e2e8f0',
                                        fontSize: '1.1rem',
                                        outline: 'none',
                                        background: '#f8fafc'
                                    }}
                                    required
                                />
                            </div>

                            {error && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.95rem', fontWeight: 500 }}>
                                    <AlertCircle size={18} /> {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    background: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '16px',
                                    padding: '1.1rem',
                                    fontSize: '1.2rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)',
                                    marginTop: '1rem',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 12px 20px rgba(16, 185, 129, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(16, 185, 129, 0.2)';
                                }}
                            >
                                {isLoading ? <div className="reset-spinner" /> : <>Reset Password <ArrowRight size={22} /></>}
                            </button>
                        </form>

                        <Link to="/auth/login" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            marginTop: '2.5rem',
                            color: '#3b82f6',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '1.1rem'
                        }}>
                            <ArrowLeft size={18} /> Back to Login
                        </Link>
                    </>
                )}
            </motion.div>

            <style>{`
        .reset-spinner {
            width: 24px;
            height: 24px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spinReset 0.8s linear infinite;
        }
        @keyframes spinReset {
            to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
