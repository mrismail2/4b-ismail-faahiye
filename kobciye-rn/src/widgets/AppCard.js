import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Shadows } from '../constants/text';

// Premium card widget with multiple variants.
// variant="default"  — white bg, subtle border + shadow
// variant="elevated" — stronger shadow, no border
// variant="glass"    — frosted glass look with light blue tint
// noPadding          — remove default padding (e.g. for image headers)
export default function AppCard({ children, style, padded = true, noPadding = false, variant = 'default' }) {
  const variantStyle =
    variant === 'elevated'
      ? styles.cardElevated
      : variant === 'glass'
      ? styles.cardGlass
      : styles.card;

  return (
    <View style={[variantStyle, !noPadding && padded && styles.padded, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cardElevated: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    shadowColor: Colors.primary,
    shadowOpacity: 0.13,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 16 },
    elevation: 8,
  },
  cardGlass: {
    backgroundColor: 'rgba(238,242,255,0.72)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: Colors.primary,
    shadowOpacity: 0.07,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  padded: { padding: 20 },
});
