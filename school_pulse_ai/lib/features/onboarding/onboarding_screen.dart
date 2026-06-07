import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/router/role_redirect.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/widgets/gradient_button.dart';
import '../../services/auth_service.dart';

/// One-time welcome tour shown right after a user's first sign-in.
///
/// Phase 1: a short, branded swipeable intro that orients new users (whatever
/// their role) before they land on their dashboard. The "seen" flag is
/// persisted locally so returning users skip straight to their dashboard.
class OnboardingScreen extends StatefulWidget {
  final AuthService auth;

  const OnboardingScreen({super.key, required this.auth});

  static const _prefsKey = 'school_pulse_onboarding_seen';

  static Future<bool> hasBeenSeen() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_prefsKey) ?? false;
  }

  static Future<void> markSeen() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_prefsKey, true);
  }

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _controller = PageController();
  int _page = 0;

  static const _slides = [
    (
      Icons.insights_rounded,
      AppColors.riskHighGradient,
      'Spot at-risk students early',
      'School Pulse AI quietly watches attendance, fees, exam trends and teacher notes — '
          'and turns them into a clear, explainable risk score with a recommended next step.',
    ),
    (
      Icons.forum_rounded,
      AppColors.heroGradient,
      'Keep parents close, in their language',
      'Weekly updates are written automatically in Somali and English, ready to send by '
          'SMS, WhatsApp, voice note or push — building real trust with every family.',
    ),
    (
      Icons.lock_rounded,
      AppColors.brandGradient,
      'Your school\'s data stays your school\'s',
      'Every school is fully isolated — parents only see their own children, teachers only '
          'see their own classes, and nothing ever crosses the line.',
    ),
  ];

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _finish() async {
    await OnboardingScreen.markSeen();
    if (!mounted) return;
    final user = widget.auth.currentUser;
    context.go(user == null ? '/login' : roleHomeRoute(user.role));
  }

  @override
  Widget build(BuildContext context) {
    final isLast = _page == _slides.length - 1;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            Align(
              alignment: Alignment.topRight,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: TextButton(
                  onPressed: _finish,
                  child: Text('Skip', style: AppTextStyles.body.copyWith(color: AppColors.muted)),
                ),
              ),
            ),
            Expanded(
              child: PageView.builder(
                controller: _controller,
                itemCount: _slides.length,
                onPageChanged: (i) => setState(() => _page = i),
                itemBuilder: (context, i) {
                  final s = _slides[i];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 32),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 96,
                          height: 96,
                          decoration: BoxDecoration(gradient: s.$2, borderRadius: BorderRadius.circular(28)),
                          child: Icon(s.$1, color: Colors.white, size: 44),
                        ),
                        const SizedBox(height: 32),
                        Text(s.$3, textAlign: TextAlign.center, style: AppTextStyles.display.copyWith(fontSize: 26)),
                        const SizedBox(height: 14),
                        ConstrainedBox(
                          constraints: const BoxConstraints(maxWidth: 460),
                          child: Text(s.$4,
                              textAlign: TextAlign.center,
                              style: AppTextStyles.body.copyWith(color: AppColors.muted, fontSize: 15)),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(_slides.length, (i) {
                final active = i == _page;
                return AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: active ? 24 : 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: active ? AppColors.blue : AppColors.muted.withOpacity(0.25),
                    borderRadius: BorderRadius.circular(40),
                  ),
                );
              }),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(32, 28, 32, 32),
              child: SizedBox(
                width: double.infinity,
                child: GradientButton(
                  label: isLast ? 'Get started' : 'Next',
                  icon: isLast ? Icons.celebration_rounded : Icons.arrow_forward_rounded,
                  onPressed: () {
                    if (isLast) {
                      _finish();
                    } else {
                      _controller.nextPage(duration: const Duration(milliseconds: 300), curve: Curves.easeOut);
                    }
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
