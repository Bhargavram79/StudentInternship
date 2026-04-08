import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiBriefcase, FiMail, FiLock, FiArrowRight, FiRefreshCw, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

// Generate a random alphanumeric string (no ambiguous chars like 0/O, 1/l/I)
const generateCaptchaText = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let text = '';
    for (let i = 0; i < 6; i++) {
        text += chars[Math.floor(Math.random() * chars.length)];
    }
    return text;
};

const LoginPage = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaError, setCaptchaError] = useState('');
    const canvasRef = useRef(null);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const drawCaptcha = useCallback((text) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width = 220;
        const h = canvas.height = 60;

        // Background
        ctx.fillStyle = '#EEF2F9';
        ctx.fillRect(0, 0, w, h);

        // Noise lines
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * w, Math.random() * h);
            ctx.lineTo(Math.random() * w, Math.random() * h);
            ctx.strokeStyle = `hsl(${Math.random() * 360}, 50%, 70%)`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Noise dots
        for (let i = 0; i < 40; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * w, Math.random() * h, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${Math.random() * 360}, 40%, 65%)`;
            ctx.fill();
        }

        // Draw each character with rotation and color variation
        const colors = ['#4361EE', '#06D6A0', '#7C5CFC', '#2D8CF0', '#0A8F6C', '#5741C2'];
        const charWidth = w / (text.length + 1);
        ctx.textBaseline = 'middle';

        for (let i = 0; i < text.length; i++) {
            ctx.save();
            const x = charWidth * (i + 0.5) + 8;
            const y = h / 2 + (Math.random() * 10 - 5);
            const angle = (Math.random() - 0.5) * 0.5;
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.font = `bold ${22 + Math.floor(Math.random() * 6)}px 'Courier New', monospace`;
            ctx.fillStyle = colors[i % colors.length];
            ctx.fillText(text[i], 0, 0);
            ctx.restore();
        }
    }, []);

    const refreshCaptcha = useCallback(() => {
        const newText = generateCaptchaText();
        setCaptchaText(newText);
        setCaptchaInput('');
        setCaptchaError('');
        drawCaptcha(newText);
    }, [drawCaptcha]);

    useEffect(() => {
        const text = generateCaptchaText();
        setCaptchaText(text);
        // Small delay to ensure canvas is rendered
        setTimeout(() => drawCaptcha(text), 50);
    }, [drawCaptcha]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCaptchaError('');

        if (!captchaInput.trim()) {
            setCaptchaError('Please enter the CAPTCHA code');
            return;
        }
        if (captchaInput.trim().toLowerCase() !== captchaText.toLowerCase()) {
            setCaptchaError('CAPTCHA doesn\'t match. Try again!');
            refreshCaptcha();
            return;
        }

        setLoading(true);
        try {
            const { data } = await login(form);
            loginUser(data);
            toast.success('Login successful!');
            navigate(data.role === 'ADMIN' ? '/admin' : '/student');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials');
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
                            <h1>Welcome Back!</h1>
                            <p>Sign in to continue your internship journey on InternHub.</p>
                        </div>
                        <div className="public-auth-features">
                            <div className="public-auth-feature">
                                <span className="public-feature-dot"></span>
                                <span>Track internship progress in real-time</span>
                            </div>
                            <div className="public-auth-feature">
                                <span className="public-feature-dot"></span>
                                <span>Get mentor feedback & evaluations</span>
                            </div>
                            <div className="public-auth-feature">
                                <span className="public-feature-dot"></span>
                                <span>Manage tasks & submit reports</span>
                            </div>
                        </div>
                    </div>
                    <div className="public-auth-right">
                        <form className="public-auth-form" onSubmit={handleSubmit}>
                            <h2>Sign In</h2>
                            <p className="public-auth-subtitle">Enter your credentials to access your account</p>
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
                            </div>

                            {/* CAPTCHA */}
                            <div className="public-form-group">
                                <label>Enter the code below</label>
                                <div className="captcha-box">
                                    <div className="captcha-display">
                                        <canvas ref={canvasRef} className="captcha-canvas" />
                                        <button type="button" className="captcha-refresh" onClick={refreshCaptcha} aria-label="New CAPTCHA">
                                            <FiRefreshCw />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        className="captcha-input"
                                        placeholder="Type the characters you see"
                                        value={captchaInput}
                                        onChange={(e) => { setCaptchaInput(e.target.value); setCaptchaError(''); }}
                                        autoComplete="off"
                                        spellCheck="false"
                                    />
                                    {captchaError && <span className="captcha-error">{captchaError}</span>}
                                </div>
                            </div>

                            <button type="submit" className="public-auth-btn" disabled={loading}>
                                {loading ? 'Signing in...' : <>Sign In <FiArrowRight /></>}
                            </button>
                            <p className="public-auth-footer">
                                Don't have an account? <Link to="/register">Create one</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
