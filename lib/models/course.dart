class Course {
  final String id;
  final String name;
  final String code;
  final String section;
  final String schedule;
  final String room;
  final int totalEnrolled;

  Course({
    required this.id,
    required this.name,
    required this.code,
    required this.section,
    required this.schedule,
    required this.room,
    required this.totalEnrolled,
  });

  factory Course.fromMap(Map<String, dynamic> data, String docId) {
    return Course(
      id: docId,
      name: data['name'] ?? '',
      code: data['code'] ?? '',
      section: data['section'] ?? '',
      schedule: data['schedule'] ?? '',
      room: data['room'] ?? '',
      totalEnrolled: data['totalEnrolled'] ?? 0,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'code': code,
      'section': section,
      'schedule': schedule,
      'room': room,
      'totalEnrolled': totalEnrolled,
    };
  }
}
