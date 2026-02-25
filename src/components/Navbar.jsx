import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiBriefcase, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [location]);

    return (
        <nav className={`public-navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand">
                    <div className="navbar-brand-icon">
                        <FiBriefcase />
                    </div>
                    <span>InternHub</span>
                </Link>

                <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
                    <Link to="/" className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                    <Link to="/contact" className={`navbar-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
                    <div className="navbar-cta">
                        <Link to="/login" className="navbar-btn navbar-btn-outline">Log In</Link>
                        <Link to="/register" className="navbar-btn navbar-btn-filled">Sign Up</Link>
                    </div>
                </div>

                <button className="navbar-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
                    {mobileOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
