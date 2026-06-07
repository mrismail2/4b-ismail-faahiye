import 'package:flutter/material.dart';
import '../../models/app_user.dart';
import '../../services/localization_service.dart';
import '../constants/app_colors.dart';
import '../constants/app_text.dart';
import '../constants/nav_items.dart';
import 'app_logo.dart';

/// Fixed-width sidebar navigation shown on desktop for admin-style roles.
class AppSidebar extends StatelessWidget {
  final AppUser user;
  final String roleLabelKey;
  final List<NavItem> items;
  final int selectedIndex;
  final ValueChanged<int> onSelect;
  final VoidCallback onLogout;

  const AppSidebar({
    super.key,
    required this.user,
    required this.roleLabelKey,
    required this.items,
    required this.selectedIndex,
    required this.onSelect,
    required this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 264,
      color: AppColors.surface,
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 28, 20, 20),
            child: Align(alignment: Alignment.centerLeft, child: AppLogo(size: 38)),
          ),
          const Divider(height: 1),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 12),
              itemCount: items.length,
              itemBuilder: (context, i) {
                final item = items[i];
                final selected = i == selectedIndex;
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 3),
                  child: Material(
                    color: selected ? AppColors.primary.withOpacity(0.08) : Colors.transparent,
                    borderRadius: BorderRadius.circular(14),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(14),
                      onTap: () => onSelect(i),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
                        child: Row(
                          children: [
                            Icon(selected ? item.selectedIcon : item.icon,
                                size: 21, color: selected ? AppColors.primary : AppColors.muted),
                            const SizedBox(width: 14),
                            Text(
                              context.t(item.labelKey),
                              style: AppText.body.copyWith(
                                color: selected ? AppColors.primary : AppColors.text,
                                fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
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
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: AppColors.primary.withOpacity(0.12),
                  child: Text(user.initials, style: AppText.h2.copyWith(color: AppColors.primary, fontSize: 14)),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(user.fullName, style: AppText.body.copyWith(fontWeight: FontWeight.w700), maxLines: 1, overflow: TextOverflow.ellipsis),
                      Text(context.t(roleLabelKey), style: AppText.caption),
                    ],
                  ),
                ),
                IconButton(
                  tooltip: context.t('logout'),
                  onPressed: onLogout,
                  icon: const Icon(Icons.logout_rounded, color: AppColors.muted, size: 20),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
