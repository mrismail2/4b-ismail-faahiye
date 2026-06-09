import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients, glass } from '../constants/colors';
import { Text as TextStyles } from '../constants/text';
import AppLogo from '../widgets/AppLogo';
import AppButton from '../widgets/AppButton';
import LanguageSwitcher from '../widgets/LanguageSwitcher';
import { useAuth, DEMO_ACCOUNT_LIST } from '../context/AuthContext';
import { useLocalization } from '../context/LocalizationContext';
import { AppRole } from '../constants/roles';
import { showRegisterSchoolSheet } from '../widgets/RegisterSchoolSheet';
import { roleHomeScreen } from '../navigation/roleRedirect';

const FEATURE_PILLS = [
  'Trusted by school owners and parents',
  'Built with English & Somali in mind',
  'Designed mobile-first, works everywhere',
];

export default function LoginScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isDesktop = width > 920;
  const { t } = useLocalization();
  const { signIn, error, loading, currentUser } = useAuth();

  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [obscure, setObscure] = useState(true);
  const [obscureConfirm, setObscureConfirm] = useState(true);
  const [localError, setLocalError] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const submit = async () => {
    setLocalError(null);
    const ok = await signIn({ email, password });
    if (ok) {
      const acct = DEMO_ACCOUNT_LIST.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      navigation.replace(roleHomeScreen(acct?.role));
    } else {
      setLocalError("We couldn't find an account with that email.");
    }
  };

  const submitRegister = () => {
    setLocalError(null);
    if (!email.trim()) { setLocalError('Please enter your email address.'); return; }
    if (password.length < 8) { setLocalError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword) { setLocalError('Passwords do not match. Please try again.'); return; }
    // Phase 1: UI-only — registration request is acknowledged but not persisted.
    setRegisterSuccess(true);
    setEmail(''); setPassword(''); setConfirmPassword('');
  };

  // Public preview is intentionally limited to the Student and Parent
  // portals — the most useful "show me the app" experience for schools
  // and visitors evaluating Kobciye. Admin, teacher and accountant
  // dashboards stay fully built and reachable in the codebase, but are
  // only meant to be opened through real Supabase Auth in a later phase,
  // so they are not advertised as public preview buttons here.
  const previewAccount = (role) => DEMO_ACCOUNT_LIST.find((u) => u.role === role);

  const continueAsPreview = async (role) => {
    const acct = previewAccount(role);
    if (!acct) return;
    setLocalError(null);
    const ok = await signIn({ email: acct.email, password: 'preview' });
    if (ok) navigation.replace(roleHomeScreen(acct.role));
  };

  const card = (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <Text style={[TextStyles.h1, { flex: 1 }]}>{tab === 'login' ? t('welcomeBack') : 'Create Account'}</Text>
        <LanguageSwitcher />
      </View>

      {/* Tab switcher */}
      <View style={styles.tabRow}>
        <Pressable onPress={() => { setTab('login'); setLocalError(null); setRegisterSuccess(false); }} style={[styles.tabBtn, tab === 'login' && styles.tabBtnActive]}>
          <Ionicons name="log-in-outline" size={15} color={tab === 'login' ? Colors.primary : Colors.muted} />
          <Text style={[styles.tabBtnLabel, tab === 'login' && styles.tabBtnLabelActive]}>Sign In</Text>
        </Pressable>
        <Pressable onPress={() => { setTab('register'); setLocalError(null); setRegisterSuccess(false); }} style={[styles.tabBtn, tab === 'register' && styles.tabBtnActive]}>
          <Ionicons name="person-add-outline" size={15} color={tab === 'register' ? Colors.primary : Colors.muted} />
          <Text style={[styles.tabBtnLabel, tab === 'register' && styles.tabBtnLabelActive]}>Register</Text>
        </Pressable>
      </View>

      {tab === 'login' ? (
        <>
          <Text style={[TextStyles.bodyMuted, { marginTop: 6 }]}>{t('signInToContinue')}</Text>

          <Text style={styles.fieldLabel}>{t('email')}</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="at" size={18} color={Colors.muted} style={{ marginRight: 8 }} />
            <TextInput value={email} onChangeText={setEmail} placeholder="name@school.com"
              placeholderTextColor={Colors.muted} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
          </View>

          <Text style={styles.fieldLabel}>{t('password')}</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color={Colors.muted} style={{ marginRight: 8 }} />
            <TextInput value={password} onChangeText={setPassword} placeholder="••••••••"
              placeholderTextColor={Colors.muted} secureTextEntry={obscure} style={styles.input} />
            <Pressable onPress={() => setObscure((v) => !v)} hitSlop={8}>
              <Ionicons name={obscure ? 'eye-outline' : 'eye-off-outline'} size={18} color={Colors.muted} />
            </Pressable>
          </View>

          <Pressable style={{ alignSelf: 'flex-end', marginTop: 6, marginBottom: 4 }}>
            <Text style={styles.link}>{t('forgotPassword')}</Text>
          </Pressable>

          {(localError || error) && <Text style={styles.error}>{localError || error}</Text>}

          <View style={{ marginTop: 8 }}>
            <AppButton label={t('signIn')} icon={<Ionicons name="log-in-outline" size={18} color="#fff" />}
              loading={loading} onPress={submit} fullWidth />
          </View>

          <Pressable onPress={() => showRegisterSchoolSheet()} style={styles.requestRow}>
            <Ionicons name="school-outline" size={16} color={Colors.primary} />
            <Text style={[styles.link, { marginLeft: 6 }]}>{t('requestSchoolAccount')}</Text>
          </Pressable>

          <View style={styles.divider} />

          <Text style={TextStyles.caption}>{t('quickDemoAccess')}</Text>
          <View style={styles.previewRow}>
            <Pressable onPress={() => continueAsPreview(AppRole.student)} style={styles.previewBtn}>
              <Ionicons name="school-outline" size={16} color={Colors.primary} />
              <Text style={styles.previewBtnLabel}>{t('previewStudentPortal')}</Text>
            </Pressable>
            <Pressable onPress={() => continueAsPreview(AppRole.parent)} style={styles.previewBtn}>
              <Ionicons name="home-outline" size={16} color={Colors.primary} />
              <Text style={styles.previewBtnLabel}>{t('previewParentPortal')}</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <>
          <Text style={[TextStyles.bodyMuted, { marginTop: 6 }]}>Create your Kobciye account.</Text>

          {registerSuccess ? (
            <View style={styles.successBox}>
              <Ionicons name="checkmark-circle" size={32} color="#22c55e" style={{ marginBottom: 10 }} />
              <Text style={styles.successTitle}>Request received!</Text>
              <Text style={styles.successBody}>Your registration request has been submitted. A school admin will activate your account and send you login details.</Text>
              <Pressable onPress={() => { setTab('login'); setRegisterSuccess(false); }} style={{ marginTop: 16 }}>
                <Text style={styles.link}>Back to Sign In</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={styles.fieldLabel}>{t('email')}</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="at" size={18} color={Colors.muted} style={{ marginRight: 8 }} />
                <TextInput value={email} onChangeText={setEmail} placeholder="name@school.com"
                  placeholderTextColor={Colors.muted} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
              </View>

              <Text style={styles.fieldLabel}>{t('password')}</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.muted} style={{ marginRight: 8 }} />
                <TextInput value={password} onChangeText={setPassword} placeholder="Min. 8 characters"
                  placeholderTextColor={Colors.muted} secureTextEntry={obscure} style={styles.input} />
                <Pressable onPress={() => setObscure((v) => !v)} hitSlop={8}>
                  <Ionicons name={obscure ? 'eye-outline' : 'eye-off-outline'} size={18} color={Colors.muted} />
                </Pressable>
              </View>

              <Text style={styles.fieldLabel}>Confirm Password</Text>
              <View style={[styles.inputWrap, confirmPassword.length > 0 && confirmPassword !== password && styles.inputWrapError]}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.muted} style={{ marginRight: 8 }} />
                <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Re-enter password"
                  placeholderTextColor={Colors.muted} secureTextEntry={obscureConfirm} style={styles.input} />
                <Pressable onPress={() => setObscureConfirm((v) => !v)} hitSlop={8}>
                  <Ionicons name={obscureConfirm ? 'eye-outline' : 'eye-off-outline'} size={18} color={Colors.muted} />
                </Pressable>
              </View>
              {confirmPassword.length > 0 && confirmPassword !== password && (
                <Text style={[styles.error, { marginTop: 4 }]}>Passwords do not match</Text>
              )}

              {localError && <Text style={styles.error}>{localError}</Text>}

              <View style={{ marginTop: 16 }}>
                <AppButton label="Create Account" icon={<Ionicons name="person-add-outline" size={18} color="#fff" />}
                  onPress={submitRegister} fullWidth />
              </View>

              <Pressable onPress={() => { setTab('login'); setLocalError(null); }} style={[styles.requestRow, { marginTop: 14 }]}>
                <Text style={styles.link}>Already have an account? Sign in</Text>
              </Pressable>
            </>
          )}
        </>
      )}
    </View>
  );

  if (isDesktop) {
    return (
      <View style={styles.desktopRow}>
        <LinearGradient colors={Gradients.brand} style={styles.desktopHero}>
          <AppLogo size={42} light showTagline />
          <Text style={styles.heroTitle}>Run your school with confidence</Text>
          <Text style={styles.heroSubtitle}>
            A professional school portal where parents follow attendance, exams, payments and reports, while students see their school progress clearly.
          </Text>
          {FEATURE_PILLS.map((p) => (
            <View key={p} style={styles.pillRow}>
              <View style={styles.pillCheck}>
                <Ionicons name="checkmark" size={16} color="#fff" />
              </View>
              <Text style={styles.pillLabel}>{p}</Text>
            </View>
          ))}
        </LinearGradient>
        <ScrollView contentContainerStyle={styles.desktopFormWrap}>{card}</ScrollView>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
      <LinearGradient colors={Gradients.brand} style={styles.mobileHero}>
        <AppLogo size={40} light showTagline />
      </LinearGradient>
      <View style={styles.mobileCardWrap}>{card}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 28,
    shadowColor: Colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 50,
    shadowOffset: { width: 0, height: 26 },
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'center' },
  fieldLabel: { ...TextStyles.bodyMuted, fontWeight: '700', marginTop: 18, marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, paddingHorizontal: 14, backgroundColor: Colors.background,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 14, color: Colors.text },
  link: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
  error: { color: Colors.danger, fontSize: 12.5, marginTop: 6, fontWeight: '600' },
  requestRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 18 },
  previewRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  previewBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 11, paddingHorizontal: 16,
    borderRadius: 12, backgroundColor: `${Colors.primaryLight}14`, borderWidth: 1.5, borderColor: `${Colors.primaryLight}33`,
  },
  previewBtnLabel: { fontSize: 13.5, fontWeight: '700', color: Colors.primary },

  desktopRow: { flex: 1, flexDirection: 'row' },
  desktopHero: { flex: 1, padding: 56, justifyContent: 'center' },
  heroTitle: { fontSize: 32, fontWeight: '800', color: '#fff', marginTop: 28, letterSpacing: -0.5 },
  heroSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 14, lineHeight: 24 },
  pillRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  pillCheck: { width: 28, height: 28, borderRadius: 9, backgroundColor: glass(0.16), alignItems: 'center', justifyContent: 'center' },
  pillLabel: { color: 'rgba(255,255,255,0.85)', marginLeft: 12, fontSize: 14, flexShrink: 1 },
  desktopFormWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },

  mobileHero: { paddingHorizontal: 24, paddingTop: 64, paddingBottom: 64, alignItems: 'flex-start' },
  mobileCardWrap: { marginTop: -28, paddingHorizontal: 20, paddingBottom: 32 },

  tabRow: { flexDirection: 'row', marginTop: 18, borderRadius: 14, backgroundColor: Colors.background, padding: 4, gap: 4 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 9, borderRadius: 11 },
  tabBtnActive: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  tabBtnLabel: { fontSize: 13.5, fontWeight: '600', color: Colors.muted },
  tabBtnLabelActive: { color: Colors.primary, fontWeight: '700' },
  inputWrapError: { borderColor: Colors.danger },
  successBox: { marginTop: 20, alignItems: 'center', paddingVertical: 24, paddingHorizontal: 12 },
  successTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  successBody: { fontSize: 13.5, color: Colors.muted, textAlign: 'center', lineHeight: 21 },
});
