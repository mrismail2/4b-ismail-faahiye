import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../constants/app_text.dart';

/// Kobciye wordmark — renders "Kobciye" with the brand's signature gold dot
/// over the "i", matching the supplied logo artwork (no background plate, so
/// it drops cleanly onto any surface).
///
/// Set [light] to true when placed on a dark/gradient background.
class AppLogo extends StatelessWidget {
  final double size;
  final bool light;
  final bool showTagline;

  const AppLogo({
    super.key,
    this.size = 40,
    this.light = false,
    this.showTagline = false,
  });

  @override
  Widget build(BuildContext context) {
    final wordmarkColor = light ? Colors.white : AppColors.primary;
    final style = TextStyle(
      fontFamily: AppText.fontFamily,
      fontSize: size,
      fontWeight: FontWeight.w800,
      letterSpacing: -0.5,
      height: 1,
      color: wordmarkColor,
    );

    // "ı" (dotless i) lets us draw the wordmark's "i" without its dot, so we
    // can overlay our own gold dot exactly where the brand mark places it.
    final full = TextPainter(
      text: TextSpan(text: 'Kobcıye', style: style),
      textDirection: TextDirection.ltr,
    )..layout();
    final prefix = TextPainter(
      text: TextSpan(text: 'Kobc', style: style),
      textDirection: TextDirection.ltr,
    )..layout();
    final dotlessI = TextPainter(
      text: TextSpan(text: 'ı', style: style),
      textDirection: TextDirection.ltr,
    )..layout();

    final dotSize = size * 0.17;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: full.width,
          height: full.height,
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              Text('Kobcıye', style: style),
              Positioned(
                left: prefix.width + dotlessI.width / 2 - dotSize / 2,
                top: size * 0.04,
                child: Container(
                  width: dotSize,
                  height: dotSize,
                  decoration: const BoxDecoration(color: AppColors.accent, shape: BoxShape.circle),
                ),
              ),
            ],
          ),
        ),
        if (showTagline) ...[
          SizedBox(height: size * 0.12),
          Text(
            'Learn • Grow • Succeed',
            style: AppText.caption.copyWith(
              color: light ? Colors.white.withOpacity(0.75) : AppColors.muted,
            ),
          ),
        ],
      ],
    );
  }
}
