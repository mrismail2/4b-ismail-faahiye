/* ============================================================
   Fasalkayga — Maamulka fasalada (maamulaha guud oo keliya)
   Abuur fasal, u qoondee macalin, beddel lacagta bisha.
   ============================================================ */
import React, { useMemo, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import {
  addClass, updateClass, deleteClass, teachers as allTeachers,
  studentsByClass, formatMoney,
} from '../../services/storage';
import { Card, Button, Field, Badge, EmptyState, Avatar } from '../../components/ui';
import { colors, radius, spacing } from '../../theme/theme';

export default function ClassesScreen({ navigation }) {
  const { store, mutate } = useApp();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', level: '', monthlyFee: '', teacherId: null });

  const teacherList = useMemo(() => allTeachers(store), [store]);
  const currency = store.school.currency;

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', level: '', monthlyFee: '', teacherId: null });
    setOpen(true);
  };

  const openEdit = (klass) => {
    setEditing(klass);
    setForm({
      name: klass.name,
      level: klass.level || '',
      monthlyFee: String(klass.monthly_fee || ''),
      teacherId: klass.teacher_id || null,
    });
    setOpen(true);
  };

  const save = async () => {
    try {
      if (editing) {
        await mutate((s) => updateClass(s, editing.class_id, {
          level: form.level.trim(),
          monthly_fee: Number(form.monthlyFee) || 0,
          teacher_id: form.teacherId,
        }));
      } else {
        await mutate((s) => addClass(s, {
          name: form.name,
          level: form.level,
          monthlyFee: form.monthlyFee,
          teacherId: form.teacherId,
        }));
      }
      setOpen(false);
    } catch (e) {
      Alert.alert('Khalad', e.message);
    }
  };

  const confirmDelete = (klass) => {
    Alert.alert(
      'Tirtir fasalka',
      `${klass.name} iyo dhammaan ardaydiisa, xaadiriskiisa iyo lacagihiisa waa la tirtirayaa. Ma hubtaa?`,
      [
        { text: 'Maya', style: 'cancel' },
        {
          text: 'Haa, tirtir',
          style: 'destructive',
          onPress: async () => {
            await mutate((s) => deleteClass(s, klass.class_id));
            setOpen(false);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Fasalada</Text>
        <Text style={styles.sub}>Abuur fasal, ka dibna macalin u qoondee.</Text>

        <Button title="+ Fasal cusub" onPress={openNew} style={{ marginTop: spacing.md }} />

        {(store.classes || []).length === 0 ? (
          <EmptyState
            title="Weli fasal ma jiro"
            text="Fasal kasta wuxuu leeyahay magac, lacag bileed iyo hal macalin."
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
                        label={teacher ? teacher.full_name : 'Macalin la\'aan'}
                        bg={teacher ? colors.greenSoft : colors.amberSoft}
                        fg={teacher ? colors.green : colors.amber}
                      />
                    </View>
                  </TouchableOpacity>
                  <View style={styles.actions}>
                    <Button
                      title="Wax ka beddel"
                      variant="ghost"
                      onPress={() => openEdit(klass)}
                      style={{ flex: 1 }}
                    />
                    <Button
                      title="Fur fasalka"
                      onPress={() => navigation.navigate('ClassDetail', { classId: klass.class_id })}
                      style={{ flex: 1 }}
                    />
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.modalTitle}>{editing ? editing.name : 'Fasal cusub'}</Text>

              {!editing && (
                <Field
                  label="Magaca fasalka"
                  placeholder="Tusaale: Fasalka 1A"
                  value={form.name}
                  onChangeText={(v) => setForm({ ...form, name: v })}
                />
              )}

              <Field
                label="Heerka (ikhtiyaari)"
                placeholder="Tusaale: Dugsi Hoose"
                value={form.level}
                onChangeText={(v) => setForm({ ...form, level: v })}
              />
              <Field
                label="Lacagta bisha"
                placeholder="0"
                hint="Tani waa qiimaha caadiga ah ee arday walba."
                value={form.monthlyFee}
                onChangeText={(v) => setForm({ ...form, monthlyFee: v })}
                keyboardType="numeric"
              />

              <Text style={styles.fieldLabel}>Macalinka mas'uulka ah</Text>
              {teacherList.length === 0 ? (
                <Text style={styles.noTeachers}>
                  Weli macalin isma diiwaan gelin. Macalinku wuxuu naftiisa ku diiwaan gelin karaa
                  bogga "Isdiiwaan geli".
                </Text>
              ) : (
                <View style={{ gap: spacing.sm, marginBottom: spacing.md }}>
                  {teacherList.map((t) => {
                    const active = form.teacherId === t.user_id;
                    return (
                      <TouchableOpacity
                        key={t.user_id}
                        style={[styles.teacherRow, active && styles.teacherRowActive]}
                        onPress={() => setForm({ ...form, teacherId: active ? null : t.user_id })}
                        activeOpacity={0.85}
                      >
                        <Avatar name={t.full_name} size={34} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.teacherName}>{t.full_name}</Text>
                          <Text style={styles.teacherMeta}>{t.phone}</Text>
                        </View>
                        <View style={[styles.check, active && styles.checkActive]}>
                          {active && <Text style={styles.checkMark}>✓</Text>}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              <Button title={editing ? 'Kaydi beddelka' : 'Abuur fasalka'} onPress={save} />
              {editing && (
                <Button
                  title="Tirtir fasalka"
                  variant="danger"
                  onPress={() => confirmDelete(editing)}
                  style={{ marginTop: spacing.sm }}
                />
              )}
              <Button
                title="Jooji"
                variant="ghost"
                onPress={() => setOpen(false)}
                style={{ marginTop: spacing.sm }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  title: { fontSize: 22, fontWeight: '800', color: colors.ink },
  sub: { fontSize: 13, color: colors.muted, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  className: { fontSize: 16, fontWeight: '700', color: colors.ink },
  classMeta: { fontSize: 12, color: colors.muted, marginTop: 3 },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: spacing.md,
  },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: colors.ink2, marginBottom: 8 },
  noTeachers: {
    fontSize: 12.5,
    color: colors.muted,
    lineHeight: 18,
    marginBottom: spacing.md,
    backgroundColor: colors.amberSoft,
    padding: spacing.md,
    borderRadius: radius.sm,
  },
  teacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  teacherRowActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  teacherName: { fontSize: 14, fontWeight: '700', color: colors.ink },
  teacherMeta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  check: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 1.5, borderColor: colors.line,
    alignItems: 'center', justifyContent: 'center',
  },
  checkActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkMark: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(16,26,40,0.45)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl + 12,
    maxHeight: '88%',
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.ink, marginBottom: spacing.lg },
});
