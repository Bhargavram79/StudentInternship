import { useState, useEffect } from 'react';
import { getAllApplications, updateApplicationStatus } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { toast } from 'react-toastify';
import { FiCheck, FiX } from 'react-icons/fi';

const ViewApplications = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const { data } = await getAllApplications();
            setApplications(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatus = async (id, status) => {
        try {
            await updateApplicationStatus(id, status);
            toast.success(`Application ${status.toLowerCase()}`);
            fetchApplications();
        } catch (err) {
            toast.error('Failed to update');
        }
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Applications</h1>
                <p>Review and manage student applications</p>
            </div>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Internship</th>
                            <th>Status</th>
                            <th>Applied</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app.id}>
                                <td>{app.student?.name}</td>
                                <td>{app.internship?.title}</td>
                                <td><StatusBadge status={app.status} /></td>
                                <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                                <td>
                                    {app.status === 'PENDING' && (
                                        <div className="action-btns">
                                            <button className="btn-icon btn-success" onClick={() => handleStatus(app.id, 'ACCEPTED')} title="Accept">
                                                <FiCheck />
                                            </button>
                                            <button className="btn-icon btn-danger" onClick={() => handleStatus(app.id, 'REJECTED')} title="Reject">
                                                <FiX />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {applications.length === 0 && (
                            <tr><td colSpan="5" className="empty-state">No applications yet</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewApplications;
