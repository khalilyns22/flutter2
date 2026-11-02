import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/attendance_service.dart';

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({Key? key}) : super(key: key);

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  bool _onlyToday = false;

  @override
  Widget build(BuildContext context) {
    final service = Provider.of<AttendanceService>(context);
    final summaries = service.getDailySummaries(onlyToday: _onlyToday);

    int totalPresent = 0;
    int totalAbsent = 0;
    int totalEnrolled = 0;

    for (final s in summaries) {
      totalPresent += s.presentCount;
      totalAbsent += s.absentCount;
      totalEnrolled += s.totalEnrolled;
    }

    final avgRate = totalEnrolled > 0 ? ((totalPresent / totalEnrolled) * 100).round() : 0;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Filter Bar
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Attendance Period:',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF334155)),
                ),
                Row(
                  children: [
                    ChoiceChip(
                      label: const Text('Today'),
                      selected: _onlyToday,
                      onSelected: (selected) => setState(() => _onlyToday = true),
                      selectedColor: const Color(0xFF4F46E5),
                      labelStyle: TextStyle(
                        color: _onlyToday ? Colors.white : const Color(0xFF334155),
                        fontWeight: FontWeight.w600,
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(width: 8),
                    ChoiceChip(
                      label: const Text('Last 7 Days'),
                      selected: !_onlyToday,
                      onSelected: (selected) => setState(() => _onlyToday = false),
                      selectedColor: const Color(0xFF4F46E5),
                      labelStyle: TextStyle(
                        color: !_onlyToday ? Colors.white : const Color(0xFF334155),
                        fontWeight: FontWeight.w600,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Metric Summary Cards
          Row(
            children: [
              Expanded(
                child: _buildMetricCard(
                  title: 'Lectures',
                  value: '${summaries.length}',
                  color: const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildMetricCard(
                  title: 'Present',
                  value: '$totalPresent',
                  color: const Color(0xFF10B981),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildMetricCard(
                  title: 'Absent',
                  value: '$totalAbsent',
                  color: const Color(0xFFF43F5E),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildMetricCard(
                  title: 'Rate',
                  value: '$avgRate%',
                  color: const Color(0xFF4F46E5),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Daily Attendance Breakdown List
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Text(
                    'Daily Attendance Records (${summaries.length} days)',
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                  ),
                ),
                const Divider(height: 1, color: Color(0xFFE2E8F0)),
                if (summaries.isEmpty)
                  const Padding(
                    padding: EdgeInsets.all(24.0),
                    child: Center(
                      child: Text('No attendance records found for this period.', style: TextStyle(color: Color(0xFF94A3B8))),
                    ),
                  )
                else
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: summaries.length,
                    separatorBuilder: (context, index) => const Divider(height: 1, color: Color(0xFFF1F5F9)),
                    itemBuilder: (context, index) {
                      final item = summaries[index];
                      return ListTile(
                        title: Text(
                          item.topic,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                        ),
                        subtitle: Text(
                          '${item.date} · ${item.courseCode}',
                          style: const TextStyle(color: Color(0xFF64748B), fontSize: 12),
                        ),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFFECFDF5),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                '${item.presentCount} P',
                                style: const TextStyle(color: Color(0xFF047857), fontWeight: FontWeight.bold, fontSize: 12),
                              ),
                            ),
                            const SizedBox(width: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFFFFF1F2),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                '${item.absentCount} A',
                                style: const TextStyle(color: Color(0xFFBE123C), fontWeight: FontWeight.bold, fontSize: 12),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              '${item.attendanceRate}%',
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricCard({required String title, required String value, required Color color}) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        children: [
          Text(title, style: const TextStyle(fontSize: 10, color: Color(0xFF64748B), fontWeight: FontWeight.w600)),
          const SizedBox(height: 4),
          Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: color)),
        ],
      ),
    );
  }
}
