import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const CheckItem = ({ text }) => (
    <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(52,211,153,0.2)', border: '1px solid rgba(52,211,153,0.4)' }}>
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <span className="text-blue-100/80 text-sm">{text}</span>
    </div>
);

export default function RegisterPage() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { refetch } = useAuth();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await axios.post('/api/auth/register', form, { withCredentials: true });
            await axios.post('/api/auth/login', { email: form.email, password: form.password }, { withCredentials: true });
            await refetch();
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = (pw) => {
        if (pw.length === 0) return null;
        if (pw.length < 6) return { level: 1, label: 'Too short', color: '#ef4444' };
        if (pw.length < 10 && !/[A-Z]/.test(pw)) return { level: 2, label: 'Fair', color: '#f59e0b' };
        if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) return { level: 4, label: 'Strong', color: '#10b981' };
        return { level: 3, label: 'Good', color: '#3b82f6' };
    };
    const strength = passwordStrength(form.password);

    return (
        <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* Left Panel - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a1a5e 50%, #0c2a6e 100%)' }}>

                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-blue-400/8 rounded-full blur-2xl" />
                </div>

                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl shadow-indigo-500/40">
                        SC
                    </div>
                    <span className="text-white text-xl font-bold tracking-widest uppercase">SmartCampus</span>
                </div>

                {/* Content */}
                <div className="relative z-10 flex-1 flex flex-col justify-center">
                    <div className="mb-10">
                        <h2 className="text-4xl font-black text-white mb-4 leading-tight">
                            Join the Smart<br/>
                            <span className="text-transparent bg-clip-text"
                                style={{ backgroundImage: 'linear-gradient(90deg, #a78bfa, #60a5fa)' }}>
                                Campus Community
                            </span>
                        </h2>
                        <p className="text-blue-200/70 text-lg leading-relaxed mb-8">
                            Create your free account and get instant access to all campus facilities and resources.
                        </p>
                        <div className="space-y-3">
                            <CheckItem text="Book study rooms and laboratories instantly" />
                            <CheckItem text="Submit and track maintenance tickets" />
                            <CheckItem text="Get real-time facility availability updates" />
                            <CheckItem text="Access campus resources from anywhere" />
                        </div>
                    </div>

                    {/* Role cards */}
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { emoji: '🎓', role: 'Student', desc: 'Book rooms & resources' },
                            { emoji: '👨‍🏫', role: 'Lecturer', desc: 'Manage class sessions' },
                            { emoji: '🔧', role: 'Staff', desc: 'Handle maintenance' },
                            { emoji: '⚙️', role: 'Admin', desc: 'Oversee operations' },
                        ].map(r => (
                            <div key={r.role} className="p-3 rounded-xl"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <span className="text-xl">{r.emoji}</span>
                                <div className="text-white text-sm font-semibold mt-1">{r.role}</div>
                                <div className="text-blue-300/60 text-xs">{r.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-blue-300/50 text-xs text-center">
                    © 2024 SmartCampus Operation Hub • All rights reserved
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gray-50 overflow-y-auto">
                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
                        <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-lg">SC</div>
                        <span className="text-gray-800 text-xl font-bold tracking-widest uppercase">SmartCampus</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Create your account ✨</h1>
                        <p className="text-gray-500">Join thousands of students on campus</p>
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
                    <a href="/oauth2/authorization/google" id="reg-google"
                        className="flex items-center justify-center gap-3 w-full py-3.5 px-5 rounded-2xl bg-white border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:border-indigo-400 hover:shadow-md transition-all duration-200 mb-6">
                        <GoogleIcon />
                        Sign up with Google
                    </a>

                    <div className="flex items-center gap-4 mb-6">
                        <hr className="flex-1 border-gray-200" />
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">or register with email</span>
                        <hr className="flex-1 border-gray-200" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <input type="text" name="name" id="reg-name"
                                    value={form.name} onChange={handleChange}
                                    placeholder="John Doe" required
                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <input type="email" name="email" id="reg-email"
                                    value={form.email} onChange={handleChange}
                                    placeholder="you@university.edu" required
                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <input type={showPassword ? 'text' : 'password'}
                                    name="password" id="reg-password"
                                    value={form.password} onChange={handleChange}
                                    placeholder="At least 6 characters" required minLength={6}
                                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder-gray-400"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword
                                        ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88 6.59 6.59m7.532 7.532 3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    }
                                </button>
                            </div>
                            {/* Password strength */}
                            {strength && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex gap-1 flex-1">
                                        {[1,2,3,4].map(i => (
                                            <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300"
                                                style={{ backgroundColor: i <= strength.level ? strength.color : '#e5e7eb' }} />
                                        ))}
                                    </div>
                                    <span className="text-xs font-medium" style={{ color: strength.color }}>{strength.label}</span>
                                </div>
                            )}
                        </div>

                        <button type="submit" id="reg-submit" disabled={loading}
                            className="w-full py-4 rounded-2xl text-white font-bold text-sm tracking-wide transition-all duration-200 disabled:opacity-60 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                            style={{ background: loading ? '#6b7280' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: loading ? 'none' : '0 8px 24px rgba(99,102,241,0.35)' }}>
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Creating account…
                                </span>
                            ) : 'Create Account →'}
                        </button>

                        <p className="text-center text-xs text-gray-400">
                            By registering you agree to our{' '}
                            <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
                        </p>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-8">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                            Sign in
                        </Link>
                    </p>

                    <p className="text-center text-xs text-gray-400 mt-4">
                        <Link to="/" className="hover:text-gray-600 transition-colors">← Back to Home</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
