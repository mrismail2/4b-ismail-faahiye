import 'package:flutter/material.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/widgets/stat_card.dart';
import '../../../services/localization_service.dart';

/// Reusable "Overview" landing page for a dashboard shell.
///
/// Shows a section title, a responsive grid of [StatCard]s and an optional
/// highlight banner widget (e.g. a risk alert or a parent reminder).
class OverviewPage extends StatelessWidget {
  final String titleKey;
  final List<StatCard> stats;
  final Widget? highlight;
  final Widget? secondary;

  const OverviewPage({
    super.key,
    required this.titleKey,
    required this.stats,
    this.highlight,
    this.secondary,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(context.t(titleKey), style: AppTextStyles.h1),
          const SizedBox(height: 18),
          LayoutBuilder(builder: (context, constraints) {
            final cols = constraints.maxWidth > 900
                ? 4
                : constraints.maxWidth > 620
                    ? 3
                    : 2;
            return GridView.count(
              crossAxisCount: cols,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 14,
              crossAxisSpacing: 14,
              childAspectRatio: 1.35,
              children: stats,
            );
          }),
          if (highlight != null) ...[
            const SizedBox(height: 22),
            highlight!,
          ],
          if (secondary != null) ...[
            const SizedBox(height: 22),
            secondary!,
          ],
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}
