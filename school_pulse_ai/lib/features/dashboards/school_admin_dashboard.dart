import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/dashboard_shell.dart';
import '../../core/widgets/section_placeholder.dart';
import '../../core/widgets/stat_card.dart';
import '../../models/app_user.dart';
import '../settings/settings_page.dart';
import 'widgets/highlight_banner.dart';
import 'widgets/overview_page.dart';

/// School Intelligence Dashboard for [AppRole.schoolAdmin].
///
/// Order must mirror `NavItems.forRole(AppRole.schoolAdmin)`:
/// Dashboard, Students, Risk Score, Attendance, Payments, Settings.
class SchoolAdminDashboard extends StatelessWidget {
  final AppUser user;

  const SchoolAdminDashboard({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return DashboardShell(
      user: user,
      roleLabelKey: 'role_school_admin',
      pages: [
        OverviewPage(
          titleKey: 'overview',
          stats: const [
            StatCard(label: 'High-risk students', value: '12', icon: Icons.warning_amber_rounded, tint: AppColors.danger, trend: '+2', trendUp: false),
            StatCard(label: 'Attendance rate', value: '92%', icon: Icons.fact_check_rounded, tint: AppColors.success, trend: '+1.4%', trendUp: true),
            StatCard(label: 'Unpaid fees', value: '\$4,820', icon: Icons.payments_rounded, tint: AppColors.orange, trend: '38 students', trendUp: false),
            StatCard(label: 'Fee promises due', value: '9', icon: Icons.handshake_rounded, tint: AppColors.purple, trend: 'this week', trendUp: true),
          ],
          highlight: const HighlightBanner(
            title: 'Needs your attention today',
            message: 'Grade 4B has 6 students with 3+ absences this month, and 5 teachers still have pending attendance from yesterday.',
            icon: Icons.priority_high_rounded,
            gradient: AppColors.riskHighGradient,
            actionLabel: 'View at-risk classes',
          ),
        ),
        const SectionPlaceholder(titleKey: 'students', icon: Icons.groups_2_rounded, gradient: AppColors.heroGradient),
        const SectionPlaceholder(titleKey: 'riskScore', icon: Icons.insights_rounded, gradient: AppColors.riskHighGradient),
        const SectionPlaceholder(titleKey: 'attendance', icon: Icons.fact_check_rounded, gradient: AppColors.riskLowGradient),
        const SectionPlaceholder(titleKey: 'payments', icon: Icons.payments_rounded, gradient: AppColors.riskMediumGradient),
        SettingsPage(user: user, roleLabelKey: 'role_school_admin'),
      ],
    );
  }
}
