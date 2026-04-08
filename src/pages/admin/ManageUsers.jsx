import { useState, useEffect } from 'react';
import { getUsers, getAllTasks, getAllFeedback, getAllApplications, createUser, deleteUser } from '../../services/api';
import { FiUser, FiMail, FiCalendar, FiSearch, FiStar, FiCheckSquare, FiPlus, FiTrash2, FiShield, FiX, FiLock, FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { exportToCSV, formatUsersForExport } from '../../utils/exportCSV';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [applications, setApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [filterRole, setFilterRole] = useState('ALL');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUserForm, setNewUserForm] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
    const [addLoading, setAddLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [userRes, taskRes, fbRes, appRes] = await Promise.all([
                getUsers(), getAllTasks(), getAllFeedback(), getAllApplications()
            ]);
            setUsers(userRes.data);
            setTasks(taskRes.data);
            setFeedback(fbRes.data);
            setApplications(appRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'ALL' || u.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getUserStats = (userId) => {
        const userTasks = tasks.filter(t => t.assignedTo?.id === userId);
        const userFb = feedback.filter(f => f.student?.id === userId);
        const userApps = applications.filter(a => a.student?.id === userId);
        const completed = userTasks.filter(t => t.status === 'DONE').length;
        const avgRating = userFb.length > 0
            ? (userFb.reduce((sum, f) => sum + f.rating, 0) / userFb.length).toFixed(1)
            : null;
        return {
            totalTasks: userTasks.length,
            completed,
            inProgress: userTasks.filter(t => t.status === 'IN_PROGRESS').length,
            todo: userTasks.filter(t => t.status === 'TODO').length,
            avgRating,
            feedbackCount: userFb.length,
            applicationCount: userApps.length,
            acceptedApps: userApps.filter(a => a.status === 'ACCEPTED').length,
            tasks: userTasks,
            feedbackList: userFb,
        };
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!newUserForm.name || !newUserForm.email || !newUserForm.password) {
            toast.error('Please fill in all fields');
            return;
        }
        if (newUserForm.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setAddLoading(true);
        try {
            await createUser(newUserForm);
            toast.success(`${newUserForm.role === 'ADMIN' ? 'Admin' : 'Student'} account created successfully!`);
            setShowAddModal(false);
            setNewUserForm({ name: '', email: '', password: '', role: 'STUDENT' });
            await fetchData();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to create user');
        } finally {
            setAddLoading(false);
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) return;
        try {
            await deleteUser(userId);
            toast.success(`${userName} has been removed`);
            if (selectedUser?.id === userId) setSelectedUser(null);
            await fetchData();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to delete user');
        }
    };

    const adminCount = users.filter(u => u.role === 'ADMIN').length;
    const studentCount = users.filter(u => u.role === 'STUDENT').length;

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Manage Users</h1>
                <p>View user profiles, manage accounts, and track student performance</p>
            </div>

            {/* Role summary cards */}
            <div className="manage-users-summary">
                <div className="mu-summary-card" onClick={() => setFilterRole('ALL')} style={{ cursor: 'pointer', opacity: filterRole === 'ALL' ? 1 : 0.7 }}>
                    <FiUser />
                    <div>
                        <span className="mu-summary-value">{users.length}</span>
                        <span className="mu-summary-label">Total Users</span>
                    </div>
                </div>
                <div className="mu-summary-card admin-card" onClick={() => setFilterRole('ADMIN')} style={{ cursor: 'pointer', opacity: filterRole === 'ADMIN' ? 1 : 0.7 }}>
                    <FiShield />
                    <div>
                        <span className="mu-summary-value">{adminCount}</span>
                        <span className="mu-summary-label">Admins</span>
                    </div>
                </div>
                <div className="mu-summary-card student-card" onClick={() => setFilterRole('STUDENT')} style={{ cursor: 'pointer', opacity: filterRole === 'STUDENT' ? 1 : 0.7 }}>
                    <FiUser />
                    <div>
                        <span className="mu-summary-value">{studentCount}</span>
                        <span className="mu-summary-label">Students</span>
                    </div>
                </div>
            </div>

            <div className="search-bar-row">
                <div className="search-input-wrap">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="action-btn" onClick={() => exportToCSV(formatUsersForExport(users), 'InternHub_Users')} title="Export all users">
                    <FiDownload /> Export
                </button>
                <button className="action-btn add-user-btn" onClick={() => setShowAddModal(true)}>
                    <FiPlus /> Add User
                </button>
            </div>

            <div className="users-layout">
                <div className="users-list">
                    {filteredUsers.map((u) => {
                        const st = getUserStats(u.id);
                        const isAdmin = u.role === 'ADMIN';
                        const percent = st.totalTasks > 0 ? Math.round((st.completed / st.totalTasks) * 100) : 0;
                        return (
                            <div
                                key={u.id}
                                className={`user-profile-card ${selectedUser?.id === u.id ? 'active' : ''}`}
                                onClick={() => setSelectedUser(u)}
                            >
                                <div className={`upc-avatar ${isAdmin ? 'admin-avatar' : ''}`}>
                                    {isAdmin ? <FiShield /> : u.name?.charAt(0)}
                                </div>
                                <div className="upc-info">
                                    <h4>
                                        {u.name}
                                        <span className={`role-badge ${isAdmin ? 'role-admin' : 'role-student'}`}>
                                            {isAdmin ? 'Admin' : 'Student'}
                                        </span>
                                    </h4>
                                    <span className="upc-email">{u.email}</span>
                                    {!isAdmin && (
                                        <div className="upc-stats-row">
                                            <span><FiCheckSquare /> {st.completed}/{st.totalTasks} tasks</span>
                                            {st.avgRating && <span><FiStar /> {st.avgRating}</span>}
                                        </div>
                                    )}
                                    {!isAdmin && (
                                        <div className="upc-progress">
                                            <div className="mini-progress-bar">
                                                <div className="mini-progress-fill" style={{ width: `${percent}%` }}></div>
                                            </div>
                                            <span className="progress-percent">{percent}%</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {filteredUsers.length === 0 && (
                        <div className="empty-state-card">No users found matching your search</div>
                    )}
                </div>

                {/* User Detail Panel */}
                <div className="user-detail-panel">
                    {selectedUser ? (
                        (() => {
                            const st = getUserStats(selectedUser.id);
                            const percent = st.totalTasks > 0 ? Math.round((st.completed / st.totalTasks) * 100) : 0;
                            const isAdmin = selectedUser.role === 'ADMIN';
                            return (
                                <>
                                    <div className="udp-header">
                                        <div className={`udp-avatar ${isAdmin ? 'admin-avatar' : ''}`}>
                                            {isAdmin ? <FiShield /> : selectedUser.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h2>
                                                {selectedUser.name}
                                                <span className={`role-badge ${isAdmin ? 'role-admin' : 'role-student'}`}>
                                                    {isAdmin ? 'Admin' : 'Student'}
                                                </span>
                                            </h2>
                                            <p className="udp-email"><FiMail /> {selectedUser.email}</p>
                                            <p className="udp-joined"><FiCalendar /> Joined {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* Delete button */}
                                    <div style={{ margin: '0.75rem 0' }}>
                                        <button
                                            className="action-btn delete-user-btn"
                                            onClick={() => handleDeleteUser(selectedUser.id, selectedUser.name)}
                                        >
                                            <FiTrash2 /> Remove User
                                        </button>
                                    </div>

                                    {!isAdmin && (
                                        <>
                                            <div className="udp-stats-grid">
                                                <div className="udp-stat">
                                                    <span className="udp-stat-value">{st.applicationCount}</span>
                                                    <span className="udp-stat-label">Applications</span>
                                                </div>
                                                <div className="udp-stat">
                                                    <span className="udp-stat-value">{st.acceptedApps}</span>
                                                    <span className="udp-stat-label">Accepted</span>
                                                </div>
                                                <div className="udp-stat">
                                                    <span className="udp-stat-value">{st.totalTasks}</span>
                                                    <span className="udp-stat-label">Tasks</span>
                                                </div>
                                                <div className="udp-stat">
                                                    <span className="udp-stat-value">{st.avgRating || '—'}</span>
                                                    <span className="udp-stat-label">Avg Rating</span>
                                                </div>
                                            </div>

                                            <div className="udp-section">
                                                <h4>Task Progress</h4>
                                                <div className="progress-cell" style={{ marginBottom: '0.75rem' }}>
                                                    <div className="mini-progress-bar" style={{ height: '10px' }}>
                                                        <div className="mini-progress-fill" style={{ width: `${percent}%` }}></div>
                                                    </div>
                                                    <span className="progress-percent">{percent}%</span>
                                                </div>
                                                <div className="dist-legend">
                                                    <div className="dist-legend-item"><span className="dist-dot done"></span><span>Done ({st.completed})</span></div>
                                                    <div className="dist-legend-item"><span className="dist-dot in-progress"></span><span>In Progress ({st.inProgress})</span></div>
                                                    <div className="dist-legend-item"><span className="dist-dot todo"></span><span>Todo ({st.todo})</span></div>
                                                </div>
                                            </div>

                                            {st.tasks.length > 0 && (
                                                <div className="udp-section">
                                                    <h4>Assigned Tasks</h4>
                                                    {st.tasks.map(t => (
                                                        <div key={t.id} className="udp-task-item">
                                                            <span className={`udp-task-status ${t.status.toLowerCase().replace('_', '-')}`}></span>
                                                            <div>
                                                                <strong>{t.title}</strong>
                                                                <span className="udp-task-meta">{t.internship?.title} {t.dueDate ? `· Due: ${t.dueDate}` : ''}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {st.feedbackList.length > 0 && (
                                                <div className="udp-section">
                                                    <h4>Feedback History</h4>
                                                    {st.feedbackList.map(f => (
                                                        <div key={f.id} className="udp-feedback-item">
                                                            <div className="udp-fb-header">
                                                                <span>{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</span>
                                                                <span className="udp-fb-date">{new Date(f.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <p>{f.comment}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {isAdmin && (
                                        <div className="udp-section">
                                            <h4>Administrator Account</h4>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                                This user has full admin privileges including managing internships, tasks, applications, users, certificates, and announcements.
                                            </p>
                                        </div>
                                    )}
                                </>
                            );
                        })()
                    ) : (
                        <div className="udp-placeholder">
                            <FiUser className="udp-placeholder-icon" />
                            <h3>Select a user</h3>
                            <p>Click on a user from the list to view their profile details, task progress, and feedback history.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content add-user-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2><FiPlus /> Add New User</h2>
                            <button className="modal-close" onClick={() => setShowAddModal(false)}><FiX /></button>
                        </div>
                        <form onSubmit={handleAddUser}>
                            <div className="modal-body">
                                <div className="modal-info-banner">
                                    <FiShield />
                                    <span>Only administrators can create new accounts. This is the only way to add admin users to the platform.</span>
                                </div>
                                <div className="modal-form-group">
                                    <label>Full Name</label>
                                    <div className="modal-input-wrap">
                                        <FiUser className="modal-input-icon" />
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            value={newUserForm.name}
                                            onChange={e => setNewUserForm({ ...newUserForm, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-form-group">
                                    <label>Email Address</label>
                                    <div className="modal-input-wrap">
                                        <FiMail className="modal-input-icon" />
                                        <input
                                            type="email"
                                            placeholder="user@example.com"
                                            value={newUserForm.email}
                                            onChange={e => setNewUserForm({ ...newUserForm, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-form-group">
                                    <label>Password</label>
                                    <div className="modal-input-wrap">
                                        <FiLock className="modal-input-icon" />
                                        <input
                                            type="password"
                                            placeholder="Min 6 characters"
                                            value={newUserForm.password}
                                            onChange={e => setNewUserForm({ ...newUserForm, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-form-group">
                                    <label>Role</label>
                                    <div className="modal-role-selector">
                                        <button
                                            type="button"
                                            className={`modal-role-btn ${newUserForm.role === 'STUDENT' ? 'active' : ''}`}
                                            onClick={() => setNewUserForm({ ...newUserForm, role: 'STUDENT' })}
                                        >
                                            🎓 Student
                                        </button>
                                        <button
                                            type="button"
                                            className={`modal-role-btn admin ${newUserForm.role === 'ADMIN' ? 'active' : ''}`}
                                            onClick={() => setNewUserForm({ ...newUserForm, role: 'ADMIN' })}
                                        >
                                            🛡️ Admin
                                        </button>
                                    </div>
                                    {newUserForm.role === 'ADMIN' && (
                                        <p className="modal-role-warning">
                                            ⚠️ Admin accounts have full access to manage all platform data including internships, users, and evaluations.
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="modal-cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="modal-submit-btn" disabled={addLoading}>
                                    {addLoading ? 'Creating...' : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;

