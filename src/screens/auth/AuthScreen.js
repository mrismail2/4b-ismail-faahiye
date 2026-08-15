/* ============================================================
   KAABE — Soo gal / Koodh casuumaad

   Laba jid oo keliya ayaa jira:
     · Soo gal — qofka akoon hore u leh
     · Koodh casuumaad — macalinka maamuluhu casumay

   Qofna ISKIIS doorkiisa ma dooran karo: casuumaadda ayaa go'aamisa
   in uu macalin yahay iyo iskuulka uu ka tirsan yahay. Maamulaha
   koowaad SQL ayaa lagu abuuraa (eeg supabase/README.md).
   ============================================================ */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { DEMO_CREDENTIALS } from '../../data/seed';
import { Button, Field, Card, Badge } from '../../components/ui';
import { notify } from '../../utils/dialog';
import { colors, radius, spacing } from '../../theme/theme';

export default function AuthScreen() {
  const { signIn, redeemInvite, peekInvite, busy, isLive } = useApp();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', code: '', confirm: '' });
  const [invite, setInvite] = useState(null);
  const [checking, setChecking] = useState(false);

  const isLogin = mode === 'login';
  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const login = async () => {
    try {
      await signIn(form.email, form.password);
    } catch (e) {
      notify('Khalad', e.message || 'Wax baa qaldamay.');
    }
  };

  /* Koodhka hubi ka hor inta aan furaha la weydiin */
  const checkCode = async () => {
    setChecking(true);
    try {
      const found = await peekInvite(form.code);
      setInvite(found);
    } catch (e) {
      notify('Koodhka', e.message || 'Koodhkan ma shaqaynayo.');
    } finally {
      setChecking(false);
    }
  };

  const join = async () => {
    if (form.password.length < 6) {
      return notify('Furaha', 'Furaha waa inuu ugu yaraan 6 xaraf noqdo.');
    }
    if (form.password !== form.confirm) {
      return notify('Furaha', 'Labada fure isku mid ma aha.');
    }
    try {
      await redeemInvite({ code: form.code, email: form.email, password: form.password });
    } catch (e) {
      notify('Khalad', e.message || 'Wax baa qaldamay.');
    }
  };

  const useDemo = () => {
    setMode('login');
    setForm({ ...form, email: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password });
  };

  const switchMode = (next) => {
    setMode(next);
    setInvite(null);
    setForm({ email: '', password: '', code: '', confirm: '' });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.brand}>
            <View style={styles.logo}><Text style={styles.logoText}>K</Text></View>
            <Text style={styles.appName}>KAABE</Text>
            <Text style={styles.tagline}>Ardayda · Xaadiriska · Lacagaha bilaha</Text>
            <Badge
              label={isLive ? 'Ku xiran server-ka' : 'Habka tijaabada'}
              bg={isLive ? colors.greenSoft : colors.amberSoft}
              fg={isLive ? colors.green : colors.amber}
              style={{ marginTop: spacing.md }}
            />
          </View>

          <Card>
            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tab, isLogin && styles.tabActive]}
                onPress={() => switchMode('login')}
              >
                <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Soo gal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, !isLogin && styles.tabActive]}
                onPress={() => switchMode('invite')}
              >
                <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Koodh casuumaad</Text>
              </TouchableOpacity>
            </View>

            {isLogin ? (
              <>
                <Field
                  label="Email"
                  placeholder="magac@tusaale.so"
                  value={form.email}
                  onChangeText={set('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Field
                  label="Furaha sirta ah"
                  placeholder="••••••"
                  value={form.password}
                  onChangeText={set('password')}
                  secureTextEntry
                  autoCapitalize="none"
                />
                <Button
                  title={busy ? 'Sugaya…' : 'Soo gal'}
                  onPress={login}
                  disabled={busy}
                />
              </>
            ) : !invite ? (
              <>
                <View style={styles.hint}>
                  <Ionicons name="key-outline" size={16} color={colors.primary} />
                  <Text style={styles.hintText}>
                    Maamuluhu koodh buu ku soo diray. Halkan geli si aad akoonkaaga u samayso.
                  </Text>
                </View>

                <Field
                  label="Koodhka casuumaadda"
                  placeholder="KAB-XXXXXX"
                  value={form.code}
                  onChangeText={(v) => set('code')(v.toUpperCase())}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  style={styles.codeInput}
                />
                <Button
                  title={checking ? 'La hubinayo…' : 'Hubi koodhka'}
                  onPress={checkCode}
                  disabled={checking || !form.code.trim()}
                />
              </>
            ) : (
              <>
                <View style={styles.inviteBox}>
                  <View style={styles.inviteIcon}>
                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  </View>
                  <Text style={styles.inviteName}>{invite.fullName}</Text>
                  <Text style={styles.inviteSchool}>{invite.schoolName}</Text>
                  {invite.classes?.length > 0 && (
                    <View style={styles.inviteChips}>
                      {invite.classes.map((c) => (
                        <View key={c} style={styles.chip}>
                          <Text style={styles.chipText}>{c}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  <Text style={styles.inviteRole}>Doorka: Macalin</Text>
                </View>

                <Field
                  label="Emailkaaga"
                  hint="Waa inuu la mid noqdaa kii maamuluhu casumay."
                  placeholder="magac@tusaale.so"
                  value={form.email}
                  onChangeText={set('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Field
                  label="Fure cusub"
                  placeholder="••••••"
                  hint="Ugu yaraan 6 xaraf."
                  value={form.password}
                  onChangeText={set('password')}
                  secureTextEntry
                  autoCapitalize="none"
                />
                <Field
                  label="Ku celi furaha"
                  placeholder="••••••"
                  value={form.confirm}
                  onChangeText={set('confirm')}
                  secureTextEntry
                  autoCapitalize="none"
                />

                <Button
                  title={busy ? 'Sugaya…' : 'Ku biir KAABE'}
                  onPress={join}
                  disabled={busy}
                />
                <Button
                  title="Koodh kale"
                  variant="ghost"
                  onPress={() => setInvite(null)}
                  style={{ marginTop: spacing.sm }}
                />
              </>
            )}
          </Card>

          {!isLive && isLogin && (
            <TouchableOpacity onPress={useDemo} style={styles.demo}>
              <Text style={styles.demoText}>
                Akoonka tijaabada: {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
              </Text>
            </TouchableOpacity>
          )}

          <Text style={styles.note}>
            Macalinku iskiis akoon ma abuuro — maamulaha guud ayaa casuumaya.
            Ardayda iyo waalidiintuna akoon ma laha.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl },
  brand: { alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.xl },
  logo: {
    width: 66, height: 66, borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoText: { color: '#FFFFFF', fontSize: 32, fontWeight: '800' },
  appName: { fontSize: 30, fontWeight: '800', color: colors.ink, letterSpacing: 2 },
  tagline: { fontSize: 13, color: colors.muted, marginTop: 5 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
    padding: 4,
    marginBottom: spacing.lg,
    gap: 4,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: radius.sm - 3, alignItems: 'center' },
  tabActive: { backgroundColor: colors.surface },
  tabText: { fontSize: 13.5, fontWeight: '600', color: colors.primary },
  tabTextActive: { color: colors.ink },
  hint: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.primarySoft,
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.lg,
  },
  hintText: { flex: 1, fontSize: 12.5, color: colors.ink2, lineHeight: 18 },
  codeInput: { fontSize: 19, fontWeight: '800', letterSpacing: 3, textAlign: 'center' },
  inviteBox: {
    alignItems: 'center',
    backgroundColor: colors.greenSoft,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  inviteIcon: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: colors.green,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  inviteName: { fontSize: 17, fontWeight: '800', color: colors.ink },
  inviteSchool: { fontSize: 13, color: colors.ink2, marginTop: 3 },
  inviteChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.sm },
  chip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipText: { fontSize: 12, fontWeight: '600', color: colors.green },
  inviteRole: { fontSize: 12, color: colors.green, fontWeight: '700', marginTop: spacing.sm },
  demo: { marginTop: spacing.lg, alignItems: 'center' },
  demoText: { fontSize: 12, color: colors.primary, textAlign: 'center' },
  note: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 18,
  },
});
