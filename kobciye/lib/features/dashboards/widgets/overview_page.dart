import 'package:flutter/material.dart';
import '../../../core/constants/app_text.dart';
import '../../../core/widgets/stat_card.dart';
import '../../../services/localization_service.dart';

/// Standard "Overview" page layout — title, responsive stat grid, and an
/// optional highlight banner / secondary section.
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
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(context.t(titleKey), style: AppText.h1),
          const SizedBox(height: 18),
          LayoutBuilder(builder: (context, constraints) {
            final cols = constraints.maxWidth > 920 ? 4 : (constraints.maxWidth > 620 ? 2 : 1);
            return GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: cols,
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              childAspectRatio: cols == 1 ? 2.4 : 1.35,
              children: stats,
            );
          }),
          if (highlight != null) ...[const SizedBox(height: 24), highlight!],
          if (secondary != null) ...[const SizedBox(height: 24), secondary!],
        ],
      ),
    );
  }
}
