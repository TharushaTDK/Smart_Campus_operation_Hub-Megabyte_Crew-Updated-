import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bell, Check, Clock, MessageSquare, Calendar, UserPlus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

export default function NotificationBell({ dropdownAlign = 'right' }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('/api/notifications');
            setNotifications(res.data);
            const countRes = await axios.get('/api/notifications/unread-count');
            setUnreadCount(countRes.data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();

        let eventSource;
        let retryTimeout;

        const connect = () => {
            eventSource = new EventSource('/api/notifications/stream', { withCredentials: true });

            eventSource.addEventListener('notification', (event) => {
                try {
                    const newNotification = JSON.parse(event.data);
                    setNotifications(prev => [newNotification, ...prev]);
                    setUnreadCount(prev => prev + 1);
                } catch (e) {
                    console.error('Failed to parse SSE notification', e);
                }
            });

            eventSource.onerror = () => {
                eventSource.close();
                // Auto-reconnect after 5 seconds
                retryTimeout = setTimeout(connect, 5000);
            };
        };

        connect();

        // Polling fallback — re-sync every 30 seconds in case SSE missed an event
        const poll = setInterval(fetchNotifications, 30000);

        return () => {
            eventSource.close();
            clearTimeout(retryTimeout);
            clearInterval(poll);
        };
    }, []);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close on navigation
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const markAsRead = async (id, isRead) => {
        if (isRead) return;
        try {
            await axios.patch(`/api/notifications/${id}/read`);
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const handleNotificationClick = (note) => {
        markAsRead(note.id, note.isRead);
        setIsOpen(false);

        if (note.type === 'BOOKING') {
            navigate(user?.role === 'TEACHER' ? '/lecturer/my-sessions' : '/sessions');
        } else if (note.type === 'TICKET') {
            navigate(user?.role === 'ADMIN' ? '/admin/tickets' : '/tickets');
        } else if (note.type === 'USER') {
            navigate('/admin/users');
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.patch('/api/notifications/read-all');
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'BOOKING': return <Calendar className="w-4 h-4 text-blue-400" />;
            case 'TICKET': return <MessageSquare className="w-4 h-4 text-purple-400" />;
            case 'USER': return <UserPlus className="w-4 h-4 text-emerald-400" />;
            default: return <Bell className="w-4 h-4 text-gray-400" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
            >
                <Bell className={`w-5 h-5 transition-colors ${unreadCount > 0 ? 'text-blue-400 animate-pulse' : 'text-slate-400 group-hover:text-white'}`} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-lg shadow-blue-500/30">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className={`absolute ${dropdownAlign === 'left' ? 'left-0' : 'right-0'} mt-3 w-80 sm:w-96 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-5 duration-200`}>
                    <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            Notifications
                            {unreadCount > 0 && <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                        </h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={markAllAsRead}
                                className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium flex items-center gap-1"
                            >
                                <Check className="w-3 h-3" /> Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-10 text-center">
                                <Bell className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                                <p className="text-slate-400 text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {notifications.map((note) => (
                                    <div 
                                        key={note.id}
                                        onClick={() => handleNotificationClick(note)}
                                        className={`p-4 hover:bg-white/[0.03] transition-colors cursor-pointer flex gap-4 ${!note.isRead ? 'bg-blue-600/[0.03]' : ''}`}
                                    >
                                        <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${!note.isRead ? 'bg-blue-600/20' : 'bg-white/5'}`}>
                                            {getIcon(note.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm leading-snug mb-1 ${!note.isRead ? 'text-white font-medium' : 'text-slate-400'}`}>
                                                {note.message}
                                            </p>
                                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                                <Clock className="w-3 h-3" />
                                                {new Date(note.createdAt).toLocaleString()}
                                                {!note.isRead && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-auto"></span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-white/5 text-center border-t border-white/10">
                        <button className="text-xs text-slate-400 hover:text-white transition-colors uppercase tracking-widest font-bold">
                            Close Menu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
