import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAttendance } from '../context/AttendanceContext';
import {
  Maximize2,
  Lock,
  Play,
  RotateCw,
  Smartphone,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface LiveSessionViewProps {
  onGoToReports: () => void;
}

export const LiveSessionView: React.FC<LiveSessionViewProps> = ({ onGoToReports }) => {
  const {
    courses,
    activeCourseId,
    setActiveCourseId,
    activeSession,
    sessions,
    tokenSecondsLeft,
    qrPayload,
    setIsProjectorOpen,
    setIsScannerSimulatorOpen,
    startNewSession,
    closeActiveSession,
    records,
  } = useAttendance();

  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];

  // Recent check-ins for the active session
  const recentCheckIns = activeSession
    ? records.filter(r => r.sessionId === activeSession.id).slice(0, 5)
    : [];

  const handleStartSession = () => {
    startNewSession(activeCourseId, `${activeCourse.code} Lecture`);
    // Automatically open projector presentation mode immediately when launched!
    setIsProjectorOpen(true);
  };

  const attendancePercent = activeSession && activeCourse.totalEnrolled > 0
    ? Math.round((activeSession.presentCount / activeCourse.totalEnrolled) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Administrator-Granted Classes Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Assigned Teaching Classes</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose from the classes granted to you by the system administrator:
            </p>
          </div>

          <span className="text-[11px] text-slate-400 font-mono self-start sm:self-auto bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            Teacher ID: teacher-david
          </span>
        </div>

        {/* Granted Classes Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {courses.map(course => {
            const isSelected = course.id === activeCourseId;
            const hasActiveSession = sessions.some(s => s.courseId === course.id && s.status === 'active');

            return (
              <button
                key={course.id}
                onClick={() => {
                  setActiveCourseId(course.id);
                }}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                  }`}>
                    {course.code}
                  </span>

                  {hasActiveSession ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live QR
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">
                      Standby
                    </span>
                  )}
                </div>

                <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-2 font-display truncate">
                  {course.name}
                </p>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                  <span>Sec {course.section} · {course.room}</span>
                  <span className="font-mono">{course.totalEnrolled} students</span>
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Course Context Header & Session Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>{activeCourse.schedule}</span>
            <span>·</span>
            <span>{activeCourse.room}</span>
            <span>·</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Granted Class</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1 font-display">
            {activeCourse.name} ({activeCourse.code})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Section {activeCourse.section} · {activeCourse.totalEnrolled} Enrolled Students
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {activeSession ? (
            <>
              <button
                onClick={() => setIsProjectorOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors whitespace-nowrap"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Projector Mode
              </button>
              <button
                onClick={closeActiveSession}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 transition-colors whitespace-nowrap"
              >
                <Lock className="w-3.5 h-3.5" />
                Close Session
              </button>
            </>
          ) : (
            <button
              onClick={handleStartSession}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Start Session
            </button>
          )}
        </div>
      </div>

      {/* Main Classroom Attendance Display */}
      {activeSession ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Dynamic QR Code Presentation Card */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden shadow-xs">
            {/* Live indicator & Rotating status */}
            <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-900 dark:text-white">Live Attendance QR</span>
                <span>·</span>
                <span className="text-slate-500 dark:text-slate-400">Classroom Projection</span>
              </div>

              {/* Dynamic Token countdown chip */}
              <div className="flex items-center gap-1.5 text-xs font-mono text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-200/60 dark:border-indigo-800/60 tabular-nums">
                <RotateCw className="w-3 h-3 animate-spin text-indigo-500" style={{ animationDuration: '4s' }} />
                <span>Refreshes in {tokenSecondsLeft}s</span>
              </div>
            </div>

            {/* Topic & Instructions */}
            <div className="mb-5 max-w-md">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                {activeSession.topic}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Point your mobile camera or open the Student App to scan the code below.
              </p>
            </div>

            {/* QR Code Canvas with high-contrast frame */}
            <div className="relative p-5 bg-white rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center">
              <QRCodeSVG
                value={qrPayload || 'presence-pulse-active'}
                size={240}
                level="H"
                includeMargin={false}
                className="w-48 h-48 sm:w-56 sm:h-56"
              />

              {/* Center Security Logo Badge */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-white shadow-md border-2 border-indigo-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
            </div>

            {/* Session Verification PIN Fallback */}
            <div className="mt-5 flex flex-col items-center">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">
                Camera Issue Fallback Code
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-2xl font-bold font-mono tracking-widest text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 tabular-nums">
                  {activeSession.sessionPin}
                </span>
              </div>
            </div>

            {/* Anti-fraud reassurance */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>Cryptographic dynamic token rotates every 15s to block shared screenshot fraud.</span>
            </div>
          </div>

          {/* Right Column: Live Roster & Metric Gauges */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Live Progress Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Check-in Attendance Rate
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums font-mono">
                  {attendancePercent}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-500 transition-all duration-500"
                  style={{ width: `${(activeSession.presentCount / activeCourse.totalEnrolled) * 100}%` }}
                  title={`${activeSession.presentCount} Present`}
                />
                <div
                  className="bg-amber-500 transition-all duration-500"
                  style={{ width: `${(activeSession.lateCount / activeCourse.totalEnrolled) * 100}%` }}
                  title={`${activeSession.lateCount} Late`}
                />
              </div>

              {/* Numeric summary stats */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                <div className="p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Present</p>
                  <p className="text-lg font-bold text-emerald-800 dark:text-emerald-200 tabular-nums font-mono">
                    {activeSession.presentCount}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">Late</p>
                  <p className="text-lg font-bold text-amber-800 dark:text-amber-200 tabular-nums font-mono">
                    {activeSession.lateCount}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
                  <p className="text-xs text-rose-700 dark:text-rose-400 font-medium">Absent</p>
                  <p className="text-lg font-bold text-rose-800 dark:text-rose-200 tabular-nums font-mono">
                    {activeSession.absentCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Live Check-in Stream */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Live Check-in Stream
                  </h3>
                </div>
                <button
                  onClick={() => setIsProjectorOpen(true)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                >
                  Projector View <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {recentCheckIns.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 dark:text-slate-500 text-xs">
                  <Smartphone className="w-8 h-8 stroke-[1.5] mb-2 text-slate-300 dark:text-slate-600" />
                  <p>Waiting for students to scan the QR code...</p>
                  <button
                    onClick={() => setIsScannerSimulatorOpen(true)}
                    className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    Test with Student Scanner Simulator
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto max-h-64">
                  {recentCheckIns.map(record => (
                    <div
                      key={record.id}
                      className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-[10px] font-bold">
                          {record.studentName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {record.studentName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {record.studentRollNumber}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1 font-medium ${
                          record.status === 'present'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}>
                          <CheckCircle2 className="w-3 h-3" />
                          {record.status === 'present' ? 'Present' : 'Late'}
                        </span>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => setIsScannerSimulatorOpen(true)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium inline-flex items-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  Test Student Mobile Scan
                </button>
                <button
                  onClick={onGoToReports}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  View Attendance Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Zero State when no session is active for the selected class */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center max-w-xl mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Play className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
            Start Attendance for {activeCourse.code}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            {activeCourse.name} · Section {activeCourse.section} · {activeCourse.totalEnrolled} Registered Students
          </p>

          <div className="mt-5 max-w-xs mx-auto">
            <button
              onClick={handleStartSession}
              className="w-full py-2.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Launch Active QR Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
