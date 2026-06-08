import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { useLocalization } from '../context/LocalizationContext';
import { LANGUAGES } from '../constants/strings';

// Compact EN / SO segmented toggle.
export default function LanguageSwitcher({ light = false }) {
  const { language, setLanguage } = useLocalization();

  return (
    <View style={[styles.track, light && styles.trackLight]}>
      {[LANGUAGES.english, LANGUAGES.somali].map((lang) => {
        const active = language.code === lang.code;
        return (
          <Pressable
            key={lang.code}
            onPress={() => setLanguage(lang)}
            style={[
              styles.segment,
              active && (light ? styles.segmentActiveLight : styles.segmentActive),
            ]}
          >
            <Text
              style={[
                styles.label,
                light && { color: 'rgba(255,255,255,0.75)' },
                active && (light ? styles.labelActiveLight : styles.labelActive),
              ]}
            >
              {lang.code.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 999,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  trackLight: { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.25)' },
  segment: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 999 },
  segmentActive: { backgroundColor: Colors.primary },
  segmentActiveLight: { backgroundColor: 'rgba(255,255,255,0.92)' },
  label: { fontSize: 12, fontWeight: '700', color: Colors.muted },
  labelActive: { color: '#fff' },
  labelActiveLight: { color: Colors.primary },
});
