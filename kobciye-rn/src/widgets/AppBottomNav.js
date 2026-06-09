import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients } from '../constants/colors';
import { useLocalization } from '../context/LocalizationContext';

// Premium bottom navigation bar — gradient pill for selected item,
// muted icons for unselected, safe-area padding for home indicator.
export default function AppBottomNav({ items, selectedIndex, onSelect }) {
  const { t } = useLocalization();

  return (
    <View style={styles.bar}>
      {items.map((item, i) => {
        const selected = i === selectedIndex;
        return (
          <Pressable key={item.key} onPress={() => onSelect(i)} style={styles.item}>
            {selected ? (
              <LinearGradient
                colors={Gradients.brand}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconWrapSelected}
              >
                <Ionicons name={item.activeIcon} size={19} color="#fff" />
              </LinearGradient>
            ) : (
              <View style={styles.iconWrap}>
                <Ionicons name={item.icon} size={19} color={Colors.mutedLight} />
              </View>
            )}
            <Text
              style={[styles.label, selected && styles.labelSelected]}
              numberOfLines={1}
            >
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
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1.5,
    borderTopColor: Colors.border,
    paddingTop: 10,
    paddingBottom: 24,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
  },
  item: { flex: 1, alignItems: 'center' },
  iconWrap: {
    width: 44,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapSelected: {
    width: 56,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 10.5, fontWeight: '600', color: Colors.mutedLight, marginTop: 4 },
  labelSelected: { color: Colors.primary, fontWeight: '700' },
});
