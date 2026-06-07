import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/dashboard_shell.dart';
import '../../core/widgets/section_placeholder.dart';
import '../../core/widgets/stat_card.dart';
import '../../models/app_user.dart';
import '../settings/settings_page.dart';
import 'widgets/highlight_banner.dart';
import 'widgets/overview_page.dart';

/// Student App home for [AppRole.student].
///
/// Order must mirror `NavItems.forRole(AppRole.student)`:
/// Dashboard, Attendance, Qur'an Progress, Timeline, Settings.
///
/// Students only ever see their own records (enforced later by Supabase RLS).
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
            StatCard(label: 'My attendance', value: '88%', icon: Icons.fact_check_rounded, tint: AppColors.success, trend: 'this month', trendUp: true),
            StatCard(label: 'Latest exam', value: '48%', icon: Icons.school_rounded, tint: AppColors.warning, trend: '-27 pts', trendUp: false),
            StatCard(label: 'Qur’an juz\'', value: '5 / 30', icon: Icons.menu_book_rounded, tint: AppColors.purple),
            StatCard(label: 'Fee status', value: 'Due', icon: Icons.payments_rounded, tint: AppColors.orange),
          ],
          highlight: const HighlightBanner(
            title: 'Keep going, Ahmed!',
            message: 'Your Math score dropped this term — review last week\'s notes with your teacher and aim for full attendance this month.',
            icon: Icons.emoji_events_rounded,
            gradient: AppColors.riskLowGradient,
            actionLabel: 'View my report',
          ),
        ),
        const SectionPlaceholder(titleKey: 'attendance', icon: Icons.fact_check_rounded, gradient: AppColors.riskLowGradient),
        const SectionPlaceholder(titleKey: 'quranProgress', icon: Icons.menu_book_rounded, gradient: AppColors.riskMediumGradient),
        const SectionPlaceholder(titleKey: 'timeline', icon: Icons.timeline_rounded, gradient: AppColors.heroGradient),
        SettingsPage(user: user, roleLabelKey: 'role_student'),
      ],
    );
  }
}
