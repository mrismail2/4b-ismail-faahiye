import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text.dart';

/// Gradient call-to-action banner used to surface the single most important
/// thing a user should look at right now.
class HighlightBanner extends StatelessWidget {
  final String title;
  final String message;
  final IconData icon;
  final Gradient gradient;
  final String? actionLabel;

  const HighlightBanner({
    super.key,
    required this.title,
    required this.message,
    required this.icon,
    this.gradient = AppColors.brandGradient,
    this.actionLabel,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        gradient: gradient,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.18), blurRadius: 36, offset: const Offset(0, 18))],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 46,
            height: 46,
            decoration: BoxDecoration(color: Colors.white.withOpacity(0.16), borderRadius: BorderRadius.circular(14)),
            child: Icon(icon, color: Colors.white, size: 22),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: AppText.h2.copyWith(color: Colors.white)),
                const SizedBox(height: 6),
                Text(message, style: AppText.body.copyWith(color: Colors.white.withOpacity(0.85))),
                if (actionLabel != null) ...[
                  const SizedBox(height: 14),
                  OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.white,
                      side: BorderSide(color: Colors.white.withOpacity(0.4)),
                      minimumSize: const Size(0, 42),
                      padding: const EdgeInsets.symmetric(horizontal: 18),
                    ),
                    onPressed: () {},
                    child: Text(actionLabel!),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
