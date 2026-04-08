import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiBriefcase, FiUser, FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const RegisterPage = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const getPasswordStrength = (pwd) => {
        if (!pwd) return { level: 0, label: '', color: '' };
        let score = 0;
        if (pwd.length >= 6) score++;
        if (pwd.length >= 10) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        if (score <= 1) return { level: 1, label: 'Weak', color: '#ef4444' };
        if (score <= 3) return { level: 2, label: 'Medium', color: '#f59e0b' };
        return { level: 3, label: 'Strong', color: '#10b981' };
    };

    const pwdStrength = getPasswordStrength(form.password);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) {
            toast.error('Please fill in all fields');
            return;
        }
        if (form.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            // Always register as STUDENT — admin accounts are created by existing admins only
            const res = await register({ ...form, role: 'STUDENT' });
            const userData = res.data;
            loginUser(userData);
            toast.success('Account created successfully!');
            navigate('/student');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="public-page">
            <Navbar />
            <div className="public-auth-page">
                <div className="public-auth-container">
                    <div className="public-auth-left">
                        <div className="public-auth-brand">
                            <FiBriefcase className="public-auth-brand-icon" />
                            <h1>Join InternHub</h1>
                            <p>Create your student account and start your internship journey today.</p>
                        </div>
                        <div className="public-auth-features">
                            <div className="public-auth-feature">
                                <span className="public-feature-dot"></span>
                                <span>Browse & apply for internships</span>
                            </div>
                            <div className="public-auth-feature">
                                <span className="public-feature-dot"></span>
                                <span>Track tasks & submit reports</span>
                            </div>
                            <div className="public-auth-feature">
                                <span className="public-feature-dot"></span>
                                <span>Get mentor feedback & certificates</span>
                            </div>
                        </div>
                    </div>
                    <div className="public-auth-right">
                        <form className="public-auth-form" onSubmit={handleSubmit}>
                            <h2>Create Student Account</h2>
                            <p className="public-auth-subtitle">Get started with InternHub in seconds</p>
                            <div className="public-form-group">
                                <label>Full Name</label>
                                <div className="public-input-wrap">
                                    <FiUser className="public-input-icon" />
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="public-form-group">
                                <label>Email Address</label>
                                <div className="public-input-wrap">
                                    <FiMail className="public-input-icon" />
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="public-form-group">
                                <label>Password</label>
                                <div className="public-input-wrap">
                                    <FiLock className="public-input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        required
                                    />
                                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                                {form.password && (
                                    <div className="password-strength">
                                        <div className="strength-bar">
                                            <div className="strength-fill" style={{ width: `${(pwdStrength.level / 3) * 100}%`, background: pwdStrength.color }}></div>
                                        </div>
                                        <span className="strength-label" style={{ color: pwdStrength.color }}>{pwdStrength.label}</span>
                                    </div>
                                )}
                            </div>
                            <button type="submit" className="public-auth-btn" disabled={loading}>
                                {loading ? 'Creating Account...' : <>Create Account <FiArrowRight /></>}
                            </button>
                            <p className="public-auth-footer">
                                Already have an account? <Link to="/login">Sign In</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

