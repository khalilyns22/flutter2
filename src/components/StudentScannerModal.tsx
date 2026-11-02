import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import {
  Smartphone,
  Camera,
  CheckCircle2,
  X,
  Scan,
  Sparkles,
  AlertCircle,
  KeyRound,
  RotateCcw,
} from 'lucide-react';

export const StudentScannerModal: React.FC = () => {
  const {
    isScannerSimulatorOpen,
    setIsScannerSimulatorOpen,
    activeSession,
    students,
    activeCourseId,
    markStudentAttendance,
    tokenSecondsLeft,
  } = useAttendance();

  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [usePinMode, setUsePinMode] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isScannerSimulatorOpen) return null;

  const courseStudents = students.filter(s => s.courseId === activeCourseId);
  const activeStudent = courseStudents.find(s => s.id === selectedStudentId) || courseStudents[0];

  const handleSimulateScan = () => {
    if (!activeSession) {
      setScanResult({ success: false, message: 'No active session is currently running on the board.' });
      return;
    }

    const studentToMark = activeStudent || courseStudents[0];
    if (!studentToMark) {
      setScanResult({ success: false, message: 'Please select a student first.' });
      return;
    }

    setIsScanning(true);
    setScanResult(null);

    // Simulate mobile camera scanning delay
    setTimeout(() => {
      setIsScanning(false);
      const res = markStudentAttendance(
        studentToMark.id,
        'present',
        usePinMode ? 'pin' : 'qr_scan'
      );
      setScanResult(res);
    }, 600);
  };

  const handleSimulateLateScan = () => {
    if (!activeSession) return;
    const studentToMark = activeStudent || courseStudents[0];
    if (!studentToMark) return;

    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const res = markStudentAttendance(studentToMark.id, 'late', 'qr_scan');
      setScanResult(res);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-slate-950 text-white border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsScannerSimulatorOpen(false);
            setScanResult(null);
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
          aria-label="Close Scanner"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mobile Device Mockup Header */}
        <div className="text-center mb-4">
          <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mb-3" />
          <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">
            Flutter Companion Simulator
          </span>
          <h3 className="text-base font-bold text-white mt-0.5">
            Student Attendance App
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Test how students scan the teacher&apos;s dynamic QR code.
          </p>
        </div>

        {/* Student Selector */}
        <div className="mb-4 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <label className="block text-[11px] text-slate-400 mb-1 font-medium">
            Simulate Student Profile:
          </label>
          <select
            value={selectedStudentId || activeStudent?.id || ''}
            onChange={e => {
              setSelectedStudentId(e.target.value);
              setScanResult(null);
            }}
            className="w-full text-xs bg-slate-800 border border-slate-700 text-white rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
          >
            {courseStudents.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.rollNumber})
              </option>
            ))}
          </select>
        </div>

        {/* Simulated Camera Viewfinder */}
        <div className="relative aspect-4/3 bg-slate-900 rounded-2xl border-2 border-indigo-500/40 overflow-hidden flex flex-col items-center justify-center p-4">
          {/* Viewfinder Target Reticle */}
          <div className="absolute inset-4 border border-dashed border-indigo-400/30 rounded-xl pointer-events-none" />

          {/* Corner Guides */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-indigo-500" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-indigo-500" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-indigo-500" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-indigo-500" />

          {/* Scanning Animation Laser Line */}
          {isScanning && (
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_8px_#818cf8] animate-bounce" />
          )}

          <Camera className={`w-8 h-8 ${isScanning ? 'text-indigo-400 animate-pulse' : 'text-slate-600'} mb-2`} />

          {activeSession ? (
            <div className="text-center z-10">
              <span className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Session Found
              </span>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                {activeSession.topic}
              </p>
              <p className="text-[10px] text-indigo-300 font-mono mt-1">
                Active Nonce Token: {tokenSecondsLeft}s left
              </p>
            </div>
          ) : (
            <div className="text-center text-xs text-rose-400 font-medium">
              No active session currently started.
            </div>
          )}
        </div>

        {/* Scan Status Toast Result */}
        {scanResult && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2.5 animate-in slide-in-from-top-2 duration-200 ${
              scanResult.success
                ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-200'
                : 'bg-rose-950/80 border border-rose-800 text-rose-200'
            }`}
          >
            {scanResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <div>
              <p className="font-bold">{scanResult.success ? 'Attendance Recorded!' : 'Check-in Error'}</p>
              <p className="text-[11px] opacity-90">{scanResult.message}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-5 space-y-2">
          <button
            onClick={handleSimulateScan}
            disabled={isScanning || !activeSession}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Scan className="w-4 h-4" />
            {isScanning ? 'Verifying QR Nonce...' : 'Scan Dynamic QR Code'}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleSimulateLateScan}
              disabled={isScanning || !activeSession}
              className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-900/60 text-[11px] font-semibold flex items-center justify-center gap-1.5"
            >
              Simulate Late Scan
            </button>
            <button
              onClick={() => {
                const randomStudent = courseStudents[Math.floor(Math.random() * courseStudents.length)];
                if (randomStudent) setSelectedStudentId(randomStudent.id);
              }}
              className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] font-semibold flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              Random Student
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-900 text-center text-[10px] text-slate-500">
          Syncs instantaneously with Firebase Firestore and the Teacher Dashboard.
        </div>
      </div>
    </div>
  );
};
