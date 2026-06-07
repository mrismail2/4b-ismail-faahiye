import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/app_user.dart';
import '../../services/auth_service.dart';
import '../constants/app_breakpoints.dart';
import '../../services/localization_service.dart';
import '../constants/nav_items.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';
import 'language_switcher.dart';

/// Responsive role-based dashboard shell.
///
/// * Desktop / tablet (>= 600px): fixed sidebar with brand header, nav items
///   and user footer.
/// * Mobile (< 600px): top app bar + bottom navigation bar.
///
/// Each [pages] entry corresponds 1:1 with [NavItems.forRole], in order.
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
    final items = NavItems.forRole(widget.user.role);
    final width = MediaQuery.sizeOf(context).width;
    final isDesktop = AppBreakpoints.isDesktop(width);
    final safeIndex = _index.clamp(0, widget.pages.length - 1);

    if (isDesktop) {
      return Scaffold(
        backgroundColor: AppColors.background,
        body: Row(
          children: [
            _Sidebar(
              user: widget.user,
              roleLabelKey: widget.roleLabelKey,
              items: items,
              selected: safeIndex,
              onSelect: (i) => setState(() => _index = i),
            ),
            Expanded(
              child: Column(
                children: [
                  _TopBar(user: widget.user, items: items, selectedIndex: safeIndex),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.all(28),
                      child: widget.pages[safeIndex],
                    ),
                  ),
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
        title: Row(
          children: [
            _BrandMark(size: 34),
            const SizedBox(width: 10),
            Text(context.t('appName'), style: AppTextStyles.h2),
          ],
        ),
        actions: const [Padding(padding: EdgeInsets.only(right: 16), child: LanguageSwitcher())],
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: widget.pages[safeIndex],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: safeIndex,
        onDestinationSelected: (i) => setState(() => _index = i),
        destinations: items
            .map((item) => NavigationDestination(
                  icon: Icon(item.icon),
                  selectedIcon: Icon(item.selectedIcon),
                  label: context.t(item.labelKey),
                ))
            .toList(),
      ),
    );
  }
}

class _Sidebar extends StatelessWidget {
  final AppUser user;
  final String roleLabelKey;
  final List<NavItem> items;
  final int selected;
  final ValueChanged<int> onSelect;

  const _Sidebar({
    required this.user,
    required this.roleLabelKey,
    required this.items,
    required this.selected,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 264,
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border(right: BorderSide(color: AppColors.muted.withOpacity(0.08))),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(24, 28, 24, 18),
            child: Row(
              children: [
                _BrandMark(size: 40),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    context.t('appName'),
                    style: AppTextStyles.h2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 12),
              itemCount: items.length,
              itemBuilder: (context, i) {
                final selectedItem = i == selected;
                final item = items[i];
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Material(
                    color: selectedItem ? AppColors.blue.withOpacity(0.1) : Colors.transparent,
                    borderRadius: BorderRadius.circular(14),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(14),
                      onTap: () => onSelect(i),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
                        child: Row(
                          children: [
                            Icon(
                              selectedItem ? item.selectedIcon : item.icon,
                              size: 20,
                              color: selectedItem ? AppColors.blue : AppColors.muted,
                            ),
                            const SizedBox(width: 14),
                            Text(
                              context.t(item.labelKey),
                              style: AppTextStyles.body.copyWith(
                                color: selectedItem ? AppColors.blue : AppColors.text,
                                fontWeight: selectedItem ? FontWeight.w700 : FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          const Divider(height: 1),
          _UserFooter(user: user, roleLabelKey: roleLabelKey),
        ],
      ),
    );
  }
}

class _UserFooter extends StatelessWidget {
  final AppUser user;
  final String roleLabelKey;

  const _UserFooter({required this.user, required this.roleLabelKey});

  @override
  Widget build(BuildContext context) {
    final auth = context.read<AuthService>();
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          CircleAvatar(
            radius: 20,
            backgroundColor: AppColors.blue.withOpacity(0.12),
            child: Text(
              user.initials,
              style: AppTextStyles.body.copyWith(color: AppColors.blue, fontWeight: FontWeight.w800),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(user.fullName, style: AppTextStyles.body, overflow: TextOverflow.ellipsis),
                Text(context.t(roleLabelKey), style: AppTextStyles.caption),
              ],
            ),
          ),
          IconButton(
            tooltip: context.t('logout'),
            icon: const Icon(Icons.logout_rounded, size: 19, color: AppColors.muted),
            onPressed: auth.signOut,
          ),
        ],
      ),
    );
  }
}

class _TopBar extends StatelessWidget {
  final AppUser user;
  final List<NavItem> items;
  final int selectedIndex;

  const _TopBar({required this.user, required this.items, required this.selectedIndex});

  @override
  Widget build(BuildContext context) {
    final greetingName = user.fullName.split(' ').first;
    return Container(
      height: 76,
      padding: const EdgeInsets.symmetric(horizontal: 28),
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border(bottom: BorderSide(color: AppColors.muted.withOpacity(0.08))),
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(
              '${context.t('goodMorning')}, $greetingName 👋',
              style: AppTextStyles.h2,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          const LanguageSwitcher(),
          const SizedBox(width: 16),
          CircleAvatar(
            radius: 19,
            backgroundColor: AppColors.purple.withOpacity(0.12),
            child: Text(
              user.initials,
              style: AppTextStyles.body.copyWith(color: AppColors.purple, fontWeight: FontWeight.w800),
            ),
          ),
        ],
      ),
    );
  }
}

class _BrandMark extends StatelessWidget {
  final double size;

  const _BrandMark({required this.size});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        gradient: AppColors.heroGradient,
        borderRadius: BorderRadius.circular(size * 0.3),
        boxShadow: [
          BoxShadow(color: AppColors.blue.withOpacity(0.35), blurRadius: 16, offset: const Offset(0, 6)),
        ],
      ),
      child: Icon(Icons.bolt_rounded, color: Colors.white, size: size * 0.55),
    );
  }
}
