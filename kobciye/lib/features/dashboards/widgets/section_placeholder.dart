import 'package:flutter/material.dart';
import '../../../core/constants/app_text.dart';
import '../../../services/localization_service.dart';

/// Clean "coming in a later phase" empty-state panel for nav sections that
/// don't have real content yet.
class SectionPlaceholder extends StatelessWidget {
  final String titleKey;
  final IconData icon;
  final Gradient gradient;

  const SectionPlaceholder({super.key, required this.titleKey, required this.icon, required this.gradient});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 88,
            height: 88,
            decoration: BoxDecoration(gradient: gradient, borderRadius: BorderRadius.circular(28)),
            child: Icon(icon, color: Colors.white, size: 38),
          ),
          const SizedBox(height: 22),
          Text(context.t(titleKey), style: AppText.h1),
          const SizedBox(height: 8),
          Text(context.t('comingSoon'), style: AppText.bodyMuted),
        ],
      ),
    );
  }
}
