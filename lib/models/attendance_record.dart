class AttendanceRecord {
  final String id;
  final String sessionId;
  final String courseId;
  final String studentId;
  final String studentName;
  final String studentRollNumber;
  final String status; // 'present', 'late', 'absent', 'excused'
  final DateTime timestamp;
  final String verificationMethod; // 'qr_scan', 'pin', 'manual'

  AttendanceRecord({
    required this.id,
    required this.sessionId,
    required this.courseId,
    required this.studentId,
    required this.studentName,
    required this.studentRollNumber,
    required this.status,
    required this.timestamp,
    required this.verificationMethod,
  });

  factory AttendanceRecord.fromMap(Map<String, dynamic> data, String docId) {
    return AttendanceRecord(
      id: docId,
      sessionId: data['sessionId'] ?? '',
      courseId: data['courseId'] ?? '',
      studentId: data['studentId'] ?? '',
      studentName: data['studentName'] ?? '',
      studentRollNumber: data['studentRollNumber'] ?? '',
      status: data['status'] ?? 'present',
      timestamp: data['timestamp'] != null
          ? (data['timestamp'] is DateTime
              ? data['timestamp']
              : DateTime.tryParse(data['timestamp'].toString()) ?? DateTime.now())
          : DateTime.now(),
      verificationMethod: data['verificationMethod'] ?? 'qr_scan',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'sessionId': sessionId,
      'courseId': courseId,
      'studentId': studentId,
      'studentName': studentName,
      'studentRollNumber': studentRollNumber,
      'status': status,
      'timestamp': timestamp.toIso8601String(),
      'verificationMethod': verificationMethod,
    };
  }
}
