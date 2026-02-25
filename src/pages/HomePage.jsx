import { Link } from 'react-router-dom';
import { FiCheckCircle, FiUsers, FiBarChart2, FiAward, FiArrowRight, FiStar, FiBriefcase, FiHeart, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const HomePage = () => {
    const features = [
        { icon: <FiCheckCircle />, title: 'Task Tracking', desc: 'Organize, assign, and track internship tasks with an intuitive dashboard that keeps everyone on the same page.' },
        { icon: <FiUsers />, title: 'Mentor Feedback', desc: 'Get structured evaluations and personalized feedback from mentors throughout your internship journey.' },
        { icon: <FiBarChart2 />, title: 'Progress Reports', desc: 'Visual progress analytics and detailed reports help you understand growth and identify areas to improve.' },
        { icon: <FiAward />, title: 'Certifications', desc: 'Earn verified certificates upon successful completion of your internship to showcase your achievements.' },
    ];

    const steps = [
        { num: '01', title: 'Create Account', desc: 'Sign up as a student or employer in just a few clicks.' },
        { num: '02', title: 'Browse Opportunities', desc: 'Explore remote internships that match your skills and interests.' },
        { num: '03', title: 'Track Progress', desc: 'Complete tasks, submit reports, and monitor your growth.' },
        { num: '04', title: 'Get Evaluated', desc: 'Receive mentor feedback and earn your completion certificate.' },
    ];

    const testimonials = [
        { name: 'Priya Sharma', role: 'Software Intern', text: 'InternHub made my remote internship experience seamless. The task tracking and mentor feedback features are incredibly helpful!', rating: 5 },
        { name: 'Arjun Patel', role: 'Design Intern', text: 'I loved how organized everything was. The progress reports gave me clarity on what I needed to improve.', rating: 5 },
        { name: 'Sneha Reddy', role: 'Employer', text: 'Managing interns remotely has never been easier. InternHub\'s evaluation tools save us hours every week.', rating: 5 },
    ];

    return (
        <div className="public-page">
            <Navbar />

            {/* Hero */}
            <section className="hero-section">
                <div className="hero-shapes">
                    <div className="hero-shape hero-shape-1"></div>
                    <div className="hero-shape hero-shape-2"></div>
                    <div className="hero-shape hero-shape-3"></div>
                </div>
                <div className="hero-content">
                    <div className="hero-badge">🚀 The #1 Remote Internship Platform</div>
                    <h1>Launch Your Career with <span className="hero-highlight">InternHub</span></h1>
                    <p className="hero-subtitle">
                        A modern platform to discover remote internships, track your progress, and receive
                        real-time mentor feedback — all in one beautiful workspace.
                    </p>
                    <div className="hero-actions">
                        <Link to="/register" className="hero-btn hero-btn-primary">
                            Get Started Free <FiArrowRight />
                        </Link>
                        <Link to="/contact" className="hero-btn hero-btn-secondary">
                            Learn More
                        </Link>
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <strong>2,500+</strong>
                            <span>Active Interns</span>
                        </div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat">
                            <strong>150+</strong>
                            <span>Companies</span>
                        </div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat">
                            <strong>98%</strong>
                            <span>Satisfaction</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features-section" id="features">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-tag">Features</span>
                        <h2>Everything you need to succeed</h2>
                        <p>Powerful tools designed to make remote internships productive and enjoyable.</p>
                    </div>
                    <div className="features-grid">
                        {features.map((f, i) => (
                            <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-tag">How It Works</span>
                        <h2>Simple steps to get started</h2>
                        <p>From signup to certification — your complete internship journey.</p>
                    </div>
                    <div className="steps-grid">
                        {steps.map((s, i) => (
                            <div className="step-card" key={i}>
                                <div className="step-num">{s.num}</div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                                {i < steps.length - 1 && <div className="step-connector"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-tag">Testimonials</span>
                        <h2>Loved by students & employers</h2>
                        <p>See what our community has to say about InternHub.</p>
                    </div>
                    <div className="testimonials-grid">
                        {testimonials.map((t, i) => (
                            <div className="testimonial-card" key={i}>
                                <div className="testimonial-stars">
                                    {[...Array(t.rating)].map((_, j) => <FiStar key={j} />)}
                                </div>
                                <p className="testimonial-text">"{t.text}"</p>
                                <div className="testimonial-author">
                                    <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                                    <div>
                                        <strong>{t.name}</strong>
                                        <span>{t.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="cta-section">
                <div className="section-container">
                    <div className="cta-card">
                        <h2>Ready to start your journey?</h2>
                        <p>Join thousands of students and employers on InternHub today.</p>
                        <Link to="/register" className="hero-btn hero-btn-primary">
                            Create Free Account <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="public-footer">
                <div className="footer-inner">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <FiBriefcase />
                            <span>InternHub</span>
                        </div>
                        <p>Empowering the next generation of professionals through structured remote internships.</p>
                        <div className="footer-social">
                            <a href="#" aria-label="Github"><FiGithub /></a>
                            <a href="#" aria-label="Twitter"><FiTwitter /></a>
                            <a href="#" aria-label="LinkedIn"><FiLinkedin /></a>
                        </div>
                    </div>
                    <div className="footer-links-group">
                        <h4>Platform</h4>
                        <Link to="/register">Sign Up</Link>
                        <Link to="/login">Log In</Link>
                        <Link to="/contact">Contact</Link>
                    </div>
                    <div className="footer-links-group">
                        <h4>Resources</h4>
                        <a href="#">Help Center</a>
                        <a href="#">Blog</a>
                        <a href="#">FAQ</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>Made with <FiHeart className="footer-heart" /> by InternHub Team · © 2026</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
