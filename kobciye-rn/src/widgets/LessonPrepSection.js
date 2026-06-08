import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from './AppCard';
import AppButton from './AppButton';
import { Colors } from '../constants/colors';
import { Text as TextStyles, Spacing } from '../constants/text';

const STATUS_META = {
  draft: { color: Colors.muted, label: 'Draft', icon: 'document-outline' },
  submitted: { color: Colors.primaryLight, label: 'Submitted', icon: 'paper-plane-outline' },
  approved: { color: Colors.success, label: 'Approved', icon: 'checkmark-circle-outline' },
  needs_revision: { color: Colors.danger, label: 'Needs revision', icon: 'alert-circle-outline' },
};

function LessonRow({ lesson }) {
  const meta = STATUS_META[lesson.status] || STATUS_META.draft;
  return (
    <AppCard style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: `${meta.color}1A` }]}>
        <Ionicons name="book-outline" size={20} color={meta.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={TextStyles.h2}>{lesson.title}</Text>
        <Text style={TextStyles.bodyMuted}>{lesson.subject} · {lesson.className} · {lesson.date}</Text>
        {!!lesson.teacher && (
          <Text style={[TextStyles.caption, { color: Colors.muted, marginTop: 4 }]}>By {lesson.teacher}</Text>
        )}
      </View>
      <View style={[styles.statusChip, { backgroundColor: `${meta.color}1A` }]}>
        <Ionicons name={meta.icon} size={13} color={meta.color} />
        <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
      </View>
    </AppCard>
  );
}

const DEMO_LESSONS = [
  { title: 'Fractions — adding unlike denominators', subject: 'Mathematics', className: 'Grade 5 - A', date: 'Jun 9, 2026', teacher: 'Teacher Amina Yusuf', status: 'approved' },
  { title: 'Photosynthesis — leaf structure', subject: 'Science', className: 'Grade 6 - B', date: 'Jun 10, 2026', teacher: 'Teacher Sahra Maxamed', status: 'submitted' },
  { title: 'Short story writing — narrative arc', subject: 'English', className: 'Grade 5 - A', date: 'Jun 11, 2026', teacher: 'Teacher Cabdiraxman Cali', status: 'needs_revision' },
  { title: 'Multiplication tables — review game', subject: 'Mathematics', className: 'Grade 4 - C', date: 'Jun 12, 2026', teacher: 'Teacher Amina Yusuf', status: 'draft' },
];

// Lesson-preparation list used both for a teacher's "my lessons" view and
// a school admin's monitoring view (who has/hasn't submitted, by status).
export default function LessonPrepSection({
  lessons = DEMO_LESSONS,
  showAddButton = false,
  title = 'Lesson preparation',
  subtitle = 'Plan, submit and track lesson prep — with school-admin review built in.',
}) {
  return (
    <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={TextStyles.h1}>{title}</Text>
          <Text style={TextStyles.bodyMuted}>{subtitle}</Text>
        </View>
        {showAddButton && (
          <AppButton label="New lesson" icon={<Ionicons name="add" size={16} color="#fff" />} variant="primary" gradient={[Colors.primary, Colors.primaryLight]} />
        )}
      </View>

      <View style={styles.summaryRow}>
        {Object.entries(STATUS_META).map(([key, meta]) => {
          const count = lessons.filter((l) => l.status === key).length;
          return (
            <View key={key} style={[styles.summaryChip, { backgroundColor: `${meta.color}12`, borderColor: `${meta.color}33` }]}>
              <Ionicons name={meta.icon} size={14} color={meta.color} />
              <Text style={[styles.summaryChipText, { color: meta.color }]}>{count} {meta.label.toLowerCase()}</Text>
            </View>
          );
        })}
      </View>

      {lessons.map((lesson, i) => <LessonRow key={i} lesson={lesson} />)}

      <AppCard style={styles.placeholderNote}>
        <Ionicons name="construct-outline" size={16} color={Colors.muted} />
        <Text style={[TextStyles.caption, { color: Colors.muted, flex: 1 }]}>
          Placeholder workflow — uploading attachments/photos, objectives editor and admin approval actions arrive with the backend lesson-preparation module.
        </Text>
      </AppCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.md, paddingBottom: Spacing.xl },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconWrap: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  statusChip: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  statusText: { fontSize: 11, fontWeight: '700' },
  summaryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  summaryChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 7 },
  summaryChipText: { fontSize: 12, fontWeight: '700' },
  placeholderNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
});
