import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppCard from './AppCard';
import { Colors, Gradients, glass } from '../constants/colors';
import { Text as TextStyles, Spacing } from '../constants/text';

const STATUS_TINTS = { trial: Colors.accent, active: Colors.success, expired: Colors.danger, suspended: Colors.danger, cancelled: Colors.muted };

// Per-school SaaS subscription placeholder — pricing is calculated from
// student count, mirroring the onboarding plan tiers (Small/Medium/Large).
export default function SubscriptionSection({
  studentCount = 312,
  studentLimit = 500,
  planName = 'Medium school',
  monthlyFee = 20,
  status = 'trial',
  amountOwed = 20,
  daysLeft = 18,
}) {
  const tint = STATUS_TINTS[status] || Colors.muted;
  const usagePct = Math.min(100, Math.round((studentCount / studentLimit) * 100));

  return (
    <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
      <View style={{ gap: 4 }}>
        <Text style={TextStyles.h1}>Subscription & billing</Text>
        <Text style={TextStyles.bodyMuted}>Kobciye's SaaS fee is calculated by student count — the more your school grows, the clearer your plan.</Text>
      </View>

      <LinearGradient colors={Gradients.brand} style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroPlan}>{planName}</Text>
            <Text style={styles.heroSub}>Billed monthly · by student count</Text>
          </View>
          <View style={[styles.statusChip, { backgroundColor: glass(0.18) }]}>
            <View style={[styles.statusDot, { backgroundColor: tint }]} />
            <Text style={styles.statusLabel}>{status}</Text>
          </View>
        </View>
        <Text style={styles.heroFee}>${monthlyFee}<Text style={styles.heroFeeUnit}> / month</Text></Text>
        <Text style={styles.heroNote}>
          {status === 'trial' ? `${daysLeft} days left in your free trial` : `Next payment of $${amountOwed} due automatically`}
        </Text>
      </LinearGradient>

      <View style={styles.grid}>
        <AppCard style={styles.metric}>
          <Ionicons name="people-outline" size={20} color={Colors.primaryLight} />
          <Text style={styles.metricValue}>{studentCount}</Text>
          <Text style={TextStyles.bodyMuted}>Active students</Text>
        </AppCard>
        <AppCard style={styles.metric}>
          <Ionicons name="speedometer-outline" size={20} color={Colors.accent} />
          <Text style={styles.metricValue}>{studentLimit}</Text>
          <Text style={TextStyles.bodyMuted}>Plan student limit</Text>
        </AppCard>
        <AppCard style={styles.metric}>
          <Ionicons name="cash-outline" size={20} color={Colors.success} />
          <Text style={styles.metricValue}>${amountOwed}</Text>
          <Text style={TextStyles.bodyMuted}>Owed to Kobciye</Text>
        </AppCard>
      </View>

      <AppCard style={{ gap: 12 }}>
        <View style={styles.usageHeader}>
          <Text style={TextStyles.h2}>Plan usage</Text>
          <Text style={[TextStyles.bodyMuted]}>{studentCount} / {studentLimit} students ({usagePct}%)</Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${usagePct}%`, backgroundColor: usagePct > 85 ? Colors.danger : Colors.success }]} />
        </View>
        {usagePct > 85 && (
          <View style={styles.warningRow}>
            <Ionicons name="alert-circle-outline" size={15} color={Colors.danger} />
            <Text style={[TextStyles.caption, { color: Colors.danger }]}>Approaching plan limit — consider upgrading to the next tier.</Text>
          </View>
        )}
      </AppCard>

      <AppCard style={styles.placeholderNote}>
        <Ionicons name="construct-outline" size={16} color={Colors.muted} />
        <Text style={[TextStyles.caption, { color: Colors.muted, flex: 1 }]}>
          Placeholder billing data — plan upgrades, invoices and automatic student-count recalculation arrive once Kobciye's SaaS billing backend is connected.
        </Text>
      </AppCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.md, paddingBottom: Spacing.xl },
  heroCard: { borderRadius: 22, padding: 22, gap: 14 },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  heroPlan: { color: '#fff', fontSize: 20, fontWeight: '800' },
  heroSub: { color: 'rgba(255,255,255,0.78)', fontSize: 13, marginTop: 2 },
  heroFee: { color: '#fff', fontSize: 36, fontWeight: '800' },
  heroFeeUnit: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.78)' },
  heroNote: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  statusChip: { flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { color: '#fff', fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  metric: { flexGrow: 1, minWidth: 150, gap: 8, alignItems: 'flex-start' },
  metricValue: { fontSize: 22, fontWeight: '800', color: Colors.text },
  usageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  track: { height: 10, borderRadius: 999, backgroundColor: Colors.background, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
  warningRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  placeholderNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
});
