import React from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients, glass } from '../constants/colors';
import { Text as TextStyles } from '../constants/text';
import AppLogo from '../widgets/AppLogo';
import { showRegisterSchoolSheet } from '../widgets/RegisterSchoolSheet';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    icon: 'storefront-outline',
    price: '$10',
    capacity: 'Up to 100 students',
    tint: Colors.primaryLight,
    gradient: Gradients.brand,
    highlighted: false,
    features: [
      { label: 'Students & Parents management', included: true },
      { label: 'Attendance tracking', included: true },
      { label: 'Exam results', included: true },
      { label: 'Basic payments', included: true },
      { label: 'In-app messaging', included: true },
      { label: 'Advanced reports', included: false },
      { label: 'Custom permissions', included: false },
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    icon: 'business-outline',
    price: '$20',
    capacity: 'Up to 500 students',
    tint: Colors.accent,
    gradient: Gradients.gold,
    highlighted: true,
    features: [
      { label: 'Everything in Basic', included: true },
      { label: 'Lesson preparation', included: true },
      { label: 'Parent reports (SMS/WhatsApp)', included: true },
      { label: 'Advanced payments & receipts', included: true },
      { label: 'Permissions management', included: true },
      { label: 'Priority support', included: true },
      { label: 'Custom branding', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: 'globe-outline',
    price: '$50',
    capacity: 'Unlimited students',
    tint: Colors.success,
    gradient: Gradients.growth,
    highlighted: false,
    features: [
      { label: 'Everything in Standard', included: true },
      { label: 'Custom school branding', included: true },
      { label: 'Risk score analytics', included: true },
      { label: 'Offline attendance sync', included: true },
      { label: 'Mobile money matching', included: true },
      { label: 'Dedicated support', included: true },
      { label: 'API access', included: true },
    ],
  },
];

export default function PricingScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isDesktop = width > 860;

  const handleSelect = () => {
    navigation.goBack();
    showRegisterSchoolSheet();
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      {/* Top nav bar */}
      <LinearGradient colors={Gradients.brandVibrant} style={styles.topBar}>
        <View style={styles.topBarInner}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </Pressable>
          <AppLogo size={24} light />
          <View style={{ width: 44 }} />
        </View>
      </LinearGradient>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>Simple, transparent pricing</Text>
        </View>
        <Text style={[TextStyles.h1, styles.heroTitle]}>Choose the right plan for your school</Text>
        <Text style={[TextStyles.bodyMuted, styles.heroSubtitle]}>
          Every plan includes all core modules. Pay only for what your school needs — scale up anytime.
        </Text>
      </View>

      {/* Plan cards */}
      <View style={[styles.cardsRow, isDesktop && styles.cardsRowDesktop]}>
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onSelect={handleSelect} isDesktop={isDesktop} />
        ))}
      </View>

      {/* Pricing note */}
      <View style={styles.noteBox}>
        <Ionicons name="information-circle-outline" size={18} color={Colors.primaryLight} style={{ marginRight: 10 }} />
        <Text style={[TextStyles.bodyMuted, { flex: 1, fontSize: 13, lineHeight: 20 }]}>
          Pricing calculated by plan + active student count. Cancel anytime — no long-term contracts required.
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function PlanCard({ plan, onSelect, isDesktop }) {
  return (
    <View style={[styles.card, plan.highlighted && styles.cardHighlighted, isDesktop && styles.cardDesktop]}>
      {plan.highlighted && (
        <LinearGradient colors={Gradients.gold} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.recommendedBadge}>
          <Ionicons name="star" size={12} color="#fff" style={{ marginRight: 4 }} />
          <Text style={styles.recommendedText}>RECOMMENDED</Text>
        </LinearGradient>
      )}

      {/* Icon + name */}
      <View style={styles.planHeader}>
        <LinearGradient colors={plan.gradient} style={styles.planIconWrap}>
          <Ionicons name={plan.icon} size={22} color="#fff" />
        </LinearGradient>
        <View style={{ marginLeft: 14, flex: 1 }}>
          <Text style={[styles.planName, plan.highlighted && { color: Colors.accent }]}>{plan.name}</Text>
          <View style={styles.capacityRow}>
            <Ionicons name="people-outline" size={14} color={plan.tint} />
            <Text style={[styles.capacityText, { color: plan.tint }]}>{plan.capacity}</Text>
          </View>
        </View>
      </View>

      {/* Price */}
      <View style={styles.priceRow}>
        <Text style={[styles.price, { color: plan.tint }]}>{plan.price}</Text>
        <Text style={styles.priceSuffix}>/month</Text>
      </View>

      {/* Features */}
      <View style={styles.featuresWrap}>
        {plan.features.map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: f.included ? `${plan.tint}18` : `${Colors.muted}14` }]}>
              <Ionicons
                name={f.included ? 'checkmark' : 'close'}
                size={13}
                color={f.included ? plan.tint : Colors.mutedLight}
              />
            </View>
            <Text style={[styles.featureLabel, !f.included && styles.featureLabelMuted]}>{f.label}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <Pressable onPress={onSelect} style={({ pressed }) => [styles.ctaBtn, pressed && { opacity: 0.85 }]}>
        <LinearGradient colors={plan.gradient} style={styles.ctaGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Text style={styles.ctaLabel}>Select {plan.name}</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" style={{ marginLeft: 8 }} />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1 },

  topBar: { paddingTop: 48, paddingBottom: 16, paddingHorizontal: 20 },
  topBarInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1100, alignSelf: 'center', width: '100%' },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: glass(0.18), alignItems: 'center', justifyContent: 'center' },

  hero: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 16, alignItems: 'center' },
  heroBadge: { backgroundColor: `${Colors.accent}22`, borderRadius: 30, paddingHorizontal: 16, paddingVertical: 7, marginBottom: 16, borderWidth: 1, borderColor: `${Colors.accent}44` },
  heroBadgeText: { fontSize: 12, fontWeight: '700', color: Colors.accent, letterSpacing: 0.4 },
  heroTitle: { textAlign: 'center', marginBottom: 12, maxWidth: 560 },
  heroSubtitle: { textAlign: 'center', maxWidth: 520, lineHeight: 22 },

  cardsRow: { paddingHorizontal: 20, gap: 20, paddingTop: 24 },
  cardsRowDesktop: { flexDirection: 'row', alignItems: 'flex-start', maxWidth: 1100, alignSelf: 'center', width: '100%' },

  card: {
    backgroundColor: Colors.surface, borderRadius: 24, borderWidth: 1.5, borderColor: Colors.border,
    padding: 24, marginBottom: 16,
    shadowColor: Colors.primary, shadowOpacity: 0.06, shadowRadius: 28, shadowOffset: { width: 0, height: 12 },
  },
  cardHighlighted: { borderColor: Colors.accent, borderWidth: 2 },
  cardDesktop: { flex: 1, marginBottom: 0 },

  recommendedBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 16 },
  recommendedText: { color: '#fff', fontSize: 10.5, fontWeight: '800', letterSpacing: 0.8 },

  planHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  planIconWrap: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  planName: { fontSize: 18, fontWeight: '800', color: Colors.text },
  capacityRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  capacityText: { fontSize: 12.5, fontWeight: '700' },

  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 20 },
  price: { fontSize: 38, fontWeight: '900', letterSpacing: -1 },
  priceSuffix: { fontSize: 14, color: Colors.muted, marginBottom: 8, marginLeft: 4, fontWeight: '600' },

  featuresWrap: { gap: 10, marginBottom: 24 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureIcon: { width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  featureLabel: { fontSize: 13.5, color: Colors.text, flex: 1, fontWeight: '500' },
  featureLabelMuted: { color: Colors.mutedLight, textDecorationLine: 'line-through' },

  ctaBtn: { borderRadius: 14, overflow: 'hidden' },
  ctaGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, paddingHorizontal: 20 },
  ctaLabel: { color: '#fff', fontSize: 15, fontWeight: '800' },

  noteBox: {
    flexDirection: 'row', alignItems: 'flex-start', marginHorizontal: 24, marginTop: 12,
    backgroundColor: `${Colors.primaryLight}0D`, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: `${Colors.primaryLight}22`,
  },
});
