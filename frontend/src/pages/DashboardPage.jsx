import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import axios from 'axios';

const roleColors = {
    STUDENT: 'bg-blue-100 text-blue-700',
    TEACHER: 'bg-purple-100 text-purple-700',
    ADMIN: 'bg-red-100 text-red-700',
    OPERATOR: 'bg-yellow-100 text-yellow-700',
    MAINTAIN_STAFF: 'bg-green-100 text-green-700',
};

const roleLabel = {
    STUDENT: 'Student',
    TEACHER: 'Teacher',
    ADMIN: 'Administrator',
    OPERATOR: 'Operator',
    MAINTAIN_STAFF: 'Maintenance Staff',
};

export default function DashboardPage() {
    const { user, setUser } = useAuth();   // from global context — no extra fetch
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout', {}, { withCredentials: true });
        } finally {
            setUser(null);
            navigate('/login');
        }
    };

    if (!user) return (
        <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!user) return null;

    const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    return (
        <div className="min-h-[calc(100vh-56px)] bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto space-y-5">

                {/* Welcome header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Hello, {user.name?.split(' ')[0]} 👋
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Welcome to your Smart Campus dashboard
                    </p>
                </div>

                {/* Profile Card */}
                <div className="card p-6">
                    <div className="flex items-start gap-4">

                        {/* Avatar */}
                        {user.photo ? (
                            <img src={user.photo} alt={user.name} referrerPolicy="no-referrer"
                                className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-100 flex-shrink-0" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center
                              text-indigo-700 text-xl font-bold flex-shrink-0">
                                {initials}
                            </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h2 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h2>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold
                                  ${roleColors[user.role] || 'bg-gray-100 text-gray-600'}`}>
                                    {roleLabel[user.role] || user.role}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${user.enabled ? 'bg-green-500' : 'bg-red-400'}`} />
                                {user.enabled ? 'Account active' : 'Account disabled'}
                                {user.provider === 'google' && (
                                    <span className="ml-2 text-gray-400">· via Google</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: 'Role', value: roleLabel[user.role] || user.role },
                        { label: 'Provider', value: user.provider === 'google' ? 'Google' : 'Email & Password' },
                        {
                            label: 'Member since', value: user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
                                : '—'
                        },
                    ].map(({ label, value }) => (
                        <div key={label} className="card px-4 py-3">
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                            <p className="text-sm font-semibold text-gray-800 mt-1">{value}</p>
                        </div>
                    ))}
                </div>

                {/* Sign out */}
                <div className="flex justify-end pt-2">
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300
                       rounded-lg hover:bg-gray-50 hover:text-red-600 hover:border-red-300 transition-colors">
                        Sign out
                    </button>
                </div>

            </div>
        </div>
    );
}
