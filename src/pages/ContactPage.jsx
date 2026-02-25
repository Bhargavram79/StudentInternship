import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiSend, FiChevronDown, FiBriefcase, FiHeart, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const ContactPage = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [activeAccordion, setActiveAccordion] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        setForm({ name: '', email: '', subject: '', message: '' });
    };

    const faqs = [
        { q: 'How do I sign up as a student?', a: 'Click the "Sign Up" button on the top right, select "Student" as your role, fill in your details, and you\'re ready to start browsing internships!' },
        { q: 'Is InternHub free to use?', a: 'Yes! Students can sign up and use InternHub completely free. Employers can post internship listings and manage interns at no cost during our beta period.' },
        { q: 'How do I get feedback from my mentor?', a: 'Once assigned to an internship, your mentor can evaluate your submitted tasks and provide structured feedback through the platform.' },
        { q: 'Can I track multiple internships?', a: 'Currently, students can be active in one internship at a time to ensure focus and quality, but you can apply to multiple listings.' },
    ];

    return (
        <div className="public-page">
            <Navbar />

            <section className="contact-hero">
                <div className="hero-shapes">
                    <div className="hero-shape hero-shape-1"></div>
                    <div className="hero-shape hero-shape-2"></div>
                </div>
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-tag">Contact Us</span>
                        <h1>We'd love to hear from you</h1>
                        <p>Have questions or feedback? Reach out and our team will get back to you within 24 hours.</p>
                    </div>
                </div>
            </section>

            <section className="contact-main">
                <div className="section-container">
                    <div className="contact-grid">
                        {/* Form */}
                        <div className="contact-form-card">
                            <h3>Send us a message</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="contact-form-row">
                                    <div className="contact-field">
                                        <label>Your Name</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="contact-field">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="contact-field">
                                    <label>Subject</label>
                                    <input
                                        type="text"
                                        placeholder="How can we help?"
                                        value={form.subject}
                                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="contact-field">
                                    <label>Message</label>
                                    <textarea
                                        rows="5"
                                        placeholder="Tell us more about your question..."
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="contact-submit-btn">
                                    <FiSend /> Send Message
                                </button>
                            </form>
                        </div>

                        {/* Info */}
                        <div className="contact-info-side">
                            <a href="mailto:2400031554@kluniversity.in" className="contact-info-card contact-info-link">
                                <div className="contact-info-icon"><FiMail /></div>
                                <div>
                                    <h4>Email</h4>
                                    <p>2400031554@kluniversity.in</p>
                                </div>
                            </a>
                            <a href="https://wa.me/917382570450" target="_blank" rel="noopener noreferrer" className="contact-info-card contact-info-link">
                                <div className="contact-info-icon"><FiPhone /></div>
                                <div>
                                    <h4>Phone</h4>
                                    <p>+91 7382570450</p>
                                </div>
                            </a>
                            <div className="contact-info-card">
                                <div className="contact-info-icon"><FiMapPin /></div>
                                <div>
                                    <h4>Location</h4>
                                    <p>Hyderabad, India</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="faq-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-tag">FAQ</span>
                        <h2>Frequently asked questions</h2>
                    </div>
                    <div className="faq-list">
                        {faqs.map((faq, i) => (
                            <div className={`faq-item ${activeAccordion === i ? 'open' : ''}`} key={i}>
                                <button className="faq-question" onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}>
                                    <span>{faq.q}</span>
                                    <FiChevronDown className="faq-chevron" />
                                </button>
                                <div className="faq-answer">
                                    <p>{faq.a}</p>
                                </div>
                            </div>
                        ))}
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

export default ContactPage;
