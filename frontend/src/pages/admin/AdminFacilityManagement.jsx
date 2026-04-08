import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

export default function AdminFacilityManagement() {
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        category: 'Study Area',
        type: 'Lecture Hall',
        capacity: '',
        location: '',
        maintenanceStatus: 'No Maintenance',
        attributes: {}
    });

    const categories = ['Study Area', 'Equipment', 'Other Asset'];
    
    const typesByCategory = {
        'Study Area': ['Lecture Hall', 'PC Laboratory', 'Science Laboratory', 'Auditorium'],
        'Equipment': ['Air Conditioner', 'Projector', 'Computer', 'CCTV', 'Water Dispenser', 'Sound System'],
        'Other Asset': ['Furniture', 'Vehicle', 'Infrastructure', 'Office Supply']
    };

    useEffect(() => {
        fetchFacilities();
    }, []);

    const fetchFacilities = async () => {
        try {
            const res = await axios.get('/api/admin/facilities', { withCredentials: true });
            setFacilities(res.data);
        } catch (error) {
            console.error('Failed to fetch facilities', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (val) => {
        const selectedCategory = val;
        const defaultType = typesByCategory[selectedCategory][0];
        setFormData({ 
            ...formData, 
            category: selectedCategory, 
            type: defaultType,
            attributes: getInitialAttributes(defaultType)
        });
    };

    const handleTypeChange = (e) => {
        const selectedType = e.target.value;
        setFormData({ 
            ...formData, 
            type: selectedType, 
            attributes: getInitialAttributes(selectedType) 
        });
    };

    const getInitialAttributes = (type) => {
        switch (type) {
            case 'Lecture Hall': return { hasProjector: false, hasMic: false };
            case 'PC Laboratory': return { computerCount: '', softwareInstalled: '' };
            case 'Science Laboratory': return { labEquipmentType: '', safetyFeatures: '' };
            case 'Auditorium': return { hasSoundSystem: false, stageSize: '' };
            case 'Air Conditioner': return { brand: '', coolingCapacity: '', lastServiceDate: '' };
            case 'Projector': return { resolution: '1080p', connectivity: 'HDMI' };
            case 'Computer': return { ram: '', processor: '', storage: '' };
            case 'CCTV': return { resolution: '', storageDays: '', nightVision: false };
            case 'Vehicle': return { plateNumber: '', fuelType: '', mileage: '' };
            default: return {};
        }
    };

    const handleAttributeChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            attributes: {
                ...prev.attributes,
                [name]: type === 'checkbox' ? checked : value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                capacity: parseInt(formData.capacity, 10) || 0,
            };
            if (editingId) {
                await axios.put(`/api/admin/facilities/${editingId}`, payload, { withCredentials: true });
            } else {
                await axios.post('/api/admin/facilities', payload, { withCredentials: true });
            }
            setShowModal(false);
            resetForm();
            fetchFacilities();
        } catch (error) {
            console.error('Failed to save facility', error);
            alert('Failed to save. Check console.');
        }
    };

    const handleEditClick = (facility) => {
        setEditingId(facility.id);
        setFormData({
            name: facility.name,
            category: facility.category,
            type: facility.type,
            capacity: facility.capacity || '',
            location: facility.location,
            maintenanceStatus: facility.maintenanceStatus || 'No Maintenance',
            attributes: facility.attributes || {}
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: '',
            category: 'Study Area',
            type: 'Lecture Hall',
            capacity: '',
            location: '',
            maintenanceStatus: 'No Maintenance',
            attributes: { hasProjector: false, hasMic: false }
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this item?")) return;
        try {
            await axios.delete(`/api/admin/facilities/${id}`, { withCredentials: true });
            fetchFacilities();
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };

    const filteredFacilities = facilities.filter(f => {
        const matchesCategory = activeFilter === 'All' || f.category === activeFilter;
        const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const filterTabs = [
        { label: 'All', value: 'All' },
        { label: 'Study Areas', value: 'Study Area' },
        { label: 'Equipments', value: 'Equipment' },
        { label: 'Other Assets', value: 'Other Asset' }
    ];

    return (
        <div className="flex bg-[#0a0e1b] min-h-screen font-sans text-slate-300">
            <Sidebar />
            <div className="flex-1 overflow-auto ml-64 relative min-h-screen">
                {/* Glow Accents */}
                <div className="fixed top-0 right-0 w-[50vw] h-[50vh] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>

                <header className="px-12 pt-12 pb-8 flex justify-between items-end relative z-10">
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
                             Facilities <span className="text-indigo-600">&</span> Assets
                        </h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[5px] ml-1">Campus Resource & Infrastructure HUD</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="bg-indigo-600 hover:bg-white text-white hover:text-indigo-600 px-8 py-3.5 rounded-2xl font-black shadow-xl shadow-indigo-500/10 transition-all flex items-center gap-3 active:scale-95"
                    >
                        + NEW RESOURCE
                    </button>
                </header>

                <div className="px-12 py-4 sticky top-0 z-20 bg-[#0a0e1b]/80 backdrop-blur-xl border-b border-white/5 flex flex-col md:flex-row gap-8 items-center justify-between">
                    <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 custom-scrollbar-none">
                        {filterTabs.map(tab => (
                            <button
                                key={tab.value}
                                onClick={() => setActiveFilter(tab.value)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 flex-shrink-0 ${
                                    activeFilter === tab.value
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                        : 'text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                {tab.label}
                                <span className={`ml-3 text-[9px] px-2 py-0.5 rounded-full ${
                                    activeFilter === tab.value ? 'bg-indigo-500' : 'bg-white/5'
                                }`}>
                                    {tab.value === 'All' ? facilities.length : facilities.filter(f => f.category === tab.value).length}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Search Bar HUD */}
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-indigo-500/50 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input 
                            type="text"
                            placeholder="Search resources by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-3.5 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.02] transition-all"
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-white transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                <main className="px-12 py-12 relative z-10 w-full">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
                            {[1,2,3,4,5,6].map(i => <div key={i} className="h-80 bg-white/5 rounded-[40px]"></div>)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredFacilities.length === 0 ? (
                                <div className="col-span-full py-40 text-center bg-[#151e30]/30 rounded-[48px] border-2 border-dashed border-white/5">
                                    <p className="text-slate-600 font-black text-xl uppercase tracking-widest mb-4">No matching resources detected</p>
                                    <button onClick={() => setShowModal(true)} className="bg-white/5 text-slate-400 px-8 py-3 rounded-2xl font-black hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest text-[10px]">Initialize New Record</button>
                                </div>
                            ) : (
                                filteredFacilities.map((item) => (
                                    <div key={item.id} className="group bg-[#151e30]/80 backdrop-blur-2xl rounded-[40px] p-8 border border-white/5 hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        
                                        <div className="flex justify-between items-start mb-10 relative z-10">
                                            <span className={`text-[9px] font-black uppercase tracking-[2px] px-3 py-1.5 rounded-xl border ${
                                                item.category === 'Study Area' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 
                                                item.category === 'Equipment' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20'
                                            }`}>
                                                {item.category}
                                            </span>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={(e) => { e.stopPropagation(); handleEditClick(item); }} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black text-white leading-tight mb-2 truncate uppercase tracking-tight relative z-10 group-hover:text-indigo-400 transition-colors">{item.name}</h3>
                                        <div className="flex items-center gap-3 mb-10 relative z-10">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[3px] truncate">{item.location}</p>
                                        </div>

                                        <div className="space-y-4 mb-10 flex-1 relative z-10">
                                            <div className="flex justify-between items-center py-3 border-b border-white/5 group/row">
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Resource Class</span>
                                                <span className="text-[10px] font-black text-indigo-400">{item.category}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-3 border-b border-white/5 group/row">
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Model Link</span>
                                                <span className="text-[10px] font-black text-white opacity-80">{item.type}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-3 border-b border-white/5 group/row">
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Live Status</span>
                                                <span className={`text-[10px] font-black px-3 py-1 rounded-xl ${item.maintenanceStatus === 'Under Maintenance' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'}`}>
                                                    {item.maintenanceStatus === 'Under Maintenance' ? 'REPAIR' : 'STABLE'}
                                                </span>
                                            </div>
                                        </div>

                                        {item.attributes && Object.keys(item.attributes).length > 0 && (
                                            <div className="grid grid-cols-2 gap-3 mt-auto pt-8 border-t border-white/5 relative z-10">
                                                {Object.entries(item.attributes).slice(0, 4).map(([key, val]) => (
                                                    <div key={key} className="bg-black/20 rounded-2xl p-4 border border-white/[0.02]">
                                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2 truncate opacity-50">{key}</p>
                                                        <p className="text-[10px] font-black text-white/80 truncate uppercase tracking-wider">
                                                            {typeof val === 'boolean' ? (val ? 'ACTIVE' : 'NONE') : val}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Modal HUD */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0a0e1b]/90 backdrop-blur-2xl animate-in fade-in duration-300">
                    <div className="bg-[#151e30] rounded-[48px] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh] border border-white/10 animate-in slide-in-from-bottom-10 duration-500 relative">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
                        
                        <div className="px-12 py-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                            <div>
                                <h2 className="text-3xl font-black text-white tracking-tight uppercase">
                                    {editingId ? 'Edit Resource ' : 'Resource '}<span className="text-indigo-600">Config</span>
                                </h2>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[4px] mt-1 italic">Asset Registration Protocol</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="bg-white/5 p-4 rounded-2xl border border-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="px-12 py-10 overflow-y-auto custom-scrollbar-indigo">
                            <div className="space-y-12">
                                {/* Segment Switcher */}
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[5px] mb-6 text-center">Facility Type (Master Category)</label>
                                    <div className="flex p-2 bg-black/40 rounded-[30px] gap-1 border border-white/5">
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => handleCategoryChange(cat)}
                                                className={`flex-1 py-4 px-4 rounded-[24px] text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${
                                                    formData.category === cat 
                                                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 scale-[1.02]' 
                                                        : 'text-slate-500 hover:text-slate-300'
                                                }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="col-span-full">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[4px] mb-4 ml-2">Resource Name</label>
                                        <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-8 py-6 bg-black/40 border-2 border-transparent rounded-[28px] focus:bg-white/5 focus:border-indigo-500 outline-none transition-all font-black text-white text-sm placeholder-slate-700 uppercase tracking-widest"
                                            placeholder="Unique Identifier..." />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[4px] mb-4 ml-2">Sub-type (Model)</label>
                                        <div className="relative">
                                            <select value={formData.type} onChange={handleTypeChange}
                                                className="w-full px-8 py-6 bg-black/40 border-2 border-transparent rounded-[28px] focus:bg-white/5 focus:border-indigo-500 outline-none font-black text-white text-sm appearance-none tracking-widest uppercase cursor-pointer">
                                                {typesByCategory[formData.category].map(t => <option key={t} value={t} className="bg-[#151e30]">{t}</option>)}
                                            </select>
                                            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-500">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    {formData.category === 'Study Area' && (
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[4px] mb-4 ml-2">Units / Capacity</label>
                                            <input required type="number" min="0" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                                                className="w-full px-8 py-6 bg-black/40 border-2 border-transparent rounded-[28px] focus:bg-white/5 focus:border-indigo-500 outline-none font-black text-white text-sm tracking-widest" placeholder="0" />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[4px] mb-4 ml-2">Zone / Loc</label>
                                        <input required type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-8 py-6 bg-black/40 border-2 border-transparent rounded-[28px] focus:bg-white/5 focus:border-indigo-500 outline-none font-black text-white text-sm placeholder-slate-700 uppercase tracking-widest" placeholder="BLOCK / FLOOR..." />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[4px] mb-4 ml-2">Initial Status</label>
                                        <select value={formData.maintenanceStatus} onChange={e => setFormData({ ...formData, maintenanceStatus: e.target.value })}
                                            className="w-full px-8 py-6 bg-black/40 border-2 border-transparent rounded-[28px] focus:bg-white/5 focus:border-indigo-500 outline-none font-black text-white text-sm appearance-none tracking-widest uppercase cursor-pointer">
                                            <option value="No Maintenance" className="bg-[#151e30]">STABLE (HEALTY)</option>
                                            <option value="Under Maintenance" className="bg-[#151e30]">DEFECTIVE (REPAIR)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* HUD Detailed Attrs */}
                                <div className="p-10 bg-black/20 rounded-[48px] border border-white/5">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                                        </div>
                                        <h4 className="text-[10px] font-black text-white uppercase tracking-[5px]">Sub-Mapping: {formData.type}</h4>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {formData.category === 'Study Area' && (
                                            <>
                                                <label className="flex items-center gap-6 cursor-pointer group">
                                                    <div className="relative">
                                                        <input type="checkbox" name="hasProjector" checked={formData.attributes.hasProjector || false} onChange={handleAttributeChange} className="peer sr-only" />
                                                        <div className="w-14 h-8 bg-white/5 rounded-full peer-checked:bg-indigo-600 transition-all border border-white/10 group-hover:border-indigo-500/50"></div>
                                                        <div className="absolute left-1.5 top-1.5 w-5 h-5 bg-slate-500 rounded-full transition-all peer-checked:translate-x-6 peer-checked:bg-white shadow-xl"></div>
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">Digital Projector</span>
                                                </label>
                                                <label className="flex items-center gap-6 cursor-pointer group">
                                                    <div className="relative">
                                                        <input type="checkbox" name="hasMic" checked={formData.attributes.hasMic || false} onChange={handleAttributeChange} className="peer sr-only" />
                                                        <div className="w-14 h-8 bg-white/5 rounded-full peer-checked:bg-indigo-600 transition-all border border-white/10 group-hover:border-indigo-500/50"></div>
                                                        <div className="absolute left-1.5 top-1.5 w-5 h-5 bg-slate-500 rounded-full transition-all peer-checked:translate-x-6 peer-checked:bg-white shadow-xl"></div>
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">Audio PA System</span>
                                                </label>
                                            </>
                                        )}

                                        {formData.type === 'Air Conditioner' && (
                                            <>
                                                <div>
                                                    <label className="block text-[9px] font-black text-indigo-400 mb-3 uppercase tracking-widest opacity-80">Brand Origin</label>
                                                    <input type="text" name="brand" value={formData.attributes.brand || ''} onChange={handleAttributeChange} className="w-full p-5 bg-black/40 border border-white/5 rounded-[20px] font-black text-white text-[10px] uppercase tracking-widest focus:border-indigo-500 transition-all outline-none" placeholder="Vendor ID..." />
                                                </div>
                                                <div>
                                                    <label className="block text-[9px] font-black text-indigo-400 mb-3 uppercase tracking-widest opacity-80">Output Cap (BTU)</label>
                                                    <input type="text" name="coolingCapacity" value={formData.attributes.coolingCapacity || ''} onChange={handleAttributeChange} className="w-full p-5 bg-black/40 border border-white/5 rounded-[20px] font-black text-white text-[10px] focus:border-indigo-500 transition-all outline-none" placeholder="12k, 18k..." />
                                                </div>
                                            </>
                                        )}

                                        {formData.type === 'Projector' && (
                                            <>
                                                <div>
                                                    <label className="block text-[9px] font-black text-indigo-400 mb-3 uppercase tracking-widest opacity-80">Output Res</label>
                                                    <select name="resolution" value={formData.attributes.resolution || '1080p'} onChange={handleAttributeChange} className="w-full p-5 bg-black/40 border border-white/5 rounded-[20px] font-black text-white text-[10px] uppercase tracking-widest outline-none cursor-pointer">
                                                        <option value="720p">HD (720p)</option>
                                                        <option value="1080p">FHD (1080p)</option>
                                                        <option value="4K">UHD (4K)</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-[9px] font-black text-indigo-400 mb-3 uppercase tracking-widest opacity-80">Interface Protocol</label>
                                                    <input type="text" name="connectivity" value={formData.attributes.connectivity || ''} onChange={handleAttributeChange} className="w-full p-5 bg-black/40 border border-white/5 rounded-[20px] font-black text-white text-[10px] uppercase tracking-widest focus:border-indigo-500 outline-none" placeholder="HDMI / WIFI..." />
                                                </div>
                                            </>
                                        )}

                                        {(!['Lecture Hall', 'Air Conditioner', 'Projector'].includes(formData.type) && formData.category !== 'Study Area') && (
                                            <div className="col-span-full py-6 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-loose italic">No Sub-Mapping required for {formData.type}<br/>Synchronized to base profile</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 flex gap-6 pb-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-6 text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors tracking-[4px]">Abort Action</button>
                                <button type="submit" className="flex-[2] py-6 text-[11px] font-black text-white bg-indigo-600 rounded-[32px] hover:bg-white hover:text-indigo-600 shadow-2xl shadow-indigo-600/20 transition-all tracking-[4px] uppercase active:scale-95">
                                    {editingId ? 'Update Node Configuration' : 'Finalise Node Registration'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar-indigo::-webkit-scrollbar { width: 6px; }
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
