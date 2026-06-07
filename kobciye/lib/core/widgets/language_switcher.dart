import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../l10n/app_strings.dart';
import '../../services/localization_service.dart';
import '../constants/app_colors.dart';
import '../constants/app_text.dart';

/// Compact EN / SO pill switcher. Set [dark] to true when placed on a
/// gradient/dark hero background.
class LanguageSwitcher extends StatelessWidget {
  final bool dark;

  const LanguageSwitcher({super.key, this.dark = false});

  @override
  Widget build(BuildContext context) {
    final loc = context.watch<LocalizationService>();
    final track = dark ? Colors.white.withOpacity(0.12) : AppColors.background;
    final border = dark ? Colors.white.withOpacity(0.25) : AppColors.border;
    final inactiveText = dark ? Colors.white.withOpacity(0.7) : AppColors.muted;

    return Container(
      padding: const EdgeInsets.all(3),
      decoration: BoxDecoration(
        color: track,
        borderRadius: BorderRadius.circular(40),
        border: Border.all(color: border),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: AppLanguage.values.map((lang) {
          final selected = loc.language == lang;
          return GestureDetector(
            onTap: () => loc.setLanguage(lang),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 160),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
              decoration: BoxDecoration(
                gradient: selected ? AppColors.brandGradient : null,
                color: selected && dark ? Colors.white : null,
                borderRadius: BorderRadius.circular(40),
              ),
              child: Text(
                lang.code.toUpperCase(),
                style: AppText.caption.copyWith(
                  color: selected ? (dark ? AppColors.primary : Colors.white) : inactiveText,
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
