/* ============================================================
   Fasalkayga — Bogga maamulaha guud
   Guudmar iskuulka: fasalada, ardayda, macalimiinta iyo lacagta bisha.
   ============================================================ */
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import {
  schoolSummary, classFeeSummary, currentMonth, monthLabel, shiftMonth,
  formatMoney, studentsByClass,
} from '../../services/storage';
import { Card, Stat, SectionTitle, EmptyState, Badge, Button } from '../../components/ui';
import { colors, radius, spacing } from '../../theme/theme';

export default function AdminHomeScreen({ navigation }) {
  const { store, user } = useApp();
  const [month, setMonth] = useState(currentMonth());

  const summary = useMemo(() => schoolSummary(store, month), [store, month]);
  const currency = store.school.currency;

  const classRows = useMemo(() => (store.classes || []).map((klass) => {
    const fee = classFeeSummary(store, klass.class_id, month);
    const teacher = (store.users || []).find((u) => u.user_id === klass.teacher_id);
    return {
      klass,
      teacher,
      students: studentsByClass(store, klass.class_id).length,
      due: fee.due,
      paid: fee.paid,
      balance: fee.balance,
    };
  }), [store, month]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.hello}>{store.school.name}</Text>
            <Text style={styles.sub}>Maamulaha Guud · {user.full_name}</Text>
          </View>
        </View>

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

        <View style={styles.statRow}>
          <Stat label="Fasalo" value={summary.classes} tone="primary" />
          <Stat label="Arday" value={summary.students} tone="green" />
          <Stat label="Macalimiin" value={summary.teachers} tone="amber" />
          <Stat label="Hadhaaga" value={formatMoney(summary.balance, currency)} tone="red" />
        </View>

        <Card style={{ marginTop: spacing.md }}>
          <Text style={styles.cardTitle}>Lacagta {monthLabel(month)}</Text>
          <View style={styles.moneyRow}>
            <MoneyCell label="Waajib" value={formatMoney(summary.due, currency)} color={colors.ink} />
            <MoneyCell label="La bixiyay" value={formatMoney(summary.paid, currency)} color={colors.green} />
            <MoneyCell label="Hadhay" value={formatMoney(summary.balance, currency)} color={colors.red} />
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${summary.due > 0 ? Math.min(100, (summary.paid / summary.due) * 100) : 0}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {summary.due > 0 ? Math.round((summary.paid / summary.due) * 100) : 0}% la ururiyay
          </Text>
        </Card>

        <SectionTitle
          right={(
            <TouchableOpacity onPress={() => navigation.navigate('Fasalada')}>
              <Text style={styles.link}>Maamul</Text>
            </TouchableOpacity>
          )}
        >
          Fasalada
        </SectionTitle>

        {classRows.length === 0 ? (
          <EmptyState
            title="Weli fasal ma jiro"
            text="Abuur fasalkaaga koowaad, ka dibna macalin u qoondee."
            action={<Button title="Abuur fasal" onPress={() => navigation.navigate('Fasalada')} />}
          />
        ) : (
          <View style={{ gap: spacing.sm }}>
            {classRows.map((row) => (
              <TouchableOpacity
                key={row.klass.class_id}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('ClassDetail', { classId: row.klass.class_id })}
              >
                <Card>
                  <View style={styles.classHead}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.className}>{row.klass.name}</Text>
                      <Text style={styles.classMeta}>
                        {row.students} arday · {row.teacher ? row.teacher.full_name : 'Macalin lama qoondayn'}
                      </Text>
                    </View>
                    <Badge
                      label={row.balance > 0 ? formatMoney(row.balance, currency) : 'Dhammaystiran'}
                      bg={row.balance > 0 ? colors.redSoft : colors.greenSoft}
                      fg={row.balance > 0 ? colors.red : colors.green}
                    />
                  </View>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${row.due > 0 ? Math.min(100, (row.paid / row.due) * 100) : 0}%` },
                      ]}
                    />
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function MoneyCell({ label, value, color }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.moneyLabel}>{label}</Text>
      <Text style={[styles.moneyValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  hello: { fontSize: 22, fontWeight: '800', color: colors.ink },
  sub: { fontSize: 13, color: colors.muted, marginTop: 3 },
  monthBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  monthText: { fontSize: 16, fontWeight: '700', color: colors.ink },
  navBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  navBtnOff: { opacity: 0.35 },
  navBtnText: { fontSize: 21, color: colors.primary, lineHeight: 25, fontWeight: '700' },
  statRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.ink, marginBottom: spacing.md },
  moneyRow: { flexDirection: 'row', marginBottom: spacing.md },
  moneyLabel: { fontSize: 11, color: colors.muted },
  moneyValue: { fontSize: 16, fontWeight: '800', marginTop: 2 },
  progressTrack: {
    height: 8,
    backgroundColor: colors.line,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.green, borderRadius: 4 },
  progressText: { fontSize: 12, color: colors.muted, marginTop: 6 },
  link: { fontSize: 13, fontWeight: '700', color: colors.primary },
  classHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  className: { fontSize: 16, fontWeight: '700', color: colors.ink },
  classMeta: { fontSize: 12, color: colors.muted, marginTop: 3 },
});
