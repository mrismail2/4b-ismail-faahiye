import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions, Modal, Alert } from 'react-native';
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
import { AppRole } from '../constants/roles';

const NOTIFICATIONS = [
  { id: 1, icon: 'document-text-outline', title: 'Exam results published — Grade 5A Math', time: '2 min ago', color: Colors.primary },
  { id: 2, icon: 'checkmark-circle-outline', title: "Faadumo's attendance: Present today", time: '1 hr ago', color: Colors.success },
  { id: 3, icon: 'card-outline', title: 'Payment received — $25 from Ahmed', time: 'Yesterday', color: Colors.accent },
];

const FAB_ACTIONS = {
  [AppRole.schoolAdmin]: [
    { icon: 'person-add-outline', label: 'Add Student', gradient: ['#1E4F96','#2563EB'] },
    { icon: 'card-outline', label: 'Collect Payment', gradient: ['#16a34a','#15803d'] },
    { icon: 'megaphone-outline', label: 'Send Notice', gradient: ['#7c3aed','#6d28d9'] },
  ],
  [AppRole.teacher]: [
    { icon: 'checkbox-outline', label: 'Mark Attendance', gradient: ['#0891b2','#0e7490'] },
    { icon: 'document-text-outline', label: 'Upload Marks', gradient: ['#e11d48','#be123c'] },
    { icon: 'book-outline', label: 'Create Lesson', gradient: ['#CFAD5E','#b45309'] },
  ],
};

function NotificationBell({ light = false }) {
  const [visible, setVisible] = useState(false);
  const iconColor = light ? '#fff' : Colors.text;
  return (
    <>
      <Pressable onPress={() => setVisible(true)} style={styles.bellWrap} hitSlop={8}>
        <Ionicons name="notifications-outline" size={22} color={iconColor} />
        <View style={styles.bellBadge}>
          <Text style={styles.bellBadgeText}>3</Text>
        </View>
      </Pressable>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.notifBackdrop} onPress={() => setVisible(false)}>
          <Pressable style={styles.notifSheet} onPress={() => {}}>
            <View style={styles.notifHeader}>
              <Text style={styles.notifTitle}>Notifications</Text>
              <Pressable onPress={() => setVisible(false)} hitSlop={10}>
                <Ionicons name="close" size={20} color={Colors.muted} />
              </Pressable>
            </View>
            {NOTIFICATIONS.map((n) => (
              <Pressable key={n.id} style={styles.notifItem} onPress={() => setVisible(false)}>
                <View style={[styles.notifIconWrap, { backgroundColor: `${n.color}18` }]}>
                  <Ionicons name={n.icon} size={18} color={n.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifItemTitle}>{n.title}</Text>
                  <Text style={styles.notifItemTime}>{n.time}</Text>
                </View>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function FAB({ userRole, isDesktop }) {
  const [open, setOpen] = useState(false);
  const actions = FAB_ACTIONS[userRole];
  if (!actions) return null;

  const handleAction = (label) => {
    setOpen(false);
    Alert.alert('Coming soon', `"${label}" will be available in the next update.`);
  };

  return (
    <View style={[styles.fabContainer, isDesktop ? styles.fabContainerDesktop : styles.fabContainerMobile]}>
      {open && (
        <View style={styles.fabMenu}>
          {[...actions].reverse().map((action, i) => (
            <Pressable key={i} onPress={() => handleAction(action.label)} style={styles.fabMenuItem}>
              <Text style={styles.fabMenuLabel}>{action.label}</Text>
              <LinearGradient colors={action.gradient} style={styles.fabMiniBtn}>
                <Ionicons name={action.icon} size={18} color="#fff" />
              </LinearGradient>
            </Pressable>
          ))}
        </View>
      )}
      <Pressable onPress={() => setOpen((v) => !v)} style={styles.fabMainWrap}>
        <LinearGradient colors={Gradients.brand} style={styles.fabMain}>
          <Ionicons name={open ? 'close' : 'add'} size={28} color="#fff" />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

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
          <View style={{ flex: 1 }}>
            {page}
            <FAB userRole={user.role} isDesktop={true} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mobileRoot}>
      <TopBarMobile user={user} t={t} signOut={signOut} />
      <View style={{ flex: 1 }}>
        {page}
        <FAB userRole={user.role} isDesktop={false} />
      </View>
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
      <NotificationBell light={false} />
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
        <NotificationBell light={true} />
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

  // Bell
  bellWrap: { position: 'relative', width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  bellBadge: {
    position: 'absolute', top: 2, right: 2,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: '#ef4444',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#fff',
  },
  bellBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },

  // Notification modal
  notifBackdrop: {
    flex: 1, backgroundColor: 'rgba(10,46,107,0.4)',
    justifyContent: 'flex-start', alignItems: 'flex-end',
    paddingTop: 80, paddingRight: 16,
  },
  notifSheet: {
    width: 320,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    shadowColor: Colors.primary,
    shadowOpacity: 0.16,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
  },
  notifHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  notifTitle: { fontSize: 15, fontWeight: '800', color: Colors.text },
  notifItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  notifIconWrap: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  notifItemTitle: { fontSize: 13, fontWeight: '600', color: Colors.text, lineHeight: 18, marginBottom: 2 },
  notifItemTime: { fontSize: 11.5, color: Colors.muted, fontWeight: '500' },

  // FAB
  fabContainer: { position: 'absolute', alignItems: 'flex-end' },
  fabContainerMobile: { bottom: 90, right: 20 },
  fabContainerDesktop: { bottom: 32, right: 32 },
  fabMain: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 6 } },
  fabMainWrap: { borderRadius: 28, overflow: 'hidden' },
  fabMenu: { alignItems: 'flex-end', gap: 10, marginBottom: 12 },
  fabMenuItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  fabMenuLabel: {
    fontSize: 13, fontWeight: '700', color: Colors.text,
    backgroundColor: Colors.surface, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 10, borderWidth: 1, borderColor: Colors.border,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  fabMiniBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
