import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'react-toastify';
import {
    ArrowLeft, Camera, CameraOff, CheckCircle, XCircle,
    Users, Calendar, Clock, MapPin, UserCheck, Upload
} from 'lucide-react';

const SCANNER_ID = 'qr-camera-feed';

export default function LecturerAttendanceScanner() {
    const { sessionId } = useParams();
    const navigate = useNavigate();

    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState('camera'); // 'camera' | 'upload'
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [lastScan, setLastScan] = useState(null);
    const [uploading, setUploading] = useState(false);

    const html5QrRef = useRef(null);
    const fileInputRef = useRef(null);
    const isScanningRef = useRef(false);

    useEffect(() => {
        fetchAttendance();
        return () => { stopCamera(); };
    }, [sessionId]);

    const fetchAttendance = async () => {
        try {
            const res = await axios.get(`/api/attendance/session/${sessionId}`, { withCredentials: true });
            setAttendance(res.data);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to load attendance');
        } finally {
            setLoading(false);
        }
    };

    /* ── Camera scanner ─────────────────────────────────────────── */
    const startCamera = async () => {
        setCameraError(null);
        try {
            const cameras = await Html5Qrcode.getCameras();
            if (!cameras || cameras.length === 0) {
                setCameraError('No camera found on this device.');
                return;
            }

            if (!html5QrRef.current) {
                html5QrRef.current = new Html5Qrcode(SCANNER_ID);
            }

            const camId = cameras[0].id;
            await html5QrRef.current.start(
                camId,
                { fps: 10, qrbox: { width: 240, height: 240 } },
                async (decodedText) => {
                    if (isScanningRef.current) return;
                    isScanningRef.current = true;
                    await handleScan(decodedText);
                    setTimeout(() => { isScanningRef.current = false; }, 2500);
                },
                () => {}
            );
            setCameraActive(true);
        } catch (err) {
            const msg = err?.message || String(err);
            if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('notallowed')) {
                setCameraError('Camera permission denied. Please allow camera access in your browser settings.');
            } else {
                setCameraError(`Could not start camera: ${msg}`);
            }
        }
    };

    const stopCamera = async () => {
        isScanningRef.current = false;
        if (html5QrRef.current) {
            try {
                const state = html5QrRef.current.getState();
                // state 2 = SCANNING
                if (state === 2) await html5QrRef.current.stop();
            } catch (_) {}
        }
        setCameraActive(false);
    };

    /* ── File upload scanner ────────────────────────────────────── */
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);

        // Temporary off-screen div for file scanning
        const tempId = 'qr-file-temp';
        let tempDiv = document.getElementById(tempId);
        if (!tempDiv) {
            tempDiv = document.createElement('div');
            tempDiv.id = tempId;
            tempDiv.style.display = 'none';
            document.body.appendChild(tempDiv);
        }

        let scanner;
        try {
            scanner = new Html5Qrcode(tempId);
            const result = await scanner.scanFile(file, false);
            await handleScan(result);
        } catch (err) {
            toast.error('Could not read QR code from image. Make sure the image is clear.');
            setLastScan({ success: false, message: 'Could not read QR code from image' });
        } finally {
            if (scanner) { try { await scanner.clear(); } catch (_) {} }
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    /* ── Submit scanned token ───────────────────────────────────── */
    const handleScan = async (qrToken) => {
        try {
            const res = await axios.post('/api/attendance/scan', { qrToken }, { withCredentials: true });
            const data = res.data;
            setLastScan({ success: true, studentName: data.studentName, alreadyAttended: data.alreadyAttended });
            if (data.alreadyAttended) {
                toast.info(`${data.studentName} was already marked present`);
            } else {
                toast.success(`Attendance marked for ${data.studentName}`);
            }
            await fetchAttendance();
        } catch (err) {
            const msg = err.response?.data?.error || 'Invalid QR code';
            setLastScan({ success: false, message: msg });
            toast.error(msg);
        }
    };

    /* ── Switch modes ───────────────────────────────────────────── */
    const switchMode = async (next) => {
        if (next === mode) return;
        if (cameraActive) await stopCamera();
        setLastScan(null);
        setCameraError(null);
        setMode(next);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const attendedPct = attendance
        ? Math.round((attendance.attendedCount / Math.max(attendance.registeredCount, 1)) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-[#0a0f1c] pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => { stopCamera(); navigate('/lecturer/my-sessions'); }}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to My Sessions
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* ── Left column ─────────────────────────────── */}
                    <div className="space-y-6">

                        {/* Session info card */}
                        {attendance && (
                            <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-6">
                                <h1 className="text-xl font-black text-white uppercase mb-4">{attendance.subjectName}</h1>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                                        <Calendar className="w-4 h-4 text-blue-400" />{attendance.date}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                                        <Clock className="w-4 h-4 text-blue-400" />{attendance.startTime} – {attendance.endTime}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                                        <MapPin className="w-4 h-4 text-blue-400" />{attendance.facilityName}
                                    </div>
                                </div>

                                <div className="mt-5 grid grid-cols-3 gap-3">
                                    {[
                                        { label: 'Registered', value: attendance.registeredCount, color: 'text-blue-400' },
                                        { label: 'Attended',   value: attendance.attendedCount,   color: 'text-green-400' },
                                        { label: 'Absent',     value: attendance.registeredCount - attendance.attendedCount, color: 'text-red-400' },
                                    ].map(({ label, value, color }) => (
                                        <div key={label} className="bg-slate-900/60 rounded-2xl p-3 text-center border border-slate-700/50">
                                            <p className={`text-2xl font-black ${color}`}>{value}</p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">{label}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4">
                                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                                        <span>Attendance Rate</span>
                                        <span className="font-bold text-white">{attendedPct}%</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-700"
                                            style={{ width: `${attendedPct}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Scanner card */}
                        <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-6">

                            {/* Mode tabs */}
                            <div className="flex gap-2 mb-5">
                                <button
                                    onClick={() => switchMode('camera')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                        mode === 'camera'
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                            : 'bg-slate-700/50 text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <Camera className="w-4 h-4" /> Camera
                                </button>
                                <button
                                    onClick={() => switchMode('upload')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                        mode === 'upload'
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                            : 'bg-slate-700/50 text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <Upload className="w-4 h-4" /> Upload QR
                                </button>
                            </div>

                            {/* ── Camera mode ── */}
                            {mode === 'camera' && (
                                <>
                                    {/* The camera div is ALWAYS in the DOM; visibility controlled by CSS */}
                                    <div
                                        id={SCANNER_ID}
                                        className="rounded-2xl overflow-hidden"
                                        style={{ display: cameraActive ? 'block' : 'none' }}
                                    />

                                    {!cameraActive && (
                                        <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-600 rounded-2xl gap-3">
                                            <Camera className="w-12 h-12 text-slate-500" />
                                            <p className="text-slate-400 text-sm text-center">
                                                Click below to activate your laptop camera<br />and scan student QR codes
                                            </p>
                                        </div>
                                    )}

                                    {cameraError && (
                                        <div className="mt-3 flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm">
                                            <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                            {cameraError}
                                        </div>
                                    )}

                                    <div className="mt-4 flex justify-center">
                                        {cameraActive ? (
                                            <button
                                                onClick={stopCamera}
                                                className="flex items-center gap-2 px-6 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-sm font-bold transition-all"
                                            >
                                                <CameraOff className="w-4 h-4" /> Stop Camera
                                            </button>
                                        ) : (
                                            <button
                                                onClick={startCamera}
                                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
                                            >
                                                <Camera className="w-4 h-4" /> Start Camera
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* ── Upload mode ── */}
                            {mode === 'upload' && (
                                <div className="flex flex-col items-center gap-4">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full flex flex-col items-center justify-center py-10 border-2 border-dashed border-blue-500/40 hover:border-blue-500 rounded-2xl gap-3 cursor-pointer transition-all hover:bg-blue-500/5"
                                    >
                                        <Upload className="w-12 h-12 text-blue-400" />
                                        <p className="text-slate-300 text-sm font-semibold">Click to upload a QR code image</p>
                                        <p className="text-slate-500 text-xs">PNG, JPG, WEBP — screenshot or photo of student's QR</p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                    {uploading && (
                                        <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold">
                                            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                            Reading QR code…
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Last scan result */}
                            {lastScan && (
                                <div className={`mt-4 flex items-center gap-3 p-4 rounded-2xl border ${
                                    lastScan.success
                                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                                }`}>
                                    {lastScan.success
                                        ? <CheckCircle className="w-5 h-5 shrink-0" />
                                        : <XCircle className="w-5 h-5 shrink-0" />
                                    }
                                    <div>
                                        {lastScan.success ? (
                                            <>
                                                <p className="font-bold">{lastScan.studentName}</p>
                                                <p className="text-xs opacity-80">
                                                    {lastScan.alreadyAttended ? 'Already marked present' : 'Attendance recorded'}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="font-bold">{lastScan.message}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Right column: attendance list ────────────── */}
                    <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-6">
                        <h2 className="font-bold text-white flex items-center gap-2 mb-5">
                            <Users className="w-5 h-5 text-blue-400" />
                            Attendance List
                            {attendance && (
                                <span className="ml-auto text-xs font-normal text-slate-400">
                                    {attendance.records?.length || 0} QR generated
                                </span>
                            )}
                        </h2>

                        {!attendance?.records?.length ? (
                            <div className="text-center py-12 text-slate-500">
                                <UserCheck className="w-10 h-10 mx-auto mb-3 opacity-40" />
                                <p className="text-sm">No students have generated QR codes yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                                {attendance.records.map((rec) => (
                                    <div
                                        key={rec.id}
                                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                            rec.attended
                                                ? 'bg-green-500/5 border-green-500/20'
                                                : 'bg-slate-900/40 border-slate-700/50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black ${
                                                rec.attended ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'
                                            }`}>
                                                {rec.studentName?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold text-sm">{rec.studentName}</p>
                                                <p className="text-slate-500 text-xs">{rec.studentEmail}</p>
                                            </div>
                                        </div>
                                        {rec.attended ? (
                                            <div className="flex flex-col items-end gap-0.5">
                                                <span className="text-green-400 font-bold text-xs flex items-center gap-1">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Present
                                                </span>
                                                {rec.scannedAt && (
                                                    <span className="text-slate-500 text-[10px]">
                                                        {new Date(rec.scannedAt).toLocaleTimeString()}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-slate-500 font-bold text-xs">Absent</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
