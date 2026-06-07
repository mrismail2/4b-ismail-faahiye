import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../features/auth/login_screen.dart';
import '../../features/dashboards/accountant/accountant_dashboard.dart';
import '../../features/dashboards/parent/parent_dashboard.dart';
import '../../features/dashboards/school_admin/school_admin_dashboard.dart';
import '../../features/dashboards/student/student_dashboard.dart';
import '../../features/dashboards/super_admin/super_admin_dashboard.dart';
import '../../features/dashboards/teacher/teacher_dashboard.dart';
import '../../features/onboarding/onboarding_screen.dart';
import '../../features/splash/splash_screen.dart';
import '../../services/auth_service.dart';
import '../constants/app_roles.dart';
import '../constants/app_routes.dart';
import '../constants/role_redirect.dart';

/// Builds the app's [GoRouter].
///
/// Guard logic:
///  * Unauthenticated users may only see splash, onboarding/landing and login.
///  * Authenticated users are redirected away from those public routes
///    straight to their role's dashboard (see [roleHomeRoute]).
///  * Authenticated users hitting a dashboard route that doesn't match
///    their role are redirected back to their own dashboard.
GoRouter buildRouter(AuthService auth) {
  return GoRouter(
    initialLocation: AppRoutes.splash,
    refreshListenable: auth,
    redirect: (context, state) {
      final loggedIn = auth.isAuthenticated;
      final path = state.matchedLocation;
      final isPublicRoute = path == AppRoutes.splash || path == AppRoutes.onboarding || path == AppRoutes.login;

      if (!loggedIn) {
        return isPublicRoute ? null : AppRoutes.login;
      }

      final home = roleHomeRoute(auth.currentUser!.role);
      if (isPublicRoute) return home;

      const ownerByRoute = {
        AppRoutes.superAdmin: AppRole.superAdmin,
        AppRoutes.schoolAdmin: AppRole.schoolAdmin,
        AppRoutes.teacher: AppRole.teacher,
        AppRoutes.accountant: AppRole.accountant,
        AppRoutes.parent: AppRole.parent,
        AppRoutes.student: AppRole.student,
      };
      final owner = ownerByRoute[path];
      if (owner != null && owner != auth.currentUser!.role) {
        return home;
      }
      return null;
    },
    routes: [
      GoRoute(path: AppRoutes.splash, builder: (context, state) => const SplashScreen()),
      GoRoute(path: AppRoutes.onboarding, builder: (context, state) => const OnboardingScreen()),
      GoRoute(path: AppRoutes.login, builder: (context, state) => const LoginScreen()),
      GoRoute(
        path: AppRoutes.superAdmin,
        builder: (context, state) => SuperAdminDashboard(user: auth.currentUser!),
      ),
      GoRoute(
        path: AppRoutes.schoolAdmin,
        builder: (context, state) => SchoolAdminDashboard(user: auth.currentUser!),
      ),
      GoRoute(
        path: AppRoutes.teacher,
        builder: (context, state) => TeacherDashboard(user: auth.currentUser!),
      ),
      GoRoute(
        path: AppRoutes.accountant,
        builder: (context, state) => AccountantDashboard(user: auth.currentUser!),
      ),
      GoRoute(
        path: AppRoutes.parent,
        builder: (context, state) => ParentDashboard(user: auth.currentUser!),
      ),
      GoRoute(
        path: AppRoutes.student,
        builder: (context, state) => StudentDashboard(user: auth.currentUser!),
      ),
    ],
    errorBuilder: (context, state) => const Scaffold(
      body: Center(child: Text('Page not found')),
    ),
  );
}
