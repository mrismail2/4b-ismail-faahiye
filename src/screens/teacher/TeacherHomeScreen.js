/* ============================================================
   KAABE — Bogga macalinka

   Naqshadda: salaan → "Maanta guudmarkeeda" → badhamada dhaqsaha ah →
   tirakoobka → fasaladayda.

   Macalinku wuxuu arkaa fasalada loo qoondeeyay OO KELIYA.
   ============================================================ */
import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import {
  classesForUser, studentsByClass, classFeeSummary, getRegister,
  attendanceSummary, currentMonth, monthLabel, todayISO, formatMoney,
} from '../../services/model';
import { Card, SectionTitle, EmptyState, Badge } from '../../components/ui';
import {
  GreetingHeader, InfoCard, QuickAccess, MetricRow, HeroCard,
} from '../../components/blocks';
import { colors, spacing } from '../../theme/theme';

export default function TeacherHomeScreen({ navigation }) {
  const { store, user } = useApp();
  const month = currentMonth();
  const today = todayISO();
  const currency = store.school.currency;

  const rows = useMemo(() => classesForUser(store, user).map((klass) => {
    const roster = studentsByClass(store, klass.class_id);
    const fee = classFeeSummary(store, klass.class_id, month);
    const marked = Object.keys(getRegister(store, klass.class_id, today)).length;
    return {
      klass,
      students: roster.length,
      marked,
      pending: Math.max(0, roster.length - marked),
      due: fee.due,
      paid: fee.paid,
      balance: fee.balance,
    };
  }), [store, user, month, today]);

  const totals = useMemo(() => rows.reduce((acc, r) => ({
    students: acc.students + r.students,
    pending: acc.pending + r.pending,
    marked: acc.marked + r.marked,
    due: acc.due + r.due,
    paid: acc.paid + r.paid,
    balance: acc.balance + r.balance,
  }), { students: 0, pending: 0, marked: 0, due: 0, paid: 0, balance: 0 }), [rows]);

  /* Heerka joogitaanka bishan — dhammaan fasaladayda */
  const presenceRate = useMemo(() => {
    let present = 0;
    let total = 0;
    rows.forEach((r) => {
      const summary = attendanceSummary(store, r.klass.class_id, month);
      Object.values(summary).forEach((s) => {
        present += s.present || 0;
        total += s.total || 0;
      });
    });
    return total ? Math.round((present / total) * 100) : 0;
  }, [store, rows, month]);

  const collected = totals.due > 0 ? Math.round((totals.paid / totals.due) * 100) : 0;

  /* Fasalka xiga ee xaadiris u baahan */
  const nextClass = rows.find((r) => r.pending > 0) || rows[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <GreetingHeader
          name={user.full_name}
          photoUri={user.photo_uri}
          subtitle={user.subject ? `${user.subject} · ${store.school.name}` : store.school.name}
          onPressAvatar={() => navigation.navigate('Akoon')}
        />

        {rows.length === 0 ? (
          <EmptyState
            title="Weli fasal lagumaa qoondayn"
            text="Maamulaha guud ayaa fasal kuu qoondaynaya. La xiriir isaga."
          />
        ) : (
          <>
            {/* ---- maanta ---- */}
            <SectionTitle>Maanta</SectionTitle>
            <View style={{ gap: spacing.sm }}>
              {totals.pending > 0 ? (
                <InfoCard
                  icon="alert-circle-outline"
                  tone="amber"
                  title={`${totals.pending} arday oo xaadiris u hadhay`}
                  subtitle={nextClass ? `Bilow ${nextClass.klass.name}` : undefined}
                  onPress={nextClass
                    ? () => navigation.navigate('ClassDetail', { classId: nextClass.klass.class_id })
                    : undefined}
                />
              ) : (
                <InfoCard
                  icon="checkmark-circle-outline"
                  tone="green"
                  title="Xaadiriska maanta waa dhammaystiran"
                  subtitle={`${totals.marked} arday ayaa la calaamadiyay`}
                />
              )}
              {totals.balance > 0 && (
                <InfoCard
                  icon="cash-outline"
                  tone="red"
                  title={`${formatMoney(totals.balance, currency)} ayaa hadhay`}
                  subtitle={`Lacagta ${monthLabel(month)}`}
                />
              )}
            </View>

            {/* ---- si dhaqso ah ---- */}
            <SectionTitle>Si dhaqso ah</SectionTitle>
            <QuickAccess
              actions={[
                {
                  key: 'attendance',
                  icon: 'checkbox-outline',
                  label: 'Qaad xaadiris',
                  tone: 'green',
                  onPress: () => nextClass && navigation.navigate('ClassDetail', {
                    classId: nextClass.klass.class_id, tab: 'attendance',
                  }),
                },
                {
                  key: 'students',
                  icon: 'people-outline',
                  label: 'Ardayda',
                  tone: 'blue',
                  onPress: () => nextClass && navigation.navigate('ClassDetail', {
                    classId: nextClass.klass.class_id, tab: 'students',
                  }),
                },
                {
                  key: 'fees',
                  icon: 'cash-outline',
                  label: 'Lacagaha',
                  tone: 'red',
                  onPress: () => nextClass && navigation.navigate('ClassDetail', {
                    classId: nextClass.klass.class_id, tab: 'fees',
                  }),
                },
                {
                  key: 'profile',
                  icon: 'person-circle-outline',
                  label: 'Profile-kayga',
                  tone: 'slate',
                  onPress: () => navigation.navigate('Akoon'),
                },
              ]}
            />

            {/* ---- tirakoobka ---- */}
            <SectionTitle>Tirakoobka {monthLabel(month)}</SectionTitle>
            <HeroCard
              title={`${rows.length} fasal · ${totals.students} arday`}
              subtitle="Fasalada laguu qoondeeyay"
              items={[
                { label: 'Joogitaan', value: `${presenceRate}%` },
                { label: 'La bixiyay', value: formatMoney(totals.paid, currency) },
                { label: 'Hadhay', value: formatMoney(totals.balance, currency) },
              ]}
            />

            <Card style={{ marginTop: spacing.sm }}>
              <MetricRow
                icon="checkbox-outline"
                label="Xaadiriska maanta"
                value={`${totals.marked}/${totals.students}`}
                percent={totals.students ? (totals.marked / totals.students) * 100 : 0}
                tone={totals.pending === 0 ? 'green' : 'amber'}
              />
              <MetricRow
                icon="trending-up-outline"
                label="Heerka joogitaanka"
                value={`${presenceRate}%`}
                percent={presenceRate}
                tone={presenceRate >= 80 ? 'green' : presenceRate >= 50 ? 'amber' : 'red'}
              />
              <MetricRow
                icon="cash-outline"
                label="Ururinta lacagta"
                value={`${collected}%`}
                percent={collected}
                tone={collected >= 70 ? 'green' : collected >= 40 ? 'amber' : 'red'}
                last
              />
            </Card>

            {/* ---- fasaladayda ---- */}
            <SectionTitle>Fasaladayda</SectionTitle>
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
                        label={row.pending > 0 ? `${row.pending} hadhay` : 'Xaadiris diyaar'}
                        bg={row.pending > 0 ? colors.amberSoft : colors.greenSoft}
                        fg={row.pending > 0 ? colors.amber : colors.green}
                      />
                    </View>

                    <View style={styles.footer}>
                      <View style={styles.footItem}>
                        <Ionicons name="checkbox-outline" size={13} color={colors.muted} />
                        <Text style={styles.footText}>{row.marked}/{row.students}</Text>
                      </View>
                      <View style={styles.footItem}>
                        <Ionicons name="cash-outline" size={13} color={colors.muted} />
                        <Text style={[
                          styles.footText,
                          { color: row.balance > 0 ? colors.red : colors.green, fontWeight: '700' },
                        ]}>
                          {formatMoney(row.balance, currency)} hadhay
                        </Text>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  className: { fontSize: 16, fontWeight: '700', color: colors.ink },
  classMeta: { fontSize: 12, color: colors.muted, marginTop: 3 },
  footer: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: spacing.sm,
  },
  footItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  footText: { fontSize: 11.5, color: colors.muted },
});
