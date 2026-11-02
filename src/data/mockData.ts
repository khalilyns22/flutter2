import { Course, Student, AttendanceSession, AttendanceRecord } from '../types/attendance';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-cs204',
    name: 'Algorithms & Data Structures',
    code: 'CS-204',
    section: 'Sec A',
    teacherId: 'teacher-david',
    schedule: 'Mon, Wed, Fri · 09:00 - 10:30 AM',
    room: 'Hall 302',
    totalEnrolled: 24,
  },
  {
    id: 'course-cs330',
    name: 'Mobile & Cloud Architecture',
    code: 'CS-330',
    section: 'Sec B',
    teacherId: 'teacher-david',
    schedule: 'Tue, Thu · 01:00 - 02:30 PM',
    room: 'Lab 108',
    totalEnrolled: 20,
  },
  {
    id: 'course-cs101',
    name: 'Intro to Software Engineering',
    code: 'CS-101',
    section: 'Sec C',
    teacherId: 'teacher-david',
    schedule: 'Mon, Wed · 02:00 - 03:30 PM',
    room: 'Hall 105',
    totalEnrolled: 28,
  },
];

export const INITIAL_STUDENTS: Student[] = [
  { id: 'std-001', name: 'Sophia Chen', rollNumber: 'CS24-001', email: 'sophia.chen@univ.edu', courseId: 'course-cs204' },
  { id: 'std-002', name: 'Liam Martinez', rollNumber: 'CS24-002', email: 'liam.m@univ.edu', courseId: 'course-cs204' },
  { id: 'std-003', name: 'Emma Wilson', rollNumber: 'CS24-003', email: 'e.wilson@univ.edu', courseId: 'course-cs204' },
  { id: 'std-004', name: 'Noah Patel', rollNumber: 'CS24-004', email: 'noah.patel@univ.edu', courseId: 'course-cs204' },
  { id: 'std-005', name: 'Olivia Kim', rollNumber: 'CS24-005', email: 'olivia.kim@univ.edu', courseId: 'course-cs204' },
  { id: 'std-006', name: 'James Anderson', rollNumber: 'CS24-006', email: 'j.anderson@univ.edu', courseId: 'course-cs204' },
  { id: 'std-007', name: 'Ava Thompson', rollNumber: 'CS24-007', email: 'ava.t@univ.edu', courseId: 'course-cs204' },
  { id: 'std-008', name: 'Lucas Rossi', rollNumber: 'CS24-008', email: 'l.rossi@univ.edu', courseId: 'course-cs204' },
  { id: 'std-009', name: 'Mia Tanaka', rollNumber: 'CS24-009', email: 'mia.t@univ.edu', courseId: 'course-cs204' },
  { id: 'std-010', name: 'Ethan Garcia', rollNumber: 'CS24-010', email: 'ethan.g@univ.edu', courseId: 'course-cs204' },
  { id: 'std-011', name: 'Isabella Silva', rollNumber: 'CS24-011', email: 'isabella.s@univ.edu', courseId: 'course-cs204' },
  { id: 'std-012', name: 'Mason Brooks', rollNumber: 'CS24-012', email: 'm.brooks@univ.edu', courseId: 'course-cs204' },
  { id: 'std-013', name: 'Harper Lee', rollNumber: 'CS24-013', email: 'harper.lee@univ.edu', courseId: 'course-cs204' },
  { id: 'std-014', name: 'Oliver Wright', rollNumber: 'CS24-014', email: 'oliver.w@univ.edu', courseId: 'course-cs204' },
  { id: 'std-015', name: 'Amelia Clark', rollNumber: 'CS24-015', email: 'amelia.c@univ.edu', courseId: 'course-cs204' },
  { id: 'std-016', name: 'Benjamin Scott', rollNumber: 'CS24-016', email: 'ben.scott@univ.edu', courseId: 'course-cs204' },
  { id: 'std-017', name: 'Charlotte Evans', rollNumber: 'CS24-017', email: 'charlotte.e@univ.edu', courseId: 'course-cs204' },
  { id: 'std-018', name: 'Daniel Foster', rollNumber: 'CS24-018', email: 'daniel.f@univ.edu', courseId: 'course-cs204' },
  { id: 'std-019', name: 'Evelyn Murphy', rollNumber: 'CS24-019', email: 'evelyn.m@univ.edu', courseId: 'course-cs204' },
  { id: 'std-020', name: 'Alexander Price', rollNumber: 'CS24-020', email: 'alex.p@univ.edu', courseId: 'course-cs204' },
  { id: 'std-021', name: 'Abigail Watson', rollNumber: 'CS24-021', email: 'abigail.w@univ.edu', courseId: 'course-cs204' },
  { id: 'std-022', name: 'Henry Rivera', rollNumber: 'CS24-022', email: 'henry.r@univ.edu', courseId: 'course-cs204' },
  { id: 'std-023', name: 'Emily Bennett', rollNumber: 'CS24-023', email: 'emily.b@univ.edu', courseId: 'course-cs204' },
  { id: 'std-024', name: 'Jackson Wood', rollNumber: 'CS24-024', email: 'jackson.w@univ.edu', courseId: 'course-cs204' },

  // CS-330 students
  { id: 'std-101', name: 'Chloe Dubois', rollNumber: 'MC24-101', email: 'chloe.d@univ.edu', courseId: 'course-cs330' },
  { id: 'std-102', name: 'Sebastian Vance', rollNumber: 'MC24-102', email: 's.vance@univ.edu', courseId: 'course-cs330' },
  { id: 'std-103', name: 'Zoe Morales', rollNumber: 'MC24-103', email: 'zoe.m@univ.edu', courseId: 'course-cs330' },
  { id: 'std-104', name: 'Gabriel Zhang', rollNumber: 'MC24-104', email: 'gabriel.z@univ.edu', courseId: 'course-cs330' },
  { id: 'std-105', name: 'Hannah Schmidt', rollNumber: 'MC24-105', email: 'hannah.s@univ.edu', courseId: 'course-cs330' },
  { id: 'std-106', name: 'Mateo Alvarez', rollNumber: 'MC24-106', email: 'mateo.a@univ.edu', courseId: 'course-cs330' },
  { id: 'std-107', name: 'Leila Farhan', rollNumber: 'MC24-107', email: 'leila.f@univ.edu', courseId: 'course-cs330' },
  { id: 'std-108', name: 'Julian Keller', rollNumber: 'MC24-108', email: 'j.keller@univ.edu', courseId: 'course-cs330' },
  { id: 'std-109', name: 'Nora Lindqvist', rollNumber: 'MC24-109', email: 'nora.l@univ.edu', courseId: 'course-cs330' },
  { id: 'std-110', name: 'Kiran Rao', rollNumber: 'MC24-110', email: 'kiran.rao@univ.edu', courseId: 'course-cs330' },
];

// Helper to generate dates relative to current date (Nov 1, 2026 or current year)
function formatDateStr(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate 30 days of lecture sessions and records for realistic reports
export function generateHistoricalData(): { sessions: AttendanceSession[]; records: AttendanceRecord[] } {
  const sessions: AttendanceSession[] = [];
  const records: AttendanceRecord[] = [];
  
  const today = new Date();
  const topics = [
    'Graph Traversal & BFS/DFS',
    'Dijkstra Shortest Paths',
    'Dynamic Programming: Memoization',
    'Greedy Algorithms & Huffman Coding',
    'Red-Black Trees & Balancing',
    'B-Trees and Database Indexing',
    'Divide and Conquer: Fast Multiplication',
    'NP-Completeness & SAT Problems',
    'Hash Tables & Linear Probing',
    'Amortized Complexity Analysis',
    'Trie Trees & Autocomplete Strings',
    'Minimum Spanning Trees: Kruskal & Prim',
    'Network Flow: Ford-Fulkerson Algorithm',
    'State Machines & Regular Expressions',
  ];

  const studentsCs204 = INITIAL_STUDENTS.filter(s => s.courseId === 'course-cs204');

  // Generate sessions for past 28 days (roughly 12 class days on Mon, Wed, Fri)
  let topicIdx = 0;
  for (let i = 28; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayOfWeek = d.getDay(); // 0 is Sun, 1 is Mon, 3 is Wed, 5 is Fri
    
    // Only schedule classes on Mon (1), Wed (3), Fri (5)
    if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
      const dateStr = formatDateStr(d);
      const sessionId = `session-hist-${dateStr}`;
      const topic = topics[topicIdx % topics.length];
      topicIdx++;

      let present = 0;
      let late = 0;
      let absent = 0;
      let excused = 0;

      // Assign attendance for students
      studentsCs204.forEach((student, sIdx) => {
        // Deterministic pseudo-randomness based on student + date
        const seed = (sIdx * 17 + i * 23) % 100;
        let status: 'present' | 'late' | 'absent' | 'excused';
        
        if (seed < 78) {
          status = 'present';
          present++;
        } else if (seed < 88) {
          status = 'late';
          late++;
        } else if (seed < 95) {
          status = 'absent';
          absent++;
        } else {
          status = 'excused';
          excused++;
        }

        const scanHour = 9;
        const scanMinute = status === 'late' ? 18 + (seed % 10) : 2 + (seed % 12);
        const recordTime = new Date(d);
        recordTime.setHours(scanHour, scanMinute, 0, 0);

        records.push({
          id: `rec-${sessionId}-${student.id}`,
          sessionId,
          courseId: 'course-cs204',
          studentId: student.id,
          studentName: student.name,
          studentRollNumber: student.rollNumber,
          status,
          timestamp: recordTime.toISOString(),
          verificationMethod: status === 'excused' ? 'manual' : (seed % 7 === 0 ? 'pin' : 'qr_scan'),
          notes: status === 'excused' ? 'Doctor appointment note provided' : undefined,
        });
      });

      sessions.push({
        id: sessionId,
        courseId: 'course-cs204',
        teacherId: 'teacher-david',
        date: dateStr,
        topic,
        startTime: new Date(d.setHours(9, 0, 0, 0)).toISOString(),
        endTime: new Date(d.setHours(10, 30, 0, 0)).toISOString(),
        status: 'closed',
        currentQrToken: `token-closed-${sessionId}`,
        tokenExpiresAt: d.getTime(),
        sessionPin: String(1000 + (i * 123) % 8999),
        presentCount: present,
        lateCount: late,
        absentCount: absent,
        excusedCount: excused,
      });
    }
  }

  // Create Today's ACTIVE session for algorithms lecture!
  const todayStr = formatDateStr(today);
  const activeSessionId = `session-active-${todayStr}`;
  const now = new Date();

  // Initial check-ins for today's active session
  const initialTodayChecked = [
    { student: studentsCs204[0], status: 'present' as const, min: 2 },
    { student: studentsCs204[1], status: 'present' as const, min: 3 },
    { student: studentsCs204[2], status: 'present' as const, min: 4 },
    { student: studentsCs204[3], status: 'present' as const, min: 5 },
    { student: studentsCs204[4], status: 'present' as const, min: 7 },
    { student: studentsCs204[5], status: 'late' as const, min: 16 },
    { student: studentsCs204[6], status: 'present' as const, min: 8 },
    { student: studentsCs204[7], status: 'present' as const, min: 9 },
  ];

  initialTodayChecked.forEach(item => {
    const recTime = new Date(now);
    recTime.setMinutes(recTime.getMinutes() - (20 - item.min));
    records.push({
      id: `rec-${activeSessionId}-${item.student.id}`,
      sessionId: activeSessionId,
      courseId: 'course-cs204',
      studentId: item.student.id,
      studentName: item.student.name,
      studentRollNumber: item.student.rollNumber,
      status: item.status,
      timestamp: recTime.toISOString(),
      verificationMethod: 'qr_scan',
    });
  });

  sessions.push({
    id: activeSessionId,
    courseId: 'course-cs204',
    teacherId: 'teacher-david',
    date: todayStr,
    topic: 'Advanced B-Trees & Distributed Indexing',
    startTime: now.toISOString(),
    status: 'active',
    currentQrToken: `PP-LIVE-${Date.now().toString(36).toUpperCase()}`,
    tokenExpiresAt: Date.now() + 15000,
    sessionPin: '4892',
    presentCount: 7,
    lateCount: 1,
    absentCount: studentsCs204.length - 8,
    excusedCount: 0,
  });

  return { sessions, records };
}
