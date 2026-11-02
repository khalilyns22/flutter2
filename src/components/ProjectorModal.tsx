import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAttendance } from '../context/AttendanceContext';
import { X, RotateCw, Users, ShieldCheck, Sparkles, Smartphone } from 'lucide-react';

export const ProjectorModal: React.FC = () => {
  const {
    isProjectorOpen,
    setIsProjectorOpen,
    activeSession,
    courses,
    activeCourseId,
    tokenSecondsLeft,
    qrPayload,
    records,
    setIsScannerSimulatorOpen,
    closeActiveSession,
  } = useAttendance();

  if (!isProjectorOpen || !activeSession) return null;

  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];
  const presentCount = records.filter(r => r.sessionId === activeSession.id && (r.status === 'present' || r.status === 'late')).length;
  const attendanceRate = Math.round((presentCount / activeCourse.totalEnrolled) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10 select-none animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
            <span>AUDITORIUM PROJECTION</span>
            <span>·</span>
            <span>{activeCourse.code}</span>
            <span>·</span>
            <span>{activeCourse.room}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-display">
            {activeSession.topic}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick simulator launcher */}
          <button
            onClick={() => setIsScannerSimulatorOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5" />
            Test Student Scanner
          </button>

          {/* End Session Button */}
          <button
            onClick={() => {
              closeActiveSession();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-colors"
          >
            End Attendance
          </button>

          {/* Exit / Minimize Projector button */}
          <button
            onClick={() => setIsProjectorOpen(false)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Minimize to Dashboard"
            aria-label="Minimize Projector View"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Center Stage: Huge QR Code + Live Telemetry */}
      <div className="my-auto flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 py-6">
        {/* Massive QR Frame */}
        <div className="flex flex-col items-center">
          <div className="p-8 bg-white rounded-3xl shadow-2xl relative border-4 border-indigo-500/30">
            <QRCodeSVG
              value={qrPayload || 'presence-pulse'}
              size={320}
              level="H"
              includeMargin={false}
              className="w-64 h-64 sm:w-80 sm:h-80"
            />

            {/* Center Lock Badge */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-white shadow-xl border-3 border-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Dynamic Nonce Timer */}
          <div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-300">
            <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
            <span>Anti-Fraud Dynamic Token · Refreshing in {tokenSecondsLeft}s</span>
          </div>
        </div>

        {/* Instructions & Giant Counter */}
        <div className="max-w-md text-center lg:text-left space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-center lg:justify-start gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Attendance Active
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-display">
              Scan to Register
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Open your Student Attendance App and point your camera at the screen. Your attendance record updates the classroom database immediately.
            </p>
          </div>

          {/* Backup Room PIN Card */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-xs text-slate-400 font-medium">Camera or Phone Issue? Enter PIN:</p>
            <p className="text-4xl font-extrabold font-mono tracking-widest text-indigo-400 mt-1">
              {activeSession.sessionPin}
            </p>
          </div>

          {/* Live Checked In Counter */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                Checked In Students
              </span>
              <span className="text-sm font-mono font-bold text-emerald-400">
                {attendanceRate}%
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-extrabold font-mono text-white tabular-nums">
                {presentCount}
              </span>
              <span className="text-xl text-slate-400 font-medium font-mono">
                / {activeCourse.totalEnrolled} enrolled
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${attendanceRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ticker */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-4">
        <span>PresencePulse Attendance Hub · Real-time Firestore Sync</span>
        <span className="mt-2 sm:mt-0 font-mono">
          Session ID: {activeSession.id}
        </span>
      </div>
    </div>
  );
};
