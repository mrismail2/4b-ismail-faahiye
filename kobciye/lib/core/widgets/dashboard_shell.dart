import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/app_user.dart';
import '../../services/auth_service.dart';
import '../../services/localization_service.dart';
import '../constants/app_colors.dart';
import '../constants/app_text.dart';
import '../constants/nav_items.dart';
import '../responsive/responsive_layout.dart';
import 'app_bottom_nav.dart';
import 'app_logo.dart';
import 'app_sidebar.dart';
import 'language_switcher.dart';

/// Responsive dashboard frame shared by every role.
///
/// Desktop (>= 1024px): fixed sidebar + top bar + content.
/// Mobile/tablet: top bar + content + bottom navigation bar.
///
/// [pages] must be provided in the same order as `NavItems.forRole(role)`.
class DashboardShell extends StatefulWidget {
  final AppUser user;
  final String roleLabelKey;
  final List<Widget> pages;

  const DashboardShell({
    super.key,
    required this.user,
    required this.roleLabelKey,
    required this.pages,
  });

  @override
  State<DashboardShell> createState() => _DashboardShellState();
}

class _DashboardShellState extends State<DashboardShell> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    final isDesktop = AppBreakpoints.isDesktop(width);
    final items = NavItems.forRole(widget.user.role);
    final auth = context.read<AuthService>();

    final page = IndexedStack(
      index: _index,
      children: widget.pages,
    );

    if (isDesktop) {
      return Scaffold(
        backgroundColor: AppColors.background,
        body: Row(
          children: [
            AppSidebar(
              user: widget.user,
              roleLabelKey: widget.roleLabelKey,
              items: items,
              selectedIndex: _index,
              onSelect: (i) => setState(() => _index = i),
              onLogout: auth.signOut,
            ),
            Expanded(
              child: Column(
                children: [
                  _TopBar(user: widget.user),
                  Expanded(child: page),
                ],
              ),
            ),
          ],
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        scrolledUnderElevation: 0,
        title: AppLogo(size: 32),
        actions: [
          IconButton(
            tooltip: context.t('logout'),
            onPressed: auth.signOut,
            icon: const Icon(Icons.logout_rounded, color: AppColors.muted),
          ),
        ],
      ),
      body: page,
      bottomNavigationBar: AppBottomNav(
        items: items,
        selectedIndex: _index,
        onSelect: (i) => setState(() => _index = i),
      ),
    );
  }
}

class _TopBar extends StatelessWidget {
  final AppUser user;

  const _TopBar({required this.user});

  @override
  Widget build(BuildContext context) {
    final greetingName = user.fullName.split(' ').first;
    return Container(
      height: 76,
      padding: const EdgeInsets.symmetric(horizontal: 28),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(bottom: BorderSide(color: AppColors.border)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Text('${context.t('goodMorning')}, $greetingName 👋', style: AppText.h2),
          ),
          const LanguageSwitcher(),
          const SizedBox(width: 14),
          CircleAvatar(
            radius: 19,
            backgroundColor: AppColors.primary.withOpacity(0.12),
            child: Text(user.initials, style: AppText.h2.copyWith(color: AppColors.primary, fontSize: 13)),
          ),
        ],
      ),
    );
  }
}
