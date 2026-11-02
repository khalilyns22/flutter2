# PresencePulse – Teacher Attendance Portal & Analytics Hub

PresencePulse is a teacher-focused attendance platform featuring real-time dynamic QR code generation for classroom check-ins, live Firestore synchronization, and date-range filterable visual reports showing daily present and absent student metrics.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Please review the core workflow and technical integration points before execution.

- **Confirmed Reporting Feature**: Integrated attendance reports with both an interactive visual trend chart (daily Present vs. Absent stacked/dual bars and attendance percentage curve) and a detailed daily breakdown table, filterable by date range (Today, Last 7 Days, Last 30 Days, Custom Date Range) and exportable to CSV.
- **QR Code Generation & Anti-Fraud**: Generates a dynamic QR code with a configurable rotating token (e.g., 15s refresh countdown) and projector-friendly full-screen presentation mode, plus an optional 4-digit session code fallback for students with camera issues.
- **Flutter & Firebase Synergy**: Connected to Firebase Firestore with a standardized schema (`courses`, `sessions`, `attendances`, `students`) so that the Flutter/Dart student mobile application built by your partner connects seamlessly to the exact same backend database in real time.
- **Interactive Student Scanner Companion**: Includes an integrated student scan tester so the teacher can test and demonstrate the student check-in experience directly on screen without needing a secondary device.

---

## 1. Overview & Core Concept

PresencePulse streamlines the attendance workflow for educators:
1. **Teacher Setup & Authentication**: The teacher logs in, selects or creates a course and class section, and starts an active attendance session.
2. **Classroom Display**: The teacher projects a high-contrast QR code on the classroom screen. The QR code encodes the session ID, timestamp, and a rotating cryptographic nonce to prevent students from sending screenshots to absent peers.
3. **Real-Time Attendance Stream**: As students scan the QR code via their Flutter mobile app (or the built-in companion simulator), their attendance record is written to Firestore, instantly updating the teacher's live dashboard without page refreshes.
4. **Attendance Management & Manual Overrides**: The teacher can manually mark students as Present, Absent, Late, or Excused, add notes (e.g. medical excuse), and lock the session when lecture begins.
5. **Attendance Reports & Visual Summaries**: A dedicated analytics hub enables teachers to select date ranges, inspect daily present vs. absent distributions via interactive charts, evaluate attendance trends across courses, and export records for institutional compliance.

---

## 2. User Experience & Visual Design

Following the **Universal Frontend Design Constitution** and **SaaS & Dashboard Design Guidelines** (`references/3_saas_dashboard.md`):

### Workspace Structure & Navigation
- **Navigation Rail (Left, 250px)**:
  - **Live Session**: Start new lecture, project QR code, live student counter.
  - **Live Roster**: Real-time incoming scan feed, status override controls, quick search.
  - **Attendance Reports**: Date-range filtered analytics, visual charts, daily attendance tables, CSV export.
  - **Courses & Students**: Manage classes, enrolled students, student IDs, and contact info.
  - **Flutter Integration**: Schema definitions, Firestore rules reference, and Flutter/Dart client integration code.
- **Top Context Bar**: Active course selector, breadcrumb trail, session quick-status toggle, and teacher profile.

### Visual Identity & Theme
- **Aesthetic Direction**: Clean, authoritative educational cockpit with high typographic density and zero artificial clutter.
- **Color Discipline (60-30-10)**:
  - **60% Canvas**: Crisp off-white (`#F8FAFC`) / Slate Navy in dark mode (`#0B1120`).
  - **30% Structure**: Pure white cards (`#FFFFFF`) / Slate containers (`#1E293B`) with hairline borders (`border-slate-200 dark:border-slate-800`).
  - **10% Accents**: Indigo (`#4F46E5`) for primary actions; Emerald (`#10B981`) for Present status; Rose (`#F43F5E`) for Absent; Amber (`#F59E0B`) for Late.
- **Typography**: Display typography using `Plus Jakarta Sans` for headers and navigation; `Manrope` for interface body text; `JetBrains Mono` / `tabular-nums` for timestamps, student IDs, attendance counters, and report metrics.
- **Zero-Pill Discipline**: Statuses and metadata presented with clean typographic indicators and subtle dot accents, avoiding loud pill badge sandwiches.

### Key User Flows

#### Flow 1: Launching a Session & QR Projection
1. Teacher selects "Algorithms 101 – Lecture 14" and clicks **"Start Attendance Session"**.
2. A high-resolution QR code is rendered with an active countdown timer (15s rotation).
3. The teacher can click **"Projector Mode"** to enter a distraction-free fullscreen presentation view with prominent QR code, class name, current time, and a live counter of checked-in students.

#### Flow 2: Real-Time Verification
1. As scans arrive in Firestore, rows in the Live Roster slide in with smooth micro-animation.
2. The teacher sees student name, ID, exact timestamp, and verification status.
3. If a student forgot their phone, the teacher clicks their name and selects "Mark Present" or "Excused".

#### Flow 3: Attendance Reports & Analytics
1. Teacher navigates to **"Attendance Reports"**.
2. Selects date filter: Preset buttons (**Last 7 Days**, **Last 30 Days**, **This Month**) or custom **Date Range** pickers.
3. An interactive **Daily Attendance Trend Chart** displays:
   - Stacked vertical bars of Present vs. Absent counts for each class day.
   - Trendline of overall attendance rate percentage.
   - Summary cards: Average Attendance Rate %, Total Present instances, Total Absences, Most Consistent Day.
4. Below the chart, a **Daily Breakdown Table** lists each lecture date, registered students, present count, absent count, and a "View Roster" drawer to see exact student lists.
5. Click **"Export CSV"** to generate an immediate download of the filtered attendance dataset.

#### Flow 4: Student Scanner Simulator
1. The teacher can toggle the "Student Scanner Simulator" modal at any time to test the QR code.
2. The simulator simulates a mobile camera viewfinder, scans the active QR code, allows selecting any enrolled student or typing a student ID, and registers attendance to Firestore in real time.

---

## 3. Key Product Decisions & Trade-Offs

- **Dynamic Rotating Nonce vs. Static QR**:
  - *Chosen Approach*: Dynamic QR token that updates every 15 seconds via an ephemeral session timestamp and HMAC hash, with a fallback 4-character session PIN.
  - *Why*: Prevents students in the classroom from texting a picture of the QR code to absent friends outside the hall.
- **Reporting Charting Strategy**:
  - *Chosen Approach*: Lightweight, custom SVG-based responsive charting with tooltips, date ticks, and tabular figures.
  - *Why*: Zero heavy third-party bundle overhead, crisp vector rendering on all screen densities, full styling alignment with Tailwind design tokens.
- **Database Architecture (Firebase Firestore & Offline Resilience)**:
  - *Chosen Approach*: Firebase Firestore with real-time `onSnapshot` listeners and defensive fallback to browser storage if offline or pending Firebase configuration.
  - *Why*: Allows immediate zero-latency testing in the development environment while remaining completely ready for the production Firebase backend shared with the Flutter mobile app.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENCEPULSE SYSTEM                            │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
       ┌───────────────────────────┴───────────────────────────┐
       ▼                                                       ▼
┌──────────────────────────────┐              ┌──────────────────────────────┐
│  Teacher Web Portal (React)  │              │  Student Mobile App (Flutter) │
│  - Authentication            │              │  - Student Login             │
│  - Dynamic QR Generator      │              │  - Camera QR Scanner         │
│  - Live Roster Manager       │              │  - Attendance Submission     │
│  - Visual Attendance Reports │              │  - Personal Attendance Log   │
└──────────────┬───────────────┘              └──────────────┬───────────────┘
               │                                             │
               │ real-time reads & writes                    │ writes scan record
               ▼                                             ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FIREBASE FIRESTORE                              │
│                                                                        │
│  /courses/{courseId}                                                   │
│    ├── code, name, term, teacherId, schedule                           │
│    └── /students/{studentId}                                           │
│          └── name, email, rollNumber, avatar                           │
│                                                                        │
│  /sessions/{sessionId}                                                 │
│    ├── courseId, date, startTime, status ('active' | 'closed')          │
│    ├── currentQrToken, tokenExpiresAt, sessionPin                      │
│    └── /attendance/{attendanceId}                                      │
│          └── studentId, studentName, timestamp, status, method         │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Schema Specifications

#### 1. Entity: `Course`
```typescript
interface Course {
  id: string;
  name: string;
  code: string;
  section: string;
  teacherId: string;
  schedule: string; // e.g. "Mon, Wed 10:00 - 11:30 AM"
  totalEnrolled: number;
}
```

#### 2. Entity: `Session`
```typescript
interface AttendanceSession {
  id: string;
  courseId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // ISO string
  endTime?: string;
  status: 'active' | 'closed';
  currentQrToken: string; // Dynamic rotating token
  tokenExpiresAt: number;
  sessionPin: string; // Fallback PIN (e.g. "8492")
  presentCount: number;
  absentCount: number;
}
```

#### 3. Entity: `AttendanceRecord`
```typescript
interface AttendanceRecord {
  id: string;
  sessionId: string;
  courseId: string;
  studentId: string;
  studentName: string;
  studentRollNumber: string;
  status: 'present' | 'late' | 'absent' | 'excused';
  timestamp: string; // ISO string
  verificationMethod: 'qr_scan' | 'manual' | 'pin';
  notes?: string;
}
```

#### 4. Entity: `DailyReportSummary`
```typescript
interface DailyReportSummary {
  date: string;
  courseId: string;
  courseName: string;
  totalStudents: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  attendanceRate: number; // percentage 0-100
}
```

### Planned Implementation Steps

1. **Step 1: Setup & Dependencies**
   - Install `qrcode.react` for reliable vector QR generation and canvas rendering.
   - Configure Tailwind v4 styling with proper `@custom-variant dark` tokens.
   - Setup Firebase integration layer (`firebase-blueprint.json`, Firestore service, security rules).

2. **Step 2: Core State & Mock/Live Data Bridge**
   - Implement `AttendanceContext` handling real-time session state, course roster, attendance events, and reporting queries.
   - Provide realistic sample courses, students, and 30-day historical attendance data for immediate rich reporting preview.

3. **Step 3: Teacher Authentication & Classroom Live Session View**
   - Clean teacher sign-in/profile switcher.
   - Interactive Session Launcher with course selector.
   - Fullscreen Projector Mode with dynamic QR code (15s rotation timer, circular progress ring, session PIN).

4. **Step 4: Live Attendance Roster & Manual Override**
   - Live incoming check-in feed with instant search and status toggles (Present, Late, Absent, Excused).
   - Real-time counter metrics (Present: X, Absent: Y, Rate: Z%).

5. **Step 5: Attendance Reporting & Visual Analytics Feature**
   - Date range selector (Today, 7D, 30D, Custom range picker).
   - Interactive SVG Bar/Area Chart displaying Daily Present vs. Absent counts and attendance rate trends with hover tooltips.
   - Daily breakdown table with search, status filters, and detailed student drawer.
   - Export to CSV utility with complete attendance metadata.

6. **Step 6: Student Scanner Companion & Flutter Integration Guide**
   - Modal scanner simulator to test QR scanning and instant Firestore sync.
   - Flutter/Dart integration tab with copyable Dart models, Firestore queries, and QR scanner code for the mobile partner.
