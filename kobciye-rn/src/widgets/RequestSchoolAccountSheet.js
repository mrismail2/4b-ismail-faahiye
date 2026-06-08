import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, Pressable, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients, glass } from '../constants/colors';
import { Text as TextStyles } from '../constants/text';
import AppButton from './AppButton';

// Tiny pub/sub so `showRequestSchoolAccountSheet()` can be called from
// anywhere (no navigation context required) — mirrors the convenience of
// Flutter's `showModalBottomSheet`. <RequestSchoolAccountSheetHost /> is
// mounted once near the app root and listens for open requests.
let _listener = null;
export function showRequestSchoolAccountSheet() {
  _listener?.();
}

const PLANS = [
  { id: 'small', name: 'Small school', price: '$10/mo', capacity: 'Up to 100 students' },
  { id: 'medium', name: 'Medium school', price: '$20/mo', capacity: 'Up to 500 students' },
  { id: 'large', name: 'Large school', price: '$50/mo', capacity: 'Unlimited students' },
];

export function RequestSchoolAccountSheetHost() {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [school, setSchool] = useState('');
  const [owner, setOwner] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [plan, setPlan] = useState('small');

  useEffect(() => {
    _listener = () => setVisible(true);
    return () => { _listener = null; };
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(() => {
      setSubmitted(false);
      setSchool(''); setOwner(''); setEmail(''); setPhone(''); setPlan('small');
    }, 250);
  };

  const submit = () => {
    if (!school.trim() || !email.trim()) return;
    setSubmitted(true);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={close}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.center}>
          <View style={styles.sheet}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {submitted ? (
                <Success owner={owner} email={email} school={school} onDone={close} />
              ) : (
                <Form
                  school={school} setSchool={setSchool}
                  owner={owner} setOwner={setOwner}
                  email={email} setEmail={setEmail}
                  phone={phone} setPhone={setPhone}
                  plan={plan} setPlan={setPlan}
                  onSubmit={submit} onClose={close}
                />
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function Form({ school, setSchool, owner, setOwner, email, setEmail, phone, setPhone, plan, setPlan, onSubmit, onClose }) {
  return (
    <View>
      <View style={styles.headerRow}>
        <LinearGradient colors={Gradients.gold} style={styles.headerIcon}>
          <Ionicons name="school" size={22} color="#fff" />
        </LinearGradient>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={TextStyles.h2}>Request a school account</Text>
          <Text style={TextStyles.bodyMuted}>Tell us about your school — our team will reach out to set you up.</Text>
        </View>
        <Pressable onPress={onClose} hitSlop={10}>
          <Ionicons name="close" size={22} color={Colors.muted} />
        </Pressable>
      </View>

      <Field label="School name" icon="business" value={school} onChangeText={setSchool} placeholder="e.g. Nuurul-Hidaayah Primary School" />
      <Field label="Your full name" icon="person-outline" value={owner} onChangeText={setOwner} placeholder="e.g. Amina Yusuf" />
      <View style={styles.row}>
        <Field style={{ flex: 1 }} label="Email" icon="at" value={email} onChangeText={setEmail} placeholder="you@school.com" keyboardType="email-address" />
        <View style={{ width: 14 }} />
        <Field style={{ flex: 1 }} label="Phone" icon="call-outline" value={phone} onChangeText={setPhone} placeholder="+252 6xx xxx xxx" keyboardType="phone-pad" />
      </View>

      <Text style={[TextStyles.bodyMuted, { fontWeight: '700', marginTop: 4, marginBottom: 10 }]}>
        Choose the plan that fits your school
      </Text>
      <PlanPicker value={plan} onChange={setPlan} />

      <View style={{ marginTop: 22 }}>
        <AppButton label="Send request" icon={<Ionicons name="send" size={16} color="#fff" />} onPress={onSubmit} fullWidth />
      </View>
      <Text style={[TextStyles.caption, styles.center, { marginTop: 10 }]}>
        We'll never share your details. This is a Phase-1 preview — no account is created yet.
      </Text>
    </View>
  );
}

function Success({ owner, email, school, onDone }) {
  const ownerName = owner.trim() || 'friend';
  const emailAddr = email.trim() || 'you';
  const schoolName = school.trim() || 'your school';
  return (
    <View style={{ alignItems: 'center', paddingVertical: 12 }}>
      <LinearGradient colors={Gradients.growth} style={styles.successCircle}>
        <Ionicons name="checkmark" size={34} color="#fff" />
      </LinearGradient>
      <Text style={[TextStyles.h1, styles.center, { marginTop: 18 }]}>Request received! 🎉</Text>
      <Text style={[TextStyles.bodyMuted, styles.center, { marginTop: 8 }]}>
        Thank you, {ownerName} — our team will reach out to {emailAddr} shortly to get {schoolName} growing on Kobciye.
      </Text>
      <View style={{ marginTop: 22, width: '100%' }}>
        <AppButton label="Done" icon={<Ionicons name="arrow-forward" size={16} color="#fff" />} onPress={onDone} fullWidth />
      </View>
    </View>
  );
}

function Field({ label, icon, style, ...inputProps }) {
  return (
    <View style={[{ marginBottom: 16 }, style]}>
      <Text style={[TextStyles.bodyMuted, { fontWeight: '700', marginBottom: 8 }]}>{label}</Text>
      <View style={styles.inputWrap}>
        <Ionicons name={icon} size={18} color={Colors.muted} style={{ marginRight: 8 }} />
        <TextInput placeholderTextColor={Colors.muted} style={styles.input} {...inputProps} />
      </View>
    </View>
  );
}

function PlanPicker({ value, onChange }) {
  return (
    <View>
      {PLANS.map((p) => {
        const selected = value === p.id;
        return (
          <Pressable
            key={p.id}
            onPress={() => onChange(p.id)}
            style={[styles.planTile, selected && styles.planTileSelected]}
          >
            <Ionicons
              name={selected ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={selected ? Colors.primary : Colors.muted}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[TextStyles.body, { fontWeight: '700' }]}>{p.name}</Text>
              <Text style={TextStyles.caption}>{p.capacity}</Text>
            </View>
            <Text style={[TextStyles.body, { fontWeight: '800', color: Colors.primary }]}>{p.price}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(10,20,40,0.5)' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  sheet: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '88%',
    backgroundColor: Colors.surface,
    borderRadius: 28,
    padding: 26,
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 50,
    shadowOffset: { width: 0, height: 26 },
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 22 },
  headerIcon: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row' },
  center: { textAlign: 'center' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, paddingHorizontal: 14, backgroundColor: Colors.background,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 14, color: Colors.text },
  planTile: {
    flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 10, backgroundColor: Colors.surface,
  },
  planTileSelected: { borderColor: Colors.primary, borderWidth: 1.6, backgroundColor: `${Colors.primary}0F` },
  successCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
});
