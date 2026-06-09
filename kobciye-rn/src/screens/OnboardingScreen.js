import React from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients, glass } from '../constants/colors';
import { Text as TextStyles, Spacing } from '../constants/text';
import AppLogo from '../widgets/AppLogo';
import AppButton from '../widgets/AppButton';
import LanguageSwitcher from '../widgets/LanguageSwitcher';
import { useLocalization } from '../context/LocalizationContext';
import { showRegisterSchoolSheet } from '../widgets/RegisterSchoolSheet';

const CAPABILITIES = [
  { icon: 'people', tint: Colors.primaryLight, title: 'Manage students', body: "Keep every student's record, class and family details organized in one place." },
  { icon: 'home', tint: Colors.success, title: 'Connect with parents', body: 'Reach parents instantly with updates they can read in Somali or English.' },
  { icon: 'checkbox', tint: Colors.accent, title: 'Track attendance', body: 'Mark attendance in seconds — even offline — with automatic sync.' },
  { icon: 'card', tint: Colors.primary, title: 'Manage payments', body: 'Stay on top of fees, mobile-money and promises without the spreadsheets.' },
  { icon: 'trending-up', tint: Colors.primaryLight, title: 'Monitor student progress', body: 'Watch attendance, exams and behaviour trends as they happen.' },
  { icon: 'analytics', tint: Colors.danger, title: 'Detect student risk early', body: 'Get a clear, explainable signal before a small issue becomes a crisis.' },
  { icon: 'document-text', tint: Colors.primary, title: 'Run exams with confidence', body: 'Record marks, grades and ranks — students and parents see results the moment they’re published.' },
  { icon: 'book', tint: Colors.success, title: 'Plan & approve lessons', body: 'Teachers submit lesson prep, school admins review and approve — all in one place.' },
];

const PLANS = [
  {
    name: 'Small school', price: '$10', capacity: 'Up to 100 students',
    description: 'Perfect for small schools and community schools just getting started — every core tool included, with room to grow.',
    tint: Colors.primaryLight, highlighted: false,
  },
  {
    name: 'Medium school', price: '$20', capacity: 'Up to 500 students',
    description: 'Built for growing schools that need more classes, more staff accounts and deeper attendance & payment insight — our most popular plan.',
    tint: Colors.accent, highlighted: true,
  },
  {
    name: 'Large school', price: '$50', capacity: 'Unlimited students',
    description: 'For large institutions and school groups — unlimited students and staff, priority support, and every Kobciye module as it ships.',
    tint: Colors.success, highlighted: false,
  },
];

const FUTURE_FEATURES = [
  { icon: 'analytics', tint: Colors.danger, title: 'Student Risk Score', body: 'Explainable Low/Medium/High signals built from attendance, fees and exam trends.' },
  { icon: 'language', tint: Colors.primaryLight, title: 'Parent Somali Report', body: 'Weekly family updates written automatically in Somali and English.' },
  { icon: 'phone-portrait', tint: Colors.success, title: 'Mobile Money Matching', body: 'Incoming mobile-money payments matched to the right student automatically.' },
  { icon: 'people-circle', tint: Colors.accent, title: 'Fee Promise System', body: 'Track and follow up on payment promises without awkward conversations.' },
  { icon: 'cloud-offline', tint: Colors.primary, title: 'Offline Attendance', body: "Mark attendance with no signal — records sync the moment you're back online." },
  { icon: 'chatbubble-ellipses', tint: Colors.success, title: 'School-Monitored Messaging', body: 'Safe, school-supervised chat between staff and families — no outside numbers needed.' },
  { icon: 'time', tint: Colors.primaryLight, title: 'Parent Trust Timeline', body: "A friendly day-by-day story of each child's school life that builds trust." },
  { icon: 'bar-chart', tint: Colors.accent, title: 'Teacher Workload Dashboard', body: 'A clear view of class load and pending tasks so no teacher is overwhelmed.' },
];

export default function OnboardingScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isDesktop = width > 920;
  const { t } = useLocalization();

  const colsFor = (breakpoints) => {
    for (const [min, cols] of breakpoints) if (width > min) return cols;
    return breakpoints[breakpoints.length - 1][1];
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ flexGrow: 1 }}>
      <Hero isDesktop={isDesktop} navigation={navigation} t={t} />

      <View style={[styles.section, { paddingVertical: isDesktop ? 64 : 40 }]}>
        <Text style={[TextStyles.h1, styles.center]}>Everything your school needs to grow</Text>
        <Text style={[TextStyles.bodyMuted, styles.center, styles.lead]}>
          Kobciye brings students, parents, teachers and administrators onto one beautiful, intelligent
          platform — built for schools everywhere, and tuned for Somali schools in particular.
        </Text>
        <CardGrid
          items={CAPABILITIES}
          cols={colsFor([[880, 3], [580, 2], [0, 1]])}
          renderItem={(c) => <CapabilityCard {...c} />}
        />
      </View>

      <View style={[styles.section, { paddingVertical: isDesktop ? 64 : 40 }]}>
        <Text style={[TextStyles.h1, styles.center]}>{t('pricingTitle')}</Text>
        <Text style={[TextStyles.bodyMuted, styles.center, styles.lead]}>{t('pricingSubtitle')}</Text>
        <CardGrid
          items={PLANS}
          cols={colsFor([[880, 3], [0, 1]])}
          renderItem={(p) => <PlanCard {...p} />}
        />
      </View>

      <View style={[styles.section, styles.darkSection, { paddingVertical: isDesktop ? 64 : 40 }]}>
        <View style={styles.sectionBadge}>
          <Text style={styles.sectionBadgeText}>Roadmap</Text>
        </View>
        <Text style={[TextStyles.h1, styles.center, { color: '#fff' }]}>What's growing next for Kobciye</Text>
        <Text style={[styles.center, styles.lead, { color: 'rgba(148,163,184,0.9)', marginTop: 10 }]}>
          These signature modules are being built with care and will roll out in upcoming phases —
          designed specifically around how schools actually work.
        </Text>
        <CardGrid
          items={FUTURE_FEATURES}
          cols={colsFor([[880, 4], [580, 2], [0, 1]])}
          renderItem={(f) => <FeatureTeaserCard {...f} comingSoon={t('comingSoon')} />}
        />
      </View>
    </ScrollView>
  );
}

const HERO_STATS = [
  { value: '500+', label: 'Students' },
  { value: '98%', label: 'Attendance' },
  { value: '50+', label: 'Schools' },
];

const FEATURE_PILLS_HERO = ['📊 Smart Analytics', '📱 Mobile-First', '🌍 Somali & English', '✅ Easy Attendance'];

function Hero({ isDesktop, navigation, t }) {
  return (
    <LinearGradient colors={Gradients.brandVibrant} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, { paddingVertical: isDesktop ? 56 : 40 }]}>
      {/* Decorative blobs */}
      <View style={styles.heroBlob1} pointerEvents="none" />
      <View style={styles.heroBlob2} pointerEvents="none" />

      <View style={styles.heroTopRow}>
        <AppLogo size={28} light />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <LanguageSwitcher light />
          <Pressable onPress={() => navigation.navigate('Login')} style={styles.heroLoginBtn}>
            <Text style={styles.heroLoginBtnLabel}>{t('login')}</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ alignItems: 'center', marginTop: isDesktop ? 56 : 36, maxWidth: 720, alignSelf: 'center' }}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>🏫  School Management Platform</Text>
        </View>
        <Text style={[styles.heroTitle, { fontSize: isDesktop ? 44 : 30 }]}>{t('heroTitle')}</Text>
        <Text style={styles.heroSubtitle}>{t('heroSubtitle')}</Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {HERO_STATS.map((s, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.heroActions}>
          <AppButton
            label={t('getStarted')}
            icon={<Ionicons name="arrow-forward" size={18} color="#fff" />}
            gradient={Gradients.gold}
            onPress={() => navigation.navigate('Login')}
            size="lg"
            style={{ minWidth: 180 }}
          />
          <Pressable onPress={() => navigation.navigate('Login')} style={styles.outlineLight}>
            <Text style={styles.outlineLightLabel}>{t('login')}</Text>
          </Pressable>
          <Pressable onPress={() => showRegisterSchoolSheet(navigation)} style={styles.ghostLight}>
            <Text style={styles.ghostLightLabel}>{t('requestSchoolAccount')}</Text>
          </Pressable>
        </View>

        {/* Floating feature pills */}
        <View style={styles.featurePillsRow}>
          {FEATURE_PILLS_HERO.map((p, i) => (
            <View key={i} style={styles.featurePill}>
              <Text style={styles.featurePillText}>{p}</Text>
            </View>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}

function CardGrid({ items, cols, renderItem }) {
  const rows = [];
  for (let i = 0; i < items.length; i += cols) rows.push(items.slice(i, i + cols));
  return (
    <View style={{ width: '100%', maxWidth: 1080, alignSelf: 'center', marginTop: 28 }}>
      {rows.map((row, ri) => (
        <View key={ri} style={styles.gridRow}>
          {row.map((item, ci) => (
            <View key={ci} style={{ flex: 1 }}>
              {renderItem(item)}
            </View>
          ))}
          {row.length < cols &&
            Array.from({ length: cols - row.length }).map((_, ei) => <View key={`e${ei}`} style={{ flex: 1 }} />)}
        </View>
      ))}
    </View>
  );
}

function CapabilityCard({ icon, tint, title, body }) {
  return (
    <View style={[styles.capCard, { borderLeftColor: tint, borderLeftWidth: 3 }]}>
      <View style={[styles.capIcon, { backgroundColor: `${tint}1F` }]}>
        <Ionicons name={icon} size={22} color={tint} />
      </View>
      <Text style={[TextStyles.h2, { marginTop: 16, marginBottom: 6 }]}>{title}</Text>
      <Text style={TextStyles.bodyMuted}>{body}</Text>
    </View>
  );
}

function PlanCard({ name, price, capacity, description, tint, highlighted }) {
  return (
    <View style={[styles.planCard, highlighted && { borderColor: Colors.accent, borderWidth: 1.6 }]}>
      {highlighted && (
        <LinearGradient colors={Gradients.gold} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.popularBadge}>
          <Text style={styles.popularText}>Most popular</Text>
        </LinearGradient>
      )}
      <Text style={TextStyles.h2}>{name}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 10 }}>
        <Text style={[styles.planPrice, { color: tint }]}>{price}</Text>
        <Text style={[TextStyles.bodyMuted, { marginBottom: 6, marginLeft: 4 }]}>/month</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
        <Ionicons name="people" size={16} color={tint} />
        <Text style={[TextStyles.body, { fontWeight: '700', marginLeft: 6 }]}>{capacity}</Text>
      </View>
      <Text style={[TextStyles.bodyMuted, { marginTop: 14 }]}>{description}</Text>
      <Pressable
        onPress={() => showRegisterSchoolSheet()}
        style={[styles.planCta, { borderColor: tint }]}
      >
        <Text style={{ color: tint, fontWeight: '700' }}>Choose {name}</Text>
      </Pressable>
    </View>
  );
}

function FeatureTeaserCard({ icon, tint, title, body, comingSoon }) {
  return (
    <View style={styles.featureCard}>
      <View style={[styles.capIcon, { backgroundColor: `${tint}26` }]}>
        <Ionicons name={icon} size={22} color={tint} />
      </View>
      <Text style={[TextStyles.h2, { marginTop: 16, marginBottom: 6, fontSize: 15, color: '#fff' }]}>{title}</Text>
      <Text style={[TextStyles.bodyMuted, { fontSize: 12.5, color: 'rgba(148,163,184,0.85)' }]}>{body}</Text>
      <View style={styles.comingSoonChip}>
        <Text style={styles.comingSoonText}>{comingSoon}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: Colors.background },
  section: { paddingHorizontal: 24, alignItems: 'center' },
  surface: { backgroundColor: Colors.surface },
  center: { textAlign: 'center' },
  lead: { marginTop: 10, maxWidth: 640, textAlign: 'center' },
  gridRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },

  hero: { paddingHorizontal: 24, paddingTop: 18, overflow: 'hidden', position: 'relative' },
  heroBlob1: {
    position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroBlob2: {
    position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1180, width: '100%', alignSelf: 'center' },
  heroLoginBtn: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 10, borderWidth: 1.5, borderColor: glass(0.35) },
  heroLoginBtnLabel: { color: '#fff', fontWeight: '700', fontSize: 13.5 },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 40, backgroundColor: glass(0.12), borderWidth: 1, borderColor: glass(0.22) },
  pillText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.4, color: 'rgba(255,255,255,0.85)' },
  heroTitle: { fontWeight: '800', letterSpacing: -0.5, color: '#fff', textAlign: 'center', marginTop: 22, lineHeight: 42 },
  heroSubtitle: { fontSize: 15.5, lineHeight: 23, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'center', gap: 32, marginTop: 30 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2, fontWeight: '600' },
  heroActions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14, marginTop: 30 },
  outlineLight: { paddingVertical: 16, paddingHorizontal: 28, borderRadius: 16, borderWidth: 1.5, borderColor: glass(0.4), alignItems: 'center', justifyContent: 'center' },
  outlineLightLabel: { color: '#fff', fontWeight: '700', fontSize: 15 },
  ghostLight: { paddingVertical: 16, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' },
  ghostLightLabel: { color: 'rgba(255,255,255,0.85)', fontWeight: '700', fontSize: 14 },
  featurePillsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 28 },
  featurePill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 30, backgroundColor: glass(0.1), borderWidth: 1, borderColor: glass(0.2) },
  featurePillText: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },

  capCard: {
    backgroundColor: Colors.surface, borderRadius: 20, borderWidth: 1, borderColor: Colors.border,
    padding: 22, shadowColor: Colors.primary, shadowOpacity: 0.05, shadowRadius: 26, shadowOffset: { width: 0, height: 12 },
  },
  capIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  comingSoonChip: { marginTop: 16, alignSelf: 'flex-start', backgroundColor: `${Colors.accent}26`, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  comingSoonText: { fontSize: 11, fontWeight: '700', color: Colors.accent },

  planCard: {
    backgroundColor: Colors.surface, borderRadius: 24, borderWidth: 1, borderColor: Colors.border, padding: 24,
    shadowColor: Colors.primary, shadowOpacity: 0.05, shadowRadius: 30, shadowOffset: { width: 0, height: 14 },
  },
  popularBadge: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 14 },
  popularText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  planPrice: { fontSize: 34, fontWeight: '800', letterSpacing: -0.5 },
  planCta: { marginTop: 18, height: 48, borderRadius: 12, borderWidth: 1.4, alignItems: 'center', justifyContent: 'center' },

  darkSection: { backgroundColor: '#0F172A' },
  sectionBadge: { alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 16, paddingVertical: 7, borderRadius: 30, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  sectionBadgeText: { fontSize: 11.5, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5, textTransform: 'uppercase' },
  featureCard: {
    backgroundColor: '#1E293B', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    padding: 22, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 8 },
  },
});
