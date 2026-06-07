import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/widgets/dashboard_shell.dart';
import '../../../core/widgets/stat_card.dart';
import '../../../models/app_user.dart';
import '../widgets/highlight_banner.dart';
import '../widgets/overview_page.dart';
import '../widgets/section_placeholder.dart';

/// Student-facing home for [AppRole.student].
///
/// Order must mirror `NavItems.forRole(AppRole.student)`:
/// Dashboard, Attendance, Results, Progress, Notices.
class StudentDashboard extends StatelessWidget {
  final AppUser user;

  const StudentDashboard({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return DashboardShell(
      user: user,
      roleLabelKey: 'role_student',
      pages: [
        OverviewPage(
          titleKey: 'overview',
          stats: const [
            StatCard(label: 'My attendance', value: '97%', icon: Icons.fact_check_rounded, tint: AppColors.success, trend: 'this term', trendUp: true),
            StatCard(label: 'Latest result', value: 'A-', icon: Icons.grading_rounded, tint: AppColors.primaryLight, trend: 'Mathematics', trendUp: true),
            StatCard(label: 'Payment status', value: 'Paid', icon: Icons.payments_rounded, tint: AppColors.success, trend: 'up to date', trendUp: true),
            StatCard(label: 'Qur\'an progress', value: 'Juz\' 7', icon: Icons.menu_book_rounded, tint: AppColors.accent, trend: 'memorizing', trendUp: true),
          ],
          highlight: const HighlightBanner(
            title: 'Keep up the great work! 🌟',
            message: 'You\'ve had perfect attendance for 3 weeks in a row — your teacher left you an encouraging note.',
            icon: Icons.emoji_events_rounded,
            gradient: AppColors.goldGradient,
          ),
        ),
        const SectionPlaceholder(titleKey: 'attendance', icon: Icons.fact_check_rounded, gradient: AppColors.brandGradient),
        const SectionPlaceholder(titleKey: 'results', icon: Icons.grading_rounded, gradient: AppColors.growthGradient),
        const SectionPlaceholder(titleKey: 'progress', icon: Icons.trending_up_rounded, gradient: AppColors.goldGradient),
        const SectionPlaceholder(titleKey: 'notices', icon: Icons.campaign_rounded, gradient: AppColors.riskMediumGradient),
      ],
    );
  }
}
