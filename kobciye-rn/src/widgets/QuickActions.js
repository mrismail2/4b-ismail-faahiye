import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function QuickActions({ actions = [] }) {
  if (!actions || actions.length === 0) return null;

  const handlePress = (label) => {
    Alert.alert('Coming soon', `"${label}" will be available in the next update.`);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.container}
    >
      {actions.map((action, i) => (
        <Pressable key={i} onPress={() => handlePress(action.label)} style={styles.chipWrap}>
          <LinearGradient
            colors={action.gradient}
            style={styles.chip}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name={action.icon} size={20} color="#fff" style={{ marginBottom: 6 }} />
            <Text style={styles.label}>{action.label}</Text>
          </LinearGradient>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 4 },
  row: { paddingHorizontal: 0, gap: 10 },
  chipWrap: { borderRadius: 16, overflow: 'hidden' },
  chip: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  label: { color: '#fff', fontWeight: '700', fontSize: 12.5, textAlign: 'center' },
});
