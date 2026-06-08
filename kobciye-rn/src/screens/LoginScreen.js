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
import { showRequestSchoolAccountSheet } from '../widgets/RequestSchoolAccountSheet';
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [obscure, setObscure] = useState(true);
  const [localError, setLocalError] = useState(null);

  const submit = async () => {
    setLocalError(null);
    const ok = await signIn({ email, password });
    if (ok) {
      // currentUser updates async; resolve role from the email we just used
      const acct = DEMO_ACCOUNT_LIST.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      navigation.replace(roleHomeScreen(acct?.role));
    } else {
      setLocalError('No demo account found for that email.');
    }
  };

  const useDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('demo1234');
  };

  const card = (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <Text style={[TextStyles.h1, { flex: 1 }]}>{t('welcomeBack')}</Text>
        <LanguageSwitcher />
      </View>
      <Text style={[TextStyles.bodyMuted, { marginTop: 6 }]}>{t('signInToContinue')}</Text>

      <Text style={styles.fieldLabel}>{t('email')}</Text>
      <View style={styles.inputWrap}>
        <Ionicons name="at" size={18} color={Colors.muted} style={{ marginRight: 8 }} />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="name@school.com"
          placeholderTextColor={Colors.muted}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      <Text style={styles.fieldLabel}>{t('password')}</Text>
      <View style={styles.inputWrap}>
        <Ionicons name="lock-closed-outline" size={18} color={Colors.muted} style={{ marginRight: 8 }} />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor={Colors.muted}
          secureTextEntry={obscure}
          style={styles.input}
        />
        <Pressable onPress={() => setObscure((v) => !v)} hitSlop={8}>
          <Ionicons name={obscure ? 'eye-outline' : 'eye-off-outline'} size={18} color={Colors.muted} />
        </Pressable>
      </View>

      <Pressable style={{ alignSelf: 'flex-end', marginTop: 6, marginBottom: 4 }}>
        <Text style={styles.link}>{t('forgotPassword')}</Text>
      </Pressable>

      {(localError || error) && <Text style={styles.error}>{localError || error}</Text>}

      <View style={{ marginTop: 8 }}>
        <AppButton
          label={t('signIn')}
          icon={<Ionicons name="log-in-outline" size={18} color="#fff" />}
          loading={loading}
          onPress={submit}
          fullWidth
        />
      </View>

      <Pressable onPress={() => showRequestSchoolAccountSheet()} style={styles.requestRow}>
        <Ionicons name="school-outline" size={16} color={Colors.primary} />
        <Text style={[styles.link, { marginLeft: 6 }]}>{t('requestSchoolAccount')}</Text>
      </Pressable>

      <View style={styles.divider} />

      <Text style={TextStyles.caption}>{t('quickDemoAccess')}</Text>
      <View style={styles.chipRow}>
        {DEMO_ACCOUNT_LIST.filter((u) => u.role === AppRole.parent || u.role === AppRole.student).map((u) => (
          <Pressable key={u.email} onPress={() => useDemo(u.email)} style={styles.chip}>
            <Ionicons name="flash" size={14} color={Colors.primaryLight} />
            <Text style={styles.chipLabel}>{t(`role_${u.role}`)}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  if (isDesktop) {
    return (
      <View style={styles.desktopRow}>
        <LinearGradient colors={Gradients.brand} style={styles.desktopHero}>
          <AppLogo size={42} light showTagline />
          <Text style={styles.heroTitle}>Run your school with confidence</Text>
          <Text style={styles.heroSubtitle}>
            One calm, beautiful place for admins, teachers, accountants, parents and students — built to grow with your school.
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
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 999, backgroundColor: `${Colors.primaryLight}14`, borderWidth: 1, borderColor: `${Colors.primaryLight}33`,
  },
  chipLabel: { fontSize: 13, fontWeight: '700', color: Colors.primary },

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
});
