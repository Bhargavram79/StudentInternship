import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiUsers, FiBarChart2, FiAward, FiArrowRight, FiStar, FiBriefcase } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';

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

    const trustedBy = ['KL University', 'TCS', 'Infosys', 'Wipro', 'HCL Tech', 'Tech Mahindra'];

    // Animated counters
    const [countersVisible, setCountersVisible] = useState(false);
    const statsRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setCountersVisible(true); },
            { threshold: 0.5 }
        );
        if (statsRef.current) observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, []);

    const AnimatedCounter = ({ end, suffix = '' }) => {
        const [val, setVal] = useState(0);
        useEffect(() => {
            if (!countersVisible) return;
            let start = 0;
            const duration = 1500;
            const step = (timestamp) => {
                if (!start) start = timestamp;
                const progress = Math.min((timestamp - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                setVal(Math.floor(eased * end));
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        }, [countersVisible, end]);
        return <strong>{val.toLocaleString()}{suffix}</strong>;
    };

    // Smooth scroll for anchor links
    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

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
                {/* Floating Particles */}
                <div className="hero-particles">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="particle" style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                            width: `${2 + Math.random() * 4}px`,
                            height: `${2 + Math.random() * 4}px`,
                        }}></div>
                    ))}
                </div>
                <div className="hero-content">
                    <ScrollReveal direction="down" delay={0.1}>
                        <div className="hero-badge">🚀 The #1 Remote Internship Platform</div>
                    </ScrollReveal>
                    
                    <ScrollReveal direction="up" delay={0.2}>
                        <h1>Launch Your Career with <span className="hero-highlight">InternHub</span></h1>
                    </ScrollReveal>
                    
                    <ScrollReveal direction="up" delay={0.3}>
                        <p className="hero-subtitle">
                            A modern platform to discover remote internships, track your progress, and receive
                            real-time mentor feedback — all in one beautiful workspace.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={0.4}>
                        <div className="hero-actions">
                            <Link to="/register" className="hero-btn hero-btn-primary">
                                Get Started Free <FiArrowRight />
                            </Link>
                            <button onClick={() => scrollToSection('features')} className="hero-btn hero-btn-secondary">
                                Learn More
                            </button>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={0.5}>
                        <div className="hero-stats" ref={statsRef}>
                            <div className="hero-stat">
                                <AnimatedCounter end={2500} suffix="+" />
                                <span>Active Interns</span>
                            </div>
                            <div className="hero-stat-divider"></div>
                            <div className="hero-stat">
                                <AnimatedCounter end={150} suffix="+" />
                                <span>Companies</span>
                            </div>
                            <div className="hero-stat-divider"></div>
                            <div className="hero-stat">
                                <AnimatedCounter end={98} suffix="%" />
                                <span>Satisfaction</span>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Trusted By */}
            <section className="trusted-section">
                <div className="section-container">
                    <ScrollReveal delay={0.1}>
                        <p className="trusted-label">Trusted by students and employers at</p>
                        <div className="trusted-logos">
                            {trustedBy.map((name, i) => (
                                <div key={i} className="trusted-logo-item">
                                    <span>{name}</span>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Features */}
            <section className="features-section" id="features">
                <div className="section-container">
                    <ScrollReveal delay={0.1}>
                        <div className="section-header">
                            <span className="section-tag">Features</span>
                            <h2>Everything you need to succeed</h2>
                            <p>Powerful tools designed to make remote internships productive and enjoyable.</p>
                        </div>
                    </ScrollReveal>
                    
                    <div className="features-grid">
                        {features.map((f, i) => (
                            <ScrollReveal key={i} direction="up" delay={0.1 * (i + 1)} className="feature-card-wrapper">
                                <div className="feature-card">
                                    <div className="feature-icon">{f.icon}</div>
                                    <h3>{f.title}</h3>
                                    <p>{f.desc}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works-section" id="how-it-works">
                <div className="section-container">
                    <ScrollReveal delay={0.1}>
                        <div className="section-header">
                            <span className="section-tag">How It Works</span>
                            <h2>Simple steps to get started</h2>
                            <p>From signup to certification — your complete internship journey.</p>
                        </div>
                    </ScrollReveal>

                    <div className="steps-grid">
                        {steps.map((s, i) => (
                            <ScrollReveal key={i} direction="up" delay={0.1 * (i + 1)}>
                                <div className="step-card">
                                    <div className="step-num">{s.num}</div>
                                    <h3>{s.title}</h3>
                                    <p>{s.desc}</p>
                                    {i < steps.length - 1 && <div className="step-connector"></div>}
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section">
                <div className="section-container">
                    <ScrollReveal delay={0.1}>
                        <div className="section-header">
                            <span className="section-tag">Testimonials</span>
                            <h2>Loved by students & employers</h2>
                            <p>See what our community has to say about InternHub.</p>
                        </div>
                    </ScrollReveal>

                    <div className="testimonials-grid">
                        {testimonials.map((t, i) => (
                            <ScrollReveal key={i} delay={0.2 * (i + 1)} direction="scale">
                                <div className="testimonial-card">
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
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="cta-section">
                <div className="section-container">
                    <ScrollReveal delay={0.2} direction="up">
                        <div className="cta-card">
                            <h2>Ready to start your journey?</h2>
                            <p>Join thousands of students and employers on InternHub today.</p>
                            <Link to="/register" className="hero-btn hero-btn-primary">
                                Create Free Account <FiArrowRight />
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>


            <Footer />
        </div>
    );
};

export default HomePage;
