import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../constants/app_text.dart';

/// Path to the bundled Kobciye wordmark artwork (added via `assets/logo/`).
const String _logoAssetPath = 'assets/logo/kobciye-logo.png';

/// Kobciye wordmark.
///
/// Prefers the bundled logo artwork ([_logoAssetPath]) when it can be loaded
/// and the surface is light enough for its dark-blue/gold colorway to read
/// well. Falls back to a drawn wordmark — "Kobciye" with the brand's
/// signature gold dot over the "i" — when the asset is missing (or when
/// [light] is true and we need a white-on-dark version instead).
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
    final wordmark = light
        ? _DrawnWordmark(size: size, color: Colors.white)
        : Image.asset(
            _logoAssetPath,
            height: size * 1.05,
            fit: BoxFit.contain,
            errorBuilder: (context, error, stackTrace) =>
                _DrawnWordmark(size: size, color: AppColors.primary),
          );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        wordmark,
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

/// Text-drawn fallback wordmark — "Kobciye" with a gold dot over the "i" —
/// used when the logo artwork can't be loaded, or when a white wordmark is
/// needed on dark/gradient surfaces.
class _DrawnWordmark extends StatelessWidget {
  final double size;
  final Color color;

  const _DrawnWordmark({required this.size, required this.color});

  @override
  Widget build(BuildContext context) {
    final style = TextStyle(
      fontFamily: AppText.fontFamily,
      fontSize: size,
      fontWeight: FontWeight.w800,
      letterSpacing: -0.5,
      height: 1,
      color: color,
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

    return SizedBox(
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
    );
  }
}
