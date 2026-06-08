import { AppRole } from './roles';

// Navigation destinations — each maps to an Ionicons name pair
// (outline / filled-rounded equivalent) and a translation key.

export const NavItems = {
  dashboard: { key: 'dashboard', icon: 'grid-outline', activeIcon: 'grid' },
  students: { key: 'students', icon: 'people-outline', activeIcon: 'people' },
  parents: { key: 'parents', icon: 'home-outline', activeIcon: 'home' },
  teachers: { key: 'teachers', icon: 'school-outline', activeIcon: 'school' },
  classes: { key: 'classes', icon: 'easel-outline', activeIcon: 'easel' },
  attendance: { key: 'attendance', icon: 'checkbox-outline', activeIcon: 'checkbox' },
  payments: { key: 'payments', icon: 'card-outline', activeIcon: 'card' },
  exams: { key: 'exams', icon: 'document-text-outline', activeIcon: 'document-text' },
  results: { key: 'results', icon: 'ribbon-outline', activeIcon: 'ribbon' },
  riskScore: { key: 'riskScore', icon: 'analytics-outline', activeIcon: 'analytics' },
  quranProgress: { key: 'quranProgress', icon: 'book-outline', activeIcon: 'book' },
  progress: { key: 'progress', icon: 'trending-up-outline', activeIcon: 'trending-up' },
  reports: { key: 'reports', icon: 'bar-chart-outline', activeIcon: 'bar-chart' },
  timeline: { key: 'timeline', icon: 'time-outline', activeIcon: 'time' },
  notices: { key: 'notices', icon: 'megaphone-outline', activeIcon: 'megaphone' },
  notes: { key: 'notes', icon: 'document-outline', activeIcon: 'document' },
  settings: { key: 'settings', icon: 'settings-outline', activeIcon: 'settings' },
};

// Destinations per role — order mirrors each dashboard's page list.
export function navItemsForRole(role) {
  const N = NavItems;
  switch (role) {
    case AppRole.superAdmin:
      return [N.dashboard, N.students, N.payments, N.riskScore, N.settings];
    case AppRole.schoolAdmin:
      return [N.dashboard, N.students, N.attendance, N.payments, N.riskScore, N.settings];
    case AppRole.teacher:
      return [N.dashboard, N.classes, N.attendance, N.notes, N.settings];
    case AppRole.accountant:
      return [N.dashboard, N.payments, N.students, N.settings];
    case AppRole.parent:
      return [N.dashboard, N.attendance, N.payments, N.timeline, N.notices];
    case AppRole.student:
      return [N.dashboard, N.attendance, N.results, N.progress, N.notices];
    default:
      return [N.dashboard, N.settings];
  }
}
