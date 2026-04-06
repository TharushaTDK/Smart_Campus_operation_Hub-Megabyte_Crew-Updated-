import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  // For inline editing
  const [editingUser, setEditingUser] = useState(null);
  const [editRole, setEditRole] = useState('');

  const roles = ['ALL', 'STUDENT', 'TEACHER', 'ADMIN', 'MAINTAIN_STAFF'];
  const assignableRoles = ['STUDENT', 'TEACHER', 'ADMIN', 'MAINTAIN_STAFF'];

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

  const handleUpdateRole = async (id) => {
    try {
      await axios.put(`/api/admin/users/${id}/role`, { role: editRole }, { withCredentials: true });
      setEditingUser(null);
      fetchUsers(filterRole);
    } catch (err) {
      setError('Failed to update role');
      console.error(err);
    }
  };

  const startEditing = (user) => {
    setEditingUser(user.id);
    setEditRole(user.role);
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
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[5px] ml-1">Personnel Directory & Authorization</p>
          </div>
          <button onClick={() => window.location.href='/admin/users/add'} className="bg-indigo-600 hover:bg-white text-white hover:text-indigo-600 px-8 py-3.5 rounded-2xl font-black shadow-xl shadow-indigo-500/10 transition-all flex items-center gap-3 active:scale-95">
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
                                    className={`px-6 py-3 rounded-[18px] text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${
                                        filterRole === role
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
                                            {editingUser === u.id ? (
                                                <select
                                                    value={editRole}
                                                    onChange={(e) => setEditRole(e.target.value)}
                                                    className="bg-[#0d1526] border border-white/10 text-[10px] font-bold uppercase tracking-widest rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                                                >
                                                    {assignableRoles.map(r => <option key={r} value={r}>{r}</option>)}
                                                </select>
                                            ) : (
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase ${roleColors[u.role] || 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                                                    {u.role.replace('_', ' ')}
                                                </span>
                                            )}
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
                                                {editingUser === u.id ? (
                                                    <>
                                                        <button onClick={() => handleUpdateRole(u.id)} className="bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">Commit</button>
                                                        <button onClick={() => setEditingUser(null)} className="bg-white/5 hover:bg-white/10 text-slate-300 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">Abort</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => startEditing(u)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-indigo-400 hover:text-white transition-all">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                        </button>
                                                        <button onClick={() => handleDelete(u.id)} className="p-2.5 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-500 transition-all">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                        </button>
                                                    </>
                                                )}
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

      <style dangerouslySetInnerHTML={{ __html: `
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
