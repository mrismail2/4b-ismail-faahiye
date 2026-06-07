import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/widgets/dashboard_shell.dart';
import '../../../core/widgets/stat_card.dart';
import '../../../models/app_user.dart';
import '../widgets/highlight_banner.dart';
import '../widgets/overview_page.dart';
import '../widgets/section_placeholder.dart';

/// Family-facing home for [AppRole.parent].
///
/// Order must mirror `NavItems.forRole(AppRole.parent)`:
/// Dashboard, Attendance, Payments, Timeline, Notices.
class ParentDashboard extends StatelessWidget {
  final AppUser user;

  const ParentDashboard({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return DashboardShell(
      user: user,
      roleLabelKey: 'role_parent',
      pages: [
        OverviewPage(
          titleKey: 'overview',
          stats: const [
            StatCard(label: 'Attendance this month', value: '96%', icon: Icons.fact_check_rounded, tint: AppColors.success, trend: 'great', trendUp: true),
            StatCard(label: 'Outstanding fees', value: '\$0', icon: Icons.payments_rounded, tint: AppColors.primaryLight, trend: 'all clear', trendUp: true),
            StatCard(label: 'Latest exam average', value: '88%', icon: Icons.grading_rounded, tint: AppColors.accent, trend: '+4%', trendUp: true),
            StatCard(label: 'Qur\'an juz\' completed', value: '6', icon: Icons.menu_book_rounded, tint: AppColors.success, trend: 'on track', trendUp: true),
          ],
          highlight: const HighlightBanner(
            title: 'Yusuf had a great week 🎉',
            message: 'Full attendance, a strong exam result, and a kind note from his teacher about helping classmates.',
            icon: Icons.celebration_rounded,
            gradient: AppColors.growthGradient,
          ),
        ),
        const SectionPlaceholder(titleKey: 'attendance', icon: Icons.fact_check_rounded, gradient: AppColors.brandGradient),
        const SectionPlaceholder(titleKey: 'payments', icon: Icons.payments_rounded, gradient: AppColors.goldGradient),
        const SectionPlaceholder(titleKey: 'timeline', icon: Icons.timeline_rounded, gradient: AppColors.growthGradient),
        const SectionPlaceholder(titleKey: 'notices', icon: Icons.campaign_rounded, gradient: AppColors.riskMediumGradient),
      ],
    );
  }
}
