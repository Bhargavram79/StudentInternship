import { useState, useEffect } from 'react';
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '../../services/api';
import { FiPlus, FiTrash2, FiAlertTriangle, FiBell, FiX, FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', message: '', priority: 'normal' });
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const { data } = await getAnnouncements();
            setAnnouncements(data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.message.trim()) { toast.error('Title and message are required'); return; }
        setLoading(true);
        try {
            await createAnnouncement(form);
            toast.success('Announcement posted!');
            setForm({ title: '', message: '', priority: 'normal' });
            setShowForm(false);
            fetchData();
        } catch (err) { toast.error('Failed to post'); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        try {
            await deleteAnnouncement(id);
            toast.success('Announcement deleted');
            fetchData();
        } catch (err) { toast.error('Failed to delete'); }
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1>Announcements</h1>
                    <p>Post updates and notices for all students</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? <><FiX /> Cancel</> : <><FiPlus /> New Announcement</>}
                </button>
            </div>

            {showForm && (
                <div className="card announce-form-card">
                    <form onSubmit={handleSubmit} className="announce-form">
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Announcement title..." />
                        </div>
                        <div className="form-group">
                            <label>Message</label>
                            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Write your announcement..." rows={4} />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Priority</label>
                                <div className="priority-selector">
                                    <button type="button" className={`priority-btn normal ${form.priority === 'normal' ? 'active' : ''}`} onClick={() => setForm({ ...form, priority: 'normal' })}>
                                        <FiBell /> Normal
                                    </button>
                                    <button type="button" className={`priority-btn urgent ${form.priority === 'urgent' ? 'active' : ''}`} onClick={() => setForm({ ...form, priority: 'urgent' })}>
                                        <FiAlertTriangle /> Urgent
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                <FiSend /> {loading ? 'Posting...' : 'Post Announcement'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="announce-list">
                {announcements.map(a => (
                    <div key={a.id} className={`announce-card ${a.priority}`}>
                        {a.priority === 'urgent' && <div className="announce-urgent-tag"><FiAlertTriangle /> Urgent</div>}
                        <div className="announce-header">
                            <h3>{a.title}</h3>
                            <button className="btn-icon-sm btn-danger" onClick={() => handleDelete(a.id)} title="Delete">
                                <FiTrash2 />
                            </button>
                        </div>
                        <p className="announce-message">{a.message}</p>
                        <div className="announce-footer">
                            <span>By {a.author?.name}</span>
                            <span>{new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                    </div>
                ))}
                {announcements.length === 0 && <div className="empty-state-card">No announcements yet</div>}
            </div>
        </div>
    );
};

export default Announcements;
