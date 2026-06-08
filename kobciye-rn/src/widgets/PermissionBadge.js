import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

// Small colored pill used to show a single granted permission
// (e.g. "attendance.mark", "exams.create") on staff/permission screens.
export default function PermissionBadge({ label, granted = true }) {
  const tint = granted ? Colors.success : Colors.muted;
  return (
    <View style={[styles.badge, { backgroundColor: `${tint}1A`, borderColor: `${tint}33` }]}>
      <Ionicons name={granted ? 'checkmark-circle' : 'close-circle'} size={13} color={tint} />
      <Text style={[styles.label, { color: tint }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  label: { fontSize: 11.5, fontWeight: '700' },
});
