import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_roles.dart';
import '../../features/auth/login_screen.dart';
import '../../features/dashboards/accountant_dashboard.dart';
import '../../features/dashboards/parent_dashboard.dart';
import '../../features/dashboards/school_admin_dashboard.dart';
import '../../features/dashboards/student_dashboard.dart';
import '../../features/dashboards/super_admin_dashboard.dart';
import '../../features/dashboards/teacher_dashboard.dart';
import '../../features/marketing/landing_page.dart';
import '../../features/onboarding/onboarding_screen.dart';
import '../../features/splash/splash_screen.dart';
import '../../services/auth_service.dart';
import 'role_redirect.dart';

/// Builds the app's [GoRouter].
///
/// Guard logic:
///  * Unauthenticated users may only see `/`(splash) and `/login`.
///  * Authenticated users are redirected away from `/login` straight to
///    their role's dashboard (see [roleHomeRoute]).
///  * Authenticated users hitting a dashboard route that does not match
///    their role are redirected to their own dashboard — e.g. a parent
///    cannot open `/teacher` by typing the URL.
GoRouter buildRouter(AuthService auth) {
  return GoRouter(
    initialLocation: '/',
    refreshListenable: auth,
    redirect: (context, state) async {
      final loggedIn = auth.isAuthenticated;
      final path = state.matchedLocation;
      final isAuthRoute = path == '/login' || path == '/' || path == '/welcome';

      if (!loggedIn) {
        return isAuthRoute ? null : '/login';
      }

      final home = roleHomeRoute(auth.currentUser!.role);

      // First-time sign-ins see a short welcome tour before their dashboard.
      final seenOnboarding = await OnboardingScreen.hasBeenSeen();
      if (!seenOnboarding) {
        return path == '/onboarding' ? null : '/onboarding';
      }
      if (path == '/login' || path == '/' || path == '/welcome' || path == '/onboarding') {
        return home;
      }

      // Lock each dashboard route to its matching role.
      const ownerByRoute = {
        '/super-admin': AppRole.superAdmin,
        '/school-admin': AppRole.schoolAdmin,
        '/teacher': AppRole.teacher,
        '/accountant': AppRole.accountant,
        '/parent': AppRole.parent,
        '/student': AppRole.student,
      };
      final owner = ownerByRoute[path];
      if (owner != null && owner != auth.currentUser!.role) {
        return home;
      }
      return null;
    },
    routes: [
      GoRoute(path: '/', builder: (context, state) => const SplashScreen()),
      GoRoute(path: '/welcome', builder: (context, state) => const LandingPage()),
      GoRoute(path: '/onboarding', builder: (context, state) => OnboardingScreen(auth: auth)),
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(
        path: '/super-admin',
        builder: (context, state) => SuperAdminDashboard(user: auth.currentUser!),
      ),
      GoRoute(
        path: '/school-admin',
        builder: (context, state) => SchoolAdminDashboard(user: auth.currentUser!),
      ),
      GoRoute(
        path: '/teacher',
        builder: (context, state) => TeacherDashboard(user: auth.currentUser!),
      ),
      GoRoute(
        path: '/accountant',
        builder: (context, state) => AccountantDashboard(user: auth.currentUser!),
      ),
      GoRoute(
        path: '/parent',
        builder: (context, state) => ParentDashboard(user: auth.currentUser!),
      ),
      GoRoute(
        path: '/student',
        builder: (context, state) => StudentDashboard(user: auth.currentUser!),
      ),
    ],
    errorBuilder: (context, state) => const Scaffold(
      body: Center(child: Text('Page not found')),
    ),
  );
}
