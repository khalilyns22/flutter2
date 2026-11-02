import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/attendance_service.dart';
import 'screens/login_screen.dart';
import 'screens/live_session_screen.dart';
import 'screens/reports_screen.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => AttendanceService(),
      child: const PresencePulseApp(),
    ),
  );
}

class PresencePulseApp extends StatelessWidget {
  const PresencePulseApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PresencePulse Teacher',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF4F46E5),
          primary: const Color(0xFF4F46E5),
          surface: const Color(0xFFF8FAFC),
        ),
        fontFamily: 'Roboto',
      ),
      home: const MainGate(),
    );
  }
}

class MainGate extends StatelessWidget {
  const MainGate({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final service = Provider.of<AttendanceService>(context);

    // If not authenticated, show Login Screen
    if (!service.isAuthenticated) {
      return const LoginScreen();
    }

    // Authenticated Teacher Home
    return const TeacherHomeScreen();
  }
}

class TeacherHomeScreen extends StatefulWidget {
  const TeacherHomeScreen({Key? key}) : super(key: key);

  @override
  State<TeacherHomeScreen> createState() => _TeacherHomeScreenState();
}

class _TeacherHomeScreenState extends State<TeacherHomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    LiveSessionScreen(),
    ReportsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final service = Provider.of<AttendanceService>(context);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF4F46E5),
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Text(
                'P',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
              ),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'PresencePulse',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                ),
                Text(
                  service.teacherName,
                  style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, size: 20, color: Color(0xFF64748B)),
            tooltip: 'Sign Out',
            onPressed: () => service.logout(),
          ),
        ],
      ),
      body: _screens[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) => setState(() => _currentIndex = index),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.qr_code_2),
            label: 'Live Session',
          ),
          NavigationDestination(
            icon: Icon(Icons.assessment_outlined),
            label: 'Attendance Reports',
          ),
        ],
      ),
    );
  }
}
