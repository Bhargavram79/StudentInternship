import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';

import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageInternships from './pages/admin/ManageInternships';
import ViewApplications from './pages/admin/ViewApplications';
import AssignTasks from './pages/admin/AssignTasks';
import EvaluateInterns from './pages/admin/EvaluateInterns';
import ManageUsers from './pages/admin/ManageUsers';
import AdminAnnouncements from './pages/admin/Announcements';
import AdminCertificates from './pages/admin/Certificates';
import ReviewReports from './pages/admin/ReviewReports';
import Analytics from './pages/admin/Analytics';

import StudentDashboard from './pages/student/StudentDashboard';
import BrowseInternships from './pages/student/BrowseInternships';
import MyTasks from './pages/student/MyTasks';
import MyFeedback from './pages/student/MyFeedback';
import MyProgress from './pages/student/MyProgress';
import MyApplications from './pages/student/MyApplications';
import StudentAnnouncements from './pages/student/StudentAnnouncements';
import SubmitReport from './pages/student/SubmitReport';
import MyCertificates from './pages/student/MyCertificates';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="ADMIN"><Layout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="internships" element={<ManageInternships />} />
            <Route path="applications" element={<ViewApplications />} />
            <Route path="tasks" element={<AssignTasks />} />
            <Route path="evaluate" element={<EvaluateInterns />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="certificates" element={<AdminCertificates />} />
            <Route path="reports" element={<ReviewReports />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={<ProtectedRoute role="STUDENT"><Layout /></ProtectedRoute>}>
            <Route index element={<StudentDashboard />} />
            <Route path="internships" element={<BrowseInternships />} />
            <Route path="tasks" element={<MyTasks />} />
            <Route path="progress" element={<MyProgress />} />
            <Route path="feedback" element={<MyFeedback />} />
            <Route path="applications" element={<MyApplications />} />
            <Route path="announcements" element={<StudentAnnouncements />} />
            <Route path="reports" element={<SubmitReport />} />
            <Route path="certificates" element={<MyCertificates />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
