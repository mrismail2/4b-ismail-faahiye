import React from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { Text as TextStyles } from '../constants/text';
import { useLocalization } from '../context/LocalizationContext';

// Standard "Overview" page layout — title, responsive stat grid, and an
// optional highlight banner / secondary section.
export default function OverviewPage({ titleKey, stats, highlight, secondary }) {
  const { width } = useWindowDimensions();
  const { t } = useLocalization();
  const cols = width > 920 ? 4 : width > 620 ? 2 : 1;

  const rows = [];
  for (let i = 0; i < stats.length; i += cols) rows.push(stats.slice(i, i + cols));

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={TextStyles.h1}>{t(titleKey)}</Text>
      <View style={{ marginTop: 18 }}>
        {rows.map((row, ri) => (
          <View key={ri} style={styles.row}>
            {row.map((stat, ci) => (
              <View key={ci} style={{ flex: 1 }}>
                {stat}
              </View>
            ))}
            {row.length < cols &&
              Array.from({ length: cols - row.length }).map((_, ei) => <View key={`e${ei}`} style={{ flex: 1 }} />)}
          </View>
        ))}
      </View>
      {highlight && <View style={{ marginTop: 24 }}>{highlight}</View>}
      {secondary && <View style={{ marginTop: 24 }}>{secondary}</View>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 24 },
  row: { flexDirection: 'row', gap: 16, marginBottom: 16 },
});
