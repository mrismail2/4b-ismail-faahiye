import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/dashboard_shell.dart';
import '../../core/widgets/section_placeholder.dart';
import '../../core/widgets/stat_card.dart';
import '../../models/app_user.dart';
import '../settings/settings_page.dart';
import 'widgets/highlight_banner.dart';
import 'widgets/overview_page.dart';

/// Platform-wide control center for [AppRole.superAdmin].
///
/// Order must mirror `NavItems.forRole(AppRole.superAdmin)`:
/// Dashboard, Students, Risk Score, Payments, Settings.
class SuperAdminDashboard extends StatelessWidget {
  final AppUser user;

  const SuperAdminDashboard({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return DashboardShell(
      user: user,
      roleLabelKey: 'role_super_admin',
      pages: [
        OverviewPage(
          titleKey: 'overview',
          stats: const [
            StatCard(label: 'Schools on platform', value: '24', icon: Icons.school_rounded, tint: AppColors.blue, trend: '+3 this term', trendUp: true),
            StatCard(label: 'Active students', value: '8,412', icon: Icons.groups_2_rounded, tint: AppColors.purple, trend: '+212', trendUp: true),
            StatCard(label: 'High-risk students', value: '186', icon: Icons.warning_amber_rounded, tint: AppColors.danger, trend: '+14', trendUp: false),
            StatCard(label: 'Unmatched payments', value: '57', icon: Icons.phone_iphone_rounded, tint: AppColors.orange, trend: '-9', trendUp: true),
          ],
          highlight: const HighlightBanner(
            title: 'Platform health check',
            message: '3 schools have attendance sync issues and 2 schools have over 30 unmatched mobile-money payments this week.',
            icon: Icons.health_and_safety_rounded,
            gradient: AppColors.brandGradient,
            actionLabel: 'Review schools',
          ),
        ),
        const SectionPlaceholder(titleKey: 'students', icon: Icons.groups_2_rounded, gradient: AppColors.heroGradient),
        const SectionPlaceholder(titleKey: 'riskScore', icon: Icons.insights_rounded, gradient: AppColors.riskHighGradient),
        const SectionPlaceholder(titleKey: 'payments', icon: Icons.payments_rounded, gradient: AppColors.riskLowGradient),
        SettingsPage(user: user, roleLabelKey: 'role_super_admin'),
      ],
    );
  }
}
