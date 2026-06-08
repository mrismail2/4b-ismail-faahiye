import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text as TextStyles } from '../constants/text';
import { useLocalization } from '../context/LocalizationContext';

// Clean "coming in a later phase" empty-state panel for nav sections that
// don't have real content yet.
export default function SectionPlaceholder({ titleKey, icon, gradient }) {
  const { t } = useLocalization();
  return (
    <View style={styles.center}>
      <LinearGradient colors={gradient} style={styles.iconWrap}>
        <Ionicons name={icon} size={36} color="#fff" />
      </LinearGradient>
      <Text style={[TextStyles.h1, { marginTop: 22, marginBottom: 8 }]}>{t(titleKey)}</Text>
      <Text style={TextStyles.bodyMuted}>{t('comingSoon')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  iconWrap: { width: 88, height: 88, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
});
