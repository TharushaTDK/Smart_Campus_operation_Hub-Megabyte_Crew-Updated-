import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import axios from 'axios';

const Sidebar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
    { name: 'Users', path: '/admin/users', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6a6 6 0 016 6v1h-3" /> },
    { name: 'Facilities & Assets', path: '/admin/facility-management', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /> },
    { name: 'Maintenance Items', path: '/admin/maintenance', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /> },
    { name: 'Study Sessions', path: '/admin/study-sessions', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
    { name: 'Tickets', path: '/admin/tickets', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /> },
  ];

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-[#0d1526] text-slate-300 flex flex-col justify-between z-40 border-r border-white/5 shadow-2xl">
      <div>
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-xl font-black text-white italic">S</span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase">Smart<span className="text-indigo-400">Hub</span></h1>
          </div>
        </div>

        <nav className="px-4 space-y-2">
          {navItems.map(item => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5'
                  : 'hover:bg-white/5 hover:text-white border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <svg className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-300'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                  <span className="text-sm font-bold tracking-wide">{item.name}</span>
                  {item.name === 'Facilities & Assets' && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-6">
        <div className="bg-white/5 rounded-[32px] p-5 border border-white/5 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <img className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20 p-0.5" src={user?.photo || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'} alt="Admin" />
            <div className="overflow-hidden">
              <p className="font-black text-white text-sm truncate uppercase tracking-wider">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-500 font-bold truncate uppercase tracking-widest">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-black uppercase tracking-[2px] transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
