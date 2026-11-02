import React, { useState, useMemo } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { DateRangeFilter } from '../types/attendance';
import { Download, Calendar, Users, Eye, CheckCircle2, XCircle } from 'lucide-react';

export const AttendanceReportsView: React.FC = () => {
  const { courses, getDailySummaries, exportAttendanceCsv, records, sessions } = useAttendance();

  // Simplified Date Range: only 'today' and '7d' (as requested)
  const [preset, setPreset] = useState<'today' | '7d'>('7d');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [inspectSessionId, setInspectSessionId] = useState<string | null>(null);

  // Calculate start and end date based on preset
  const { startDate, endDate } = useMemo(() => {
    const today = new Date();
    const endStr = today.toISOString().split('T')[0];

    if (preset === 'today') {
      return { startDate: endStr, endDate: endStr };
    } else {
      // 7 days
      const d = new Date();
      d.setDate(today.getDate() - 7);
      return { startDate: d.toISOString().split('T')[0], endDate: endStr };
    }
  }, [preset]);

  const currentFilter: DateRangeFilter = useMemo(() => {
    return {
      preset,
      startDate,
      endDate,
      courseId: courseFilter,
    };
  }, [preset, startDate, endDate, courseFilter]);

  // Summaries matching the filter
  const summaries = useMemo(() => {
    return getDailySummaries(currentFilter);
  }, [getDailySummaries, currentFilter]);

  // Aggregate metrics
  const totals = useMemo(() => {
    let present = 0;
    let absent = 0;
    let enrolled = 0;

    summaries.forEach(s => {
      present += s.presentCount;
      absent += s.absentCount;
      enrolled += s.totalEnrolled;
    });

    const rate = enrolled > 0 ? Math.round((present / enrolled) * 100) : 0;
    return { present, absent, rate, sessionsCount: summaries.length };
  }, [summaries]);

  // Records for day inspection
  const inspectRecords = useMemo(() => {
    if (!inspectSessionId) return [];
    return records.filter(r => r.sessionId === inspectSessionId);
  }, [inspectSessionId, records]);

  const inspectSession = useMemo(() => {
    if (!inspectSessionId) return null;
    return sessions.find(s => s.id === inspectSessionId) || null;
  }, [inspectSessionId, sessions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
            Attendance Summaries
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Daily report of student presence and absence across lectures.
          </p>
        </div>

        <button
          onClick={() => exportAttendanceCsv(currentFilter)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors self-start sm:self-auto whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Filter Bar (Only Today and Last 7 Days, Course Filter) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Date Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setPreset('today')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
              preset === 'today'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setPreset('7d')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
              preset === '7d'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Last 7 Days
          </button>
        </div>

        {/* Course Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Filter Course:</span>
          <select
            aria-label="Filter by course"
            value={courseFilter}
            onChange={e => setCourseFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.code} ({course.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clean Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Lectures Held</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-1 tabular-nums">
            {totals.sessionsCount}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {preset === 'today' ? 'Today' : 'Past 7 days'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Present Students</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1 tabular-nums">
            {totals.present}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Total checked in</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Absent Students</p>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 font-mono mt-1 tabular-nums">
            {totals.absent}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Missed attendance</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Attendance Rate</p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-mono mt-1 tabular-nums">
            {totals.rate}%
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Average for period</p>
        </div>
      </div>

      {/* Daily Attendance Summary List (Clean Table without excess clutter) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white font-display">
            Daily Attendance Records ({summaries.length} {summaries.length === 1 ? 'Day' : 'Days'})
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {startDate} to {endDate}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Course & Topic</th>
                <th className="py-3 px-4 text-center">Enrolled</th>
                <th className="py-3 px-4 text-center text-emerald-700 dark:text-emerald-400">Present</th>
                <th className="py-3 px-4 text-center text-rose-700 dark:text-rose-400">Absent</th>
                <th className="py-3 px-4">Attendance Rate</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {summaries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No attendance sessions found for this period.
                  </td>
                </tr>
              ) : (
                summaries.map(day => (
                  <tr
                    key={day.sessionId}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900 dark:text-white tabular-nums whitespace-nowrap">
                      {new Date(day.date + 'T00:00:00').toLocaleDateString([], {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    {/* Topic */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {day.topic}
                      </p>
                      <p className="text-[10px] text-slate-400">{day.courseName}</p>
                    </td>

                    {/* Total Enrolled */}
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      {day.totalEnrolled}
                    </td>

                    {/* Present */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded text-xs tabular-nums">
                        {day.presentCount}
                      </span>
                    </td>

                    {/* Absent */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded text-xs tabular-nums">
                        {day.absentCount}
                      </span>
                    </td>

                    {/* Attendance Rate */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 tabular-nums w-8">
                          {day.attendanceRate}%
                        </span>
                        <div className="w-16 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              day.attendanceRate >= 80 ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${day.attendanceRate}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Inspect Day Roster */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setInspectSessionId(day.sessionId)}
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Roster</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Day Attendance Inspection Modal */}
      {inspectSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
                  {inspectSession.date} · Class Roster
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {inspectSession.topic}
                </h3>
              </div>
              <button
                onClick={() => setInspectSessionId(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold p-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Quick summary for this day */}
            <div className="grid grid-cols-2 gap-2 my-3 text-center">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg">
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">Present</p>
                <p className="text-lg font-bold text-emerald-800 dark:text-emerald-200 font-mono">
                  {inspectRecords.filter(r => r.status === 'present').length}
                </p>
              </div>
              <div className="bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg">
                <p className="text-[10px] text-rose-700 dark:text-rose-400 font-medium">Absent</p>
                <p className="text-lg font-bold text-rose-800 dark:text-rose-200 font-mono">
                  {Math.max(0, 24 - inspectRecords.length)}
                </p>
              </div>
            </div>

            {/* Student check-in list */}
            <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800 pr-1">
              {inspectRecords.map(rec => (
                <div key={rec.id} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{rec.studentName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{rec.studentRollNumber}</p>
                  </div>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded text-[11px]">
                    PRESENT
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3 flex justify-end">
              <button
                onClick={() => setInspectSessionId(null)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
