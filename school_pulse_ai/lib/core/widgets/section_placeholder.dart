import 'package:flutter/material.dart';
import '../../services/localization_service.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';

/// Friendly "module coming soon" placeholder used by Phase-1 dashboard shells
/// for sections that will be fully built in later phases
/// (Risk Score, Mobile Money Matching, Qur'an Progress, etc).
class SectionPlaceholder extends StatelessWidget {
  final String titleKey;
  final IconData icon;
  final Gradient gradient;

  const SectionPlaceholder({
    super.key,
    required this.titleKey,
    required this.icon,
    this.gradient = AppColors.heroGradient,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 84,
              height: 84,
              decoration: BoxDecoration(gradient: gradient, shape: BoxShape.circle),
              child: Icon(icon, color: Colors.white, size: 36),
            ),
            const SizedBox(height: 22),
            Text(context.t(titleKey), style: AppTextStyles.h1, textAlign: TextAlign.center),
            const SizedBox(height: 8),
            Text(
              context.t('comingSoon'),
              style: AppTextStyles.bodyMuted,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
