import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../constants/app_text.dart';
import 'app_card.dart';

/// Compact stat tile used across dashboard overview grids — value, label,
/// icon badge and an optional trend chip.
class StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color tint;
  final String? trend;
  final bool trendUp;

  const StatCard({
    super.key,
    required this.label,
    required this.value,
    required this.icon,
    required this.tint,
    this.trend,
    this.trendUp = true,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(color: tint.withOpacity(0.12), borderRadius: BorderRadius.circular(13)),
                child: Icon(icon, color: tint, size: 20),
              ),
              if (trend != null)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
                  decoration: BoxDecoration(
                    color: (trendUp ? AppColors.success : AppColors.danger).withOpacity(0.12),
                    borderRadius: BorderRadius.circular(40),
                  ),
                  child: Text(trend!,
                      style: AppText.caption.copyWith(color: trendUp ? AppColors.success : AppColors.danger)),
                ),
            ],
          ),
          const SizedBox(height: 16),
          Text(value, style: AppText.statValue),
          const SizedBox(height: 4),
          Text(label, style: AppText.bodyMuted),
        ],
      ),
    );
  }
}
