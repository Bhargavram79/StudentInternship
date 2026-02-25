import { useState, useEffect } from 'react';
import { getMyTasks, getMyFeedback, getMyApplications } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import { FiCheckSquare, FiTarget, FiAward, FiTrendingUp, FiCalendar, FiStar, FiBriefcase } from 'react-icons/fi';

const MyProgress = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [taskRes, fbRes, appRes] = await Promise.all([
                    getMyTasks(), getMyFeedback(), getMyApplications()
                ]);
                setTasks(taskRes.data);
                setFeedback(fbRes.data);
                setApplications(appRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const totalTasks = tasks.length;
    const done = tasks.filter(t => t.status === 'DONE').length;
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const todo = tasks.filter(t => t.status === 'TODO').length;
    const completionPercent = totalTasks > 0 ? Math.round((done / totalTasks) * 100) : 0;
    const avgRating = feedback.length > 0
        ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
        : '—';

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>My Progress</h1>
                <p>Track your internship journey and performance</p>
            </div>

            {/* Profile Header */}
            <div className="card dashboard-card progress-profile-card">
                <div className="pp-header">
                    <div className="pp-avatar">{user?.name?.charAt(0)}</div>
                    <div className="pp-info">
                        <h2>{user?.name}</h2>
                        <p>{user?.email}</p>
                    </div>
                </div>
                <div className="pp-stats-row">
                    <div className="pp-stat">
                        <FiBriefcase />
                        <div>
                            <strong>{applications.length}</strong>
                            <span>Applications</span>
                        </div>
                    </div>
                    <div className="pp-stat">
                        <FiCheckSquare />
                        <div>
                            <strong>{totalTasks}</strong>
                            <span>Total Tasks</span>
                        </div>
                    </div>
                    <div className="pp-stat">
                        <FiTarget />
                        <div>
                            <strong>{done}</strong>
                            <span>Completed</span>
                        </div>
                    </div>
                    <div className="pp-stat">
                        <FiAward />
                        <div>
                            <strong>{avgRating}</strong>
                            <span>Avg Rating</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid-2col">
                {/* Completion Progress */}
                <div className="card dashboard-card">
                    <div className="card-title-row">
                        <h3><FiTrendingUp /> Completion Progress</h3>
                    </div>
                    <div className="progress-ring-container">
                        <svg viewBox="0 0 120 120" className="progress-ring-svg">
                            <circle cx="60" cy="60" r="50" className="progress-ring-bg" />
                            <circle cx="60" cy="60" r="50" className="progress-ring-fill"
                                strokeDasharray={`${completionPercent * 3.14} ${314 - completionPercent * 3.14}`}
                                strokeDashoffset="0"
                                transform="rotate(-90 60 60)"
                            />
                        </svg>
                        <div className="progress-ring-center">
                            <span className="progress-ring-number">{completionPercent}%</span>
                            <span className="progress-ring-label">Complete</span>
                        </div>
                    </div>
                    <div className="dist-legend" style={{ marginTop: '1rem' }}>
                        <div className="dist-legend-item"><span className="dist-dot done"></span><span>Done ({done})</span></div>
                        <div className="dist-legend-item"><span className="dist-dot in-progress"></span><span>In Progress ({inProgress})</span></div>
                        <div className="dist-legend-item"><span className="dist-dot todo"></span><span>Todo ({todo})</span></div>
                    </div>
                </div>

                {/* Feedback & Ratings */}
                <div className="card dashboard-card">
                    <div className="card-title-row">
                        <h3><FiStar /> My Ratings & Feedback</h3>
                    </div>
                    {feedback.length > 0 ? (
                        <>
                            <div className="rating-overview">
                                <div className="rating-big">
                                    <span className="rating-big-number">{avgRating}</span>
                                    <div className="rating-big-stars">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <FiStar key={s} className={`star ${s <= Math.round(Number(avgRating)) ? 'filled' : ''}`} />
                                        ))}
                                    </div>
                                    <span className="rating-count">{feedback.length} reviews</span>
                                </div>
                                <div className="rating-bars">
                                    {[5, 4, 3, 2, 1].map(r => {
                                        const count = feedback.filter(f => f.rating === r).length;
                                        const pct = feedback.length > 0 ? (count / feedback.length) * 100 : 0;
                                        return (
                                            <div key={r} className="rating-bar-row">
                                                <span>{r}★</span>
                                                <div className="rating-bar-bg">
                                                    <div className="rating-bar-fill" style={{ width: `${pct}%` }}></div>
                                                </div>
                                                <span className="rating-bar-count">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="empty-state-card">No feedback received yet</div>
                    )}
                </div>
            </div>

            {/* All Tasks with Status */}
            <div className="card dashboard-card" style={{ marginTop: '1.5rem' }}>
                <div className="card-title-row">
                    <h3><FiCalendar /> All Tasks Timeline</h3>
                </div>
                <div className="timeline-list">
                    {tasks.map((t) => (
                        <div key={t.id} className="timeline-item">
                            <div className={`timeline-dot ${t.status.toLowerCase().replace('_', '-')}`}></div>
                            <div className="timeline-content">
                                <div className="timeline-header">
                                    <strong>{t.title}</strong>
                                    <StatusBadge status={t.status} />
                                </div>
                                <p className="timeline-desc">{t.description}</p>
                                <div className="timeline-meta">
                                    <span>{t.internship?.title}</span>
                                    {t.dueDate && <span>Due: {t.dueDate}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && <div className="empty-state-card">No tasks assigned yet</div>}
                </div>
            </div>
        </div>
    );
};

export default MyProgress;
