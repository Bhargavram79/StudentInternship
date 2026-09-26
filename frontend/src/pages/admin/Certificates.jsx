import { useState, useEffect } from 'react';
import { getCertificates, issueCertificate, getEligibleForCertificate } from '../../services/api';
import { FiAward, FiPlus, FiX, FiSend, FiUser, FiBriefcase, FiHash, FiCalendar, FiCheckCircle, FiAlertTriangle, FiShield, FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { exportToCSV, formatCertificatesForExport } from '../../utils/exportCSV';

const Certificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [eligible, setEligible] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedPair, setSelectedPair] = useState(null);
    const [grade, setGrade] = useState('A');
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [certRes, eligRes] = await Promise.all([getCertificates(), getEligibleForCertificate()]);
            setCertificates(certRes.data);
            setEligible(eligRes.data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async () => {
        if (!selectedPair) { toast.error('Select a student-internship pair'); return; }
        if (!selectedPair.isEligible) { toast.error('This student is not eligible — must complete ≥70% tasks'); return; }
        setLoading(true);
        try {
            await issueCertificate({ studentId: selectedPair.student.id, internshipId: selectedPair.internship.id, grade });
            toast.success('Certificate issued successfully!');
            setSelectedPair(null);
            setGrade('A');
            setShowForm(false);
            fetchData();
        } catch (err) { toast.error(err.response?.data?.error || 'Failed to issue certificate'); }
        finally { setLoading(false); }
    };

    const gradeColors = { 'A+': '#10b981', 'A': '#06d6a0', 'B+': '#3b82f6', 'B': '#60a5fa', 'C+': '#f59e0b', 'C': '#fbbf24' };

    const eligibleOnly = eligible.filter(e => e.isEligible);
    const notYetEligible = eligible.filter(e => !e.isEligible);

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1>Certificates</h1>
                    <p>Issue completion certificates to eligible students</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="search-count">{certificates.length} issued</span>
                    <button className="btn btn-outline btn-sm" onClick={() => exportToCSV(formatCertificatesForExport(certificates), 'InternHub_Certificates')}>
                        <FiDownload /> Export
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        {showForm ? <><FiX /> Cancel</> : <><FiPlus /> Issue Certificate</>}
                    </button>
                </div>
            </div>

            {/* Security Notice */}
            <div className="cert-security-notice">
                <FiShield />
                <div>
                    <strong>Integrity Protection Active</strong>
                    <p>Certificates can only be issued to students who: (1) have an accepted application, (2) completed ≥70% of assigned tasks, and (3) haven't already received a certificate for that internship.</p>
                </div>
            </div>

            {showForm && (
                <div className="card cert-form-card" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}><FiAward /> Issue New Certificate</h3>

                    {/* Eligible Students */}
                    {eligibleOnly.length > 0 ? (
                        <>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                Select a student who has completed their internship requirements:
                            </p>
                            <div className="eligible-list">
                                {eligibleOnly.map((e, i) => (
                                    <div
                                        key={`${e.student.id}-${e.internship.id}-${i}`}
                                        className={`eligible-card ${selectedPair === e ? 'selected' : ''}`}
                                        onClick={() => setSelectedPair(e)}
                                    >
                                        <div className="eligible-card-top">
                                            <div className="eligible-avatar">{e.student.name?.charAt(0)}</div>
                                            <div className="eligible-info">
                                                <strong>{e.student.name}</strong>
                                                <span>{e.student.userId}</span>
                                            </div>
                                            <FiCheckCircle className="eligible-check" />
                                        </div>
                                        <div className="eligible-internship">
                                            <FiBriefcase /> {e.internship.title} — {e.internship.company}
                                        </div>
                                        <div className="eligible-stats">
                                            <span>✅ {e.completedTasks}/{e.totalTasks} tasks ({e.completionRate}%)</span>
                                            <span>📄 {e.reports} reports</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedPair && (
                                <div className="cert-issue-confirm">
                                    <div className="cert-preview-mini">
                                        <div className="cert-preview-header">
                                            <FiAward /> <span>InternHub</span> × <strong>{selectedPair.internship.company}</strong>
                                        </div>
                                        <p className="cert-preview-name">{selectedPair.student.name}</p>
                                        <p className="cert-preview-title">{selectedPair.internship.title}</p>
                                    </div>
                                    <div className="form-group" style={{ marginTop: '1rem' }}>
                                        <label><FiAward /> Grade</label>
                                        <div className="grade-selector" style={{ marginTop: '0.5rem' }}>
                                            {['A+', 'A', 'B+', 'B', 'C+', 'C'].map(g => (
                                                <button
                                                    key={g}
                                                    type="button"
                                                    className={`grade-btn ${grade === g ? 'active' : ''}`}
                                                    style={grade === g ? { background: gradeColors[g], borderColor: gradeColors[g], color: 'white' } : {}}
                                                    onClick={() => setGrade(g)}
                                                >{g}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ marginTop: '1rem' }}>
                                        <FiSend /> {loading ? 'Issuing...' : 'Issue Certificate'}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="empty-state-card">
                            <FiCheckCircle style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#10b981' }} />
                            <p>All eligible students have already received their certificates!</p>
                        </div>
                    )}

                    {/* Not Yet Eligible */}
                    {notYetEligible.length > 0 && (
                        <div style={{ marginTop: '1.5rem' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                <FiAlertTriangle /> Not Yet Eligible ({notYetEligible.length})
                            </h4>
                            <div className="ineligible-list">
                                {notYetEligible.map((e, i) => (
                                    <div key={`ne-${e.student.id}-${e.internship.id}-${i}`} className="ineligible-item">
                                        <span className="ineligible-name">{e.student.name}</span>
                                        <span className="ineligible-intern">{e.internship.title}</span>
                                        <span className="ineligible-progress">
                                            {e.completedTasks}/{e.totalTasks} tasks ({e.completionRate}%)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="cert-grid">
                {certificates.map(c => (
                    <div key={c.id} className="cert-card cert-card-pro">
                        <div className="cert-card-gradient-border"></div>
                        <div className="cert-card-top">
                            <div className="cert-icon"><FiAward /></div>
                            <div className="cert-grade" style={{ color: gradeColors[c.grade] || '#64748b' }}>{c.grade}</div>
                        </div>
                        <h3 className="cert-title">{c.internship?.title}</h3>
                        <p className="cert-company">{c.internship?.company}</p>
                        <div className="cert-details">
                            <div className="cert-detail-row">
                                <span><FiUser /> Student</span>
                                <strong>{c.student?.name}</strong>
                            </div>
                            <div className="cert-detail-row">
                                <span><FiHash /> ID</span>
                                <span className="cert-id-badge">{c.certificateId || `CERT-${c.id}`}</span>
                            </div>
                            <div className="cert-detail-row">
                                <span><FiSend /> Issued by</span>
                                <strong>{c.issuedBy?.name}</strong>
                            </div>
                            <div className="cert-detail-row">
                                <span><FiCalendar /> Date</span>
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
