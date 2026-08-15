/* ============================================================
   Fasalkayga — Bogga macalinka
   Wuxuu arkaa oo keliya fasalada loo qoondeeyay.
   ============================================================ */
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import {
  classesForUser, studentsByClass, classFeeSummary, getRegister,
  currentMonth, monthLabel, todayISO, formatMoney,
} from '../../services/storage';
import { Card, Stat, SectionTitle, EmptyState, Badge } from '../../components/ui';
import { colors, spacing } from '../../theme/theme';

export default function TeacherHomeScreen({ navigation }) {
  const { store, user } = useApp();
  const [month] = useState(currentMonth());
  const today = todayISO();
  const currency = store.school.currency;

  const rows = useMemo(() => classesForUser(store, user).map((klass) => {
    const roster = studentsByClass(store, klass.class_id);
    const fee = classFeeSummary(store, klass.class_id, month);
    const register = getRegister(store, klass.class_id, today);
    const marked = Object.keys(register).length;
    return {
      klass,
      students: roster.length,
      marked,
      pending: Math.max(0, roster.length - marked),
      balance: fee.balance,
    };
  }), [store, user, month, today]);

  const totals = useMemo(() => rows.reduce((acc, r) => ({
    students: acc.students + r.students,
    pending: acc.pending + r.pending,
    balance: acc.balance + r.balance,
  }), { students: 0, pending: 0, balance: 0 }), [rows]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.hello}>Salaan, {user.full_name.split(' ')[0]}</Text>
        <Text style={styles.sub}>Macalin · {store.school.name}</Text>

        <View style={styles.statRow}>
          <Stat label="Fasalada" value={rows.length} tone="primary" />
          <Stat label="Ardayda" value={totals.students} tone="green" />
          <Stat label="Xaadiris hadhay" value={totals.pending} tone="amber" />
          <Stat label="Lacag hadhay" value={formatMoney(totals.balance, currency)} tone="red" />
        </View>

        <SectionTitle>Fasaladayda · {monthLabel(month)}</SectionTitle>

        {rows.length === 0 ? (
          <EmptyState
            title="Weli fasal lagumaa qoondayn"
            text="Maamulaha guud ayaa fasal kuu qoondaynaya. La xiriir isaga."
          />
        ) : (
          <View style={{ gap: spacing.sm }}>
            {rows.map((row) => (
              <TouchableOpacity
                key={row.klass.class_id}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('ClassDetail', { classId: row.klass.class_id })}
              >
                <Card>
                  <View style={styles.head}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.className}>{row.klass.name}</Text>
                      <Text style={styles.classMeta}>
                        {row.students} arday · {formatMoney(row.klass.monthly_fee, currency)}/bil
                      </Text>
                    </View>
                    <Badge
                      label={row.pending > 0 ? `${row.pending} xaadiris` : 'Xaadiris diyaar'}
                      bg={row.pending > 0 ? colors.amberSoft : colors.greenSoft}
                      fg={row.pending > 0 ? colors.amber : colors.green}
                    />
                  </View>

                  <View style={styles.footer}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.footLabel}>Xaadiriska maanta</Text>
                      <Text style={styles.footValue}>{row.marked}/{row.students}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.footLabel}>Lacag hadhay</Text>
                      <Text style={[
                        styles.footValue,
                        { color: row.balance > 0 ? colors.red : colors.green },
                      ]}>
                        {formatMoney(row.balance, currency)}
                      </Text>
                    </View>
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  hello: { fontSize: 22, fontWeight: '800', color: colors.ink },
  sub: { fontSize: 13, color: colors.muted, marginTop: 3 },
  statRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  className: { fontSize: 16, fontWeight: '700', color: colors.ink },
  classMeta: { fontSize: 12, color: colors.muted, marginTop: 3 },
  footer: {
    flexDirection: 'row',
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: spacing.sm,
  },
  footLabel: { fontSize: 11, color: colors.muted },
  footValue: { fontSize: 15, fontWeight: '700', color: colors.ink, marginTop: 2 },
});
