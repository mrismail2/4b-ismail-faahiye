import 'app_roles.dart';
import 'app_routes.dart';

/// Maps a role to its dashboard home route.
String roleHomeRoute(String role) {
  switch (role) {
    case AppRole.superAdmin:
      return AppRoutes.superAdmin;
    case AppRole.schoolAdmin:
      return AppRoutes.schoolAdmin;
    case AppRole.teacher:
      return AppRoutes.teacher;
    case AppRole.accountant:
      return AppRoutes.accountant;
    case AppRole.parent:
      return AppRoutes.parent;
    case AppRole.student:
      return AppRoutes.student;
    default:
      return AppRoutes.login;
  }
}
