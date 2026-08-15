/* ============================================================
   Fasalkayga — Soo gal / Isdiiwaan geli

   Laba dood oo keliya ayaa la diiwaan gelin karaa:
     · Maamulaha Guud (super admin)
     · Macalin (teacher)
   Ardayda iyo waalidiinta MA AHA isticmaalayaal — waa xog uu macalinku
   fasalka ku dhex maamulo.
   ============================================================ */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { ROLES, ROLE_LABEL } from '../../services/storage';
import { DEMO_CREDENTIALS } from '../../data/seed';
import { Button, Field, Card } from '../../components/ui';
import { colors, radius, spacing } from '../../theme/theme';

const ROLE_OPTIONS = [
  {
    key: ROLES.SUPER_ADMIN,
    label: ROLE_LABEL.super_admin,
    desc: 'Wuxuu abuuraa fasalada, macalimiinta ayuu u qoondeeyaa, wuxuuna arkaa warbixinta guud.',
  },
  {
    key: ROLES.TEACHER,
    label: ROLE_LABEL.teacher,
    desc: 'Wuxuu maamulaa fasalkiisa: magacyada ardayda, xaadiriska iyo lacagaha bilaha.',
  },
];

export default function AuthScreen() {
  const { login, register } = useApp();
  const [mode, setMode] = useState('login');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES.TEACHER);
  const [busy, setBusy] = useState(false);

  const isLogin = mode === 'login';

  const submit = async () => {
    setBusy(true);
    try {
      if (isLogin) {
        await login(phone, password);
      } else {
        await register({ fullName, phone, password, role });
      }
    } catch (e) {
      Alert.alert('Khalad', e.message || 'Wax baa qaldamay.');
    } finally {
      setBusy(false);
    }
  };

  const useDemo = () => {
    setMode('login');
    setPhone(DEMO_CREDENTIALS.phone);
    setPassword(DEMO_CREDENTIALS.password);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.brand}>
            <View style={styles.logo}><Text style={styles.logoText}>F</Text></View>
            <Text style={styles.appName}>Fasalkayga</Text>
            <Text style={styles.tagline}>Xaadiris · Lacagaha bilaha · Ardayda</Text>
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
                  value={fullName}
                  onChangeText={setFullName}
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
              label="Taleefanka"
              placeholder="061xxxxxxx"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoCapitalize="none"
            />
            <Field
              label="Furaha sirta ah"
              placeholder="••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <Button
              title={busy ? 'Sugaya…' : isLogin ? 'Soo gal' : 'Akoon samee'}
              onPress={submit}
              disabled={busy}
            />
          </Card>

          <TouchableOpacity onPress={useDemo} style={styles.demo}>
            <Text style={styles.demoText}>
              Isticmaal akoonka tijaabada (maamule): {DEMO_CREDENTIALS.phone} / {DEMO_CREDENTIALS.password}
            </Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            Ardayda iyo waalidiinta akoon ma laha — macalinka ayaa fasalka ku dhex qora.
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
    width: 62, height: 62, borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoText: { color: '#FFFFFF', fontSize: 30, fontWeight: '800' },
  appName: { fontSize: 26, fontWeight: '800', color: colors.ink },
  tagline: { fontSize: 13, color: colors.muted, marginTop: 4 },
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
