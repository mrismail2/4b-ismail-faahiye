import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useLocalization } from '../context/LocalizationContext';

// Bottom navigation bar shown on mobile/tablet — large touch targets,
// brand-colored selection indicator.
export default function AppBottomNav({ items, selectedIndex, onSelect }) {
  const { t } = useLocalization();

  return (
    <View style={styles.bar}>
      {items.map((item, i) => {
        const selected = i === selectedIndex;
        return (
          <Pressable key={item.key} onPress={() => onSelect(i)} style={styles.item}>
            <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
              <Ionicons name={selected ? item.activeIcon : item.icon} size={20} color={selected ? Colors.primary : Colors.muted} />
            </View>
            <Text style={[styles.label, selected && styles.labelSelected]} numberOfLines={1}>
              {t(item.key)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row', backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border,
    paddingTop: 8, paddingBottom: 12, paddingHorizontal: 6,
  },
  item: { flex: 1, alignItems: 'center' },
  iconWrap: { width: 44, height: 30, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  iconWrapSelected: { backgroundColor: `${Colors.primary}1A` },
  label: { fontSize: 10.5, fontWeight: '600', color: Colors.muted, marginTop: 3 },
  labelSelected: { color: Colors.primary, fontWeight: '700' },
});
