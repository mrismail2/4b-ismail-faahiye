/// Core platform roles. These values map 1:1 to the `profiles.role` column in
/// Supabase and must NEVER be translated or altered for display purposes.
class AppRole {
  AppRole._();

  static const String superAdmin = 'super_admin';
  static const String schoolAdmin = 'school_admin';
  static const String teacher = 'teacher';
  static const String accountant = 'accountant';
  static const String parent = 'parent';
  static const String student = 'student';

  static const List<String> all = [
    superAdmin,
    schoolAdmin,
    teacher,
    accountant,
    parent,
    student,
  ];
}
