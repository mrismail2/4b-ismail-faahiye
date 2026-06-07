import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/widgets/language_switcher.dart';
import '../../models/app_user.dart';
import '../../services/localization_service.dart';
import '../../services/auth_service.dart';

/// Shared settings page available to every role: language preference,
/// account summary and sign-out.
class SettingsPage extends StatelessWidget {
  final AppUser user;
  final String roleLabelKey;

  const SettingsPage({super.key, required this.user, required this.roleLabelKey});

  @override
  Widget build(BuildContext context) {
    final auth = context.read<AuthService>();
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(context.t('settings'), style: AppTextStyles.h1),
          const SizedBox(height: 18),
          _Card(
            child: Row(
              children: [
                CircleAvatar(
                  radius: 28,
                  backgroundColor: AppColors.blue.withOpacity(0.12),
                  child: Text(
                    user.initials,
                    style: AppTextStyles.h2.copyWith(color: AppColors.blue),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(user.fullName, style: AppTextStyles.h2),
                      const SizedBox(height: 2),
                      Text(user.email, style: AppTextStyles.bodyMuted),
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: AppColors.purple.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          context.t(roleLabelKey),
                          style: AppTextStyles.caption.copyWith(color: AppColors.purple),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          _Card(
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(context.t('language'), style: AppTextStyles.h2),
                      const SizedBox(height: 4),
                      Text(
                        'English / Af-Soomaali',
                        style: AppTextStyles.bodyMuted,
                      ),
                    ],
                  ),
                ),
                const LanguageSwitcher(),
              ],
            ),
          ),
          const SizedBox(height: 16),
          _Card(
            child: Row(
              children: [
                Expanded(
                  child: Text(context.t('logout'), style: AppTextStyles.h2),
                ),
                FilledButton.tonal(
                  style: FilledButton.styleFrom(
                    backgroundColor: AppColors.danger.withOpacity(0.1),
                    foregroundColor: AppColors.danger,
                  ),
                  onPressed: auth.signOut,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.logout_rounded, size: 17),
                      const SizedBox(width: 8),
                      Text(context.t('logout')),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Card extends StatelessWidget {
  final Widget child;

  const _Card({required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.muted.withOpacity(0.08)),
      ),
      child: child,
    );
  }
}
