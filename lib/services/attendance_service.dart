import 'dart:async';
import 'dart:convert';
import 'dart:math';
import 'package:flutter/foundation.dart';
import '../models/course.dart';
import '../models/attendance_session.dart';
import '../models/attendance_record.dart';
import '../models/daily_summary.dart';

class AttendanceService extends ChangeNotifier {
  // Authentication State
  String? _currentTeacherEmail;
  String? _currentTeacherName;
  bool get isAuthenticated => _currentTeacherEmail != null;
  String get teacherName => _currentTeacherName ?? 'Prof. Khalil Yns';
  String get teacherEmail => _currentTeacherEmail ?? '';

  // Administrator Granted Classes
  final List<Course> grantedCourses = [
    Course(
      id: 'course-cs204',
      name: 'Algorithms & Data Structures',
      code: 'CS-204',
      section: 'Sec A',
      schedule: 'Mon, Wed, Fri · 09:00 - 10:30 AM',
      room: 'Hall 302',
      totalEnrolled: 24,
    ),
    Course(
      id: 'course-cs330',
      name: 'Mobile & Cloud Architecture',
      code: 'CS-330',
      section: 'Sec B',
      schedule: 'Tue, Thu · 01:00 - 02:30 PM',
      room: 'Lab 108',
      totalEnrolled: 20,
    ),
    Course(
      id: 'course-cs101',
      name: 'Intro to Software Engineering',
      code: 'CS-101',
      section: 'Sec C',
      schedule: 'Mon, Wed · 02:00 - 03:30 PM',
      room: 'Hall 105',
      totalEnrolled: 28,
    ),
  ];

  late Course selectedCourse;
  AttendanceSession? activeSession;
  final List<AttendanceRecord> _records = [];
  final List<AttendanceSession> _pastSessions = [];

  // Dynamic QR Code rotating timer (15 seconds)
  Timer? _rotationTimer;
  int tokenSecondsLeft = 15;
  String _rotatingNonce = 'INIT';

  AttendanceService() {
    selectedCourse = grantedCourses[0];
    _seedHistoricalData();
  }

  // --- Authentication ---
  Future<bool> login(String email, String password) async {
    if (email.trim().isEmpty || password.length < 4) return false;
    _currentTeacherEmail = email.trim();
    final namePart = email.split('@')[0].replaceAll(RegExp(r'[._-]'), ' ');
    _currentTeacherName = 'Prof. ${namePart.substring(0, 1).toUpperCase()}${namePart.substring(1)}';
    notifyListeners();
    return true;
  }

  void logout() {
    closeSession();
    _currentTeacherEmail = null;
    _currentTeacherName = null;
    notifyListeners();
  }

  // --- Class Selection ---
  void selectCourse(Course course) {
    selectedCourse = course;
    notifyListeners();
  }

  // --- Session Management ---
  void startSession() {
    closeSession();

    final now = DateTime.now();
    final sessionId = 'session-${now.millisecondsSinceEpoch}';
    final pin = (1000 + Random().nextInt(8999)).toString();
    _rotatingNonce = _generateNonce();
    tokenSecondsLeft = 15;

    activeSession = AttendanceSession(
      id: sessionId,
      courseId: selectedCourse.id,
      date: '${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}',
      topic: '${selectedCourse.code} Lecture',
      startTime: now,
      status: 'active',
      currentQrToken: 'PP-TOKEN-$_rotatingNonce',
      tokenExpiresAt: now.millisecondsSinceEpoch + 15000,
      sessionPin: pin,
      presentCount: 0,
      absentCount: selectedCourse.totalEnrolled,
    );

    _startRotatingTimer();
    notifyListeners();
  }

  void closeSession() {
    _rotationTimer?.cancel();
    if (activeSession != null) {
      _pastSessions.insert(0, activeSession!);
      activeSession = null;
      notifyListeners();
    }
  }

  void _startRotatingTimer() {
    _rotationTimer?.cancel();
    _rotationTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (tokenSecondsLeft <= 1) {
        tokenSecondsLeft = 15;
        _rotatingNonce = _generateNonce();
      } else {
        tokenSecondsLeft--;
      }
      notifyListeners();
    });
  }

  String _generateNonce() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    final rand = Random();
    return List.generate(6, (index) => chars[rand.nextInt(chars.length)]).join();
  }

  // QR Payload String for mobile scanning
  String get qrPayload {
    if (activeSession == null) return '';
    return jsonEncode({
      'app': 'PresencePulse',
      'sessionId': activeSession!.id,
      'courseId': activeSession!.courseId,
      'token': '${activeSession!.id}-$_rotatingNonce',
      'pin': activeSession!.sessionPin,
      'expiresIn': tokenSecondsLeft,
      'timestamp': DateTime.now().millisecondsSinceEpoch,
    });
  }

  // Mark student attendance (called by real student scans or test actions)
  void recordStudentAttendance(String studentName, String rollNumber) {
    if (activeSession == null) return;

    final record = AttendanceRecord(
      id: 'rec-${activeSession!.id}-$rollNumber',
      sessionId: activeSession!.id,
      courseId: activeSession!.courseId,
      studentId: rollNumber,
      studentName: studentName,
      studentRollNumber: rollNumber,
      status: 'present',
      timestamp: DateTime.now(),
      verificationMethod: 'qr_scan',
    );

    _records.insert(0, record);
    activeSession!.presentCount++;
    activeSession!.absentCount = max(0, selectedCourse.totalEnrolled - activeSession!.presentCount);
    notifyListeners();
  }

  // --- Reports (Filterable by Today vs Last 7 Days) ---
  List<DailySummary> getDailySummaries({required bool onlyToday}) {
    final now = DateTime.now();
    final todayStr = '${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';

    final cutoff = onlyToday ? now.subtract(const Duration(hours: 24)) : now.subtract(const Duration(days: 7));

    final matching = _pastSessions.where((s) {
      if (onlyToday) {
        return s.date == todayStr;
      }
      return s.startTime.isAfter(cutoff);
    }).toList();

    return matching.map((session) {
      final course = grantedCourses.firstWhere(
        (c) => c.id == session.courseId,
        orElse: () => selectedCourse,
      );
      final rate = course.totalEnrolled > 0
          ? ((session.presentCount / course.totalEnrolled) * 100).round()
          : 0;

      return DailySummary(
        date: session.date,
        courseCode: course.code,
        courseName: course.name,
        topic: session.topic,
        totalEnrolled: course.totalEnrolled,
        presentCount: session.presentCount,
        absentCount: session.absentCount,
        attendanceRate: rate,
        sessionId: session.id,
      );
    }).toList();
  }

  void _seedHistoricalData() {
    final now = DateTime.now();
    for (int i = 1; i <= 6; i++) {
      final sessionTime = now.subtract(Duration(days: i));
      final dateStr = '${sessionTime.year}-${sessionTime.month.toString().padLeft(2, '0')}-${sessionTime.day.toString().padLeft(2, '0')}';
      final present = 18 + (i % 5);
      final course = grantedCourses[i % grantedCourses.length];

      _pastSessions.add(AttendanceSession(
        id: 'hist-session-$i',
        courseId: course.id,
        date: dateStr,
        topic: '${course.code} Lecture',
        startTime: sessionTime,
        status: 'closed',
        currentQrToken: 'PP-CLOSED-$i',
        tokenExpiresAt: 0,
        sessionPin: '1234',
        presentCount: present,
        absentCount: course.totalEnrolled - present,
      ));
    }
  }

  @override
  void dispose() {
    _rotationTimer?.cancel();
    super.dispose();
  }
}
