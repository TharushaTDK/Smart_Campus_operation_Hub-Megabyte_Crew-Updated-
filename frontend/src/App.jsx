import { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import UserDetails from './pages/UserDetails';
import StudentSessions from './pages/StudentSessions';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminAddUser from './pages/admin/AdminAddUser';
import LecturerDashboard from './pages/lecturer/LecturerDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';

const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider({ children }) {
    const [user, setUser] = useState(undefined); // undefined = loading

    const refetch = async () => {
        try {
            const res = await axios.get('/api/auth/me', { withCredentials: true });
            setUser(res.data);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        refetch();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, refetch }}>
            {children}
        </AuthContext.Provider>
    );
}

function PrivateRoute({ children, adminOnly = false }) {
    const { user } = useAuth();
    if (user === undefined) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
    if (!user) return <Navigate to="/login" replace />;
    if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" replace />;
    return children;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                    <Route path="/user-details" element={<PrivateRoute><UserDetails /></PrivateRoute>} />
                    <Route path="/sessions" element={<PrivateRoute><StudentSessions /></PrivateRoute>} />
                    <Route path="/lecturer/my-sessions" element={<PrivateRoute><LecturerDashboard /></PrivateRoute>} />
                    <Route path="/maintenance" element={<PrivateRoute><StaffDashboard /></PrivateRoute>} />
                    <Route path="/admin/dashboard" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
                    <Route path="/admin/users" element={<PrivateRoute adminOnly><AdminUsers /></PrivateRoute>} />
                    <Route path="/admin/users/add" element={<PrivateRoute adminOnly><AdminAddUser /></PrivateRoute>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <ToastContainer position="top-right" autoClose={3000} theme="colored" />
            </BrowserRouter>
        </AuthProvider>
    );
}
