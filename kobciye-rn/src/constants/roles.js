// Raw role values as they will be stored in the database (`profiles.role`).
// IMPORTANT: these values must NEVER be translated or altered — they are
// the contract between the app and the backend's row-level security rules.

export const AppRole = {
  superAdmin: 'super_admin',
  schoolAdmin: 'school_admin',
  teacher: 'teacher',
  accountant: 'accountant',
  parent: 'parent',
  student: 'student',
};

export const ALL_ROLES = Object.values(AppRole);
