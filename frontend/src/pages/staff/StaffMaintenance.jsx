import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../App';
import { Link } from 'react-router-dom';

export default function StaffMaintenance() {
    const { user } = useAuth();
    const [maintenanceItems, setMaintenanceItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMaintenanceItems();
    }, []);

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

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(`/api/maintenance/${id}/status`, { status: newStatus }, { withCredentials: true });
            fetchMaintenanceItems();
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update status. Check console.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-20">
            <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Campus Operational Queue</h2>
                    <p className="text-gray-500">Track and manage identified facility and asset maintenance issues.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        {maintenanceItems.length === 0 ? (
                            <div className="p-16 text-center text-gray-400">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <p className="text-xl font-medium text-gray-500">No active maintenance tasks!</p>
                                <p className="text-sm mt-1">Campus is fully operational.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Site / Name</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {maintenanceItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">ID: {item.sourceId || item.id}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{item.type}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{item.location}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold
                                                    ${item.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                                                      item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                                                      'bg-orange-100 text-orange-700'}`}>
                                                    {item.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {item.status !== 'Completed' && (
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {item.status === 'Pending' && (
                                                            <button 
                                                                onClick={() => handleStatusUpdate(item.id, 'In Progress')}
                                                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-md transition-colors border border-blue-200">
                                                                Start Work
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => handleStatusUpdate(item.id, 'Completed')}
                                                            className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 text-xs font-bold rounded-md transition-colors border border-green-200">
                                                            Mark Complete
                                                        </button>
                                                    </div>
                                                )}
                                                {item.status === 'Completed' && (
                                                    <svg className="w-6 h-6 text-green-500 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
