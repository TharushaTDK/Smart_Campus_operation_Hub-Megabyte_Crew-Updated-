import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import axios from 'axios';

export default function UserDetails() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout', {}, { withCredentials: true });
        } finally {
            setUser(null);
            navigate('/login');
        }
    };

    if (!user) return null;

    const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-16 px-6 relative mt-20">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                    
                    <div className="px-8 pb-8">
                        {/* Avatar */}
                        <div className="relative -mt-16 mb-6 flex justify-between items-end">
                            <div className="w-32 h-32 bg-white rounded-full p-2 rounded-full shadow-md">
                                {user.photo ? (
                                    <img src={user.photo} alt={user.name} referrerPolicy="no-referrer"
                                        className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-4xl font-bold">
                                        {initials}
                                    </div>
                                )}
                            </div>
                            <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 uppercase tracking-widest shadow-sm border border-blue-200">
                                {user.role.replace('_', ' ')}
                            </span>
                        </div>

                        {/* Details */}
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{user.name}</h1>
                            <p className="text-gray-500 font-medium mb-8 flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                {user.email}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Account Status</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2.5 h-2.5 rounded-full ${user.enabled ? 'bg-green-500' : 'bg-red-500'} shadow-sm`} />
                                        <span className="text-gray-900 font-semibold">{user.enabled ? 'Active Account' : 'Suspended'}</span>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Last Login</p>
                                    <p className="text-gray-900 font-semibold">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Unknown'}</p>
                                </div>

                                {user.subject && (
                                    <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                                        <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Domain / Subject</p>
                                        <p className="text-blue-900 font-semibold">{user.subject}</p>
                                    </div>
                                )}
                                {user.seniority && (
                                    <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                                        <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Seniority Level</p>
                                        <p className="text-blue-900 font-semibold">{user.seniority}</p>
                                    </div>
                                )}
                                {user.department && (
                                    <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                                        <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Department</p>
                                        <p className="text-blue-900 font-semibold">{user.department}</p>
                                    </div>
                                )}
                            </div>

                            <hr className="border-gray-200 mb-8" />

                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    Go Back
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-8 py-2.5 text-sm font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">
                                    Log out of SmartCampus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
