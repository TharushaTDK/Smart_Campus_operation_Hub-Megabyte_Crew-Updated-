import { Link } from 'react-router-dom';
import { useAuth } from '../App';

export default function HomePage() {
    const { user } = useAuth();
    const greeting = user ? `HELLO ${user.role.replace('_', ' ')}S` : 'HELLO STUDENTS';

    return (
        <div className="bg-gray-900 overflow-x-hidden">
        <div className="relative min-h-screen">
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000&auto=format&fit=crop" 
                    alt="Students collaborating" 
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 pt-32 pb-32 px-6 max-w-6xl mx-auto flex flex-col justify-center min-h-[90vh]">
                <div className="max-w-2xl text-white">
                    <p className="text-sm md:text-md font-bold tracking-[0.25em] text-white/90 mb-4">{greeting}</p>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6">
                        WELCOME TO <br/> SMART CAMPUS
                    </h1>
                    
                    <p className="text-gray-100 text-lg leading-relaxed mb-10 pl-1 border-l-4 border-blue-500 max-w-xl">
                        This is a unified environment for students, lecturers, and staff inspired by modern Edu Meetings. 
                        Join our digital learning ecosystem to manage operations seamlessly.
                    </p>
                    
                    {!user ? (
                        <Link to="/register" className="inline-block px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-[30px] transition-colors shadow-lg tracking-wider text-sm mt-2">
                            JOIN US NOW!
                        </Link>
                    ) : user.role === 'STUDENT' ? (
                        <Link to="/sessions" className="inline-block px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-[30px] transition-colors shadow-lg tracking-wider text-sm mt-2">
                            VIEW SESSIONS
                        </Link>
                    ) : null}
                </div>
            </div>

            {/* Bottom Cards Floating Overlay */}
            <div className="relative z-20 max-w-6xl mx-auto px-6 pb-20 -mt-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-3xl overflow-hidden shadow-2xl border border-blue-500/20">
                    {/* Card 1 */}
                    <div className="bg-blue-600/95 backdrop-blur-md p-10 text-center text-white border-r border-blue-500/30 border-b md:border-b-0 hover:bg-blue-500 transition-colors">
                        <div className="w-20 h-20 mx-auto mb-5 border border-white/40 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold tracking-wide">Best Education</h3>
                    </div>
                    {/* Card 2 */}
                    <div className="bg-blue-700/95 backdrop-blur-md p-10 text-center text-white border-r border-blue-500/30 border-b md:border-b-0 hover:bg-blue-600 transition-colors">
                        <div className="w-20 h-20 mx-auto mb-5 border border-white/40 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold tracking-wide">Top Teachers</h3>
                    </div>
                    {/* Card 3 */}
                    <div className="bg-blue-800/95 backdrop-blur-md p-10 text-center text-white hover:bg-blue-700 transition-colors">
                        <div className="w-20 h-20 mx-auto mb-5 border border-white/40 rounded-full flex items-center justify-center">
                            {user?.role === 'STUDENT' ? (
                                <svg className="w-10 h-10 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            ) : (
                                <svg className="w-10 h-10 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            )}
                        </div>
                        <h3 className="text-xl font-bold tracking-wide">
                            {user?.role === 'STUDENT' ? 'My Sessions' : 'Best Students'}
                        </h3>
                        {user?.role === 'STUDENT' && (
                            <Link to="/sessions" className="mt-4 inline-block text-xs font-black uppercase tracking-widest text-yellow-300 hover:text-white transition-colors">
                                Browse & Book →
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>{/* end hero */}

            {/* ── ADDITIONAL CONTENT ─────────────────────────────────── */}

            {/* Platform Features */}
            <div className="relative z-10 bg-gray-900 py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-xs font-black text-blue-400 uppercase tracking-[5px] mb-3">What We Offer</p>
                        <h2 className="text-4xl font-extrabold text-white uppercase tracking-tight">Platform Features</h2>
                        <div className="w-16 h-1 bg-blue-600 mx-auto mt-5 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
                                title: 'Session Booking',
                                desc: 'Lecturers can book study hall slots and students can register for approved sessions in real time.'
                            },
                            {
                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />,
                                title: 'Support Tickets',
                                desc: 'Raise and track support tickets for any campus issue. Admins and technicians respond directly.'
                            },
                            {
                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
                                title: 'Facility Management',
                                desc: 'Campus facilities and assets are tracked in real time, with maintenance status always visible.'
                            },
                            {
                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
                                title: 'Live Notifications',
                                desc: 'Get instant notifications for session approvals, ticket updates, and campus activity alerts.'
                            },
                            {
                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
                                title: 'Maintenance Tracking',
                                desc: 'Maintenance staff receive assigned tasks and update statuses, keeping the campus running smoothly.'
                            },
                            {
                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
                                title: 'Role-Based Access',
                                desc: 'Students, lecturers, maintenance staff, and admins each get a tailored view and set of controls.'
                            },
                        ].map((f, i) => (
                            <div key={i} className="bg-gray-800/60 border border-white/5 rounded-2xl p-8 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300">
                                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-5">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">{f.icon}</svg>
                                </div>
                                <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-3">{f.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="relative z-10 bg-gray-800/40 py-24 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-xs font-black text-blue-400 uppercase tracking-[5px] mb-3">Simple Steps</p>
                        <h2 className="text-4xl font-extrabold text-white uppercase tracking-tight">How It Works</h2>
                        <div className="w-16 h-1 bg-blue-600 mx-auto mt-5 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connector line (desktop) */}
                        <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-blue-500/30"></div>
                        {[
                            { step: '01', title: 'Create Your Account', desc: 'Register with your campus email and get instant access to all platform features for your role.' },
                            { step: '02', title: 'Explore Your Dashboard', desc: 'Navigate sessions, tickets, maintenance tasks, or admin controls — everything in one place.' },
                            { step: '03', title: 'Stay Connected', desc: 'Receive real-time notifications and manage your campus activities from anywhere.' },
                        ].map((s, i) => (
                            <div key={i} className="text-center relative">
                                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/30">
                                    <span className="text-white font-black text-lg tracking-wider">{s.step}</span>
                                </div>
                                <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-3">{s.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Banner */}
            {!user && (
                <div className="relative z-10 bg-blue-600 py-20 px-6 border-t border-blue-500/50">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl font-extrabold text-white uppercase tracking-tight mb-4">Ready to Join?</h2>
                        <p className="text-blue-100 text-lg mb-10 leading-relaxed">
                            Join the SmartCampus platform and experience a smarter way to manage your campus life.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register" className="px-10 py-4 bg-white text-blue-700 font-black uppercase tracking-widest rounded-full hover:bg-blue-50 transition-colors shadow-xl text-sm">
                                Register Now
                            </Link>
                            <Link to="/login" className="px-10 py-4 bg-transparent border-2 border-white text-white font-black uppercase tracking-widest rounded-full hover:bg-white/10 transition-colors text-sm">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
