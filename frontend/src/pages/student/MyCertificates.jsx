import { useState, useEffect } from 'react';
import { getMyCertificates, getMyApplications } from '../../services/api';
import { FiAward, FiDownload, FiBriefcase, FiChevronRight, FiArrowLeft, FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';

const MyCertificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [completedInternships, setCompletedInternships] = useState([]);
    const [selectedInternship, setSelectedInternship] = useState(null);
    const [viewingCert, setViewingCert] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [certRes, appRes] = await Promise.all([getMyCertificates(), getMyApplications()]);
                setCertificates(certRes.data);
                // Get accepted internships that have certificates
                const accepted = appRes.data.filter(a => a.status === 'ACCEPTED');
                const internshipsWithCerts = accepted.map(a => {
                    const cert = certRes.data.find(c => c.internship?.id === a.internship?.id);
                    return { ...a.internship, applicationStatus: a.status, certificate: cert || null };
                }).filter(i => i.id);
                // Remove duplicates by internship id
                const unique = [...new Map(internshipsWithCerts.map(i => [i.id, i])).values()];
                setCompletedInternships(unique);
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, []);

    const gradeColors = { 'A+': '#10b981', 'A': '#06d6a0', 'B+': '#3b82f6', 'B': '#60a5fa', 'C+': '#f59e0b', 'C': '#fbbf24' };
    const gradeMessages = {
        'A+': 'Outstanding Performance', 'A': 'Excellent Work',
        'B+': 'Very Good', 'B': 'Good Job', 'C+': 'Satisfactory', 'C': 'Completed',
    };

    const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    const handlePrint = () => { window.print(); };

    // Company representative names (distinct from Platform Director)
    const companyReps = {
        'TechNova Solutions': 'Arun Mathur',
        'CloudSync Labs': 'Neha Verma',
        'PixelCraft Studio': 'Rajesh Khanna',
        'DataVista Analytics': 'Sunita Patel',
        'AppForge Inc.': 'Vivek Choudhary',
        'InfraScale Tech': 'Ankita Rao',
        'AI Nexus Corp': 'Dr. Sanjay Gupta',
        'SecureNet Solutions': 'Prashant Nair',
        'SkyBridge Cloud': 'Meena Sharma',
        'WebStack Labs': 'Rohit Desai',
        'CreativeMinds Agency': 'Pooja Kapoor',
        'GrowthPulse Digital': 'Manish Tiwari',
        'WordSmith Media': 'Kavita Joshi',
        'ChainLogic Labs': 'Amit Saxena',
        'PlayForge Studios': 'Deepa Menon',
        'BugSquash Tech': 'Suresh Kumar',
        'ProductLab Inc.': 'Nisha Agarwal',
        'MicroTech Electronics': 'Rakesh Bhatt',
        'DataCore Systems': 'Shalini Reddy',
        'ImmerseTech Labs': 'Dr. Kiran Rao',
    };

    const getCompanyRep = (company) => companyReps[company] || 'Chief Executive Officer';

    // View: Internship List
    if (!viewingCert) {
        return (
            <div className="dashboard-page">
                <div className="page-header">
                    <h1><FiAward /> My Certificates</h1>
                    <p>Select a completed internship to view your certificate</p>
                </div>

                {completedInternships.length > 0 ? (
                    <div className="cert-internship-grid">
                        {completedInternships.map(intern => (
                            <div
                                key={intern.id}
                                className={`cert-internship-card ${intern.certificate ? 'has-cert' : 'no-cert'}`}
                                onClick={() => intern.certificate && setViewingCert(intern.certificate)}
                            >
                                <div className="ci-card-top">
                                    <div className="ci-company-badge">
                                        <FiBriefcase />
                                        <span>{intern.company}</span>
                                    </div>
                                    {intern.certificate ? (
                                        <span className="ci-status issued"><FiAward /> Certificate Issued</span>
                                    ) : (
                                        <span className="ci-status pending"><FiClock /> In Progress</span>
                                    )}
                                </div>
                                <h3 className="ci-title">{intern.title}</h3>
                                <div className="ci-meta">
                                    {intern.mode && <span><FiMapPin /> {intern.mode}</span>}
                                    {intern.duration && <span><FiClock /> {intern.duration}</span>}
                                </div>
                                {intern.certificate && (
                                    <div className="ci-cert-preview">
                                        <div className="ci-grade" style={{ color: gradeColors[intern.certificate.grade] }}>
                                            {intern.certificate.grade}
                                        </div>
                                        <span>Click to view certificate</span>
                                        <FiChevronRight />
                                    </div>
                                )}
                                {!intern.certificate && (
                                    <div className="ci-cert-preview locked">
                                        <span>Complete all tasks to earn your certificate</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state-section">
                        <div className="empty-state-icon"><FiAward /></div>
                        <h3>No Internships Yet</h3>
                        <p>Apply for internships and get accepted to start earning certificates.</p>
                    </div>
                )}

                {/* Also show any certificates without matching application */}
                {certificates.filter(c => !completedInternships.find(i => i.certificate?.id === c.id)).length > 0 && (
                    <div style={{ marginTop: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Additional Certificates</h3>
                        <div className="cert-internship-grid">
                            {certificates.filter(c => !completedInternships.find(i => i.certificate?.id === c.id)).map(c => (
                                <div key={c.id} className="cert-internship-card has-cert" onClick={() => setViewingCert(c)}>
                                    <div className="ci-card-top">
                                        <div className="ci-company-badge"><FiBriefcase /><span>{c.internship?.company}</span></div>
                                        <span className="ci-status issued"><FiAward /> Issued</span>
                                    </div>
                                    <h3 className="ci-title">{c.internship?.title}</h3>
                                    <div className="ci-cert-preview">
                                        <div className="ci-grade" style={{ color: gradeColors[c.grade] }}>{c.grade}</div>
                                        <span>Click to view</span>
                                        <FiChevronRight />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // View: Full Certificate
    const c = viewingCert;
    return (
        <div className="dashboard-page">
            <div className="page-header no-print">
                <button className="btn btn-outline" onClick={() => setViewingCert(null)}>
                    <FiArrowLeft /> Back to Internships
                </button>
            </div>

            <div className="coursera-cert-list">
                <div className="coursera-cert" id={`cert-${c.id}`}>
                    <div className="cert-border-outer">
                        <div className="cert-border-inner">
                            {/* Header */}
                            <div className="cert-header-area">
                                <div className="cert-logo-section">
                                    <div className="cert-platform-logo">
                                        <FiAward className="cert-logo-icon" />
                                        <span>InternHub</span>
                                    </div>
                                    <div className="cert-divider-vert"></div>
                                    <div className="cert-company-logo">
                                        <span className="cert-company-name">{c.internship?.company}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="cert-main-content">
                                <p className="cert-subtitle">CERTIFICATE OF COMPLETION</p>
                                <div className="cert-ornament"></div>
                                <p className="cert-awarded-to">This is to certify that</p>
                                <h2 className="cert-recipient-name">{c.student?.name}</h2>
                                <p className="cert-body-text">
                                    has successfully completed the internship program
                                </p>
                                <h3 className="cert-course-title">{c.internship?.title}</h3>
                                <p className="cert-body-text">
                                    offered by <strong>{c.internship?.company}</strong> through the InternHub platform
                                </p>

                                {/* Grade Badge */}
                                <div className="cert-grade-section">
                                    <div className="cert-grade-badge" style={{ borderColor: gradeColors[c.grade], color: gradeColors[c.grade] }}>
                                        <span className="cert-grade-letter">{c.grade}</span>
                                        <span className="cert-grade-label">{gradeMessages[c.grade]}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Signatures */}
                            <div className="cert-signatures">
                                <div className="cert-sig-block">
                                    <div className="cert-sig-line">
                                        <span className="cert-sig-cursive">Bhargav Ram</span>
                                    </div>
                                    <p className="cert-sig-title">Platform Director</p>
                                    <p className="cert-sig-org">InternHub</p>
                                </div>
                                <div className="cert-seal">
                                    <div className="cert-seal-inner">
                                        <FiAward />
                                        <span>VERIFIED</span>
                                    </div>
                                </div>
                                <div className="cert-sig-block">
                                    <div className="cert-sig-line">
                                        <span className="cert-sig-cursive">{getCompanyRep(c.internship?.company)}</span>
                                    </div>
                                    <p className="cert-sig-title">Company Representative</p>
                                    <p className="cert-sig-org">{c.internship?.company}</p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="cert-footer-area">
                                <div className="cert-footer-item">
                                    <span className="cert-footer-label">Certificate ID</span>
                                    <span className="cert-footer-value">{c.certificateId || `CERT-${c.id}`}</span>
                                </div>
                                <div className="cert-footer-item">
                                    <span className="cert-footer-label">Date of Issue</span>
                                    <span className="cert-footer-value">{formatDate(c.issuedAt)}</span>
                                </div>
                                <div className="cert-footer-item">
                                    <span className="cert-footer-label">Duration</span>
                                    <span className="cert-footer-value">{c.internship?.duration || '3 months'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="cert-actions no-print">
                        <button className="btn btn-primary" onClick={handlePrint}>
                            <FiDownload /> Print / Save PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyCertificates;
