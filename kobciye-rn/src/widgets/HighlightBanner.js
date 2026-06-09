import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Gradients, glass } from '../constants/colors';
import { Text as TextStyles } from '../constants/text';
import { Pressable } from 'react-native';

// Gradient call-out banner used to surface the single most important thing
// on a dashboard's overview page — celebration, risk alert, or an action.
export default function HighlightBanner({ title, message, icon, gradient = Gradients.brand, actionLabel, onAction }) {
  return (
    <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.banner}>
      {/* Decorative circles */}
      <View style={styles.decCircleTR} pointerEvents="none" />
      <View style={styles.decCircleBL} pointerEvents="none" />

      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={26} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        {actionLabel && (
          <Pressable onPress={onAction} style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.8 }]}>
            <Ionicons name="arrow-forward" size={14} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.actionLabel}>{actionLabel}</Text>
          </Pressable>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 24,
    padding: 24,
    gap: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  decCircleTR: {
    position: 'absolute',
    top: -28,
    right: -28,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  decCircleBL: {
    position: 'absolute',
    bottom: -36,
    left: 48,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: glass(0.2),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  title: { ...TextStyles.h2, color: '#fff', marginBottom: 6, fontWeight: '800' },
  message: { ...TextStyles.body, color: 'rgba(255,255,255,0.88)', lineHeight: 21 },
  actionBtn: {
    marginTop: 16,
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.55)',
    backgroundColor: glass(0.15),
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLabel: { fontSize: 13, fontWeight: '700', color: '#fff' },
});
