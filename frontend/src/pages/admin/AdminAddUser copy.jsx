import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminAddUser() {
  const [role, setRole] = useState('STUDENT');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    repassword: '',
    subject: '',
    seniority: 'JUNIOR',
    department: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    setSuccess('');
    // Reset specific fields when role changes
    setFormData({ ...formData, subject: '', seniority: 'JUNIOR', department: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.repassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    
    // Construct payload based on the role
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: role
    };

    if (role === 'TEACHER') {
      payload.subject = formData.subject;
      payload.seniority = formData.seniority;
    } else if (role === 'MAINTAIN_STAFF') {
      payload.department = formData.department;
    }

    try {
      await axios.post('/api/admin/users', payload, { withCredentials: true });
      setSuccess('User successfully added!');
      setFormData({
        name: '', email: '', password: '', repassword: '', subject: '', seniority: 'JUNIOR', department: ''
      });
      setTimeout(() => navigate('/admin/users'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#0a0e1b] min-h-screen font-sans text-slate-300">
      <Sidebar />
      <main className="flex-1 overflow-auto ml-64 min-h-screen relative p-12">
        {/* Glow Accents */}
        <div className="fixed top-0 right-0 w-[50vw] h-[50vh] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto">
          <header className="flex items-center gap-6 mb-12 relative z-10">
            <button onClick={() => navigate('/admin/users')} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 group">
              <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>
            <div>
                <h1 className="text-5xl font-black text-white tracking-tighter mb-1 uppercase">Personnel <span className="text-indigo-600">Enrollment</span></h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[5px] ml-1">Secure User Provisioning Protocol</p>
            </div>
          </header>

          <div className="bg-[#151e30]/50 backdrop-blur-2xl rounded-[48px] border border-white/5 overflow-hidden shadow-2xl relative z-10">
            {/* HUD Role Switcher */}
            <div className="p-10 border-b border-white/5 bg-white/[0.01]">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[5px] mb-6 text-center">Designated Authorization Level</label>
                <div className="flex flex-wrap gap-2 p-2 bg-black/40 rounded-[30px] border border-white/5">
                {[
                  { value: 'STUDENT', label: 'L1: Student' },
                  { value: 'TEACHER', label: 'L2: Lecturer' },
                  { value: 'MAINTAIN_STAFF', label: 'L2: Staff' },
                  { value: 'ADMIN', label: 'L4: Admin' }
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => handleRoleChange(r.value)}
                    className={`flex-1 min-w-[140px] px-6 py-4 rounded-[22px] text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${
                      role === r.value
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 scale-[1.02]'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form HUD */}
            <form onSubmit={handleSubmit} className="p-10 space-y-10">
              
              {error && (
                <div className="bg-red-500/10 text-red-400 p-6 rounded-[32px] text-xs font-black uppercase tracking-widest border border-red-500/20 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                  </div>
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-emerald-500/10 text-emerald-400 p-6 rounded-[32px] text-xs font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                   <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                   </div>
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[4px] mb-4 ml-2">Entity Legal Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-black/40 border-2 border-transparent rounded-[28px] px-8 py-6 focus:bg-white/5 focus:border-indigo-500 outline-none transition-all font-black text-white text-sm uppercase tracking-widest" placeholder="Assign Name..." />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[4px] mb-4 ml-2">Network Email Address</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-black/40 border-2 border-transparent rounded-[28px] px-8 py-6 focus:bg-white/5 focus:border-indigo-500 outline-none transition-all font-black text-white text-sm lowercase" placeholder="address@hub.edu" />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[4px] mb-4 ml-2">Access Key (Password)</label>
                  <input type="password" name="password" required value={formData.password} onChange={handleChange} minLength={6} className="w-full bg-black/40 border-2 border-transparent rounded-[28px] px-8 py-6 focus:bg-white/5 focus:border-indigo-500 outline-none transition-all font-black text-white text-sm" placeholder="••••••••" />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[4px] mb-4 ml-2">Verify Access Key</label>
                  <input type="password" name="repassword" required value={formData.repassword} onChange={handleChange} minLength={6} className="w-full bg-black/40 border-2 border-transparent rounded-[28px] px-8 py-6 focus:bg-white/5 focus:border-indigo-500 outline-none transition-all font-black text-white text-sm" placeholder="••••••••" />
                </div>

                {/* Role-specific HUD blocks */}
                {role === 'TEACHER' && (
                  <div className="md:col-span-2 p-10 bg-indigo-500/5 rounded-[40px] border border-white/5 animate-in slide-in-from-left-4 duration-500 grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="col-span-full border-b border-white/5 pb-6 mb-2">
                        <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[5px]">Lecturer Profile Extension</h3>
                     </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[3px] mb-3 ml-2">Subject Domain</label>
                      <input type="text" name="subject" required value={formData.subject} onChange={handleChange} className="w-full bg-[#0d1526] border border-white/5 rounded-2xl px-6 py-4 focus:border-indigo-500 outline-none transition-all font-black text-white text-xs uppercase" placeholder="e.g. Physics" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[3px] mb-3 ml-2">Seniority Index</label>
                      <select name="seniority" required value={formData.seniority} onChange={handleChange} className="w-full bg-[#0d1526] border border-white/5 rounded-2xl px-6 py-4 focus:border-indigo-500 outline-none transition-all font-black text-white text-[10px] uppercase tracking-widest cursor-pointer appearance-none">
                        <option value="JUNIOR">Junior Lecturer</option>
                        <option value="SENIOR">Senior Lecturer</option>
                        <option value="PROFESSOR">Professor</option>
                      </select>
                    </div>
                  </div>
                )}

                {role === 'MAINTAIN_STAFF' && (
                  <div className="md:col-span-2 p-10 bg-emerald-500/5 rounded-[40px] border border-white/5 animate-in slide-in-from-left-4 duration-500">
                    <div className="border-b border-white/5 pb-6 mb-8">
                        <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[5px]">Staff Departmental Routing</h3>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[3px] mb-3 ml-2">Trade / Sector</label>
                      <select name="department" required value={formData.department} onChange={handleChange} className="w-full bg-[#0d1526] border border-white/5 rounded-2xl px-8 py-5 focus:border-indigo-500 outline-none font-black text-white text-[10px] transition-all tracking-widest uppercase cursor-pointer">
                        <option value="">Select Sector...</option>
                        <option value="ELECTRICAL">Elec & Wiring</option>
                        <option value="PLUMBING">Hydraulics & Water</option>
                        <option value="CLEANING">Sanitary & Janitorial</option>
                        <option value="LANDSCAPING">Eco & Grounds</option>
                        <option value="GENERAL">General Maintenance</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-12 border-t border-white/5 flex gap-6">
                 <button type="button" onClick={() => navigate('/admin/users')} className="flex-1 py-6 text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors tracking-[4px]">Cancel</button>
                 <button type="submit" disabled={loading} className="flex-[2] py-6 bg-indigo-600 text-white rounded-[32px] font-black uppercase tracking-[4px] shadow-2xl shadow-indigo-600/20 hover:bg-white hover:text-indigo-600 transition-all disabled:opacity-50 flex items-center justify-center gap-4">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                        COMMIT ENROLLMENT
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{ __html: `
          ::-webkit-scrollbar { width: 5px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}} />
    </div>
  );
}
