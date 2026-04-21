import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../App';

export default function Footer() {
    const { pathname } = useLocation();
    const { user } = useAuth();

    const isAuth = pathname === '/login' || pathname === '/register';
    const isAdmin = pathname.startsWith('/admin');

    if (isAuth || isAdmin) return null;

    return (
        <footer className="bg-gray-900 border-t border-white/10 text-gray-400">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/30">
                                SC
                            </div>
                            <span className="text-lg font-bold text-white tracking-widest uppercase">SmartCampus</span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                            A unified digital platform for students, lecturers, and maintenance staff to manage campus operations seamlessly.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[4px] mb-5">Quick Links</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/" className="hover:text-blue-400 transition-colors tracking-wide uppercase">Home</Link></li>
                            <li><Link to="/tickets" className="hover:text-blue-400 transition-colors tracking-wide uppercase">Tickets</Link></li>
                            {user?.role === 'TEACHER' && (
                                <li><Link to="/lecturer/my-sessions" className="hover:text-blue-400 transition-colors tracking-wide uppercase">My Sessions</Link></li>
                            )}
                            {user?.role === 'STUDENT' && (
                                <li><Link to="/sessions" className="hover:text-blue-400 transition-colors tracking-wide uppercase">Study Sessions</Link></li>
                            )}
                            {user?.role === 'MAINTAIN_STAFF' && (
                                <li><Link to="/maintenance" className="hover:text-blue-400 transition-colors tracking-wide uppercase">Maintenance</Link></li>
                            )}
                            {user && (
                                <li><Link to="/profile" className="hover:text-blue-400 transition-colors tracking-wide uppercase">Profile</Link></li>
                            )}
                        </ul>
                    </div>

                    {/* System Info */}
                    <div>
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[4px] mb-5">System</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                <span className="uppercase tracking-wide">All Systems Operational</span>
                            </li>
                            <li className="uppercase tracking-wide">Smart Campus v1.0</li>
                            <li className="uppercase tracking-wide">Megabyte Crew</li>
                        </ul>
                    </div>

                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-gray-600 uppercase tracking-widest font-bold">
                        &copy; {new Date().getFullYear()} SmartCampus — Megabyte Crew. All rights reserved.
                    </p>
                    <p className="text-[11px] text-gray-600 uppercase tracking-widest font-bold">
                        Built for modern education
                    </p>
                </div>
            </div>
        </footer>
    );
}
