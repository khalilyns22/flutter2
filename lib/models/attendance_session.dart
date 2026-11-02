class AttendanceSession {
  final String id;
  final String courseId;
  final String date;
  final String topic;
  final DateTime startTime;
  final String status; // 'active', 'closed'
  final String currentQrToken;
  final int tokenExpiresAt;
  final String sessionPin;
  int presentCount;
  int absentCount;

  AttendanceSession({
    required this.id,
    required this.courseId,
    required this.date,
    required this.topic,
    required this.startTime,
    required this.status,
    required this.currentQrToken,
    required this.tokenExpiresAt,
    required this.sessionPin,
    this.presentCount = 0,
    this.absentCount = 0,
  });

  factory AttendanceSession.fromMap(Map<String, dynamic> data, String docId) {
    return AttendanceSession(
      id: docId,
      courseId: data['courseId'] ?? '',
      date: data['date'] ?? '',
      topic: data['topic'] ?? 'Lecture Attendance',
      startTime: data['startTime'] != null
          ? (data['startTime'] is DateTime
              ? data['startTime']
              : DateTime.tryParse(data['startTime'].toString()) ?? DateTime.now())
          : DateTime.now(),
      status: data['status'] ?? 'active',
      currentQrToken: data['currentQrToken'] ?? '',
      tokenExpiresAt: data['tokenExpiresAt'] ?? 0,
      sessionPin: data['sessionPin'] ?? '1234',
      presentCount: data['presentCount'] ?? 0,
      absentCount: data['absentCount'] ?? 0,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'courseId': courseId,
      'date': date,
      'topic': topic,
      'startTime': startTime.toIso8601String(),
      'status': status,
      'currentQrToken': currentQrToken,
      'tokenExpiresAt': tokenExpiresAt,
      'sessionPin': sessionPin,
      'presentCount': presentCount,
      'absentCount': absentCount,
    };
  }
}
