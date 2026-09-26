import { useState, useEffect, useRef } from 'react';
import { getMyTasks, submitReport, getMyReports } from '../../services/api';
import { FiFileText, FiSend, FiClock, FiCheckCircle, FiUploadCloud, FiX, FiFile, FiAward } from 'react-icons/fi';
import { toast } from 'react-toastify';

const SubmitReport = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState('');
    const [content, setContent] = useState('');
    const [hours, setHours] = useState('');
    const [loading, setLoading] = useState(false);
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfName, setPdfName] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);
    const [myReports, setMyReports] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [taskRes, reportRes] = await Promise.all([getMyTasks(), getMyReports()]);
                setTasks(taskRes.data.filter(t => t.status === 'IN_PROGRESS' || t.status === 'DONE'));
                setMyReports(reportRes.data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, []);

    const handleFileSelect = (file) => {
        if (!file) return;
        if (file.type !== 'application/pdf') {
            toast.error('Only PDF files are accepted');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be under 5MB');
            return;
        }
        setPdfName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => setPdfFile(e.target.result);
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFileSelect(e.dataTransfer.files[0]);
    };

    const clearFile = () => { setPdfFile(null); setPdfName(''); if (fileInputRef.current) fileInputRef.current.value = ''; };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTask || !content.trim()) {
            toast.error('Select a task and write your report');
            return;
        }
        setLoading(true);
        try {
            const reportData = {
                taskId: Number(selectedTask), content, hoursWorked: Number(hours) || 0,
                fileName: pdfName || null, fileData: pdfFile || null,
            };
            await submitReport(reportData);
            toast.success('Report submitted successfully!');
            // Refresh reports
            const reportRes = await getMyReports();
            setMyReports(reportRes.data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
            setSelectedTask(''); setContent(''); setHours(''); clearFile();
        } catch (err) { toast.error('Failed to submit report'); }
        finally { setLoading(false); }
    };

    const gradeColors = { 'A+': '#10b981', 'A': '#06d6a0', 'B+': '#3b82f6', 'B': '#60a5fa', 'C+': '#f59e0b', 'C': '#fbbf24' };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Submit Report</h1>
                <p>Submit progress reports for your assigned tasks</p>
            </div>

            <div className="dashboard-grid-2col">
                {/* Submit Form */}
                <div className="card dashboard-card">
                    <h3><FiFileText /> New Report</h3>
                    <form className="report-submit-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Select Task</label>
                            <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)}>
                                <option value="">Choose a task...</option>
                                {tasks.map(t => (
                                    <option key={t.id} value={t.id}>{t.title} — {t.status === 'DONE' ? '✅ Done' : '🔄 In Progress'}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Report Content</label>
                            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Describe your progress, challenges, and achievements..." rows={5} />
                        </div>
                        <div className="form-group">
                            <label><FiClock /> Hours Worked</label>
                            <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="e.g. 8" min="0" max="100" />
                        </div>

                        {/* PDF Upload Zone */}
                        <div className="form-group">
                            <label><FiUploadCloud /> Attach PDF (optional)</label>
                            <div
                                className={`pdf-upload-zone ${dragOver ? 'drag-over' : ''} ${pdfFile ? 'has-file' : ''}`}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => !pdfFile && fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileSelect(e.target.files[0])}
                                />
                                {pdfFile ? (
                                    <div className="pdf-file-preview">
                                        <FiFile className="pdf-icon" />
                                        <div className="pdf-file-info">
                                            <span className="pdf-file-name">{pdfName}</span>
                                            <span className="pdf-file-type">PDF Document</span>
                                        </div>
                                        <button type="button" className="pdf-remove-btn" onClick={(e) => { e.stopPropagation(); clearFile(); }}>
                                            <FiX />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="pdf-upload-placeholder">
                                        <FiUploadCloud className="pdf-upload-icon" />
                                        <p>Drag & drop your PDF here</p>
                                        <span>or click to browse • Max 5MB</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            <FiSend /> {loading ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </form>
                </div>

                {/* My Reports with Grades */}
                <div className="card dashboard-card">
                    <h3><FiCheckCircle /> My Submitted Reports</h3>
                    {myReports.length > 0 ? (
                        <div className="submitted-reports-list">
                            {myReports.map((r) => (
                                <div key={r.id} className="submitted-report-item">
                                    <div className={`submitted-report-dot ${r.grade ? 'graded' : ''}`}></div>
                                    <div className="submitted-report-content">
                                        <div className="report-item-header">
                                            <strong>{r.task?.title}</strong>
                                            {r.grade ? (
                                                <span className="report-grade-chip" style={{ background: `${gradeColors[r.grade]}20`, color: gradeColors[r.grade], borderColor: gradeColors[r.grade] }}>
                                                    <FiAward /> {r.grade}
                                                </span>
                                            ) : (
                                                <span className="report-grade-chip pending">Pending</span>
                                            )}
                                        </div>
                                        <p>{r.content?.substring(0, 80)}...</p>
                                        <div className="report-item-meta">
                                            {r.fileName && <span className="report-file-tag"><FiFile /> {r.fileName}</span>}
                                            <span>{new Date(r.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                            {r.gradedBy && <span>Graded by {r.gradedBy.name}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state-card" style={{ marginTop: '1rem' }}>
                            <FiFileText style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.3 }} />
                            <p>No reports submitted yet. Select a task and submit your progress!</p>
                        </div>
                    )}

                    <div className="report-tips">
                        <h4>💡 Report Tips</h4>
                        <ul>
                            <li>Be specific about what you accomplished</li>
                            <li>Attach a PDF for detailed work samples</li>
                            <li>Mention any blockers or challenges</li>
                            <li>Log accurate hours for fair evaluation</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmitReport;
