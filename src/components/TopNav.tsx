import React from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { QrCode, Smartphone, Sparkles, User, ExternalLink, LogOut } from 'lucide-react';

interface TopNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  setCurrentTab,
  darkMode,
  setDarkMode,
}) => {
  const {
    activeSession,
    setIsScannerSimulatorOpen,
    courses,
    activeCourseId,
    setActiveCourseId,
    currentTeacher,
    logout,
  } = useAttendance();

  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];

  const navLinks = [
    { id: 'session', label: 'Live Session' },
    { id: 'reports', label: 'Attendance Reports' },
    { id: 'flutter', label: 'Flutter & Firebase' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark with subtle live status */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('session')}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-sm tracking-tight">
                P
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-display whitespace-nowrap">
                  PresencePulse
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-400 dark:text-slate-500 font-mono">
                  Teacher Hub
                </span>
              </div>
            </button>

            {currentTeacher && activeSession && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 tabular-nums">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Session Active · {activeSession.presentCount} Present
              </span>
            )}
          </div>

          {/* Zone 2: Navigation Links (only when authenticated) */}
          {currentTeacher && (
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map(link => {
                const isActive = currentTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setCurrentTab(link.id)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Zone 3: Primary Action & Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Course Selector */}
            <div className="hidden sm:block">
              <select
                aria-label="Active Course Selector"
                value={activeCourseId}
                onChange={e => setActiveCourseId(e.target.value)}
                className="text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.code} ({course.section})
                  </option>
                ))}
              </select>
            </div>

            {/* Test Student Scanner Simulator Button */}
            <button
              onClick={() => setIsScannerSimulatorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-800 transition-colors whitespace-nowrap"
              title="Test the student mobile scanning experience"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Student Scanner</span>
              <span className="sm:hidden">Scan Test</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {darkMode ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Teacher Profile Avatar & Sign Out */}
            {currentTeacher ? (
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                  {currentTeacher.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div className="hidden xl:block text-left text-xs">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 leading-none truncate max-w-28">
                    {currentTeacher.name}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none mt-1 truncate max-w-28">
                    {currentTeacher.email}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Sign Out of Teacher Portal"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Mobile Navigation bar for narrow screens */}
        {currentTeacher && (
          <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 dark:border-slate-800">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => setCurrentTab(link.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                  currentTab === link.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
