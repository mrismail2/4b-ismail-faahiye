/* ============================================================
   KAABE — Bogga maamulaha guud

   Naqshadda: salaan → guudmarka maanta → badhamada dhaqsaha ah →
   lacagta bisha → fasalada.
   ============================================================ */
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import {
  schoolSummary, classFeeSummary, currentMonth, monthLabel, shiftMonth,
  formatMoney, studentsByClass, getRegister, todayISO, teachers as allTeachers,
  listInvites, inviteState,
} from '../../services/model';
import { Card, SectionTitle, EmptyState, Badge, Button } from '../../components/ui';
import {
  GreetingHeader, InfoCard, QuickAccess, MetricRow, HeroCard,
} from '../../components/blocks';
import { colors, radius, spacing } from '../../theme/theme';

export default function AdminHomeScreen({ navigation }) {
  const { store, user } = useApp();
  const [month, setMonth] = useState(currentMonth());
  const today = todayISO();

  const summary = useMemo(() => schoolSummary(store, month), [store, month]);
  const currency = store.school.currency;

  const classRows = useMemo(() => (store.classes || []).map((klass) => {
    const fee = classFeeSummary(store, klass.class_id, month);
    const teacher = (store.users || []).find((u) => u.user_id === klass.teacher_id);
    const roster = studentsByClass(store, klass.class_id);
    const marked = Object.keys(getRegister(store, klass.class_id, today)).length;
    return {
      klass,
      teacher,
      students: roster.length,
      marked,
      due: fee.due,
      paid: fee.paid,
      balance: fee.balance,
    };
  }), [store, month, today]);

  /* Waxa maanta hadhay */
  const pendingAttendance = classRows.filter((r) => r.students > 0 && r.marked < r.students).length;
  const unassigned = classRows.filter((r) => !r.teacher).length;
  const openInvites = useMemo(
    () => listInvites(store).filter((i) => inviteState(i) === 'pending').length,
    [store],
  );

  const collected = summary.due > 0 ? Math.round((summary.paid / summary.due) * 100) : 0;
  const teacherCount = allTeachers(store).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <GreetingHeader
          name={user.full_name}
          photoUri={user.photo_uri}
          onPressAvatar={() => navigation.navigate('Akoon')}
        />

        {/* ---- guudmarka maanta ---- */}
        <SectionTitle>Guudmarka maanta</SectionTitle>
        <View style={{ gap: spacing.sm }}>
          <InfoCard
            icon="school-outline"
            tone="blue"
            title={store.school.name}
            subtitle={`${summary.classes} fasal · ${summary.students} arday · ${teacherCount} macalin`}
          />
          {pendingAttendance > 0 && (
            <InfoCard
              icon="alert-circle-outline"
              tone="amber"
              title={`${pendingAttendance} fasal oo xaadiris u hadhay`}
              subtitle="Macalimiintu weli ma dhammaystirin xaadiriska maanta"
            />
          )}
          {unassigned > 0 && (
            <InfoCard
              icon="person-add-outline"
              tone="red"
              title={`${unassigned} fasal oo macalin la'aan ah`}
              subtitle="Casuun macalin ama mid hore u qoondee"
              onPress={() => navigation.navigate('Macalimiin')}
            />
          )}
          {openInvites > 0 && (
            <InfoCard
              icon="mail-outline"
              tone="green"
              title={`${openInvites} casuumaad oo la sugayo`}
              subtitle="Macalimiintu weli ma isticmaalin koodhkooda"
              onPress={() => navigation.navigate('Macalimiin')}
            />
          )}
        </View>

        {/* ---- badhamada dhaqsaha ah ---- */}
        <SectionTitle>Si dhaqso ah</SectionTitle>
        <QuickAccess
          actions={[
            {
              key: 'class',
              icon: 'add-circle-outline',
              label: 'Fasal cusub',
              tone: 'blue',
              onPress: () => navigation.navigate('Fasalada'),
            },
            {
              key: 'invite',
              icon: 'mail-open-outline',
              label: 'Casuun macalin',
              tone: 'green',
              onPress: () => navigation.navigate('Macalimiin'),
            },
            {
              key: 'teachers',
              icon: 'people-outline',
              label: 'Macalimiinta',
              tone: 'slate',
              onPress: () => navigation.navigate('Macalimiin'),
            },
            {
              key: 'money',
              icon: 'cash-outline',
              label: 'Lacagaha',
              tone: 'red',
              onPress: () => navigation.navigate('Fasalada'),
            },
          ]}
        />

        {/* ---- lacagta bisha ---- */}
        <SectionTitle
          right={(
            <View style={styles.monthNav}>
              <TouchableOpacity onPress={() => setMonth(shiftMonth(month, -1))} style={styles.navBtn}>
                <Ionicons name="chevron-back" size={16} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMonth(shiftMonth(month, 1))}
                style={[styles.navBtn, month >= currentMonth() && styles.navBtnOff]}
                disabled={month >= currentMonth()}
              >
                <Ionicons name="chevron-forward" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )}
        >
          Lacagta {monthLabel(month)}
        </SectionTitle>

        <HeroCard
          title={formatMoney(summary.paid, currency)}
          subtitle={`la ururiyay · ${collected}% waajibka ${formatMoney(summary.due, currency)}`}
          tone={collected >= 100 ? 'green' : 'primary'}
          items={[
            { label: 'Waajib', value: formatMoney(summary.due, currency) },
            { label: 'Hadhay', value: formatMoney(summary.balance, currency) },
            { label: 'Arday', value: String(summary.students) },
          ]}
        />

        <Card style={{ marginTop: spacing.sm }}>
          <MetricRow
            icon="school-outline"
            label="Fasalada"
            value={String(summary.classes)}
            tone="blue"
          />
          <MetricRow
            icon="people-outline"
            label="Macalimiinta"
            value={String(teacherCount)}
            tone="green"
          />
          <MetricRow
            icon="trending-up-outline"
            label="Ururinta lacagta"
            value={`${collected}%`}
            percent={collected}
            tone={collected >= 70 ? 'green' : collected >= 40 ? 'amber' : 'red'}
            last
          />
        </Card>

        {/* ---- fasalada ---- */}
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
            text="Abuur fasalkaaga koowaad, ka dibna macalin u casuun."
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
                    {/* Fasal aan arday lahayn "Dhammaystiran" lama dhihi karo */}
                    <Badge
                      label={row.students === 0
                        ? 'Arday ma jiro'
                        : row.balance > 0
                          ? formatMoney(row.balance, currency)
                          : 'Dhammaystiran'}
                      bg={row.students === 0
                        ? colors.line
                        : row.balance > 0 ? colors.redSoft : colors.greenSoft}
                      fg={row.students === 0
                        ? colors.muted
                        : row.balance > 0 ? colors.red : colors.green}
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

                  <View style={styles.classFoot}>
                    <View style={styles.footItem}>
                      <Ionicons name="checkbox-outline" size={13} color={colors.muted} />
                      <Text style={styles.footText}>
                        Xaadiris {row.marked}/{row.students}
                      </Text>
                    </View>
                    <View style={styles.footItem}>
                      <Ionicons name="cash-outline" size={13} color={colors.muted} />
                      <Text style={styles.footText}>
                        {formatMoney(row.paid, currency)} / {formatMoney(row.due, currency)}
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
  monthNav: { flexDirection: 'row', gap: 6 },
  navBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  navBtnOff: { opacity: 0.35 },
  link: { fontSize: 13, fontWeight: '700', color: colors.primary },
  classHead: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm,
  },
  className: { fontSize: 16, fontWeight: '700', color: colors.ink },
  classMeta: { fontSize: 12, color: colors.muted, marginTop: 3 },
  progressTrack: { height: 7, backgroundColor: colors.line, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.green, borderRadius: 4 },
  classFoot: {
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
