/* ============================================================
   KAABE — Qaybaha UI-ga guud
   Kaararka, badhamada, calaamadaha iyo goobaha qorista.
   ============================================================ */
import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator,
  Image, Platform, Alert,
} from 'react-native';
import { colors, radius, spacing, shadow, avatarColor, initials } from '../theme/theme';

export function Card({ children, style, ...rest }) {
  return <View style={[styles.card, style]} {...rest}>{children}</View>;
}

export function SectionTitle({ children, right }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{children}</Text>
      {right}
    </View>
  );
}

export function Button({ title, onPress, variant = 'primary', disabled, style }) {
  const palette = {
    primary: { bg: colors.primary, fg: '#FFFFFF' },
    accent: { bg: colors.accent, fg: '#3A2A08' },
    ghost: { bg: colors.primarySoft, fg: colors.primary },
    danger: { bg: colors.redSoft, fg: colors.red },
    success: { bg: colors.green, fg: '#FFFFFF' },
  }[variant] || { bg: colors.primary, fg: '#FFFFFF' };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: palette.bg }, disabled && styles.buttonDisabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text style={[styles.buttonText, { color: palette.fg }]}>{title}</Text>
    </TouchableOpacity>
  );
}

export function Field({ label, hint, ...inputProps }) {
  return (
    <View style={styles.field}>
      {!!label && <Text style={styles.fieldLabel}>{label}</Text>}
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.muted}
        {...inputProps}
      />
      {!!hint && <Text style={styles.fieldHint}>{hint}</Text>}
    </View>
  );
}

export function Badge({ label, bg = colors.primarySoft, fg = colors.primary, style }) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.badgeText, { color: fg }]}>{label}</Text>
    </View>
  );
}

/* Sawirka haddii uu jiro; haddii kale xarfaha magaca oo midab leh */
export function Avatar({ name, photoUri, size = 42, ring }) {
  const bg = avatarColor(name || '');
  const frame = {
    width: size,
    height: size,
    borderRadius: size / 2,
    ...(ring ? { borderWidth: 2.5, borderColor: colors.surface } : null),
  };

  if (photoUri) {
    return <Image source={{ uri: photoUri }} style={[styles.avatar, frame]} resizeMode="cover" />;
  }

  return (
    <View style={[styles.avatar, frame, { backgroundColor: bg }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.38 }]}>{initials(name)}</Text>
    </View>
  );
}

/* Sawirka lagu beddelo: taabo → kamarad ama gallery */
export function PhotoPicker({ name, photoUri, size = 96, onPick, label = 'Sawir' }) {
  const choose = () => {
    if (Platform.OS === 'web') return onPick({ camera: false });
    Alert.alert(label, 'Halkee ka doonaysaa sawirka?', [
      { text: 'Kamarad', onPress: () => onPick({ camera: true }) },
      { text: 'Gallery', onPress: () => onPick({ camera: false }) },
      { text: 'Jooji', style: 'cancel' },
    ]);
  };

  return (
    <TouchableOpacity onPress={choose} activeOpacity={0.85} style={styles.photoPicker}>
      <Avatar name={name} photoUri={photoUri} size={size} />
      <View style={[styles.photoBadge, { left: size / 2 + 6 }]}>
        <Text style={styles.photoBadgeText}>{photoUri ? '↻' : '+'}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function Stat({ label, value, tone = 'primary' }) {
  const bg = {
    primary: colors.primarySoft,
    green: colors.greenSoft,
    amber: colors.amberSoft,
    red: colors.redSoft,
  }[tone] || colors.primarySoft;
  const fg = {
    primary: colors.primary,
    green: colors.green,
    amber: colors.amber,
    red: colors.red,
  }[tone] || colors.primary;

  return (
    <View style={[styles.stat, { backgroundColor: bg }]}>
      <Text style={[styles.statValue, { color: fg }]} numberOfLines={1}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{title}</Text>
      {!!text && <Text style={styles.emptyText}>{text}</Text>}
      {action}
    </View>
  );
}

export function Loading({ label = 'Sugaya…' }) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.loadingText}>{label}</Text>
    </View>
  );
}

/* Xulasho horizontal ah (tusaale: Ardayda | Xaadiris | Lacag) */
export function SegmentedControl({ options, value, onChange }) {
  return (
    <View style={styles.segment}>
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <TouchableOpacity
            key={opt.key}
            style={[styles.segmentItem, active && styles.segmentItemActive]}
            onPress={() => onChange(opt.key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow.card,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },
  button: {
    borderRadius: radius.sm,
    paddingVertical: 13,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontSize: 15, fontWeight: '700' },
  field: { marginBottom: spacing.md },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.ink2,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.ink,
  },
  fieldHint: { fontSize: 12, color: colors.muted, marginTop: 5 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 11, fontWeight: '700' },
  avatar: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.line },
  avatarText: { color: '#FFFFFF', fontWeight: '700' },
  photoPicker: { alignSelf: 'center' },
  photoBadge: {
    position: 'absolute',
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    borderWidth: 2.5,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoBadgeText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', lineHeight: 18 },
  stat: {
    flex: 1,
    /* 92 ayaa ka dhigaysa saddex Stat inay hal saf galaan, afarna ay
       laba-laba u kala baxaan — 45% wuxuu had iyo jeer laba ku qasbi jiray. */
    minWidth: 92,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 12, color: colors.ink2, marginTop: 3, textAlign: 'center' },
  empty: { alignItems: 'center', paddingVertical: 44, paddingHorizontal: spacing.lg },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 6,
    marginBottom: spacing.md,
    textAlign: 'center',
    lineHeight: 19,
  },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  loadingText: { color: colors.muted, fontSize: 13 },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: radius.sm - 3,
    alignItems: 'center',
  },
  segmentItemActive: { backgroundColor: colors.surface, ...shadow.card },
  segmentText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  segmentTextActive: { color: colors.ink },
});
