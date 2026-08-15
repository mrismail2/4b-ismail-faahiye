/* ============================================================
   KAABE — Macalimiinta (maamulaha guud oo keliya)
   Macalimiintu naftooda ayay isku diiwaan geliyaan; halkan waxaa
   fasalada loogu qoondeeyaa.
   ============================================================ */
import React, { useMemo, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { teachers as allTeachers, getClassById, studentsByClass } from '../../services/model';
import { Card, Button, Badge, Avatar, EmptyState } from '../../components/ui';
import { colors, radius, spacing } from '../../theme/theme';

export default function TeachersScreen({ navigation }) {
  const { store, ops } = useApp();
  const [target, setTarget] = useState(null);

  const teacherList = useMemo(() => allTeachers(store), [store]);

  const toggleClass = async (teacher, classId) => {
    const klass = getClassById(store, classId);
    const alreadyMine = klass?.teacher_id === teacher.user_id;
    try {
      await ops.assignTeacher(classId, alreadyMine ? null : teacher.user_id);
    } catch (e) {
      Alert.alert('Khalad', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Macalimiinta</Text>
        <Text style={styles.sub}>
          Macalinku wuxuu naftiisa ku diiwaan geliyaa bogga soo galitaanka. Halkan waxaad u
          qoondaynaysaa fasalada.
        </Text>

        {teacherList.length === 0 ? (
          <EmptyState
            title="Weli macalin ma jiro"
            text="Macalinku ha isticmaalo 'Isdiiwaan geli' bogga soo galitaanka, ka dibna halkan ka qoondee fasal."
          />
        ) : (
          <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
            {teacherList.map((teacher) => {
              const mine = (teacher.assigned_class_ids || [])
                .map((id) => getClassById(store, id))
                .filter(Boolean);
              const students = mine.reduce(
                (sum, k) => sum + studentsByClass(store, k.class_id).length, 0);

              return (
                <Card key={teacher.user_id}>
                  <View style={styles.row}>
                    <Avatar name={teacher.full_name} photoUri={teacher.photo_uri} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.name}>{teacher.full_name}</Text>
                      <Text style={styles.meta}>
                        {teacher.subject || 'Maado lama qorin'}{teacher.phone ? ` · ${teacher.phone}` : ''}
                      </Text>
                    </View>
                    <Badge
                      label={`${mine.length} fasal`}
                      bg={mine.length ? colors.greenSoft : colors.amberSoft}
                      fg={mine.length ? colors.green : colors.amber}
                    />
                  </View>

                  {mine.length > 0 && (
                    <View style={styles.chipRow}>
                      {mine.map((k) => (
                        <TouchableOpacity
                          key={k.class_id}
                          style={styles.chip}
                          onPress={() => navigation.navigate('ClassDetail', { classId: k.class_id })}
                        >
                          <Text style={styles.chipText}>{k.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <Text style={styles.summary}>
                    {students} arday ayuu wadar ahaan maamulaa
                  </Text>

                  <Button
                    title="Qoondee fasalada"
                    variant="ghost"
                    onPress={() => setTarget(teacher)}
                    style={{ marginTop: spacing.md }}
                  />
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>

      <Modal visible={!!target} transparent animationType="slide" onRequestClose={() => setTarget(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {!!target && (
              <ScrollView>
                <Text style={styles.modalTitle}>{target.full_name}</Text>
                <Text style={styles.modalSub}>
                  Dooro fasalada uu maamulayo. Fasal kastaa wuxuu leeyahay hal macalin oo keliya.
                </Text>

                {(store.classes || []).length === 0 ? (
                  <Text style={styles.warn}>Weli fasal lama abuurin.</Text>
                ) : (
                  <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
                    {store.classes.map((klass) => {
                      const owner = (store.users || []).find((u) => u.user_id === klass.teacher_id);
                      const mine = klass.teacher_id === target.user_id;
                      const takenByOther = !!owner && !mine;

                      return (
                        <TouchableOpacity
                          key={klass.class_id}
                          style={[styles.classRow, mine && styles.classRowActive]}
                          onPress={() => toggleClass(target, klass.class_id)}
                          activeOpacity={0.85}
                        >
                          <View style={{ flex: 1 }}>
                            <Text style={styles.className}>{klass.name}</Text>
                            <Text style={styles.classMeta}>
                              {takenByOther ? `Hadda: ${owner.full_name}` : mine ? 'Adiga ayaa leh' : 'Bannaan'}
                            </Text>
                          </View>
                          <View style={[styles.check, mine && styles.checkActive]}>
                            {mine && <Text style={styles.checkMark}>✓</Text>}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                <Button title="Diyaar" onPress={() => setTarget(null)} />
              </ScrollView>
            )}
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
  sub: { fontSize: 13, color: colors.muted, marginTop: 4, lineHeight: 19 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  name: { fontSize: 16, fontWeight: '700', color: colors.ink },
  meta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.md },
  chip: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  chipText: { fontSize: 12, fontWeight: '600', color: colors.primary },
  summary: { fontSize: 12, color: colors.muted, marginTop: spacing.sm },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(16,26,40,0.45)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl + 12,
    maxHeight: '85%',
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.ink },
  modalSub: { fontSize: 13, color: colors.muted, marginTop: 6, marginBottom: spacing.lg, lineHeight: 19 },
  warn: { fontSize: 13, color: colors.amber, marginBottom: spacing.lg },
  classRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  classRowActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  className: { fontSize: 15, fontWeight: '700', color: colors.ink },
  classMeta: { fontSize: 12, color: colors.muted, marginTop: 3 },
  check: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 1.5, borderColor: colors.line,
    alignItems: 'center', justifyContent: 'center',
  },
  checkActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkMark: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
});
