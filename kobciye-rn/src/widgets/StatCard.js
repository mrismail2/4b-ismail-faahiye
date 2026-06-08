import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from './AppCard';
import { Colors } from '../constants/colors';
import { Text as TextStyles } from '../constants/text';

// A single overview metric — icon, value, label and a small trend chip.
export default function StatCard({ label, value, icon, tint = Colors.primary, trend, trendUp = true }) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: `${tint}1F` }]}>
          <Ionicons name={icon} size={20} color={tint} />
        </View>
        {trend && (
          <View style={[styles.trendChip, { backgroundColor: trendUp ? `${Colors.success}1A` : `${Colors.danger}1A` }]}>
            <Text style={[styles.trendText, { color: trendUp ? Colors.success : Colors.danger }]}>{trend}</Text>
          </View>
        )}
      </View>
      <Text style={[TextStyles.statValue, styles.value]}>{value}</Text>
      <Text style={TextStyles.bodyMuted} numberOfLines={2}>
        {label}
      </Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 150 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconWrap: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  trendChip: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 },
  trendText: { fontSize: 11, fontWeight: '700' },
  value: { marginTop: 14, marginBottom: 2 },
});
