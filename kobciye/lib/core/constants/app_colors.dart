import 'package:flutter/material.dart';

/// Kobciye brand palette — derived directly from the logo color system.
///
/// "Kobciye" means something that grows, develops and improves — the
/// gradients lean on deep blue (trust) moving toward growth green and a
/// gold accent (achievement / "succeed").
class AppColors {
  AppColors._();

  static const Color primary = Color(0xFF0A2E6B);
  static const Color primaryLight = Color(0xFF1E4F96);
  static const Color success = Color(0xFF4E9B51);
  static const Color accent = Color(0xFFCFAD5E);

  static const Color background = Color(0xFFF7F9FC);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color text = Color(0xFF1A1F2B);
  static const Color border = Color(0xFFD9E1EC);

  /// Secondary semantic tones used across stat cards / alerts.
  static const Color muted = Color(0xFF64748B);
  static const Color danger = Color(0xFFDC2626);
  static const Color warning = Color(0xFFCFAD5E);
  static const Color info = Color(0xFF1E4F96);

  static Color glass(double opacity) => Colors.white.withOpacity(opacity);

  /// Primary brand gradient — deep blue to secondary blue. Used on hero
  /// surfaces, splash background and primary CTA buttons.
  static const LinearGradient brandGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primary, primaryLight],
  );

  /// "Growth" gradient — blue moving into green, used for progress and
  /// success-themed surfaces (e.g. growth/risk-low banners).
  static const LinearGradient growthGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primaryLight, success],
  );

  /// "Succeed" gradient — blue moving into gold, used for achievement /
  /// celebration surfaces (e.g. "Get started", trial banners).
  static const LinearGradient goldGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primary, accent],
  );

  static const LinearGradient riskHighGradient = LinearGradient(
    colors: [Color(0xFFDC2626), Color(0xFFF3851C)],
  );

  static const LinearGradient riskMediumGradient = LinearGradient(
    colors: [accent, Color(0xFFF3851C)],
  );

  static const LinearGradient riskLowGradient = LinearGradient(
    colors: [success, Color(0xFF1E4F96)],
  );
}
