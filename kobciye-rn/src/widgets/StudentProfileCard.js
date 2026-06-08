import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from './AppCard';
import Avatar from './Avatar';
import { Colors, Gradients } from '../constants/colors';
import { Text as TextStyles } from '../constants/text';

const STATUS_TINTS = {
  paid: Colors.success, unpaid: Colors.danger, partial: Colors.accent, free: Colors.primaryLight,
  present: Colors.success, low: Colors.success, medium: Colors.accent, high: Colors.danger,
};

function StatusPill({ label, value }) {
  const tint = STATUS_TINTS[String(value).toLowerCase()] || Colors.muted;
  return (
    <View style={styles.pill}>
      <Text style={[TextStyles.caption, { color: Colors.muted }]}>{label}</Text>
      <View style={[styles.pillValue, { backgroundColor: `${tint}1A` }]}>
        <View style={[styles.dot, { backgroundColor: tint }]} />
        <Text style={[styles.pillText, { color: tint }]}>{value}</Text>
      </View>
    </View>
  );
}

// Full student identity card — used on student dashboards, parent
// "child profile" panels and (eventually) school-admin roster rows.
export default function StudentProfileCard({
  name,
  photoUri,
  studentCode,
  admissionNumber,
  className,
  parentName,
  paymentStatus = 'unpaid',
  attendanceStatus = 'present',
  riskLevel = 'low',
}) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <Avatar uri={photoUri} name={name} size={64} gradient={Gradients.gold} />
        <View style={{ flex: 1 }}>
          <Text style={TextStyles.h2}>{name}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="barcode-outline" size={14} color={Colors.muted} />
            <Text style={TextStyles.bodyMuted}>{studentCode}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="document-text-outline" size={14} color={Colors.muted} />
            <Text style={TextStyles.bodyMuted}>Admission {admissionNumber}</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Ionicons name="easel-outline" size={15} color={Colors.primary} />
          <Text style={TextStyles.body}>{className}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="person-outline" size={15} color={Colors.primary} />
          <Text style={TextStyles.body}>{parentName}</Text>
        </View>
      </View>

      <View style={styles.pillsRow}>
        <StatusPill label="Payment" value={paymentStatus} />
        <StatusPill label="Today" value={attendanceStatus} />
        <StatusPill label="Risk" value={riskLevel} />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 7, minWidth: 140 },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  pill: { gap: 6 },
  pillValue: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, alignSelf: 'flex-start' },
  dot: { width: 7, height: 7, borderRadius: 4 },
  pillText: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
});
