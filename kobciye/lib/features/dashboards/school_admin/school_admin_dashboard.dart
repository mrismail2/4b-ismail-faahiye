import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/widgets/dashboard_shell.dart';
import '../../../core/widgets/stat_card.dart';
import '../../../models/app_user.dart';
import '../../settings/settings_page.dart';
import '../widgets/highlight_banner.dart';
import '../widgets/overview_page.dart';
import '../widgets/section_placeholder.dart';

/// School-level command center for [AppRole.schoolAdmin].
///
/// Order must mirror `NavItems.forRole(AppRole.schoolAdmin)`:
/// Dashboard, Students, Attendance, Payments, Risk Score, Settings.
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
            StatCard(label: 'Total students', value: '642', icon: Icons.groups_2_rounded, tint: AppColors.primaryLight, trend: '+18', trendUp: true),
            StatCard(label: 'Attendance today', value: '94%', icon: Icons.fact_check_rounded, tint: AppColors.success, trend: '+2.1%', trendUp: true),
            StatCard(label: 'Unpaid fees', value: '\$3,140', icon: Icons.payments_rounded, tint: AppColors.accent, trend: '27 students', trendUp: false),
            StatCard(label: 'High-risk students', value: '8', icon: Icons.warning_amber_rounded, tint: AppColors.danger, trend: '+1', trendUp: false),
          ],
          highlight: const HighlightBanner(
            title: 'Needs your attention today',
            message: 'Grade 5A has 4 students with repeated absences, and 3 teachers haven\'t submitted attendance yet.',
            icon: Icons.priority_high_rounded,
            gradient: AppColors.riskHighGradient,
            actionLabel: 'View at-risk classes',
          ),
        ),
        const SectionPlaceholder(titleKey: 'students', icon: Icons.groups_2_rounded, gradient: AppColors.brandGradient),
        const SectionPlaceholder(titleKey: 'attendance', icon: Icons.fact_check_rounded, gradient: AppColors.growthGradient),
        const SectionPlaceholder(titleKey: 'payments', icon: Icons.payments_rounded, gradient: AppColors.goldGradient),
        const SectionPlaceholder(titleKey: 'riskScore', icon: Icons.insights_rounded, gradient: AppColors.riskHighGradient),
        SettingsPage(user: user, roleLabelKey: 'role_school_admin'),
      ],
    );
  }
}
