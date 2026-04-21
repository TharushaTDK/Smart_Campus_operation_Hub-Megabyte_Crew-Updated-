import { Link } from 'react-router-dom';
import { useAuth } from '../App';

export default function AboutPage() {
    const { user } = useAuth();

    return (
        <div className="bg-gray-900 overflow-x-hidden">

            {/* ── Hero ─────────────────────────────────────────────── */}
            <div className="relative min-h-[70vh] flex items-center">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=2000&auto=format&fit=crop"
                        alt="Study hub"
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-blue-900/50 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                </div>
                <div className="relative z-10 max-w-6xl mx-auto px-6 py-32">
                    <p className="text-xs font-black text-blue-400 uppercase tracking-[5px] mb-4">SmartCampus Platform</p>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight uppercase mb-6">
                        About <br /><span className="text-blue-400">Study Hub</span>
                    </h1>
                    <p className="text-gray-200 text-lg leading-relaxed max-w-2xl pl-1 border-l-4 border-blue-500">
                        Study Hub is the central booking and collaboration engine inside SmartCampus —
                        connecting lecturers, students, and facilities in a single real-time workspace.
                    </p>
                </div>
            </div>

            {/* ── What is Study Hub ──────────────────────────────── */}
            <div className="py-24 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <p className="text-xs font-black text-blue-400 uppercase tracking-[5px] mb-4">Overview</p>
                        <h2 className="text-4xl font-extrabold text-white uppercase tracking-tight mb-6">
                            What Is<br />Study Hub?
                        </h2>
                        <div className="w-16 h-1 bg-blue-600 mb-8 rounded-full"></div>
                        <p className="text-gray-400 text-base leading-relaxed mb-5">
                            Study Hub is a digital facility management and session booking system built into the
                            SmartCampus platform. It gives lecturers the power to reserve study halls and labs,
                            and gives students a live view of approved sessions they can join.
                        </p>
                        <p className="text-gray-400 text-base leading-relaxed mb-5">
                            Every booking goes through an admin approval workflow, ensuring fair use of campus
                            spaces and preventing scheduling conflicts in real time.
                        </p>
                        <p className="text-gray-400 text-base leading-relaxed">
                            Participants receive instant notifications at every stage — from booking requests to
                            approvals, rejections, and cancellations — keeping everyone in the loop without any
                            manual follow-up.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        {[
                            { value: '24/7', label: 'Platform Access' },
                            { value: '100%', label: 'Real-Time Updates' },
                            { value: 'Multi', label: 'Role Support' },
                            { value: 'Live', label: 'Notifications' },
                        ].map((s, i) => (
                            <div key={i} className="bg-gray-800/60 border border-white/5 rounded-2xl p-8 text-center hover:border-blue-500/30 transition-all">
                                <p className="text-4xl font-black text-blue-400 mb-2">{s.value}</p>
                                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── How Sessions Work ──────────────────────────────── */}
            <div className="py-24 px-6 bg-gray-800/30 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-xs font-black text-blue-400 uppercase tracking-[5px] mb-3">Step by Step</p>
                        <h2 className="text-4xl font-extrabold text-white uppercase tracking-tight">How Sessions Work</h2>
                        <div className="w-16 h-1 bg-blue-600 mx-auto mt-5 rounded-full"></div>
                    </div>
                    <div className="relative">
                        {/* Vertical connector */}
                        <div className="hidden lg:block absolute left-1/2 top-10 bottom-10 w-px bg-blue-500/20 -translate-x-1/2"></div>
                        <div className="space-y-10">
                            {[
                                {
                                    step: '01', side: 'left',
                                    role: 'Lecturer',
                                    title: 'Request a Session',
                                    body: 'A lecturer selects an available study facility, sets a date and time slot within campus hours, and submits a booking request.',
                                },
                                {
                                    step: '02', side: 'right',
                                    role: 'Admin',
                                    title: 'Review & Approve',
                                    body: 'The campus admin reviews the request, checks for conflicts, and either approves or rejects it. The lecturer is notified instantly.',
                                },
                                {
                                    step: '03', side: 'left',
                                    role: 'Student',
                                    title: 'Browse & Register',
                                    body: 'Once approved, the session appears in the public sessions list. Students can register for any session up to its capacity limit.',
                                },
                                {
                                    step: '04', side: 'right',
                                    role: 'Everyone',
                                    title: 'Stay Notified',
                                    body: 'All parties receive real-time notifications for approvals, rejections, capacity updates, and cancellations — no manual checking needed.',
                                },
                            ].map((item, i) => (
                                <div key={i} className={`flex flex-col lg:flex-row items-center gap-8 ${item.side === 'right' ? 'lg:flex-row-reverse' : ''}`}>
                                    <div className="flex-1 bg-gray-800/60 border border-white/5 rounded-2xl p-8 hover:border-blue-500/30 transition-all">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-xs font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-widest">{item.role}</span>
                                        </div>
                                        <h3 className="text-white font-black uppercase tracking-wider text-base mb-3">{item.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">{item.body}</p>
                                    </div>
                                    <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 z-10">
                                        <span className="text-white font-black tracking-wider text-sm">{item.step}</span>
                                    </div>
                                    <div className="flex-1 hidden lg:block"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Facility Types ─────────────────────────────────── */}
            <div className="py-24 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-xs font-black text-blue-400 uppercase tracking-[5px] mb-3">Available Spaces</p>
                        <h2 className="text-4xl font-extrabold text-white uppercase tracking-tight">Facility Types</h2>
                        <div className="w-16 h-1 bg-blue-600 mx-auto mt-5 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
                                name: 'Study Areas',
                                desc: 'Quiet collaborative spaces for group study and individual focus sessions.',
                                color: 'bg-blue-600/20 text-blue-400',
                            },
                            {
                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
                                name: 'Computer Labs',
                                desc: 'Fully equipped computing facilities for software-based learning sessions.',
                                color: 'bg-indigo-600/20 text-indigo-400',
                            },
                            {
                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />,
                                name: 'Science Labs',
                                desc: 'Specialised lab environments for practical science and engineering work.',
                                color: 'bg-cyan-600/20 text-cyan-400',
                            },
                            {
                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.274-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.274.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
                                name: 'Lecture Halls',
                                desc: 'Large capacity halls for seminars, presentations, and group lectures.',
                                color: 'bg-emerald-600/20 text-emerald-400',
                            },
                        ].map((f, i) => (
                            <div key={i} className="bg-gray-800/60 border border-white/5 rounded-2xl p-8 text-center hover:border-blue-500/30 hover:-translate-y-1 transition-all duration-300">
                                <div className={`w-14 h-14 ${f.color} rounded-xl flex items-center justify-center mx-auto mb-5`}>
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">{f.icon}</svg>
                                </div>
                                <h3 className="text-white font-black uppercase tracking-wider text-sm mb-3">{f.name}</h3>
                                <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Booking Rules ──────────────────────────────────── */}
            <div className="py-24 px-6 bg-gray-800/30 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-xs font-black text-blue-400 uppercase tracking-[5px] mb-3">Important Info</p>
                        <h2 className="text-4xl font-extrabold text-white uppercase tracking-tight">Booking Rules</h2>
                        <div className="w-16 h-1 bg-blue-600 mx-auto mt-5 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[
                            { icon: '🕗', title: 'Weekday Hours', body: 'Sessions on weekdays must fall within 8:00 AM – 5:00 PM. No bookings are accepted outside this window.' },
                            { icon: '🕙', title: 'Weekend Hours', body: 'Weekend sessions are allowed between 8:00 AM – 8:00 PM, giving more flexibility for extended study blocks.' },
                            { icon: '⏱', title: '30-Minute Slots', body: 'All start and end times must be in 30-minute increments — e.g. 9:00, 9:30, 10:00. No irregular intervals.' },
                            { icon: '🚫', title: 'No Overlap', body: 'The system automatically detects and blocks any booking that overlaps with an existing approved session for the same facility.' },
                            { icon: '👥', title: 'Capacity Limits', body: 'Each facility has a fixed seat capacity set by the admin. Students cannot register once a session reaches its limit.' },
                            { icon: '✅', title: 'Admin Approval', body: 'Every session request requires admin approval before it becomes visible to students. Pending sessions are not bookable.' },
                        ].map((r, i) => (
                            <div key={i} className="flex gap-5 bg-gray-800/60 border border-white/5 rounded-2xl p-7 hover:border-blue-500/30 transition-all">
                                <span className="text-3xl flex-shrink-0 leading-none">{r.icon}</span>
                                <div>
                                    <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-2">{r.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{r.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── CTA ────────────────────────────────────────────── */}
            <div className="py-20 px-6 border-t border-white/5 bg-blue-600">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl font-extrabold text-white uppercase tracking-tight mb-4">
                        Ready to Book a Session?
                    </h2>
                    <p className="text-blue-100 text-base mb-10 leading-relaxed">
                        {user?.role === 'TEACHER'
                            ? 'Head over to My Sessions to request a study hall slot for your next class.'
                            : user?.role === 'STUDENT'
                                ? 'Browse all approved sessions and register for one that fits your schedule.'
                                : 'Join SmartCampus to access Study Hub and start booking or browsing sessions today.'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {user?.role === 'TEACHER' && (
                            <Link to="/lecturer/my-sessions" className="px-10 py-4 bg-white text-blue-700 font-black uppercase tracking-widest rounded-full hover:bg-blue-50 transition-colors shadow-xl text-sm">
                                My Sessions
                            </Link>
                        )}
                        {user?.role === 'STUDENT' && (
                            <Link to="/sessions" className="px-10 py-4 bg-white text-blue-700 font-black uppercase tracking-widest rounded-full hover:bg-blue-50 transition-colors shadow-xl text-sm">
                                Browse Sessions
                            </Link>
                        )}
                        {!user && (
                            <>
                                <Link to="/register" className="px-10 py-4 bg-white text-blue-700 font-black uppercase tracking-widest rounded-full hover:bg-blue-50 transition-colors shadow-xl text-sm">
                                    Register Now
                                </Link>
                                <Link to="/login" className="px-10 py-4 bg-transparent border-2 border-white text-white font-black uppercase tracking-widest rounded-full hover:bg-white/10 transition-colors text-sm">
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
