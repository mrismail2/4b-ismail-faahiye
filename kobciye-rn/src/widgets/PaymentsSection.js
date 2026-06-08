import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from './AppCard';
import StatCard from './StatCard';
import { Colors } from '../constants/colors';
import { Text as TextStyles, Spacing } from '../constants/text';

const STATUS_META = {
  paid: { color: Colors.success, label: 'Paid', icon: 'checkmark-circle' },
  unpaid: { color: Colors.danger, label: 'Unpaid', icon: 'close-circle' },
  partial: { color: Colors.accent, label: 'Partial', icon: 'time' },
  free: { color: Colors.primaryLight, label: 'Free', icon: 'gift' },
};

function PaymentRow({ row }) {
  const meta = STATUS_META[row.status] || STATUS_META.unpaid;
  return (
    <AppCard style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: `${meta.color}1A` }]}>
        <Ionicons name={meta.icon} size={18} color={meta.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={TextStyles.h2}>{row.month} {row.year}</Text>
        <Text style={TextStyles.bodyMuted}>
          ${row.paid} of ${row.due} paid{row.date ? ` · ${row.date}` : ''}{row.method ? ` · ${row.method}` : ''}
        </Text>
      </View>
      <View style={styles.amountWrap}>
        <View style={[styles.statusChip, { backgroundColor: `${meta.color}1A` }]}>
          <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
        </View>
        {row.balance > 0 && <Text style={[TextStyles.caption, { color: Colors.danger, marginTop: 5 }]}>Balance ${row.balance}</Text>}
        <View style={styles.receiptChip}>
          <Ionicons name="receipt-outline" size={12} color={Colors.muted} />
          <Text style={[TextStyles.caption, { color: Colors.muted }]}>Receipt</Text>
        </View>
      </View>
    </AppCard>
  );
}

const DEMO_HISTORY = [
  { month: 'May', year: 2026, due: 25, paid: 25, balance: 0, status: 'paid', date: 'May 3', method: 'Mobile money' },
  { month: 'June', year: 2026, due: 25, paid: 0, balance: 25, status: 'unpaid', date: null, method: null },
];

const ADMIN_SUMMARY = [
  { label: 'Total students', value: '642', icon: 'people', tint: Colors.primaryLight },
  { label: 'Paid students', value: '511', icon: 'checkmark-circle', tint: Colors.success, trend: '79.6%', trendUp: true },
  { label: 'Unpaid students', value: '94', icon: 'close-circle', tint: Colors.danger, trend: '14.6%', trendUp: false },
  { label: 'Partial payments', value: '29', icon: 'time', tint: Colors.accent, trend: '4.5%', trendUp: false },
  { label: 'Free students', value: '8', icon: 'gift', tint: Colors.primaryLight },
  { label: 'Expected revenue', value: '$16,050', icon: 'trending-up', tint: Colors.primary },
  { label: 'Collected so far', value: '$12,910', icon: 'wallet', tint: Colors.success, trend: '+$640', trendUp: true },
  { label: 'Outstanding balance', value: '$3,140', icon: 'alert-circle', tint: Colors.danger },
];

// Role-aware payments view: a personal "am I paid?" history for students
// and parents, or a full revenue breakdown grid for accountants/admins.
export default function PaymentsSection({ variant = 'self', history = DEMO_HISTORY, summary = ADMIN_SUMMARY, unpaidWarning }) {
  const hasUnpaid = history.some((h) => h.status === 'unpaid' || h.status === 'partial');

  return (
    <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
      <View style={{ gap: 4 }}>
        <Text style={TextStyles.h1}>Payments</Text>
        <Text style={TextStyles.bodyMuted}>
          {variant === 'self' ? 'Track fee status, balances and payment history at a glance.' : 'Revenue, collection and balance overview for the whole school.'}
        </Text>
      </View>

      {variant === 'self' && hasUnpaid && (
        <AppCard style={styles.warningCard}>
          <Ionicons name="alert-circle" size={20} color={Colors.danger} />
          <Text style={[TextStyles.body, { color: Colors.danger, flex: 1, fontWeight: '600' }]}>
            {unpaidWarning || 'A payment is due — please settle the balance to keep the account in good standing.'}
          </Text>
        </AppCard>
      )}

      {variant === 'self' ? (
        history.map((row, i) => <PaymentRow key={i} row={row} />)
      ) : (
        <View style={styles.grid}>
          {summary.map((s, i) => <StatCard key={i} {...s} />)}
        </View>
      )}

      {variant !== 'self' && (
        <AppCard style={{ gap: 6 }}>
          <Text style={TextStyles.h2}>SaaS pricing reminder</Text>
          <Text style={TextStyles.bodyMuted}>
            Kobciye's monthly fee for your school is calculated by active student count — see the Subscription section for your current plan, usage and amount owed.
          </Text>
        </AppCard>
      )}

      <AppCard style={styles.placeholderNote}>
        <Ionicons name="construct-outline" size={16} color={Colors.muted} />
        <Text style={[TextStyles.caption, { color: Colors.muted, flex: 1 }]}>
          Placeholder figures — live balances, receipts, payment methods and mobile-money matching connect once the Supabase payments module is wired up.
        </Text>
      </AppCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.md, paddingBottom: Spacing.xl },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconWrap: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  amountWrap: { alignItems: 'flex-end', gap: 4 },
  statusChip: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  statusText: { fontSize: 11, fontWeight: '700' },
  receiptChip: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  warningCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: `${Colors.danger}0D`, borderColor: `${Colors.danger}33` },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  placeholderNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
});
