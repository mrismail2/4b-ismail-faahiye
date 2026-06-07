import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../l10n/app_strings.dart';
import '../../services/localization_service.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';

/// Pill-shaped EN / SO toggle. Default language is English.
class LanguageSwitcher extends StatelessWidget {
  final bool dark;

  const LanguageSwitcher({super.key, this.dark = false});

  @override
  Widget build(BuildContext context) {
    final loc = context.watch<LocalizationService>();
    final fg = dark ? Colors.white : AppColors.text;
    final bg = dark ? Colors.white.withOpacity(0.12) : AppColors.background;
    final border = dark ? Colors.white.withOpacity(0.2) : AppColors.muted.withOpacity(0.16);

    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: bg,
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
              duration: const Duration(milliseconds: 180),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                gradient: selected ? AppColors.heroGradient : null,
                borderRadius: BorderRadius.circular(40),
              ),
              child: Text(
                lang.code.toUpperCase(),
                style: AppTextStyles.caption.copyWith(
                  color: selected ? Colors.white : fg.withOpacity(0.6),
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
