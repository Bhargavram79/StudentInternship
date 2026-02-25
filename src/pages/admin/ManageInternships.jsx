import { useState, useEffect } from 'react';
import { getInternships, createInternship, deleteInternship } from '../../services/api';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ManageInternships = () => {
    const [internships, setInternships] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', company: '', description: '', duration: '', skills: '' });

    useEffect(() => {
        fetchInternships();
    }, []);

    const fetchInternships = async () => {
        try {
            const { data } = await getInternships();
            setInternships(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createInternship(form);
            toast.success('Internship posted!');
            setForm({ title: '', company: '', description: '', duration: '', skills: '' });
            setShowForm(false);
            fetchInternships();
        } catch (err) {
            toast.error('Failed to create internship');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteInternship(id);
            toast.success('Internship deleted');
            fetchInternships();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Manage Internships</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    <FiPlus /> Post New
                </button>
            </div>

            {showForm && (
                <div className="card form-card">
                    <h3>Post New Internship</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Company</label>
                                <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Duration</label>
                                <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 3 months" />
                            </div>
                            <div className="form-group">
                                <label>Skills Required</label>
                                <input type="text" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="e.g. React, Java" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="4" />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Post Internship</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Company</th>
                            <th>Duration</th>
                            <th>Skills</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {internships.map((i) => (
                            <tr key={i.id}>
                                <td><strong>{i.title}</strong></td>
                                <td>{i.company}</td>
                                <td>{i.duration}</td>
                                <td>{i.skills}</td>
                                <td>
                                    <button className="btn-icon btn-danger" onClick={() => handleDelete(i.id)} title="Delete">
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {internships.length === 0 && (
                            <tr><td colSpan="5" className="empty-state">No internships posted yet</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageInternships;
