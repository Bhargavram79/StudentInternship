import { useState, useEffect } from 'react';
import { FiBriefcase, FiUsers, FiCheckSquare, FiFileText, FiTrendingUp, FiActivity, FiClock, FiAward, FiMessageSquare, FiBarChart2, FiPieChart } from 'react-icons/fi';
import StatsCard from '../../components/StatsCard';
import { getAllApplications, getAllTasks, getInternships, getAllReports, getStudents, getAllFeedback } from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ internships: 0, applications: 0, tasks: 0, reports: 0, students: 0, feedback: 0 });
    const [recentActivity, setRecentActivity] = useState([]);
    const [studentProgress, setStudentProgress] = useState([]);
    const [taskDistribution, setTaskDistribution] = useState({ todo: 0, inProgress: 0, done: 0 });
    const [appDistribution, setAppDistribution] = useState({ accepted: 0, pending: 0, rejected: 0 });
    const [allFeedback, setAllFeedback] = useState([]);
    const [ratingDistribution, setRatingDistribution] = useState([0, 0, 0, 0, 0]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [intRes, appRes, taskRes, repRes, stuRes, fbRes] = await Promise.all([
                    getInternships(), getAllApplications(), getAllTasks(), getAllReports(), getStudents(), getAllFeedback(),
                ]);
                setStats({
                    internships: intRes.data.length,
                    applications: appRes.data.length,
                    tasks: taskRes.data.length,
                    reports: repRes.data.length,
                    students: stuRes.data.length,
                    feedback: fbRes.data.length,
                });

                // Task distribution
                const tasks = taskRes.data;
                setTaskDistribution({
                    todo: tasks.filter(t => t.status === 'TODO').length,
                    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
                    done: tasks.filter(t => t.status === 'DONE').length,
                });

                // Application distribution
                const apps = appRes.data;
                setAppDistribution({
                    accepted: apps.filter(a => a.status === 'ACCEPTED').length,
                    pending: apps.filter(a => a.status === 'PENDING').length,
                    rejected: apps.filter(a => a.status === 'REJECTED').length,
                });

                // All feedback
                const fb = fbRes.data;
                setAllFeedback(fb);

                // Rating distribution [1★, 2★, 3★, 4★, 5★]
                const rd = [0, 0, 0, 0, 0];
                fb.forEach(f => { if (f.rating >= 1 && f.rating <= 5) rd[f.rating - 1]++; });
                setRatingDistribution(rd);

                // Student progress
                const students = stuRes.data;
                const progress = students.map(s => {
                    const studentTasks = tasks.filter(t => t.assignedTo?.id === s.id);
                    const completed = studentTasks.filter(t => t.status === 'DONE').length;
                    const total = studentTasks.length;
                    const studentFb = fb.filter(f => f.student?.id === s.id);
                    const avgRating = studentFb.length > 0
                        ? (studentFb.reduce((sum, f) => sum + f.rating, 0) / studentFb.length).toFixed(1)
                        : '—';
                    return { ...s, completed, total, avgRating, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
                });
                setStudentProgress(progress.sort((a, b) => b.percent - a.percent));

                // Recent activity
                const activities = [
                    ...apps.map(a => ({ type: 'application', text: `${a.student?.name} applied for ${a.internship?.title}`, time: a.appliedAt, status: a.status })),
                    ...repRes.data.map(r => ({ type: 'report', text: `${r.student?.name} submitted report for "${r.task?.title}"`, time: r.submittedAt })),
                    ...fb.map(f => ({ type: 'feedback', text: `Feedback sent to ${f.student?.name} (${f.rating}★)`, time: f.createdAt })),
                ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);
                setRecentActivity(activities);
            } catch (err) { console.error(err); }
        };
        fetchStats();
    }, []);

    const totalTasks = taskDistribution.todo + taskDistribution.inProgress + taskDistribution.done;
    const totalApps = appDistribution.accepted + appDistribution.pending + appDistribution.rejected;
    const maxRating = Math.max(...ratingDistribution, 1);
    const avgOverall = allFeedback.length > 0
        ? (allFeedback.reduce((s, f) => s + f.rating, 0) / allFeedback.length).toFixed(1)
        : '—';

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Admin Dashboard</h1>
                <p>Overview of your internship management platform</p>
            </div>

            <div className="stats-grid">
                <StatsCard icon={<FiBriefcase />} title="Internships" value={stats.internships} color="#4361EE" />
                <StatsCard icon={<FiFileText />} title="Applications" value={stats.applications} color="#FFB703" />
                <StatsCard icon={<FiCheckSquare />} title="Tasks" value={stats.tasks} color="#06D6A0" />
                <StatsCard icon={<FiUsers />} title="Students" value={stats.students} color="#7C5CFC" />
                <StatsCard icon={<FiActivity />} title="Reports" value={stats.reports} color="#f59e0b" />
                <StatsCard icon={<FiAward />} title="Feedback" value={stats.feedback} color="#ef4444" />
            </div>

            <div className="dashboard-grid-2col">
                {/* Task Progress - Bar Chart */}
                <div className="card dashboard-card">
                    <div className="card-title-row">
                        <h3><FiBarChart2 /> Task Progress</h3>
                    </div>
                    <div className="css-bar-chart">
                        <div className="bar-chart-item">
                            <span className="bar-label">Done</span>
                            <div className="bar-track">
                                <div className="bar-fill done" style={{ width: `${totalTasks > 0 ? (taskDistribution.done / totalTasks) * 100 : 0}%` }}></div>
                            </div>
                            <span className="bar-value">{taskDistribution.done}</span>
                        </div>
                        <div className="bar-chart-item">
                            <span className="bar-label">In Progress</span>
                            <div className="bar-track">
                                <div className="bar-fill in-progress" style={{ width: `${totalTasks > 0 ? (taskDistribution.inProgress / totalTasks) * 100 : 0}%` }}></div>
                            </div>
                            <span className="bar-value">{taskDistribution.inProgress}</span>
                        </div>
                        <div className="bar-chart-item">
                            <span className="bar-label">Todo</span>
                            <div className="bar-track">
                                <div className="bar-fill todo" style={{ width: `${totalTasks > 0 ? (taskDistribution.todo / totalTasks) * 100 : 0}%` }}></div>
                            </div>
                            <span className="bar-value">{taskDistribution.todo}</span>
                        </div>
                    </div>
                    <div className="chart-summary">
                        <span>Total: <strong>{totalTasks}</strong> tasks</span>
                        <span>Completion: <strong>{totalTasks > 0 ? Math.round((taskDistribution.done / totalTasks) * 100) : 0}%</strong></span>
                    </div>
                </div>

                {/* Application Distribution - Donut Chart */}
                <div className="card dashboard-card">
                    <div className="card-title-row">
                        <h3><FiPieChart /> Application Status</h3>
                    </div>
                    <div className="donut-chart-container">
                        <div className="css-donut">
                            <svg viewBox="0 0 120 120">
                                {totalApps > 0 && (() => {
                                    const r = 50;
                                    const c = 2 * Math.PI * r;
                                    const accepted = (appDistribution.accepted / totalApps) * c;
                                    const pending = (appDistribution.pending / totalApps) * c;
                                    const rejected = (appDistribution.rejected / totalApps) * c;
                                    return (
                                        <>
                                            <circle cx="60" cy="60" r={r} fill="none" stroke="#10b981" strokeWidth="12"
                                                strokeDasharray={`${accepted} ${c - accepted}`} strokeDashoffset="0" transform="rotate(-90 60 60)" />
                                            <circle cx="60" cy="60" r={r} fill="none" stroke="#f59e0b" strokeWidth="12"
                                                strokeDasharray={`${pending} ${c - pending}`} strokeDashoffset={`${-accepted}`} transform="rotate(-90 60 60)" />
                                            <circle cx="60" cy="60" r={r} fill="none" stroke="#ef4444" strokeWidth="12"
                                                strokeDasharray={`${rejected} ${c - rejected}`} strokeDashoffset={`${-(accepted + pending)}`} transform="rotate(-90 60 60)" />
                                        </>
                                    );
                                })()}
                                <text x="60" y="55" textAnchor="middle" className="donut-number">{totalApps}</text>
                                <text x="60" y="72" textAnchor="middle" className="donut-label">Total</text>
                            </svg>
                        </div>
                        <div className="donut-legend">
                            <div className="donut-legend-item"><span className="donut-dot" style={{ background: '#10b981' }}></span> Accepted ({appDistribution.accepted})</div>
                            <div className="donut-legend-item"><span className="donut-dot" style={{ background: '#f59e0b' }}></span> Pending ({appDistribution.pending})</div>
                            <div className="donut-legend-item"><span className="donut-dot" style={{ background: '#ef4444' }}></span> Rejected ({appDistribution.rejected})</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid-2col">
                {/* Recent Activity */}
                <div className="card dashboard-card">
                    <div className="card-title-row">
                        <h3><FiClock /> Recent Activity</h3>
                    </div>
                    <div className="activity-feed">
                        {recentActivity.map((a, i) => (
                            <div key={i} className={`activity-item ${a.type}`}>
                                <div className="activity-dot"></div>
                                <div className="activity-content">
                                    <p>{a.text}</p>
                                    <span className="activity-time">{new Date(a.time).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* General Feedback Overview */}
                <div className="card dashboard-card">
                    <div className="card-title-row">
                        <h3><FiMessageSquare /> Feedback Overview</h3>
                        <span className="feedback-avg-badge">{avgOverall} ★ avg</span>
                    </div>
                    {/* Rating Distribution */}
                    <div className="rating-chart">
                        {[5, 4, 3, 2, 1].map(star => (
                            <div key={star} className="rating-chart-row">
                                <span className="rating-star-label">{star}★</span>
                                <div className="rating-chart-bar">
                                    <div className="rating-chart-fill" style={{ width: `${(ratingDistribution[star - 1] / maxRating) * 100}%` }}></div>
                                </div>
                                <span className="rating-chart-count">{ratingDistribution[star - 1]}</span>
                            </div>
                        ))}
                    </div>
                    {/* Recent Feedback */}
                    <div className="feedback-recent-list">
                        {allFeedback.slice(0, 5).map(f => (
                            <div key={f.id} className="mini-feedback-card">
                                <div className="mini-fb-header">
                                    <span className="mini-fb-task">{f.student?.name} — {f.task?.title || 'General'}</span>
                                    <span className="mini-fb-rating">{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</span>
                                </div>
                                <p className="mini-fb-comment">{f.comment?.substring(0, 80)}{f.comment?.length > 80 ? '...' : ''}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Student Progress Table with Bar Chart */}
            <div className="card dashboard-card" style={{ marginTop: '1.5rem' }}>
                <div className="card-title-row">
                    <h3><FiUsers /> Student Progress</h3>
                    <span className="search-count">{studentProgress.length} students</span>
                </div>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Student</th>
                                <th>Email</th>
                                <th>Tasks</th>
                                <th>Progress</th>
                                <th>Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentProgress.map((s) => (
                                <tr key={s.id}>
                                    <td><span className="user-id-badge">{s.userId}</span></td>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar-sm">{s.name?.charAt(0)}</div>
                                            <strong>{s.name}</strong>
                                        </div>
                                    </td>
                                    <td>{s.email}</td>
                                    <td>{s.completed} / {s.total}</td>
                                    <td>
                                        <div className="progress-cell">
                                            <div className="mini-progress-bar">
                                                <div className="mini-progress-fill" style={{ width: `${s.percent}%` }}></div>
                                            </div>
                                            <span className="progress-percent">{s.percent}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`rating-badge ${s.avgRating !== '—' ? 'has-rating' : ''}`}>
                                            {s.avgRating !== '—' ? `${s.avgRating} ★` : '—'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {studentProgress.length === 0 && (
                                <tr><td colSpan="6" className="empty-state">No students found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
