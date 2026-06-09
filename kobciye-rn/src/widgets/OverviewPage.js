import React from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { Text as TextStyles } from '../constants/text';
import { Colors } from '../constants/colors';
import { useLocalization } from '../context/LocalizationContext';

export default function OverviewPage({ titleKey, stats, highlight, secondary, quickActions }) {
  const { width } = useWindowDimensions();
  const { t } = useLocalization();
  const cols = width > 920 ? 4 : width > 580 ? 2 : 2;

  const rows = [];
  for (let i = 0; i < stats.length; i += cols) rows.push(stats.slice(i, i + cols));

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.titleRow}>
        <Text style={styles.pageTitle}>{t(titleKey)}</Text>
        <Text style={styles.dateChip}>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</Text>
      </View>

      {quickActions && <View style={styles.section}>{quickActions}</View>}

      <View style={styles.grid}>
        {rows.map((row, ri) => (
          <View key={ri} style={styles.row}>
            {row.map((stat, ci) => (
              <View key={ci} style={{ flex: 1 }}>{stat}</View>
            ))}
            {row.length < cols &&
              Array.from({ length: cols - row.length }).map((_, ei) => (
                <View key={`e${ei}`} style={{ flex: 1 }} />
              ))}
          </View>
        ))}
      </View>

      {highlight && <View style={styles.section}>{highlight}</View>}
      {secondary && <View style={styles.section}>{secondary}</View>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, paddingBottom: 32 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: Colors.text, letterSpacing: -0.5 },
  dateChip: {
    fontSize: 12, fontWeight: '700', color: Colors.primaryLight,
    backgroundColor: `${Colors.primaryLight}14`, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  grid: { gap: 12 },
  row: { flexDirection: 'row', gap: 12 },
  section: { marginTop: 20 },
});
