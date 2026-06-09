import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, useWindowDimensions, Modal } from 'react-native';
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

function ForgotPasswordModal({ visible, onClose }) {
  const [fpEmail, setFpEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!fpEmail.trim()) return;
    setSent(true);
  };

  const handleClose = () => {
    setFpEmail('');
    setSent(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={fpStyles.backdrop} onPress={handleClose}>
        <Pressable style={fpStyles.sheet} onPress={() => {}}>
          {/* Close button */}
          <Pressable onPress={handleClose} style={fpStyles.closeBtn} hitSlop={10}>
            <Ionicons name="close" size={20} color={Colors.muted} />
          </Pressable>

          <LinearGradient colors={Gradients.brand} style={fpStyles.iconWrap}>
            <Ionicons name="lock-open-outline" size={26} color="#fff" />
          </LinearGradient>

          <Text style={fpStyles.title}>Forgot Password?</Text>
          <Text style={fpStyles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>

          {sent ? (
            <View style={fpStyles.successBox}>
              <Ionicons name="checkmark-circle" size={40} color={Colors.success} style={{ marginBottom: 10 }} />
              <Text style={fpStyles.successText}>
                Check your inbox — a reset link has been sent to{' '}
                <Text style={{ fontWeight: '800', color: Colors.primary }}>{fpEmail}</Text>
              </Text>
              <Pressable onPress={handleClose} style={fpStyles.doneBtn}>
                <Text style={fpStyles.doneBtnLabel}>Done</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={fpStyles.label}>Email address</Text>
              <View style={fpStyles.inputWrap}>
                <Ionicons name="at" size={18} color={Colors.muted} style={{ marginRight: 8 }} />
                <TextInput
                  value={fpEmail}
                  onChangeText={setFpEmail}
                  placeholder="name@school.com"
                  placeholderTextColor={Colors.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={fpStyles.input}
                />
              </View>
              <Pressable
                onPress={handleSend}
                style={[fpStyles.sendBtn, !fpEmail.trim() && { opacity: 0.45 }]}
              >
                <LinearGradient colors={Gradients.brand} style={fpStyles.sendBtnGrad}>
                  <Ionicons name="send-outline" size={16} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={fpStyles.sendBtnLabel}>Send reset link</Text>
                </LinearGradient>
              </Pressable>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const fpStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10,46,107,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.surface,
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 16 },
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 6 },
  subtitle: { fontSize: 13.5, color: Colors.muted, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  label: { alignSelf: 'flex-start', fontSize: 13, fontWeight: '700', color: Colors.muted, marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: Colors.background,
    width: '100%',
    marginBottom: 18,
  },
  input: { flex: 1, paddingVertical: 14, fontSize: 14, color: Colors.text },
  sendBtn: { width: '100%', borderRadius: 14, overflow: 'hidden' },
  sendBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15 },
  sendBtnLabel: { color: '#fff', fontWeight: '800', fontSize: 15 },
  successBox: { alignItems: 'center', paddingVertical: 8 },
  successText: { fontSize: 14, color: Colors.muted, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  doneBtn: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: `${Colors.primaryLight}14`,
    borderWidth: 1.5,
    borderColor: `${Colors.primary}40`,
  },
  doneBtnLabel: { fontSize: 14, fontWeight: '800', color: Colors.primary },
});

export default function LoginScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isDesktop = width > 920;
  const { t } = useLocalization();
  const { signIn, error, loading, currentUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [obscure, setObscure] = useState(true);
  const [localError, setLocalError] = useState(null);
  const [fpVisible, setFpVisible] = useState(false);

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
      <ForgotPasswordModal visible={fpVisible} onClose={() => setFpVisible(false)} />

      <View style={styles.cardTopRow}>
        <Text style={[TextStyles.h1, { flex: 1 }]}>{t('welcomeBack')}</Text>
        <LanguageSwitcher />
      </View>

      <Text style={[TextStyles.bodyMuted, { marginTop: 10 }]}>{t('signInToContinue')}</Text>

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

      <Pressable onPress={() => setFpVisible(true)} style={{ alignSelf: 'flex-end', marginTop: 6, marginBottom: 4 }}>
        <Text style={styles.link}>{t('forgotPassword')}</Text>
      </Pressable>

      {(localError || error) && <Text style={styles.error}>{localError || error}</Text>}

      <View style={{ marginTop: 8 }}>
        <AppButton label={t('signIn')} icon={<Ionicons name="log-in-outline" size={18} color="#fff" />}
          loading={loading} onPress={submit} fullWidth />
      </View>

      <Pressable onPress={() => showRegisterSchoolSheet()} style={styles.requestRow}>
        <Ionicons name="school-outline" size={16} color={Colors.primary} />
        <Text style={[styles.link, { marginLeft: 6 }]}>Register your school</Text>
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
    </View>
  );

  if (isDesktop) {
    return (
      <View style={styles.desktopRow}>
        <LinearGradient colors={Gradients.brandVibrant} style={styles.desktopHero}>
          <View style={styles.heroCircle1} pointerEvents="none" />
          <View style={styles.heroCircle2} pointerEvents="none" />
          <View style={styles.heroCircle3} pointerEvents="none" />
          <AppLogo size={42} light showTagline />
          <Text style={styles.heroTitle}>Run your school with confidence</Text>
          <Text style={styles.heroSubtitle}>
            A professional school portal where parents follow attendance, exams, payments and reports, while students see their school progress clearly.
          </Text>
          {FEATURE_PILLS.map((p) => (
            <View key={p} style={styles.pillRow}>
              <LinearGradient colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.1)']} style={styles.pillCheck}>
                <Ionicons name="checkmark" size={16} color="#fff" />
              </LinearGradient>
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
    borderRadius: 14, paddingHorizontal: 14, backgroundColor: Colors.background,
  },
  input: { flex: 1, paddingVertical: 14, fontSize: 14, color: Colors.text },
  link: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
  error: { color: Colors.danger, fontSize: 12.5, marginTop: 6, fontWeight: '600' },
  requestRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 18 },
  previewRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  previewBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 18,
    borderRadius: 14, backgroundColor: `${Colors.primaryLight}10`, borderWidth: 1.5, borderColor: `${Colors.primary}40`,
  },
  previewBtnLabel: { fontSize: 13.5, fontWeight: '700', color: Colors.primary },

  desktopRow: { flex: 1, flexDirection: 'row' },
  desktopHero: { flex: 1, padding: 56, justifyContent: 'center', overflow: 'hidden', position: 'relative' },
  heroCircle1: { position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(255,255,255,0.07)' },
  heroCircle2: { position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.05)' },
  heroCircle3: { position: 'absolute', top: '40%', right: 40, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.06)' },
  heroTitle: { fontSize: 34, fontWeight: '800', color: '#fff', marginTop: 28, letterSpacing: -0.5, lineHeight: 42 },
  heroSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 14, lineHeight: 24 },
  pillRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  pillCheck: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  pillLabel: { color: 'rgba(255,255,255,0.85)', marginLeft: 12, fontSize: 14, flexShrink: 1 },
  desktopFormWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },

  mobileHero: { paddingHorizontal: 24, paddingTop: 64, paddingBottom: 64, alignItems: 'flex-start' },
  mobileCardWrap: { marginTop: -28, paddingHorizontal: 20, paddingBottom: 32 },
});
