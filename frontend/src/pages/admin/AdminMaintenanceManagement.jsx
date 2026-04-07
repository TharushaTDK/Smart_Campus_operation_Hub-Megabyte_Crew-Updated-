import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

export default function AdminMaintenanceManagement() {
    const [maintenanceItems, setMaintenanceItems] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('UNDER_MAINTENANCE');

    // Add / Edit Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ sourceId: '', name: '', type: '', location: '', description: '', status: 'Pending' });

    useEffect(() => {
        fetchMaintenanceItems();
        fetchFacilities();
    }, []);

    const fetchFacilities = async () => {
        try {
            const res = await axios.get('/api/admin/facilities', { withCredentials: true });
            setFacilities(res.data);
        } catch (error) {
            console.error('Failed to fetch facilities', error);
        }
    };

    const fetchMaintenanceItems = async () => {
        try {
            const res = await axios.get('/api/maintenance', { withCredentials: true });
            setMaintenanceItems(res.data);
        } catch (error) {
            console.error('Failed to fetch maintenance items', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setEditingItem(null);
        setFormData({ sourceId: '', name: '', type: '', location: '', description: '', status: 'Pending' });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item) => {
        setEditingItem(item);
        setFormData({ ...item });
        setIsModalOpen(true);
    };

    const handleFacilitySelect = (e) => {
        const selectedFacility = facilities.find(f => f.id === e.target.value);
        if (selectedFacility) {
            setFormData({
                ...formData,
                sourceId: selectedFacility.id,
                name: selectedFacility.name,
                type: selectedFacility.type,
                location: selectedFacility.location
            });
        }
    };

    const handleSaveItem = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await axios.put(`/api/maintenance/${editingItem.id}`, formData, { withCredentials: true });
            } else {
                await axios.post('/api/maintenance', formData, { withCredentials: true });
            }
            setIsModalOpen(false);
            fetchMaintenanceItems();
        } catch (error) {
            console.error('Failed to save item', error);
        }
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm("Are you sure you want to delete this maintenance item?")) {
            try {
                await axios.delete(`/api/maintenance/${id}`, { withCredentials: true });
                fetchMaintenanceItems();
            } catch (error) {
                console.error('Failed to delete item', error);
            }
        }
    };

    const underMaintenance = maintenanceItems.filter(item => item.status !== 'Completed');
    const completeMaintenance = maintenanceItems.filter(item => item.status === 'Completed');

    return (
        <div className="flex bg-[#0a0e1b] min-h-screen font-sans text-slate-300">
            <Sidebar />
            <div className="flex-1 overflow-auto ml-64 relative min-h-screen p-12">
                {/* Glow Accents */}
                <div className="fixed top-0 right-0 w-[50vw] h-[50vh] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>

                <header className="mb-12 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tighter mb-2 uppercase">
                            Maintenance <span className="text-indigo-600">Operations</span>
                        </h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[5px] ml-1">Asset Integrity & Repair Lifecycle HUD</p>
                    </div>
                    <button 
                        onClick={handleOpenAddModal}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                        Add Maintenance Item
                    </button>
                </header>

                {/* Tactical Switcher */}
                <div className="flex gap-4 mb-12 relative z-10">
                    <button
                        onClick={() => setActiveTab('UNDER_MAINTENANCE')}
                        className={`flex-1 py-6 rounded-[32px] px-8 transition-all duration-500 flex items-center justify-center gap-4 group border ${
                            activeTab === 'UNDER_MAINTENANCE'
                                ? 'bg-orange-600/10 text-orange-400 border-orange-500/30 shadow-lg shadow-orange-500/5'
                                : 'bg-white/5 text-slate-500 border-transparent hover:bg-white/10 hover:text-slate-300'
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                            activeTab === 'UNDER_MAINTENANCE' ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20' : 'bg-black/20 text-slate-600'
                        }`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-[3px] opacity-60 leading-none mb-1">Status Active</p>
                            <h3 className="text-sm font-black uppercase tracking-widest">Under Maintenance</h3>
                        </div>
                        <span className={`ml-auto px-3 py-1 rounded-full text-[10px] font-black ${
                             activeTab === 'UNDER_MAINTENANCE' ? 'bg-orange-500/20 text-orange-400' : 'bg-black/20 text-slate-600'
                        }`}>
                            {underMaintenance.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('COMPLETE_MAINTENANCE')}
                        className={`flex-1 py-6 rounded-[32px] px-8 transition-all duration-500 flex items-center justify-center gap-4 group border ${
                            activeTab === 'COMPLETE_MAINTENANCE'
                                ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                                : 'bg-white/5 text-slate-500 border-transparent hover:bg-white/10 hover:text-slate-300'
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                            activeTab === 'COMPLETE_MAINTENANCE' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-black/20 text-slate-600'
                        }`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-[3px] opacity-60 leading-none mb-1">Status Archived</p>
                            <h3 className="text-sm font-black uppercase tracking-widest">Complete Maintenance</h3>
                        </div>
                        <span className={`ml-auto px-3 py-1 rounded-full text-[10px] font-black ${
                             activeTab === 'COMPLETE_MAINTENANCE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-black/20 text-slate-600'
                        }`}>
                            {completeMaintenance.length}
                        </span>
                    </button>
                </div>

                <main className="relative z-10">
                    {activeTab === 'UNDER_MAINTENANCE' && (
                        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white/5 rounded-[40px] animate-pulse"></div>)}
                                </div>
                            ) : (
                                <>
                                    {underMaintenance.length === 0 ? (
                                        <div className="py-20 text-center bg-[#151e30]/30 rounded-[48px] border-2 border-dashed border-white/5">
                                            <p className="text-slate-600 font-black text-sm uppercase tracking-widest">No assets currently flagged for maintenance</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {underMaintenance.map(item => (
                                                <div key={item.id} className="group bg-[#151e30]/50 backdrop-blur-2xl rounded-[40px] p-8 border border-white/5 hover:border-orange-500/30 transition-all duration-500 flex flex-col relative overflow-hidden">
                                                    <div className="absolute top-4 right-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={(e) => { e.stopPropagation(); handleOpenEditModal(item); }} className="w-8 h-8 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 transition-colors">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                        </button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }} className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center text-red-400 transition-colors">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <div className="flex justify-between items-start mb-6 pr-20">
                                                        <span className="text-[9px] font-black uppercase tracking-[2px] px-3 py-1.5 rounded-xl border bg-orange-500/10 text-orange-400 border-orange-500/20">
                                                            {item.status}
                                                        </span>
                                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        </div>
                                                    </div>
                                                    <h3 className="text-xl font-black text-white leading-tight mb-2 uppercase group-hover:text-orange-400 transition-colors tracking-tight">{item.name}</h3>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[3px] mb-4">{item.location}</p>
                                                    {item.description && (
                                                        <p className="text-xs text-slate-400 mb-6 bg-black/20 p-3 rounded-xl border border-white/5">{item.description}</p>
                                                    )}
                                                    <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                                        <span>Resource Type</span>
                                                        <span className="text-white opacity-60">{item.type}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'COMPLETE_MAINTENANCE' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            {completeMaintenance.length === 0 ? (
                                <div className="py-20 text-center bg-[#151e30]/30 rounded-[48px] border-2 border-dashed border-white/5">
                                    <p className="text-slate-600 font-black text-sm uppercase tracking-widest">Archive is currently empty</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {completeMaintenance.map(item => (
                                        <div key={item.id} className="group bg-[#151e30]/30 rounded-[40px] p-8 border border-white/5 transition-all duration-500 flex flex-col opacity-60 hover:opacity-100 grayscale hover:grayscale-0">
                                            <div className="flex justify-between items-start mb-6">
                                                <span className="text-[9px] font-black uppercase tracking-[2px] px-3 py-1.5 rounded-xl border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                                    RESOLVED
                                                </span>
                                                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                            </div>
                                            <h3 className="text-xl font-black text-white leading-tight mb-2 uppercase">{item.name}</h3>
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[3px] mb-6">{item.location}</p>
                                            <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                                <span>Resolution Protocol</span>
                                                <span className="text-emerald-500/50">SYSTEM_RESTORED</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#0f1524] border border-white/10 rounded-[32px] p-8 max-w-lg w-full relative shadow-2xl overflow-y-auto max-h-[90vh]">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8">
                            {editingItem ? 'Edit Maintenance' : 'Add Maintenance'} <span className="text-indigo-500">Item</span>
                        </h2>
                        
                        <form onSubmit={handleSaveItem} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">Select Facility / Asset</label>
                                <select 
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500"
                                    value={formData.sourceId || ''}
                                    onChange={handleFacilitySelect}
                                    required={!editingItem} // If editing, they might be editing an item not tied to a facility, so only required if adding linked item
                                >
                                    <option value="">-- Choose a Facility --</option>
                                    {facilities.map(f => (
                                        <option key={f.id} value={f.id}>{f.name} - {f.location}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">Item Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500" 
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        required 
                                        placeholder="E.g. Router in Lab 2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">Location</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500" 
                                        value={formData.location}
                                        onChange={e => setFormData({...formData, location: e.target.value})}
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">Resource Type</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500" 
                                        value={formData.type}
                                        onChange={e => setFormData({...formData, type: e.target.value})}
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">Status</label>
                                    <select 
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500"
                                        value={formData.status}
                                        onChange={e => setFormData({...formData, status: e.target.value})}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">Description / Issue</label>
                                <textarea 
                                    rows="4"
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder:text-slate-700" 
                                    placeholder="Describe the maintenance issue or repairs needed..."
                                    value={formData.description || ''}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                ></textarea>
                            </div>
                            
                            <button 
                                type="submit"
                                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-4 font-black uppercase text-xs tracking-widest transition-colors shadow-lg shadow-indigo-600/20"
                            >
                                {editingItem ? 'Save Changes' : 'Create Item'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
            `}} />
        </div>
    );
}
