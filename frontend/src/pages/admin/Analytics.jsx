import { useState, useEffect } from 'react';
import { getAllApplications, getAllTasks, getInternships, getStudents, getAllFeedback, getAllReports, getCertificates } from '../../services/api';
import { FiTrendingUp, FiUsers, FiBriefcase, FiCheckSquare, FiAward, FiBarChart2, FiPieChart, FiDownload } from 'react-icons/fi';
import { exportToCSV, formatAnalyticsForExport } from '../../utils/exportCSV';

const Analytics = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [apps, tasks, ints, stus, fb, reps, certs] = await Promise.all([
                    getAllApplications(), getAllTasks(), getInternships(), getStudents(),
                    getAllFeedback(), getAllReports(), getCertificates(),
                ]);
                const t = tasks.data;
                const a = apps.data;
                const f = fb.data;

                // Mode distribution
                const modeMap = {};
                ints.data.forEach(i => { modeMap[i.mode] = (modeMap[i.mode] || 0) + 1; });

                // Type distribution
                const typeMap = {};
                ints.data.forEach(i => { typeMap[i.type] = (typeMap[i.type] || 0) + 1; });

                // Tasks by status
                const taskStatus = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
                t.forEach(tk => { if (taskStatus[tk.status] !== undefined) taskStatus[tk.status]++; });

                // App acceptance rate
                const accepted = a.filter(x => x.status === 'ACCEPTED').length;
                const acceptRate = a.length > 0 ? Math.round((accepted / a.length) * 100) : 0;

                // Avg rating
                const avgRating = f.length > 0 ? (f.reduce((s, x) => s + x.rating, 0) / f.length).toFixed(1) : '—';

                // Top students by completed tasks
                const studentTaskMap = {};
                t.filter(tk => tk.status === 'DONE').forEach(tk => {
                    const sid = tk.assignedTo?.id;
                    if (sid) {
                        if (!studentTaskMap[sid]) studentTaskMap[sid] = { name: tk.assignedTo.name, userId: tk.assignedTo.userId, count: 0 };
                        studentTaskMap[sid].count++;
                    }
                });
                const topStudents = Object.values(studentTaskMap).sort((a, b) => b.count - a.count).slice(0, 5);

                // Company popularity
                const companyMap = {};
                a.forEach(x => {
                    const c = x.internship?.company;
                    if (c) companyMap[c] = (companyMap[c] || 0) + 1;
                });
                const topCompanies = Object.entries(companyMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

                setData({
                    totalInternships: ints.data.length, totalStudents: stus.data.length,
                    totalApps: a.length, totalTasks: t.length, totalReports: reps.data.length,
                    totalCerts: certs.data.length, totalFeedback: f.length,
                    modeMap, typeMap, taskStatus, acceptRate, avgRating,
                    topStudents, topCompanies,
                });
            } catch (err) { console.error(err); }
        };
        fetchAll();
    }, []);

    if (!data) return <div className="dashboard-page"><p>Loading analytics...</p></div>;

    const maxTaskStatus = Math.max(data.taskStatus.TODO, data.taskStatus.IN_PROGRESS, data.taskStatus.DONE, 1);
    const maxCompany = data.topCompanies.length > 0 ? data.topCompanies[0][1] : 1;
    const maxStudentTasks = data.topStudents.length > 0 ? data.topStudents[0].count : 1;

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1><FiTrendingUp /> Platform Analytics</h1>
                    <p>Comprehensive overview of platform performance</p>
                </div>
                <button className="btn btn-outline" onClick={() => exportToCSV(formatAnalyticsForExport(data), 'InternHub_Analytics')}>
                    <FiDownload /> Export Report
                </button>
            </div>

            {/* Key Metrics */}
            <div className="analytics-metrics">
                <div className="metric-card"><span className="metric-num" style={{ color: '#4361EE' }}>{data.totalInternships}</span><span className="metric-label">Internships</span></div>
                <div className="metric-card"><span className="metric-num" style={{ color: '#7C5CFC' }}>{data.totalStudents}</span><span className="metric-label">Students</span></div>
                <div className="metric-card"><span className="metric-num" style={{ color: '#f59e0b' }}>{data.totalApps}</span><span className="metric-label">Applications</span></div>
                <div className="metric-card"><span className="metric-num" style={{ color: '#10b981' }}>{data.totalTasks}</span><span className="metric-label">Tasks</span></div>
                <div className="metric-card"><span className="metric-num" style={{ color: '#ef4444' }}>{data.totalReports}</span><span className="metric-label">Reports</span></div>
                <div className="metric-card"><span className="metric-num" style={{ color: '#06d6a0' }}>{data.totalCerts}</span><span className="metric-label">Certificates</span></div>
                <div className="metric-card"><span className="metric-num" style={{ color: '#d97706' }}>{data.avgRating}★</span><span className="metric-label">Avg Rating</span></div>
                <div className="metric-card"><span className="metric-num" style={{ color: '#10b981' }}>{data.acceptRate}%</span><span className="metric-label">Accept Rate</span></div>
            </div>

            <div className="dashboard-grid-2col">
                {/* Internship Mode Distribution */}
                <div className="card dashboard-card">
                    <h3><FiBriefcase /> Internship Modes</h3>
                    <div className="css-bar-chart" style={{ marginTop: '1rem' }}>
                        {Object.entries(data.modeMap).map(([mode, count]) => (
                            <div key={mode} className="bar-chart-item">
                                <span className="bar-label">{mode}</span>
                                <div className="bar-track">
                                    <div className="bar-fill done" style={{ width: `${(count / data.totalInternships) * 100}%` }}></div>
                                </div>
                                <span className="bar-value">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Companies */}
                <div className="card dashboard-card">
                    <h3><FiPieChart /> Most Applied Companies</h3>
                    <div className="css-bar-chart" style={{ marginTop: '1rem' }}>
                        {data.topCompanies.map(([company, count]) => (
                            <div key={company} className="bar-chart-item">
                                <span className="bar-label" style={{ width: '140px', fontSize: '0.75rem' }}>{company.length > 18 ? company.substring(0, 18) + '...' : company}</span>
                                <div className="bar-track">
                                    <div className="bar-fill in-progress" style={{ width: `${(count / maxCompany) * 100}%` }}></div>
                                </div>
                                <span className="bar-value">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="dashboard-grid-2col">
                {/* Top Performers */}
                <div className="card dashboard-card">
                    <h3><FiAward /> Top Performers</h3>
                    <div className="top-performers-list">
                        {data.topStudents.map((s, i) => (
                            <div key={i} className="performer-row">
                                <span className="performer-rank">#{i + 1}</span>
                                <div className="user-avatar-sm">{s.name?.charAt(0)}</div>
                                <div className="performer-info">
                                    <strong>{s.name}</strong>
                                    <span className="user-id-badge">{s.userId}</span>
                                </div>
                                <div className="performer-bar-wrap">
                                    <div className="mini-progress-bar">
                                        <div className="mini-progress-fill" style={{ width: `${(s.count / maxStudentTasks) * 100}%` }}></div>
                                    </div>
                                </div>
                                <span className="performer-count">{s.count} done</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Internship Type */}
                <div className="card dashboard-card">
                    <h3><FiBarChart2 /> Internship Types</h3>
                    <div className="type-distribution">
                        {Object.entries(data.typeMap).map(([type, count]) => (
                            <div key={type} className="type-card">
                                <span className="type-emoji">{type === 'Paid' ? '💰' : '🆓'}</span>
                                <span className="type-count">{count}</span>
                                <span className="type-label">{type}</span>
                                <span className="type-percent">{Math.round((count / data.totalInternships) * 100)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
