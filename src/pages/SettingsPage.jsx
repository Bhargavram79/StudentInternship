import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../services/api';
import { FiUser, FiLock, FiSave, FiShield, FiMail, FiHash } from 'react-icons/fi';
import { toast } from 'react-toastify';

const SettingsPage = () => {
    const { user, loginUser } = useAuth();
    const [profileForm, setProfileForm] = useState({ 
        name: user?.name || '',
        resumeUrl: user?.resumeUrl || '',
        skills: user?.skills || '',
        habits: user?.habits || '',
        experience: user?.experience || '',
        education: user?.education || '',
    });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!profileForm.name.trim()) { toast.error('Name is required'); return; }
        setSavingProfile(true);
        try {
            const res = await updateProfile(profileForm);
            // Update the user in context (no token in user object — it's in localStorage)
            loginUser({ ...user, ...res.data });
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update profile');
        } finally { setSavingProfile(false); }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!passwordForm.currentPassword || !passwordForm.newPassword) {
            toast.error('All fields are required'); return;
        }
        if (passwordForm.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters'); return;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Passwords do not match'); return;
        }
        setSavingPassword(true);
        try {
            await changePassword(passwordForm);
            toast.success('Password changed successfully!');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to change password');
        } finally { setSavingPassword(false); }
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Settings</h1>
                <p>Manage your profile and account preferences</p>
            </div>

            <div className="settings-grid">
                {/* Profile Card */}
                <div className="card settings-card">
                    <div className="settings-card-header">
                        <FiUser className="settings-card-icon" />
                        <div>
                            <h3>Profile Information</h3>
                            <p>Update your personal details</p>
                        </div>
                    </div>
                    <div className="settings-profile-badge">
                        <div className="settings-avatar">{user?.name?.charAt(0) || 'U'}</div>
                        <div className="settings-user-meta">
                            <span className="settings-user-name">{user?.name}</span>
                            <span className="settings-user-role">{user?.role}</span>
                        </div>
                    </div>
                    <div className="settings-info-row">
                        <FiHash /> <span>ID:</span> <strong>{user?.userId || '—'}</strong>
                    </div>
                    <div className="settings-info-row">
                        <FiMail /> <span>Email:</span> <strong>{user?.email}</strong>
                    </div>
                    <div className="settings-info-row">
                        <FiShield /> <span>Role:</span> <strong>{user?.role}</strong>
                    </div>
                    {user?.role === 'STUDENT' && (
                        <div className="settings-info-row">
                            <FiUser /> <span>Reputation Score:</span> <strong style={{ color: user?.score < 65 ? '#ef476f' : '#06d6a0' }}>{user?.score || 100}</strong> {user?.score < 65 ? '(Probation)' : ''}
                        </div>
                    )}
                    <form onSubmit={handleProfileSubmit} className="settings-form">
                        <div className="form-group">
                            <label>Display Name</label>
                            <input
                                type="text"
                                value={profileForm.name}
                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                placeholder="Your name"
                            />
                        </div>
                        {user?.role === 'STUDENT' && (
                            <>
                                <div className="form-group">
                                    <label>Resume URL (PDF Link)</label>
                                    <input
                                        type="text"
                                        value={profileForm.resumeUrl}
                                        onChange={(e) => setProfileForm({ ...profileForm, resumeUrl: e.target.value })}
                                        placeholder="Link to your resume"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Skills Block (Comma separated for matches! E.g. Java, React)</label>
                                    <textarea
                                        value={profileForm.skills}
                                        onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                                        placeholder="E.g. Java, React, SQL..."
                                        rows="2"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Habits Block</label>
                                    <textarea
                                        value={profileForm.habits}
                                        onChange={(e) => setProfileForm({ ...profileForm, habits: e.target.value })}
                                        placeholder="E.g. Daily coding, Reading tech blogs..."
                                        rows="2"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Experience Block</label>
                                    <textarea
                                        value={profileForm.experience}
                                        onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                                        placeholder="E.g. Intern at Google, Freelance Developer..."
                                        rows="2"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Education Block</label>
                                    <textarea
                                        value={profileForm.education}
                                        onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })}
                                        placeholder="E.g. B.Tech in CS from xyz university..."
                                        rows="2"
                                    />
                                </div>
                            </>
                        )}
                        <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                            <FiSave /> {savingProfile ? 'Saving...' : 'Update Profile'}
                        </button>
                    </form>
                </div>

                {/* Password Card */}
                <div className="card settings-card">
                    <div className="settings-card-header">
                        <FiLock className="settings-card-icon" />
                        <div>
                            <h3>Change Password</h3>
                            <p>Secure your account with a new password</p>
                        </div>
                    </div>
                    <form onSubmit={handlePasswordSubmit} className="settings-form">
                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={savingPassword}>
                            <FiLock /> {savingPassword ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
