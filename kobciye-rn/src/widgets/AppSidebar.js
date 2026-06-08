import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Text as TextStyles } from '../constants/text';
import AppLogo from './AppLogo';
import { useLocalization } from '../context/LocalizationContext';
import { userInitials } from '../context/AuthContext';

// Fixed-width sidebar navigation shown on desktop for admin-style roles.
export default function AppSidebar({ user, roleLabelKey, items, selectedIndex, onSelect, onLogout }) {
  const { t } = useLocalization();

  return (
    <View style={styles.sidebar}>
      <View style={styles.logoWrap}>
        <AppLogo size={30} />
      </View>
      <View style={styles.divider} />
      <View style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 12 }}>
        {items.map((item, i) => {
          const selected = i === selectedIndex;
          return (
            <Pressable
              key={item.key}
              onPress={() => onSelect(i)}
              style={[styles.navItem, selected && styles.navItemSelected]}
            >
              <Ionicons
                name={selected ? item.activeIcon : item.icon}
                size={20}
                color={selected ? Colors.primary : Colors.muted}
              />
              <Text style={[styles.navLabel, selected && styles.navLabelSelected]}>{t(item.key)}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.divider} />
      <View style={styles.profileRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userInitials(user)}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[TextStyles.body, { fontWeight: '700' }]} numberOfLines={1}>{user.fullName}</Text>
          <Text style={TextStyles.caption}>{t(roleLabelKey)}</Text>
        </View>
        <Pressable onPress={onLogout} hitSlop={8}>
          <Ionicons name="log-out-outline" size={20} color={Colors.muted} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: { width: 264, backgroundColor: Colors.surface, borderRightWidth: 1, borderRightColor: Colors.border },
  logoWrap: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 20 },
  divider: { height: 1, backgroundColor: Colors.border },
  navItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, borderRadius: 14, marginVertical: 3, gap: 14 },
  navItemSelected: { backgroundColor: `${Colors.primary}14` },
  navLabel: { fontSize: 14, fontWeight: '500', color: Colors.text },
  navLabelSelected: { color: Colors.primary, fontWeight: '700' },
  profileRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: `${Colors.primary}1F`, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
});
