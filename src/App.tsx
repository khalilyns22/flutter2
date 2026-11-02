import React, { useState, useEffect } from 'react';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import { TopNav } from './components/TopNav';
import { LiveSessionView } from './components/LiveSessionView';
import { AttendanceReportsView } from './components/AttendanceReportsView';
import { FlutterIntegrationGuide } from './components/FlutterIntegrationGuide';
import { ProjectorModal } from './components/ProjectorModal';
import { StudentScannerModal } from './components/StudentScannerModal';
import { TeacherAuthView } from './components/TeacherAuthView';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<string>('session');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const { setActiveCourseId, currentTeacher } = useAttendance();

  // Sync dark class to html documentElement
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Bar following Top Bar Contract */}
      <TopNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!currentTeacher ? (
          <TeacherAuthView />
        ) : (
          <>
            {currentTab === 'session' && (
              <LiveSessionView
                onGoToReports={() => setCurrentTab('reports')}
              />
            )}

            {currentTab === 'reports' && <AttendanceReportsView />}

            {currentTab === 'flutter' && <FlutterIntegrationGuide />}
          </>
        )}
      </main>

      {/* Classroom Modals */}
      <ProjectorModal />
      <StudentScannerModal />

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-4 text-center text-xs text-slate-400 dark:text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 PresencePulse · Teacher Attendance Engine with Firebase Real-time Firestore</p>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setCurrentTab('flutter')} className="hover:underline">
              Flutter / Dart Documentation
            </button>
            <span>·</span>
            <button onClick={() => setCurrentTab('reports')} className="hover:underline">
              Attendance Summaries
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AttendanceProvider>
      <MainApp />
    </AttendanceProvider>
  );
}
