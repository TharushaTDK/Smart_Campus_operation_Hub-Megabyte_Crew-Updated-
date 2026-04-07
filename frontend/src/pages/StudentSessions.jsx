import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../App';
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    BookOpen,
    CheckCircle,
    XCircle,
    Search,
    Filter
} from 'lucide-react';

const StudentSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const { user } = useAuth();

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const response = await axios.get('/api/study-sessions/approved', { withCredentials: true });
            setSessions(response.data);
        } catch (error) {
            toast.error('Failed to fetch study sessions');
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async (sessionId) => {
        try {
            await axios.post(`/api/study-sessions/${sessionId}/register`, {}, { withCredentials: true });
            toast.success('Session booked successfully!');
            fetchSessions(); // Refresh to update capacity
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to book session');
        }
    };

    const handleCancel = async (sessionId) => {
        try {
            await axios.post(`/api/study-sessions/${sessionId}/cancel-registration`, {}, { withCredentials: true });
            toast.success('Booking cancelled');
            fetchSessions();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to cancel booking');
        }
    };

    const filteredSessions = sessions.filter(session => {
        const matchesSearch = session.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.lecturerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || session.facilityType === filterType;
        return matchesSearch && matchesType;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0f1c] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Study Sessions</h1>
                        <p className="text-blue-400">Browse and book available lecture and lab sessions</p>
                    </div>

                    <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by subject or lecturer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-slate-800/50 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2">
                            <Filter className="text-slate-400 w-5 h-5" />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="bg-transparent text-white focus:outline-none cursor-pointer"
                            >
                                <option value="All">All Types</option>
                                <option value="Lecture Hall">Lecture Halls</option>
                                <option value="Laboratory">Laboratories</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Sessions Grid */}
                {filteredSessions.length === 0 ? (
                    <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-12 text-center">
                        <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-white mb-2">No Sessions Found</h3>
                        <p className="text-slate-400">Check back later for new approved sessions.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSessions.map((session) => {
                            const isRegistered = session.bookedStudentIds?.includes(user?.id);
                            const isFull = session.remainingCapacity <= 0;

                            return (
                                <div
                                    key={session.id}
                                    className="bg-slate-800/40 backdrop-blur-md border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-blue-500/10 p-3 rounded-xl">
                                            <BookOpen className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${session.facilityType === 'Laboratory'
                                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                : 'bg-green-500/10 text-green-400 border border-green-500/20'
                                            }`}>
                                            {session.facilityType}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                        {session.subjectName}
                                    </h3>
                                    <p className="text-slate-400 text-sm mb-4">Code: {session.subjectId} • Unit {session.unitNumber}</p>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center text-slate-300 text-sm">
                                            <Users className="w-4 h-4 mr-2 text-blue-400" />
                                            <span>Lecturer: {session.lecturerName}</span>
                                        </div>
                                        <div className="flex items-center text-slate-300 text-sm">
                                            <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                                            <span>{session.date}</span>
                                        </div>
                                        <div className="flex items-center text-slate-300 text-sm">
                                            <Clock className="w-4 h-4 mr-2 text-blue-400" />
                                            <span>{session.startTime} - {session.endTime}</span>
                                        </div>
                                        <div className="flex items-center text-slate-300 text-sm">
                                            <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                                            <span>{session.facilityName}</span>
                                        </div>
                                        <div className="flex items-center text-slate-300 text-sm">
                                            <div className="w-full bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-blue-500'}`}
                                                    style={{ width: `${((session.capacity - session.remainingCapacity) / session.capacity) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                                            <span>Capacity: {session.capacity}</span>
                                            <span className={isFull ? 'text-red-400 font-bold' : 'text-blue-400'}>
                                                {session.remainingCapacity} seats left
                                            </span>
                                        </div>
                                    </div>

                                    {isRegistered ? (
                                        <button
                                            onClick={() => handleCancel(session.id)}
                                            className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <XCircle className="w-5 h-5" />
                                            Cancel Booking
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleBook(session.id)}
                                            disabled={isFull}
                                            className={`w-full py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${isFull
                                                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                                                }`}
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            {isFull ? 'Session Full' : 'Book Now'}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentSessions;

