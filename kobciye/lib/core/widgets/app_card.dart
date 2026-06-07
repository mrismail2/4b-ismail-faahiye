import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../constants/app_text.dart';

/// Standard rounded surface card with soft shadow — the base building block
/// for stat tiles, feature cards and section panels across the app.
class AppCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final double borderRadius;
  final VoidCallback? onTap;

  const AppCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(20),
    this.borderRadius = 20,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final card = Container(
      padding: padding,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(color: AppColors.primary.withOpacity(0.05), blurRadius: 26, offset: const Offset(0, 12)),
        ],
      ),
      child: child,
    );

    if (onTap == null) return card;
    return Material(
      color: Colors.transparent,
      borderRadius: BorderRadius.circular(borderRadius),
      child: InkWell(borderRadius: BorderRadius.circular(borderRadius), onTap: onTap, child: card),
    );
  }
}

/// A "coming in a later phase" feature teaser card — icon, title, short
/// description and a soft badge.
class FeatureTeaserCard extends StatelessWidget {
  final IconData icon;
  final Color tint;
  final String title;
  final String description;
  final String badgeLabel;

  const FeatureTeaserCard({
    super.key,
    required this.icon,
    required this.tint,
    required this.title,
    required this.description,
    required this.badgeLabel,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(color: tint.withOpacity(0.12), borderRadius: BorderRadius.circular(14)),
            child: Icon(icon, color: tint, size: 23),
          ),
          const SizedBox(height: 16),
          Text(title, style: AppText.h2),
          const SizedBox(height: 6),
          Expanded(child: Text(description, style: AppText.bodyMuted)),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.accent.withOpacity(0.16),
              borderRadius: BorderRadius.circular(40),
            ),
            child: Text(badgeLabel,
                style: AppText.caption.copyWith(color: const Color(0xFF8A6D2A), letterSpacing: 0.4)),
          ),
        ],
      ),
    );
  }
}
