import { useState, useEffect } from 'react';
import { getAnnouncements, getMyCertificates } from '../../services/api';
import { FiAlertTriangle, FiBell, FiAward } from 'react-icons/fi';

const StudentAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [certificates, setCertificates] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [annRes, certRes] = await Promise.all([getAnnouncements(), getMyCertificates()]);
                setAnnouncements(annRes.data);
                setCertificates(certRes.data);
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, []);

    const gradeColors = { 'A+': '#10b981', 'A': '#06d6a0', 'B+': '#3b82f6', 'B': '#60a5fa', 'C+': '#f59e0b', 'C': '#fbbf24' };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Announcements & Certificates</h1>
                <p>Stay updated with latest announcements and your earned certificates</p>
            </div>

            {/* My Certificates */}
            {certificates.length > 0 && (
                <div className="section-block">
                    <h2 className="section-title"><FiAward /> My Certificates</h2>
                    <div className="cert-grid">
                        {certificates.map(c => (
                            <div key={c.id} className="cert-card student-cert">
                                <div className="cert-card-top">
                                    <div className="cert-icon"><FiAward /></div>
                                    <div className="cert-grade" style={{ color: gradeColors[c.grade] || '#64748b' }}>{c.grade}</div>
                                </div>
                                <h3 className="cert-title">{c.internship?.title}</h3>
                                <p className="cert-company">{c.internship?.company}</p>
                                <div className="cert-details">
                                    <div className="cert-detail-row">
                                        <span>Grade</span>
                                        <strong style={{ color: gradeColors[c.grade] }}>{c.grade}</strong>
                                    </div>
                                    <div className="cert-detail-row">
                                        <span>Issued</span>
                                        <strong>{new Date(c.issuedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Announcements */}
            <div className="section-block">
                <h2 className="section-title"><FiBell /> Announcements</h2>
                <div className="announce-list">
                    {announcements.map(a => (
                        <div key={a.id} className={`announce-card ${a.priority}`}>
                            {a.priority === 'urgent' && <div className="announce-urgent-tag"><FiAlertTriangle /> Urgent</div>}
                            <div className="announce-header">
                                <h3>{a.title}</h3>
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
        </div>
    );
};

export default StudentAnnouncements;
