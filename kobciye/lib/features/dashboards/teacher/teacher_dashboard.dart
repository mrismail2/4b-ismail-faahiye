import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/widgets/dashboard_shell.dart';
import '../../../core/widgets/stat_card.dart';
import '../../../models/app_user.dart';
import '../../settings/settings_page.dart';
import '../widgets/highlight_banner.dart';
import '../widgets/overview_page.dart';
import '../widgets/section_placeholder.dart';

/// Daily workspace for [AppRole.teacher].
///
/// Order must mirror `NavItems.forRole(AppRole.teacher)`:
/// Dashboard, Classes, Attendance, Notes, Settings.
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
            StatCard(label: 'Assigned classes', value: '4', icon: Icons.class_rounded, tint: AppColors.primaryLight, trend: 'this term', trendUp: true),
            StatCard(label: 'Attendance pending', value: '2', icon: Icons.fact_check_rounded, tint: AppColors.accent, trend: 'today', trendUp: false),
            StatCard(label: 'Students needing attention', value: '5', icon: Icons.front_hand_rounded, tint: AppColors.danger, trend: 'this week', trendUp: false),
            StatCard(label: 'Qur\'an entries pending', value: '11', icon: Icons.menu_book_rounded, tint: AppColors.success, trend: 'to record', trendUp: false),
          ],
          highlight: const HighlightBanner(
            title: 'Wrap up today\'s attendance',
            message: 'Grade 3B and Grade 4A still need today\'s attendance marked before 4:00 PM.',
            icon: Icons.schedule_rounded,
            gradient: AppColors.brandGradient,
            actionLabel: 'Mark attendance',
          ),
        ),
        const SectionPlaceholder(titleKey: 'classes', icon: Icons.class_rounded, gradient: AppColors.growthGradient),
        const SectionPlaceholder(titleKey: 'attendance', icon: Icons.fact_check_rounded, gradient: AppColors.brandGradient),
        const SectionPlaceholder(titleKey: 'notes', icon: Icons.sticky_note_2_rounded, gradient: AppColors.goldGradient),
        SettingsPage(user: user, roleLabelKey: 'role_teacher'),
      ],
    );
  }
}
