/* ============================================================
   KAABE — Profile-ka macalinka / maamulaha

   Macalin walba wuxuu leeyahay profile: sawir, magac, taleefan, maadada
   uu dhigo, iyo wax yar oo isaga ku saabsan — sida Kobciye.

   Doorka iyo iskuulka halkan lagama beddelo: database-ka trigger ayaa
   diidaya, sidaas macalinku iskiis isuma dhigi karo maamule.
   ============================================================ */
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import {
  ROLE_LABEL, ROLES, classesForUser, studentsByClass, schoolSummary,
  currentMonth, formatMoney,
} from '../services/model';
import { pickPhoto } from '../services/photos';
import { confirm, notify } from '../utils/dialog';
import {
  Card, Button, Avatar, Badge, SectionTitle, Field, PhotoPicker, Stat,
} from '../components/ui';
import { colors, radius, spacing } from '../theme/theme';

export default function ProfileScreen() {
  const { store, user, signOut, resetAll, ops, busy, isLive } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.full_name || '',
    phone: user?.phone || '',
    subject: user?.subject || '',
    bio: user?.bio || '',
  });

  const myClasses = useMemo(() => classesForUser(store, user), [store, user]);
  const myStudents = useMemo(
    () => myClasses.reduce((sum, k) => sum + studentsByClass(store, k.class_id).length, 0),
    [store, myClasses],
  );
  const summary = useMemo(() => schoolSummary(store, currentMonth()), [store]);
  const isAdmin = user.role === ROLES.SUPER_ADMIN;

  const openEdit = () => {
    setForm({
      fullName: user.full_name,
      phone: user.phone || '',
      subject: user.subject || '',
      bio: user.bio || '',
    });
    setEditing(true);
  };

  const save = async () => {
    try {
      await ops.updateProfile(form);
      setEditing(false);
    } catch (e) {
      notify('Khalad', e.message);
    }
  };

  const changePhoto = async ({ camera }) => {
    const { uri, error } = await pickPhoto({ camera });
    if (error) return notify('Khalad', error);
    if (!uri) return;
    try {
      await ops.updateProfile({ photoUri: uri });
    } catch (e) {
      notify('Khalad', e.message);
    }
  };

  const confirmSignOut = () => confirm({
    title: 'Ka bax',
    message: 'Ma ka baxaysaa akoonkaaga?',
    confirmLabel: 'Haa, ka bax',
    destructive: true,
    onConfirm: signOut,
  });

  const confirmReset = () => confirm({
    title: 'Nadiifi xogta',
    message: 'Dhammaan fasalada, ardayda, xaadiriska iyo lacagaha waa la tirtirayaa. Dib looma celin karo.',
    confirmLabel: 'Haa, nadiifi',
    destructive: true,
    onConfirm: resetAll,
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <PhotoPicker
            name={user.full_name}
            photoUri={user.photo_uri}
            size={104}
            onPick={changePhoto}
            label="Sawirkaaga"
          />
          <Text style={styles.name}>{user.full_name}</Text>
          <Badge
            label={ROLE_LABEL[user.role]}
            bg={isAdmin ? colors.accentSoft : colors.primarySoft}
            fg={isAdmin ? colors.amber : colors.primary}
          />
          {!!user.subject && <Text style={styles.subject}>{user.subject}</Text>}
          {!!user.bio && <Text style={styles.bio}>{user.bio}</Text>}
        </View>

        <View style={styles.statRow}>
          <Stat label={isAdmin ? 'Fasalada' : 'Fasaladayda'} value={myClasses.length} tone="primary" />
          <Stat label="Ardayda" value={myStudents} tone="green" />
          {isAdmin && (
            <Stat
              label="Hadhaaga bisha"
              value={formatMoney(summary.balance, store.school.currency)}
              tone="red"
            />
          )}
        </View>

        {editing ? (
          <>
            <SectionTitle>Wax ka beddel</SectionTitle>
            <Card>
              <Field
                label="Magaca oo buuxa"
                value={form.fullName}
                onChangeText={(v) => setForm({ ...form, fullName: v })}
              />
              <Field
                label="Taleefanka"
                value={form.phone}
                onChangeText={(v) => setForm({ ...form, phone: v })}
                keyboardType="phone-pad"
              />
              <Field
                label="Maadada aad dhigto"
                placeholder="Tusaale: Xisaab"
                value={form.subject}
                onChangeText={(v) => setForm({ ...form, subject: v })}
              />
              <Field
                label="Wax yar oo kugu saabsan"
                placeholder="Tusaale: 5 sano oo waxbarid ah"
                value={form.bio}
                onChangeText={(v) => setForm({ ...form, bio: v })}
                multiline
                numberOfLines={3}
                style={styles.bioInput}
              />
              <Button title={busy ? 'Sugaya…' : 'Kaydi'} onPress={save} disabled={busy} />
              <Button
                title="Jooji"
                variant="ghost"
                onPress={() => setEditing(false)}
                style={{ marginTop: spacing.sm }}
              />
            </Card>
          </>
        ) : (
          <>
            <SectionTitle
              right={(
                <TouchableOpacity onPress={openEdit}>
                  <Text style={styles.link}>Wax ka beddel</Text>
                </TouchableOpacity>
              )}
            >
              Xogtayda
            </SectionTitle>
            <Card>
              <Row label="Email" value={user.email || '—'} />
              <Row label="Taleefan" value={user.phone || '—'} />
              <Row label="Maadada" value={user.subject || '—'} />
              <Row label="Iskuulka" value={store.school.name} last />
            </Card>
          </>
        )}

        {myClasses.length > 0 && (
          <>
            <SectionTitle>{isAdmin ? 'Fasalada iskuulka' : 'Fasaladayda'}</SectionTitle>
            <View style={styles.chipRow}>
              {myClasses.map((k) => (
                <View key={k.class_id} style={styles.chip}>
                  <Text style={styles.chipText}>{k.name}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <SectionTitle>Akoonka</SectionTitle>
        <Card>
          <Row
            label="Xogta"
            value={isLive ? 'Server-ka Supabase' : 'Qalabkan (tijaabo)'}
            last
          />
        </Card>
        <Button title="Ka bax" variant="danger" onPress={confirmSignOut} style={{ marginTop: spacing.md }} />

        {isAdmin && !isLive && (
          <>
            <SectionTitle>Halista</SectionTitle>
            <Card>
              <Text style={styles.warnText}>
                Habka tijaabada, xogtu qalabkan ayay ku jirtaa. Nadiifintu waxay tirtiraysaa
                dhammaan fasalada, ardayda, xaadiriska iyo lacagaha.
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
          {isLive
            ? 'Xogtu waxay ku jirtaa Supabase; ogolaanshaha database-ka ayaa xaqiijiya (RLS).'
            : 'Habka tijaabada — xogtu qalabkan ayay ku jirtaa. Buuxi .env si aad server-ka ugu xirto.'}
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
  hero: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  name: { fontSize: 21, fontWeight: '800', color: colors.ink, marginTop: spacing.sm },
  subject: { fontSize: 13, color: colors.ink2, fontWeight: '600' },
  bio: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
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
  link: { fontSize: 13, fontWeight: '700', color: colors.primary },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  chipText: { fontSize: 12.5, fontWeight: '600', color: colors.primary },
  bioInput: { minHeight: 76, textAlignVertical: 'top' },
  warnText: { fontSize: 12.5, color: colors.ink2, lineHeight: 18 },
  note: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 18,
    paddingHorizontal: spacing.md,
  },
});
