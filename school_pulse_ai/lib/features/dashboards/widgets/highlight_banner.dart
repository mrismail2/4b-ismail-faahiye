import 'package:flutter/material.dart';
import '../../../core/theme/app_text_styles.dart';

/// Gradient highlight banner used to surface the single most important
/// action on a dashboard — e.g. "Ahmed Ali — High Risk — Call parent today".
class HighlightBanner extends StatelessWidget {
  final String title;
  final String message;
  final IconData icon;
  final Gradient gradient;
  final String? actionLabel;
  final VoidCallback? onAction;

  const HighlightBanner({
    super.key,
    required this.title,
    required this.message,
    required this.icon,
    required this.gradient,
    this.actionLabel,
    this.onAction,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        gradient: gradient,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.12), blurRadius: 30, offset: const Offset(0, 14)),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 46,
            height: 46,
            decoration: BoxDecoration(color: Colors.white.withOpacity(0.18), borderRadius: BorderRadius.circular(14)),
            child: Icon(icon, color: Colors.white, size: 22),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: AppTextStyles.h2.copyWith(color: Colors.white)),
                const SizedBox(height: 6),
                Text(message, style: AppTextStyles.body.copyWith(color: Colors.white.withOpacity(0.88))),
                if (actionLabel != null) ...[
                  const SizedBox(height: 14),
                  OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: Colors.white.withOpacity(0.6)),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                    ),
                    onPressed: onAction,
                    child: Text(actionLabel!, style: AppTextStyles.button.copyWith(color: Colors.white)),
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
