/* ============================================================
   KAABE — Maamulka fasalada (maamulaha guud)

   Maamuluhu wuu abuuraa fasal, macalinna wuu u qoondayn karaa.
   Macalinkuna fasalkiisa wuu samayn karaa (eeg TeacherHomeScreen) —
   laakiin kiisa oo keliya.
   ============================================================ */
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { teachers as allTeachers, studentsByClass, formatMoney } from '../../services/model';
import { Card, Button, Badge, EmptyState } from '../../components/ui';
import ClassFormModal from '../ClassFormModal';
import { colors, spacing, type } from '../../theme/theme';

export default function ClassesScreen({ navigation }) {
  const { store } = useApp();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const teacherList = useMemo(() => allTeachers(store), [store]);
  const currency = store.school.currency;

  const openNew = () => { setEditing(null); setOpen(true); };
  const openEdit = (klass) => { setEditing(klass); setOpen(true); };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Fasalada</Text>
        <Text style={styles.sub}>
          Abuur fasal oo macalin u qoondee. Macalinkuna fasalkiisa wuu samayn karaa.
        </Text>

        <Button title="+ Fasal cusub" onPress={openNew} style={{ marginTop: spacing.md }} />

        {(store.classes || []).length === 0 ? (
          <EmptyState
            title="Weli fasal ma jiro"
            text="Fasal kastaa wuxuu leeyahay magac, lacag bileed iyo hal macalin."
          />
        ) : (
          <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
            {store.classes.map((klass) => {
              const teacher = teacherList.find((t) => t.user_id === klass.teacher_id);
              const count = studentsByClass(store, klass.class_id).length;
              return (
                <Card key={klass.class_id}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('ClassDetail', { classId: klass.class_id })}
                  >
                    <View style={styles.row}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.className}>{klass.name}</Text>
                        <Text style={styles.classMeta}>
                          {klass.level ? `${klass.level} · ` : ''}
                          {count} arday · {formatMoney(klass.monthly_fee, currency)}/bil
                        </Text>
                      </View>
                      <Badge
                        label={teacher ? teacher.full_name : "Macalin la'aan"}
                        bg={teacher ? colors.greenSoft : colors.amberSoft}
                        fg={teacher ? colors.green : colors.amber}
                      />
                    </View>
                  </TouchableOpacity>

                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.action} onPress={() => openEdit(klass)}>
                      <Ionicons name="create-outline" size={16} color={colors.primary} />
                      <Text style={styles.actionText}>Wax ka beddel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.action, styles.actionPrimary]}
                      onPress={() => navigation.navigate('ClassDetail', { classId: klass.class_id })}
                    >
                      <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                      <Text style={[styles.actionText, { color: '#FFFFFF' }]}>Fur fasalka</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>

      <ClassFormModal visible={open} klass={editing} onClose={() => setOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  title: { ...type.h3, color: colors.ink },
  sub: { ...type.b2, color: colors.muted, marginTop: 4, lineHeight: 19 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  className: { ...type.h6, color: colors.ink },
  classMeta: { ...type.b2, color: colors.muted, marginTop: 3 },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: spacing.md,
  },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
  },
  actionPrimary: { backgroundColor: colors.primary },
  actionText: { ...type.b2Bold, color: colors.primary },
});
