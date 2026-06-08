import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from './AppCard';
import AppButton from './AppButton';
import { Colors } from '../constants/colors';
import { Text as TextStyles, Spacing } from '../constants/text';

const TEMPLATES = [
  {
    key: 'attendance', label: 'Attendance report', icon: 'checkbox-outline',
    preview: 'Asc waalid. Ilmahaaga {student_name} maanta wuxuu ahaa {attendance_status}.',
  },
  {
    key: 'exam', label: 'Exam report', icon: 'document-text-outline',
    preview: 'Imtixaanka {subject} ee {student_name} wuxuu keenay {marks}/{total} — fiican!',
  },
  {
    key: 'payment', label: 'Payment reminder', icon: 'card-outline',
    preview: 'Lacagta bishan ee {student_name} weli lama bixin. Fadlan booqo xafiiska dugsiga.',
  },
  {
    key: 'notice', label: 'General notice', icon: 'megaphone-outline',
    preview: 'Ogeysiis: Dugsigu wuxuu furmayaa berri saacadda 8:00 subaxnimo.',
  },
  {
    key: 'note', label: 'Teacher note', icon: 'create-outline',
    preview: '{teacher_name}: "Maanta {student_name} aad buu u caawiyay saaxiibadiis fasalka."',
  },
];

const CHANNELS = [
  { key: 'sms', label: 'SMS', icon: 'chatbox-ellipses-outline' },
  { key: 'whatsapp', label: 'WhatsApp', icon: 'logo-whatsapp' },
  { key: 'app', label: 'App notification', icon: 'notifications-outline' },
];

// Parent auto-report composer placeholder. Lets staff pick a template,
// preview the merged message, and choose delivery channels — all UI/
// workflow only, with clear notes that real SMS/WhatsApp wiring is later.
export default function ParentReportsSection({ canCompose = true }) {
  const [templateKey, setTemplateKey] = useState(TEMPLATES[0].key);
  const [channels, setChannels] = useState(['app']);
  const template = TEMPLATES.find((t) => t.key === templateKey);

  function toggleChannel(key) {
    setChannels((prev) => (prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]));
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
      <View style={{ gap: 4 }}>
        <Text style={TextStyles.h1}>Parent reports</Text>
        <Text style={TextStyles.bodyMuted}>Send automatic, friendly updates to families — in Somali or English, on the channel they check most.</Text>
      </View>

      {canCompose && (
        <AppCard style={{ gap: 16 }}>
          <Text style={TextStyles.h2}>1. Choose a template</Text>
          <View style={styles.templateGrid}>
            {TEMPLATES.map((t) => {
              const selected = t.key === templateKey;
              return (
                <Pressable key={t.key} onPress={() => setTemplateKey(t.key)} style={[styles.templateChip, selected && styles.templateChipActive]}>
                  <Ionicons name={t.icon} size={15} color={selected ? '#fff' : Colors.primary} />
                  <Text style={[styles.templateLabel, selected && { color: '#fff' }]}>{t.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={TextStyles.h2}>2. Preview & customize</Text>
          <View style={styles.previewBox}>
            <Text style={TextStyles.body}>{template.preview}</Text>
          </View>
          <Text style={[TextStyles.caption, { color: Colors.muted }]}>
            {'{student_name}'}, {'{attendance_status}'}, {'{subject}'}, {'{marks}'}, {'{total}'} and {'{teacher_name}'} are filled in automatically when a report is sent.
          </Text>

          <Text style={TextStyles.h2}>3. Choose delivery method</Text>
          <View style={styles.channelsRow}>
            {CHANNELS.map((c) => {
              const selected = channels.includes(c.key);
              return (
                <Pressable key={c.key} onPress={() => toggleChannel(c.key)} style={[styles.channelChip, selected && styles.channelChipActive]}>
                  <Ionicons name={c.icon} size={16} color={selected ? Colors.success : Colors.muted} />
                  <Text style={[styles.channelLabel, selected && { color: Colors.success }]}>{c.label}</Text>
                  {selected && <Ionicons name="checkmark-circle" size={15} color={Colors.success} />}
                </Pressable>
              );
            })}
          </View>

          <AppButton label="Send report (placeholder)" icon={<Ionicons name="paper-plane-outline" size={16} color="#fff" />} variant="primary" gradient={[Colors.primary, Colors.primaryLight]} fullWidth />
        </AppCard>
      )}

      <AppCard style={styles.placeholderNote}>
        <Ionicons name="construct-outline" size={16} color={Colors.muted} />
        <Text style={[TextStyles.caption, { color: Colors.muted, flex: 1 }]}>
          UI & workflow placeholder only — real SMS and WhatsApp delivery integrations are planned for a later phase. Sending here does not contact a real family yet.
        </Text>
      </AppCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.md, paddingBottom: Spacing.xl },
  templateGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  templateChip: { flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9 },
  templateChipActive: { backgroundColor: Colors.primary },
  templateLabel: { fontSize: 12.5, fontWeight: '700', color: Colors.primary },
  previewBox: { backgroundColor: Colors.background, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, padding: 16 },
  channelsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  channelChip: { flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  channelChipActive: { borderColor: Colors.success, backgroundColor: `${Colors.success}0D` },
  channelLabel: { fontSize: 12.5, fontWeight: '700', color: Colors.muted },
  placeholderNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
});
