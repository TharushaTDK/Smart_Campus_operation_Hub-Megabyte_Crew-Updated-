import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const roleColors = {
    STUDENT: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
    TEACHER: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
    ADMIN: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30' },
    MAINTAIN_STAFF: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
};

const roleLabels = {
    STUDENT: 'Student',
    TEACHER: 'Lecturer',
    ADMIN: 'Administrator',
    MAINTAIN_STAFF: 'Maintenance Staff',
};

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/auth/me', { withCredentials: true })
            .then(r => { setUser(r.data); setLoading(false); })
            .catch(() => { setLoading(false); navigate('/login'); });
    }, [navigate]);

    const handleLogout = () => {
        axios.post('/api/auth/logout', {}, { withCredentials: true })
            .finally(() => navigate('/login'));
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!user) return null;

    const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    const role = roleColors[user.role] || { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30' };
    const roleLabel = roleLabels[user.role] || user.role;

    const infoItems = [
        { label: 'Email Address', value: user.email, icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        { label: 'Role', value: roleLabel, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { label: 'Sign-in Method', value: user.provider === 'google' ? 'Google OAuth' : 'Email & Password', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
        { label: 'Account Status', value: user.enabled ? 'Active' : 'Disabled', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', status: user.enabled },
        ...(user.subject ? [{ label: 'Subject Domain', value: user.subject, icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' }] : []),
        ...(user.seniority ? [{ label: 'Seniority Level', value: user.seniority, icon: 'M13 10V3L4 14h7v7l9-11h-7z' }] : []),
        ...(user.department ? [{ label: 'Department', value: user.department, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' }] : []),
        ...(user.createdAt ? [{ label: 'Member Since', value: new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }] : []),
    ];

    return (
        <div className="min-h-screen bg-[#0a0f1c] pt-28 pb-16 px-4">
            {/* Background glow */}
            <div className="fixed top-0 right-0 w-[50vw] h-[50vh] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[40vw] h-[40vh] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-3xl mx-auto relative z-10">

                {/* Header Card */}
                <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/5 rounded-[40px] overflow-hidden shadow-2xl mb-6">
                    {/* Banner */}
                    <div className="h-36 bg-gradient-to-r from-blue-600/40 via-indigo-600/40 to-purple-600/40 relative">
                        <div className="absolute inset-0 opacity-20"
                            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                    </div>

                    {/* Avatar + name row */}
                    <div className="px-10 pb-10">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 mb-6">
                            <div className="flex items-end gap-5">
                                {/* Avatar */}
                                <div className="ring-4 ring-[#111827] rounded-full shadow-2xl flex-shrink-0">
                                    {user.photo ? (
                                        <img src={user.photo} alt={user.name} referrerPolicy="no-referrer"
                                            className="w-28 h-28 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-black">
                                            {initials}
                                        </div>
                                    )}
                                </div>
                                {/* Name */}
                                <div className="pb-1">
                                    <h1 className="text-2xl font-black text-white tracking-tight">{user.name}</h1>
                                    <p className="text-slate-400 text-sm mt-0.5">{user.email}</p>
                                </div>
                            </div>

                            {/* Role badge */}
                            <div className={`self-start sm:self-auto px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border ${role.bg} ${role.text} ${role.border}`}>
                                {roleLabel}
                            </div>
                        </div>

                        {/* Status pill */}
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${user.enabled ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-red-400'}`} />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                {user.enabled ? 'Account Active' : 'Account Disabled'}
                            </span>
                            {user.provider === 'google' && (
                                <>
                                    <span className="text-slate-600 mx-1">·</span>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">via Google</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {infoItems.map(({ label, value, icon, status }) => (
                        <div key={label}
                            className="bg-[#111827]/80 backdrop-blur-xl border border-white/5 rounded-3xl px-7 py-5 flex items-center gap-4 hover:border-white/10 transition-colors">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={icon} />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[3px] mb-1">{label}</p>
                                <p className={`text-sm font-bold truncate ${status === false ? 'text-red-400' : status === true ? 'text-emerald-400' : 'text-white'}`}>
                                    {value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/5 rounded-[32px] px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Manage your account</p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-black uppercase tracking-widest transition-all border border-white/5">
                            Go Back
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-xs font-black uppercase tracking-widest transition-all border border-red-500/20 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
