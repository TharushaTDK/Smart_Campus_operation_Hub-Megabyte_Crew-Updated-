import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const StatCard = ({ title, value, icon, color }) => (
  <div className="relative group overflow-hidden bg-[#151e30]/80 backdrop-blur-2xl p-8 rounded-[40px] border border-white/5 hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-2">
    <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 bg-gradient-to-br ${color} rounded-full blur-3xl -mr-16 -mt-16 group-hover:opacity-30 transition-opacity`}></div>
    <div className="flex flex-col gap-6 relative z-10">
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center p-4 text-white shadow-2xl shadow-indigo-500/10`}>
        {icon}
      </div>
      <div>
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[3px] mb-1">{title}</h3>
        <p className="text-4xl font-black text-white tracking-tight leading-none">{value.toLocaleString()}</p>
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, admins: 0, students: 0, teachers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/users/stats', { withCredentials: true })
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch stats', err);
        setLoading(false);
      });
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats.total, color: 'from-blue-600 to-indigo-600', icon: <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.274-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.274.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
    { title: 'Admins', value: stats.admins, color: 'from-fuchsia-600 to-purple-600', icon: <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
    { title: 'Teachers', value: stats.teachers, color: 'from-cyan-600 to-blue-600', icon: <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg> },
    { title: 'Students', value: stats.students, color: 'from-emerald-600 to-teal-600', icon: <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.274-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.274.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
  ];

  return (
    <div className="flex bg-[#0a0e1b] min-h-screen font-sans text-slate-300">
      <Sidebar />
      <main className="flex-1 overflow-auto ml-64 min-h-screen relative">
        {/* Glow Accents */}
        <div className="fixed top-0 right-0 w-[50vw] h-[50vh] bg-indigo-600/5 blur-[120px] rounded-full -mr-[10vw] -mt-[10vh] pointer-events-none"></div>
        <div className="fixed bottom-0 left-64 w-[30vw] h-[30vh] bg-blue-600/5 blur-[120px] rounded-full -ml-[10vw] -mb-[10vh] pointer-events-none"></div>

        <header className="px-12 pt-12 pb-8 flex justify-between items-end relative z-10">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
              Operational <span className="text-indigo-600">Console</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[5px] ml-1">Smart Campus Real-time Telemetry</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">System Healthy</span>
            </div>
          </div>
        </header>

        <section className="px-12 py-8 relative z-10">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-white/5 rounded-[40px]"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {statCards.map(card => <StatCard key={card.title} {...card} />)}
            </div>
          )}

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity HUD */}
            <div className="lg:col-span-2 bg-[#151e30]/50 backdrop-blur-2xl p-10 rounded-[48px] border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-black text-white uppercase tracking-widest">Recent Node Activity</h2>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/10"></div>
                  <div className="w-2 h-2 rounded-full bg-white/10"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { user: 'Admin 1', action: 'Modified System Config', time: '2m ago', type: 'System' },
                  { user: 'Staff A', action: 'Maintenance Record Added', time: '15m ago', type: 'Asset' },
                  { user: 'System', action: 'Daily Telemetry Sync Complete', time: '1h ago', type: 'Network' }
                ].map((act, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-3xl bg-white/[0.02] border border-white/[0.02] hover:bg-white/[0.05] transition-all cursor-default">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400">
                        {act.user[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{act.action}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{act.user} • {act.type}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions HUD */}
            <div className="bg-indigo-600 p-8 rounded-[48px] shadow-2xl shadow-indigo-600/20 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div>
                <h3 className="text-2xl font-black text-white leading-tight mb-4">Express<br />Commands</h3>
                <p className="text-indigo-100 text-xs font-bold leading-relaxed mb-8 opacity-80">Execute high-priority administrative tasks directly from the main bridge.</p>

                <div className="space-y-3">
                  <button className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-[2px] transition-all text-center">Export Full Data</button>
                  <button className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-[2px] transition-all text-center">Audit User Logs</button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-[8px] font-black text-white/50 uppercase tracking-widest leading-loose">Access restricted to verified<br />Level 4 Admin personnel</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
          ::-webkit-scrollbar { width: 5px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}} />
    </div>
  );
}
