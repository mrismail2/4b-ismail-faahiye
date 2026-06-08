import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
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
});
