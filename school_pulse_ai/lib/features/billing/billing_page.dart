import 'package:flutter/material.dart';
import '../../core/constants/app_breakpoints.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/gradient_button.dart';

/// Billing & subscription page — shown to school admins (and the platform
/// super-admin) so they can see their trial status, plan and invoices.
///
/// Phase 1: presentational only — no real payment processing yet. The model
/// is "first month is completely free, then a simple monthly subscription
/// per school", matching the marketing/landing-page pricing teaser.
class BillingPage extends StatelessWidget {
  const BillingPage({super.key});

  static const _plans = [
    (
      'Starter',
      '\$19',
      'Up to 150 students · 1 campus',
      AppColors.riskLowGradient,
      false,
    ),
    (
      'Growth',
      '\$39',
      'Up to 600 students · 3 campuses · Mobile money matching',
      AppColors.heroGradient,
      true,
    ),
    (
      'Network',
      '\$79',
      'Unlimited students · Unlimited campuses · Priority support',
      AppColors.brandGradient,
      false,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    final isDesktop = AppBreakpoints.isDesktop(width);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Billing & subscription', style: AppTextStyles.h1),
          const SizedBox(height: 6),
          Text(
            'Your school\'s plan, trial status and invoices — all in one place.',
            style: AppTextStyles.bodyMuted,
          ),
          const SizedBox(height: 24),
          _TrialBanner(isDesktop: isDesktop),
          const SizedBox(height: 32),
          Text('Choose the plan that fits your school', style: AppTextStyles.h2),
          const SizedBox(height: 6),
          Text(
            'Switch or cancel anytime — your first month is always free, no card required.',
            style: AppTextStyles.bodyMuted,
          ),
          const SizedBox(height: 18),
          LayoutBuilder(builder: (context, constraints) {
            final cols = constraints.maxWidth > 880 ? 3 : (constraints.maxWidth > 560 ? 2 : 1);
            return GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _plans.length,
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: cols,
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                childAspectRatio: cols == 1 ? 1.25 : 0.85,
              ),
              itemBuilder: (context, i) {
                final p = _plans[i];
                return _PlanCard(name: p.$1, price: p.$2, description: p.$3, gradient: p.$4, highlighted: p.$5);
              },
            );
          }),
          const SizedBox(height: 32),
          _InvoiceHistory(),
        ],
      ),
    );
  }
}

class _TrialBanner extends StatelessWidget {
  final bool isDesktop;

  const _TrialBanner({required this.isDesktop});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(isDesktop ? 28 : 20),
      decoration: BoxDecoration(
        gradient: AppColors.brandGradient,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: AppColors.primary.withOpacity(0.25), blurRadius: 40, offset: const Offset(0, 20)),
        ],
      ),
      child: Flex(
        direction: isDesktop ? Axis.horizontal : Axis.vertical,
        crossAxisAlignment: isDesktop ? CrossAxisAlignment.center : CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 3,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.14),
                    borderRadius: BorderRadius.circular(40),
                    border: Border.all(color: Colors.white.withOpacity(0.22)),
                  ),
                  child: Text('FREE TRIAL · 24 DAYS LEFT',
                      style: AppTextStyles.caption.copyWith(color: Colors.white, letterSpacing: 1)),
                ),
                const SizedBox(height: 14),
                Text('You\'re on the house for your first month',
                    style: AppTextStyles.h1.copyWith(color: Colors.white)),
                const SizedBox(height: 8),
                Text(
                  'Every feature is unlocked during your trial. No card on file — '
                  'when you\'re ready, pick a plan below and billing starts only then.',
                  style: AppTextStyles.body.copyWith(color: Colors.white.withOpacity(0.82)),
                ),
              ],
            ),
          ),
          SizedBox(width: isDesktop ? 28 : 0, height: isDesktop ? 0 : 18),
          Expanded(
            flex: 2,
            child: GlassCard(
              opacity: 0.1,
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text('Trial progress', style: AppTextStyles.caption.copyWith(color: Colors.white.withOpacity(0.8))),
                  const SizedBox(height: 10),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: LinearProgressIndicator(
                      value: 0.2,
                      minHeight: 8,
                      backgroundColor: Colors.white.withOpacity(0.18),
                      valueColor: const AlwaysStoppedAnimation(Colors.white),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text('Day 6 of 30', style: AppTextStyles.body.copyWith(color: Colors.white)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _PlanCard extends StatelessWidget {
  final String name;
  final String price;
  final String description;
  final Gradient gradient;
  final bool highlighted;

  const _PlanCard({
    required this.name,
    required this.price,
    required this.description,
    required this.gradient,
    required this.highlighted,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: highlighted ? AppColors.blue.withOpacity(0.5) : AppColors.muted.withOpacity(0.1),
          width: highlighted ? 2 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: (highlighted ? AppColors.blue : AppColors.primary).withOpacity(highlighted ? 0.16 : 0.05),
            blurRadius: 30,
            offset: const Offset(0, 16),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(name, style: AppTextStyles.h2),
              if (highlighted)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(gradient: gradient, borderRadius: BorderRadius.circular(40)),
                  child: Text('MOST POPULAR',
                      style: AppTextStyles.caption.copyWith(color: Colors.white, letterSpacing: 0.6)),
                ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(price, style: AppTextStyles.display.copyWith(fontSize: 36)),
              const SizedBox(width: 4),
              Padding(
                padding: const EdgeInsets.only(bottom: 6),
                child: Text('/ school / month', style: AppTextStyles.bodyMuted),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Expanded(child: Text(description, style: AppTextStyles.bodyMuted)),
          SizedBox(
            width: double.infinity,
            child: highlighted
                ? GradientButton(label: 'Choose $name', icon: Icons.arrow_forward_rounded, onPressed: () {}, gradient: gradient)
                : OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.primary,
                      side: BorderSide(color: AppColors.muted.withOpacity(0.3)),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    onPressed: () {},
                    child: Text('Choose $name'),
                  ),
          ),
        ],
      ),
    );
  }
}

class _InvoiceHistory extends StatelessWidget {
  static const _rows = [
    ('Trial period', 'Jun 2026', '\$0.00', 'Active'),
    ('—', '—', '—', '—'),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.muted.withOpacity(0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Invoice history', style: AppTextStyles.h2),
          const SizedBox(height: 4),
          Text('Your invoices will appear here once billing begins.', style: AppTextStyles.bodyMuted),
          const SizedBox(height: 16),
          ..._rows.map((r) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: Row(
                  children: [
                    Expanded(flex: 2, child: Text(r.$1, style: AppTextStyles.body)),
                    Expanded(child: Text(r.$2, style: AppTextStyles.bodyMuted)),
                    Expanded(child: Text(r.$3, style: AppTextStyles.bodyMuted)),
                    Expanded(
                      child: Align(
                        alignment: Alignment.centerRight,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: AppColors.success.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(40),
                          ),
                          child: Text(r.$4, style: AppTextStyles.caption.copyWith(color: AppColors.success)),
                        ),
                      ),
                    ),
                  ],
                ),
              )),
        ],
      ),
    );
  }
}
