import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/dashboard_shell.dart';
import '../../core/widgets/section_placeholder.dart';
import '../../core/widgets/stat_card.dart';
import '../../models/app_user.dart';
import '../settings/settings_page.dart';
import 'widgets/highlight_banner.dart';
import 'widgets/overview_page.dart';

/// Parent App home for [AppRole.parent].
///
/// Order must mirror `NavItems.forRole(AppRole.parent)`:
/// Dashboard, Risk Score, Timeline, Payments, Qur'an Progress, Settings.
///
/// Parents only ever see their own linked children (enforced later by
/// Supabase Row Level Security on `parent_students`).
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
            StatCard(label: 'Ahmed\'s attendance', value: '88%', icon: Icons.fact_check_rounded, tint: AppColors.success, trend: 'this month', trendUp: true),
            StatCard(label: 'Risk level', value: 'High', icon: Icons.warning_amber_rounded, tint: AppColors.danger),
            StatCard(label: 'Fees due', value: '\$20', icon: Icons.payments_rounded, tint: AppColors.orange, trend: '2 months', trendUp: false),
            StatCard(label: 'Qur’an juz\'', value: '5 / 30', icon: Icons.menu_book_rounded, tint: AppColors.purple),
          ],
          highlight: const HighlightBanner(
            title: 'Weekly update — Ahmed Ali',
            message: 'Asc waalid. Ilmahaaga Axmed toddobaadkan wuxuu yimid 4 maalmood, hal maalin wuu maqnaa. Lacagta bishana weli lama bixin.',
            icon: Icons.forum_rounded,
            gradient: AppColors.heroGradient,
            actionLabel: 'Open full report',
          ),
        ),
        const SectionPlaceholder(titleKey: 'riskScore', icon: Icons.insights_rounded, gradient: AppColors.riskHighGradient),
        const SectionPlaceholder(titleKey: 'timeline', icon: Icons.timeline_rounded, gradient: AppColors.heroGradient),
        const SectionPlaceholder(titleKey: 'payments', icon: Icons.payments_rounded, gradient: AppColors.riskLowGradient),
        const SectionPlaceholder(titleKey: 'quranProgress', icon: Icons.menu_book_rounded, gradient: AppColors.riskMediumGradient),
        SettingsPage(user: user, roleLabelKey: 'role_parent'),
      ],
    );
  }
}
