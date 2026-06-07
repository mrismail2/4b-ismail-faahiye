import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_routes.dart';
import '../../core/widgets/app_logo.dart';
import '../../services/localization_service.dart';

/// Branded splash / boot screen — Kobciye logo, tagline, gradient
/// background and a soft loading indicator while the app initializes.
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with TickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 900),
  )..forward();

  late final Animation<double> _fade = CurvedAnimation(parent: _controller, curve: Curves.easeOut);
  late final Animation<double> _scale =
      Tween<double>(begin: 0.86, end: 1).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOutBack));

  /// Drives a soft breathing pulse on the logo — it doubles as the loading
  /// indicator, so nothing else needs to spin while the app boots.
  late final AnimationController _pulseController = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1100),
  )..repeat(reverse: true);

  late final Animation<double> _pulse =
      Tween<double>(begin: 0.92, end: 1.06).animate(CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut));

  late final Animation<double> _glow =
      Tween<double>(begin: 0.55, end: 1).animate(CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut));

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 1700), () {
      if (mounted) context.go(AppRoutes.onboarding);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(gradient: AppColors.brandGradient),
        child: Center(
          child: FadeTransition(
            opacity: _fade,
            child: ScaleTransition(
              scale: _scale,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  AnimatedBuilder(
                    animation: _pulseController,
                    builder: (context, child) => Opacity(
                      opacity: _glow.value,
                      child: Transform.scale(scale: _pulse.value, child: child),
                    ),
                    child: const AppLogo(size: 44, light: true),
                  ),
                  const SizedBox(height: 18),
                  Text(context.t('tagline'),
                      style: TextStyle(fontSize: 14, color: Colors.white.withOpacity(0.8), letterSpacing: 0.6)),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
