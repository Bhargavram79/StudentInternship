import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiBriefcase, FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const RegisterPage = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
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
            const { data } = await register({ ...form, role: 'STUDENT' });
            loginUser(data);
            toast.success('Account created successfully!');
            navigate('/student');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
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
                                        type="password"
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        required
                                    />
                                </div>
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

