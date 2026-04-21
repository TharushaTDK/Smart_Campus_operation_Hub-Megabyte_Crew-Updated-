import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

axios.defaults.withCredentials = true;
// axios.defaults.baseURL = 'http://localhost:8081'; // Removed: Use Vite proxy for JSESSIONID handling
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LecturerDashboard from './pages/lecturer/LecturerDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminAddUser from './pages/admin/AdminAddUser';
import AdminFacilityManagement from './pages/admin/AdminFacilityManagement';
import AdminMaintenanceManagement from './pages/admin/AdminMaintenanceManagement';
import UserDetails from './pages/UserDetails';
import StaffMaintenance from './pages/staff/StaffMaintenance';
import MySessions from './pages/lecturer/MySessions';
import AdminStudySessions from './pages/admin/AdminStudySessions';
import AdminTickets from './pages/admin/AdminTickets';
import StudentSessions from './pages/StudentSessions';
import Tickets from './pages/Tickets';
import AboutPage from './pages/AboutPage';

// ── Auth Context ─────────────────────────────────────────────────────────────
export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
    const [user, setUser] = useState(undefined); // undefined = still loading
    const [loading, setLoading] = useState(true);

    const fetchMe = () =>
        axios.get('/api/auth/me', { withCredentials: true })
            .then(r => { setUser(r.data); })
            .catch(() => { setUser(null); })
            .finally(() => setLoading(false));

    useEffect(() => { fetchMe(); }, []);

    return (
        <AuthContext.Provider value={{ user, loading, setUser, refetch: fetchMe }}>
            {children}
        </AuthContext.Provider>
    );
}

// ── Protected route ──────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );
    return user ? children : <Navigate to="/login" replace />;
}

function AdminProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );
    if (!user) return <Navigate to="/login" replace />;
    return user.role === 'ADMIN' ? children : <Navigate to="/dashboard" replace />;
}

function AppContent() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    const DashboardRedirect = () => {
        const { user } = useAuth();
        if (!user) return <Navigate to="/login" replace />;
        if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
        if (user.role === 'TEACHER') return <Navigate to="/lecturer/dashboard" replace />;
        if (user.role === 'MAINTAIN_STAFF') return <Navigate to="/staff/dashboard" replace />;
        return <Navigate to="/" replace />; // Students use the homepage natively
    };

    return (
        <>
            {!isAdminRoute && <Navbar />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/sessions" element={<ProtectedRoute><StudentSessions /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />

                {/* Role-Specific Dashboards */}
                <Route path="/lecturer/dashboard" element={<ProtectedRoute><LecturerDashboard /></ProtectedRoute>} />
                <Route path="/lecturer/my-sessions" element={<ProtectedRoute><MySessions /></ProtectedRoute>} />
                <Route path="/staff/dashboard" element={<ProtectedRoute><StaffDashboard /></ProtectedRoute>} />
                <Route path="/maintenance" element={<ProtectedRoute><StaffMaintenance /></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
                <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
                <Route path="/admin/users/add" element={<AdminProtectedRoute><AdminAddUser /></AdminProtectedRoute>} />
                <Route path="/admin/facility-management" element={<AdminProtectedRoute><AdminFacilityManagement /></AdminProtectedRoute>} />
                <Route path="/admin/maintenance" element={<AdminProtectedRoute><AdminMaintenanceManagement /></AdminProtectedRoute>} />
                <Route path="/admin/study-sessions" element={<AdminProtectedRoute><AdminStudySessions /></AdminProtectedRoute>} />
                <Route path="/admin/tickets" element={<AdminProtectedRoute><AdminTickets /></AdminProtectedRoute>} />

                <Route path="/tickets" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><UserDetails /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            {!isAdminRoute && <Footer />}
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppContent />
                <ToastContainer position="top-right" autoClose={3000} theme="dark" />
            </AuthProvider>
        </BrowserRouter>
    );
}
