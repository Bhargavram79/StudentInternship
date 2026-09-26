import { useState, useEffect } from 'react';
import { createTask, getAllTasks, deleteTask, getInternships, getStudents } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AssignTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [internships, setInternships] = useState([]);
    const [students, setStudents] = useState([]);
    const [form, setForm] = useState({ internshipId: '', assignedToId: '', title: '', description: '', dueDate: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [taskRes, intRes, stuRes] = await Promise.all([getAllTasks(), getInternships(), getStudents()]);
            setTasks(taskRes.data);
            setInternships(intRes.data);
            setStudents(stuRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTask({ ...form, internshipId: Number(form.internshipId), assignedToId: Number(form.assignedToId) });
            toast.success('Task assigned!');
            setForm({ internshipId: '', assignedToId: '', title: '', description: '', dueDate: '' });
            setShowForm(false);
            fetchData();
        } catch (err) {
            toast.error('Failed to create task');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTask(id);
            toast.success('Task deleted');
            fetchData();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Assign Tasks</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    <FiPlus /> New Task
                </button>
            </div>

            {showForm && (
                <div className="card form-card">
                    <h3>Create New Task</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Internship</label>
                                <select value={form.internshipId} onChange={(e) => setForm({ ...form, internshipId: e.target.value })} required>
                                    <option value="">Select Internship</option>
                                    {internships.map((i) => <option key={i.id} value={i.id}>{i.title}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Assign To</label>
                                <select value={form.assignedToId} onChange={(e) => setForm({ ...form, assignedToId: e.target.value })} required>
                                    <option value="">Select Student</option>
                                    {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Due Date</label>
                                <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="3" />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Assign Task</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Internship</th>
                            <th>Assigned To</th>
                            <th>Status</th>
                            <th>Due Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((t) => (
                            <tr key={t.id}>
                                <td><strong>{t.title}</strong></td>
                                <td>{t.internship?.title}</td>
                                <td>{t.assignedTo?.name}</td>
                                <td><StatusBadge status={t.status} /></td>
                                <td>{t.dueDate || '—'}</td>
                                <td>
                                    <button className="btn-icon btn-danger" onClick={() => handleDelete(t.id)} title="Delete">
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {tasks.length === 0 && (
                            <tr><td colSpan="6" className="empty-state">No tasks assigned yet</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssignTasks;
