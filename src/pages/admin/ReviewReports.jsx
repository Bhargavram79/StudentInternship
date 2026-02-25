import { useState, useEffect } from 'react';
import { getAllReports, getAllTasks } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { FiFileText, FiSearch, FiEye, FiX, FiUser, FiCalendar, FiCheckSquare } from 'react-icons/fi';

const ReviewReports = () => {
    const [reports, setReports] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await getAllReports();
                setReports(data);
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, []);

    const filtered = reports.filter(r => {
        const q = search.toLowerCase();
        return !q || r.student?.name?.toLowerCase().includes(q) || r.task?.title?.toLowerCase().includes(q) || r.content?.toLowerCase().includes(q);
    });

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1>Review Reports</h1>
                    <p>Review progress reports submitted by students</p>
                </div>
                <span className="search-count">{filtered.length} report{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
                <div className="filter-search">
                    <FiSearch className="filter-search-icon" />
                    <input type="text" placeholder="Search by student, task or content..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>

            {/* Report Detail Modal */}
            {selectedReport && (
                <div className="report-modal-overlay" onClick={() => setSelectedReport(null)}>
                    <div className="report-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="report-modal-header">
                            <h3><FiFileText /> Report Details</h3>
                            <button className="btn-icon-sm" onClick={() => setSelectedReport(null)}><FiX /></button>
                        </div>
                        <div className="report-modal-body">
                            <div className="report-modal-info">
                                <span><FiUser /> {selectedReport.student?.name}</span>
                                <span><FiCheckSquare /> {selectedReport.task?.title}</span>
                                <span><FiCalendar /> {new Date(selectedReport.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div className="report-modal-content">
                                <h4>Report Content</h4>
                                <p>{selectedReport.content}</p>
                            </div>
                            {selectedReport.hoursWorked && (
                                <div className="report-modal-hours">
                                    <strong>Hours Worked:</strong> {selectedReport.hoursWorked}h
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Task</th>
                            <th>Content</th>
                            <th>Hours</th>
                            <th>Submitted</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(r => (
                            <tr key={r.id}>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-avatar-sm">{r.student?.name?.charAt(0)}</div>
                                        <div>
                                            <strong>{r.student?.name}</strong>
                                            <div className="user-id-badge">{r.student?.userId}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{r.task?.title}</td>
                                <td><span className="text-truncate">{r.content?.substring(0, 60)}...</span></td>
                                <td><strong>{r.hoursWorked || '—'}h</strong></td>
                                <td>{new Date(r.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                                <td>
                                    <button className="btn btn-outline btn-sm" onClick={() => setSelectedReport(r)}>
                                        <FiEye /> View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan="6" className="empty-state">No reports found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReviewReports;
