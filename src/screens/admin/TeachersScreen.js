/* ============================================================
   KAABE — Macalimiinta (maamulaha guud oo keliya)

   Macalinku ISKIIS akoon ma abuuri karo. Maamuluhu casuumaad buu
   sameeyaa (koodh), macalinkuna koodhkaas ayuu ku soo galaa. Doorka
   iyo iskuulka casuumaadda ayay ka yimaadaan.
   ============================================================ */
import React, { useMemo, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Share, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import {
  teachers as allTeachers, getClassById, studentsByClass,
  listInvites, inviteState, INVITE_STATE_LABEL, classFeeSummary, currentMonth,
} from '../../services/model';
import {
  Card, Button, Field, Badge, Avatar, EmptyState, SectionTitle, SegmentedControl,
} from '../../components/ui';
import { confirm, notify } from '../../utils/dialog';
import { colors, radius, spacing } from '../../theme/theme';

const TABS = [
  { key: 'teachers', label: 'Macalimiinta' },
  { key: 'invites', label: 'Casuumaadaha' },
];

export default function TeachersScreen({ navigation }) {
  const { store, ops, busy } = useApp();
  const [tab, setTab] = useState('teachers');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.head}>
        <Text style={styles.title}>Macalimiinta</Text>
        <Text style={styles.sub}>
          Macalinku koodh casuumaad ayuu ku soo galaa — iskiis akoon ma abuuro.
        </Text>
        <View style={{ marginTop: spacing.md }}>
          <SegmentedControl options={TABS} value={tab} onChange={setTab} />
        </View>
      </View>

      {tab === 'teachers'
        ? <TeacherList store={store} ops={ops} navigation={navigation} />
        : <InviteList store={store} ops={ops} busy={busy} />}
    </SafeAreaView>
  );
}

/* ============================================================
   Liiska macalimiinta
   ============================================================ */
function TeacherList({ store, ops, navigation }) {
  const [target, setTarget] = useState(null);
  const teacherList = useMemo(() => allTeachers(store), [store]);
  const month = currentMonth();

  const toggleClass = async (teacher, classId) => {
    const klass = getClassById(store, classId);
    const mine = klass?.teacher_id === teacher.user_id;
    try {
      await ops.assignTeacher(classId, mine ? null : teacher.user_id);
    } catch (e) {
      notify('Khalad', e.message);
    }
  };

  if (teacherList.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.scroll}>
        <EmptyState
          title="Weli macalin ma jiro"
          text="U casuun macalin qaybta 'Casuumaadaha' — koodh ayuu ku soo geli doonaa."
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={{ gap: spacing.sm }}>
        {teacherList.map((teacher) => {
          const mine = (teacher.assigned_class_ids || [])
            .map((id) => getClassById(store, id))
            .filter(Boolean);
          const students = mine.reduce(
            (sum, k) => sum + studentsByClass(store, k.class_id).length, 0);
          const balance = mine.reduce(
            (sum, k) => sum + classFeeSummary(store, k.class_id, month).balance, 0);

          return (
            <Card key={teacher.user_id}>
              <View style={styles.row}>
                <Avatar name={teacher.full_name} photoUri={teacher.photo_uri} size={46} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{teacher.full_name}</Text>
                  <Text style={styles.meta}>
                    {teacher.subject || 'Maado lama qorin'}
                    {teacher.phone ? ` · ${teacher.phone}` : ''}
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

              <View style={styles.statsRow}>
                <MiniStat icon="people-outline" label="Arday" value={String(students)} />
                <MiniStat
                  icon="cash-outline"
                  label="Hadhay"
                  value={`${store.school.currency}${balance.toFixed(0)}`}
                  tone={balance > 0 ? colors.red : colors.green}
                />
              </View>

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

      <Modal visible={!!target} transparent animationType="slide" onRequestClose={() => setTarget(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {!!target && (
              <ScrollView>
                <Text style={styles.modalTitle}>{target.full_name}</Text>
                <Text style={styles.modalSub}>
                  Dooro fasalada uu maamulayo. Fasal kastaa hal macalin ayuu leeyahay.
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
                            {mine && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
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
    </ScrollView>
  );
}

/* ============================================================
   Casuumaadaha
   ============================================================ */
function InviteList({ store, ops, busy }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', classIds: [] });
  const [created, setCreated] = useState(null);

  const invites = useMemo(() => listInvites(store), [store]);

  const openNew = () => {
    setForm({ fullName: '', email: '', classIds: [] });
    setCreated(null);
    setOpen(true);
  };

  const toggleClass = (classId) => {
    setForm((prev) => ({
      ...prev,
      classIds: prev.classIds.includes(classId)
        ? prev.classIds.filter((id) => id !== classId)
        : [...prev.classIds, classId],
    }));
  };

  const submit = async () => {
    try {
      const next = await ops.createInvite(form);
      /* koodhka cusub waa kan ugu dambeeyay ee la abuuray */
      const fresh = listInvites(next)[0];
      setCreated(fresh);
    } catch (e) {
      notify('Khalad', e.message);
    }
  };

  const shareCode = async (invite) => {
    const message = `Ku soo biir KAABE.\n\nMagac: ${invite.full_name}\nEmail: ${invite.email}\nKoodhka: ${invite.code}\n\nApp-ka fur → "Koodh casuumaad" → geli koodhka.`;
    try {
      if (Platform.OS === 'web') {
        notify('Koodhka casuumaadda', message);
      } else {
        await Share.share({ message });
      }
    } catch (e) {
      // qofku wuu joojiyay
    }
  };

  const confirmRevoke = (invite) => confirm({
    title: 'Jooji casuumaadda',
    message: `Koodhka ${invite.code} kadib lama isticmaali karo. Ma hubtaa?`,
    confirmLabel: 'Haa, jooji',
    destructive: true,
    onConfirm: async () => {
      try {
        await ops.revokeInvite(invite.invite_id);
      } catch (e) {
        notify('Khalad', e.message);
      }
    },
  });

  const TONE = {
    pending: { bg: colors.amberSoft, fg: colors.amber },
    accepted: { bg: colors.greenSoft, fg: colors.green },
    revoked: { bg: colors.line, fg: colors.muted },
    expired: { bg: colors.redSoft, fg: colors.red },
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Button title="+ Casuun macalin" onPress={openNew} />

      {invites.length === 0 ? (
        <EmptyState
          title="Weli casuumaad ma jiro"
          text="Samee casuumaad, kadibna koodhka macalinka u dir. Isagu ma dooran karo doorkiisa — adigaa go'aamiya."
        />
      ) : (
        <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
          {invites.map((invite) => {
            const state = inviteState(invite);
            const tone = TONE[state];
            const classNames = (invite.class_ids || [])
              .map((id) => getClassById(store, id)?.name)
              .filter(Boolean);

            return (
              <Card key={invite.invite_id}>
                <View style={styles.row}>
                  <View style={[styles.codeBox, { backgroundColor: tone.bg }]}>
                    <Ionicons name="key-outline" size={16} color={tone.fg} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{invite.full_name}</Text>
                    <Text style={styles.meta}>{invite.email}</Text>
                  </View>
                  <Badge label={INVITE_STATE_LABEL[state]} bg={tone.bg} fg={tone.fg} />
                </View>

                <View style={styles.codeRow}>
                  <Text style={styles.codeLabel}>Koodhka</Text>
                  <Text style={[styles.code, state !== 'pending' && styles.codeOff]}>
                    {invite.code}
                  </Text>
                </View>

                {classNames.length > 0 && (
                  <View style={styles.chipRow}>
                    {classNames.map((n) => (
                      <View key={n} style={styles.chip}><Text style={styles.chipText}>{n}</Text></View>
                    ))}
                  </View>
                )}

                {state === 'pending' && (
                  <View style={styles.inviteActions}>
                    <Button
                      title="U dir"
                      variant="ghost"
                      onPress={() => shareCode(invite)}
                      style={{ flex: 1 }}
                    />
                    <Button
                      title="Jooji"
                      variant="danger"
                      onPress={() => confirmRevoke(invite)}
                      style={{ flex: 1 }}
                    />
                  </View>
                )}
              </Card>
            );
          })}
        </View>
      )}

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <ScrollView keyboardShouldPersistTaps="handled">
              {created ? (
                <View style={styles.successBox}>
                  <View style={styles.successIcon}>
                    <Ionicons name="checkmark" size={26} color="#FFFFFF" />
                  </View>
                  <Text style={styles.modalTitle}>Casuumaaddu waa diyaar</Text>
                  <Text style={styles.modalSub}>
                    Koodhkan {created.full_name} u dir. Wuxuu shaqaynayaa 14 maalmood.
                  </Text>

                  <View style={styles.bigCode}>
                    <Text style={styles.bigCodeText}>{created.code}</Text>
                  </View>

                  <Text style={styles.successNote}>
                    Emailka {created.email} ayuu ku soo gali doonaa — koodhku qof kale uma shaqeeyo.
                  </Text>

                  <Button title="U dir" onPress={() => shareCode(created)} />
                  <Button
                    title="Diyaar"
                    variant="ghost"
                    onPress={() => setOpen(false)}
                    style={{ marginTop: spacing.sm }}
                  />
                </View>
              ) : (
                <>
                  <Text style={styles.modalTitle}>Casuun macalin</Text>
                  <Text style={styles.modalSub}>
                    Koodh ayaa la abuurayaa. Macalinku emailkan ayuu ku isticmaali karaa,
                    doorkiisuna waa "Macalin" — isagu ma dooran karo.
                  </Text>

                  <Field
                    label="Magaca macalinka"
                    placeholder="Tusaale: Xaliimo Cali"
                    value={form.fullName}
                    onChangeText={(v) => setForm({ ...form, fullName: v })}
                  />
                  <Field
                    label="Emailka macalinka"
                    placeholder="magac@tusaale.so"
                    value={form.email}
                    onChangeText={(v) => setForm({ ...form, email: v })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  <Text style={styles.fieldLabel}>Fasalada la siinayo (ikhtiyaari)</Text>
                  {(store.classes || []).length === 0 ? (
                    <Text style={styles.warn}>
                      Weli fasal lama abuurin. Waad casuumi kartaa, kadibna fasal u qoondee.
                    </Text>
                  ) : (
                    <View style={{ gap: spacing.sm, marginBottom: spacing.md }}>
                      {store.classes.map((klass) => {
                        const picked = form.classIds.includes(klass.class_id);
                        const owner = (store.users || []).find((u) => u.user_id === klass.teacher_id);
                        return (
                          <TouchableOpacity
                            key={klass.class_id}
                            style={[styles.classRow, picked && styles.classRowActive]}
                            onPress={() => toggleClass(klass.class_id)}
                            activeOpacity={0.85}
                          >
                            <View style={{ flex: 1 }}>
                              <Text style={styles.className}>{klass.name}</Text>
                              <Text style={styles.classMeta}>
                                {owner ? `Hadda: ${owner.full_name}` : 'Bannaan'}
                              </Text>
                            </View>
                            <View style={[styles.check, picked && styles.checkActive]}>
                              {picked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}

                  <Button
                    title={busy ? 'Sugaya…' : 'Samee casuumaadda'}
                    onPress={submit}
                    disabled={busy}
                  />
                  <Button
                    title="Jooji"
                    variant="ghost"
                    onPress={() => setOpen(false)}
                    style={{ marginTop: spacing.sm }}
                  />
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function MiniStat({ icon, label, value, tone = colors.ink }) {
  return (
    <View style={styles.miniStat}>
      <Ionicons name={icon} size={14} color={colors.muted} />
      <Text style={styles.miniLabel}>{label}</Text>
      <Text style={[styles.miniValue, { color: tone }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  head: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: { fontSize: 22, fontWeight: '800', color: colors.ink },
  sub: { fontSize: 12.5, color: colors.muted, marginTop: 4, lineHeight: 18 },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  name: { fontSize: 15.5, fontWeight: '700', color: colors.ink },
  meta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.md },
  chip: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  chipText: { fontSize: 12, fontWeight: '600', color: colors.primary },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: spacing.sm,
  },
  miniStat: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  miniLabel: { fontSize: 11.5, color: colors.muted },
  miniValue: { fontSize: 13, fontWeight: '700' },
  codeBox: {
    width: 40, height: 40, borderRadius: radius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: spacing.sm,
  },
  codeLabel: { fontSize: 12, color: colors.muted },
  code: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: 2,
  },
  codeOff: { color: colors.muted, textDecorationLine: 'line-through' },
  inviteActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: colors.ink2, marginBottom: 8 },
  warn: {
    fontSize: 12.5,
    color: colors.amber,
    backgroundColor: colors.amberSoft,
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(16,26,40,0.45)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl + 12,
    maxHeight: '88%',
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.ink },
  modalSub: { fontSize: 13, color: colors.muted, marginTop: 6, marginBottom: spacing.lg, lineHeight: 19 },
  successBox: { alignItems: 'stretch' },
  successIcon: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.green,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  bigCode: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  bigCodeText: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 4,
  },
  successNote: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
});
