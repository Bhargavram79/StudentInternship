import { useState, useEffect } from 'react';
import { FiBriefcase, FiCheckSquare, FiMessageSquare, FiFileText, FiTrendingUp, FiCalendar, FiClock, FiAward, FiTarget } from 'react-icons/fi';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import { getMyApplications, getMyTasks, getMyFeedback } from '../../services/api';

const StudentDashboard = () => {
    const [stats, setStats] = useState({ applications: 0, tasks: 0, feedback: 0, completed: 0 });
    const [tasks, setTasks] = useState([]);
    const [feedbackList, setFeedbackList] = useState([]);
    const [taskDistribution, setTaskDistribution] = useState({ todo: 0, inProgress: 0, done: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [appRes, taskRes, fbRes] = await Promise.all([
                    getMyApplications(), getMyTasks(), getMyFeedback(),
                ]);
                const taskData = taskRes.data;
                setStats({
                    applications: appRes.data.length,
                    tasks: taskData.length,
                    feedback: fbRes.data.length,
                    completed: taskData.filter(t => t.status === 'DONE').length,
                });
                setTasks(taskData);
                setFeedbackList(fbRes.data);
                setTaskDistribution({
                    todo: taskData.filter(t => t.status === 'TODO').length,
                    inProgress: taskData.filter(t => t.status === 'IN_PROGRESS').length,
                    done: taskData.filter(t => t.status === 'DONE').length,
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    const totalTasks = taskDistribution.todo + taskDistribution.inProgress + taskDistribution.done;
    const completionPercent = totalTasks > 0 ? Math.round((taskDistribution.done / totalTasks) * 100) : 0;

    // Upcoming deadlines (tasks with due dates)
    const upcomingTasks = tasks
        .filter(t => t.dueDate && t.status !== 'DONE')
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);

    // Average rating
    const avgRating = feedbackList.length > 0
        ? (feedbackList.reduce((sum, f) => sum + f.rating, 0) / feedbackList.length).toFixed(1)
        : '—';

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Student Dashboard</h1>
                <p>Your internship overview</p>
            </div>

            <div className="stats-grid">
                <StatsCard icon={<FiBriefcase />} title="Applications" value={stats.applications} color="#4361EE" />
                <StatsCard icon={<FiCheckSquare />} title="Active Tasks" value={stats.tasks} color="#FFB703" />
                <StatsCard icon={<FiTarget />} title="Completed" value={stats.completed} color="#06D6A0" />
                <StatsCard icon={<FiMessageSquare />} title="Feedback" value={stats.feedback} color="#7C5CFC" />
            </div>

            <div className="dashboard-grid-2col">
                {/* Progress Overview */}
                <div className="card dashboard-card">
                    <div className="card-title-row">
                        <h3><FiTrendingUp /> My Progress</h3>
                        <span className="progress-big-percent">{completionPercent}%</span>
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
                            <span className="progress-ring-number">{taskDistribution.done}</span>
                            <span className="progress-ring-label">of {totalTasks} done</span>
                        </div>
                    </div>
                    <div className="dist-legend" style={{ marginTop: '1rem' }}>
                        <div className="dist-legend-item">
                            <span className="dist-dot done"></span>
                            <span>Done ({taskDistribution.done})</span>
                        </div>
                        <div className="dist-legend-item">
                            <span className="dist-dot in-progress"></span>
                            <span>In Progress ({taskDistribution.inProgress})</span>
                        </div>
                        <div className="dist-legend-item">
                            <span className="dist-dot todo"></span>
                            <span>Todo ({taskDistribution.todo})</span>
                        </div>
                    </div>
                    {avgRating !== '—' && (
                        <div className="progress-avg-rating">
                            <FiAward /> Average Rating: <strong>{avgRating} ★</strong>
                        </div>
                    )}
                </div>

                {/* Upcoming Deadlines */}
                <div className="card dashboard-card">
                    <div className="card-title-row">
                        <h3><FiCalendar /> Upcoming Deadlines</h3>
                    </div>
                    <div className="deadline-list">
                        {upcomingTasks.map((t) => {
                            const daysLeft = Math.ceil((new Date(t.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                            return (
                                <div key={t.id} className={`deadline-item ${daysLeft <= 3 ? 'urgent' : ''}`}>
                                    <div className="deadline-info">
                                        <strong>{t.title}</strong>
                                        <span className="deadline-meta">{t.internship?.title}</span>
                                    </div>
                                    <div className="deadline-right">
                                        <StatusBadge status={t.status} />
                                        <span className={`deadline-days ${daysLeft <= 3 ? 'urgent' : ''}`}>
                                            <FiClock /> {daysLeft > 0 ? `${daysLeft}d left` : 'Overdue'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        {upcomingTasks.length === 0 && (
                            <div className="empty-state-card">No upcoming deadlines 🎉</div>
                        )}
                    </div>

                    {/* Recent Feedback */}
                    <div style={{ marginTop: '1.5rem' }}>
                        <h4 className="sub-title"><FiMessageSquare /> Recent Feedback</h4>
                        {feedbackList.slice(0, 3).map((f) => (
                            <div key={f.id} className="mini-feedback-card">
                                <div className="mini-fb-header">
                                    <span className="mini-fb-task">{f.task?.title || 'General'}</span>
                                    <span className="mini-fb-rating">{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</span>
                                </div>
                                <p className="mini-fb-comment">{f.comment?.substring(0, 100)}{f.comment?.length > 100 ? '...' : ''}</p>
                            </div>
                        ))}
                        {feedbackList.length === 0 && <div className="empty-state-card">No feedback yet</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
