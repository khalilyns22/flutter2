import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Course,
  Student,
  AttendanceSession,
  AttendanceRecord,
  DailyReportSummary,
  StudentAttendanceMetric,
  DateRangeFilter,
  AttendanceStatus,
  VerificationMethod,
  TeacherProfile,
} from '../types/attendance';
import { INITIAL_COURSES, INITIAL_STUDENTS, generateHistoricalData } from '../data/mockData';

interface AttendanceContextType {
  currentTeacher: TeacherProfile | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  courses: Course[];
  students: Student[];
  sessions: AttendanceSession[];
  records: AttendanceRecord[];
  activeCourseId: string;
  setActiveCourseId: (id: string) => void;
  activeSession: AttendanceSession | null;
  tokenSecondsLeft: number;
  qrPayload: string;
  isProjectorOpen: boolean;
  setIsProjectorOpen: (open: boolean) => void;
  isScannerSimulatorOpen: boolean;
  setIsScannerSimulatorOpen: (open: boolean) => void;
  
  // Actions
  startNewSession: (courseId: string, topic: string) => AttendanceSession;
  closeActiveSession: () => void;
  markStudentAttendance: (
    studentId: string,
    status: AttendanceStatus,
    method?: VerificationMethod,
    notes?: string
  ) => { success: boolean; message: string; record?: AttendanceRecord };
  overrideStatus: (recordId: string, newStatus: AttendanceStatus) => void;
  getDailySummaries: (filter: DateRangeFilter) => DailyReportSummary[];
  getStudentMetrics: (courseId: string, startDate?: string, endDate?: string) => StudentAttendanceMetric[];
  exportAttendanceCsv: (filter: DateRangeFilter) => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTeacher, setCurrentTeacher] = useState<TeacherProfile | null>(() => {
    try {
      const stored = localStorage.getItem('presencepulse_teacher');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return null; // Starts unauthenticated so teacher logs in!
  });

  const login = useCallback(async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      return { success: false, error: 'Please enter both faculty email and password.' };
    }
    if (password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const rawName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
    const displayName = rawName.replace(/\b\w/g, c => c.toUpperCase());

    const teacher: TeacherProfile = {
      id: `teacher-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      name: displayName.startsWith('Prof') ? displayName : `Prof. ${displayName}`,
      email: cleanEmail,
      department: 'Faculty of Computer Science',
      assignedCourseIds: ['course-cs204', 'course-cs330', 'course-cs101'],
    };

    setCurrentTeacher(teacher);
    localStorage.setItem('presencepulse_teacher', JSON.stringify(teacher));
    return { success: true };
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const teacher: TeacherProfile = {
      id: 'teacher-khalil',
      name: 'Prof. Khalil Yns',
      email: 'khalilyns2@gmail.com',
      department: 'Software Architecture Department',
      assignedCourseIds: ['course-cs204', 'course-cs330', 'course-cs101'],
    };

    setCurrentTeacher(teacher);
    localStorage.setItem('presencepulse_teacher', JSON.stringify(teacher));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setCurrentTeacher(null);
    localStorage.removeItem('presencepulse_teacher');
  }, []);

  const [courses] = useState<Course[]>(INITIAL_COURSES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  
  // Initialize with rich 30-day historical data
  const [data] = useState(() => generateHistoricalData());
  const [sessions, setSessions] = useState<AttendanceSession[]>(data.sessions);
  const [records, setRecords] = useState<AttendanceRecord[]>(data.records);

  const [activeCourseId, setActiveCourseId] = useState<string>('course-cs204');
  const [isProjectorOpen, setIsProjectorOpen] = useState<boolean>(false);
  const [isScannerSimulatorOpen, setIsScannerSimulatorOpen] = useState<boolean>(false);

  // Active session lookup
  const activeSession = useMemo(() => {
    return sessions.find(s => s.status === 'active' && s.courseId === activeCourseId) || 
           sessions.find(s => s.status === 'active') || null;
  }, [sessions, activeCourseId]);

  // Dynamic QR Code rotating timer (15s rotation)
  const [tokenSecondsLeft, setTokenSecondsLeft] = useState<number>(15);
  const [rotatingNonce, setRotatingNonce] = useState<string>(() => Math.random().toString(36).substring(2, 9));

  useEffect(() => {
    if (!activeSession) return;

    const interval = setInterval(() => {
      setTokenSecondsLeft((prev) => {
        if (prev <= 1) {
          // Generate new token rotation
          const newNonce = Math.random().toString(36).substring(2, 9).toUpperCase();
          setRotatingNonce(newNonce);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession]);

  // Construct structured QR code payload string
  const qrPayload = useMemo(() => {
    if (!activeSession) return '';
    return JSON.stringify({
      app: 'PresencePulse',
      sessionId: activeSession.id,
      courseId: activeSession.courseId,
      token: `${activeSession.id}-${rotatingNonce}`,
      sessionPin: activeSession.sessionPin,
      expiresIn: tokenSecondsLeft,
      timestamp: Date.now(),
    });
  }, [activeSession, rotatingNonce, tokenSecondsLeft]);

  // Start a new lecture session
  const startNewSession = useCallback((courseId: string, topic: string) => {
    const course = courses.find(c => c.id === courseId);
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const newSessionId = `session-${Date.now()}`;
    const newPin = String(Math.floor(1000 + Math.random() * 9000));

    // Close any previous active session for this course
    setSessions(prev => prev.map(s => s.courseId === courseId && s.status === 'active' ? { ...s, status: 'closed' } : s));

    const newSession: AttendanceSession = {
      id: newSessionId,
      courseId,
      teacherId: 'teacher-david',
      date: dateStr,
      topic: topic || `${course?.name || 'Lecture'} Attendance`,
      startTime: today.toISOString(),
      status: 'active',
      currentQrToken: `PP-LIVE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      tokenExpiresAt: Date.now() + 15000,
      sessionPin: newPin,
      presentCount: 0,
      lateCount: 0,
      absentCount: course?.totalEnrolled || 0,
      excusedCount: 0,
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveCourseId(courseId);
    setTokenSecondsLeft(15);
    return newSession;
  }, [courses]);

  // Close the active session
  const closeActiveSession = useCallback(() => {
    if (!activeSession) return;
    setSessions(prev =>
      prev.map(s =>
        s.id === activeSession.id
          ? { ...s, status: 'closed', endTime: new Date().toISOString() }
          : s
      )
    );
    setIsProjectorOpen(false);
  }, [activeSession]);

  // Mark student attendance (called by student scanner simulator or teacher manual action)
  const markStudentAttendance = useCallback(
    (
      studentId: string,
      status: AttendanceStatus = 'present',
      method: VerificationMethod = 'qr_scan',
      notes?: string
    ) => {
      if (!activeSession) {
        return { success: false, message: 'No active session found.' };
      }

      const student = students.find(s => s.id === studentId);
      if (!student) {
        return { success: false, message: 'Student ID not recognized in database.' };
      }

      // Check if already checked in
      const existing = records.find(
        r => r.sessionId === activeSession.id && r.studentId === studentId
      );

      if (existing) {
        // Update existing record
        setRecords(prev =>
          prev.map(r =>
            r.id === existing.id
              ? { ...r, status, verificationMethod: method, notes: notes || r.notes }
              : r
          )
        );
        return {
          success: true,
          message: `${student.name} status updated to ${status}.`,
          record: { ...existing, status },
        };
      }

      // Create new attendance record
      const newRecord: AttendanceRecord = {
        id: `rec-${activeSession.id}-${student.id}`,
        sessionId: activeSession.id,
        courseId: activeSession.courseId,
        studentId: student.id,
        studentName: student.name,
        studentRollNumber: student.rollNumber,
        status,
        timestamp: new Date().toISOString(),
        verificationMethod: method,
        notes,
      };

      setRecords(prev => [newRecord, ...prev]);

      // Update session statistics
      setSessions(prev =>
        prev.map(s => {
          if (s.id !== activeSession.id) return s;
          const course = courses.find(c => c.id === s.courseId);
          const total = course?.totalEnrolled || 24;
          const p = status === 'present' ? s.presentCount + 1 : s.presentCount;
          const l = status === 'late' ? s.lateCount + 1 : s.lateCount;
          const e = status === 'excused' ? s.excusedCount + 1 : s.excusedCount;
          const ab = Math.max(0, total - (p + l + e));
          return {
            ...s,
            presentCount: p,
            lateCount: l,
            excusedCount: e,
            absentCount: ab,
          };
        })
      );

      return {
        success: true,
        message: `${student.name} marked as ${status} successfully.`,
        record: newRecord,
      };
    },
    [activeSession, students, records, courses]
  );

  // Manual status override
  const overrideStatus = useCallback((recordId: string, newStatus: AttendanceStatus) => {
    setRecords(prev =>
      prev.map(r => (r.id === recordId ? { ...r, status: newStatus } : r))
    );
  }, []);

  // Compute daily summaries filterable by date range and course
  const getDailySummaries = useCallback(
    (filter: DateRangeFilter): DailyReportSummary[] => {
      const { startDate, endDate, courseId } = filter;

      // Filter sessions within date range and course
      const matchingSessions = sessions.filter(session => {
        if (courseId !== 'all' && session.courseId !== courseId) return false;
        if (startDate && session.date < startDate) return false;
        if (endDate && session.date > endDate) return false;
        return true;
      });

      // Sort chronological descending (newest first)
      matchingSessions.sort((a, b) => b.date.localeCompare(a.date));

      return matchingSessions.map(session => {
        const course = courses.find(c => c.id === session.courseId);
        const courseName = course ? `${course.code} – ${course.name}` : session.courseId;
        const totalEnrolled = course?.totalEnrolled || 24;

        // Count exact records for this session
        const sessionRecords = records.filter(r => r.sessionId === session.id);
        const presentCount = sessionRecords.filter(r => r.status === 'present').length;
        const lateCount = sessionRecords.filter(r => r.status === 'late').length;
        const excusedCount = sessionRecords.filter(r => r.status === 'excused').length;
        const registered = presentCount + lateCount + excusedCount;
        const absentCount = Math.max(0, totalEnrolled - registered);

        const attended = presentCount + lateCount;
        const attendanceRate = totalEnrolled > 0 ? Math.round((attended / totalEnrolled) * 100) : 0;

        return {
          date: session.date,
          courseId: session.courseId,
          courseName,
          totalEnrolled,
          presentCount,
          lateCount,
          absentCount,
          excusedCount,
          attendanceRate,
          sessionId: session.id,
          topic: session.topic,
        };
      });
    },
    [sessions, records, courses]
  );

  // Compute student-level attendance statistics
  const getStudentMetrics = useCallback(
    (courseId: string, startDate?: string, endDate?: string): StudentAttendanceMetric[] => {
      const courseStudents = students.filter(s => s.courseId === courseId);
      const courseSessions = sessions.filter(s => {
        if (s.courseId !== courseId) return false;
        if (startDate && s.date < startDate) return false;
        if (endDate && s.date > endDate) return false;
        return true;
      });

      const totalSessions = courseSessions.length;
      if (totalSessions === 0) {
        return courseStudents.map(s => ({
          studentId: s.id,
          studentName: s.name,
          rollNumber: s.rollNumber,
          courseId,
          totalSessions: 0,
          present: 0,
          late: 0,
          absent: 0,
          excused: 0,
          attendanceRate: 100,
        }));
      }

      const sessionIds = new Set(courseSessions.map(s => s.id));

      return courseStudents.map(student => {
        const studentRecords = records.filter(
          r => r.studentId === student.id && sessionIds.has(r.sessionId)
        );

        let present = 0;
        let late = 0;
        let absent = 0;
        let excused = 0;

        studentRecords.forEach(r => {
          if (r.status === 'present') present++;
          else if (r.status === 'late') late++;
          else if (r.status === 'absent') absent++;
          else if (r.status === 'excused') excused++;
        });

        // Any session where student has no record is marked absent
        const unaccounted = totalSessions - (present + late + absent + excused);
        if (unaccounted > 0) {
          absent += unaccounted;
        }

        const attended = present + late;
        const rate = Math.round((attended / totalSessions) * 100);

        return {
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber,
          courseId,
          totalSessions,
          present,
          late,
          absent,
          excused,
          attendanceRate: rate,
        };
      });
    },
    [students, sessions, records]
  );

  // Export filtered attendance records as a downloadable CSV
  const exportAttendanceCsv = useCallback(
    (filter: DateRangeFilter) => {
      const summaries = getDailySummaries(filter);
      const sessionIds = new Set(summaries.map(s => s.sessionId));
      const filteredRecords = records.filter(r => sessionIds.has(r.sessionId));

      // Build CSV content
      const headers = ['Date', 'Course', 'Topic', 'Student Name', 'Roll Number', 'Status', 'Verification Method', 'Timestamp'];
      const rows = filteredRecords.map(r => {
        const session = sessions.find(s => s.id === r.sessionId);
        const course = courses.find(c => c.id === r.courseId);
        return [
          session?.date || '',
          `"${course?.code || ''} - ${course?.name || ''}"`,
          `"${session?.topic || ''}"`,
          `"${r.studentName}"`,
          r.studentRollNumber,
          r.status.toUpperCase(),
          r.verificationMethod,
          r.timestamp,
        ].join(',');
      });

      const csvContent = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `attendance_report_${filter.startDate}_to_${filter.endDate}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [getDailySummaries, records, sessions, courses]
  );

  return (
    <AttendanceContext.Provider
      value={{
        currentTeacher,
        login,
        loginWithGoogle,
        logout,
        courses,
        students,
        sessions,
        records,
        activeCourseId,
        setActiveCourseId,
        activeSession,
        tokenSecondsLeft,
        qrPayload,
        isProjectorOpen,
        setIsProjectorOpen,
        isScannerSimulatorOpen,
        setIsScannerSimulatorOpen,
        startNewSession,
        closeActiveSession,
        markStudentAttendance,
        overrideStatus,
        getDailySummaries,
        getStudentMetrics,
        exportAttendanceCsv,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
