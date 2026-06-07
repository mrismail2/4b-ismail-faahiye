import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/widgets/dashboard_shell.dart';
import '../../../core/widgets/stat_card.dart';
import '../../../models/app_user.dart';
import '../../settings/settings_page.dart';
import '../widgets/highlight_banner.dart';
import '../widgets/overview_page.dart';
import '../widgets/section_placeholder.dart';

/// Platform-wide control center for [AppRole.superAdmin].
///
/// Order must mirror `NavItems.forRole(AppRole.superAdmin)`:
/// Dashboard, Students, Payments, Risk Score, Settings.
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
            StatCard(label: 'Schools on platform', value: '31', icon: Icons.apartment_rounded, tint: AppColors.primaryLight, trend: '+4 this term', trendUp: true),
            StatCard(label: 'Pending school requests', value: '6', icon: Icons.hourglass_top_rounded, tint: AppColors.accent, trend: 'review needed', trendUp: false),
            StatCard(label: 'Active students', value: '11,204', icon: Icons.groups_2_rounded, tint: AppColors.success, trend: '+318', trendUp: true),
            StatCard(label: 'Schools on trial', value: '9', icon: Icons.workspace_premium_rounded, tint: AppColors.primary, trend: 'free month', trendUp: true),
          ],
          highlight: const HighlightBanner(
            title: 'Platform health check',
            message: '6 new school requests are waiting for approval, and 2 schools have subscriptions ending this week.',
            icon: Icons.health_and_safety_rounded,
            gradient: AppColors.brandGradient,
            actionLabel: 'Review requests',
          ),
        ),
        const SectionPlaceholder(titleKey: 'students', icon: Icons.groups_2_rounded, gradient: AppColors.growthGradient),
        const SectionPlaceholder(titleKey: 'payments', icon: Icons.payments_rounded, gradient: AppColors.goldGradient),
        const SectionPlaceholder(titleKey: 'riskScore', icon: Icons.insights_rounded, gradient: AppColors.riskHighGradient),
        SettingsPage(user: user, roleLabelKey: 'role_super_admin'),
      ],
    );
  }
}
