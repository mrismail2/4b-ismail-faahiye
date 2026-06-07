/// Shared responsive breakpoints for Kobciye.
///
/// mobile  : < 600   — bottom navigation, single-column cards
/// tablet  : 600-1023 — bottom navigation, 2-column cards
/// desktop : >= 1024 — sidebar navigation, multi-column dashboards
class AppBreakpoints {
  AppBreakpoints._();

  static const double mobile = 600;
  static const double tablet = 1024;
  static const double desktop = 1440;

  static bool isMobile(double width) => width < mobile;
  static bool isTablet(double width) => width >= mobile && width < tablet;
  static bool isDesktop(double width) => width >= tablet;
}

/// Convenience widget that picks a builder based on the current width —
/// used to switch between mobile/tablet/desktop layouts declaratively.
class ResponsiveLayout {
  ResponsiveLayout._();

  static T value<T>({
    required double width,
    required T mobile,
    T? tablet,
    required T desktop,
  }) {
    if (AppBreakpoints.isDesktop(width)) return desktop;
    if (AppBreakpoints.isTablet(width)) return tablet ?? mobile;
    return mobile;
  }
}
