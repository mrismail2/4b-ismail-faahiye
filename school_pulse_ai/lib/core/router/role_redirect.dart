import '../constants/app_roles.dart';

/// Maps a profile's `role` (raw DB value) to its dashboard route.
///
/// Redirects:
///   super_admin   -> /super-admin
///   school_admin  -> /school-admin
///   teacher       -> /teacher
///   accountant    -> /accountant
///   parent        -> /parent
///   student       -> /student
String roleHomeRoute(String role) {
  switch (role) {
    case AppRole.superAdmin:
      return '/super-admin';
    case AppRole.schoolAdmin:
      return '/school-admin';
    case AppRole.teacher:
      return '/teacher';
    case AppRole.accountant:
      return '/accountant';
    case AppRole.parent:
      return '/parent';
    case AppRole.student:
      return '/student';
    default:
      return '/login';
  }
}
