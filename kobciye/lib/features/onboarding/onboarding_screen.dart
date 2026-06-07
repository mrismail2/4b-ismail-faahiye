import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_routes.dart';
import '../../core/constants/app_text.dart';
import '../../core/responsive/responsive_layout.dart';
import '../../core/widgets/app_button.dart';
import '../../core/widgets/app_card.dart';
import '../../core/widgets/app_logo.dart';
import '../../core/widgets/language_switcher.dart';
import '../../services/localization_service.dart';

/// Premium landing / onboarding screen — explains what Kobciye does for
/// schools and routes into the rest of the app (Get Started, Login,
/// Request a school account).
class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  static const _capabilities = [
    (Icons.groups_2_rounded, AppColors.primaryLight, 'Manage students', 'Keep every student\'s record, class and family details organized in one place.'),
    (Icons.family_restroom_rounded, AppColors.success, 'Connect with parents', 'Reach parents instantly with updates they can read in Somali or English.'),
    (Icons.fact_check_rounded, AppColors.accent, 'Track attendance', 'Mark attendance in seconds — even offline — with automatic sync.'),
    (Icons.payments_rounded, AppColors.primary, 'Manage payments', 'Stay on top of fees, mobile-money and promises without the spreadsheets.'),
    (Icons.trending_up_rounded, AppColors.primaryLight, 'Monitor student progress', 'Watch attendance, exams and behaviour trends as they happen.'),
    (Icons.insights_rounded, AppColors.danger, 'Detect student risk early', 'Get a clear, explainable signal before a small issue becomes a crisis.'),
    (Icons.menu_book_rounded, AppColors.success, 'Support Qur\'an / Madrasa progress', 'Track Surah, memorization and Tajweed — purpose-built for Madrasa programs.'),
  ];

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    final isDesktop = AppBreakpoints.isDesktop(width);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SingleChildScrollView(
        child: Column(
          children: [
            _Hero(isDesktop: isDesktop),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 24, vertical: isDesktop ? 64 : 40),
              child: Column(
                children: [
                  ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 640),
                    child: Column(
                      children: [
                        Text('Everything your school needs to grow',
                            textAlign: TextAlign.center, style: AppText.h1),
                        const SizedBox(height: 10),
                        Text(
                          'Kobciye brings students, parents, teachers and administrators onto one '
                          'beautiful, intelligent platform — built for schools everywhere, and tuned '
                          'for Somali schools in particular.',
                          textAlign: TextAlign.center,
                          style: AppText.bodyMuted,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                  ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 1080),
                    child: LayoutBuilder(builder: (context, constraints) {
                      final cols = constraints.maxWidth > 880 ? 3 : (constraints.maxWidth > 580 ? 2 : 1);
                      return GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: _capabilities.length,
                        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: cols,
                          mainAxisSpacing: 16,
                          crossAxisSpacing: 16,
                          childAspectRatio: cols == 1 ? 1.7 : 1.15,
                        ),
                        itemBuilder: (context, i) {
                          final c = _capabilities[i];
                          return _CapabilityCard(icon: c.$1, tint: c.$2, title: c.$3, body: c.$4);
                        },
                      );
                    }),
                  ),
                ],
              ),
            ),
            _FutureFeatures(isDesktop: isDesktop),
          ],
        ),
      ),
    );
  }
}

class _FutureFeatures extends StatelessWidget {
  final bool isDesktop;

  const _FutureFeatures({required this.isDesktop});

  static const _features = [
    (Icons.insights_rounded, AppColors.danger, 'Student Risk Score', 'Explainable Low/Medium/High signals built from attendance, fees and exam trends.'),
    (Icons.translate_rounded, AppColors.primaryLight, 'Parent Somali Report', 'Weekly family updates written automatically in Somali and English.'),
    (Icons.phone_iphone_rounded, AppColors.success, 'Mobile Money Matching', 'Incoming mobile-money payments matched to the right student automatically.'),
    (Icons.handshake_rounded, AppColors.accent, 'Fee Promise System', 'Track and follow up on payment promises without awkward conversations.'),
    (Icons.wifi_off_rounded, AppColors.primary, 'Offline Attendance', 'Mark attendance with no signal — records sync the moment you\'re back online.'),
    (Icons.menu_book_rounded, AppColors.success, 'Qur\'an / Madrasa Progress', 'Track Surah, memorization and Tajweed level for Madrasa programs.'),
    (Icons.timeline_rounded, AppColors.primaryLight, 'Parent Trust Timeline', 'A friendly day-by-day story of each child\'s school life that builds trust.'),
    (Icons.bar_chart_rounded, AppColors.accent, 'Teacher Workload Dashboard', 'A clear view of class load and pending tasks so no teacher is overwhelmed.'),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: AppColors.surface,
      padding: EdgeInsets.symmetric(horizontal: 24, vertical: isDesktop ? 64 : 40),
      child: Column(
        children: [
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 640),
            child: Column(
              children: [
                Text('What\'s growing next for Kobciye', textAlign: TextAlign.center, style: AppText.h1),
                const SizedBox(height: 10),
                Text(
                  'These signature modules are being built with care and will roll out in '
                  'upcoming phases — designed specifically around how schools actually work.',
                  textAlign: TextAlign.center,
                  style: AppText.bodyMuted,
                ),
              ],
            ),
          ),
          const SizedBox(height: 28),
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1080),
            child: LayoutBuilder(builder: (context, constraints) {
              final cols = constraints.maxWidth > 880 ? 4 : (constraints.maxWidth > 580 ? 2 : 1);
              return GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _features.length,
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: cols,
                  mainAxisSpacing: 16,
                  crossAxisSpacing: 16,
                  childAspectRatio: cols == 1 ? 1.55 : 0.92,
                ),
                itemBuilder: (context, i) {
                  final f = _features[i];
                  return FeatureTeaserCard(
                    icon: f.$1,
                    tint: f.$2,
                    title: f.$3,
                    description: f.$4,
                    badgeLabel: context.t('comingSoon'),
                  );
                },
              );
            }),
          ),
        ],
      ),
    );
  }
}

class _Hero extends StatelessWidget {
  final bool isDesktop;

  const _Hero({required this.isDesktop});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(gradient: AppColors.brandGradient),
      padding: EdgeInsets.fromLTRB(24, isDesktop ? 24 : 18, 24, isDesktop ? 72 : 52),
      child: Column(
        children: [
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1180),
            child: Row(
              children: [
                AppLogo(size: 36, light: true),
                const Spacer(),
                const LanguageSwitcher(dark: true),
              ],
            ),
          ),
          SizedBox(height: isDesktop ? 56 : 36),
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 720),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(40),
                    border: Border.all(color: Colors.white.withOpacity(0.22)),
                  ),
                  child: Text('🌱  Kobciye — something that grows',
                      style: AppText.caption.copyWith(color: Colors.white.withOpacity(0.85))),
                ),
                const SizedBox(height: 22),
                Text('A school platform that helps every student grow',
                    textAlign: TextAlign.center,
                    style: AppText.display.copyWith(color: Colors.white, fontSize: isDesktop ? 44 : 30, height: 1.18)),
                const SizedBox(height: 16),
                Text(
                  'Kobciye gives schools, teachers and parents one trusted place to manage '
                  'students, attendance, payments, exams and Qur\'an progress — and to spot '
                  'students who need support, early.',
                  textAlign: TextAlign.center,
                  style: AppText.body.copyWith(color: Colors.white.withOpacity(0.8), fontSize: 15.5),
                ),
                const SizedBox(height: 6),
                Text(context.t('tagline'),
                    style: AppText.body.copyWith(color: Colors.white.withOpacity(0.65), fontWeight: FontWeight.w700)),
                const SizedBox(height: 30),
                Wrap(
                  alignment: WrapAlignment.center,
                  spacing: 14,
                  runSpacing: 14,
                  children: [
                    SizedBox(
                      width: 200,
                      child: AppButton(
                        label: context.t('getStarted'),
                        icon: Icons.arrow_forward_rounded,
                        gradient: AppColors.goldGradient,
                        onPressed: () => context.go(AppRoutes.login),
                      ),
                    ),
                    SizedBox(
                      width: 160,
                      height: 56,
                      child: OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.white,
                          side: BorderSide(color: Colors.white.withOpacity(0.4)),
                        ),
                        onPressed: () => context.go(AppRoutes.login),
                        child: Text(context.t('login')),
                      ),
                    ),
                    SizedBox(
                      width: 220,
                      height: 56,
                      child: TextButton(
                        style: TextButton.styleFrom(foregroundColor: Colors.white.withOpacity(0.85)),
                        onPressed: () => context.go(AppRoutes.login),
                        child: Text(context.t('requestSchoolAccount')),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _CapabilityCard extends StatelessWidget {
  final IconData icon;
  final Color tint;
  final String title;
  final String body;

  const _CapabilityCard({required this.icon, required this.tint, required this.title, required this.body});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(color: AppColors.primary.withOpacity(0.05), blurRadius: 26, offset: const Offset(0, 12)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 46,
            height: 46,
            decoration: BoxDecoration(color: tint.withOpacity(0.12), borderRadius: BorderRadius.circular(14)),
            child: Icon(icon, color: tint, size: 22),
          ),
          const SizedBox(height: 16),
          Text(title, style: AppText.h2),
          const SizedBox(height: 6),
          Expanded(child: Text(body, style: AppText.bodyMuted)),
        ],
      ),
    );
  }
}
