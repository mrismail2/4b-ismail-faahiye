import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../constants/app_text.dart';

/// Placeholder Kobciye logo widget — built from the brand concept (a "K"
/// mark, an open book / growth motif, and the wordmark + tagline) until a
/// final logo asset is supplied.
///
/// Set [light] to true when placed on a dark/gradient background.
class AppLogo extends StatelessWidget {
  final double size;
  final bool light;
  final bool showWordmark;
  final bool showTagline;

  const AppLogo({
    super.key,
    this.size = 44,
    this.light = false,
    this.showWordmark = true,
    this.showTagline = false,
  });

  @override
  Widget build(BuildContext context) {
    final markColor = light ? Colors.white : AppColors.primary;
    final textColor = light ? Colors.white : AppColors.text;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            gradient: light ? null : AppColors.brandGradient,
            color: light ? Colors.white.withOpacity(0.16) : null,
            borderRadius: BorderRadius.circular(size * 0.28),
            border: light ? Border.all(color: Colors.white.withOpacity(0.3)) : null,
          ),
          child: Center(
            child: Text(
              'K',
              style: TextStyle(
                fontFamily: AppText.fontFamily,
                fontSize: size * 0.52,
                fontWeight: FontWeight.w900,
                color: light ? Colors.white : Colors.white,
                height: 1,
              ),
            ),
          ),
        ),
        if (showWordmark) ...[
          SizedBox(width: size * 0.26),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Kobciye',
                style: AppText.h1.copyWith(color: textColor, fontSize: size * 0.46),
              ),
              if (showTagline)
                Text(
                  'Learn • Grow • Succeed',
                  style: AppText.caption.copyWith(
                    color: light ? Colors.white.withOpacity(0.75) : AppColors.muted,
                  ),
                ),
            ],
          ),
        ],
        if (!showWordmark)
          Padding(
            padding: const EdgeInsets.only(left: 4),
            child: Icon(Icons.auto_stories_rounded, color: markColor, size: size * 0.4),
          ),
      ],
    );
  }
}
