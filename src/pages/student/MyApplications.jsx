import { useState, useEffect } from 'react';
import { getMyApplications } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { FiClock, FiBriefcase, FiMapPin, FiGlobe, FiDollarSign } from 'react-icons/fi';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await getMyApplications();
                setApplications(data.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)));
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, []);

    const statusCount = {
        total: applications.length,
        accepted: applications.filter(a => a.status === 'ACCEPTED').length,
        pending: applications.filter(a => a.status === 'PENDING').length,
        rejected: applications.filter(a => a.status === 'REJECTED').length,
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>My Applications</h1>
                <p>Track all your internship applications</p>
            </div>

            {/* Status Summary */}
            <div className="app-status-summary">
                <div className="app-status-chip total">
                    <span className="app-status-num">{statusCount.total}</span>
                    <span>Total</span>
                </div>
                <div className="app-status-chip accepted">
                    <span className="app-status-num">{statusCount.accepted}</span>
                    <span>Accepted</span>
                </div>
                <div className="app-status-chip pending">
                    <span className="app-status-num">{statusCount.pending}</span>
                    <span>Pending</span>
                </div>
                <div className="app-status-chip rejected">
                    <span className="app-status-num">{statusCount.rejected}</span>
                    <span>Rejected</span>
                </div>
            </div>

            {/* Application Timeline */}
            <div className="app-timeline">
                {applications.map((app, idx) => (
                    <div key={app.id} className={`app-timeline-item ${app.status.toLowerCase()}`}>
                        <div className="app-timeline-dot-container">
                            <div className={`app-timeline-dot ${app.status.toLowerCase()}`}></div>
                            {idx < applications.length - 1 && <div className="app-timeline-line"></div>}
                        </div>
                        <div className="app-timeline-card">
                            <div className="app-timeline-header">
                                <div>
                                    <h3>{app.internship?.title}</h3>
                                    <span className="app-timeline-company">{app.internship?.company}</span>
                                </div>
                                <StatusBadge status={app.status} />
                            </div>
                            <div className="app-timeline-meta">
                                {app.internship?.mode && (
                                    <span className="app-meta-tag">
                                        {app.internship.mode === 'Online' ? <FiGlobe /> : <FiMapPin />} {app.internship.mode}
                                    </span>
                                )}
                                {app.internship?.duration && (
                                    <span className="app-meta-tag"><FiClock /> {app.internship.duration}</span>
                                )}
                                {app.internship?.type && (
                                    <span className="app-meta-tag">
                                        {app.internship.type === 'Paid' ? <FiDollarSign /> : <FiBriefcase />} {app.internship.type}
                                    </span>
                                )}
                                {app.internship?.stipend && (
                                    <span className="app-meta-tag stipend">{app.internship.stipend}</span>
                                )}
                            </div>
                            <div className="app-timeline-date">
                                Applied on {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                        </div>
                    </div>
                ))}
                {applications.length === 0 && (
                    <div className="empty-state-card">You haven't applied to any internships yet.</div>
                )}
            </div>
        </div>
    );
};

export default MyApplications;
