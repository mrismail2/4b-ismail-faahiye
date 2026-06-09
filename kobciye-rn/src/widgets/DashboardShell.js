import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients, glass } from '../constants/colors';
import { Text as TextStyles } from '../constants/text';
import AppLogo from './AppLogo';
import AppSidebar from './AppSidebar';
import AppBottomNav from './AppBottomNav';
import LanguageSwitcher from './LanguageSwitcher';
import { navItemsForRole } from '../constants/navItems';
import { useAuth, userInitials } from '../context/AuthContext';
import { useLocalization } from '../context/LocalizationContext';

export default function DashboardShell({ user, roleLabelKey, pages }) {
  const [index, setIndex] = useState(0);
  const { width } = useWindowDimensions();
  const isDesktop = width > 980;
  const { t } = useLocalization();
  const { signOut } = useAuth();
  const items = navItemsForRole(user.role);

  const page = (
    <View style={{ flex: 1 }}>
      {pages.map((p, i) => (
        <View key={i} style={i === index ? styles.fill : styles.hidden} pointerEvents={i === index ? 'auto' : 'none'}>
          {p}
        </View>
      ))}
    </View>
  );

  if (isDesktop) {
    return (
      <View style={styles.desktopRoot}>
        <AppSidebar user={user} roleLabelKey={roleLabelKey} items={items} selectedIndex={index} onSelect={setIndex} onLogout={signOut} />
        <View style={{ flex: 1 }}>
          <TopBarDesktop user={user} t={t} signOut={signOut} />
          {page}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mobileRoot}>
      <TopBarMobile user={user} t={t} signOut={signOut} />
      {page}
      <AppBottomNav items={items} selectedIndex={index} onSelect={setIndex} />
    </View>
  );
}

function TopBarDesktop({ user, t, signOut }) {
  const greetingName = user.fullName.split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? '☀️ Good morning' : hour < 17 ? '👋 Good afternoon' : '🌙 Good evening';
  return (
    <View style={styles.topBarDesktop}>
      <View style={{ flex: 1 }}>
        <Text style={styles.topGreeting}>{greeting}, {greetingName}</Text>
        <Text style={styles.topDate}>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
      </View>
      <LanguageSwitcher />
      <Pressable onPress={signOut} style={styles.topAvatarWrap}>
        <LinearGradient colors={Gradients.brand} style={styles.topAvatar}>
          <Text style={styles.topAvatarText}>{userInitials(user)}</Text>
        </LinearGradient>
        <View style={styles.topAvatarInfo}>
          <Text style={styles.topAvatarName}>{user.fullName.split(' ')[0]}</Text>
          <Text style={styles.topAvatarRole}>{t('logout')}</Text>
        </View>
      </Pressable>
    </View>
  );
}

function TopBarMobile({ user, signOut }) {
  return (
    <LinearGradient colors={Gradients.brand} style={styles.mobileBar}>
      <AppLogo size={24} light />
      <View style={styles.mobileBarRight}>
        <View style={styles.mobileGreetingBox}>
          <Text style={styles.mobileGreeting} numberOfLines={1}>
            Hi, {user.fullName.split(' ')[0]} 👋
          </Text>
        </View>
        <Pressable onPress={signOut} hitSlop={10} style={styles.mobileLogoutBtn}>
          <Ionicons name="log-out-outline" size={20} color="rgba(255,255,255,0.9)" />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { ...StyleSheet.absoluteFillObject },
  hidden: { ...StyleSheet.absoluteFillObject, opacity: 0 },

  desktopRoot: { flex: 1, flexDirection: 'row', backgroundColor: Colors.background },
  topBarDesktop: {
    height: 76, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 28, gap: 16,
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  topGreeting: { fontSize: 16, fontWeight: '800', color: Colors.text },
  topDate: { fontSize: 12, color: Colors.muted, marginTop: 1 },
  topAvatarWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 14, backgroundColor: Colors.background },
  topAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  topAvatarText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  topAvatarInfo: {},
  topAvatarName: { fontSize: 13, fontWeight: '700', color: Colors.text },
  topAvatarRole: { fontSize: 11, color: Colors.danger, fontWeight: '600' },

  mobileRoot: { flex: 1, backgroundColor: Colors.background },
  mobileBar: {
    paddingTop: 44, paddingBottom: 14, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  mobileBarRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mobileGreetingBox: {
    backgroundColor: glass(0.18), borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: glass(0.25),
  },
  mobileGreeting: { fontSize: 13, fontWeight: '700', color: '#fff' },
  mobileLogoutBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: glass(0.15), borderWidth: 1, borderColor: glass(0.2),
    alignItems: 'center', justifyContent: 'center',
  },
});
