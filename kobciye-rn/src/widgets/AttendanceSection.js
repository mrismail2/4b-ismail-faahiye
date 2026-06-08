import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppCard from './AppCard';
import { Colors, glass } from '../constants/colors';
import { Text as TextStyles, Spacing } from '../constants/text';

const STATUS_META = {
  present: { color: Colors.success, icon: 'checkmark-circle', label: 'Present' },
  absent: { color: Colors.danger, icon: 'close-circle', label: 'Absent' },
  late: { color: Colors.accent, icon: 'time', label: 'Late' },
};

function SummaryCard({ icon, label, value, tint, gradient }) {
  if (gradient) {
    return (
      <LinearGradient colors={gradient} style={[styles.summaryCard, styles.summaryCardGradient]}>
        <View style={[styles.summaryIcon, { backgroundColor: glass(0.2) }]}>
          <Ionicons name={icon} size={18} color="#fff" />
        </View>
        <Text style={styles.summaryValueLight}>{value}</Text>
        <Text style={styles.summaryLabelLight}>{label}</Text>
      </LinearGradient>
    );
  }
  return (
    <AppCard style={styles.summaryCard}>
      <View style={[styles.summaryIcon, { backgroundColor: `${tint}1A` }]}>
        <Ionicons name={icon} size={18} color={tint} />
      </View>
      <Text style={[styles.summaryValue, { color: tint }]}>{value}</Text>
      <Text style={TextStyles.bodyMuted}>{label}</Text>
    </AppCard>
  );
}

function HistoryRow({ entry }) {
  const meta = STATUS_META[entry.status] || STATUS_META.present;
  return (
    <View style={styles.historyRow}>
      <View style={[styles.historyDot, { backgroundColor: `${meta.color}1A` }]}>
        <Ionicons name={meta.icon} size={16} color={meta.color} />
      </View>
      <Text style={[TextStyles.body, { flex: 1 }]}>{entry.date}</Text>
      <Text style={[styles.historyStatus, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

const DEMO_HISTORY = [
  { date: 'Mon, Jun 1', status: 'present' },
  { date: 'Tue, Jun 2', status: 'present' },
  { date: 'Wed, Jun 3', status: 'late' },
  { date: 'Thu, Jun 4', status: 'present' },
  { date: 'Fri, Jun 5', status: 'absent' },
];

// Beautiful, color-coded attendance overview — reusable across student,
// parent, teacher and class views via the `variant` prop.
export default function AttendanceSection({
  percentage = 96,
  presentCount = 24,
  absentCount = 1,
  lateCount = 1,
  history = DEMO_HISTORY,
  title = 'Attendance',
  subtitle = 'Daily status, weekly trends and full history — color-coded for an instant read.',
}) {
  return (
    <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
      <View style={{ gap: 4 }}>
        <Text style={TextStyles.h1}>{title}</Text>
        <Text style={TextStyles.bodyMuted}>{subtitle}</Text>
      </View>

      <View style={styles.grid}>
        <SummaryCard icon="trending-up" label="This term" value={`${percentage}%`} gradient={[Colors.primary, Colors.primaryLight]} />
        <SummaryCard icon="checkmark-circle" label="Present" value={presentCount} tint={Colors.success} />
        <SummaryCard icon="close-circle" label="Absent" value={absentCount} tint={Colors.danger} />
        <SummaryCard icon="time" label="Late" value={lateCount} tint={Colors.accent} />
      </View>

      <AppCard style={{ gap: 12 }}>
        <Text style={TextStyles.h2}>Recent history</Text>
        {history.map((entry, i) => <HistoryRow key={i} entry={entry} />)}
      </AppCard>

      <AppCard style={styles.placeholderNote}>
        <Ionicons name="construct-outline" size={16} color={Colors.muted} />
        <Text style={[TextStyles.caption, { color: Colors.muted, flex: 1 }]}>
          Placeholder data — live daily/weekly/monthly summaries, class roll-call and offline sync land with the Supabase attendance module.
        </Text>
      </AppCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.md, paddingBottom: Spacing.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  summaryCard: { flexGrow: 1, minWidth: 140, alignItems: 'flex-start', gap: 10 },
  summaryCardGradient: { borderRadius: 18, padding: 18 },
  summaryIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  summaryValue: { fontSize: 22, fontWeight: '800' },
  summaryValueLight: { fontSize: 22, fontWeight: '800', color: '#fff' },
  summaryLabelLight: { fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  historyDot: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  historyStatus: { fontSize: 12.5, fontWeight: '700' },
  placeholderNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
});
