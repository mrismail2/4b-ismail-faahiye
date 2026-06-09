import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients } from '../constants/colors';
import AppLogo from './AppLogo';
import { useLocalization } from '../context/LocalizationContext';
import { userInitials } from '../context/AuthContext';

// Premium dark sidebar — deep navy background, gradient selected pill,
// gradient avatar, no right border (shadow instead).
export default function AppSidebar({ user, roleLabelKey, items, selectedIndex, onSelect, onLogout }) {
  const { t } = useLocalization();

  return (
    <View style={styles.sidebar}>
      {/* Logo area */}
      <View style={styles.logoWrap}>
        <AppLogo size={30} light />
      </View>

      <View style={styles.divider} />

      {/* Navigation items */}
      <View style={styles.navList}>
        {items.map((item, i) => {
          const selected = i === selectedIndex;
          return (
            <Pressable
              key={item.key}
              onPress={() => onSelect(i)}
              style={({ pressed }) => [pressed && { opacity: 0.8 }]}
            >
              {selected ? (
                <LinearGradient
                  colors={Gradients.brandVibrant}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.navItemSelected}
                >
                  <Ionicons name={item.activeIcon} size={19} color="#fff" />
                  <Text style={styles.navLabelSelected}>{t(item.key)}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.navItem}>
                  <Ionicons name={item.icon} size={19} color="rgba(148,163,184,0.9)" />
                  <Text style={styles.navLabel}>{t(item.key)}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Bottom profile section */}
      <View style={styles.divider} />
      <View style={styles.profileRow}>
        <LinearGradient colors={Gradients.brand} style={styles.avatar}>
          <Text style={styles.avatarText}>{userInitials(user)}</Text>
        </LinearGradient>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.profileName} numberOfLines={1}>{user.fullName}</Text>
          <Text style={styles.profileRole}>{t(roleLabelKey)}</Text>
        </View>
        <Pressable onPress={onLogout} hitSlop={8} style={({ pressed }) => pressed && { opacity: 0.6 }}>
          <Ionicons name="log-out-outline" size={20} color="rgba(148,163,184,0.8)" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 264,
    backgroundColor: '#0F172A',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 4, height: 0 },
    elevation: 12,
  },
  logoWrap: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 20 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.07)' },
  navList: { flex: 1, paddingVertical: 16, paddingHorizontal: 12 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
    marginVertical: 2,
    gap: 14,
  },
  navItemSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
    marginVertical: 2,
    gap: 14,
  },
  navLabel: { fontSize: 14, fontWeight: '500', color: 'rgba(148,163,184,0.9)' },
  navLabelSelected: { fontSize: 14, fontWeight: '700', color: '#fff' },
  profileRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  profileName: { fontSize: 14, fontWeight: '700', color: '#fff' },
  profileRole: { fontSize: 12, color: 'rgba(148,163,184,0.8)', marginTop: 2 },
});
