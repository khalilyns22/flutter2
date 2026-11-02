export type AttendanceStatus = 'present' | 'late' | 'absent' | 'excused';

export type VerificationMethod = 'qr_scan' | 'manual' | 'pin';

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  avatarUrl?: string;
  assignedCourseIds: string[];
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  avatarUrl?: string;
  courseId: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  section: string;
  teacherId: string;
  schedule: string;
  room: string;
  totalEnrolled: number;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  courseId: string;
  studentId: string;
  studentName: string;
  studentRollNumber: string;
  status: AttendanceStatus;
  timestamp: string; // ISO String
  verificationMethod: VerificationMethod;
  notes?: string;
}

export interface AttendanceSession {
  id: string;
  courseId: string;
  teacherId: string;
  date: string; // YYYY-MM-DD
  topic: string;
  startTime: string; // ISO
  endTime?: string;
  status: 'active' | 'closed';
  currentQrToken: string;
  tokenExpiresAt: number; // Unix timestamp ms
  sessionPin: string;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  excusedCount: number;
}

export interface DailyReportSummary {
  date: string; // YYYY-MM-DD
  courseId: string;
  courseName: string;
  totalEnrolled: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  excusedCount: number;
  attendanceRate: number; // 0 - 100 percentage
  sessionId: string;
  topic: string;
}

export interface StudentAttendanceMetric {
  studentId: string;
  studentName: string;
  rollNumber: string;
  courseId: string;
  totalSessions: number;
  present: number;
  late: number;
  absent: number;
  excused: number;
  attendanceRate: number;
}

export interface DateRangeFilter {
  preset: 'today' | '7d';
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  courseId: string; // 'all' or specific id
}
