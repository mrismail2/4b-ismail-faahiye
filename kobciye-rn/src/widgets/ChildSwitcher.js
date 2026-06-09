import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';

const CHILDREN = [
  { id: 'yusuf', name: 'Yusuf', grade: 'Grade 5A', gradient: ['#1E4F96', '#2563EB'], initials: 'YU' },
  { id: 'hibo',  name: 'Hibo',  grade: 'Grade 3B', gradient: ['#7c3aed', '#6d28d9'], initials: 'HI' },
  { id: 'axmed', name: 'Axmed', grade: 'Grade 1C', gradient: ['#0891b2', '#0e7490'], initials: 'AX' },
];

export default function ChildSwitcher({ activeChild, onSwitch }) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>My Children</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {CHILDREN.map((child) => {
          const active = activeChild === child.id;
          return (
            <Pressable key={child.id} onPress={() => onSwitch(child.id)} style={styles.chipWrap}>
              <View style={[styles.avatarRing, active && styles.avatarRingActive]}>
                <LinearGradient colors={child.gradient} style={styles.avatar}>
                  <Text style={styles.initials}>{child.initials}</Text>
                </LinearGradient>
              </View>
              <Text style={[styles.name, active && styles.nameActive]}>{child.name}</Text>
              <Text style={styles.grade}>{child.grade}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 4 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  row: { gap: 16 },
  chipWrap: { alignItems: 'center', minWidth: 64 },
  avatarRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 3,
    backgroundColor: 'transparent',
    borderWidth: 2.5,
    borderColor: 'transparent',
    marginBottom: 6,
  },
  avatarRingActive: {
    borderColor: Colors.primaryLight,
  },
  avatar: {
    flex: 1,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { color: '#fff', fontWeight: '800', fontSize: 16 },
  name: { fontSize: 13, fontWeight: '700', color: Colors.muted, marginBottom: 2 },
  nameActive: { color: Colors.primary },
  grade: { fontSize: 11, color: Colors.mutedLight, fontWeight: '500' },
});
