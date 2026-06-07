import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/dashboard_shell.dart';
import '../../core/widgets/section_placeholder.dart';
import '../../core/widgets/stat_card.dart';
import '../../models/app_user.dart';
import '../settings/settings_page.dart';
import 'widgets/highlight_banner.dart';
import 'widgets/overview_page.dart';

/// Payments & mobile-money command center for [AppRole.accountant].
///
/// Order must mirror `NavItems.forRole(AppRole.accountant)`:
/// Dashboard, Payments, Mobile Money, Fee Promises, Settings.
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
            StatCard(label: 'Collected this month', value: '\$12,640', icon: Icons.account_balance_wallet_rounded, tint: AppColors.success, trend: '+8%', trendUp: true),
            StatCard(label: 'Unpaid fees', value: '\$4,820', icon: Icons.payments_rounded, tint: AppColors.danger),
            StatCard(label: 'Unmatched payments', value: '16', icon: Icons.phone_iphone_rounded, tint: AppColors.orange, trend: 'needs review', trendUp: false),
            StatCard(label: 'Promises due soon', value: '9', icon: Icons.handshake_rounded, tint: AppColors.purple),
          ],
          highlight: const HighlightBanner(
            title: 'Mobile money needs review',
            message: '+25261xxxxxxx paid \$10 with reference "Ahmed Grade 1" — suggested match: Ahmed Ali, Grade 1, June Fee.',
            icon: Icons.fact_check_rounded,
            gradient: AppColors.riskMediumGradient,
            actionLabel: 'Review match',
          ),
        ),
        const SectionPlaceholder(titleKey: 'payments', icon: Icons.payments_rounded, gradient: AppColors.riskLowGradient),
        const SectionPlaceholder(titleKey: 'mobileMoney', icon: Icons.phone_iphone_rounded, gradient: AppColors.heroGradient),
        const SectionPlaceholder(titleKey: 'feePromises', icon: Icons.handshake_rounded, gradient: AppColors.riskMediumGradient),
        SettingsPage(user: user, roleLabelKey: 'role_accountant'),
      ],
    );
  }
}
