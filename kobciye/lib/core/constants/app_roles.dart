/// Raw role values as they will be stored in the database (`profiles.role`).
///
/// IMPORTANT: these values must NEVER be translated or altered — they are
/// the contract between the app and the backend's row-level security rules.
class AppRole {
  AppRole._();

  static const superAdmin = 'super_admin';
  static const schoolAdmin = 'school_admin';
  static const teacher = 'teacher';
  static const accountant = 'accountant';
  static const parent = 'parent';
  static const student = 'student';

  static const all = [superAdmin, schoolAdmin, teacher, accountant, parent, student];
}
