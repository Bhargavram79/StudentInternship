import { useState, useEffect } from 'react';
import { getAllReports, getStudents, submitFeedback, getAllFeedback } from '../../services/api';
import { FiStar, FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';

const EvaluateInterns = () => {
    const [reports, setReports] = useState([]);
    const [feedbackList, setFeedbackList] = useState([]);
    const [students, setStudents] = useState([]);
    const [form, setForm] = useState({ studentId: '', taskId: '', rating: 5, comment: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [repRes, stuRes, fbRes] = await Promise.all([getAllReports(), getStudents(), getAllFeedback()]);
            setReports(repRes.data);
            setStudents(stuRes.data);
            setFeedbackList(fbRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitFeedback({
                ...form,
                studentId: Number(form.studentId),
                taskId: form.taskId ? Number(form.taskId) : null,
            });
            toast.success('Feedback submitted!');
            setForm({ studentId: '', taskId: '', rating: 5, comment: '' });
            fetchData();
        } catch (err) {
            toast.error('Failed to submit feedback');
        }
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Evaluate Interns</h1>
                <p>Review progress reports and provide feedback</p>
            </div>

            <div className="two-col">
                <div>
                    <h2 className="section-title">Progress Reports</h2>
                    <div className="card-list">
                        {reports.map((r) => (
                            <div key={r.id} className="card">
                                <div className="card-header">
                                    <strong>{r.student?.name}</strong>
                                    <span className="card-date">{new Date(r.submittedAt).toLocaleDateString()}</span>
                                </div>
                                <p className="card-label">Task: {r.task?.title}</p>
                                <p className="card-body">{r.content}</p>
                            </div>
                        ))}
                        {reports.length === 0 && <div className="empty-state-card">No reports submitted yet</div>}
                    </div>
                </div>

                <div>
                    <h2 className="section-title">Submit Feedback</h2>
                    <div className="card form-card">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Student</label>
                                <select value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required>
                                    <option value="">Select Student</option>
                                    {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Rating</label>
                                <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FiStar
                                            key={star}
                                            className={`star ${star <= form.rating ? 'filled' : ''}`}
                                            onClick={() => setForm({ ...form, rating: star })}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Comment</label>
                                <textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} rows="4" required />
                            </div>
                            <button type="submit" className="btn btn-primary btn-full">
                                <FiSend /> Submit Feedback
                            </button>
                        </form>
                    </div>

                    <h2 className="section-title" style={{ marginTop: '2rem' }}>Previous Feedback</h2>
                    <div className="card-list">
                        {feedbackList.map((f) => (
                            <div key={f.id} className="card">
                                <div className="card-header">
                                    <strong>To: {f.student?.name}</strong>
                                    <span className="rating-display">{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</span>
                                </div>
                                <p className="card-body">{f.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EvaluateInterns;
