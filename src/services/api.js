// ============ REAL API LAYER ============
// Connects React frontend to Spring Boot backend
import axios from 'axios';

// Base URL — hardcoded for Github Pages deployment to talk to laptop tunnel
const API = axios.create({
    baseURL: 'https://695ef2ba38b780.lhr.life/api',
});

// ✅ Add JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Helper: get current user from localStorage
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch {
        return null;
    }
}

// ====================== AUTH ======================
export async function register(data) {
    const res = await API.post('/auth/register', data);
    // Store JWT token from auto-login response
    if (res.data?.data?.token) {
        localStorage.setItem('token', res.data.data.token);
    }
    return res.data;
}

export async function login(data) {
    const res = await API.post('/auth/login', data);
    // Store JWT token separately
    if (res.data?.data?.token) {
        localStorage.setItem('token', res.data.data.token);
    }
    return res.data;
}

export async function forgotPassword(email) {
    const res = await API.post('/auth/forgot-password', { email });
    return res.data;
}

export async function verifyOtp(email, otp) {
    const res = await API.post('/auth/verify-otp', { email, otp });
    return res.data;
}

export async function resetPassword(email, otp, newPassword) {
    const res = await API.post('/auth/reset-password', { email, otp, newPassword });
    return res.data;
}

export async function getValidatedUser(userId) {
    const res = await API.get(`/auth/validate/${userId}`);
    return res.data;
}

// ====================== INTERNSHIPS ======================
export async function getInternships() {
    const res = await API.get('/internships');
    return res.data;
}

export async function getInternship(id) {
    const res = await API.get(`/internships/${id}`);
    return res.data;
}

export async function createInternship(data) {
    const res = await API.post('/internships', data);
    return res.data;
}

export async function updateInternship(id, data) {
    const res = await API.put(`/internships/${id}`, data);
    return res.data;
}

export async function deleteInternship(id) {
    const res = await API.delete(`/internships/${id}`);
    return res.data;
}

// ====================== APPLICATIONS ======================
export async function applyToInternship(internshipId) {
    const user = getCurrentUser();
    const res = await API.post('/applications', {
        studentId: user.id,
        internshipId
    });
    return res.data;
}

export async function getMyApplications() {
    const user = getCurrentUser();
    const res = await API.get(`/applications/student/${user.id}`);
    return res.data;
}

export async function getAllApplications() {
    const res = await API.get('/applications');
    return res.data;
}

export async function updateApplicationStatus(id, status) {
    const res = await API.put(`/applications/${id}/status`, { status });
    return res.data;
}

// ====================== TASKS ======================
export async function createTask(data) {
    const res = await API.post('/tasks', data);
    return res.data;
}

export async function getAllTasks() {
    const res = await API.get('/tasks');
    return res.data;
}

export async function getMyTasks() {
    const user = getCurrentUser();
    const res = await API.get(`/tasks/student/${user.id}`);
    return res.data;
}

export async function updateTaskStatus(id, status) {
    const res = await API.put(`/tasks/${id}/status`, { status });
    return res.data;
}

export async function deleteTask(id) {
    const res = await API.delete(`/tasks/${id}`);
    return res.data;
}

// ====================== REPORTS ======================
export async function submitReport(data) {
    const user = getCurrentUser();
    const res = await API.post('/reports', { ...data, studentId: user.id });
    return res.data;
}

export async function getAllReports() {
    const res = await API.get('/reports');
    return res.data;
}

export async function getMyReports() {
    const user = getCurrentUser();
    const res = await API.get(`/reports/student/${user.id}`);
    return res.data;
}

export async function gradeReport(reportId, grade) {
    const user = getCurrentUser();
    const res = await API.put(`/reports/${reportId}/grade`, {
        grade,
        gradedById: user.id
    });
    return res.data;
}

// ====================== FEEDBACK ======================
export async function submitFeedback(data) {
    const user = getCurrentUser();
    const res = await API.post('/feedback', { ...data, mentorId: user.id });
    return res.data;
}

export async function getAllFeedback() {
    const res = await API.get('/feedback');
    return res.data;
}

export async function getMyFeedback() {
    const user = getCurrentUser();
    const res = await API.get(`/feedback/student/${user.id}`);
    return res.data;
}

// ====================== USERS ======================
export async function getStudents() {
    const res = await API.get('/users/students');
    return res.data;
}

export async function getUsers() {
    const res = await API.get('/users');
    return res.data;
}

export async function createUser(data) {
    const res = await API.post('/users', data);
    return res.data;
}

export async function deleteUser(id) {
    const res = await API.delete(`/users/${id}`);
    return res.data;
}

export async function updateProfile(data) {
    const user = getCurrentUser();
    const res = await API.put(`/users/${user.id}/profile`, data);
    return res.data;
}

export async function changePassword(data) {
    const user = getCurrentUser();
    const res = await API.put(`/users/${user.id}/password`, data);
    return res.data;
}

// ====================== NOTIFICATIONS ======================
export async function getNotifications() {
    const user = getCurrentUser();
    const res = await API.get(`/notifications/user/${user.id}?role=${user.role}`);
    return res.data;
}

export async function markNotificationRead(id) {
    const res = await API.put(`/notifications/${id}/read`);
    return res.data;
}

export async function markAllNotificationsRead() {
    const user = getCurrentUser();
    const res = await API.put(`/notifications/user/${user.id}/read-all`);
    return res.data;
}

// ====================== ANNOUNCEMENTS ======================
export async function getAnnouncements() {
    const res = await API.get('/announcements');
    return res.data;
}

export async function createAnnouncement(data) {
    const user = getCurrentUser();
    const res = await API.post('/announcements', { ...data, authorId: user.id });
    return res.data;
}

export async function deleteAnnouncement(id) {
    const res = await API.delete(`/announcements/${id}`);
    return res.data;
}

// ====================== CERTIFICATES ======================
export async function getCertificates() {
    const res = await API.get('/certificates');
    return res.data;
}

export async function getMyCertificates() {
    const user = getCurrentUser();
    const res = await API.get(`/certificates/student/${user.id}`);
    return res.data;
}

export async function issueCertificate(data) {
    const res = await API.post('/certificates', data);
    return res.data;
}

export async function getEligibleForCertificate() {
    const res = await API.get('/certificates/eligible');
    return res.data;
}

// ====================== AI ASSISTANT ======================
export async function chatWithAi(message) {
    const res = await API.post('/ai/chat', { message });
    return res.data;
}

export default {};
