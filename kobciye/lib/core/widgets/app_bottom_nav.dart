import 'package:flutter/material.dart';
import '../../services/localization_service.dart';
import '../constants/app_colors.dart';
import '../constants/nav_items.dart';

/// Bottom navigation bar shown on mobile/tablet for parent, student and
/// teacher roles — large touch targets, brand-colored selection indicator.
class AppBottomNav extends StatelessWidget {
  final List<NavItem> items;
  final int selectedIndex;
  final ValueChanged<int> onSelect;

  const AppBottomNav({
    super.key,
    required this.items,
    required this.selectedIndex,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    return NavigationBar(
      selectedIndex: selectedIndex,
      onDestinationSelected: onSelect,
      backgroundColor: AppColors.surface,
      indicatorColor: AppColors.primary.withOpacity(0.1),
      destinations: items
          .map((item) => NavigationDestination(
                icon: Icon(item.icon),
                selectedIcon: Icon(item.selectedIcon, color: AppColors.primary),
                label: context.t(item.labelKey),
              ))
          .toList(),
    );
  }
}
