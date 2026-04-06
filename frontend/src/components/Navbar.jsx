import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import axios from 'axios';

export default function Navbar() {
    const { pathname } = useLocation();
    const isAuth = pathname === '/login' || pathname === '/register';
    const { user, refetch } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout', {}, { withCredentials: true });
            await refetch();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Hide navbar completely on auth pages — they have their own full-screen layout
    if (isAuth) return null;

    return (
        <nav className="fixed top-0 w-full z-50 bg-gray-900/60 backdrop-blur-sm border-b border-gray-100/10 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Brand */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center
                          text-white text-sm font-bold group-hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                        SC
                    </div>
                    <span className="text-xl font-bold text-white tracking-widest uppercase">SmartCampus</span>
                </Link>

                {/* Nav links — hide on auth pages */}
                {!isAuth && (
                    <div className="flex items-center gap-8">
                        {user ? (
                            <div className="flex items-center gap-6">
                                {/* Conditional Links for Staff vs Students/Lecturers */}
                                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-200">
                                    <Link to="/" className="hover:text-blue-400 focus:text-blue-400 transition-colors tracking-wide uppercase">Home</Link>
                                    <Link to="/about" className="hover:text-blue-400 transition-colors tracking-wide uppercase">About Study Hub</Link>
                                    <Link to="/tickets" className="hover:text-blue-400 transition-colors tracking-wide uppercase">Tickets</Link>
                                    {user.role === 'MAINTAIN_STAFF' ? (
                                        <Link to="/maintenance" className="hover:text-blue-400 transition-colors tracking-wide uppercase">Maintenance Things</Link>
                                    ) : user.role === 'TEACHER' ? (
                                        <Link to="/lecturer/my-sessions" className="hover:text-blue-400 transition-colors tracking-wide uppercase">My Sessions</Link>
                                    ) : (
                                        <Link to="/sessions" className="hover:text-blue-400 transition-colors tracking-wide uppercase">Sessions</Link>
                                    )}
                                </div>

                                <div className="h-6 w-px bg-gray-500/50 hidden md:block"></div>

                                {/* User Context Info */}
                                <Link to="/profile"
                                    className="flex items-center gap-3 hover:bg-gray-800/50 px-3 py-1.5 rounded-xl transition-colors">
                                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <span className="text-sm font-semibold text-white hidden sm:block">{user.name}</span>
                                </Link>

                                <button onClick={handleLogout}
                                    className="text-sm font-bold text-white uppercase tracking-wider bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-lg transition-transform hover:scale-105 shadow-md shadow-red-500/20">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login"
                                    className="px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white hover:text-blue-400 transition-colors">
                                    Login
                                </Link>
                                <Link to="/register"
                                    className="px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-white bg-blue-600 rounded-lg shadow-lg shadow-blue-600/30
                                 hover:bg-blue-700 hover:scale-105 transition-all">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
