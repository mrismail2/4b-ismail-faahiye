import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../constants/colors';
import { Text as TextStyles } from '../constants/text';

// Premium button widget.
// variant: 'primary' | 'outline' | 'ghost'
// size: 'sm' | 'md' | 'lg'  (default 'md')
// gradient: override the LinearGradient colors for primary
export default function AppButton({
  label,
  onPress,
  icon,
  variant = 'primary',
  gradient = Gradients.brand,
  loading = false,
  style,
  fullWidth = false,
  size = 'md',
}) {
  const sizeStyle = SIZE_STYLES[size] || SIZE_STYLES.md;

  if (variant === 'outline') {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.outline,
          sizeStyle.outline,
          fullWidth && styles.fullWidth,
          pressed && styles.pressed,
          style,
        ]}
      >
        {icon}
        <Text style={[styles.outlineLabel, sizeStyle.label, icon && { marginLeft: 8 }]}>{label}</Text>
      </Pressable>
    );
  }

  if (variant === 'ghost') {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.ghost, sizeStyle.ghost, pressed && styles.pressed, style]}>
        {icon}
        <Text style={[styles.ghostLabel, sizeStyle.label, icon && { marginLeft: 6 }]}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed, fullWidth && styles.fullWidth, style]}>
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.primary, sizeStyle.primary]}>
        {/* Shimmer-like top highlight */}
        <View style={styles.shimmer} pointerEvents="none" />
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <>
            {icon}
            <Text style={[TextStyles.button, sizeStyle.label, icon && { marginLeft: 8 }]}>{label}</Text>
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const SIZE_STYLES = {
  sm: {
    primary: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
    outline: { paddingVertical: 9, paddingHorizontal: 16, borderRadius: 12 },
    ghost: { paddingVertical: 8, paddingHorizontal: 8 },
    label: { fontSize: 13 },
  },
  md: {
    primary: { paddingVertical: 15, paddingHorizontal: 22, borderRadius: 16 },
    outline: { paddingVertical: 14, paddingHorizontal: 22, borderRadius: 16 },
    ghost: { paddingVertical: 10, paddingHorizontal: 8 },
    label: { fontSize: 15 },
  },
  lg: {
    primary: { paddingVertical: 18, paddingHorizontal: 32, borderRadius: 18 },
    outline: { paddingVertical: 17, paddingHorizontal: 32, borderRadius: 18 },
    ghost: { paddingVertical: 13, paddingHorizontal: 12 },
    label: { fontSize: 17 },
  },
};

const styles = StyleSheet.create({
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  outline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  outlineLabel: { fontWeight: '700', color: Colors.primary },
  ghost: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  ghostLabel: { fontWeight: '700', color: Colors.primary },
  pressed: { opacity: 0.82 },
  fullWidth: { width: '100%' },
});
