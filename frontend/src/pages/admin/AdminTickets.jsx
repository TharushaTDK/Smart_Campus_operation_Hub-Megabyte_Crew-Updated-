import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../App';
import { toast } from 'react-toastify';
import { 
    MessageSquare, Send, CheckCircle, Clock, Filter, 
    User, UserCheck, ShieldAlert, ArrowLeft, Trash2,
    Calendar, Info, AlertCircle, ChevronRight, Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminTickets() {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [reply, setReply] = useState('');
    const { user: currentUser } = useAuth();

    useEffect(() => {
        console.log("AdminTickets Loaded V2 - Sync Check");
        fetchTickets();
        fetchTechnicians();
    }, [activeFilter]);

    const fetchTickets = async () => {
        try {
            const url = activeFilter === 'ALL' ? '/api/tickets/admin/all' : `/api/tickets/admin/all?role=${activeFilter}`;
            const res = await axios.get(url, { withCredentials: true });
            setTickets(res.data);
            if (selectedTicket) {
                const refreshed = res.data.find(t => t.id === selectedTicket.id);
                if (refreshed) setSelectedTicket(refreshed);
            }
        } catch (err) {
            toast.error('Failed to fetch tickets');
        } finally {
            setLoading(false);
        }
    };

    const fetchTechnicians = async () => {
        try {
            const res = await axios.get('/api/admin/users/role/MAINTAIN_STAFF', { withCredentials: true });
            setTechnicians(res.data);
        } catch (err) {
            console.error('Failed to fetch technicians');
        }
    };

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!reply.trim()) return;
        try {
            console.log("Sending reply to V2 endpoint...");
            await axios.post(`/api/tickets/v2/${selectedTicket.id}/messages`, { content: reply }, { withCredentials: true });
            setReply('');
            fetchTickets();
        } catch (err) {
            console.error("Reply Failure:", err);
            toast.error('Failed to send message');
        }
    };

    const handleUpdateStatus = async (status) => {
        let note = '';
        if (status === 'RESOLVED') {
            note = window.prompt('Enter resolution notes:', '');
            if (note === null) return;
        } else if (status === 'REJECTED') {
            note = window.prompt('Enter rejection reason:', '');
            if (note === null) return;
        }

        try {
            console.log("Updating status via V2 endpoint...");
            await axios.post(`/api/tickets/v2/${selectedTicket.id}/status`, { status, note }, { withCredentials: true });
            toast.success(`Status updated to ${status}`);
            fetchTickets();
        } catch (err) {
            console.error("Status Update Failure:", err);
            toast.error('Failed to update status');
        }
    };

    const handleDeleteTicket = async () => {
        if (!window.confirm("CRITICAL: This will permanently delete the ticket entry from the system. Proceed?")) return;
        try {
            console.log("Deleting ticket via V2 endpoint...");
            await axios.delete(`/api/tickets/v2/${selectedTicket.id}`, { withCredentials: true });
            toast.info('Ticket entry permanently closed and removed');
            setSelectedTicket(null);
            fetchTickets();
        } catch (err) {
            console.error("Deletion Failure:", err);
            toast.error('Failed to delete ticket');
        }
    };

    const handleAssign = async (technicianId) => {
        try {
            await axios.post(`/api/tickets/${selectedTicket.id}/assign`, { technicianId }, { withCredentials: true });
            toast.success('Technician assigned');
            fetchTickets();
        } catch (err) {
            toast.error('Failed to assign technician');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Admin: Delete this comment?')) return;
        try {
            await axios.delete(`/api/tickets/${selectedTicket.id}/messages/${commentId}`, { withCredentials: true });
            toast.success('Comment deleted');
            fetchTickets();
        } catch (err) {
            toast.error('Failed to delete comment');
        }
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'OPEN': return 'bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]';
            case 'IN_PROGRESS': return 'bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]';
            case 'RESOLVED': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]';
            case 'CLOSED': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
            case 'REJECTED': return 'bg-red-500/20 text-red-400 border-red-500/30 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        }
    };

    const filters = [
        { id: 'ALL', label: 'All', icon: Filter },
        { id: 'STUDENT', label: 'Students', icon: User },
        { id: 'TEACHER', label: 'Lecturers', icon: UserCheck },
        { id: 'MAINTAIN_STAFF', label: 'Staff', icon: ShieldAlert },
    ];

    return (
        <div className="min-h-screen bg-[#0a0f1c] text-slate-200 overflow-hidden font-sans">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;900&display=swap');
                body { font-family: 'Outfit', sans-serif; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.2); border-radius: 20px; }
                .glass-card { background: rgba(19, 28, 49, 0.4); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.05); }
                .glass-button { background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); }
            `}</style>

            <div className="flex h-screen">
                {/* Left Pane: Filters & Ticket List */}
                <div className="w-[420px] glass-card border-r border-white/5 flex flex-col relative z-30 transition-all">
                    <div className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-4 mb-8">
                            <Link to="/admin/dashboard" className="p-2.5 glass-button rounded-xl text-slate-400 hover:text-white transition-all">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-black text-white tracking-widest uppercase italic">Admin <span className="text-purple-500">Tickets</span></h1>
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Management Console</p>
                            </div>
                        </div>

                        <div className="flex gap-2 p-1.5 bg-black/20 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
                            {filters.map(f => (
                                <button 
                                    key={f.id}
                                    onClick={() => { setActiveFilter(f.id); setLoading(true); }}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === f.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    <f.icon className="w-3.5 h-3.5" />
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <div key={i} className="h-32 glass-card rounded-[2.5rem] animate-pulse opacity-40"></div>
                            ))
                        ) : tickets.length === 0 ? (
                            <div className="text-center py-20 opacity-30 p-8">
                                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-loose">No active tickets matching filter</p>
                            </div>
                        ) : (
                            tickets.map(t => (
                                <button 
                                    key={t.id}
                                    onClick={() => setSelectedTicket(t)}
                                    className={`w-full text-left p-6 rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden ${selectedTicket?.id === t.id ? 'glass-card border-purple-500/50 bg-purple-600/5 ring-1 ring-purple-500/20' : 'glass-card border-transparent hover:border-white/10 opacity-70 hover:opacity-100 hover:scale-[1.02]'}`}
                                >
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${t.senderRole === 'STUDENT' ? 'bg-blue-500/20 text-blue-400' : t.senderRole === 'TEACHER' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                                    {t.senderRole}
                                                </span>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate max-w-[120px]">{t.senderName}</p>
                                            </div>
                                            <div className={`p-2 rounded-xl border transition-all ${getStatusStyle(t.status)}`}>
                                                {t.status === 'RESOLVED' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                            </div>
                                        </div>
                                        <h3 className={`font-black text-sm uppercase tracking-tight truncate mb-3 ${selectedTicket?.id === t.id ? 'text-white' : 'text-slate-300'}`}>{t.subject}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${t.priority === 'URGENT' ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>{t.priority} PRIORITY</span>
                                            <span className="text-[9px] font-black text-slate-600">{new Date(t.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    {selectedTicket?.id === t.id && (
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 blur-[40px] rounded-full -mr-12 -mt-12"></div>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Pane: Admin Control Center */}
                <div className="flex-1 flex flex-col relative transition-all bg-[#0a0f1c]">
                    {selectedTicket ? (
                        <>
                            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-purple-600/10 to-transparent pointer-events-none opacity-50 z-0"></div>

                            {/* Admin Header */}
                            <div className="p-8 glass-card border-b border-white/5 flex justify-between items-center relative z-20 mx-4 mt-4 rounded-[2.5rem]">
                                <div className="flex items-center gap-6">
                                    <div className={`p-4 rounded-[1.5rem] border ${getStatusStyle(selectedTicket.status)}`}>
                                        <ShieldAlert className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">{selectedTicket.subject}</h2>
                                            <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusStyle(selectedTicket.status)}`}>{selectedTicket.status}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-black uppercase tracking-widest mt-2 flex items-center gap-3">
                                            <span className="text-purple-500/70 italic">Incident Reporter: {selectedTicket.senderName}</span>
                                            <span className="opacity-20">•</span>
                                            <span className="px-2 py-0.5 bg-white/5 rounded italic">{selectedTicket.category}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Assign Technician</p>
                                        <select 
                                            onChange={(e) => handleAssign(e.target.value)}
                                            value={selectedTicket.assignedTo || ''}
                                            className="bg-[#131c31] border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-300 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all cursor-pointer"
                                        >
                                            <option value="">-- UNASSIGNED --</option>
                                            {technicians.map(tech => (
                                                <option key={tech.id} value={tech.id}>{tech.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Thread/Conversation */}
                            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar relative z-10">
                                {/* Incident Summary */}
                                <div className="glass-card p-10 rounded-[3rem] border border-purple-500/10 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-700">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 blur-[80px] rounded-full -mr-32 -mt-32"></div>
                                    <div className="flex gap-8 relative z-10">
                                        <div className="w-1.5 bg-gradient-to-b from-purple-500 to-transparent rounded-full opacity-50"></div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-6">
                                                <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.5em] italic">Primary Incident Log</h4>
                                                <span className="text-[10px] font-black text-slate-600 uppercase italic">ID: #{selectedTicket.id.slice(-8).toUpperCase()}</span>
                                            </div>
                                            <p className="text-lg text-slate-200 font-medium leading-relaxed mb-8">{selectedTicket.description}</p>
                                            
                                            <div className="grid grid-cols-2 gap-8">
                                                {selectedTicket.contactDetails && (
                                                    <div className="p-5 bg-black/20 rounded-2xl border border-white/5 group-hover:bg-purple-600/5 transition-all">
                                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 italic">Communication Vector</p>
                                                        <p className="text-sm font-black text-slate-300">{selectedTicket.contactDetails}</p>
                                                    </div>
                                                )}
                                                <div className="p-5 bg-black/20 rounded-2xl border border-white/5">
                                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 italic">Submission Vector</p>
                                                    <p className="text-sm font-black text-slate-300">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                                                </div>
                                            </div>

                                            {selectedTicket.attachments?.length > 0 && (
                                                <div className="mt-8 grid grid-cols-3 gap-4">
                                                    {selectedTicket.attachments.map((url, i) => (
                                                        <a key={i} href={url} target="_blank" rel="noreferrer" className="h-32 glass-card rounded-2xl overflow-hidden group/img relative">
                                                            <img src={url} alt="intel" className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" />
                                                            <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-all">
                                                                <Info className="w-6 h-6 text-white" />
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Status Controls */}
                                <div className="flex flex-wrap items-center gap-4 bg-black/40 p-6 rounded-[2.5rem] border border-white/5">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Workflow Protocols:</span>
                                    <button onClick={() => handleUpdateStatus('IN_PROGRESS')} className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedTicket.status === 'IN_PROGRESS' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'glass-button text-amber-500 hover:bg-amber-500/10'}`}>In Progress</button>
                                    <button onClick={() => handleUpdateStatus('RESOLVED')} className="px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest glass-button text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all">Resolve Ticket</button>
                                    <button onClick={() => handleUpdateStatus('REJECTED')} className="px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest glass-button text-red-500 hover:bg-red-500 hover:text-white transition-all">Reject Protocol</button>
                                    <button onClick={handleDeleteTicket} className="px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest glass-button text-red-500 hover:bg-red-500 hover:text-white transition-all">Close Entry</button>
                                </div>

                                {/* Conversation History */}
                                <div className="space-y-8 pb-32">
                                    {selectedTicket.messages?.map((msg, i) => (
                                        <div key={i} className={`flex gap-6 ${msg.senderId === currentUser.id ? 'flex-row-reverse' : ''} animate-in slide-in-from-bottom-2 duration-500`}>
                                            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center flex-shrink-0 shadow-2xl transition-all duration-500 ${msg.senderId === currentUser.id ? 'bg-purple-600 border-purple-400 rotate-6 scale-110' : 'bg-slate-800 border-white/5 -rotate-6'}`}>
                                                <span className="text-white font-black text-xs uppercase italic">{msg.senderName.slice(0, 2)}</span>
                                            </div>
                                            <div className={`flex flex-col max-w-[75%] ${msg.senderId === currentUser.id ? 'items-end' : ''}`}>
                                                <div className="flex items-center gap-3 mb-2 px-2">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${msg.senderId === currentUser.id ? 'text-purple-400' : 'text-slate-500'}`}>{msg.senderName}</span>
                                                    <span className="px-1.5 py-0.5 bg-white/5 rounded text-[7px] font-black text-slate-600 uppercase">{msg.senderRole}</span>
                                                    <span className="text-[9px] font-black text-slate-700">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                                                </div>
                                                <div className={`p-6 rounded-[2.5rem] relative group transition-all duration-500 ${msg.senderId === currentUser.id ? 'bg-purple-600 text-white rounded-tr-none shadow-xl' : 'glass-card border-white/5 rounded-tl-none'}`}>
                                                    <p className="text-sm leading-relaxed font-medium tracking-tight">{msg.content}</p>
                                                    {msg.senderRole === 'ADMIN' && (
                                                        <div className={`absolute top-0 opacity-0 group-hover:opacity-100 transition-all ${msg.senderId === currentUser.id ? 'right-full mr-4' : 'left-full ml-4'}`}>
                                                            <button onClick={() => handleDeleteComment(msg.id)} className="p-2 bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-2xl">
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Reply Console */}
                            <div className="p-8 bg-gradient-to-t from-[#0a0f1c] to-transparent relative z-20">
                                <form onSubmit={handleSendReply} className="max-w-4xl mx-auto relative group">
                                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                        <Briefcase className="w-4 h-4 text-purple-500/50" />
                                    </div>
                                    <input 
                                        type="text"
                                        placeholder="Transmit administrative intelligence..."
                                        className="w-full bg-[#131c31]/70 backdrop-blur-2xl border border-white/10 rounded-[2rem] py-5 px-14 focus:border-purple-500/50 outline-none transition-all duration-500 placeholder:text-slate-700 font-bold text-sm"
                                        value={reply}
                                        onChange={e => setReply(e.target.value)}
                                    />
                                    <button 
                                        type="submit"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-purple-500/20 transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        TRANSMIT <Send className="w-4 h-4" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center relative overflow-hidden bg-[#0a0f1c]">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05),transparent)]"></div>
                            <div className="relative mb-12 animate-in zoom-in duration-1000">
                                <div className="absolute inset-0 bg-purple-600/20 blur-[100px] rounded-full animate-pulse scale-150"></div>
                                <div className="w-32 h-32 rounded-[3.5rem] glass-card flex items-center justify-center relative z-10 transition-transform duration-700 hover:scale-110 hover:rotate-3 shadow-[0_0_80px_rgba(139,92,246,0.1)]">
                                    <ShieldAlert className="w-16 h-16 text-purple-500 drop-shadow-[0_0_25px_rgba(139,92,246,0.6)]" />
                                </div>
                            </div>
                            <h2 className="text-5xl font-black text-white tracking-tighter mb-6 uppercase italic">
                                Admin <span className="text-purple-500">Command</span> Hub
                            </h2>
                            <p className="text-slate-500 max-w-sm font-black uppercase tracking-[0.4em] text-[10px] leading-[2.5] opacity-50">
                                Oversee campus infrastructure health and coordinate critical support responses via encrypted satellite feed lines.
                            </p>
                            <div className="mt-12 flex gap-6">
                                <div className="flex items-center gap-3 px-6 py-3 glass-card rounded-2xl">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">SYSTEMS: SECURE</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Pane: Intelligence Panel */}
                <div className="w-[320px] glass-card border-l border-white/5 p-10 flex flex-col gap-10 relative z-30 transition-all">
                    <div className="animate-in slide-in-from-right duration-700">
                        <h3 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.5em] mb-12 flex items-center gap-2 italic">
                            <Info className="w-3.5 h-3.5" /> Intelligence Feed
                        </h3>
                        <div className="space-y-12">
                            <div className="group transition-all">
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2 group-hover:text-purple-400 transition-all">Active Incidents</p>
                                <div className="flex items-end justify-between">
                                    <p className="text-4xl font-black text-white italic">{tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length}</p>
                                    <div className="p-3 bg-purple-600/5 rounded-xl border border-purple-500/10 group-hover:bg-purple-600/10 transition-all scale-110">
                                        <AlertCircle className="w-5 h-5 text-purple-500" />
                                    </div>
                                </div>
                            </div>
                            <div className="group transition-all">
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2 group-hover:text-emerald-400 transition-all">Cleared Protocols</p>
                                <div className="flex items-end justify-between">
                                    <p className="text-4xl font-black text-white italic">{tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length}</p>
                                    <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 group-hover:bg-emerald-500/10 transition-all scale-110">
                                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto p-8 rounded-[2.5rem] bg-gradient-to-br from-purple-600/10 to-transparent border border-purple-500/20 relative overflow-hidden animate-in slide-in-from-bottom duration-1000">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Briefcase className="w-24 h-24 text-purple-500" />
                        </div>
                        <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4 italic ring-1 ring-purple-500/30 inline-block px-3 py-1 rounded-full">SLA Matrix v1.4</h4>
                        <p className="text-[11px] text-slate-400 font-bold leading-relaxed italic opacity-80">
                            Emergency maintenance response times synchronized across multiple campus vectors. Real-time satellite status monitoring enabled.
                        </p>
                        <div className="mt-6 flex gap-2">
                            {Array(3).fill(0).map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 150}ms` }}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

