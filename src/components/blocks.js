/* ============================================================
   KAABE — Qaybaha waaweyn ee shaashadaha lagu dhiso

   Kuwani waa naqshadda: salaan + taariikh, "Maanta guudmarkeeda",
   badhamada dhaqsaha ah (Quick Access), safafka tirakoobka, iyo
   kaararka darajada.
   ============================================================ */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from './ui';
import { colors, radius, spacing, shadow } from '../theme/theme';

/* ---------- Salaanta iyo taariikhda ---------- */

const DAYS = ['Axad', 'Isniin', 'Talaado', 'Arbaco', 'Khamiis', 'Jimco', 'Sabti'];
const MONTHS = [
  'Janaayo', 'Febraayo', 'Maarso', 'Abriil', 'Maajo', 'Juun',
  'Luulyo', 'Agoosto', 'Sebtembar', 'Oktoobar', 'Nofembar', 'Desembar',
];

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return 'Subax wanaagsan';
  if (h < 18) return 'Galab wanaagsan';
  return 'Habeen wanaagsan';
}

export function longDate(date = new Date()) {
  return `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function GreetingHeader({ name, subtitle, photoUri, onPressAvatar }) {
  const first = String(name || '').trim().split(/\s+/)[0];
  return (
    <View style={styles.greetRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.greetHello}>{greeting()}, {first}!</Text>
        <Text style={styles.greetDate}>{subtitle || longDate()}</Text>
      </View>
      <TouchableOpacity onPress={onPressAvatar} activeOpacity={0.85} disabled={!onPressAvatar}>
        <Avatar name={name} photoUri={photoUri} size={44} />
      </TouchableOpacity>
    </View>
  );
}

/* ---------- Kaarka macluumaadka (icon + qoraal) ---------- */

const TONES = {
  blue: { bg: colors.primarySoft, fg: colors.primary },
  green: { bg: colors.greenSoft, fg: colors.green },
  amber: { bg: colors.amberSoft, fg: colors.amber },
  red: { bg: colors.redSoft, fg: colors.red },
  grey: { bg: colors.line, fg: colors.ink2 },
};

export function InfoCard({ icon, title, subtitle, tone = 'blue', onPress, right }) {
  const t = TONES[tone] || TONES.blue;
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      style={[styles.infoCard, { backgroundColor: t.bg }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.infoIcon, { backgroundColor: colors.surface }]}>
        <Ionicons name={icon} size={18} color={t.fg} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.infoSub}>{subtitle}</Text>}
      </View>
      {right}
    </Wrapper>
  );
}

/* ---------- Quick Access: badhamo midab leh ---------- */

const ACTION_COLORS = {
  blue: colors.primary,
  green: colors.green,
  red: colors.red,
  amber: colors.amber,
  slate: colors.ink2,
};

export function QuickAccess({ actions }) {
  return (
    <View style={styles.quickGrid}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.key}
          style={[styles.quickTile, { backgroundColor: ACTION_COLORS[action.tone] || colors.primary }]}
          onPress={action.onPress}
          activeOpacity={0.88}
        >
          <Ionicons name={action.icon} size={22} color="#FFFFFF" />
          <Text style={styles.quickLabel}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

/* ---------- Safka tirakoobka (Analytics Panel) ---------- */

export function MetricRow({ icon, label, value, percent, tone = 'blue', last }) {
  const t = TONES[tone] || TONES.blue;
  return (
    <View style={[styles.metricRow, last && { borderBottomWidth: 0 }]}>
      <View style={[styles.metricIcon, { backgroundColor: t.bg }]}>
        <Ionicons name={icon} size={15} color={t.fg} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.metricLabel}>{label}</Text>
        {percent != null && (
          <View style={styles.metricTrack}>
            <View
              style={[
                styles.metricFill,
                { width: `${Math.max(0, Math.min(100, percent))}%`, backgroundColor: t.fg },
              ]}
            />
          </View>
        )}
      </View>
      <Text style={[styles.metricValue, { color: t.fg }]}>{value}</Text>
    </View>
  );
}

/* ---------- Kaarka darajada (Top performers) ---------- */

export function RankCard({ rank, name, photoUri, meta, score, tone = 'blue', onPress }) {
  const t = TONES[tone] || TONES.blue;
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper style={styles.rankCard} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.rankBadge, { backgroundColor: t.bg }]}>
        <Text style={[styles.rankNumber, { color: t.fg }]}>{rank}</Text>
      </View>
      <Avatar name={name} photoUri={photoUri} size={40} />
      <View style={{ flex: 1 }}>
        <Text style={styles.rankName} numberOfLines={1}>{name}</Text>
        {!!meta && <Text style={styles.rankMeta} numberOfLines={1}>{meta}</Text>}
      </View>
      <View style={[styles.scorePill, { backgroundColor: t.fg }]}>
        <Text style={styles.scoreText}>{score}</Text>
      </View>
    </Wrapper>
  );
}

/* ---------- Kaarka madaxa ee midab buuxa (Hero) ---------- */

export function HeroCard({ title, subtitle, items, tone = 'primary' }) {
  const bg = tone === 'green' ? colors.green : colors.primary;
  return (
    <View style={[styles.hero, { backgroundColor: bg }]}>
      <Text style={styles.heroTitle}>{title}</Text>
      {!!subtitle && <Text style={styles.heroSub}>{subtitle}</Text>}
      <View style={styles.heroGrid}>
        {items.map((item) => (
          <View key={item.label} style={styles.heroCell}>
            <Text style={styles.heroValue}>{item.value}</Text>
            <Text style={styles.heroLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  greetRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  greetHello: { fontSize: 21, fontWeight: '800', color: colors.ink },
  greetDate: { fontSize: 12.5, color: colors.muted, marginTop: 3 },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  infoIcon: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
  },
  infoTitle: { fontSize: 14, fontWeight: '700', color: colors.ink },
  infoSub: { fontSize: 12, color: colors.ink2, marginTop: 2 },

  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  quickTile: {
    flex: 1,
    minWidth: '45%',
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    ...shadow.card,
  },
  quickLabel: { color: '#FFFFFF', fontSize: 13.5, fontWeight: '700' },

  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  metricIcon: {
    width: 30, height: 30, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },
  metricLabel: { fontSize: 13, color: colors.ink2, fontWeight: '600' },
  metricTrack: {
    height: 5,
    backgroundColor: colors.line,
    borderRadius: 3,
    marginTop: 6,
    overflow: 'hidden',
  },
  metricFill: { height: '100%', borderRadius: 3 },
  metricValue: { fontSize: 14, fontWeight: '800' },

  rankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow.card,
  },
  rankBadge: {
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
  rankNumber: { fontSize: 12, fontWeight: '800' },
  rankName: { fontSize: 14.5, fontWeight: '700', color: colors.ink },
  rankMeta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  scorePill: { paddingHorizontal: 11, paddingVertical: 5, borderRadius: 999 },
  scoreText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },

  hero: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  heroTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  heroSub: { fontSize: 12.5, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  heroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  heroCell: { flex: 1, minWidth: 76 },
  heroValue: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  heroLabel: { fontSize: 11.5, color: 'rgba(255,255,255,0.78)', marginTop: 2 },
});
