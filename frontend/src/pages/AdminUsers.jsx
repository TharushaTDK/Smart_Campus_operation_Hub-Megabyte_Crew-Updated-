import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterRole, setFilterRole] = useState('ALL');

    // Edit modal state
    const [editModalUser, setEditModalUser] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '', email: '', password: '', role: 'STUDENT',
        subject: '', seniority: 'JUNIOR', department: '',
    });
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [editSuccess, setEditSuccess] = useState('');

    const roles = ['ALL', 'STUDENT', 'TEACHER', 'ADMIN', 'MAINTAIN_STAFF'];
    const assignableRoles = [
        { value: 'STUDENT', label: 'L1: Student' },
        { value: 'TEACHER', label: 'L2: Lecturer' },
        { value: 'MAINTAIN_STAFF', label: 'L3: Staff' },
        { value: 'ADMIN', label: 'L4: Admin' },
    ];

    useEffect(() => {
        fetchUsers(filterRole);
    }, [filterRole]);

    const fetchUsers = async (role) => {
        setLoading(true);
        setError('');
        try {
            const endpoint = role === 'ALL'
                ? '/api/admin/users'
                : `/api/admin/users/role/${role}`;
            const res = await axios.get(endpoint, { withCredentials: true });
            setUsers(res.data);
        } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`/api/admin/users/${id}`, { withCredentials: true });
            fetchUsers(filterRole);
        } catch (err) {
            setError('Failed to delete user');
            console.error(err);
        }
    };

    // ── Edit modal handlers ────────────────────────────────────────────
    const openEditModal = (user) => {
        setEditModalUser(user);
        setEditForm({
            name: user.name || '',
            email: user.email || '',
            password: '',
            role: user.role || 'STUDENT',
            subject: user.subject || '',
            seniority: user.seniority || 'JUNIOR',
            department: user.department || '',
        });
        setEditError('');
        setEditSuccess('');
    };

    const closeEditModal = () => {
        setEditModalUser(null);
        setEditError('');
        setEditSuccess('');
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleRoleSwitch = (newRole) => {
        setEditForm({ ...editForm, role: newRole, subject: '', seniority: 'JUNIOR', department: '' });
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        setEditError('');
        setEditSuccess('');

        const payload = {
            name: editForm.name,
            email: editForm.email,
            role: editForm.role,
        };
        if (editForm.password) payload.password = editForm.password;
        if (editForm.role === 'TEACHER') {
            payload.subject = editForm.subject;
            payload.seniority = editForm.seniority;
        } else if (editForm.role === 'MAINTAIN_STAFF') {
            payload.department = editForm.department;
        }

        try {
            await axios.put(`/api/admin/users/${editModalUser.id}`, payload, { withCredentials: true });
            setEditSuccess('User updated successfully!');
            fetchUsers(filterRole);
            setTimeout(() => closeEditModal(), 1200);
        } catch (err) {
            setEditError(err.response?.data?.error || 'Failed to update user');
        } finally {
            setEditLoading(false);
        }
    };

    const roleColors = {
        STUDENT: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        TEACHER: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
        ADMIN: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
        MAINTAIN_STAFF: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
    };

    return (
        <div className="flex bg-[#0a0e1b] min-h-screen font-sans text-slate-300">
            <Sidebar />
            <main className="flex-1 overflow-auto ml-64 min-h-screen relative p-12">
                {/* Glow Accents */}
                <div className="fixed top-0 right-0 w-[50vw] h-[50vh] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>

                <header className="flex justify-between items-end mb-12 relative z-10">
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
                            User <span className="text-indigo-600">Database</span>
                        </h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[5px] ml-1">Personnel Directory &amp; Authorization</p>
                    </div>
                    <button onClick={() => window.location.href = '/admin/users/add'} className="bg-indigo-600 hover:bg-white text-white hover:text-indigo-600 px-8 py-3.5 rounded-2xl font-black shadow-xl shadow-indigo-500/10 transition-all flex items-center gap-3 active:scale-95">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                        ENROLL NEW USER
                    </button>
                </header>

                <section className="relative z-10">
                    <div className="bg-[#151e30]/50 backdrop-blur-2xl rounded-[48px] border border-white/5 overflow-hidden shadow-2xl">
                        {/* Filters Hud */}
                        <div className="p-10 border-b border-white/5 bg-white/[0.01]">
                            <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none mb-1">Personnel Segment</h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[3px]">Filter based on authorization level</p>
                                </div>

                                <div className="flex p-1.5 bg-black/40 rounded-[24px] gap-1 border border-white/5">
                                    {roles.map((role) => (
                                        <button
                                            key={role}
                                            onClick={() => setFilterRole(role)}
                                            className={`px-6 py-3 rounded-[18px] text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${filterRole === role
                                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                                    : 'text-slate-500 hover:text-slate-300'
                                                }`}
                                        >
                                            {role.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Table HUD */}
                        <div className="overflow-x-auto custom-scrollbar-indigo">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-black/20 text-slate-500 text-[10px] font-black uppercase tracking-[3px]">
                                        <th className="px-10 py-6 font-black border-b border-white/5">Entity Name</th>
                                        <th className="px-10 py-6 font-black border-b border-white/5">Role Class</th>
                                        <th className="px-10 py-6 font-black border-b border-white/5">Serial ID</th>
                                        <th className="px-10 py-6 font-black border-b border-white/5">Last Sync</th>
                                        <th className="px-10 py-6 font-black border-b border-white/5 text-center">Status</th>
                                        <th className="px-10 py-6 font-black border-b border-white/5 text-right pr-12">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.03]">
                                    {loading ? (
                                        <tr><td colSpan="6" className="p-20 text-center text-slate-500 font-bold uppercase tracking-widest animate-pulse">Scanning DB Head...</td></tr>
                                    ) : error ? (
                                        <tr><td colSpan="6" className="p-20 text-center text-red-500 font-black uppercase tracking-widest">{error}</td></tr>
                                    ) : users.length === 0 ? (
                                        <tr><td colSpan="6" className="p-20 text-center text-slate-600 font-bold uppercase tracking-widest">No matching segments found</td></tr>
                                    ) : (
                                        users.map((u) => (
                                            <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-lg font-black shadow-inner">
                                                            {u.name ? u.name.charAt(0).toUpperCase() : '?'}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-white text-sm mb-0.5 tracking-tight group-hover:text-indigo-300 transition-colors uppercase">{u.name}</p>
                                                            <p className="text-[10px] text-slate-500 font-bold lowercase opacity-60 tracking-wider">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6">
                                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase ${roleColors[u.role] || 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                                                        {u.role.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-6 text-slate-600 text-[10px] font-bold font-mono uppercase opacity-40">{u.id.substring(0, 12)}</td>
                                                <td className="px-10 py-6 text-slate-400 text-[10px] font-black uppercase tracking-widest opacity-80">
                                                    {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-GB') : '--/--/--'}
                                                </td>
                                                <td className="px-10 py-6 text-center">
                                                    <div className={`mx-auto w-2 h-2 rounded-full ${u.enabled ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]'}`}></div>
                                                </td>
                                                <td className="px-10 py-6 text-right pr-12">
                                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => openEditModal(u)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-indigo-400 hover:text-white transition-all">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                        </button>
                                                        <button onClick={() => handleDelete(u.id)} className="p-2.5 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-500 transition-all">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-10 py-6 border-t border-white/[0.03] bg-black/20 text-[10px] font-black uppercase tracking-[3px] text-slate-500 flex justify-between items-center">
                            <span>Active Entity Count: {users.length}</span>
                            <span className="text-white/20">DB Sync: Stable</span>
                        </div>
                    </div>
                </section>
            </main>

            {/* ── Full Edit Modal ─────────────────────────────────────────── */}
            {editModalUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={closeEditModal}
                    />

                    {/* Modal Card */}
                    <div className="relative w-full max-w-2xl bg-[#0d1526] border border-white/5 rounded-[48px] shadow-2xl overflow-hidden">

                        {/* Header */}
                        <div className="px-10 pt-10 pb-8 border-b border-white/5 flex items-center gap-5">
                            <button
                                onClick={closeEditModal}
                                className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 flex-shrink-0"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Edit <span className="text-indigo-400">Personnel</span></h2>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[4px] mt-0.5">Modify user record — {editModalUser.email}</p>
                            </div>
                        </div>

                        {/* Scrollable Form Body */}
                        <div className="overflow-y-auto max-h-[70vh] custom-scrollbar-indigo">
                            <form onSubmit={handleUpdateUser} className="px-10 py-8 space-y-8">

                                {/* Alerts */}
                                {editError && (
                                    <div className="bg-red-500/10 text-red-400 p-5 rounded-[24px] text-xs font-black uppercase tracking-widest border border-red-500/20 flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        </div>
                                        {editError}
                                    </div>
                                )}
                                {editSuccess && (
                                    <div className="bg-emerald-500/10 text-emerald-400 p-5 rounded-[24px] text-xs font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                        </div>
                                        {editSuccess}
                                    </div>
                                )}

                                {/* Role Switcher */}
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[4px] mb-4">Authorization Level</label>
                                    <div className="flex flex-wrap gap-2 p-2 bg-black/40 rounded-[24px] border border-white/5">
                                        {assignableRoles.map((r) => (
                                            <button
                                                key={r.value}
                                                type="button"
                                                onClick={() => handleRoleSwitch(r.value)}
                                                className={`flex-1 min-w-[110px] px-4 py-3 rounded-[18px] text-[9px] font-black tracking-widest uppercase transition-all duration-300 ${editForm.role === r.value
                                                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 scale-[1.02]'
                                                        : 'text-slate-500 hover:text-slate-300'
                                                    }`}
                                            >
                                                {r.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Core Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[4px] mb-3 ml-1">Full Name</label>
                                        <input
                                            type="text" name="name" value={editForm.name} onChange={handleEditChange} required
                                            className="w-full bg-black/40 border-2 border-transparent rounded-[22px] px-6 py-5 focus:bg-white/5 focus:border-indigo-500 outline-none transition-all font-black text-white text-sm uppercase tracking-widest"
                                            placeholder="Entity name..."
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[4px] mb-3 ml-1">Email Address</label>
                                        <input
                                            type="email" name="email" value={editForm.email} onChange={handleEditChange} required
                                            className="w-full bg-black/40 border-2 border-transparent rounded-[22px] px-6 py-5 focus:bg-white/5 focus:border-indigo-500 outline-none transition-all font-black text-white text-sm lowercase"
                                            placeholder="address@hub.edu"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[4px] mb-3 ml-1">New Password</label>
                                        <input
                                            type="password" name="password" value={editForm.password} onChange={handleEditChange}
                                            className="w-full bg-black/40 border-2 border-transparent rounded-[22px] px-6 py-5 focus:bg-white/5 focus:border-indigo-500 outline-none transition-all font-black text-white text-sm"
                                            placeholder="Leave blank to keep current"
                                        />
                                    </div>
                                    <div className="flex items-end pb-1">
                                        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed">
                                            Leave password blank to keep the existing password unchanged.
                                        </p>
                                    </div>
                                </div>

                                {/* Teacher Extension */}
                                {editForm.role === 'TEACHER' && (
                                    <div className="p-8 bg-indigo-500/5 rounded-[32px] border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="col-span-full border-b border-white/5 pb-4 mb-2">
                                            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[5px]">Lecturer Profile Extension</h3>
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[3px] mb-3 ml-1">Subject Domain</label>
                                            <input
                                                type="text" name="subject" value={editForm.subject} onChange={handleEditChange}
                                                className="w-full bg-[#0a0e1b] border border-white/5 rounded-2xl px-5 py-4 focus:border-indigo-500 outline-none transition-all font-black text-white text-xs uppercase"
                                                placeholder="e.g. Physics"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[3px] mb-3 ml-1">Seniority Index</label>
                                            <select
                                                name="seniority" value={editForm.seniority} onChange={handleEditChange}
                                                className="w-full bg-[#0a0e1b] border border-white/5 rounded-2xl px-5 py-4 focus:border-indigo-500 outline-none transition-all font-black text-white text-[10px] uppercase tracking-widest cursor-pointer appearance-none"
                                            >
                                                <option value="JUNIOR">Junior Lecturer</option>
                                                <option value="SENIOR">Senior Lecturer</option>
                                                <option value="PROFESSOR">Professor</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* Maintain Staff Extension */}
                                {editForm.role === 'MAINTAIN_STAFF' && (
                                    <div className="p-8 bg-emerald-500/5 rounded-[32px] border border-white/5">
                                        <div className="border-b border-white/5 pb-4 mb-6">
                                            <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[5px]">Staff Departmental Routing</h3>
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[3px] mb-3 ml-1">Trade / Sector</label>
                                            <select
                                                name="department" value={editForm.department} onChange={handleEditChange}
                                                className="w-full bg-[#0a0e1b] border border-white/5 rounded-2xl px-5 py-4 focus:border-indigo-500 outline-none transition-all font-black text-white text-[10px] uppercase tracking-widest cursor-pointer appearance-none"
                                            >
                                                <option value="">Select Sector...</option>
                                                <option value="ELECTRICAL">Elec &amp; Wiring</option>
                                                <option value="PLUMBING">Hydraulics &amp; Water</option>
                                                <option value="CLEANING">Sanitary &amp; Janitorial</option>
                                                <option value="LANDSCAPING">Eco &amp; Grounds</option>
                                                <option value="GENERAL">General Maintenance</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="pt-6 border-t border-white/5 flex gap-4 pb-2">
                                    <button
                                        type="button" onClick={closeEditModal}
                                        className="flex-1 py-5 text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors tracking-[4px]"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit" disabled={editLoading}
                                        className="flex-[2] py-5 bg-indigo-600 text-white rounded-[28px] font-black uppercase tracking-[4px] shadow-2xl shadow-indigo-600/20 hover:bg-white hover:text-indigo-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {editLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
          .custom-scrollbar-indigo::-webkit-scrollbar { width: 6px; height: 6px; }
          .custom-scrollbar-indigo::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar-indigo::-webkit-scrollbar-thumb { background: #312e81; border-radius: 10px; }
          .custom-scrollbar-indigo::-webkit-scrollbar-thumb:hover { background: #4338ca; }
          ::-webkit-scrollbar { width: 5px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}} />
        </div>
    );
}
