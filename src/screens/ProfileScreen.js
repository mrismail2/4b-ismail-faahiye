/* ============================================================
   Fasalkayga — Akoonka
   ============================================================ */
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { ROLE_LABEL, ROLES, classesForUser, schoolSummary, currentMonth } from '../services/storage';
import { Card, Button, Avatar, Badge, SectionTitle } from '../components/ui';
import { colors, spacing } from '../theme/theme';

export default function ProfileScreen() {
  const { store, user, logout, resetAll } = useApp();
  const myClasses = classesForUser(store, user);
  const summary = schoolSummary(store, currentMonth());

  const confirmLogout = () => {
    Alert.alert('Ka bax', 'Ma ka baxaysaa akoonkaaga?', [
      { text: 'Maya', style: 'cancel' },
      { text: 'Haa, ka bax', style: 'destructive', onPress: logout },
    ]);
  };

  const confirmReset = () => {
    Alert.alert(
      'Nadiifi xogta',
      'Dhammaan fasalada, ardayda, xaadiriska iyo lacagaha waa la tirtirayaa. Tallaabadan dib looma celin karo.',
      [
        { text: 'Maya', style: 'cancel' },
        { text: 'Haa, nadiifi', style: 'destructive', onPress: resetAll },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card style={styles.profile}>
          <Avatar name={user.full_name} size={64} />
          <Text style={styles.name}>{user.full_name}</Text>
          <Badge label={ROLE_LABEL[user.role]} />
          <Text style={styles.phone}>{user.phone}</Text>
        </Card>

        <SectionTitle>Xogta</SectionTitle>
        <Card>
          <Row label="Iskuulka" value={store.school.name} />
          <Row label="Fasalada aan arko" value={String(myClasses.length)} />
          {user.role === ROLES.SUPER_ADMIN && (
            <>
              <Row label="Wadarta ardayda" value={String(summary.students)} />
              <Row label="Macalimiinta" value={String(summary.teachers)} />
            </>
          )}
          <Row label="Aqoonsiga" value={user.user_id} last />
        </Card>

        <SectionTitle>Akoonka</SectionTitle>
        <Button title="Ka bax" variant="danger" onPress={confirmLogout} />

        {user.role === ROLES.SUPER_ADMIN && (
          <>
            <SectionTitle>Halista</SectionTitle>
            <Card>
              <Text style={styles.warnText}>
                Nadiifinta xogtu waxay tirtiraysaa dhammaan fasalada, ardayda, xaadiriska iyo
                lacagaha oo ku jira qalabkan.
              </Text>
              <Button
                title="Nadiifi dhammaan xogta"
                variant="danger"
                onPress={confirmReset}
                style={{ marginTop: spacing.md }}
              />
            </Card>
          </>
        )}

        <Text style={styles.note}>
          Xogtu waxay ku jirtaa qalabkan oo keliya (AsyncStorage). Ma jiro server.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value, last }) {
  return (
    <View style={[styles.row, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  profile: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  name: { fontSize: 19, fontWeight: '800', color: colors.ink },
  phone: { fontSize: 13, color: colors.muted },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    gap: spacing.md,
  },
  rowLabel: { fontSize: 13, color: colors.muted },
  rowValue: { fontSize: 13, fontWeight: '600', color: colors.ink, flexShrink: 1 },
  warnText: { fontSize: 12.5, color: colors.ink2, lineHeight: 18 },
  note: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 18,
  },
});
