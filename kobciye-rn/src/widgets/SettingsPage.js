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
        {/* decorative top stars */}
        <View style={styles.aboutStars}>
          {['✦','✧','✦'].map((s, i) => (
            <Text key={i} style={[styles.aboutStar, { opacity: [0.5, 0.3, 0.5][i], fontSize: [10, 7, 10][i] }]}>{s}</Text>
          ))}
        </View>

        <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.aboutCard}>
          {/* outer pulse ring */}
          <View style={styles.photoRingOuter}>
            {/* mid ring */}
            <View style={styles.photoRingMid}>
              {/* inner glow ring */}
              <LinearGradient
                colors={['#e040fb', '#7c4dff', '#448aff']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.photoRingGradient}
              >
                {/* photo circle */}
                <View style={styles.photoCircle}>
                  <LinearGradient
                    colors={['#2d1b69', '#11998e', '#38ef7d']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={styles.photoInner}
                  >
                    <Ionicons name="person" size={56} color="rgba(255,255,255,0.92)" />
                  </LinearGradient>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* verified badge */}
          <View style={styles.verifiedBadge}>
            <LinearGradient colors={['#7c4dff', '#448aff']} style={styles.verifiedBadgeInner}>
              <Ionicons name="checkmark" size={11} color="#fff" />
            </LinearGradient>
          </View>

          {/* name */}
          <Text style={styles.aboutName}>Ismail Abdirahman Ahmed</Text>
          <Text style={styles.aboutAlias}>Ismail Fahie</Text>

          {/* role tag */}
          <View style={styles.founderTag}>
            <LinearGradient colors={['#7c4dff44', '#448aff44']} style={styles.founderTagInner}>
              <Ionicons name="code-slash-outline" size={12} color="rgba(180,180,255,0.9)" />
              <Text style={styles.founderTagText}>Founder & Developer</Text>
            </LinearGradient>
          </View>

          <View style={styles.aboutDividerLine} />

          {/* location + app */}
          <View style={styles.aboutInfoRow}>
            <View style={styles.aboutInfoItem}>
              <Ionicons name="location-outline" size={14} color="rgba(180,180,255,0.8)" />
              <Text style={styles.aboutInfoText}>Gabiley, Somaliland</Text>
            </View>
            <View style={styles.aboutInfoDot} />
            <View style={styles.aboutInfoItem}>
              <Ionicons name="school-outline" size={14} color="rgba(180,180,255,0.8)" />
              <Text style={styles.aboutInfoText}>Kobciye</Text>
            </View>
          </View>

          <Text style={styles.aboutCopyright}>© {new Date().getFullYear()} Kobciye · All rights reserved</Text>

          <View style={styles.aboutBadgeRow}>
            <View style={styles.aboutBadge}>
              <Ionicons name="shield-checkmark-outline" size={12} color="rgba(180,180,255,0.9)" />
              <Text style={styles.aboutBadgeText}>School Management</Text>
            </View>
            <View style={styles.aboutBadge}>
              <Ionicons name="globe-outline" size={12} color="rgba(180,180,255,0.9)" />
              <Text style={styles.aboutBadgeText}>EN · SO</Text>
            </View>
            <View style={styles.aboutBadge}>
              <Ionicons name="phone-portrait-outline" size={12} color="rgba(180,180,255,0.9)" />
              <Text style={styles.aboutBadgeText}>Mobile First</Text>
            </View>
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

  aboutWrap: { marginTop: 28, marginBottom: 16 },
  aboutStars: { flexDirection: 'row', justifyContent: 'center', gap: 14, marginBottom: 6 },
  aboutStar: { color: Colors.primary, fontWeight: '900' },

  aboutCard: {
    borderRadius: 32, paddingTop: 36, paddingBottom: 28, paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(124,77,255,0.3)',
    shadowColor: '#7c4dff', shadowOpacity: 0.5, shadowRadius: 40, shadowOffset: { width: 0, height: 16 },
  },

  // photo rings
  photoRingOuter: {
    width: 136, height: 136, borderRadius: 68,
    backgroundColor: 'rgba(124,77,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(124,77,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  photoRingMid: {
    width: 118, height: 118, borderRadius: 59,
    backgroundColor: 'rgba(68,138,255,0.1)',
    borderWidth: 1.5, borderColor: 'rgba(68,138,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  photoRingGradient: {
    width: 100, height: 100, borderRadius: 50,
    padding: 3,
    alignItems: 'center', justifyContent: 'center',
  },
  photoCircle: {
    width: 94, height: 94, borderRadius: 47,
    overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
  },
  photoInner: {
    width: '100%', height: '100%',
    alignItems: 'center', justifyContent: 'center',
  },

  verifiedBadge: {
    marginTop: -18, marginBottom: 14,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#1a1a2e',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#1a1a2e',
  },
  verifiedBadgeInner: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
  },

  aboutName: { fontSize: 20, fontWeight: '900', color: '#ffffff', letterSpacing: -0.4, textAlign: 'center', lineHeight: 26 },
  aboutAlias: { fontSize: 13.5, color: 'rgba(180,180,255,0.7)', fontWeight: '600', marginTop: 4, letterSpacing: 0.3 },

  founderTag: { marginTop: 14 },
  founderTagInner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(124,77,255,0.4)',
  },
  founderTagText: { fontSize: 12, fontWeight: '700', color: 'rgba(180,180,255,0.9)', letterSpacing: 0.3 },

  aboutDividerLine: { width: 40, height: 1.5, borderRadius: 2, backgroundColor: 'rgba(124,77,255,0.4)', marginVertical: 18 },

  aboutInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  aboutInfoItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  aboutInfoText: { fontSize: 13, color: 'rgba(180,180,255,0.8)', fontWeight: '600' },
  aboutInfoDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: 'rgba(124,77,255,0.6)' },

  aboutCopyright: { fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 14, letterSpacing: 0.3 },

  aboutBadgeRow: { flexDirection: 'row', gap: 8, marginTop: 16, flexWrap: 'wrap', justifyContent: 'center' },
  aboutBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 11, paddingVertical: 6, borderRadius: 20,
    backgroundColor: 'rgba(124,77,255,0.12)',
    borderWidth: 1, borderColor: 'rgba(124,77,255,0.3)',
  },
  aboutBadgeText: { fontSize: 11, fontWeight: '700', color: 'rgba(180,180,255,0.85)', letterSpacing: 0.2 },
});
