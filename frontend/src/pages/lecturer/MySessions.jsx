import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../App';
import { toast } from 'react-toastify';

export default function MySessions() {
    const { user } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        subjectName: '',
        subjectId: '',
        unitNumber: '',
        date: '',
        startTime: '',
        endTime: '',
        facilityId: '',
        facilityType: 'Lecture Hall'
    });

    useEffect(() => {
        fetchSessions();
        fetchFacilities();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await axios.get('/api/study-sessions/my', { withCredentials: true });
            setSessions(res.data);
        } catch (err) {
            toast.error('Failed to fetch sessions');
        } finally {
            setLoading(false);
        }
    };

    const fetchFacilities = async () => {
        try {
            const res = await axios.get('/api/study-sessions/available-facilities', { withCredentials: true });
            setFacilities(res.data);
        } catch (err) {
            toast.error('Failed to fetch facilities');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/study-sessions/book', formData, { withCredentials: true });
            toast.success('Session requested successfully!');
            setShowForm(false);
            fetchSessions();
            setFormData({
                subjectName: '',
                subjectId: '',
                unitNumber: '',
                date: '',
                startTime: '',
                endTime: '',
                facilityId: '',
                facilityType: 'Lecture Hall'
            });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to book session');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'Rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        }
    };

    const filteredFacilities = facilities.filter(f => {
        const type = f.type || '';
        if (formData.facilityType === 'Lecture Hall') {
            return type === 'Lecture Hall';
        }
        if (formData.facilityType === 'Laboratory') {
            const lowerType = type.toLowerCase();
            return lowerType.includes('lab') || lowerType.includes('laboratory');
        }
        return false;
    });
    const selectedFacility = facilities.find(f => f.id === formData.facilityId);

    return (
        <div className="min-h-screen bg-[#0a0f1c] text-slate-200 pt-28 pb-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight uppercase">My <span className="text-blue-500">Sessions</span></h1>
                        <p className="text-slate-400 mt-2 font-medium">Book and manage your lecture and lab sessions</p>
                    </div>
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                    >
                        {showForm ? 'Cancel Request' : 'Book New Session'}
                    </button>
                </div>

                {showForm && (
                    <div className="bg-[#131c31] border border-white/5 rounded-3xl p-8 mb-10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                        <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Session Request Form</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Subject Name</label>
                                <input name="subjectName" value={formData.subjectName} onChange={handleInputChange} required className="w-full bg-[#1a243d] border border-white/5 rounded-2xl px-5 py-3.5 focus:border-blue-500/50 outline-none transition-all font-medium" placeholder="E.g. Computer Science" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Subject ID</label>
                                <input name="subjectId" value={formData.subjectId} onChange={handleInputChange} required className="w-full bg-[#1a243d] border border-white/5 rounded-2xl px-5 py-3.5 focus:border-blue-500/50 outline-none transition-all font-medium" placeholder="E.g. CS101" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Unit Number</label>
                                <input name="unitNumber" value={formData.unitNumber} onChange={handleInputChange} required className="w-full bg-[#1a243d] border border-white/5 rounded-2xl px-5 py-3.5 focus:border-blue-500/50 outline-none transition-all font-medium" placeholder="E.g. Unit 01" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Date</label>
                                <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full bg-[#1a243d] border border-white/5 rounded-2xl px-5 py-3.5 focus:border-blue-500/50 outline-none transition-all font-medium color-scheme-dark" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Start Time (30-min intervals)</label>
                                <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} required className="w-full bg-[#1a243d] border border-white/5 rounded-2xl px-5 py-3.5 focus:border-blue-500/50 outline-none transition-all font-medium" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">End Time</label>
                                <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} required className="w-full bg-[#1a243d] border border-white/5 rounded-2xl px-5 py-3.5 focus:border-blue-500/50 outline-none transition-all font-medium" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Facility Type</label>
                                <select name="facilityType" value={formData.facilityType} onChange={handleInputChange} className="w-full bg-[#1a243d] border border-white/5 rounded-2xl px-5 py-3.5 focus:border-blue-500/50 outline-none transition-all font-medium">
                                    <option value="Lecture Hall">Lecture Hall</option>
                                    <option value="Laboratory">Laboratory</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Select {formData.facilityType}</label>
                                <select name="facilityId" value={formData.facilityId} onChange={handleInputChange} required className="w-full bg-[#1a243d] border border-white/5 rounded-2xl px-5 py-3.5 focus:border-blue-500/50 outline-none transition-all font-medium">
                                    <option value="">Choose a facility...</option>
                                    {filteredFacilities.map(f => (
                                        <option key={f.id} value={f.id}>{f.name} (Cap: {f.capacity})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2 pt-4 flex items-center justify-between">
                                {selectedFacility && (
                                    <div className="text-blue-400 font-bold bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20 text-sm">
                                        Capacity: {selectedFacility.capacity} Students
                                    </div>
                                )}
                                <button type="submit" className="ml-auto px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-blue-500/25 transition-all">Submit Request</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-500 font-bold uppercase tracking-widest">Loading your sessions...</p>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center py-20 bg-[#131c31] border border-white/5 rounded-[40px]">
                            <p className="text-slate-400 text-lg">No sessions booked yet.</p>
                        </div>
                    ) : (
                        sessions.map(session => (
                            <div key={session.id} className="bg-[#131c31] border border-white/5 rounded-[32px] p-6 hover:border-white/10 transition-all group shadow-xl">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 transition-transform group-hover:scale-110">
                                            {session.facilityType === 'Laboratory' ? (
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                                            ) : (
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-white uppercase tracking-tight">{session.subjectName} <span className="text-blue-500/50 text-sm ml-2 font-bold">{session.subjectId}</span></h3>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">{session.facilityName}</span>
                                                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                                <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Unit: {session.unitNumber}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="bg-[#1a243d] px-4 py-2 rounded-xl text-center border border-white/5">
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Date</p>
                                            <p className="text-sm font-bold text-white tracking-widest">{session.date}</p>
                                        </div>
                                        <div className="bg-[#1a243d] px-4 py-2 rounded-xl text-center border border-white/5">
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Time</p>
                                            <p className="text-sm font-bold text-white tracking-widest">{session.startTime} - {session.endTime}</p>
                                        </div>
                                        <div className={`px-5 py-2 rounded-xl border font-black uppercase tracking-[2px] text-xs ${getStatusColor(session.status)}`}>
                                            {session.status}
                                        </div>
                                        
                                        {session.status === 'Approved' && (
                                            <div className="flex flex-col gap-1 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl min-w-[120px]">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Attendance</span>
                                                    <span className="text-[10px] font-black text-white">{session.capacity - session.remainingCapacity} / {session.capacity}</span>
                                                </div>
                                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                                        style={{ width: `${((session.capacity - session.remainingCapacity) / session.capacity) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {session.status === 'Rejected' && session.rejectReason && (
                                    <div className="mt-6 pt-5 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-500">
                                        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 flex gap-4 items-start">
                                            <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black text-red-500/80 uppercase tracking-[2px]">Notice from Administration</span>
                                                <p className="text-sm font-bold text-red-100/80 leading-relaxed mt-1">{session.rejectReason}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
