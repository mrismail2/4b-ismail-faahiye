/* ============================================================
   KAABE — Profile-ka ardayga

   Arday walba wuxuu leeyahay sawir iyo bog isaga u gaar ah: xogtiisa,
   tirakoobka xaadiriska bisha, iyo taariikhda lacagta.
   ============================================================ */
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import {
  getStudentById, getClassById, attendanceSummary, getFeeRecord, feeStatus,
  FEE_STATUS_LABEL, currentMonth, monthLabel, shiftMonth, formatMoney,
} from '../services/model';
import { pickPhoto } from '../services/photos';
import { confirm, notify } from '../utils/dialog';
import {
  Card, Button, Field, Badge, Stat, SectionTitle, EmptyState, PhotoPicker,
} from '../components/ui';
import { colors, radius, spacing, attendanceColors } from '../theme/theme';

export default function StudentProfileScreen({ route, navigation }) {
  const { studentId } = route.params;
  const { store, ops, busy } = useApp();
  const [editing, setEditing] = useState(false);
  const [month, setMonth] = useState(currentMonth());
  const [form, setForm] = useState(null);

  const student = useMemo(() => getStudentById(store, studentId), [store, studentId]);
  const klass = useMemo(
    () => (student ? getClassById(store, student.class_id) : null),
    [store, student],
  );

  const attendance = useMemo(() => {
    if (!student) return null;
    return attendanceSummary(store, student.class_id, month)[studentId] || null;
  }, [store, student, month, studentId]);

  const fee = useMemo(() => {
    if (!student) return null;
    const record = getFeeRecord(store, studentId, month);
    const due = Number(student.monthly_fee) || 0;
    const paid = Number(record?.amount_paid) || 0;
    return { due, paid, balance: Math.max(0, due - paid), status: feeStatus(due, paid) };
  }, [store, student, month, studentId]);

  if (!student) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <EmptyState title="Ardaygan lama helin" text="Waxaa laga yaabaa in fasalka laga saaray." />
      </SafeAreaView>
    );
  }

  const currency = store.school.currency;

  const openEdit = () => {
    setForm({
      fullName: student.full_name,
      gender: student.gender || '',
      guardianPhone: student.guardian_phone || '',
      monthlyFee: String(student.monthly_fee || ''),
    });
    setEditing(true);
  };

  const save = async () => {
    try {
      if (!form.fullName.trim()) throw new Error('Magaca ardayga waa qasab.');
      await ops.updateStudent(studentId, {
        full_name: form.fullName.trim(),
        gender: form.gender,
        guardian_phone: form.guardianPhone.trim(),
        monthly_fee: Number(form.monthlyFee) || 0,
      });
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
      await ops.setStudentPhoto(studentId, uri);
    } catch (e) {
      notify('Khalad', e.message);
    }
  };

  const confirmRemove = () => confirm({
    title: 'Ka saar fasalka',
    message: `${student.full_name} ma ka saaraysaa fasalka? Taariikhdiisu way sii jiri doontaa.`,
    confirmLabel: 'Haa, ka saar',
    destructive: true,
    onConfirm: async () => {
      try {
        await ops.removeStudent(studentId);
        navigation.goBack();
      } catch (e) {
        notify('Khalad', e.message);
      }
    },
  });

  const feeTone = {
    paid: { bg: colors.greenSoft, fg: colors.green },
    partial: { bg: colors.amberSoft, fg: colors.amber },
    unpaid: { bg: colors.redSoft, fg: colors.red },
  }[fee.status];

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <PhotoPicker
            name={student.full_name}
            photoUri={student.photo_uri}
            size={104}
            onPick={changePhoto}
            label="Sawirka ardayga"
          />
          <Text style={styles.name}>{student.full_name}</Text>
          <View style={styles.badgeRow}>
            <Badge label={student.student_id} />
            {!!klass && (
              <Badge label={klass.name} bg={colors.accentSoft} fg={colors.amber} />
            )}
          </View>
        </View>

        {/* bisha la eegayo */}
        <Card style={styles.monthBar}>
          <TouchableOpacity onPress={() => setMonth(shiftMonth(month, -1))} style={styles.navBtn}>
            <Text style={styles.navBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthText}>{monthLabel(month)}</Text>
          <TouchableOpacity
            onPress={() => setMonth(shiftMonth(month, 1))}
            style={[styles.navBtn, month >= currentMonth() && styles.navBtnOff]}
            disabled={month >= currentMonth()}
          >
            <Text style={styles.navBtnText}>›</Text>
          </TouchableOpacity>
        </Card>

        <SectionTitle>Xaadiriska</SectionTitle>
        {!attendance ? (
          <Card>
            <Text style={styles.muted}>Bishan weli xaadiris lama diiwaan gelin.</Text>
          </Card>
        ) : (
          <>
            <View style={styles.statRow}>
              <Stat label="Jooga" value={attendance.present || 0} tone="green" />
              <Stat label="Maqan" value={attendance.absent || 0} tone="red" />
              <Stat label="Soo daahay" value={attendance.late || 0} tone="amber" />
              <Stat label="Fasax" value={attendance.excused || 0} tone="primary" />
            </View>
            <Card style={{ marginTop: spacing.sm }}>
              <Text style={styles.rateLabel}>Heerka joogitaanka</Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${attendance.total
                        ? Math.round(((attendance.present || 0) / attendance.total) * 100)
                        : 0}%`,
                      backgroundColor: attendanceColors.present.fg,
                    },
                  ]}
                />
              </View>
              <Text style={styles.rateValue}>
                {attendance.total
                  ? Math.round(((attendance.present || 0) / attendance.total) * 100)
                  : 0}% · {attendance.total} maalmood oo la diiwaan geliyay
              </Text>
            </Card>
          </>
        )}

        <SectionTitle>Lacagta bisha</SectionTitle>
        <Card>
          <View style={styles.feeHead}>
            <Text style={styles.feeTitle}>{monthLabel(month)}</Text>
            <Badge label={FEE_STATUS_LABEL[fee.status]} bg={feeTone.bg} fg={feeTone.fg} />
          </View>
          <View style={styles.feeNumbers}>
            <FeeCell label="Waajib" value={formatMoney(fee.due, currency)} />
            <FeeCell label="Bixiyay" value={formatMoney(fee.paid, currency)} color={colors.green} />
            <FeeCell
              label="Hadhay"
              value={formatMoney(fee.balance, currency)}
              color={fee.balance > 0 ? colors.red : colors.muted}
            />
          </View>
        </Card>

        {editing ? (
          <>
            <SectionTitle>Wax ka beddel</SectionTitle>
            <Card>
              <Field
                label="Magaca ardayga"
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
                value={form.guardianPhone}
                onChangeText={(v) => setForm({ ...form, guardianPhone: v })}
                keyboardType="phone-pad"
              />
              <Field
                label="Lacagta bisha"
                value={form.monthlyFee}
                onChangeText={(v) => setForm({ ...form, monthlyFee: v })}
                keyboardType="numeric"
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
              Xogta ardayga
            </SectionTitle>
            <Card>
              <Row label="Aqoonsiga" value={student.student_id} />
              <Row
                label="Jinsiga"
                value={student.gender === 'male' ? 'Wiil' : student.gender === 'female' ? 'Gabar' : '—'}
              />
              <Row label="Taleefanka waalidka" value={student.guardian_phone || '—'} />
              <Row label="Lacagta bisha" value={formatMoney(student.monthly_fee, currency)} last />
            </Card>

            <Button
              title="Ka saar fasalka"
              variant="danger"
              onPress={confirmRemove}
              style={{ marginTop: spacing.lg }}
            />
          </>
        )}
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
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  hero: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md },
  name: { fontSize: 21, fontWeight: '800', color: colors.ink, marginTop: spacing.sm },
  badgeRow: { flexDirection: 'row', gap: spacing.sm },
  monthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  monthText: { fontSize: 15, fontWeight: '700', color: colors.ink },
  navBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  navBtnOff: { opacity: 0.35 },
  navBtnText: { fontSize: 21, color: colors.primary, lineHeight: 25, fontWeight: '700' },
  statRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  muted: { fontSize: 13, color: colors.muted },
  rateLabel: { fontSize: 12, color: colors.muted, marginBottom: spacing.sm },
  progressTrack: { height: 8, backgroundColor: colors.line, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  rateValue: { fontSize: 12.5, color: colors.ink2, marginTop: 6 },
  feeHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  feeTitle: { fontSize: 15, fontWeight: '700', color: colors.ink },
  feeNumbers: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: spacing.sm,
  },
  feeCellLabel: { fontSize: 11, color: colors.muted },
  feeCellValue: { fontSize: 15, fontWeight: '700', marginTop: 2 },
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
});
