import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients } from '../constants/colors';
import { Text as TextStyles } from '../constants/text';
import AppCard from './AppCard';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth, userInitials } from '../context/AuthContext';
import { useLocalization } from '../context/LocalizationContext';

// Shared settings page — profile summary, language preference and sign out.
// Available to every role.
export default function SettingsPage({ user, roleLabelKey }) {
  const { signOut } = useAuth();
  const { t } = useLocalization();

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={TextStyles.h1}>{t('settings')}</Text>

      <AppCard style={styles.card}>
        <View style={styles.row}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userInitials(user)}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={TextStyles.h2}>{user.fullName}</Text>
            <Text style={TextStyles.bodyMuted}>{user.email}</Text>
            <View style={styles.roleChip}>
              <Text style={styles.roleChipText}>{t(roleLabelKey)}</Text>
            </View>
          </View>
        </View>
      </AppCard>

      <AppCard style={styles.card}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={TextStyles.h2}>Language / Luqadda</Text>
            <Text style={[TextStyles.bodyMuted, { marginTop: 4 }]}>Choose how Kobciye speaks to you.</Text>
          </View>
          <LanguageSwitcher />
        </View>
      </AppCard>

      <Pressable onPress={signOut}>
        <AppCard style={styles.card}>
          <View style={styles.row}>
            <View style={styles.dangerIcon}>
              <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
            </View>
            <Text style={[TextStyles.h2, { color: Colors.danger, flex: 1, marginLeft: 14 }]}>{t('logout')}</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.muted} />
          </View>
        </AppCard>
      </Pressable>

      {/* About Section */}
      <View style={styles.aboutWrap}>
        <LinearGradient colors={Gradients.brand} style={styles.aboutCard}>
          <View style={styles.aboutGlowRing}>
            <LinearGradient colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.08)']} style={styles.founderAvatar}>
              <Text style={styles.founderInitials}>IF</Text>
            </LinearGradient>
          </View>
          <Text style={styles.aboutName}>Ismail Abdirahman Ahmed</Text>
          <Text style={styles.aboutAlias}>(Ismail Fahie)</Text>
          <View style={styles.aboutDividerLine} />
          <View style={styles.aboutAppRow}>
            <Text style={styles.aboutAppName}>Kobciye</Text>
            <View style={styles.aboutDot} />
            <Text style={styles.aboutLocation}>Gabiley, Somaliland</Text>
          </View>
          <Text style={styles.aboutCopyright}>© {new Date().getFullYear()} Kobciye · All rights reserved</Text>
          <View style={styles.aboutBadgeRow}>
            <View style={styles.aboutBadge}><Ionicons name="shield-checkmark-outline" size={13} color="rgba(255,255,255,0.9)" /><Text style={styles.aboutBadgeText}>School Management</Text></View>
            <View style={styles.aboutBadge}><Ionicons name="globe-outline" size={13} color="rgba(255,255,255,0.9)" /><Text style={styles.aboutBadgeText}>EN · SO</Text></View>
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 24 },
  card: { marginTop: 16 },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: `${Colors.primary}1F`, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.primary, fontWeight: '800', fontSize: 18 },
  roleChip: { marginTop: 8, alignSelf: 'flex-start', backgroundColor: `${Colors.primary}14`, borderRadius: 40, paddingHorizontal: 10, paddingVertical: 5 },
  roleChipText: { fontSize: 11, fontWeight: '700', color: Colors.primary, letterSpacing: 0.4 },
  dangerIcon: { width: 44, height: 44, borderRadius: 13, backgroundColor: `${Colors.danger}1A`, alignItems: 'center', justifyContent: 'center' },

  aboutWrap: { marginTop: 28, marginBottom: 8 },
  aboutCard: { borderRadius: 28, padding: 28, alignItems: 'center', shadowColor: Colors.primary, shadowOpacity: 0.25, shadowRadius: 30, shadowOffset: { width: 0, height: 10 } },
  aboutGlowRing: { width: 92, height: 92, borderRadius: 46, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 14, borderWidth: 2, borderColor: 'rgba(255,255,255,0.25)' },
  founderAvatar: { width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center' },
  founderInitials: { fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  aboutName: { fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: -0.3, textAlign: 'center' },
  aboutAlias: { fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: '500', marginTop: 3 },
  aboutDividerLine: { width: 48, height: 2, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.25)', marginVertical: 16 },
  aboutAppRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aboutAppName: { fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
  aboutDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.5)' },
  aboutLocation: { fontSize: 13.5, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  aboutCopyright: { fontSize: 11.5, color: 'rgba(255,255,255,0.55)', marginTop: 10, letterSpacing: 0.2 },
  aboutBadgeRow: { flexDirection: 'row', gap: 10, marginTop: 18, flexWrap: 'wrap', justifyContent: 'center' },
  aboutBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  aboutBadgeText: { fontSize: 11.5, fontWeight: '700', color: 'rgba(255,255,255,0.9)', letterSpacing: 0.2 },
});
