import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Text as TextStyles } from '../constants/text';
import AppLogo from './AppLogo';
import AppSidebar from './AppSidebar';
import AppBottomNav from './AppBottomNav';
import LanguageSwitcher from './LanguageSwitcher';
import { navItemsForRole } from '../constants/navItems';
import { useAuth, userInitials } from '../context/AuthContext';
import { useLocalization } from '../context/LocalizationContext';

// Responsive dashboard frame shared by every role.
// Desktop (> 980px): fixed sidebar + top bar + content.
// Mobile/tablet: top bar + content + bottom navigation bar.
//
// `pages` must be provided in the same order as navItemsForRole(role).
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
          <TopBar user={user} t={t} />
          {page}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mobileRoot}>
      <View style={styles.mobileBar}>
        <AppLogo size={26} />
        <Pressable onPress={signOut} hitSlop={10}>
          <Ionicons name="log-out-outline" size={22} color={Colors.muted} />
        </Pressable>
      </View>
      {page}
      <AppBottomNav items={items} selectedIndex={index} onSelect={setIndex} />
    </View>
  );
}

function TopBar({ user, t }) {
  const greetingName = user.fullName.split(' ')[0];
  return (
    <View style={styles.topBar}>
      <Text style={[TextStyles.h2, { flex: 1 }]}>
        {t('goodMorning')}, {greetingName} 👋
      </Text>
      <LanguageSwitcher />
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{userInitials(user)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { ...StyleSheet.absoluteFillObject },
  hidden: { ...StyleSheet.absoluteFillObject, opacity: 0 },
  desktopRoot: { flex: 1, flexDirection: 'row', backgroundColor: Colors.background },
  mobileRoot: { flex: 1, backgroundColor: Colors.background },
  mobileBar: {
    height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  topBar: {
    height: 76, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 28, gap: 14,
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: `${Colors.primary}1F`, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
});
