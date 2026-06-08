import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from './AppCard';
import Avatar from './Avatar';
import { Colors, Gradients } from '../constants/colors';
import { Text as TextStyles } from '../constants/text';

// Compact teacher / class-teacher / form-master card — shown on student
// and parent dashboards. `contactVisible` mirrors a school's "allow
// teacher contact" permission placeholder; phone/email stay hidden by
// default so privacy rules can be enforced for real once Phase 2 lands.
export default function TeacherProfileCard({
  name,
  subject,
  responsibility,
  className,
  photoUri,
  phone,
  email,
  contactVisible = false,
  onMessage,
}) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.row}>
        <Avatar uri={photoUri} name={name} size={52} gradient={Gradients.brand} />
        <View style={{ flex: 1 }}>
          <Text style={TextStyles.h2}>{name}</Text>
          {!!subject && <Text style={TextStyles.bodyMuted}>{subject}</Text>}
          {!!responsibility && (
            <View style={styles.chip}>
              <Ionicons name="ribbon-outline" size={12} color={Colors.primary} />
              <Text style={styles.chipText}>{responsibility}</Text>
            </View>
          )}
        </View>
      </View>

      {!!className && (
        <View style={styles.metaRow}>
          <Ionicons name="easel-outline" size={15} color={Colors.muted} />
          <Text style={TextStyles.bodyMuted}>{className}</Text>
        </View>
      )}

      {contactVisible ? (
        <View style={styles.metaRow}>
          <Ionicons name="call-outline" size={15} color={Colors.muted} />
          <Text style={TextStyles.bodyMuted}>{phone || 'Phone available on request'}</Text>
        </View>
      ) : (
        <View style={styles.metaRow}>
          <Ionicons name="lock-closed-outline" size={14} color={Colors.muted} />
          <Text style={[TextStyles.caption, { color: Colors.muted }]}>
            Direct contact details are hidden — message through Kobciye instead.
          </Text>
        </View>
      )}

      <Pressable onPress={onMessage} style={({ pressed }) => [styles.messageBtn, pressed && { opacity: 0.85 }]}>
        <Ionicons name="chatbubble-ellipses-outline" size={16} color={Colors.primary} />
        <Text style={styles.messageLabel}>Message teacher</Text>
      </Pressable>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chip: {
    marginTop: 6,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: `${Colors.primary}12`,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  chipText: { fontSize: 11, fontWeight: '700', color: Colors.primary },
  messageBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  messageLabel: { fontSize: 13, fontWeight: '700', color: Colors.primary },
});
