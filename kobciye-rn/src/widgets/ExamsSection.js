import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from './AppCard';
import { Colors } from '../constants/colors';
import { Text as TextStyles, Spacing } from '../constants/text';

const GRADE_TINTS = { 'A+': Colors.success, A: Colors.success, 'A-': Colors.success, B: Colors.primaryLight, C: Colors.accent, D: Colors.danger };

function ExamRow({ exam }) {
  const tint = GRADE_TINTS[exam.grade] || Colors.muted;
  const pct = Math.round((exam.marks / exam.total) * 100);
  return (
    <AppCard style={styles.row}>
      <View style={[styles.gradeBadge, { backgroundColor: `${tint}1A` }]}>
        <Text style={[styles.gradeText, { color: tint }]}>{exam.grade}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={TextStyles.h2}>{exam.subject}</Text>
        <Text style={TextStyles.bodyMuted}>{exam.name} · {exam.date}</Text>
        {!!exam.note && (
          <View style={styles.noteRow}>
            <Ionicons name="chatbox-ellipses-outline" size={13} color={Colors.muted} />
            <Text style={[TextStyles.caption, { color: Colors.muted, flex: 1 }]} numberOfLines={2}>{exam.note}</Text>
          </View>
        )}
        {!!exam.teacher && (
          <View style={styles.noteRow}>
            <Ionicons name="person-outline" size={13} color={Colors.muted} />
            <Text style={[TextStyles.caption, { color: Colors.muted }]}>{exam.teacher}</Text>
          </View>
        )}
      </View>
      <View style={styles.marksWrap}>
        <Text style={styles.marksValue}>{exam.marks}<Text style={styles.marksTotal}>/{exam.total}</Text></Text>
        <Text style={[TextStyles.caption, { color: Colors.muted }]}>{pct}%</Text>
        {exam.rank ? (
          <View style={styles.rankChip}>
            <Ionicons name="trophy-outline" size={11} color={Colors.accent} />
            <Text style={styles.rankText}>{exam.rank}</Text>
          </View>
        ) : null}
      </View>
    </AppCard>
  );
}

const DEMO_EXAMS = [
  { name: 'Mid-term Exam', subject: 'Mathematics', marks: 88, total: 100, grade: 'A-', date: 'May 14, 2026', teacher: 'Teacher Amina Yusuf', note: 'Excellent improvement on word problems — keep practicing fractions.', rank: '2nd in class' },
  { name: 'Mid-term Exam', subject: 'English', marks: 76, total: 100, grade: 'B', date: 'May 16, 2026', teacher: 'Teacher Cabdiraxman Cali', note: 'Good vocabulary, work on essay structure.', rank: null },
  { name: 'Quiz 3', subject: 'Science', marks: 91, total: 100, grade: 'A', date: 'May 20, 2026', teacher: 'Teacher Sahra Maxamed', note: 'Outstanding lab report this week!', rank: '1st in class' },
];

// Role-aware exam list. `summary`, when provided, renders a small
// progress headline above the list (used on parent/student dashboards).
export default function ExamsSection({ exams = DEMO_EXAMS, summary, emptyHint }) {
  return (
    <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={TextStyles.h1}>Exams</Text>
        <Text style={TextStyles.bodyMuted}>{summary || 'Subject results, grades and teacher notes in one place.'}</Text>
      </View>

      {exams.length === 0 ? (
        <AppCard style={{ alignItems: 'center', padding: 28 }}>
          <Ionicons name="document-text-outline" size={28} color={Colors.muted} />
          <Text style={[TextStyles.bodyMuted, { marginTop: 10, textAlign: 'center' }]}>
            {emptyHint || 'No exam results published yet.'}
          </Text>
        </AppCard>
      ) : (
        exams.map((exam, i) => <ExamRow key={i} exam={exam} />)
      )}

      <AppCard style={styles.placeholderNote}>
        <Ionicons name="construct-outline" size={16} color={Colors.muted} />
        <Text style={[TextStyles.caption, { color: Colors.muted, flex: 1 }]}>
          Placeholder data — entering marks, assigning subjects/teachers and live class ranking arrive once the Supabase exams module is connected.
        </Text>
      </AppCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.md, paddingBottom: Spacing.xl },
  header: { gap: 4, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  gradeBadge: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  gradeText: { fontWeight: '800', fontSize: 16 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginTop: 6 },
  marksWrap: { alignItems: 'flex-end', gap: 4 },
  marksValue: { fontSize: 20, fontWeight: '800', color: Colors.text },
  marksTotal: { fontSize: 13, fontWeight: '600', color: Colors.muted },
  rankChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: `${Colors.accent}1A`, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  rankText: { fontSize: 10.5, fontWeight: '700', color: Colors.accent },
  placeholderNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
});
