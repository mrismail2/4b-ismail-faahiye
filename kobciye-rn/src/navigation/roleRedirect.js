import { AppRole } from '../constants/roles';

// Maps a role to its dashboard screen name (registered in RootNavigator).
export function roleHomeScreen(role) {
  switch (role) {
    case AppRole.superAdmin: return 'SuperAdminDashboard';
    case AppRole.schoolAdmin: return 'SchoolAdminDashboard';
    case AppRole.teacher: return 'TeacherDashboard';
    case AppRole.accountant: return 'AccountantDashboard';
    case AppRole.parent: return 'ParentDashboard';
    case AppRole.student: return 'StudentDashboard';
    default: return 'Login';
  }
}
