import { useState, useEffect } from 'react';
import { getAllReports, gradeReport } from '../../services/api';
import { FiFileText, FiSearch, FiEye, FiX, FiUser, FiCalendar, FiCheckSquare, FiFile, FiAward, FiStar, FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { exportToCSV, formatReportsForExport } from '../../utils/exportCSV';

const ReviewReports = () => {
    const [reports, setReports] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);
    const [grading, setGrading] = useState(false);
    const [filterGrade, setFilterGrade] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data } = await getAllReports();
            setReports(data);
        } catch (err) { console.error(err); }
    };

    const handleGrade = async (reportId, grade) => {
        setGrading(true);
        try {
            await gradeReport(reportId, grade);
            toast.success(`Report graded: ${grade}`);
            fetchData();
            if (selectedReport?.id === reportId) {
                setSelectedReport(prev => ({ ...prev, grade }));
            }
        } catch (err) { toast.error('Failed to grade report'); }
        finally { setGrading(false); }
    };

    const viewPdf = (fileData) => {
        if (fileData) {
            const win = window.open();
            win.document.write(`<iframe src="${fileData}" style="width:100%;height:100%;border:none;"></iframe>`);
        }
    };

    const gradeColors = { 'A+': '#10b981', 'A': '#06d6a0', 'B+': '#3b82f6', 'B': '#60a5fa', 'C+': '#f59e0b', 'C': '#fbbf24' };
    const grades = ['A+', 'A', 'B+', 'B', 'C+', 'C'];

    const filtered = reports.filter(r => {
        const q = search.toLowerCase();
        const matchSearch = !q || r.student?.name?.toLowerCase().includes(q) || r.task?.title?.toLowerCase().includes(q) || r.content?.toLowerCase().includes(q);
        const matchGrade = filterGrade === 'all' || (filterGrade === 'ungraded' ? !r.grade : filterGrade === 'graded' ? !!r.grade : true);
        return matchSearch && matchGrade;
    });

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1>Review Reports</h1>
                    <p>Review progress reports and assign grades</p>
                </div>
                <div className="header-stats-row">
                    <div className="mini-stat"><strong>{reports.length}</strong><span>Total</span></div>
                    <div className="mini-stat"><strong>{reports.filter(r => !r.grade).length}</strong><span>Ungraded</span></div>
                    <div className="mini-stat"><strong>{reports.filter(r => r.grade).length}</strong><span>Graded</span></div>
                    <button className="btn btn-outline btn-sm" onClick={() => exportToCSV(formatReportsForExport(reports), 'InternHub_Reports')} title="Export as CSV">
                        <FiDownload /> Export CSV
                    </button>
                </div>
            </div>

            <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
                <div className="filter-search">
                    <FiSearch className="filter-search-icon" />
                    <input type="text" placeholder="Search by student, task or content..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="filter-tabs">
                    {['all', 'ungraded', 'graded'].map(f => (
                        <button key={f} className={`filter-tab ${filterGrade === f ? 'active' : ''}`} onClick={() => setFilterGrade(f)}>
                            {f === 'all' ? 'All' : f === 'ungraded' ? '⏳ Ungraded' : '✅ Graded'}
                        </button>
                    ))}
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
                                <span><FiUser /> {selectedReport.student?.name} ({selectedReport.student?.userId})</span>
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
                            {selectedReport.fileName && (
                                <div className="report-modal-file">
                                    <FiFile /> <strong>{selectedReport.fileName}</strong>
                                    <button className="btn btn-outline btn-sm" onClick={() => viewPdf(selectedReport.fileData)}>
                                        <FiEye /> View PDF
                                    </button>
                                </div>
                            )}

                            {/* Grading Section */}
                            <div className="report-grade-section">
                                <h4><FiAward /> {selectedReport.grade ? 'Grade Assigned' : 'Assign Grade'}</h4>
                                <div className="grade-selector">
                                    {grades.map(g => (
                                        <button
                                            key={g}
                                            className={`grade-btn ${selectedReport.grade === g ? 'active' : ''}`}
                                            style={selectedReport.grade === g ? { background: gradeColors[g], borderColor: gradeColors[g], color: 'white' } : {}}
                                            onClick={() => handleGrade(selectedReport.id, g)}
                                            disabled={grading}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                                {selectedReport.gradedBy && (
                                    <p className="grade-info">Graded by {selectedReport.gradedBy.name} on {new Date(selectedReport.gradedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                )}
                            </div>
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
                            <th>File</th>
                            <th>Grade</th>
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
                                <td><span className="text-truncate">{r.content?.substring(0, 50)}...</span></td>
                                <td>
                                    {r.fileName ? (
                                        <span className="file-badge" title={r.fileName}><FiFile /> PDF</span>
                                    ) : (
                                        <span className="text-muted">—</span>
                                    )}
                                </td>
                                <td>
                                    {r.grade ? (
                                        <span className="grade-badge" style={{ background: `${gradeColors[r.grade]}20`, color: gradeColors[r.grade], borderColor: gradeColors[r.grade] }}>
                                            {r.grade}
                                        </span>
                                    ) : (
                                        <span className="grade-badge pending">Pending</span>
                                    )}
                                </td>
                                <td>{new Date(r.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                                <td>
                                    <button className="btn btn-outline btn-sm" onClick={() => setSelectedReport(r)}>
                                        <FiEye /> Review
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan="7" className="empty-state">No reports found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReviewReports;
