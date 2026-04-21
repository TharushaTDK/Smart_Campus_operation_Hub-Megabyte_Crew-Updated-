import { Link } from 'react-router-dom';
import { useAuth } from '../../App';

export default function LecturerDashboard() {
    const { user } = useAuth();
    const greeting = user ? `HELLO ${user.role.replace('_', ' ')}S` : 'HELLO LECTURERS';

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
                        WELCOME TO <br /> SMART CAMPUS
                    </h1>

                    <p className="text-gray-100 text-lg leading-relaxed mb-10 pl-1 border-l-4 border-blue-500 max-w-xl">
                        This is a unified environment for students, lecturers, and staff inspired by modern Edu Meetings.
                        Manage your domains effortlessly. {user?.subject ? `Domain: ${user.subject}` : ''}
                    </p>

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
                            <svg className="w-10 h-10 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold tracking-wide">Best Students</h3>
                    </div>
                </div>
            </div>
        </div>{/* end hero */}

            {/* ── ADDITIONAL CONTENT ─────────────────────────────────── */}

            {/* Quick Actions */}
            <div className="relative z-10 bg-gray-900 py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-xs font-black text-blue-400 uppercase tracking-[5px] mb-3">Lecturer Tools</p>
                        <h2 className="text-4xl font-extrabold text-white uppercase tracking-tight">Quick Actions</h2>
                        <div className="w-16 h-1 bg-blue-600 mx-auto mt-5 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            {
                                to: '/lecturer/my-sessions',
                                bg: 'bg-blue-600 hover:bg-blue-500',
                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
                                label: 'My Sessions',
                                sub: 'View & manage your booked study sessions',
                            },
                            {
                                to: '/tickets',
                                bg: 'bg-indigo-600 hover:bg-indigo-500',
                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />,
                                label: 'Support Tickets',
                                sub: 'Raise or track a campus support request',
                            },
                            {
                                to: '/profile',
                                bg: 'bg-gray-700 hover:bg-gray-600',
                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
                                label: 'My Profile',
                                sub: 'Update your personal details and settings',
                            },
                        ].map((a, i) => (
                            <Link key={i} to={a.to} className={`${a.bg} rounded-2xl p-8 text-white transition-all hover:-translate-y-1 shadow-lg group`}>
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-5">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{a.icon}</svg>
                                </div>
                                <h3 className="font-black uppercase tracking-widest text-sm mb-2">{a.label}</h3>
                                <p className="text-white/70 text-xs leading-relaxed">{a.sub}</p>
                                <span className="mt-5 inline-block text-xs font-black uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">Go →</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tips for Lecturers */}
            <div className="relative z-10 bg-gray-800/40 py-24 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-xs font-black text-blue-400 uppercase tracking-[5px] mb-3">Good to Know</p>
                        <h2 className="text-4xl font-extrabold text-white uppercase tracking-tight">Lecturer Guidelines</h2>
                        <div className="w-16 h-1 bg-blue-600 mx-auto mt-5 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { num: '01', title: 'Booking Windows', body: 'Sessions can be booked on weekdays between 8 AM – 5 PM and weekends between 8 AM – 8 PM. All slots are in 30-minute intervals.' },
                            { num: '02', title: 'Approval Process', body: 'Every session request is reviewed by the admin. You will receive a real-time notification once your request is approved or rejected.' },
                            { num: '03', title: 'Session Capacity', body: 'Capacity is determined by the facility selected. Students can self-register once your session is approved.' },
                            { num: '04', title: 'Raising Tickets', body: 'For any campus issue — equipment, room conditions, or IT — raise a support ticket and track its progress from the Tickets page.' },
                        ].map((t, i) => (
                            <div key={i} className="flex gap-5 bg-gray-800/60 border border-white/5 rounded-2xl p-7 hover:border-blue-500/30 transition-all">
                                <span className="text-4xl font-black text-blue-600/30 leading-none flex-shrink-0">{t.num}</span>
                                <div>
                                    <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-2">{t.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{t.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
