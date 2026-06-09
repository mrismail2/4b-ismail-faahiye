import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Text as TextStyles } from '../constants/text';

// Premium stat card — gradient icon, value, label, trend chip.
export default function StatCard({ label, value, icon, tint = Colors.primary, gradient, trend, trendUp = true }) {
  const gradColors = gradient ?? [`${tint}22`, `${tint}0A`];
  return (
    <LinearGradient colors={gradColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: `${tint}25` }]}>
          <Ionicons name={icon} size={20} color={tint} />
        </View>
        {trend && (
          <View style={[styles.trendChip, { backgroundColor: trendUp ? '#dcfce7' : '#fee2e2' }]}>
            <Ionicons name={trendUp ? 'trending-up' : 'trending-down'} size={11}
              color={trendUp ? '#16a34a' : Colors.danger} style={{ marginRight: 3 }} />
            <Text style={[styles.trendText, { color: trendUp ? '#16a34a' : Colors.danger }]}>{trend}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.value, { color: tint }]} numberOfLines={1}>{value}</Text>
      <Text style={styles.label} numberOfLines={2}>{label}</Text>
      <View style={[styles.bottomAccent, { backgroundColor: `${tint}30` }]} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1, minWidth: 150, borderRadius: 22, padding: 18, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  iconWrap: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  trendChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  trendText: { fontSize: 11, fontWeight: '700' },
  value: { fontSize: 28, fontWeight: '900', letterSpacing: -0.5, marginBottom: 4 },
  label: { fontSize: 12.5, color: Colors.muted, fontWeight: '500', lineHeight: 18 },
  bottomAccent: { position: 'absolute', right: -16, bottom: -16, width: 70, height: 70, borderRadius: 35 },
});
