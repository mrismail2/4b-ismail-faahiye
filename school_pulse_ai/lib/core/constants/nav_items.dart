import 'package:flutter/material.dart';
import 'app_roles.dart';

/// A single destination in the role-based navigation (sidebar / bottom bar).
class NavItem {
  final String labelKey;
  final IconData icon;
  final IconData selectedIcon;

  const NavItem({required this.labelKey, required this.icon, required this.selectedIcon});
}

/// Navigation destinations per role for the Phase-1 dashboard shells.
///
/// Each role sees a tailored slice of the platform — e.g. parents never see
/// "Mobile Money Matching" and teachers never see "Fee Promises" management.
class NavItems {
  NavItems._();

  static const _dashboard = NavItem(
    labelKey: 'dashboard',
    icon: Icons.space_dashboard_outlined,
    selectedIcon: Icons.space_dashboard_rounded,
  );
  static const _students = NavItem(
    labelKey: 'students',
    icon: Icons.groups_2_outlined,
    selectedIcon: Icons.groups_2_rounded,
  );
  static const _attendance = NavItem(
    labelKey: 'attendance',
    icon: Icons.fact_check_outlined,
    selectedIcon: Icons.fact_check_rounded,
  );
  static const _risk = NavItem(
    labelKey: 'riskScore',
    icon: Icons.insights_outlined,
    selectedIcon: Icons.insights_rounded,
  );
  static const _payments = NavItem(
    labelKey: 'payments',
    icon: Icons.payments_outlined,
    selectedIcon: Icons.payments_rounded,
  );
  static const _mobileMoney = NavItem(
    labelKey: 'mobileMoney',
    icon: Icons.phone_iphone_outlined,
    selectedIcon: Icons.phone_iphone_rounded,
  );
  static const _feePromises = NavItem(
    labelKey: 'feePromises',
    icon: Icons.handshake_outlined,
    selectedIcon: Icons.handshake_rounded,
  );
  static const _quran = NavItem(
    labelKey: 'quranProgress',
    icon: Icons.menu_book_outlined,
    selectedIcon: Icons.menu_book_rounded,
  );
  static const _timeline = NavItem(
    labelKey: 'timeline',
    icon: Icons.timeline_outlined,
    selectedIcon: Icons.timeline_rounded,
  );
  static const _settings = NavItem(
    labelKey: 'settings',
    icon: Icons.settings_outlined,
    selectedIcon: Icons.settings_rounded,
  );

  static List<NavItem> forRole(String role) {
    switch (role) {
      case AppRole.superAdmin:
        return [_dashboard, _students, _risk, _payments, _settings];
      case AppRole.schoolAdmin:
        return [_dashboard, _students, _risk, _attendance, _payments, _settings];
      case AppRole.teacher:
        return [_dashboard, _students, _attendance, _risk, _quran, _settings];
      case AppRole.accountant:
        return [_dashboard, _payments, _mobileMoney, _feePromises, _settings];
      case AppRole.parent:
        return [_dashboard, _risk, _timeline, _payments, _quran, _settings];
      case AppRole.student:
        return [_dashboard, _attendance, _quran, _timeline, _settings];
      default:
        return [_dashboard, _settings];
    }
  }
}
