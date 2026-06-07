import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/widgets/dashboard_shell.dart';
import '../../../core/widgets/stat_card.dart';
import '../../../models/app_user.dart';
import '../../settings/settings_page.dart';
import '../widgets/highlight_banner.dart';
import '../widgets/overview_page.dart';
import '../widgets/section_placeholder.dart';

/// Finance workspace for [AppRole.accountant].
///
/// Order must mirror `NavItems.forRole(AppRole.accountant)`:
/// Dashboard, Payments, Students, Settings.
class AccountantDashboard extends StatelessWidget {
  final AppUser user;

  const AccountantDashboard({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return DashboardShell(
      user: user,
      roleLabelKey: 'role_accountant',
      pages: [
        OverviewPage(
          titleKey: 'overview',
          stats: const [
            StatCard(label: 'Unpaid students', value: '38', icon: Icons.person_off_rounded, tint: AppColors.danger, trend: '-5', trendUp: true),
            StatCard(label: 'Collected this month', value: '\$9,420', icon: Icons.account_balance_wallet_rounded, tint: AppColors.success, trend: '+\$640', trendUp: true),
            StatCard(label: 'Unmatched mobile-money', value: '14', icon: Icons.phone_iphone_rounded, tint: AppColors.accent, trend: 'review needed', trendUp: false),
            StatCard(label: 'Fee promises due', value: '7', icon: Icons.handshake_rounded, tint: AppColors.primaryLight, trend: 'this week', trendUp: true),
          ],
          highlight: const HighlightBanner(
            title: 'Mobile-money matching needs review',
            message: '14 incoming payments couldn\'t be auto-matched to a student this week — a quick check will clear them.',
            icon: Icons.fact_check_rounded,
            gradient: AppColors.goldGradient,
            actionLabel: 'Review payments',
          ),
        ),
        const SectionPlaceholder(titleKey: 'payments', icon: Icons.payments_rounded, gradient: AppColors.brandGradient),
        const SectionPlaceholder(titleKey: 'students', icon: Icons.groups_2_rounded, gradient: AppColors.growthGradient),
        SettingsPage(user: user, roleLabelKey: 'role_accountant'),
      ],
    );
  }
}
