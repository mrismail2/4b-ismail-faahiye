import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/dashboard_shell.dart';
import '../../core/widgets/section_placeholder.dart';
import '../../core/widgets/stat_card.dart';
import '../../models/app_user.dart';
import '../settings/settings_page.dart';
import 'widgets/highlight_banner.dart';
import 'widgets/overview_page.dart';

/// Daily workload cockpit for [AppRole.teacher].
///
/// Order must mirror `NavItems.forRole(AppRole.teacher)`:
/// Dashboard, Students, Attendance, Risk Score, Qur'an Progress, Settings.
class TeacherDashboard extends StatelessWidget {
  final AppUser user;

  const TeacherDashboard({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return DashboardShell(
      user: user,
      roleLabelKey: 'role_teacher',
      pages: [
        OverviewPage(
          titleKey: 'overview',
          stats: const [
            StatCard(label: 'My classes', value: '3', icon: Icons.class_rounded, tint: AppColors.blue),
            StatCard(label: 'Attendance pending', value: '2', icon: Icons.pending_actions_rounded, tint: AppColors.warning, trend: 'today', trendUp: false),
            StatCard(label: 'Students at risk', value: '7', icon: Icons.warning_amber_rounded, tint: AppColors.danger),
            StatCard(label: 'Marks pending', value: '14', icon: Icons.edit_note_rounded, tint: AppColors.purple),
          ],
          highlight: const HighlightBanner(
            title: 'Today\'s priorities',
            message: 'Grade 4B attendance is not yet submitted, and 3 students need a teacher note before Friday\'s parent meeting.',
            icon: Icons.checklist_rounded,
            gradient: AppColors.heroGradient,
            actionLabel: 'Mark attendance',
          ),
        ),
        const SectionPlaceholder(titleKey: 'students', icon: Icons.groups_2_rounded, gradient: AppColors.heroGradient),
        const SectionPlaceholder(titleKey: 'attendance', icon: Icons.fact_check_rounded, gradient: AppColors.riskLowGradient),
        const SectionPlaceholder(titleKey: 'riskScore', icon: Icons.insights_rounded, gradient: AppColors.riskHighGradient),
        const SectionPlaceholder(titleKey: 'quranProgress', icon: Icons.menu_book_rounded, gradient: AppColors.riskMediumGradient),
        SettingsPage(user: user, roleLabelKey: 'role_teacher'),
      ],
    );
  }
}
