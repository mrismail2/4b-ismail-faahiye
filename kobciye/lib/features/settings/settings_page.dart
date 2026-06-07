import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_text.dart';
import '../../core/widgets/app_card.dart';
import '../../core/widgets/language_switcher.dart';
import '../../models/app_user.dart';
import '../../services/auth_service.dart';
import '../../services/localization_service.dart';

/// Shared settings page — profile summary, language preference and sign out.
/// Available to every role.
class SettingsPage extends StatelessWidget {
  final AppUser user;
  final String roleLabelKey;

  const SettingsPage({super.key, required this.user, required this.roleLabelKey});

  @override
  Widget build(BuildContext context) {
    final auth = context.read<AuthService>();
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(context.t('settings'), style: AppText.h1),
          const SizedBox(height: 18),
          AppCard(
            child: Row(
              children: [
                CircleAvatar(
                  radius: 28,
                  backgroundColor: AppColors.primary.withOpacity(0.12),
                  child: Text(user.initials, style: AppText.h1.copyWith(color: AppColors.primary)),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(user.fullName, style: AppText.h2),
                      Text(user.email, style: AppText.bodyMuted),
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.08),
                          borderRadius: BorderRadius.circular(40),
                        ),
                        child: Text(context.t(roleLabelKey),
                            style: AppText.caption.copyWith(color: AppColors.primary)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          AppCard(
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Language / Luqadda', style: AppText.h2),
                      const SizedBox(height: 4),
                      Text('Choose how Kobciye speaks to you.', style: AppText.bodyMuted),
                    ],
                  ),
                ),
                const LanguageSwitcher(),
              ],
            ),
          ),
          const SizedBox(height: 16),
          AppCard(
            onTap: auth.signOut,
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(color: AppColors.danger.withOpacity(0.1), borderRadius: BorderRadius.circular(13)),
                  child: const Icon(Icons.logout_rounded, color: AppColors.danger, size: 20),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Text(context.t('logout'), style: AppText.h2.copyWith(color: AppColors.danger)),
                ),
                const Icon(Icons.chevron_right_rounded, color: AppColors.muted),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
