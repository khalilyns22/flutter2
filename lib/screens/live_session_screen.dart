import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../services/attendance_service.dart';

class LiveSessionScreen extends StatelessWidget {
  const LiveSessionScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final service = Provider.of<AttendanceService>(context);
    final isSessionActive = service.activeSession != null;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Section 1: Administrator-Granted Classes Selector
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.verified_user_outlined, size: 18, color: Color(0xFF4F46E5)),
                        SizedBox(width: 8),
                        Text(
                          'Administrator Granted Classes',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                      ],
                    ),
                    Text(
                      'Teacher: ${service.teacherName}',
                      style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Course selector buttons
                Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  children: service.grantedCourses.map((course) {
                    final isSelected = course.id == service.selectedCourse.id;
                    return InkWell(
                      onTap: () => service.selectCourse(course),
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0xFFEEF2FF) : const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: isSelected ? const Color(0xFF4F46E5) : const Color(0xFFE2E8F0),
                            width: isSelected ? 2 : 1,
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              course.code,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: isSelected ? const Color(0xFF4F46E5) : const Color(0xFF334155),
                              ),
                            ),
                            Text(
                              '${course.section} · ${course.totalEnrolled} Students',
                              style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Section 2: Session Display or Start Card
          if (!isSessionActive)
            // Standby card
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  const Icon(Icons.qr_code_scanner, size: 48, color: Color(0xFF4F46E5)),
                  const SizedBox(height: 12),
                  Text(
                    'Ready to Launch ${service.selectedCourse.code}',
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    '${service.selectedCourse.name} · ${service.selectedCourse.schedule}',
                    style: const TextStyle(fontSize: 13, color: Color(0xFF64748B)),
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton.icon(
                    onPressed: () => service.startSession(),
                    icon: const Icon(Icons.play_arrow),
                    label: const Text('Launch Active QR Session'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4F46E5),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ],
              ),
            )
          else
            // Active Projector View
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF0F172A), // High contrast dark presentation mode
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.15), blurRadius: 20, offset: const Offset(0, 8)),
                ],
              ),
              child: Column(
                children: [
                  // Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            service.selectedCourse.code,
                            style: const TextStyle(color: Color(0xFF818CF8), fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                          Text(
                            service.selectedCourse.name,
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                        ],
                      ),
                      IconButton(
                        onPressed: () => service.closeSession(),
                        icon: const Icon(Icons.close, color: Colors.white70),
                        tooltip: 'Close Session',
                      ),
                    ],
                  ),
                  const Divider(color: Color(0xFF334155), height: 24),

                  // Rotating QR Code Canvas
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: QrImageView(
                      data: service.qrPayload,
                      version: QrVersions.auto,
                      size: 220.0,
                    ),
                  ),
                  const SizedBox(height: 14),

                  // 15s Timer Rotating Nonce Indicator
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFF334155)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.refresh, size: 14, color: Color(0xFF818CF8)),
                        const SizedBox(width: 6),
                        Text(
                          'Anti-fraud token refreshes in ${service.tokenSecondsLeft}s',
                          style: const TextStyle(color: Color(0xFFC7D2FE), fontSize: 12, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Fallback PIN and Live Counter
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      // Backup PIN
                      Column(
                        children: [
                          const Text('BACKUP PIN', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10, letterSpacing: 1.2)),
                          const SizedBox(height: 4),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                            decoration: BoxDecoration(
                              color: const Color(0xFF1E293B),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              service.activeSession!.sessionPin,
                              style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold, letterSpacing: 4),
                            ),
                          ),
                        ],
                      ),

                      // Present Counter
                      Column(
                        children: [
                          const Text('CHECKED IN', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10, letterSpacing: 1.2)),
                          const SizedBox(height: 4),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.baseline,
                            textBaseline: TextBaseline.alphabetic,
                            children: [
                              Text(
                                '${service.activeSession!.presentCount}',
                                style: const TextStyle(color: Color(0xFF34D399), fontSize: 26, fontWeight: FontWeight.bold),
                              ),
                              Text(
                                ' / ${service.selectedCourse.totalEnrolled}',
                                style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Test Student Check-in Action
                  ElevatedButton.icon(
                    onPressed: () {
                      final randomRoll = 'CS24-${100 + service.activeSession!.presentCount}';
                      service.recordStudentAttendance('Student ${service.activeSession!.presentCount + 1}', randomRoll);
                    },
                    icon: const Icon(Icons.check_circle_outline, size: 16),
                    label: const Text('Simulate Student Scan (+1 Present)'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF334155),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
