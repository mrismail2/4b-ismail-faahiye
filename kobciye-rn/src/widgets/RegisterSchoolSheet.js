import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Modal, Pressable, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients, glass } from '../constants/colors';
import { Text as TextStyles } from '../constants/text';
import AppButton from './AppButton';

let _listener = null;
export function showRegisterSchoolSheet() { _listener?.(); }

const PLANS = [
  { id: 'small',  label: 'Small',  price: '$10/mo', cap: '≤ 100 students',    icon: 'storefront-outline' },
  { id: 'medium', label: 'Medium', price: '$20/mo', cap: '≤ 500 students',    icon: 'business-outline',  popular: true },
  { id: 'large',  label: 'Large',  price: '$50/mo', cap: 'Unlimited students', icon: 'globe-outline' },
];

export function RegisterSchoolSheetHost() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(1); // 1=school info, 2=account, 3=plan
  const [done, setDone] = useState(false);

  // school info
  const [schoolName, setSchoolName] = useState('');
  const [schoolCity, setSchoolCity] = useState('');
  const [logo, setLogo] = useState(null);
  // account
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [obscure1, setObscure1] = useState(true);
  const [obscure2, setObscure2] = useState(true);
  // plan
  const [plan, setPlan] = useState('medium');
  const [err, setErr] = useState('');

  useEffect(() => {
    _listener = () => { setVisible(true); };
    return () => { _listener = null; };
  }, []);

  const reset = () => {
    setStep(1); setDone(false); setErr('');
    setSchoolName(''); setSchoolCity(''); setLogo(null);
    setAdminName(''); setEmail(''); setPhone('');
    setPassword(''); setConfirmPw(''); setPlan('medium');
  };

  const close = () => { setVisible(false); setTimeout(reset, 300); };

  const pickLogo = () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file'; input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files?.[0];
        if (file) setLogo(URL.createObjectURL(file));
      };
      input.click();
    }
  };

  const nextStep1 = () => {
    if (!schoolName.trim()) { setErr('Please enter your school name.'); return; }
    setErr(''); setStep(2);
  };

  const nextStep2 = () => {
    if (!adminName.trim() || !email.trim()) { setErr('Name and email are required.'); return; }
    if (password.length < 8) { setErr('Password must be at least 8 characters.'); return; }
    if (password !== confirmPw) { setErr('Passwords do not match.'); return; }
    setErr(''); setStep(3);
  };

  const submit = () => { setDone(true); };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={close}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.center}>
          <View style={styles.sheet}>
            {/* progress bar */}
            {!done && (
              <View style={styles.progressWrap}>
                {[1, 2, 3].map((s) => (
                  <View key={s} style={[styles.progressDot, step >= s && styles.progressDotActive,
                    s === step && styles.progressDotCurrent]} />
                ))}
                <View style={[styles.progressLine, { flex: 1, height: 2, backgroundColor: Colors.border, marginHorizontal: 0 }]} />
              </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {done ? (
                <SuccessScreen adminName={adminName} email={email} schoolName={schoolName} onDone={close} />
              ) : step === 1 ? (
                <Step1
                  schoolName={schoolName} setSchoolName={setSchoolName}
                  schoolCity={schoolCity} setSchoolCity={setSchoolCity}
                  logo={logo} onPickLogo={pickLogo}
                  err={err} onNext={nextStep1} onClose={close}
                />
              ) : step === 2 ? (
                <Step2
                  adminName={adminName} setAdminName={setAdminName}
                  email={email} setEmail={setEmail}
                  phone={phone} setPhone={setPhone}
                  password={password} setPassword={setPassword}
                  confirmPw={confirmPw} setConfirmPw={setConfirmPw}
                  obscure1={obscure1} setObscure1={setObscure1}
                  obscure2={obscure2} setObscure2={setObscure2}
                  err={err} onNext={nextStep2} onBack={() => { setErr(''); setStep(1); }} onClose={close}
                />
              ) : (
                <Step3
                  plan={plan} setPlan={setPlan}
                  schoolName={schoolName}
                  err={err} onSubmit={submit} onBack={() => { setErr(''); setStep(2); }} onClose={close}
                />
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

// ─── Step 1: School info ─────────────────────────────────────────────────────
function Step1({ schoolName, setSchoolName, schoolCity, setSchoolCity, logo, onPickLogo, err, onNext, onClose }) {
  return (
    <View>
      <SheetHeader
        icon="business"
        title="Register your school"
        subtitle="Step 1 of 3 — School details"
        onClose={onClose}
      />

      {/* Logo picker */}
      <Text style={styles.fieldLabel}>School logo</Text>
      <Pressable onPress={onPickLogo} style={styles.logoPicker}>
        {logo ? (
          <Image source={{ uri: logo }} style={styles.logoImg} />
        ) : (
          <LinearGradient colors={['#EEF2FF', '#E0E7FF']} style={styles.logoPlaceholder}>
            <Ionicons name="image-outline" size={28} color={Colors.primaryLight} />
            <Text style={styles.logoHint}>Tap to upload logo</Text>
          </LinearGradient>
        )}
        <View style={styles.logoCameraBtn}>
          <LinearGradient colors={Gradients.brand} style={styles.logoCameraBtnInner}>
            <Ionicons name="camera" size={14} color="#fff" />
          </LinearGradient>
        </View>
      </Pressable>

      <Field label="School name *" icon="business-outline" value={schoolName} onChangeText={setSchoolName}
        placeholder="e.g. Nuurul-Hidaayah Primary School" />
      <Field label="City / Town" icon="location-outline" value={schoolCity} onChangeText={setSchoolCity}
        placeholder="e.g. Gabiley, Somaliland" />

      {err ? <Text style={styles.err}>{err}</Text> : null}

      <View style={{ marginTop: 20 }}>
        <AppButton label="Continue" icon={<Ionicons name="arrow-forward" size={16} color="#fff" />}
          onPress={onNext} fullWidth />
      </View>
    </View>
  );
}

// ─── Step 2: Admin account ────────────────────────────────────────────────────
function Step2({ adminName, setAdminName, email, setEmail, phone, setPhone,
  password, setPassword, confirmPw, setConfirmPw,
  obscure1, setObscure1, obscure2, setObscure2,
  err, onNext, onBack, onClose }) {
  const pwMatch = confirmPw.length === 0 || password === confirmPw;
  return (
    <View>
      <SheetHeader icon="person-circle-outline" title="Admin account"
        subtitle="Step 2 of 3 — Your login details" onClose={onClose} />

      <Field label="Your full name *" icon="person-outline" value={adminName}
        onChangeText={setAdminName} placeholder="e.g. Amina Yusuf" />
      <Field label="Email *" icon="at" value={email} onChangeText={setEmail}
        placeholder="admin@yourschool.com" keyboardType="email-address" autoCapitalize="none" />
      <Field label="Phone" icon="call-outline" value={phone} onChangeText={setPhone}
        placeholder="+252 6xx xxx xxx" keyboardType="phone-pad" />

      <Text style={styles.fieldLabel}>Password *</Text>
      <View style={styles.inputWrap}>
        <Ionicons name="lock-closed-outline" size={18} color={Colors.muted} style={{ marginRight: 8 }} />
        <TextInput value={password} onChangeText={setPassword} placeholder="Min. 8 characters"
          placeholderTextColor={Colors.muted} secureTextEntry={obscure1} style={styles.input} />
        <Pressable onPress={() => setObscure1(v => !v)} hitSlop={8}>
          <Ionicons name={obscure1 ? 'eye-outline' : 'eye-off-outline'} size={18} color={Colors.muted} />
        </Pressable>
      </View>

      <Text style={styles.fieldLabel}>Confirm password *</Text>
      <View style={[styles.inputWrap, !pwMatch && styles.inputWrapErr]}>
        <Ionicons name="lock-closed-outline" size={18} color={Colors.muted} style={{ marginRight: 8 }} />
        <TextInput value={confirmPw} onChangeText={setConfirmPw} placeholder="Re-enter password"
          placeholderTextColor={Colors.muted} secureTextEntry={obscure2} style={styles.input} />
        <Pressable onPress={() => setObscure2(v => !v)} hitSlop={8}>
          <Ionicons name={obscure2 ? 'eye-outline' : 'eye-off-outline'} size={18} color={Colors.muted} />
        </Pressable>
      </View>
      {!pwMatch && <Text style={[styles.err, { marginTop: 4 }]}>Passwords do not match</Text>}

      {err ? <Text style={[styles.err, { marginTop: 8 }]}>{err}</Text> : null}

      <View style={styles.btnRow}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={18} color={Colors.primary} />
          <Text style={styles.backBtnText}>Back</Text>
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <AppButton label="Continue" icon={<Ionicons name="arrow-forward" size={16} color="#fff" />}
            onPress={onNext} fullWidth />
        </View>
      </View>
    </View>
  );
}

// ─── Step 3: Plan ─────────────────────────────────────────────────────────────
function Step3({ plan, setPlan, schoolName, err, onSubmit, onBack, onClose }) {
  return (
    <View>
      <SheetHeader icon="star-outline" title="Choose your plan"
        subtitle="Step 3 of 3 — Pricing" onClose={onClose} />

      {PLANS.map((p) => {
        const sel = plan === p.id;
        return (
          <Pressable key={p.id} onPress={() => setPlan(p.id)}
            style={[styles.planCard, sel && styles.planCardSel]}>
            {p.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Most popular</Text>
              </View>
            )}
            <View style={styles.planRow}>
              <View style={[styles.planIcon, sel && styles.planIconSel]}>
                <Ionicons name={p.icon} size={20} color={sel ? '#fff' : Colors.primaryLight} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.planName, sel && { color: Colors.primary }]}>{p.label} school</Text>
                <Text style={styles.planCap}>{p.cap}</Text>
              </View>
              <View style={styles.planPriceWrap}>
                <Text style={[styles.planPrice, sel && { color: Colors.primary }]}>{p.price}</Text>
              </View>
              <Ionicons name={sel ? 'checkmark-circle' : 'radio-button-off-outline'}
                size={22} color={sel ? Colors.primary : Colors.border} style={{ marginLeft: 10 }} />
            </View>
          </Pressable>
        );
      })}

      <Text style={[TextStyles.caption, { textAlign: 'center', marginTop: 8 }]}>
        No credit card needed — we'll contact you to set everything up.
      </Text>

      {err ? <Text style={styles.err}>{err}</Text> : null}

      <View style={styles.btnRow}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={18} color={Colors.primary} />
          <Text style={styles.backBtnText}>Back</Text>
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <AppButton label="Register school" icon={<Ionicons name="school" size={16} color="#fff" />}
            onPress={onSubmit} fullWidth />
        </View>
      </View>
    </View>
  );
}

// ─── Success ──────────────────────────────────────────────────────────────────
function SuccessScreen({ adminName, email, schoolName, onDone }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 16 }}>
      <LinearGradient colors={Gradients.growth} style={styles.successCircle}>
        <Ionicons name="checkmark" size={36} color="#fff" />
      </LinearGradient>
      <Text style={[TextStyles.h1, { textAlign: 'center', marginTop: 20 }]}>
        Welcome, {adminName.split(' ')[0] || 'friend'}! 🎉
      </Text>
      <Text style={[TextStyles.bodyMuted, { textAlign: 'center', marginTop: 10, lineHeight: 22 }]}>
        <Text style={{ fontWeight: '700', color: Colors.text }}>{schoolName || 'Your school'}</Text> is
        registered. We'll reach out to {email} shortly to activate your account.
      </Text>
      <View style={[styles.infoBox, { marginTop: 20 }]}>
        <Ionicons name="mail-outline" size={18} color={Colors.primaryLight} style={{ marginRight: 10 }} />
        <Text style={[TextStyles.bodyMuted, { flex: 1, fontSize: 13 }]}>
          Check your inbox — login credentials will arrive within 24 hours.
        </Text>
      </View>
      <View style={{ marginTop: 24, width: '100%' }}>
        <AppButton label="Done" icon={<Ionicons name="arrow-forward" size={16} color="#fff" />}
          onPress={onDone} fullWidth />
      </View>
    </View>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────
function SheetHeader({ icon, title, subtitle, onClose }) {
  return (
    <View style={styles.headerWrap}>
      <LinearGradient colors={Gradients.brand} style={styles.headerIcon}>
        <Ionicons name={icon} size={22} color="#fff" />
      </LinearGradient>
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={TextStyles.h2}>{title}</Text>
        <Text style={[TextStyles.bodyMuted, { marginTop: 2, fontSize: 13 }]}>{subtitle}</Text>
      </View>
      <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
        <Ionicons name="close" size={20} color={Colors.muted} />
      </Pressable>
    </View>
  );
}

function Field({ label, icon, style, ...rest }) {
  return (
    <View style={[{ marginBottom: 14 }, style]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputWrap}>
        <Ionicons name={icon} size={18} color={Colors.muted} style={{ marginRight: 8 }} />
        <TextInput placeholderTextColor={Colors.muted} style={styles.input} {...rest} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(10,20,40,0.55)' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 18 },
  sheet: {
    width: '100%', maxWidth: 520, maxHeight: '92%',
    backgroundColor: Colors.surface, borderRadius: 28, padding: 24,
    shadowColor: Colors.primary, shadowOpacity: 0.2, shadowRadius: 50, shadowOffset: { width: 0, height: 26 },
  },

  // progress
  progressWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 22 },
  progressDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.border },
  progressDotActive: { backgroundColor: `${Colors.primary}55` },
  progressDotCurrent: { width: 28, backgroundColor: Colors.primary },

  headerWrap: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 22 },
  headerIcon: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  closeBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },

  // logo picker
  logoPicker: { alignSelf: 'center', width: 108, height: 108, marginBottom: 20, position: 'relative' },
  logoImg: { width: 108, height: 108, borderRadius: 24, borderWidth: 2, borderColor: Colors.border },
  logoPlaceholder: { width: 108, height: 108, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed' },
  logoHint: { fontSize: 11, color: Colors.primaryLight, fontWeight: '600', marginTop: 6 },
  logoCameraBtn: { position: 'absolute', bottom: 0, right: 0 },
  logoCameraBtnInner: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.surface },

  fieldLabel: { ...TextStyles.bodyMuted, fontWeight: '700', marginBottom: 8, marginTop: 4 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, paddingHorizontal: 14, backgroundColor: Colors.background,
  },
  inputWrapErr: { borderColor: Colors.danger },
  input: { flex: 1, paddingVertical: 12, fontSize: 14, color: Colors.text },
  err: { color: Colors.danger, fontSize: 12.5, fontWeight: '600', marginTop: 6 },

  btnRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  backBtnText: { fontSize: 14, fontWeight: '700', color: Colors.primary },

  // plan cards
  planCard: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 18,
    padding: 16, marginBottom: 12, backgroundColor: Colors.surface, overflow: 'hidden',
  },
  planCardSel: { borderColor: Colors.primary, borderWidth: 2, backgroundColor: `${Colors.primary}08` },
  planRow: { flexDirection: 'row', alignItems: 'center' },
  planIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: `${Colors.primaryLight}18`, alignItems: 'center', justifyContent: 'center' },
  planIconSel: { backgroundColor: Colors.primary },
  planName: { fontSize: 14.5, fontWeight: '800', color: Colors.text },
  planCap: { fontSize: 12, color: Colors.muted, marginTop: 2 },
  planPriceWrap: { alignItems: 'flex-end' },
  planPrice: { fontSize: 15, fontWeight: '900', color: Colors.muted },
  popularBadge: { position: 'absolute', top: 10, right: 14, backgroundColor: `${Colors.accent}22`, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  popularText: { fontSize: 10.5, fontWeight: '700', color: Colors.accent },

  successCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: `${Colors.primaryLight}0F`, borderRadius: 14, padding: 14, width: '100%' },
});
