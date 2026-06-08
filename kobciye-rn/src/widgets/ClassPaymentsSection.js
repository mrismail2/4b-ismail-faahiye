import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from './AppCard';
import Avatar from './Avatar';
import { Colors, Gradients } from '../constants/colors';
import { Text as TextStyles, Spacing } from '../constants/text';

const STATUS_META = {
  paid: { color: Colors.success, label: 'Paid', icon: 'checkmark-circle' },
  unpaid: { color: Colors.danger, label: 'Unpaid', icon: 'close-circle' },
  partial: { color: Colors.accent, label: 'Partial', icon: 'time' },
};

const DEFAULT_ROSTER = [
  { name: 'Hibo Cabdullahi', studentCode: 'KBC-2031', due: 25, paid: 25, status: 'paid' },
  { name: 'Jamal Warsame', studentCode: 'KBC-2032', due: 25, paid: 0, status: 'unpaid' },
  { name: 'Sagal Maxamed', studentCode: 'KBC-2033', due: 25, paid: 15, status: 'partial' },
  { name: 'Cabdiweli Nuur', studentCode: 'KBC-2034', due: 25, paid: 25, status: 'paid' },
];

function nextStatus(status) {
  if (status === 'unpaid') return 'paid';
  if (status === 'partial') return 'paid';
  return 'unpaid';
}

function StudentPaymentRow({ student, onToggle }) {
  const meta = STATUS_META[student.status] || STATUS_META.unpaid;
  return (
    <AppCard style={styles.row}>
      <Avatar name={student.name} size={42} gradient={Gradients.brand} />
      <View style={{ flex: 1 }}>
        <Text style={TextStyles.h2}>{student.name}</Text>
        <Text style={TextStyles.bodyMuted}>{student.studentCode} · ${student.paid} of ${student.due} collected</Text>
      </View>
      <View style={[styles.statusChip, { backgroundColor: `${meta.color}1A` }]}>
        <Ionicons name={meta.icon} size={13} color={meta.color} />
        <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
      </View>
      <Pressable onPress={() => onToggle(student.studentCode)} style={styles.toggleBtn}>
        <Ionicons name="checkmark-done-outline" size={14} color={Colors.primary} />
        <Text style={styles.toggleText}>
          {student.status === 'paid' ? 'Mark unpaid' : 'Mark as paid'}
        </Text>
      </Pressable>
    </AppCard>
  );
}

// Lets a class teacher record fees collected in person and flag a student
// as paid/unpaid for their own class — the accountant sees and confirms
// the same record once the payments backend syncs them together.
export default function ClassPaymentsSection({ className = 'Grade 5 - A', roster = DEFAULT_ROSTER }) {
  const [students, setStudents] = useState(roster);

  function toggle(studentCode) {
    setStudents((prev) => prev.map((s) => (
      s.studentCode === studentCode
        ? { ...s, status: nextStatus(s.status), paid: nextStatus(s.status) === 'paid' ? s.due : 0 }
        : s
    )));
  }

  const paidCount = students.filter((s) => s.status === 'paid').length;

  return (
    <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
      <View style={{ gap: 4 }}>
        <Text style={TextStyles.h1}>Class fee tracking</Text>
        <Text style={TextStyles.bodyMuted}>{className} · {paidCount} of {students.length} students paid this month</Text>
      </View>

      <AppCard style={styles.noticeCard}>
        <Ionicons name="information-circle-outline" size={18} color={Colors.primary} />
        <Text style={[TextStyles.body, { flex: 1 }]}>
          As the class teacher, you can record fees collected in person and mark a student as paid — the school accountant is notified and confirms the entry.
        </Text>
      </AppCard>

      {students.map((s) => <StudentPaymentRow key={s.studentCode} student={s} onToggle={toggle} />)}

      <AppCard style={styles.placeholderNote}>
        <Ionicons name="construct-outline" size={16} color={Colors.muted} />
        <Text style={[TextStyles.caption, { color: Colors.muted, flex: 1 }]}>
          Placeholder roster — marking a student paid here is local-only for now. Syncing with the accountant's ledger and Supabase payments module arrives in a later phase.
        </Text>
      </AppCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.md, paddingBottom: Spacing.xl },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  statusChip: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  statusText: { fontSize: 11, fontWeight: '700' },
  toggleBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  toggleText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  noticeCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: `${Colors.primary}0D`, borderColor: `${Colors.primary}33` },
  placeholderNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
});
