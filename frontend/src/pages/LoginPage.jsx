import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../App';
import axios from 'axios';

const GoogleIcon = () => (
    <svg viewBox="0 0 48 48" width="20" height="20">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
);

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { refetch } = useAuth();

    useEffect(() => {
        const oauthError = searchParams.get('error');
        if (oauthError && oauthError !== 'true') {
            setError('Google sign-in failed: ' + decodeURIComponent(oauthError));
        } else if (oauthError === 'true') {
            setError('Google sign-in failed. Please try again.');
        }
    }, [searchParams]);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post('/api/auth/login', form, { withCredentials: true });
            await refetch();
            if (response.data.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Left Panel - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0c4a6e 100%)' }}>

                {/* Background decorative circles */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 -right-40 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 left-1/4 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl" />
                </div>

                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl shadow-blue-500/40">
                        SC
                    </div>
                    <span className="text-white text-xl font-bold tracking-widest uppercase">SmartCampus</span>
                </div>

                {/* Center illustration */}
                <div className="relative z-10 flex-1 flex flex-col justify-center">
                    {/* Campus illustration using SVG */}
                    <div className="mb-8">
                        <svg viewBox="0 0 400 300" className="w-full max-w-md mx-auto opacity-90">
                            {/* Sky */}
                            <rect width="400" height="300" fill="none" />
                            {/* Ground */}
                            <rect x="0" y="220" width="400" height="80" fill="rgba(34,197,94,0.2)" rx="4" />
                            {/* Main building */}
                            <rect x="120" y="80" width="160" height="140" fill="rgba(59,130,246,0.3)" stroke="rgba(147,197,253,0.5)" strokeWidth="1.5" rx="4" />
                            <rect x="170" y="160" width="60" height="60" fill="rgba(59,130,246,0.5)" stroke="rgba(147,197,253,0.6)" strokeWidth="1.5" />
                            {/* Windows grid */}
                            {[0, 1, 2, 3].map(row => [0, 1, 2].map(col => (
                                <rect key={`${row}-${col}`} x={140 + col * 40} y={100 + row * 25} width="20" height="15"
                                    fill={Math.random() > 0.4 ? "rgba(253,224,71,0.7)" : "rgba(99,102,241,0.3)"}
                                    stroke="rgba(147,197,253,0.4)" strokeWidth="0.5" rx="2" />
                            )))}
                            {/* Roof */}
                            <polygon points="110,80 200,30 290,80" fill="rgba(99,102,241,0.4)" stroke="rgba(165,180,252,0.6)" strokeWidth="1.5" />
                            {/* Flag pole */}
                            <line x1="200" y1="30" x2="200" y2="5" stroke="rgba(147,197,253,0.7)" strokeWidth="2" />
                            <rect x="200" y="5" width="20" height="12" fill="rgba(239,68,68,0.6)" rx="1" />
                            {/* Side buildings */}
                            <rect x="30" y="130" width="80" height="90" fill="rgba(99,102,241,0.25)" stroke="rgba(165,180,252,0.4)" strokeWidth="1" rx="3" />
                            <rect x="290" y="145" width="80" height="75" fill="rgba(99,102,241,0.25)" stroke="rgba(165,180,252,0.4)" strokeWidth="1" rx="3" />
                            {/* Trees */}
                            <circle cx="65" cy="218" r="20" fill="rgba(34,197,94,0.4)" />
                            <rect x="62" y="218" width="6" height="20" fill="rgba(120,53,15,0.4)" />
                            <circle cx="335" cy="218" r="18" fill="rgba(34,197,94,0.4)" />
                            <rect x="332" y="218" width="6" height="18" fill="rgba(120,53,15,0.4)" />
                            {/* Path */}
                            <path d="M170 220 Q200 215 230 220 L240 280 Q200 275 160 280 Z" fill="rgba(203,213,225,0.3)" stroke="rgba(203,213,225,0.4)" strokeWidth="1" />
                            {/* Stars/particles */}
                            {[...Array(12)].map((_, i) => (
                                <circle key={i} cx={20 + i * 32} cy={15 + Math.sin(i) * 10} r="1.5" fill="rgba(255,255,255,0.6)" />
                            ))}
                        </svg>
                    </div>

                    <div className="text-center">
                        <h2 className="text-4xl font-black text-white mb-4 leading-tight">
                            Smart Campus<br />
                            <span className="text-transparent bg-clip-text"
                                style={{ backgroundImage: 'linear-gradient(90deg, #60a5fa, #34d399)' }}>
                                Operation Hub
                            </span>
                        </h2>
                        <p className="text-blue-200/80 text-lg leading-relaxed max-w-sm mx-auto">
                            Your integrated platform for managing campus facilities, tickets, and maintenance seamlessly.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="relative z-10 grid grid-cols-3 gap-4">
                    {[
                        { value: '500+', label: 'Study Rooms' },
                        { value: '2K+', label: 'Active Users' },
                        { value: '99%', label: 'Uptime' },
                    ].map(s => (
                        <div key={s.label} className="text-center p-3 rounded-2xl"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div className="text-xl font-black text-white">{s.value}</div>
                            <div className="text-xs text-blue-300/70 mt-0.5">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gray-50">
                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
                        <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-lg">SC</div>
                        <span className="text-gray-800 text-xl font-bold tracking-widest uppercase">SmartCampus</span>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome back 👋</h1>
                        <p className="text-gray-500">Sign in to access your campus dashboard</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Google */}
                    <a href="/oauth2/authorization/google" id="login-google"
                        className="flex items-center justify-center gap-3 w-full py-3.5 px-5 rounded-2xl bg-white border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:border-blue-400 hover:shadow-md transition-all duration-200 mb-6">
                        <GoogleIcon />
                        Continue with Google
                    </a>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-6">
                        <hr className="flex-1 border-gray-200" />
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">or sign in with email</span>
                        <hr className="flex-1 border-gray-200" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                                <input
                                    type="email" name="email" id="login-email"
                                    value={form.email} onChange={handleChange}
                                    placeholder="you@university.edu"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder-gray-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password" id="login-password"
                                    value={form.password} onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder-gray-400"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword
                                        ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88 6.59 6.59m7.532 7.532 3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    }
                                </button>
                            </div>
                        </div>

                        <button type="submit" id="login-submit" disabled={loading}
                            className="w-full py-4 rounded-2xl text-white font-bold text-sm tracking-wide transition-all duration-200 disabled:opacity-60 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                            style={{ background: loading ? '#6b7280' : 'linear-gradient(135deg, #2563eb, #0ea5e9)', boxShadow: loading ? 'none' : '0 8px 24px rgba(37,99,235,0.35)' }}>
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Signing in…
                                </span>
                            ) : 'Sign In →'}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-500 mt-8">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                            Create one free
                        </Link>
                    </p>

                    <p className="text-center text-xs text-gray-400 mt-4">
                        © 2024 SmartCampus · <Link to="/" className="hover:text-gray-600 transition-colors">Back to Home</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
