import { Outlet, useLocation, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';
import { FiBell, FiSettings, FiCheck, FiCheckCircle } from 'react-icons/fi';

const Layout = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [notifications, setNotifications] = useState([]);
    const [showNotifs, setShowNotifs] = useState(false);
    const notifRef = useRef(null);

    const pageTitles = {
        '/admin': 'Dashboard',
        '/admin/internships': 'Manage Internships',
        '/admin/applications': 'Applications',
        '/admin/tasks': 'Task Management',
        '/admin/evaluate': 'Evaluate Interns',
        '/admin/users': 'Manage Users',
        '/admin/settings': 'Settings',
        '/student': 'Dashboard',
        '/student/internships': 'Browse Internships',
        '/student/tasks': 'My Tasks',
        '/student/progress': 'My Progress',
        '/student/feedback': 'My Feedback',
        '/student/settings': 'Settings',
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifs(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await getNotifications();
            setNotifications(res.data);
        } catch (e) { console.error(e); }
    };

    const handleMarkRead = async (id) => {
        await markNotificationRead(id);
        fetchNotifications();
    };

    const handleMarkAllRead = async () => {
        await markAllNotificationsRead();
        fetchNotifications();
    };

    const unreadCount = notifications.filter(n => !n.read).length;
    const settingsPath = user?.role === 'ADMIN' ? '/admin/settings' : '/student/settings';

    const getNotifIcon = (type) => {
        switch (type) {
            case 'application': return '📋';
            case 'feedback': return '⭐';
            case 'task': return '📝';
            case 'accepted': return '🎉';
            case 'report': return '📄';
            default: return '🔔';
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="top-header">
                    <div className="header-left">
                        <h2 className="page-title">{pageTitles[location.pathname] || 'Dashboard'}</h2>
                    </div>
                    <div className="header-right">
                        {/* Notifications */}
                        <div className="notif-wrapper" ref={notifRef}>
                            <button className="icon-btn notif-btn" onClick={() => setShowNotifs(!showNotifs)} title="Notifications">
                                <FiBell />
                                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                            </button>
                            {showNotifs && (
                                <div className="notif-dropdown">
                                    <div className="notif-dropdown-header">
                                        <h4>Notifications</h4>
                                        {unreadCount > 0 && (
                                            <button className="notif-mark-all" onClick={handleMarkAllRead}>
                                                <FiCheckCircle /> Mark all read
                                            </button>
                                        )}
                                    </div>
                                    <div className="notif-dropdown-list">
                                        {notifications.length === 0 && (
                                            <div className="notif-empty">No notifications</div>
                                        )}
                                        {notifications.slice(0, 10).map(n => (
                                            <div
                                                key={n.id}
                                                className={`notif-item ${n.read ? 'read' : 'unread'}`}
                                                onClick={() => !n.read && handleMarkRead(n.id)}
                                            >
                                                <span className="notif-icon">{getNotifIcon(n.type)}</span>
                                                <div className="notif-content">
                                                    <p>{n.message}</p>
                                                    <span className="notif-time">{new Date(n.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                {!n.read && <span className="notif-unread-dot"></span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Settings */}
                        <Link to={settingsPath} className="icon-btn" title="Settings">
                            <FiSettings />
                        </Link>

                        {/* User Avatar */}
                        <div className="header-user">
                            <div className="user-avatar-sm">{user?.name?.charAt(0) || 'U'}</div>
                            <div className="header-user-info">
                                <span className="header-user-name">{user?.name}</span>
                                <span className="header-user-id">{user?.userId}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
