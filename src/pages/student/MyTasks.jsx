import { useState, useEffect } from 'react';
import { getMyTasks, updateTaskStatus, submitReport } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';

const MyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [reportForm, setReportForm] = useState({ taskId: null, content: '' });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const { data } = await getMyTasks();
            setTasks(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await updateTaskStatus(id, status);
            toast.success('Status updated');
            fetchTasks();
        } catch (err) {
            toast.error('Failed to update');
        }
    };

    const handleReport = async (e) => {
        e.preventDefault();
        try {
            await submitReport({ taskId: reportForm.taskId, content: reportForm.content });
            toast.success('Report submitted!');
            setReportForm({ taskId: null, content: '' });
        } catch (err) {
            toast.error('Failed to submit report');
        }
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>My Tasks</h1>
                <p>View and manage your assigned tasks</p>
            </div>

            <div className="task-cards">
                {tasks.map((t) => (
                    <div key={t.id} className="task-card">
                        <div className="task-card-top">
                            <h3>{t.title}</h3>
                            <StatusBadge status={t.status} />
                        </div>
                        <p className="task-desc">{t.description}</p>
                        <div className="task-meta">
                            <span>Internship: {t.internship?.title}</span>
                            {t.dueDate && <span>Due: {t.dueDate}</span>}
                        </div>
                        <div className="task-actions">
                            <select
                                value={t.status}
                                onChange={(e) => handleStatusChange(t.id, e.target.value)}
                                className="status-select"
                            >
                                <option value="TODO">TODO</option>
                                <option value="IN_PROGRESS">IN PROGRESS</option>
                                <option value="DONE">DONE</option>
                            </select>
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setReportForm({ taskId: t.id, content: '' })}
                            >
                                <FiSend /> Report
                            </button>
                        </div>

                        {reportForm.taskId === t.id && (
                            <form className="report-form" onSubmit={handleReport}>
                                <textarea
                                    placeholder="Describe your progress..."
                                    value={reportForm.content}
                                    onChange={(e) => setReportForm({ ...reportForm, content: e.target.value })}
                                    rows="3"
                                    required
                                />
                                <div className="form-actions">
                                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setReportForm({ taskId: null, content: '' })}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary btn-sm">Submit Report</button>
                                </div>
                            </form>
                        )}
                    </div>
                ))}
                {tasks.length === 0 && <div className="empty-state-card">No tasks assigned yet</div>}
            </div>
        </div>
    );
};

export default MyTasks;
