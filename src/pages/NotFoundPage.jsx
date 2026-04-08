import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const NotFoundPage = () => {
    return (
        <div className="public-page">
            <Navbar />
            <div className="not-found-page">
                <div className="not-found-content">
                    <div className="not-found-icon">
                        <FiAlertCircle />
                    </div>
                    <div className="not-found-glitch" data-text="404">404</div>
                    <h1>Page Not Found</h1>
                    <p>Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
                    <div className="not-found-actions">
                        <Link to="/" className="hero-btn hero-btn-primary">
                            <FiHome /> Go Home
                        </Link>
                        <button onClick={() => window.history.back()} className="hero-btn hero-btn-secondary">
                            <FiArrowLeft /> Go Back
                        </button>
                    </div>
                </div>
                <div className="not-found-shapes">
                    <div className="nf-shape nf-shape-1"></div>
                    <div className="nf-shape nf-shape-2"></div>
                    <div className="nf-shape nf-shape-3"></div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
