import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Gradients, glass } from '../constants/colors';
import { Text as TextStyles } from '../constants/text';
import { Pressable } from 'react-native';

// Gradient call-out banner used to surface the single most important thing
// on a dashboard's overview page — celebration, risk alert, or an action.
export default function HighlightBanner({ title, message, icon, gradient = Gradients.brand, actionLabel }) {
  return (
    <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.banner}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={22} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        {actionLabel && (
          <Pressable style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.8 }]}>
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
    borderRadius: 20,
    padding: 20,
    gap: 14,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: glass(0.18),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  title: { ...TextStyles.h2, color: '#fff', marginBottom: 6 },
  message: { ...TextStyles.body, color: 'rgba(255,255,255,0.88)' },
  actionBtn: {
    marginTop: 14,
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: glass(0.12),
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  actionLabel: { fontSize: 13, fontWeight: '700', color: '#fff' },
});
