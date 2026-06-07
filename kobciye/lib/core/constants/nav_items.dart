import 'package:flutter/material.dart';
import 'app_roles.dart';

/// A single destination in the role-based navigation (sidebar / bottom bar).
class NavItem {
  final String labelKey;
  final IconData icon;
  final IconData selectedIcon;

  const NavItem({required this.labelKey, required this.icon, required this.selectedIcon});
}

/// Navigation destinations per role.
///
/// Mobile roles (parent, student, teacher) get a focused bottom-nav set;
/// admin-style roles (super admin, school admin, accountant) get the fuller
/// sidebar set used on desktop, condensed to the same items on mobile.
class NavItems {
  NavItems._();

  static const dashboard = NavItem(
    labelKey: 'dashboard',
    icon: Icons.space_dashboard_outlined,
    selectedIcon: Icons.space_dashboard_rounded,
  );
  static const students = NavItem(
    labelKey: 'students',
    icon: Icons.groups_2_outlined,
    selectedIcon: Icons.groups_2_rounded,
  );
  static const parents = NavItem(
    labelKey: 'parents',
    icon: Icons.family_restroom_outlined,
    selectedIcon: Icons.family_restroom_rounded,
  );
  static const teachers = NavItem(
    labelKey: 'teachers',
    icon: Icons.school_outlined,
    selectedIcon: Icons.school_rounded,
  );
  static const classes = NavItem(
    labelKey: 'classes',
    icon: Icons.class_outlined,
    selectedIcon: Icons.class_rounded,
  );
  static const attendance = NavItem(
    labelKey: 'attendance',
    icon: Icons.fact_check_outlined,
    selectedIcon: Icons.fact_check_rounded,
  );
  static const payments = NavItem(
    labelKey: 'payments',
    icon: Icons.payments_outlined,
    selectedIcon: Icons.payments_rounded,
  );
  static const exams = NavItem(
    labelKey: 'exams',
    icon: Icons.quiz_outlined,
    selectedIcon: Icons.quiz_rounded,
  );
  static const results = NavItem(
    labelKey: 'results',
    icon: Icons.grading_outlined,
    selectedIcon: Icons.grading_rounded,
  );
  static const riskScore = NavItem(
    labelKey: 'riskScore',
    icon: Icons.insights_outlined,
    selectedIcon: Icons.insights_rounded,
  );
  static const quranProgress = NavItem(
    labelKey: 'quranProgress',
    icon: Icons.menu_book_outlined,
    selectedIcon: Icons.menu_book_rounded,
  );
  static const progress = NavItem(
    labelKey: 'progress',
    icon: Icons.trending_up_outlined,
    selectedIcon: Icons.trending_up_rounded,
  );
  static const reports = NavItem(
    labelKey: 'reports',
    icon: Icons.bar_chart_outlined,
    selectedIcon: Icons.bar_chart_rounded,
  );
  static const timeline = NavItem(
    labelKey: 'timeline',
    icon: Icons.timeline_outlined,
    selectedIcon: Icons.timeline_rounded,
  );
  static const notices = NavItem(
    labelKey: 'notices',
    icon: Icons.campaign_outlined,
    selectedIcon: Icons.campaign_rounded,
  );
  static const notes = NavItem(
    labelKey: 'notes',
    icon: Icons.sticky_note_2_outlined,
    selectedIcon: Icons.sticky_note_2_rounded,
  );
  static const settings = NavItem(
    labelKey: 'settings',
    icon: Icons.settings_outlined,
    selectedIcon: Icons.settings_rounded,
  );

  /// Full sidebar list shown on desktop for admin-style roles.
  static const sidebar = [
    dashboard,
    students,
    parents,
    teachers,
    attendance,
    payments,
    exams,
    riskScore,
    quranProgress,
    reports,
    settings,
  ];

  /// Destinations per role — mirrors the order each dashboard's `pages`
  /// list must use.
  static List<NavItem> forRole(String role) {
    switch (role) {
      case AppRole.superAdmin:
        return [dashboard, students, payments, riskScore, settings];
      case AppRole.schoolAdmin:
        return [dashboard, students, attendance, payments, riskScore, settings];
      case AppRole.teacher:
        return [dashboard, classes, attendance, notes, settings];
      case AppRole.accountant:
        return [dashboard, payments, students, settings];
      case AppRole.parent:
        return [dashboard, attendance, payments, timeline, notices];
      case AppRole.student:
        return [dashboard, attendance, results, progress, notices];
      default:
        return [dashboard, settings];
    }
  }
}
