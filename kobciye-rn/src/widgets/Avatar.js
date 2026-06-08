import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors, Gradients } from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

// Shared circular avatar — shows a real photo when `uri` is provided,
// otherwise falls back to a soft gradient + initials so every student,
// teacher and staff card looks complete even before photos are uploaded.
export default function Avatar({ uri, name = '?', size = 48, gradient = Gradients.brand }) {
  const initials = getInitials(name);
  const dimension = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return <Image source={{ uri }} style={[styles.image, dimension]} />;
  }

  return (
    <LinearGradient colors={gradient} style={[styles.fallback, dimension]}>
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{initials}</Text>
    </LinearGradient>
  );
}

function getInitials(name) {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const styles = StyleSheet.create({
  image: { borderWidth: 1, borderColor: Colors.border },
  fallback: { alignItems: 'center', justifyContent: 'center' },
  initials: { color: '#fff', fontWeight: '700' },
});
