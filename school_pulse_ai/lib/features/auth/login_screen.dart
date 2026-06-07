import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_breakpoints.dart';
import '../../core/router/role_redirect.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/gradient_button.dart';
import '../../core/widgets/language_switcher.dart';
import '../../models/app_user.dart';
import '../../services/auth_service.dart';
import '../../services/localization_service.dart';

/// Beautiful, mobile-first login screen.
///
/// The user only ever provides email + password — their role is resolved
/// from the `profiles` table after authentication and decides which
/// dashboard they land on (see [roleHomeRoute]).
///
/// In demo mode (no Supabase credentials configured) a row of quick-access
/// chips lets reviewers jump straight into any role's dashboard.
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final auth = context.read<AuthService>();
    final ok = await auth.signIn(
      email: _emailController.text.trim(),
      password: _passwordController.text,
    );
    if (!mounted) return;
    if (ok && auth.currentUser != null) {
      context.go(roleHomeRoute(auth.currentUser!.role));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          behavior: SnackBarBehavior.floating,
          backgroundColor: AppColors.danger,
          content: Text(context.t('email') + ' / ' + context.t('password') + ' — ' + 'invalid'),
        ),
      );
    }
  }

  void _quickFill(AppUser account) {
    _emailController.text = account.email;
    _passwordController.text = 'demo1234';
    _submit();
  }

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    final isDesktop = AppBreakpoints.isDesktop(width);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.brandGradient),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 20),
              child: ConstrainedBox(
                constraints: BoxConstraints(maxWidth: isDesktop ? 920 : 440),
                child: isDesktop ? _DesktopLayout(child: _LoginCard(controller: this)) : _LoginCard(controller: this),
              ),
            ),
          ),
        ),
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
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    gradient: AppColors.heroGradient,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Icon(Icons.bolt_rounded, color: Colors.white, size: 32),
                ),
                const SizedBox(height: 28),
                Text(
                  context.t('appName'),
                  style: AppTextStyles.display.copyWith(color: Colors.white, fontSize: 40),
                ),
                const SizedBox(height: 12),
                Text(
                  context.t('appTagline'),
                  style: AppTextStyles.body.copyWith(color: Colors.white.withOpacity(0.72), fontSize: 16),
                ),
                const SizedBox(height: 28),
                Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  children: const [
                    _FeaturePill(icon: Icons.insights_rounded, label: 'Student Risk Score'),
                    _FeaturePill(icon: Icons.forum_rounded, label: 'Parent Communication'),
                    _FeaturePill(icon: Icons.phone_iphone_rounded, label: 'Mobile Money Matching'),
                    _FeaturePill(icon: Icons.menu_book_rounded, label: 'Qur’an Progress'),
                  ],
                ),
              ],
            ),
          ),
        ),
        Expanded(child: child),
      ],
    );
  }
}

class _FeaturePill extends StatelessWidget {
  final IconData icon;
  final String label;

  const _FeaturePill({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.08),
        borderRadius: BorderRadius.circular(40),
        border: Border.all(color: Colors.white.withOpacity(0.16)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: Colors.white.withOpacity(0.85), size: 16),
          const SizedBox(width: 8),
          Text(label, style: AppTextStyles.caption.copyWith(color: Colors.white.withOpacity(0.85))),
        ],
      ),
    );
  }
}

class _LoginCard extends StatelessWidget {
  final _LoginScreenState controller;

  const _LoginCard({required this.controller});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthService>();

    return GlassCard(
      padding: const EdgeInsets.all(32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  context.t('welcomeBack'),
                  style: AppTextStyles.h1.copyWith(color: Colors.white),
                ),
              ),
              const LanguageSwitcher(dark: true),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            context.t('loginSubtitle'),
            style: AppTextStyles.body.copyWith(color: Colors.white.withOpacity(0.65)),
          ),
          const SizedBox(height: 28),
          _LoginField(
            controller: controller._emailController,
            label: context.t('email'),
            icon: Icons.alternate_email_rounded,
          ),
          const SizedBox(height: 14),
          _PasswordField(controller: controller._passwordController),
          Align(
            alignment: Alignment.centerRight,
            child: TextButton(
              onPressed: () {},
              child: Text(
                context.t('forgotPassword'),
                style: AppTextStyles.bodyMuted.copyWith(color: Colors.white.withOpacity(0.6)),
              ),
            ),
          ),
          const SizedBox(height: 8),
          GradientButton(
            label: context.t('signIn'),
            icon: Icons.arrow_forward_rounded,
            loading: auth.isLoading,
            onPressed: controller._submit,
          ),
          const SizedBox(height: 18),
          Text(
            context.t('noAccount'),
            textAlign: TextAlign.center,
            style: AppTextStyles.bodyMuted.copyWith(color: Colors.white.withOpacity(0.45), fontSize: 12),
          ),
          const SizedBox(height: 22),
          Divider(color: Colors.white.withOpacity(0.12)),
          const SizedBox(height: 14),
          Text(
            'DEMO QUICK ACCESS',
            style: AppTextStyles.caption.copyWith(color: Colors.white.withOpacity(0.4)),
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: AuthService.demoAccounts.map((account) {
              return ActionChip(
                backgroundColor: Colors.white.withOpacity(0.08),
                side: BorderSide(color: Colors.white.withOpacity(0.14)),
                label: Text(
                  context.t('role_${account.role}'),
                  style: AppTextStyles.caption.copyWith(color: Colors.white.withOpacity(0.8)),
                ),
                onPressed: () => controller._quickFill(account),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}

class _PasswordField extends StatefulWidget {
  final TextEditingController controller;

  const _PasswordField({required this.controller});

  @override
  State<_PasswordField> createState() => _PasswordFieldState();
}

class _PasswordFieldState extends State<_PasswordField> {
  bool _obscure = true;

  @override
  Widget build(BuildContext context) {
    return _LoginField(
      controller: widget.controller,
      label: context.t('password'),
      icon: Icons.lock_outline_rounded,
      obscure: _obscure,
      suffix: IconButton(
        icon: Icon(
          _obscure ? Icons.visibility_off_outlined : Icons.visibility_outlined,
          color: Colors.white.withOpacity(0.5),
          size: 19,
        ),
        onPressed: () => setState(() => _obscure = !_obscure),
      ),
    );
  }
}

class _LoginField extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final IconData icon;
  final bool obscure;
  final Widget? suffix;

  const _LoginField({
    required this.controller,
    required this.label,
    required this.icon,
    this.obscure = false,
    this.suffix,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      obscureText: obscure,
      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w500),
      cursorColor: Colors.white,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(color: Colors.white.withOpacity(0.5)),
        prefixIcon: Icon(icon, color: Colors.white.withOpacity(0.5), size: 19),
        suffixIcon: suffix,
        filled: true,
        fillColor: Colors.white.withOpacity(0.06),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: Colors.white.withOpacity(0.14)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: Colors.white.withOpacity(0.14)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.gold, width: 1.4),
        ),
      ),
    );
  }
}
