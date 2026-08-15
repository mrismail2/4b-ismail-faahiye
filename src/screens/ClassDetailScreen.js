/* ============================================================
   KAABE — Shaashadda fasalka

   Saddex qaybood oo hal fasal ah:
     · Ardayda   — magacyada iyo sawirada
     · Xaadiris  — maalin kasta: Jooga / Maqan / Soo daahay / Fasax
     · Lacag     — bil kasta: waajibka, wixii la bixiyay, hadhaaga

   Macalinku wuxuu arkaa fasaladiisa oo keliya. Habka dhabta ah, RLS-ka
   database-ka ayaa xaqiijiya — ma aha badhamo la qariyay.
   ============================================================ */
import React, { useMemo, useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import {
  getClassById, studentsByClass, getRegister, ATTENDANCE_STATUSES,
  classFeeSummary, FEE_STATUS_LABEL,
  todayISO, currentMonth, monthLabel, shiftMonth, formatMoney, canAccessClass,
} from '../services/model';
import { pickPhoto } from '../services/photos';
import {
  Card, Button, Field, Badge, Avatar, Stat, EmptyState, SegmentedControl,
  SectionTitle, PhotoPicker,
} from '../components/ui';
import { colors, radius, spacing, attendanceColors } from '../theme/theme';

const TABS = [
  { key: 'students', label: 'Ardayda' },
  { key: 'attendance', label: 'Xaadiris' },
  { key: 'fees', label: 'Lacag' },
];

export default function ClassDetailScreen({ route, navigation }) {
  const { classId } = route.params;
  const { store, user } = useApp();
  const [tab, setTab] = useState('students');

  const klass = useMemo(() => getClassById(store, classId), [store, classId]);
  const roster = useMemo(() => studentsByClass(store, classId), [store, classId]);

  useEffect(() => {
    if (klass) navigation.setOptions({ title: klass.name });
  }, [klass, navigation]);

  if (!klass) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <EmptyState title="Fasalka lama helin" text="Waxaa laga yaabaa in la tirtiray." />
      </SafeAreaView>
    );
  }

  if (!canAccessClass(user, classId)) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <EmptyState
          title="Ogolaansho ma lihid"
          text="Fasalkan lagumaa qoondayn. La xiriir maamulaha guud."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.head}>
        <View style={styles.headRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.className}>{klass.name}</Text>
            {!!klass.level && <Text style={styles.classLevel}>{klass.level}</Text>}
          </View>
          <Badge label={`${roster.length} arday`} bg="rgba(255,255,255,0.18)" fg="#FFFFFF" />
        </View>
        <Text style={styles.classFee}>
          Lacagta bisha: {formatMoney(klass.monthly_fee, store.school.currency)}
        </Text>
      </View>

      <View style={styles.tabWrap}>
        <SegmentedControl options={TABS} value={tab} onChange={setTab} />
      </View>

      {tab === 'students' && (
        <StudentsTab store={store} klass={klass} roster={roster} navigation={navigation} />
      )}
      {tab === 'attendance' && (
        <AttendanceTab store={store} klass={klass} roster={roster} />
      )}
      {tab === 'fees' && (
        <FeesTab store={store} klass={klass} roster={roster} />
      )}
    </SafeAreaView>
  );
}

/* ============================================================
   1) Ardayda
   ============================================================ */
function StudentsTab({ store, klass, roster, navigation }) {
  const { ops, busy } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: '', gender: '', guardianPhone: '', monthlyFee: '', photoUri: null,
  });

  const openNew = () => {
    setForm({
      fullName: '',
      gender: '',
      guardianPhone: '',
      monthlyFee: String(klass.monthly_fee || ''),
      photoUri: null,
    });
    setOpen(true);
  };

  const choosePhoto = async ({ camera }) => {
    const { uri, error } = await pickPhoto({ camera });
    if (error) return Alert.alert('Khalad', error);
    if (uri) setForm((prev) => ({ ...prev, photoUri: uri }));
  };

  const save = async () => {
    try {
      await ops.addStudent({ classId: klass.class_id, ...form });
      setOpen(false);
    } catch (e) {
      Alert.alert('Khalad', e.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Button title="+ Ku dar arday" onPress={openNew} />

      {roster.length === 0 ? (
        <EmptyState
          title="Weli arday ma jiro"
          text="Ku dar ardayga koowaad si aad u bilowdo xaadiriska iyo lacagaha."
        />
      ) : (
        <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
          {roster.map((student) => (
            <TouchableOpacity
              key={student.student_internal_id}
              onPress={() => navigation.navigate('StudentProfile', {
                studentId: student.student_internal_id,
              })}
              activeOpacity={0.85}
            >
              <Card style={styles.studentRow}>
                <Avatar name={student.full_name} photoUri={student.photo_uri} size={46} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.studentName}>{student.full_name}</Text>
                  <Text style={styles.studentMeta}>
                    {student.student_id}
                    {student.guardian_phone ? ` · ${student.guardian_phone}` : ''}
                  </Text>
                </View>
                <Text style={styles.studentFee}>
                  {formatMoney(student.monthly_fee, store.school.currency)}
                </Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.modalTitle}>Arday cusub</Text>

              <View style={{ marginBottom: spacing.lg }}>
                <PhotoPicker
                  name={form.fullName || '?'}
                  photoUri={form.photoUri}
                  size={92}
                  onPick={choosePhoto}
                  label="Sawirka ardayga"
                />
                <Text style={styles.photoHint}>Taabo si aad sawir u gelisid</Text>
              </View>

              <Field
                label="Magaca ardayga"
                placeholder="Tusaale: Fadumo Cali"
                value={form.fullName}
                onChangeText={(v) => setForm({ ...form, fullName: v })}
              />

              <Text style={styles.fieldLabel}>Jinsiga</Text>
              <View style={styles.genderRow}>
                {[{ k: 'male', l: 'Wiil' }, { k: 'female', l: 'Gabar' }].map((g) => {
                  const active = form.gender === g.k;
                  return (
                    <TouchableOpacity
                      key={g.k}
                      style={[styles.genderBtn, active && styles.genderBtnActive]}
                      onPress={() => setForm({ ...form, gender: active ? '' : g.k })}
                    >
                      <Text style={[styles.genderText, active && styles.genderTextActive]}>
                        {g.l}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Field
                label="Taleefanka waalidka"
                placeholder="061xxxxxxx"
                value={form.guardianPhone}
                onChangeText={(v) => setForm({ ...form, guardianPhone: v })}
                keyboardType="phone-pad"
              />
              <Field
                label="Lacagta bisha"
                placeholder={String(klass.monthly_fee || 0)}
                hint="Haddii aad banayso, waxaa la isticmaalayaa lacagta fasalka."
                value={form.monthlyFee}
                onChangeText={(v) => setForm({ ...form, monthlyFee: v })}
                keyboardType="numeric"
              />

              <Button
                title={busy ? 'Sugaya…' : 'Ku dar ardayga'}
                onPress={save}
                disabled={busy}
              />
              <Button
                title="Jooji"
                variant="ghost"
                onPress={() => setOpen(false)}
                style={{ marginTop: spacing.sm }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

/* ============================================================
   2) Xaadiriska
   ============================================================ */
function AttendanceTab({ store, klass, roster }) {
  const { ops, busy } = useApp();
  const [date, setDate] = useState(todayISO());
  const saved = useMemo(
    () => getRegister(store, klass.class_id, date),
    [store, klass.class_id, date],
  );
  const [draft, setDraft] = useState(saved);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setDraft(saved);
    setDirty(false);
  }, [saved]);

  const shiftDate = (delta) => {
    const d = new Date(`${date}T00:00:00`);
    d.setDate(d.getDate() + delta);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (iso > todayISO()) return;
    setDate(iso);
  };

  const setStatus = (studentId, status) => {
    setDraft((prev) => ({ ...prev, [studentId]: prev[studentId] === status ? undefined : status }));
    setDirty(true);
  };

  const markAllPresent = () => {
    const all = {};
    roster.forEach((s) => { all[s.student_internal_id] = 'present'; });
    setDraft(all);
    setDirty(true);
  };

  const save = async () => {
    const clean = {};
    Object.entries(draft).forEach(([k, v]) => { if (v) clean[k] = v; });
    try {
      await ops.saveRegister({ classId: klass.class_id, date, register: clean });
      setDirty(false);
      Alert.alert('La kaydiyay', `Xaadiriska ${date} waa la kaydiyay.`);
    } catch (e) {
      Alert.alert('Khalad', e.message);
    }
  };

  const counts = useMemo(() => {
    const c = { present: 0, absent: 0, late: 0, excused: 0 };
    Object.values(draft).forEach((v) => { if (v && c[v] !== undefined) c[v] += 1; });
    return c;
  }, [draft]);

  const marked = Object.values(draft).filter(Boolean).length;
  const isToday = date === todayISO();

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Card style={styles.dateBar}>
        <TouchableOpacity onPress={() => shiftDate(-1)} style={styles.navBtn}>
          <Text style={styles.navBtnText}>‹</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.dateSub}>{isToday ? 'Maanta' : 'Maalin hore'}</Text>
        </View>
        <TouchableOpacity
          onPress={() => shiftDate(1)}
          style={[styles.navBtn, isToday && styles.navBtnOff]}
          disabled={isToday}
        >
          <Text style={styles.navBtnText}>›</Text>
        </TouchableOpacity>
      </Card>

      {roster.length === 0 ? (
        <EmptyState title="Arday ma jiro" text="Marka hore ku dar ardayda qaybta 'Ardayda'." />
      ) : (
        <>
          <View style={styles.statRow}>
            <Stat label="Jooga" value={counts.present} tone="green" />
            <Stat label="Maqan" value={counts.absent} tone="red" />
            <Stat label="Soo daahay" value={counts.late} tone="amber" />
            <Stat label="Fasax" value={counts.excused} tone="primary" />
          </View>

          <SectionTitle
            right={(
              <TouchableOpacity onPress={markAllPresent}>
                <Text style={styles.linkText}>Dhammaan Jooga</Text>
              </TouchableOpacity>
            )}
          >
            {marked}/{roster.length} la calaamadiyay
          </SectionTitle>

          <View style={{ gap: spacing.sm }}>
            {roster.map((student) => {
              const status = draft[student.student_internal_id];
              return (
                <Card key={student.student_internal_id}>
                  <View style={styles.attendHead}>
                    <Avatar name={student.full_name} photoUri={student.photo_uri} size={34} />
                    <Text style={styles.attendName} numberOfLines={1}>{student.full_name}</Text>
                  </View>
                  <View style={styles.statusRow}>
                    {ATTENDANCE_STATUSES.map((opt) => {
                      const active = status === opt.key;
                      const tone = attendanceColors[opt.key];
                      return (
                        <TouchableOpacity
                          key={opt.key}
                          style={[
                            styles.statusBtn,
                            { borderColor: active ? tone.fg : colors.line },
                            active && { backgroundColor: tone.bg },
                          ]}
                          onPress={() => setStatus(student.student_internal_id, opt.key)}
                          activeOpacity={0.8}
                        >
                          <Text style={[
                            styles.statusText,
                            { color: active ? tone.fg : colors.muted },
                          ]}>
                            {opt.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </Card>
              );
            })}
          </View>

          <Button
            title={busy ? 'Sugaya…' : dirty ? 'Kaydi xaadiriska' : 'La kaydiyay'}
            onPress={save}
            disabled={!dirty || busy}
            variant={dirty ? 'primary' : 'ghost'}
            style={{ marginTop: spacing.lg }}
          />
        </>
      )}
    </ScrollView>
  );
}

/* ============================================================
   3) Lacagaha bilaha
   ============================================================ */
function FeesTab({ store, klass, roster }) {
  const { ops, busy } = useApp();
  const [month, setMonth] = useState(currentMonth());
  const [target, setTarget] = useState(null);
  const [amount, setAmount] = useState('');

  const summary = useMemo(
    () => classFeeSummary(store, klass.class_id, month),
    [store, klass.class_id, month],
  );
  const currency = store.school.currency;

  const openPayment = (row) => {
    setTarget(row);
    setAmount(row.paid ? String(row.paid) : '');
  };

  const savePayment = async () => {
    try {
      await ops.setPayment({
        studentInternalId: target.student.student_internal_id,
        month,
        amountPaid: amount,
      });
      setTarget(null);
    } catch (e) {
      Alert.alert('Khalad', e.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Card style={styles.dateBar}>
        <TouchableOpacity onPress={() => setMonth(shiftMonth(month, -1))} style={styles.navBtn}>
          <Text style={styles.navBtnText}>‹</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={styles.dateText}>{monthLabel(month)}</Text>
          <Text style={styles.dateSub}>Bisha lacagta</Text>
        </View>
        <TouchableOpacity
          onPress={() => setMonth(shiftMonth(month, 1))}
          style={[styles.navBtn, month >= currentMonth() && styles.navBtnOff]}
          disabled={month >= currentMonth()}
        >
          <Text style={styles.navBtnText}>›</Text>
        </TouchableOpacity>
      </Card>

      {roster.length === 0 ? (
        <EmptyState title="Arday ma jiro" text="Ku dar ardayda si aad lacagaha u xisaabiso." />
      ) : (
        <>
          <View style={styles.statRow}>
            <Stat label="Waajib" value={formatMoney(summary.due, currency)} tone="primary" />
            <Stat label="La bixiyay" value={formatMoney(summary.paid, currency)} tone="green" />
            <Stat label="Hadhaaga" value={formatMoney(summary.balance, currency)} tone="red" />
          </View>

          <SectionTitle>Liiska ardayda</SectionTitle>

          <View style={{ gap: spacing.sm }}>
            {summary.rows.map((row) => {
              const tone = {
                paid: { bg: colors.greenSoft, fg: colors.green },
                partial: { bg: colors.amberSoft, fg: colors.amber },
                unpaid: { bg: colors.redSoft, fg: colors.red },
              }[row.status];

              return (
                <TouchableOpacity
                  key={row.student.student_internal_id}
                  onPress={() => openPayment(row)}
                  activeOpacity={0.85}
                >
                  <Card>
                    <View style={styles.feeHead}>
                      <Avatar
                        name={row.student.full_name}
                        photoUri={row.student.photo_uri}
                        size={38}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.studentName}>{row.student.full_name}</Text>
                        <Text style={styles.studentMeta}>{row.student.student_id}</Text>
                      </View>
                      <Badge label={FEE_STATUS_LABEL[row.status]} bg={tone.bg} fg={tone.fg} />
                    </View>
                    <View style={styles.feeNumbers}>
                      <FeeCell label="Waajib" value={formatMoney(row.due, currency)} />
                      <FeeCell label="Bixiyay" value={formatMoney(row.paid, currency)} color={colors.green} />
                      <FeeCell
                        label="Hadhay"
                        value={formatMoney(row.balance, currency)}
                        color={row.balance > 0 ? colors.red : colors.muted}
                      />
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      <Modal visible={!!target} transparent animationType="slide" onRequestClose={() => setTarget(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {!!target && (
              <>
                <View style={styles.payHead}>
                  <Avatar
                    name={target.student.full_name}
                    photoUri={target.student.photo_uri}
                    size={44}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle}>{target.student.full_name}</Text>
                    <Text style={styles.modalSub}>
                      {monthLabel(month)} · Waajibka {formatMoney(target.due, currency)}
                    </Text>
                  </View>
                </View>

                <Field
                  label="Lacagta la bixiyay"
                  placeholder="0"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                />

                <View style={styles.quickRow}>
                  <Button
                    title="Buuxa"
                    variant="ghost"
                    onPress={() => setAmount(String(target.due))}
                    style={{ flex: 1 }}
                  />
                  <Button
                    title="Nus"
                    variant="ghost"
                    onPress={() => setAmount(String(target.due / 2))}
                    style={{ flex: 1 }}
                  />
                  <Button
                    title="Eber"
                    variant="ghost"
                    onPress={() => setAmount('0')}
                    style={{ flex: 1 }}
                  />
                </View>

                <Button
                  title={busy ? 'Sugaya…' : 'Kaydi lacagta'}
                  onPress={savePayment}
                  disabled={busy}
                  style={{ marginTop: spacing.md }}
                />
                <Button
                  title="Jooji"
                  variant="ghost"
                  onPress={() => setTarget(null)}
                  style={{ marginTop: spacing.sm }}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function FeeCell({ label, value, color = colors.ink }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.feeCellLabel}>{label}</Text>
      <Text style={[styles.feeCellValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  head: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  className: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  classLevel: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  classFee: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: spacing.sm },
  tabWrap: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.bg,
  },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2 },
  studentRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  studentName: { fontSize: 15, fontWeight: '700', color: colors.ink },
  studentMeta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  studentFee: { fontSize: 14, fontWeight: '700', color: colors.primary },
  photoHint: { fontSize: 12, color: colors.muted, textAlign: 'center', marginTop: spacing.sm },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: colors.ink2, marginBottom: 6 },
  genderRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  genderBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingVertical: 11,
    alignItems: 'center',
  },
  genderBtnActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  genderText: { fontSize: 14, color: colors.muted, fontWeight: '600' },
  genderTextActive: { color: colors.primary },
  dateBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  navBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  navBtnOff: { opacity: 0.35 },
  navBtnText: { fontSize: 22, color: colors.primary, lineHeight: 26, fontWeight: '700' },
  dateText: { fontSize: 16, fontWeight: '700', color: colors.ink },
  dateSub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  statRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  linkText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  attendHead: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm,
  },
  attendName: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.ink },
  statusRow: { flexDirection: 'row', gap: 6 },
  statusBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: radius.sm,
    paddingVertical: 9,
    alignItems: 'center',
  },
  statusText: { fontSize: 11.5, fontWeight: '700' },
  feeHead: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md,
  },
  feeNumbers: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: spacing.sm,
  },
  feeCellLabel: { fontSize: 11, color: colors.muted },
  feeCellValue: { fontSize: 15, fontWeight: '700', marginTop: 2 },
  payHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(16,26,40,0.45)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl + 12,
    maxHeight: '88%',
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.ink, marginBottom: 4 },
  modalSub: { fontSize: 13, color: colors.muted },
  quickRow: { flexDirection: 'row', gap: spacing.sm },
});
