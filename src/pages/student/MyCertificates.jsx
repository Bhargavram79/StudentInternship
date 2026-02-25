import { useState, useEffect } from 'react';
import { getMyCertificates } from '../../services/api';
import { FiAward, FiDownload } from 'react-icons/fi';

const MyCertificates = () => {
    const [certificates, setCertificates] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await getMyCertificates();
                setCertificates(data);
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, []);

    const gradeColors = { 'A+': '#10b981', 'A': '#06d6a0', 'B+': '#3b82f6', 'B': '#60a5fa', 'C+': '#f59e0b', 'C': '#fbbf24' };
    const gradeMessages = {
        'A+': 'Outstanding Performance!', 'A': 'Excellent Work!',
        'B+': 'Very Good!', 'B': 'Good Job!',
        'C+': 'Satisfactory', 'C': 'Completed',
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1><FiAward /> My Certificates</h1>
                <p>View your earned completion certificates</p>
            </div>

            {certificates.length > 0 ? (
                <div className="cert-grid">
                    {certificates.map(c => (
                        <div key={c.id} className="cert-card student-cert-lg">
                            <div className="cert-ribbon" style={{ background: gradeColors[c.grade] || '#64748b' }}></div>
                            <div className="cert-card-top">
                                <div className="cert-icon lg"><FiAward /></div>
                                <div className="cert-grade" style={{ color: gradeColors[c.grade] || '#64748b' }}>{c.grade}</div>
                            </div>
                            <div className="cert-badge-message" style={{ color: gradeColors[c.grade] }}>{gradeMessages[c.grade]}</div>
                            <h3 className="cert-title">{c.internship?.title}</h3>
                            <p className="cert-company">{c.internship?.company}</p>
                            <div className="cert-details">
                                <div className="cert-detail-row">
                                    <span>Grade</span>
                                    <strong style={{ color: gradeColors[c.grade], fontSize: '1.1rem' }}>{c.grade}</strong>
                                </div>
                                <div className="cert-detail-row">
                                    <span>Issued by</span>
                                    <strong>{c.issuedBy?.name}</strong>
                                </div>
                                <div className="cert-detail-row">
                                    <span>Date</span>
                                    <strong>{new Date(c.issuedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state-section">
                    <div className="empty-state-icon"><FiAward /></div>
                    <h3>No Certificates Yet</h3>
                    <p>Complete your internship tasks to earn completion certificates from your mentors.</p>
                </div>
            )}
        </div>
    );
};

export default MyCertificates;
