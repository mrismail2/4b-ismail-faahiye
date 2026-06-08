import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../constants/colors';
import { Text as TextStyles } from '../constants/text';

// Primary gradient call-to-action button. Set `variant="outline"` for a
// secondary bordered button, or `variant="ghost"` for a text-only button.
export default function AppButton({
  label,
  onPress,
  icon,
  variant = 'primary',
  gradient = Gradients.brand,
  loading = false,
  style,
  fullWidth = false,
}) {
  if (variant === 'outline') {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.outline,
          fullWidth && styles.fullWidth,
          pressed && styles.pressed,
          style,
        ]}
      >
        {icon}
        <Text style={[styles.outlineLabel, icon && { marginLeft: 8 }]}>{label}</Text>
      </Pressable>
    );
  }

  if (variant === 'ghost') {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.ghost, pressed && styles.pressed, style]}>
        {icon}
        <Text style={[styles.ghostLabel, icon && { marginLeft: 6 }]}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed, fullWidth && styles.fullWidth, style]}>
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.primary}>
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <>
            {icon}
            <Text style={[TextStyles.button, icon && { marginLeft: 8 }]}>{label}</Text>
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
  },
  outline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  outlineLabel: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  ghost: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 8 },
  ghostLabel: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  pressed: { opacity: 0.85 },
  fullWidth: { width: '100%' },
});
