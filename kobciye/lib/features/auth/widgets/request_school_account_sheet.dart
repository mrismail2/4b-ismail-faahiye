import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text.dart';
import '../../../core/widgets/app_button.dart';
import '../../../services/localization_service.dart';

/// Shows the "Request a school account" flow as a polished modal sheet.
///
/// UI only in Phase 1 — submitting simply confirms receipt; no account is
/// created and nothing is sent to a backend yet.
Future<void> showRequestSchoolAccountSheet(BuildContext context) {
  return showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (context) => const _RequestSchoolAccountSheet(),
  );
}

class _RequestSchoolAccountSheet extends StatefulWidget {
  const _RequestSchoolAccountSheet();

  @override
  State<_RequestSchoolAccountSheet> createState() => _RequestSchoolAccountSheetState();
}

class _RequestSchoolAccountSheetState extends State<_RequestSchoolAccountSheet> {
  final _schoolController = TextEditingController();
  final _ownerController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  String _plan = 'small';
  bool _submitted = false;

  @override
  void dispose() {
    _schoolController.dispose();
    _ownerController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  void _submit() {
    if (_schoolController.text.trim().isEmpty || _emailController.text.trim().isEmpty) return;
    setState(() => _submitted = true);
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: EdgeInsets.only(bottom: MediaQuery.viewInsetsOf(context).bottom),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 520),
          child: Container(
            margin: const EdgeInsets.all(20),
            padding: const EdgeInsets.fromLTRB(28, 28, 28, 24),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(28),
              boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.18), blurRadius: 60, offset: const Offset(0, 30))],
            ),
            child: SingleChildScrollView(
              child: _submitted ? _buildSuccess(context) : _buildForm(context),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildForm(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          children: [
            Container(
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                gradient: AppColors.goldGradient,
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Icon(Icons.school_rounded, color: Colors.white),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(context.t('requestSchoolAccount'), style: AppText.h2),
                  const SizedBox(height: 2),
                  Text('Tell us about your school — our team will reach out to set you up.',
                      style: AppText.bodyMuted),
                ],
              ),
            ),
            IconButton(
              onPressed: () => Navigator.of(context).maybePop(),
              icon: const Icon(Icons.close_rounded),
            ),
          ],
        ),
        const SizedBox(height: 24),
        _Field(label: 'School name', controller: _schoolController, icon: Icons.apartment_rounded, hint: 'e.g. Nuurul-Hidaayah Primary School'),
        const SizedBox(height: 16),
        _Field(label: 'Your full name', controller: _ownerController, icon: Icons.person_outline_rounded, hint: 'e.g. Amina Yusuf'),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: _Field(label: 'Email', controller: _emailController, icon: Icons.alternate_email_rounded, hint: 'you@school.com', keyboardType: TextInputType.emailAddress),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: _Field(label: 'Phone', controller: _phoneController, icon: Icons.call_outlined, hint: '+252 6xx xxx xxx', keyboardType: TextInputType.phone),
            ),
          ],
        ),
        const SizedBox(height: 18),
        Text('Choose the plan that fits your school', style: AppText.bodyMuted.copyWith(fontWeight: FontWeight.w700)),
        const SizedBox(height: 10),
        _PlanPicker(value: _plan, onChanged: (v) => setState(() => _plan = v)),
        const SizedBox(height: 22),
        AppButton(label: 'Send request', icon: Icons.send_rounded, onPressed: _submit),
        const SizedBox(height: 6),
        Center(
          child: Text(
            "We'll never share your details. This is a Phase-1 preview — no account is created yet.",
            textAlign: TextAlign.center,
            style: AppText.caption,
          ),
        ),
      ],
    );
  }

  Widget _buildSuccess(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(gradient: AppColors.growthGradient, shape: BoxShape.circle),
            child: const Icon(Icons.check_rounded, color: Colors.white, size: 36),
          ),
          const SizedBox(height: 18),
          Text('Request received! 🎉', style: AppText.h1, textAlign: TextAlign.center),
          const SizedBox(height: 8),
          Text(
            'Thank you, ${_ownerController.text.trim().isEmpty ? 'friend' : _ownerController.text.trim()} — '
            'our team will reach out to ${_emailController.text.trim().isEmpty ? 'you' : _emailController.text.trim()} '
            'shortly to get ${_schoolController.text.trim().isEmpty ? 'your school' : _schoolController.text.trim()} growing on Kobciye.',
            textAlign: TextAlign.center,
            style: AppText.bodyMuted,
          ),
          const SizedBox(height: 22),
          AppButton(label: 'Done', icon: Icons.arrow_forward_rounded, onPressed: () => Navigator.of(context).maybePop()),
        ],
      ),
    );
  }
}

class _Field extends StatelessWidget {
  final String label;
  final String hint;
  final IconData icon;
  final TextEditingController controller;
  final TextInputType? keyboardType;

  const _Field({required this.label, required this.hint, required this.icon, required this.controller, this.keyboardType});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppText.bodyMuted.copyWith(fontWeight: FontWeight.w700)),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          keyboardType: keyboardType,
          decoration: InputDecoration(hintText: hint, prefixIcon: Icon(icon, size: 20)),
        ),
      ],
    );
  }
}

class _PlanPicker extends StatelessWidget {
  final String value;
  final ValueChanged<String> onChanged;

  const _PlanPicker({required this.value, required this.onChanged});

  static const _plans = [
    ('small', 'Small school', '\$10/mo', 'Up to 100 students'),
    ('medium', 'Medium school', '\$20/mo', 'Up to 500 students'),
    ('large', 'Large school', '\$50/mo', 'Unlimited students'),
  ];

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (context, constraints) {
      final stacked = constraints.maxWidth < 480;
      final children = _plans.map((p) {
        final selected = value == p.$1;
        final tile = InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () => onChanged(p.$1),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 160),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: selected ? AppColors.primary.withOpacity(0.06) : AppColors.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: selected ? AppColors.primary : AppColors.border, width: selected ? 1.6 : 1),
            ),
            child: Row(
              children: [
                Icon(selected ? Icons.radio_button_checked_rounded : Icons.radio_button_off_rounded,
                    color: selected ? AppColors.primary : AppColors.muted, size: 20),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(p.$2, style: AppText.body.copyWith(fontWeight: FontWeight.w700)),
                      Text(p.$4, style: AppText.caption),
                    ],
                  ),
                ),
                Text(p.$3, style: AppText.body.copyWith(fontWeight: FontWeight.w800, color: AppColors.primary)),
              ],
            ),
          ),
        );
        return stacked ? tile : Expanded(child: tile);
      }).toList();

      return stacked
          ? Column(children: [for (final c in children) Padding(padding: const EdgeInsets.only(bottom: 10), child: c)])
          : Row(children: [for (var i = 0; i < children.length; i++) ...[if (i > 0) const SizedBox(width: 10), children[i]]]);
    });
  }
}
