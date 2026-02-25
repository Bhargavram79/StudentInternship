import { useState, useEffect } from 'react';
import { getCertificates, issueCertificate, getStudents, getInternships } from '../../services/api';
import { FiAward, FiPlus, FiX, FiSend, FiUser, FiBriefcase } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Certificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [students, setStudents] = useState([]);
    const [internships, setInternships] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ studentId: '', internshipId: '', grade: 'A' });
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [certRes, stuRes, intRes] = await Promise.all([getCertificates(), getStudents(), getInternships()]);
            setCertificates(certRes.data);
            setStudents(stuRes.data);
            setInternships(intRes.data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.studentId || !form.internshipId) { toast.error('Select student and internship'); return; }
        setLoading(true);
        try {
            await issueCertificate({ studentId: Number(form.studentId), internshipId: Number(form.internshipId), grade: form.grade });
            toast.success('Certificate issued successfully!');
            setForm({ studentId: '', internshipId: '', grade: 'A' });
            setShowForm(false);
            fetchData();
        } catch (err) { toast.error('Failed to issue certificate'); }
        finally { setLoading(false); }
    };

    const gradeColors = { 'A+': '#10b981', 'A': '#06d6a0', 'B+': '#3b82f6', 'B': '#60a5fa', 'C+': '#f59e0b', 'C': '#fbbf24' };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1>Certificates</h1>
                    <p>Issue and manage completion certificates</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? <><FiX /> Cancel</> : <><FiPlus /> Issue Certificate</>}
                </button>
            </div>

            {showForm && (
                <div className="card cert-form-card">
                    <form onSubmit={handleSubmit} className="cert-form">
                        <div className="form-row-3">
                            <div className="form-group">
                                <label><FiUser /> Student</label>
                                <select value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
                                    <option value="">Select student...</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.userId} — {s.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label><FiBriefcase /> Internship</label>
                                <select value={form.internshipId} onChange={(e) => setForm({ ...form, internshipId: e.target.value })}>
                                    <option value="">Select internship...</option>
                                    {internships.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label><FiAward /> Grade</label>
                                <select value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })}>
                                    {['A+', 'A', 'B+', 'B', 'C+', 'C'].map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            <FiSend /> {loading ? 'Issuing...' : 'Issue Certificate'}
                        </button>
                    </form>
                </div>
            )}

            <div className="cert-grid">
                {certificates.map(c => (
                    <div key={c.id} className="cert-card">
                        <div className="cert-card-top">
                            <div className="cert-icon"><FiAward /></div>
                            <div className="cert-grade" style={{ color: gradeColors[c.grade] || '#64748b' }}>{c.grade}</div>
                        </div>
                        <h3 className="cert-title">{c.internship?.title}</h3>
                        <p className="cert-company">{c.internship?.company}</p>
                        <div className="cert-details">
                            <div className="cert-detail-row">
                                <span>Student</span>
                                <strong>{c.student?.name}</strong>
                            </div>
                            <div className="cert-detail-row">
                                <span>ID</span>
                                <span className="user-id-badge">{c.student?.userId}</span>
                            </div>
                            <div className="cert-detail-row">
                                <span>Issued by</span>
                                <strong>{c.issuedBy?.name}</strong>
                            </div>
                            <div className="cert-detail-row">
                                <span>Date</span>
                                <strong>{new Date(c.issuedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                            </div>
                        </div>
                    </div>
                ))}
                {certificates.length === 0 && <div className="empty-state-card">No certificates issued yet</div>}
            </div>
        </div>
    );
};

export default Certificates;
