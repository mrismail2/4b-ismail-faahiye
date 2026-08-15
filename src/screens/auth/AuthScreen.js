/* ============================================================
   KAABE — Soo gal / Isdiiwaan geli

   Laba dood oo keliya ayaa akoon leh:
     · Maamulaha Guud (super admin)
     · Macalin (teacher)
   Ardaydu MA aha isticmaalayaal — waa diiwaan uu macalinku maamulo.
   ============================================================ */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { ROLES, ROLE_LABEL } from '../../services/model';
import { DEMO_CREDENTIALS } from '../../data/seed';
import { Button, Field, Card, Badge } from '../../components/ui';
import { colors, radius, spacing } from '../../theme/theme';

const ROLE_OPTIONS = [
  {
    key: ROLES.SUPER_ADMIN,
    label: ROLE_LABEL.super_admin,
    desc: 'Abuuraa fasalada, macalimiinta ayuu u qoondeeyaa, wuxuu arkaa warbixinta guud.',
  },
  {
    key: ROLES.TEACHER,
    label: ROLE_LABEL.teacher,
    desc: 'Wuxuu maamulaa fasalkiisa: ardayda, xaadiriska iyo lacagaha bilaha.',
  },
];

export default function AuthScreen() {
  const { signIn, signUp, busy, isLive } = useApp();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [role, setRole] = useState(ROLES.TEACHER);

  const isLogin = mode === 'login';
  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async () => {
    try {
      if (isLogin) {
        await signIn(form.email, form.password);
      } else {
        await signUp({ ...form, role });
      }
    } catch (e) {
      Alert.alert('Khalad', e.message || 'Wax baa qaldamay.');
    }
  };

  const useDemo = () => {
    setMode('login');
    setForm({ ...form, email: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password });
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
                onPress={() => setMode('login')}
              >
                <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Soo gal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, !isLogin && styles.tabActive]}
                onPress={() => setMode('register')}
              >
                <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Isdiiwaan geli</Text>
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <>
                <Field
                  label="Magaca oo buuxa"
                  placeholder="Tusaale: Cabdi Xasan"
                  value={form.fullName}
                  onChangeText={set('fullName')}
                />
                <Field
                  label="Taleefanka"
                  placeholder="061xxxxxxx"
                  value={form.phone}
                  onChangeText={set('phone')}
                  keyboardType="phone-pad"
                />

                <Text style={styles.roleHeading}>Doorka</Text>
                {ROLE_OPTIONS.map((opt) => {
                  const active = role === opt.key;
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      style={[styles.roleCard, active && styles.roleCardActive]}
                      onPress={() => setRole(opt.key)}
                      activeOpacity={0.85}
                    >
                      <View style={styles.roleRow}>
                        <View style={[styles.radio, active && styles.radioActive]}>
                          {active && <View style={styles.radioDot} />}
                        </View>
                        <Text style={[styles.roleLabel, active && styles.roleLabelActive]}>
                          {opt.label}
                        </Text>
                      </View>
                      <Text style={styles.roleDesc}>{opt.desc}</Text>
                    </TouchableOpacity>
                  );
                })}
                <View style={{ height: spacing.md }} />
              </>
            )}

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
              hint={isLogin ? undefined : 'Ugu yaraan 6 xaraf.'}
              value={form.password}
              onChangeText={set('password')}
              secureTextEntry
              autoCapitalize="none"
            />

            <Button
              title={busy ? 'Sugaya…' : isLogin ? 'Soo gal' : 'Akoon samee'}
              onPress={submit}
              disabled={busy}
            />
          </Card>

          {!isLive && (
            <TouchableOpacity onPress={useDemo} style={styles.demo}>
              <Text style={styles.demoText}>
                Akoonka tijaabada: {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
              </Text>
            </TouchableOpacity>
          )}

          <Text style={styles.note}>
            Ardayda iyo waalidiintu akoon ma laha — macalinka ayaa fasalka ku dhex qora.
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
  tabText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  tabTextActive: { color: colors.ink },
  roleHeading: { fontSize: 13, fontWeight: '600', color: colors.ink2, marginBottom: 8 },
  roleCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  roleCardActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  roleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  radio: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: colors.muted,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: colors.primary },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  roleLabel: { fontSize: 14, fontWeight: '700', color: colors.ink },
  roleLabelActive: { color: colors.primary },
  roleDesc: { fontSize: 12, color: colors.muted, marginTop: 6, lineHeight: 17 },
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
