class DailySummary {
  final String date;
  final String courseCode;
  final String courseName;
  final String topic;
  final int totalEnrolled;
  final int presentCount;
  final int absentCount;
  final int attendanceRate;
  final String sessionId;

  DailySummary({
    required this.date,
    required this.courseCode,
    required this.courseName,
    required this.topic,
    required this.totalEnrolled,
    required this.presentCount,
    required this.absentCount,
    required this.attendanceRate,
    required this.sessionId,
  });
}
