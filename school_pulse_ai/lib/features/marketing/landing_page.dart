import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_breakpoints.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/gradient_button.dart';
import '../../core/widgets/language_switcher.dart';
import '../../services/localization_service.dart';

/// Public marketing / landing page shown before sign-in.
///
/// This is the "front door" of School Pulse AI — designed to be premium,
/// emotionally engaging and to clearly differentiate the product from
/// ordinary school-management software.
class LandingPage extends StatelessWidget {
  const LandingPage({super.key});

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
            _FeatureGrid(isDesktop: isDesktop),
            _DifferentiatorBanner(isDesktop: isDesktop),
            _PricingTeaser(isDesktop: isDesktop),
            _Footer(),
          ],
        ),
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
      padding: EdgeInsets.fromLTRB(24, isDesktop ? 28 : 20, 24, isDesktop ? 76 : 56),
      child: Column(
        children: [
          // Top bar
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1180),
            child: Row(
              children: [
                Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    gradient: AppColors.heroGradient,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.bolt_rounded, color: Colors.white, size: 20),
                ),
                const SizedBox(width: 10),
                Text(context.t('appName'),
                    style: AppTextStyles.h2.copyWith(color: Colors.white)),
                const Spacer(),
                const LanguageSwitcher(dark: true),
                const SizedBox(width: 12),
                OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white,
                    side: BorderSide(color: Colors.white.withOpacity(0.4)),
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                  ),
                  onPressed: () => context.go('/login'),
                  child: Text(context.t('signIn')),
                ),
              ],
            ),
          ),
          SizedBox(height: isDesktop ? 64 : 40),
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 760),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(40),
                    border: Border.all(color: Colors.white.withOpacity(0.2)),
                  ),
                  child: Text(
                    '✨  Beyond school management — school intelligence',
                    style: AppTextStyles.caption.copyWith(color: Colors.white.withOpacity(0.85)),
                  ),
                ),
                const SizedBox(height: 22),
                Text(
                  'See every student\'s story —\nbefore it becomes a crisis',
                  textAlign: TextAlign.center,
                  style: AppTextStyles.display.copyWith(
                    color: Colors.white,
                    fontSize: isDesktop ? 48 : 32,
                    height: 1.15,
                  ),
                ),
                const SizedBox(height: 18),
                Text(
                  'School Pulse AI spots at-risk students early, keeps parents in the loop in '
                  'Somali and English, matches mobile-money payments automatically, and tracks '
                  'attendance — even offline.',
                  textAlign: TextAlign.center,
                  style: AppTextStyles.body.copyWith(
                    color: Colors.white.withOpacity(0.78),
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 32),
                Wrap(
                  alignment: WrapAlignment.center,
                  spacing: 14,
                  runSpacing: 14,
                  children: [
                    SizedBox(
                      width: 220,
                      child: GradientButton(
                        label: 'Start free for 30 days',
                        icon: Icons.arrow_forward_rounded,
                        onPressed: () => context.go('/login'),
                      ),
                    ),
                    SizedBox(
                      width: 200,
                      height: 54,
                      child: OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.white,
                          side: BorderSide(color: Colors.white.withOpacity(0.4)),
                        ),
                        onPressed: () => context.go('/login'),
                        child: const Text('Explore demo dashboards'),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                Text(
                  'No credit card needed · First month completely free',
                  style: AppTextStyles.caption.copyWith(color: Colors.white.withOpacity(0.55)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _FeatureGrid extends StatelessWidget {
  final bool isDesktop;

  const _FeatureGrid({required this.isDesktop});

  static const _features = [
    (Icons.insights_rounded, AppColors.danger, 'Student Risk Score',
        'Explainable risk levels — Low, Medium, High — built from attendance, fees, exam trends and teacher notes. Always with a clear "why" and a recommended next step.'),
    (Icons.forum_rounded, AppColors.blue, 'Parent Communication',
        'Weekly updates generated automatically in Somali and English, ready to send by SMS, WhatsApp, voice note or push notification.'),
    (Icons.phone_iphone_rounded, AppColors.purple, 'Mobile Money Matching',
        'Automatically match incoming mobile-money payments to the right student, class and month — flagging anything that needs human review.'),
    (Icons.wifi_off_rounded, AppColors.success, 'Offline Attendance',
        'Teachers keep marking attendance with no signal. Records sync the moment connectivity returns — with built-in duplicate protection.'),
    (Icons.menu_book_rounded, AppColors.gold, 'Qur\'an / Madrasa Progress',
        'Track Surah, ayah ranges, memorization, revision status and Tajweed level — purpose-built for Madrasa programs.'),
    (Icons.timeline_rounded, AppColors.orange, 'Parent Trust Timeline',
        'A friendly day-by-day story of each child\'s school life — attendance, results, payments and notes — that builds real trust with families.'),
  ];

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 24, vertical: isDesktop ? 72 : 48),
      child: Column(
        children: [
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 640),
            child: Column(
              children: [
                Text('Built for what ordinary school systems miss',
                    textAlign: TextAlign.center, style: AppTextStyles.h1),
                const SizedBox(height: 10),
                Text(
                  'Most platforms stop at managing students, payments, attendance and exams. '
                  'School Pulse AI goes further — turning your school\'s data into early warnings and trusted relationships.',
                  textAlign: TextAlign.center,
                  style: AppTextStyles.bodyMuted,
                ),
              ],
            ),
          ),
          const SizedBox(height: 36),
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1180),
            child: LayoutBuilder(builder: (context, constraints) {
              final cols = constraints.maxWidth > 920 ? 3 : (constraints.maxWidth > 600 ? 2 : 1);
              return GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _features.length,
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: cols,
                  mainAxisSpacing: 16,
                  crossAxisSpacing: 16,
                  childAspectRatio: cols == 1 ? 1.5 : 1.05,
                ),
                itemBuilder: (context, i) {
                  final f = _features[i];
                  return _FeatureCard(icon: f.$1, tint: f.$2, title: f.$3, body: f.$4);
                },
              );
            }),
          ),
        ],
      ),
    );
  }
}

class _FeatureCard extends StatelessWidget {
  final IconData icon;
  final Color tint;
  final String title;
  final String body;

  const _FeatureCard({required this.icon, required this.tint, required this.title, required this.body});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.muted.withOpacity(0.08)),
        boxShadow: [
          BoxShadow(color: AppColors.primary.withOpacity(0.05), blurRadius: 28, offset: const Offset(0, 14)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(color: tint.withOpacity(0.12), borderRadius: BorderRadius.circular(15)),
            child: Icon(icon, color: tint, size: 24),
          ),
          const SizedBox(height: 18),
          Text(title, style: AppTextStyles.h2),
          const SizedBox(height: 8),
          Expanded(child: Text(body, style: AppTextStyles.bodyMuted)),
        ],
      ),
    );
  }
}

class _DifferentiatorBanner extends StatelessWidget {
  final bool isDesktop;

  const _DifferentiatorBanner({required this.isDesktop});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 1180),
        child: Container(
          padding: EdgeInsets.all(isDesktop ? 40 : 26),
          decoration: BoxDecoration(
            gradient: AppColors.heroGradient,
            borderRadius: BorderRadius.circular(28),
            boxShadow: [
              BoxShadow(color: AppColors.blue.withOpacity(0.25), blurRadius: 50, offset: const Offset(0, 24)),
            ],
          ),
          child: isDesktop
              ? Row(children: _bannerChildren(context, isDesktop))
              : Column(crossAxisAlignment: CrossAxisAlignment.start, children: _bannerChildren(context, isDesktop)),
        ),
      ),
    );
  }

  List<Widget> _bannerChildren(BuildContext context, bool isDesktop) {
    final text = Expanded(
      flex: 3,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Every school is its own world',
              style: AppTextStyles.h1.copyWith(color: Colors.white)),
          const SizedBox(height: 10),
          Text(
            'Your school\'s data belongs to your school — fully isolated from every other '
            'school on the platform. Parents only see their own children. Teachers only see their own classes. '
            'Nothing crosses the line, by design and by database policy.',
            style: AppTextStyles.body.copyWith(color: Colors.white.withOpacity(0.85)),
          ),
        ],
      ),
    );
    final badge = Expanded(
      flex: 2,
      child: Padding(
        padding: EdgeInsets.only(top: isDesktop ? 0 : 22, left: isDesktop ? 28 : 0),
        child: Wrap(
          spacing: 10,
          runSpacing: 10,
          children: const [
            _TrustChip(icon: Icons.lock_rounded, label: 'Row-level data isolation'),
            _TrustChip(icon: Icons.shield_rounded, label: 'Per-school privacy'),
            _TrustChip(icon: Icons.verified_user_rounded, label: 'Role-based access'),
          ],
        ),
      ),
    );
    return [text, badge];
  }
}

class _TrustChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _TrustChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.12),
        borderRadius: BorderRadius.circular(40),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: Colors.white),
          const SizedBox(width: 8),
          Text(label, style: AppTextStyles.caption.copyWith(color: Colors.white)),
        ],
      ),
    );
  }
}

class _PricingTeaser extends StatelessWidget {
  final bool isDesktop;

  const _PricingTeaser({required this.isDesktop});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 24, vertical: isDesktop ? 72 : 48),
      child: Column(
        children: [
          Text('Simple pricing — start with a full month, free',
              textAlign: TextAlign.center, style: AppTextStyles.h1),
          const SizedBox(height: 10),
          Text(
            'Every school gets 30 days free, no card required. After that, choose the plan that fits your school.',
            textAlign: TextAlign.center,
            style: AppTextStyles.bodyMuted,
          ),
          const SizedBox(height: 30),
          GlassCard(
            opacity: 0.04,
            blur: 0,
            padding: const EdgeInsets.all(28),
            borderRadius: 24,
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    gradient: AppColors.riskLowGradient,
                    borderRadius: BorderRadius.circular(40),
                  ),
                  child: Text('MONTH 1 — ON THE HOUSE',
                      style: AppTextStyles.caption.copyWith(color: Colors.white, letterSpacing: 1)),
                ),
                const SizedBox(height: 14),
                Text('\$0', style: AppTextStyles.display.copyWith(color: AppColors.text, fontSize: 44)),
                Text('for your first 30 days — every feature included', style: AppTextStyles.bodyMuted),
                const SizedBox(height: 20),
                GradientButton(
                  label: 'Activate free trial',
                  icon: Icons.celebration_rounded,
                  onPressed: () => context.go('/login'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Footer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 24),
      color: AppColors.primary,
      child: Column(
        children: [
          Text('School Pulse AI', style: AppTextStyles.h2.copyWith(color: Colors.white)),
          const SizedBox(height: 6),
          Text('School Intelligence, Reimagined',
              style: AppTextStyles.bodyMuted.copyWith(color: Colors.white.withOpacity(0.5))),
          const SizedBox(height: 16),
          Text('© ${DateTime.now().year} School Pulse AI. All rights reserved.',
              style: AppTextStyles.caption.copyWith(color: Colors.white.withOpacity(0.35))),
        ],
      ),
    );
  }
}
