import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';
import { ArrowLeft, Calendar, Clock, MapPin, CheckCircle, AlertCircle, QrCode } from 'lucide-react';

export default function StudentQRCode() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        checkExisting();
    }, [sessionId]);

    const checkExisting = async () => {
        try {
            const res = await axios.get(`/api/attendance/my/${sessionId}`, { withCredentials: true });
            setRecord(res.data);
        } catch (err) {
            if (err.response?.status !== 404) {
                toast.error('Failed to load attendance record');
            }
        } finally {
            setLoading(false);
        }
    };

    const generateQR = async () => {
        setGenerating(true);
        try {
            const res = await axios.post(`/api/attendance/generate/${sessionId}`, {}, { withCredentials: true });
            setRecord(res.data);
            toast.success('QR code generated!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to generate QR code');
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0f1c] pt-24 pb-12 px-4">
            <div className="max-w-lg mx-auto">
                <button
                    onClick={() => navigate('/sessions')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Sessions
                </button>

                <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-500/10 p-3 rounded-2xl">
                            <QrCode className="w-7 h-7 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Session QR Code</h1>
                            <p className="text-slate-400 text-sm">Show this to your lecturer for attendance</p>
                        </div>
                    </div>

                    {record && (
                        <div className="space-y-3 mb-6 bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50">
                            <h2 className="font-bold text-white text-lg">{record.subjectName}</h2>
                            <div className="flex items-center gap-2 text-slate-300 text-sm">
                                <Calendar className="w-4 h-4 text-blue-400" />
                                {record.date}
                            </div>
                            <div className="flex items-center gap-2 text-slate-300 text-sm">
                                <Clock className="w-4 h-4 text-blue-400" />
                                {record.startTime} – {record.endTime}
                            </div>
                            <div className="flex items-center gap-2 text-slate-300 text-sm">
                                <MapPin className="w-4 h-4 text-blue-400" />
                                {record.facilityName}
                            </div>
                        </div>
                    )}

                    {record ? (
                        <div className="flex flex-col items-center gap-6">
                            {/* Attendance status badge */}
                            {record.attended ? (
                                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-5 py-2.5 rounded-full font-semibold text-sm">
                                    <CheckCircle className="w-5 h-5" />
                                    Attendance Marked
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-5 py-2.5 rounded-full font-semibold text-sm">
                                    <AlertCircle className="w-5 h-5" />
                                    Not Yet Scanned
                                </div>
                            )}

                            {/* QR Code */}
                            <div className={`p-5 bg-white rounded-3xl shadow-2xl transition-all duration-300 ${record.attended ? 'opacity-60' : ''}`}>
                                <QRCodeSVG
                                    value={record.qrToken}
                                    size={220}
                                    level="H"
                                    includeMargin={false}
                                />
                            </div>

                            {record.attended && record.scannedAt && (
                                <p className="text-slate-400 text-sm text-center">
                                    Scanned at {new Date(record.scannedAt).toLocaleString()}
                                </p>
                            )}

                            {!record.attended && (
                                <p className="text-slate-400 text-sm text-center">
                                    Present this QR code to your lecturer to mark attendance
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-6 py-6">
                            <div className="w-36 h-36 bg-slate-700/40 border-2 border-dashed border-slate-600 rounded-3xl flex items-center justify-center">
                                <QrCode className="w-14 h-14 text-slate-500" />
                            </div>
                            <p className="text-slate-400 text-center text-sm">
                                Generate your personal QR code for this session.<br />
                                You will need it to mark attendance.
                            </p>
                            <button
                                onClick={generateQR}
                                disabled={generating}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                            >
                                {generating ? 'Generating…' : 'Generate My QR Code'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
