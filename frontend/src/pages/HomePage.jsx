import { Link } from 'react-router-dom';
import { useAuth } from '../App';

export default function HomePage() {
    const { user } = useAuth();
    const greeting = user ? `HELLO ${user.role.replace('_', ' ')}S` : 'HELLO STUDENTS';

    return (
        <div className="relative min-h-screen bg-gray-900 overflow-x-hidden">
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
        </div>
    );
}
