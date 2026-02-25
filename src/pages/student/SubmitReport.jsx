import { useState, useEffect } from 'react';
import { getMyTasks, submitReport } from '../../services/api';
import { FiFileText, FiSend, FiClock, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const SubmitReport = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState('');
    const [content, setContent] = useState('');
    const [hours, setHours] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const { data } = await getMyTasks();
                setTasks(data.filter(t => t.status === 'IN_PROGRESS' || t.status === 'DONE'));
            } catch (err) { console.error(err); }
        };
        fetchTasks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTask || !content.trim()) {
            toast.error('Select a task and write your report');
            return;
        }
        setLoading(true);
        try {
            await submitReport({ taskId: Number(selectedTask), content, hoursWorked: Number(hours) || 0 });
            toast.success('Report submitted successfully!');
            const task = tasks.find(t => t.id === Number(selectedTask));
            setSubmitted(prev => [...prev, { taskTitle: task?.title, content, hours, time: new Date().toISOString() }]);
            setSelectedTask('');
            setContent('');
            setHours('');
        } catch (err) { toast.error('Failed to submit report'); }
        finally { setLoading(false); }
    };

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
                            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Describe your progress, challenges, and achievements..." rows={6} />
                        </div>
                        <div className="form-group">
                            <label><FiClock /> Hours Worked</label>
                            <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="e.g. 8" min="0" max="100" />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            <FiSend /> {loading ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </form>
                </div>

                {/* Recently Submitted */}
                <div className="card dashboard-card">
                    <h3><FiCheckCircle /> Recently Submitted</h3>
                    {submitted.length > 0 ? (
                        <div className="submitted-reports-list">
                            {submitted.map((s, i) => (
                                <div key={i} className="submitted-report-item">
                                    <div className="submitted-report-dot"></div>
                                    <div className="submitted-report-content">
                                        <strong>{s.taskTitle}</strong>
                                        <p>{s.content.substring(0, 80)}...</p>
                                        <span className="submitted-report-meta">{s.hours}h • Just now</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state-card" style={{ marginTop: '1rem' }}>
                            <FiFileText style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.3 }} />
                            <p>No reports submitted in this session. Select a task and submit your progress!</p>
                        </div>
                    )}

                    <div className="report-tips">
                        <h4>💡 Report Tips</h4>
                        <ul>
                            <li>Be specific about what you accomplished</li>
                            <li>Mention any blockers or challenges</li>
                            <li>Include links to your work if applicable</li>
                            <li>Log accurate hours for fair evaluation</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmitReport;
