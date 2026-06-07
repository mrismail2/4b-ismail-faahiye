import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_roles.dart';
import '../../core/constants/app_text.dart';
import '../../core/responsive/responsive_layout.dart';
import '../../core/widgets/app_button.dart';
import '../../core/widgets/app_logo.dart';
import '../../core/widgets/language_switcher.dart';
import '../../services/auth_service.dart';
import '../../services/localization_service.dart';
import 'widgets/request_school_account_sheet.dart';

/// Mobile-first login screen — UI only in Phase 1. [AuthService.signIn] is a
/// clearly-marked placeholder for the real Supabase Auth call that lands in
/// Phase 3. Demo quick-access chips let reviewers jump into any role.
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscure = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final auth = context.read<AuthService>();
    final ok = await auth.signIn(email: _emailController.text, password: _passwordController.text);
    if (!mounted) return;
    if (!ok && auth.error != null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(auth.error!)));
    }
  }

  void _useDemo(String email) {
    _emailController.text = email;
    _passwordController.text = 'demo1234';
  }

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    final isDesktop = AppBreakpoints.isDesktop(width);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: isDesktop ? _DesktopLayout(child: _buildCard(context)) : _MobileLayout(child: _buildCard(context)),
    );
  }

  Widget _buildCard(BuildContext context) {
    final auth = context.watch<AuthService>();
    return Container(
      width: double.infinity,
      constraints: const BoxConstraints(maxWidth: 440),
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: AppColors.border),
        boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.08), blurRadius: 50, offset: const Offset(0, 26))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(context.t('welcomeBack'), style: AppText.h1),
              ),
              const LanguageSwitcher(),
            ],
          ),
          const SizedBox(height: 6),
          Text(context.t('signInToContinue'), style: AppText.bodyMuted),
          const SizedBox(height: 28),
          Text(context.t('email'), style: AppText.bodyMuted.copyWith(fontWeight: FontWeight.w700)),
          const SizedBox(height: 8),
          TextField(
            controller: _emailController,
            keyboardType: TextInputType.emailAddress,
            decoration: InputDecoration(hintText: 'name@school.com', prefixIcon: const Icon(Icons.alternate_email_rounded, size: 20)),
          ),
          const SizedBox(height: 18),
          Text(context.t('password'), style: AppText.bodyMuted.copyWith(fontWeight: FontWeight.w700)),
          const SizedBox(height: 8),
          TextField(
            controller: _passwordController,
            obscureText: _obscure,
            decoration: InputDecoration(
              hintText: '••••••••',
              prefixIcon: const Icon(Icons.lock_outline_rounded, size: 20),
              suffixIcon: IconButton(
                onPressed: () => setState(() => _obscure = !_obscure),
                icon: Icon(_obscure ? Icons.visibility_outlined : Icons.visibility_off_outlined, size: 20),
              ),
            ),
          ),
          Align(
            alignment: Alignment.centerRight,
            child: TextButton(onPressed: () {}, child: Text(context.t('forgotPassword'))),
          ),
          const SizedBox(height: 6),
          AppButton(
            label: context.t('signIn'),
            icon: Icons.login_rounded,
            loading: auth.isLoading,
            onPressed: _submit,
          ),
          const SizedBox(height: 14),
          Center(
            child: TextButton.icon(
              onPressed: () => showRequestSchoolAccountSheet(context),
              icon: const Icon(Icons.school_outlined, size: 18),
              label: Text(context.t('requestSchoolAccount')),
            ),
          ),
          const SizedBox(height: 18),
          const Divider(),
          const SizedBox(height: 14),
          Text('Quick demo access', style: AppText.caption),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: AuthService.demoAccounts
                .where((u) => u.role == AppRole.parent || u.role == AppRole.student)
                .map((u) => ActionChip(
                      avatar: const Icon(Icons.bolt_rounded, size: 16, color: AppColors.primaryLight),
                      label: Text(context.t('role_${u.role}')),
                      onPressed: () => _useDemo(u.email),
                    ))
                .toList(),
          ),
        ],
      ),
    );
  }
}

class _DesktopLayout extends StatelessWidget {
  final Widget child;

  const _DesktopLayout({required this.child});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Container(
            decoration: const BoxDecoration(gradient: AppColors.brandGradient),
            padding: const EdgeInsets.all(56),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AppLogo(size: 46, light: true, showTagline: true),
                const SizedBox(height: 28),
                Text('Run your school with confidence',
                    style: AppText.display.copyWith(color: Colors.white, fontSize: 34)),
                const SizedBox(height: 14),
                Text(
                  'One calm, beautiful place for admins, teachers, accountants, parents '
                  'and students — built to grow with your school.',
                  style: AppText.body.copyWith(color: Colors.white.withOpacity(0.8), fontSize: 16),
                ),
                const SizedBox(height: 28),
                ..._FeaturePill.list(),
              ],
            ),
          ),
        ),
        Expanded(
          child: Center(child: SingleChildScrollView(padding: const EdgeInsets.all(32), child: child)),
        ),
      ],
    );
  }
}

class _MobileLayout extends StatelessWidget {
  final Widget child;

  const _MobileLayout({required this.child});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        children: [
          Container(
            width: double.infinity,
            decoration: const BoxDecoration(gradient: AppColors.brandGradient),
            padding: const EdgeInsets.fromLTRB(24, 64, 24, 48),
            child: Column(
              children: [
                AppLogo(size: 44, light: true, showTagline: true),
              ],
            ),
          ),
          Transform.translate(
            offset: const Offset(0, -28),
            child: Padding(padding: const EdgeInsets.symmetric(horizontal: 20), child: child),
          ),
        ],
      ),
    );
  }
}

class _FeaturePill extends StatelessWidget {
  final String label;

  const _FeaturePill({required this.label});

  static List<Widget> list() => const [
        _FeaturePill(label: 'Trusted by school owners and parents'),
        _FeaturePill(label: 'Built with English & Somali in mind'),
        _FeaturePill(label: 'Designed mobile-first, works everywhere'),
      ];

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Container(
            width: 28,
            height: 28,
            decoration: BoxDecoration(color: Colors.white.withOpacity(0.16), borderRadius: BorderRadius.circular(9)),
            child: const Icon(Icons.check_rounded, color: Colors.white, size: 16),
          ),
          const SizedBox(width: 12),
          Expanded(child: Text(label, style: AppText.body.copyWith(color: Colors.white.withOpacity(0.85)))),
        ],
      ),
    );
  }
}
