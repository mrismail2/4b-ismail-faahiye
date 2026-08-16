/* ============================================================
   KAABE — Foomka fasalka (maamule + macalin labadaba)

   Macalinku fasalkiisa ayuu samaystaa — sidaas foomku macalinka
   uma tuso "macalinka mas'uulka ah": had iyo jeer isaga ayaa leh.
   Maamuluhu wuu dooran karaa cidda uu siinayo.
   ============================================================ */
import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { teachers as allTeachers, ROLES, canEditClass } from '../services/model';
import { Button, Field, Avatar } from '../components/ui';
import { confirm, notify } from '../utils/dialog';
import { colors, radius, spacing, type } from '../theme/theme';

export default function ClassFormModal({ visible, klass, onClose }) {
  const { store, user, ops, busy } = useApp();
  const isAdmin = user.role === ROLES.SUPER_ADMIN;
  const editing = !!klass;

  const [form, setForm] = useState({ name: '', level: '', monthlyFee: '', teacherId: null });

  useEffect(() => {
    if (!visible) return;
    setForm({
      name: klass?.name || '',
      level: klass?.level || '',
      monthlyFee: klass ? String(klass.monthly_fee || '') : '',
      teacherId: klass?.teacher_id || (isAdmin ? null : user.user_id),
    });
  }, [visible, klass, isAdmin, user.user_id]);

  const teacherList = useMemo(() => allTeachers(store), [store]);
  const canEdit = !editing || canEditClass(user, klass);

  const save = async () => {
    try {
      if (editing) {
        await ops.updateClass(klass.class_id, {
          level: form.level.trim(),
          monthly_fee: Number(form.monthlyFee) || 0,
          ...(isAdmin ? { teacher_id: form.teacherId } : null),
        });
      } else {
        if (!form.name.trim()) throw new Error('Magaca fasalka waa qasab.');
        await ops.addClass({
          name: form.name,
          level: form.level,
          monthlyFee: form.monthlyFee,
          teacherId: form.teacherId,
        });
      }
      onClose();
    } catch (e) {
      notify('Khalad', e.message);
    }
  };

  const remove = () => confirm({
    title: 'Tirtir fasalka',
    message: `${klass.name} iyo dhammaan ardaydiisa, xaadiriskiisa iyo lacagihiisa waa la tirtirayaa. Dib looma celin karo.`,
    confirmLabel: 'Haa, tirtir',
    destructive: true,
    onConfirm: async () => {
      try {
        await ops.deleteClass(klass.class_id);
        onClose();
      } catch (e) {
        notify('Khalad', e.message);
      }
    },
  });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.handle} />
            <Text style={styles.title}>{editing ? klass.name : 'Fasal cusub'}</Text>
            <Text style={styles.sub}>
              {editing
                ? 'Beddel heerka iyo lacagta bisha.'
                : isAdmin
                  ? 'Abuur fasal, kadibna macalin u qoondee.'
                  : 'Fasalka aad samayso adiga ayaa leh — adiga oo keliya ayaa arkaya.'}
            </Text>

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
              hint="Waa qiimaha caadiga ah ee arday walba. Mar walba waa la beddeli karaa."
              value={form.monthlyFee}
              onChangeText={(v) => setForm({ ...form, monthlyFee: v })}
              keyboardType="numeric"
            />

            {/* Macalinku cid kale fasal uma samayn karo — maamuluhu wuu karaa */}
            {isAdmin ? (
              <>
                <Text style={styles.fieldLabel}>Macalinka mas'uulka ah</Text>
                {teacherList.length === 0 ? (
                  <Text style={styles.warn}>
                    Weli macalin ma jiro. Fasalka abuur, kadibna macalin u casuun.
                  </Text>
                ) : (
                  <View style={{ gap: spacing.sm, marginBottom: spacing.md }}>
                    {teacherList.map((t) => {
                      const active = form.teacherId === t.user_id;
                      return (
                        <TouchableOpacity
                          key={t.user_id}
                          style={[styles.pickRow, active && styles.pickRowActive]}
                          onPress={() => setForm({ ...form, teacherId: active ? null : t.user_id })}
                          activeOpacity={0.85}
                        >
                          <Avatar name={t.full_name} photoUri={t.photo_uri} size={34} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.pickName}>{t.full_name}</Text>
                            <Text style={styles.pickMeta}>{t.subject || t.email}</Text>
                          </View>
                          <View style={[styles.check, active && styles.checkActive]}>
                            {active && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </>
            ) : (
              <View style={styles.ownerNote}>
                <Ionicons name="person-circle-outline" size={17} color={colors.primary} />
                <Text style={styles.ownerText}>
                  Fasalkan <Text style={styles.ownerStrong}>adiga</Text> ayaa leh.
                  Macalimiinta kale ma arkayaan.
                </Text>
              </View>
            )}

            {canEdit ? (
              <Button
                title={busy ? 'Sugaya…' : editing ? 'Kaydi beddelka' : 'Abuur fasalka'}
                onPress={save}
                disabled={busy}
              />
            ) : (
              <Text style={styles.warn}>Fasalkan wax kama beddeli kartid.</Text>
            )}

            {editing && canEdit && (
              <Button
                title="Tirtir fasalka"
                variant="danger"
                onPress={remove}
                style={{ marginTop: spacing.sm }}
              />
            )}

            <Button title="Jooji" variant="ghost" onPress={onClose} style={{ marginTop: spacing.sm }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(23,23,23,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl + 12,
    maxHeight: '90%',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: colors.line,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  title: { ...type.h5, color: colors.ink },
  sub: { ...type.b2, color: colors.muted, marginTop: 6, marginBottom: spacing.lg, lineHeight: 19 },
  fieldLabel: { ...type.b2Bold, color: colors.ink2, marginBottom: 8 },
  warn: {
    ...type.b2,
    color: colors.amber,
    backgroundColor: colors.amberSoft,
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  ownerNote: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.lg,
  },
  ownerText: { flex: 1, ...type.b2, color: colors.ink2, lineHeight: 18 },
  ownerStrong: { fontWeight: '800', color: colors.primary },
  pickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  pickRowActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  pickName: { ...type.b2Bold, color: colors.ink },
  pickMeta: { ...type.tag, fontWeight: '500', color: colors.muted, marginTop: 2 },
  check: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 1.5, borderColor: colors.line,
    alignItems: 'center', justifyContent: 'center',
  },
  checkActive: { backgroundColor: colors.primary, borderColor: colors.primary },
});
