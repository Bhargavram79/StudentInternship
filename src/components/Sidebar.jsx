import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiBriefcase, FiFileText, FiCheckSquare, FiUsers, FiStar, FiBarChart2, FiMessageSquare, FiLogOut, FiSettings, FiAward, FiBell, FiTrendingUp, FiClipboard, FiSend } from 'react-icons/fi';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const adminLinks = [
        { path: '/admin', icon: <FiHome />, label: 'Dashboard' },
        { path: '/admin/internships', icon: <FiBriefcase />, label: 'Internships' },
        { path: '/admin/applications', icon: <FiFileText />, label: 'Applications' },
        { path: '/admin/tasks', icon: <FiCheckSquare />, label: 'Task Management' },
        { path: '/admin/evaluate', icon: <FiStar />, label: 'Evaluate' },
        { path: '/admin/users', icon: <FiUsers />, label: 'Manage Users' },
        { path: '/admin/announcements', icon: <FiBell />, label: 'Announcements' },
        { path: '/admin/certificates', icon: <FiAward />, label: 'Certificates' },
        { path: '/admin/reports', icon: <FiClipboard />, label: 'Review Reports' },
        { path: '/admin/analytics', icon: <FiTrendingUp />, label: 'Analytics' },
        { path: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
    ];

    const studentLinks = [
        { path: '/student', icon: <FiHome />, label: 'Dashboard' },
        { path: '/student/internships', icon: <FiBriefcase />, label: 'Browse Internships' },
        { path: '/student/tasks', icon: <FiCheckSquare />, label: 'My Tasks' },
        { path: '/student/progress', icon: <FiBarChart2 />, label: 'My Progress' },
        { path: '/student/feedback', icon: <FiMessageSquare />, label: 'My Feedback' },
        { path: '/student/applications', icon: <FiFileText />, label: 'My Applications' },
        { path: '/student/announcements', icon: <FiBell />, label: 'Announcements' },
        { path: '/student/reports', icon: <FiSend />, label: 'Submit Report' },
        { path: '/student/certificates', icon: <FiAward />, label: 'My Certificates' },
        { path: '/student/settings', icon: <FiSettings />, label: 'Settings' },
    ];

    const links = user?.role === 'ADMIN' ? adminLinks : studentLinks;

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <FiBriefcase className="brand-icon" />
                <span className="brand-text">InternHub</span>
            </div>
            <div className="sidebar-user">
                <div className="user-avatar">{user?.name?.charAt(0) || 'U'}</div>
                <div className="user-info">
                    <span className="user-name">{user?.name}</span>
                    <span className="user-role">{user?.userId || user?.role}</span>
                </div>
            </div>
            <nav className="sidebar-nav">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.path === '/admin' || link.path === '/student'}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        {link.icon}
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="sidebar-footer">
                <button className="logout-btn" onClick={logout}>
                    <FiLogOut />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
