import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { toast } from 'react-toastify';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

export default function AdminStudySessions() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewingStudents, setViewingStudents] = useState(null);
    const [confirmingCancel, setConfirmingCancel] = useState(null); // stores sessionId to cancel
    const [rejectingSession, setRejectingSession] = useState(null); // stores sessionId to reject
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await axios.get('/api/study-sessions/admin/all', { withCredentials: true });
            setSessions(res.data);
        } catch (err) {
            toast.error('Failed to fetch all sessions');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action, payload = {}) => {
        try {
            await axios.put(`/api/study-sessions/admin/${id}/${action}`, payload, { withCredentials: true });
            toast.success(`Session ${action}ed successfully`);
            fetchSessions();
        } catch (err) {
            toast.error(`Failed to ${action} session`);
        }
    };

    const handleCancelClick = (id) => {
        setConfirmingCancel(id);
    };

    const confirmDelete = async () => {
        if (!confirmingCancel) return;
        try {
            await axios.delete(`/api/study-sessions/admin/${confirmingCancel}`, { withCredentials: true });
            toast.info('Session canceled and protocol updated');
            setConfirmingCancel(null);
            fetchSessions();
        } catch (err) {
            toast.error('Failed to cancel session');
        }
    };

    const confirmReject = async () => {
        if (!rejectingSession) return;
        await handleAction(rejectingSession, 'reject', { reason: rejectReason });
        setRejectingSession(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'Rejected': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        }
    };

    return (
        <div className="flex min-h-screen bg-[#070b14]">
            <Sidebar />
            
            <main className="flex-1 ml-64 p-10 overflow-hidden relative text-slate-300">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -mr-48 -mt-48"></div>

                <div className="relative z-10">
                    <header className="flex justify-between items-center mb-12">
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight uppercase">Study <span className="text-indigo-500">Sessions</span></h1>
                            <p className="text-slate-500 font-bold uppercase tracking-[2px] text-xs mt-2">Resource Allocation & Approval Center</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white/5 border border-white/5 px-6 py-3 rounded-2xl flex flex-col items-center">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Pending</span>
                                <span className="text-xl font-black text-yellow-400">{sessions.filter(s => s.status === 'Pending').length}</span>
                            </div>
                            <div className="bg-white/5 border border-white/5 px-6 py-3 rounded-2xl flex flex-col items-center">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Approved</span>
                                <span className="text-xl font-black text-green-400">{sessions.filter(s => s.status === 'Approved').length}</span>
                            </div>
                        </div>
                    </header>

                    <div className="bg-white/5 border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-xl shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[3px]">Lecturer / Subject</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[3px]">Venue / Type</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[3px]">Schedule</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[3px]">Attendance</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[3px]">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[3px] text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-20 text-center">
                                            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                            <span className="text-slate-500 font-bold uppercase tracking-widest">Fetching Requests...</span>
                                        </td>
                                    </tr>
                                ) : sessions.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-medium">No session requests found.</td>
                                    </tr>
                                ) : (
                                    sessions.map(session => (
                                        <tr key={session.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black">
                                                        {session.lecturerName?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white uppercase tracking-wide text-sm">{session.lecturerName}</p>
                                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{session.subjectName} ({session.subjectId})</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="font-bold text-slate-200 text-sm">{session.facilityName}</p>
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{session.facilityType}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="font-bold text-slate-200 text-sm">{session.date}</p>
                                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{session.startTime} - {session.endTime}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex justify-between items-center w-24">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Seats</span>
                                                        <span className="text-[10px] font-black text-indigo-400">{session.capacity - session.remainingCapacity} / {session.capacity}</span>
                                                    </div>
                                                    <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-indigo-500 rounded-full"
                                                            style={{ width: `${((session.capacity - session.remainingCapacity) / session.capacity) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    {session.status === 'Approved' && (
                                                        <button 
                                                            onClick={() => setViewingStudents(session)}
                                                            className="text-[10px] text-indigo-500 font-black uppercase tracking-wider text-left hover:text-indigo-400 transition-colors mt-1"
                                                        >
                                                            View Students
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${getStatusColor(session.status)}`}>
                                                    {session.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex justify-center gap-2">
                                                    {session.status === 'Pending' ? (
                                                        <>
                                                            <button 
                                                                onClick={() => handleAction(session.id, 'approve')}
                                                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-green-500/20 transition-all"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button 
                                                                onClick={() => { setRejectingSession(session.id); setRejectReason(""); }}
                                                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleCancelClick(session.id)}
                                                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                            Cancel Session
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Students Modal Overlay */}
                {viewingStudents && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#070b14]/80 backdrop-blur-sm" onClick={() => setViewingStudents(null)}></div>
                        <div className="relative bg-[#0d121f] border border-white/10 rounded-[32px] w-full max-w-md p-8 shadow-2xl shadow-indigo-500/10 animate-in fade-in zoom-in duration-300">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Registered Students</h3>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">{viewingStudents.subjectName}</p>
                                </div>
                                <button onClick={() => setViewingStudents(null)} className="text-slate-500 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                            
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {viewingStudents.bookedStudentNames && viewingStudents.bookedStudentNames.length > 0 ? (
                                    viewingStudents.bookedStudentNames.map((name, i) => (
                                        <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-black">
                                                {i + 1}
                                            </div>
                                            <span className="text-white font-bold text-sm uppercase tracking-wide">{name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">No students registered yet</p>
                                    </div>
                                )}
                            </div>
                            
                            <button 
                                onClick={() => setViewingStudents(null)}
                                className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-[2px] rounded-2xl border border-white/5 transition-all"
                            >
                                Close Dashboard
                            </button>
                        </div>
                    </div>
                )}

                {/* Confirm Cancellation Modal */}
                {confirmingCancel && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#070b14]/90 backdrop-blur-md" onClick={() => setConfirmingCancel(null)}></div>
                        <div className="relative bg-[#0d121f] border border-red-500/20 rounded-[32px] w-full max-w-sm p-8 shadow-2xl shadow-red-500/10 animate-in fade-in zoom-in duration-300 text-center">
                            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Confirm Cancellation</h3>
                            <p className="text-slate-400 text-xs font-bold leading-relaxed mb-8 uppercase tracking-wider">
                                This action will permanently delete the session and send real-time alerts to all 
                                registered participants.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => setConfirmingCancel(null)}
                                    className="py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/5 transition-all"
                                >
                                    Go Back
                                </button>
                                <button 
                                    onClick={confirmDelete}
                                    className="py-4 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-red-500/30 transition-all border border-red-400/20"
                                >
                                    Cancel Session
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reject Session Modal */}
                {rejectingSession && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#070b14]/90 backdrop-blur-md" onClick={() => setRejectingSession(null)}></div>
                        <div className="relative bg-[#0d121f] border border-red-500/20 rounded-[32px] w-full max-w-sm p-8 shadow-2xl shadow-red-500/10 animate-in fade-in zoom-in duration-300 text-center">
                            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Reject Session</h3>
                            <p className="text-slate-400 text-xs font-bold leading-relaxed mb-6 uppercase tracking-wider">
                                Please provide a reason for rejecting this study session request.
                            </p>
                            <textarea 
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm focus:border-red-500 outline-none mb-6 resize-none custom-scrollbar"
                                placeholder="E.g. Facility is currently blocked for lab maintenance..."
                                rows="3"
                            ></textarea>
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => setRejectingSession(null)}
                                    className="py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmReject}
                                    className="py-4 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-red-500/30 transition-all border border-red-400/20"
                                >
                                    Submit Reject
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
