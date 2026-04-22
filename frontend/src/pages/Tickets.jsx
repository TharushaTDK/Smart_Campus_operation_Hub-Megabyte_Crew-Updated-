import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../App';
import { toast } from 'react-toastify';
import { 
    MessageSquare, Send, CheckCircle, Clock, ChevronRight, Plus, 
    ArrowLeft, Edit2, Trash2, ShieldAlert, AlertCircle, Image as ImageIcon,
    User, Calendar, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Tickets() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newTicket, setNewTicket] = useState({ 
        subject: '', 
        description: '', 
        category: 'IT', 
        priority: 'MEDIUM', 
        contactDetails: '',
        phoneNumber: '' 
    });
    const [attachments, setAttachments] = useState([]);
    const [reply, setReply] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [editingTicket, setEditingTicket] = useState(null);

    useEffect(() => {
        console.log("User Tickets Loaded V2 - Sync Check");
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const endpoint = user.role === 'MAINTAIN_STAFF' ? '/api/tickets/assigned' : '/api/tickets/my';
            const res = await axios.get(endpoint, { withCredentials: true });
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

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 3) {
            toast.warning('Maximum 3 images allowed');
            setAttachments(files.slice(0, 3));
        } else {
            setAttachments(files);
        }
    };

    const handleSubmitTicket = async (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});
        const formData = new FormData();
        formData.append('subject', newTicket.subject);
        formData.append('description', newTicket.description);
        formData.append('category', newTicket.category);
        formData.append('priority', newTicket.priority);
        formData.append('contactDetails', newTicket.contactDetails);
        formData.append('phoneNumber', newTicket.phoneNumber);
        attachments.forEach(file => formData.append('attachments', file));

        try {
            if (editingTicket) {
                await axios.put(`/api/tickets/${editingTicket.id}`, formData, { withCredentials: true });
                toast.success('Ticket updated successfully');
            } else {
                await axios.post('/api/tickets', formData, { withCredentials: true });
                toast.success('Ticket submitted successfully');
            }
            setShowForm(false);
            setEditingTicket(null);
            setNewTicket({ subject: '', description: '', category: 'IT', priority: 'MEDIUM', contactDetails: '', phoneNumber: '' });
            setAttachments([]);
            fetchTickets();
        } catch (err) {
            toast.error(err.response?.data || (editingTicket ? 'Failed to update ticket' : 'Failed to submit ticket'));
        }
    };

    const handleOpenEdit = (ticket) => {
        setEditingTicket(ticket);
        setNewTicket({
            subject: ticket.subject || '',
            description: ticket.description || '',
            category: ticket.category || 'IT',
            priority: ticket.priority || 'MEDIUM',
            contactDetails: ticket.contactDetails || '',
            phoneNumber: ticket.phoneNumber || '',
        });
        setAttachments([]);
        setFormErrors({});
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingTicket(null);
        setNewTicket({ subject: '', description: '', category: 'IT', priority: 'MEDIUM', contactDetails: '', phoneNumber: '' });
        setAttachments([]);
        setFormErrors({});
    };

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!reply.trim()) return;
        try {
            console.log("User: Sending reply to V2 endpoint...");
            await axios.post(`/api/tickets/v2/${selectedTicket.id}/messages`, { content: reply }, { withCredentials: true });
            setReply('');
            fetchTickets();
        } catch (err) {
            console.error("User Reply Failure:", err);
            toast.error('Failed to send message');
        }
    };

    const handleEditComment = async (commentId) => {
        const newContent = window.prompt('Edit your comment:', '');
        if (!newContent || !newContent.trim()) return;
        try {
            await axios.put(`/api/tickets/v2/${selectedTicket.id}/messages/${commentId}`, { content: newContent }, { withCredentials: true });
            toast.success('Comment updated');
            fetchTickets();
        } catch (err) {
            toast.error('Failed to update comment');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            await axios.delete(`/api/tickets/v2/${selectedTicket.id}/messages/${commentId}`, { withCredentials: true });
            toast.success('Comment deleted');
            fetchTickets();
        } catch (err) {
            toast.error('Failed to delete comment');
        }
    };

    const validate = () => {
        const errors = {};
        const phone = newTicket.phoneNumber.replace(/\s/g, '');
        const contact = newTicket.contactDetails.trim();

        if (!newTicket.subject.trim()) {
            errors.subject = 'Subject is required';
        } else if (newTicket.subject.trim().length < 5) {
            errors.subject = 'Subject must be at least 5 characters';
        } else if (newTicket.subject.trim().length > 100) {
            errors.subject = 'Subject cannot exceed 100 characters';
        }

        if (!newTicket.description.trim()) {
            errors.description = 'Description is required';
        } else if (newTicket.description.trim().length < 20) {
            errors.description = 'Description must be at least 20 characters';
        } else if (newTicket.description.trim().length > 500) {
            errors.description = 'Description cannot exceed 500 characters';
        }

        if (!phone) {
            errors.phoneNumber = 'Phone number is required';
        } else if (!/^(\+94|0)[0-9]{9}$/.test(phone)) {
            errors.phoneNumber = 'Enter a valid number (e.g. 0771234567 or +94771234567)';
        }

        if (contact && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
            errors.contactDetails = 'Enter a valid email address';
        }

        const oversized = attachments.filter(f => f.size > 5 * 1024 * 1024);
        if (oversized.length > 0) {
            errors.attachments = `${oversized.length} file(s) exceed the 5 MB limit`;
        }

        return errors;
    };

    const categories = ['IT', 'ELECTRICAL', 'PLUMBING', 'FURNITURE', 'OTHER'];
    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

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

    return (
        <div className="min-h-screen bg-[#0a0f1c] text-slate-200 overflow-hidden font-sans">
            {/* Global Smooth Transitions Style */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;900&display=swap');
                
                body { font-family: 'Outfit', sans-serif; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.4); }
                .glass-card { background: rgba(19, 28, 49, 0.4); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.05); }
                .glass-button { background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); }
                .glass-button:hover { background: rgba(59, 130, 246, 0.2); }
            `}</style>

            <div className="flex h-screen pt-20">
                {/* Left Pane: Ticket List Sidebar */}
                <div className="w-[420px] glass-card border-r border-white/5 flex flex-col transition-all duration-300 relative z-30">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link to="/" className="p-2 glass-button rounded-xl text-slate-400 hover:text-white transition-all">
                                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-2">
                                    {user.role === 'MAINTAIN_STAFF' ? 'Assigned' : 'My'} <span className="text-blue-500">Tickets</span>
                                </h1>
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] mt-0.5">Campus Support System</p>
                            </div>
                        </div>
                        {user.role !== 'MAINTAIN_STAFF' && (
                            <button
                                onClick={() => { setEditingTicket(null); setNewTicket({ subject: '', description: '', category: 'IT', priority: 'MEDIUM', contactDetails: '', phoneNumber: '' }); setAttachments([]); setFormErrors({}); setShowForm(!showForm); }}
                                className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 group"
                            >
                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <div key={i} className="h-28 glass-card rounded-3xl animate-pulse opacity-40"></div>
                            ))
                        ) : tickets.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full opacity-30 text-center p-8">
                                <AlertCircle className="w-12 h-12 mb-4 text-blue-500" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] max-w-[150px] leading-loose">No active tickets found in directory</p>
                            </div>
                        ) : (
                            tickets.map(t => (
                                <button 
                                    key={t.id}
                                    onClick={() => setSelectedTicket(t)}
                                    className={`w-full text-left p-5 rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden ${selectedTicket?.id === t.id ? 'glass-card border-blue-500/50 bg-blue-600/5 ring-1 ring-blue-500/20' : 'glass-card border-transparent hover:border-white/10 opacity-70 hover:opacity-100 hover:scale-[1.02]'}`}
                                >
                                    <div className="flex justify-between items-start gap-3 relative z-10">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${t.priority === 'URGENT' ? 'bg-red-500 text-white animate-pulse' : t.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                    {t.priority}
                                                </span>
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t.category}</p>
                                            </div>
                                            <h3 className={`font-black text-sm uppercase tracking-tight truncate mb-2 ${selectedTicket?.id === t.id ? 'text-white' : 'text-slate-300'}`}>
                                                {t.subject}
                                            </h3>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 text-slate-500">
                                                    <Calendar className="w-3.5 h-3.5 opacity-50" />
                                                    <span className="text-[10px] font-black uppercase tracking-tighter">{new Date(t.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-500">
                                                    <MessageSquare className="w-3.5 h-3.5 opacity-50" />
                                                    <span className="text-[10px] font-black uppercase tracking-tighter">{t.messages?.length || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`p-2.5 rounded-2xl border transition-all ${getStatusStyle(t.status)} ${selectedTicket?.id === t.id ? 'scale-110' : ''}`}>
                                            {t.status === 'RESOLVED' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                        </div>
                                    </div>
                                    {selectedTicket?.id === t.id && (
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 blur-[40px] rounded-full -mr-12 -mt-12"></div>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Pane: Thread / Conversation */}
                <div className="flex-1 flex flex-col relative transition-all bg-[#0a0f1c]">
                    {selectedTicket ? (
                        <>
                            {/* Header Gradient Backdrop */}
                            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none opacity-50 z-0"></div>

                            {/* Thread Header */}
                            <div className="p-8 glass-card border-b border-white/5 flex justify-between items-center relative z-20 mx-4 mt-4 rounded-[2rem]">
                                <div className="flex items-center gap-5">
                                    <div className={`p-4 rounded-[1.5rem] border ${getStatusStyle(selectedTicket.status)}`}>
                                        {selectedTicket.status === 'RESOLVED' ? <CheckCircle className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">{selectedTicket.subject}</h2>
                                            <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusStyle(selectedTicket.status)}`}>
                                                {selectedTicket.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-black uppercase tracking-widest mt-1.5 flex items-center gap-2">
                                            <span className="text-blue-500/50">ID_#{selectedTicket.id.slice(-6).toUpperCase()}</span>
                                            <span className="opacity-20">•</span>
                                            <span>Reporting Platform: Core-Hub</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <div className="px-5 py-2.5 glass-card rounded-[1rem] text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                                        LEVEL: {selectedTicket.priority}
                                    </div>
                                    <div className="px-5 py-2.5 glass-card rounded-[1rem] text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                        TYPE: {selectedTicket.category}
                                    </div>
                                    {selectedTicket.senderId === user.id && selectedTicket.status === 'OPEN' && (
                                        <button
                                            onClick={() => handleOpenEdit(selectedTicket)}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 hover:border-amber-500 text-amber-400 hover:text-white rounded-[1rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 group/edit"
                                        >
                                            <Edit2 className="w-3.5 h-3.5 group-hover/edit:rotate-12 transition-transform" />
                                            Edit
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Thread Content */}
                            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar relative z-10">
                                {/* Initial Incident Report */}
                                <div className="flex gap-6 group">
                                    <div className="w-12 h-12 rounded-[1.2rem] bg-blue-600/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 animate-in zoom-in duration-500 shadow-lg shadow-blue-500/5">
                                        <Info className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 bg-blue-500/5 px-2 py-0.5 rounded italic">Primary Intelligence Report</span>
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                                        </div>
                                        <div className="glass-card p-8 rounded-[2.5rem] rounded-tl-none border border-white/5 hover:border-white/10 transition-all duration-500 shadow-2xl">
                                            <p className="text-slate-200 leading-[1.8] text-sm font-medium">{selectedTicket.description}</p>
                                            
                                            {selectedTicket.contactDetails && (
                                                <div className="mt-8 p-4 bg-blue-600/[0.03] rounded-2xl border border-blue-500/10 flex items-center gap-4 group/contact hover:bg-blue-600/[0.05] transition-all">
                                                    <div className="p-2 bg-blue-600/10 rounded-xl">
                                                        <User className="w-4 h-4 text-blue-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase text-blue-400/70 tracking-[0.2em] mb-0.5">Contact Vector</p>
                                                        <p className="text-xs font-black text-slate-200">{selectedTicket.contactDetails}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedTicket.attachments?.length > 0 && (
                                                <div className="mt-8 grid grid-cols-3 gap-4">
                                                    {selectedTicket.attachments.map((url, i) => (
                                                        <a key={i} href={url} target="_blank" rel="noreferrer" className="relative h-32 rounded-[1.5rem] overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all group/img">
                                                            <img src={url} alt="intel preview" className="w-full h-full object-cover scale-[1.01] group-hover/img:scale-110 transition-all duration-700 ease-out" />
                                                            <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-all duration-300">
                                                                <ImageIcon className="w-8 h-8 text-white drop-shadow-2xl" />
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Replies / Intercom */}
                                {selectedTicket.messages?.map((msg, i) => (
                                    <div key={i} className={`flex gap-6 animate-in slide-in-from-bottom-2 duration-500 ${msg.senderId === user.id ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-12 h-12 rounded-[1.2rem] border-2 flex items-center justify-center flex-shrink-0 transition-all duration-500 ${msg.senderId === user.id ? 'bg-blue-600 border-blue-400 shadow-xl shadow-blue-500/20 rotate-3' : 'bg-slate-800 border-white/5 -rotate-3'}`}>
                                            <span className="text-white font-black text-xs uppercase italic">{msg.senderName.slice(0, 2)}</span>
                                        </div>
                                        <div className={`flex flex-col group max-w-[75%] ${msg.senderId === user.id ? 'items-end' : ''}`}>
                                            <div className="flex items-center gap-3 mb-2.5 px-2">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-300 transition-all">{msg.senderName}</span>
                                                <span className="text-[9px] font-black text-slate-700 uppercase tracking-tighter">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                                                {msg.edited && <span className="text-[8px] font-black bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded-lg uppercase tracking-widest italic">Rev_1.0</span>}
                                            </div>
                                            <div className={`p-6 rounded-[2.5rem] relative group/msg transition-all duration-500 ${msg.senderId === user.id ? 'bg-blue-600 text-white rounded-tr-none shadow-[0_20px_40px_-15px_rgba(37,99,235,0.2)]' : 'glass-card border-white/5 rounded-tl-none hover:bg-white/[0.03]'}`}>
                                                <p className="text-sm leading-[1.7] font-medium tracking-tight">{msg.content}</p>
                                                
                                                {/* Float Actions */}
                                                {((msg.senderId === user.id && !msg.deleted) || user.role === 'ADMIN') && (
                                                    <div className={`absolute top-0 flex gap-1 bg-[#131c31] border border-white/10 p-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl ${msg.senderId === user.id ? 'right-full mr-3' : 'left-full ml-3'}`}>
                                                        {msg.senderId === user.id && (
                                                            <button onClick={() => handleEditComment(msg.id)} className="p-1.5 text-slate-500 hover:text-blue-400 transition-all">
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                        <button onClick={() => handleDeleteComment(msg.id)} className="p-1.5 text-slate-500 hover:text-red-500 transition-all">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Support Closure Visual */}
                                {(selectedTicket.resolutionNotes || selectedTicket.rejectionReason) && (
                                    <div className="p-10 rounded-[3rem] border-2 border-dashed border-white/5 glass-card flex gap-6 items-start animate-in zoom-in duration-700">
                                        <div className={`p-5 rounded-[2rem] shadow-2xl ${selectedTicket.resolutionNotes ? 'bg-emerald-500/10 text-emerald-400 ring-2 ring-emerald-500/20' : 'bg-red-500/10 text-red-400 ring-2 ring-red-500/20'}`}>
                                            <ShieldAlert className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className={`text-[10px] font-black uppercase tracking-[0.5em] mb-2 ${selectedTicket.resolutionNotes ? 'text-emerald-500' : 'text-red-500'}`}>
                                                Final Support Resolution
                                            </h4>
                                            <p className="text-base text-slate-200 font-bold italic leading-relaxed">"{selectedTicket.resolutionNotes || selectedTicket.rejectionReason}"</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Reply Input Hub */}
                            <div className="p-8 bg-gradient-to-t from-[#0a0f1c] to-transparent relative z-20">
                                <form onSubmit={handleSendReply} className="max-w-4xl mx-auto relative group flex items-center gap-4">
                                    <div className="flex-1 relative">
                                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                            <MessageSquare className="w-4 h-4 text-blue-500/50" />
                                        </div>
                                        <input 
                                            type="text"
                                            placeholder="Transmit intelligence..."
                                            className="w-full bg-[#131c31]/60 backdrop-blur-xl border border-white/10 rounded-[2rem] py-5 pl-14 pr-16 focus:border-blue-500/50 outline-none transition-all duration-500 placeholder:text-slate-700 font-bold text-sm tracking-tight focus:ring-4 focus:ring-blue-500/5"
                                            value={reply}
                                            onChange={e => setReply(e.target.value)}
                                        />
                                        <button 
                                            type="submit"
                                            disabled={!reply.trim()}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-[1.2rem] font-black uppercase tracking-widest text-[10px] transition-all duration-300 shadow-xl shadow-blue-500/20 active:scale-95 flex items-center gap-2"
                                        >
                                            Transmit <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center relative overflow-hidden bg-[#0a0f1c]">
                            <div className="absolute inset-0 bg-gradient-radial from-blue-600/5 to-transparent opacity-50"></div>
                            <div className="relative mb-12 animate-in zoom-in duration-1000">
                                <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full animate-pulse scale-150"></div>
                                <div className="w-32 h-32 rounded-[3.5rem] glass-card flex items-center justify-center relative z-10 transition-transform duration-700 hover:scale-110 hover:rotate-3 shadow-[0_0_80px_rgba(59,130,246,0.1)]">
                                    <MessageSquare className="w-16 h-16 text-blue-500 drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]" />
                                </div>
                            </div>
                            <h2 className="text-5xl font-black text-white tracking-tighter mb-6 uppercase italic group">
                                Service <span className="text-blue-500 group-hover:px-2 transition-all">Command</span> Hub
                            </h2>
                            <p className="text-slate-500 max-w-sm font-black uppercase tracking-[0.4em] text-[10px] leading-[2.5] opacity-50">
                                Connect to primary intelligence vectors by selecting an active session or initializing a new system status report.
                            </p>
                            <div className="mt-12 flex gap-6 animate-in slide-in-from-bottom-4 duration-1000 delay-300">
                                <div className="flex items-center gap-3 px-6 py-3 glass-card rounded-2xl">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Status: nominal</span>
                                </div>
                                <div className="flex items-center gap-3 px-6 py-3 glass-card rounded-2xl">
                                    <ShieldAlert className="w-4 h-4 text-blue-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Protocol: active-SLA</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Incident Report Modal */}
                    {showForm && (
                        <div className="absolute inset-0 z-[100] bg-[#0a0f1c]/80 backdrop-blur-[30px] flex items-center justify-center p-4 sm:p-8 transition-all animate-in fade-in duration-500 overflow-y-auto">
                            <div className="w-full max-w-2xl glass-card rounded-[3rem] sm:rounded-[4rem] p-6 sm:p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] relative border-blue-500/10 overflow-hidden group my-auto max-h-[90vh] flex flex-col">
                                <div className="overflow-y-auto custom-scrollbar pr-2">
                                    <div className="relative">
                                        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-blue-600/10 transition-colors duration-1000"></div>
                                        
                                        <button onClick={handleCloseForm} className="absolute top-0 right-0 p-3 glass-button rounded-2xl text-slate-500 hover:text-white transition-all hover:rotate-90 z-50">
                                            <Plus className="w-6 h-6 rotate-45" />
                                        </button>

                                        <div className="mb-10 text-center">
                                            <div className="inline-block px-4 py-1.5 glass-button rounded-full text-[9px] font-black text-blue-500 uppercase tracking-[0.5em] mb-4 italic ring-1 ring-blue-500/30">
                                                {editingTicket ? 'MODIFY_REPORT_SEQUENCE' : 'INITIALIZE_REPORT_SEQUENCE'}
                                            </div>
                                            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">
                                                {editingTicket ? <>Update <span className="text-amber-400">Incident</span></> : <>Report <span className="text-blue-500">Incident</span></>}
                                            </h2>
                                            {editingTicket && (
                                                <p className="text-[10px] font-black text-amber-400/60 uppercase tracking-widest mt-2">
                                                    ID_#{editingTicket.id.slice(-6).toUpperCase()} · Only OPEN tickets can be edited
                                                </p>
                                            )}
                                        </div>
                                        
                                        <form onSubmit={handleSubmitTicket} className="space-y-8">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Category</label>
                                                    <select 
                                                        className="w-full bg-[#131c31]/50 border border-white/10 rounded-2xl p-5 outline-none focus:border-blue-500/50 text-xs font-bold uppercase tracking-widest transition-all appearance-none cursor-pointer hover:bg-[#131c31]"
                                                        value={newTicket.category}
                                                        onChange={e => setNewTicket({...newTicket, category: e.target.value})}
                                                    >
                                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Urgency Matrix</label>
                                                    <select 
                                                        className="w-full bg-[#131c31]/50 border border-white/10 rounded-2xl p-5 outline-none focus:border-blue-500/50 text-xs font-bold uppercase tracking-widest transition-all appearance-none cursor-pointer hover:bg-[#131c31]"
                                                        value={newTicket.priority}
                                                        onChange={e => setNewTicket({...newTicket, priority: e.target.value})}
                                                    >
                                                        {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Intelligence</label>
                                                    <input
                                                        placeholder="+94 7X XXX XXXX"
                                                        className={`w-full bg-[#131c31]/50 border rounded-2xl p-5 outline-none focus:border-blue-500/50 text-sm font-bold transition-all ${formErrors.phoneNumber ? 'border-red-500/60' : 'border-white/10'}`}
                                                        value={newTicket.phoneNumber}
                                                        onChange={e => { setNewTicket({...newTicket, phoneNumber: e.target.value}); setFormErrors(prev => ({...prev, phoneNumber: undefined})); }}
                                                    />
                                                    {formErrors.phoneNumber && (
                                                        <p className="text-red-400 text-[10px] font-bold ml-1 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3 shrink-0" />{formErrors.phoneNumber}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Alternate Contact</label>
                                                    <input
                                                        placeholder="Email or alternate ID..."
                                                        className={`w-full bg-[#131c31]/50 border rounded-2xl p-5 outline-none focus:border-blue-500/50 text-sm font-bold transition-all ${formErrors.contactDetails ? 'border-red-500/60' : 'border-white/10'}`}
                                                        value={newTicket.contactDetails}
                                                        onChange={e => { setNewTicket({...newTicket, contactDetails: e.target.value}); setFormErrors(prev => ({...prev, contactDetails: undefined})); }}
                                                    />
                                                    {formErrors.contactDetails && (
                                                        <p className="text-red-400 text-[10px] font-bold ml-1 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3 shrink-0" />{formErrors.contactDetails}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center ml-1">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subject Intelligence</label>
                                                    <span className={`text-[10px] font-bold ${newTicket.subject.length > 100 ? 'text-red-400' : newTicket.subject.length >= 80 ? 'text-yellow-400' : 'text-slate-600'}`}>
                                                        {newTicket.subject.length}/100
                                                    </span>
                                                </div>
                                                <input
                                                    placeholder="System fault overview..."
                                                    maxLength={110}
                                                    className={`w-full bg-[#131c31]/50 border rounded-2xl p-5 outline-none focus:border-blue-500/50 text-sm font-bold transition-all ${formErrors.subject ? 'border-red-500/60' : 'border-white/10'}`}
                                                    value={newTicket.subject}
                                                    onChange={e => { setNewTicket({...newTicket, subject: e.target.value}); setFormErrors(prev => ({...prev, subject: undefined})); }}
                                                />
                                                {formErrors.subject && (
                                                    <p className="text-red-400 text-[10px] font-bold ml-1 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3 shrink-0" />{formErrors.subject}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center ml-1">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Log Analytics / Description</label>
                                                    <span className={`text-[10px] font-bold ${newTicket.description.length > 500 ? 'text-red-400' : newTicket.description.length >= 450 ? 'text-yellow-400' : newTicket.description.length >= 20 ? 'text-emerald-500' : 'text-slate-600'}`}>
                                                        {newTicket.description.length}/500
                                                    </span>
                                                </div>
                                                <textarea
                                                    placeholder="Detailed incident logs..."
                                                    maxLength={510}
                                                    className={`w-full bg-[#131c31]/50 border rounded-2xl p-5 outline-none focus:border-blue-500/50 text-sm h-32 transition-all leading-relaxed ${formErrors.description ? 'border-red-500/60' : 'border-white/10'}`}
                                                    value={newTicket.description}
                                                    onChange={e => { setNewTicket({...newTicket, description: e.target.value}); setFormErrors(prev => ({...prev, description: undefined})); }}
                                                />
                                                {formErrors.description && (
                                                    <p className="text-red-400 text-[10px] font-bold ml-1 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3 shrink-0" />{formErrors.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-6 items-end">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Multimedia Evidence</label>
                                                    <div className={`flex items-center gap-4 p-5 bg-[#131c31]/50 border-2 border-dashed rounded-2xl hover:border-blue-500 transition-all cursor-pointer relative group/upload shadow-inner ${formErrors.attachments ? 'border-red-500/60' : 'border-white/10'}`}>
                                                        <ImageIcon className="w-7 h-7 text-slate-600 group-hover/upload:text-blue-500 transition-all group-hover/upload:scale-110" />
                                                        <div className="flex-1">
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{attachments.length > 0 ? `${attachments.length} ASSETS_LOADED` : editingTicket ? 'REPLACE_INTEL' : 'UPLOAD_INTEL'}</p>
                                                            <p className="text-[8px] font-bold text-slate-600 uppercase mt-1 tracking-tighter">{editingTicket ? `CURRENT: ${editingTicket.attachments?.length || 0} · NEW UPLOAD REPLACES ALL` : 'MAX_3 · 5MB EACH'}</p>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            multiple
                                                            accept="image/*"
                                                            onChange={e => { handleFileChange(e); setFormErrors(prev => ({...prev, attachments: undefined})); }}
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                        />
                                                    </div>
                                                    {formErrors.attachments && (
                                                        <p className="text-red-400 text-[10px] font-bold ml-1 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3 shrink-0" />{formErrors.attachments}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    type="submit"
                                                    className={`w-full py-5 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl transition-all active:scale-95 italic flex items-center justify-center gap-3 group/btn shadow-2xl ${editingTicket ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/30' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/30'}`}
                                                >
                                                    {editingTicket ? <><Edit2 className="w-4 h-4" /> Update Protocol</> : <>Submit Protocol <Send className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></>}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Area: Detail Intelligence Panel */}
                <div className="w-[320px] glass-card border-l border-white/5 p-10 flex flex-col gap-10 relative z-30">
                    <div className="animate-in slide-in-from-right duration-700">
                        <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-10 flex items-center gap-2 italic">
                            <ShieldAlert className="w-3 h-3" /> System Intelligence
                        </h3>
                        <div className="space-y-10">
                            <div className="flex justify-between items-center group cursor-help">
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] group-hover:text-blue-400 transition-all">Total Feed Active</p>
                                    <p className="text-3xl font-black text-white italic">{tickets.length}</p>
                                </div>
                                <div className="p-4 bg-blue-600/5 rounded-2xl border border-blue-500/10 group-hover:bg-blue-600/10 transition-all transform group-hover:scale-110 group-hover:-rotate-6 shadow-xl shadow-blue-500/5">
                                    <AlertCircle className="w-6 h-6 text-blue-500" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center group cursor-help">
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] group-hover:text-emerald-400 transition-all">Protocol Cleared</p>
                                    <p className="text-3xl font-black text-white italic">{tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length}</p>
                                </div>
                                <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 group-hover:bg-emerald-500/10 transition-all transform group-hover:scale-110 group-hover:rotate-6 shadow-xl shadow-emerald-500/5">
                                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto animate-in slide-in-from-bottom duration-1000">
                        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 relative overflow-hidden group hover:ring-2 hover:ring-blue-500/30 transition-all duration-500 shadow-2xl">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all group-hover:scale-150 transform">
                                <ShieldAlert className="w-24 h-24 text-blue-500" />
                            </div>
                            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 italic ring-1 ring-blue-500/30 inline-block px-3 py-1 rounded-full">Support Matrix v2.0</h4>
                            <p className="text-xs text-slate-400 font-bold leading-loose italic opacity-80">
                                Campus infrastructure health monitoring enabled. Intelligence feeds prioritized by incident severity vectors.
                            </p>
                            <div className="mt-6 flex gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse delay-75 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse delay-150 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

