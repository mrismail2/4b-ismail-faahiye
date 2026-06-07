import 'package:flutter/material.dart';

/// School Pulse AI brand palette.
class AppColors {
  AppColors._();

  static const Color primary = Color(0xFF021454);
  static const Color blue = Color(0xFF175DED);
  static const Color purple = Color(0xFF6B28CB);
  static const Color pink = Color(0xFFC80D97);
  static const Color orange = Color(0xFFF3851C);
  static const Color gold = Color(0xFFF7B500);

  static const Color background = Color(0xFFF7F9FC);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color text = Color(0xFF07112F);
  static const Color muted = Color(0xFF64748B);

  static const Color success = Color(0xFF059669);
  static const Color danger = Color(0xFFDC2626);
  static const Color warning = Color(0xFFF59E0B);

  /// Primary brand gradient used on hero surfaces, buttons and active states.
  static const LinearGradient heroGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [blue, purple],
  );

  /// Wider brand gradient for splash / onboarding backgrounds.
  static const LinearGradient brandGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primary, blue, purple],
  );

  static const LinearGradient riskHighGradient = LinearGradient(
    colors: [danger, pink],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient riskMediumGradient = LinearGradient(
    colors: [warning, orange],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient riskLowGradient = LinearGradient(
    colors: [success, blue],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  /// Soft glass tint used on top of background images / gradients.
  static Color glass(double opacity) => Colors.white.withOpacity(opacity);
}
