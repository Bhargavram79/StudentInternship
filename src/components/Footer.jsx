import { Link } from 'react-router-dom';
import { FiBriefcase, FiHeart, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
    return (
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
    );
};

export default Footer;
