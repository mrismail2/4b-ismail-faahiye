import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients, glass } from '../constants/colors';
import AppLogo from '../widgets/AppLogo';
import LanguageSwitcher from '../widgets/LanguageSwitcher';
import { useLocalization } from '../context/LocalizationContext';
import { showRegisterSchoolSheet } from '../widgets/RegisterSchoolSheet';

// ─── Comparison data ──────────────────────────────────────────────────────────
const OTHERS_CONS = [
  'Xogta ardayda oo kala dhiman',
  'Lacag hormarisa (Setup Fee)',
  'Wuxuu ku jiraa Desktop keliya',
  'Kuma diyaarsana Af Somali',
  'Wadamo kale ayaa laga soo wariday',
  'Isticmaalka system ka oo adag',
];
const KOBCIYE_PROS = [
  'Xogta dugsigaaga oo dhamaystiran',
  'Bil free tijaabo ah ayaad helaysaa',
  'Aalad kasta ayaad ka isticmaalaysaa',
  'Wuxuu ku diyaarsan yahay Af Somali',
  'Local ku salaysan baahida Dugsigaaga',
  'Waalid & ardayba wada isticmaali kara',
];

// ─── Feature showcase cards ───────────────────────────────────────────────────
const FEATURES = [
  {
    icon: 'people',
    color: '#16a34a',
    bg: '#dcfce7',
    title: 'Xaadiriska Ardayda',
    body: 'Xaadiriska ardayda waxaad si fudud uga samayn kartaa Mobile-kaaga gacanta, umana baahnid inaad daabacdo waraaqo badan.',
    items: [
      { name: 'Mustafa Ali', grade: 'Form 4A', type: 'Secondary' },
      { name: 'Saadaqa Ahmed', grade: 'Class 3', type: 'Primary' },
      { name: 'Amina Yonis', grade: 'Form 3B', type: 'Secondary' },
    ],
  },
  {
    icon: 'card',
    color: '#0891b2',
    bg: '#e0f2fe',
    title: 'Maaliyadda Dugsiga',
    body: 'Ka rayso buuggaagtii waaweynaa, hadda si fudud ayaad u diiwan gelin kartaa lacag bixinta ardayda (Fee) & xiisaabaadka dugsigaba.',
    stats: [
      { label: 'La ururiyay:', val: '$3,690' },
      { label: 'Aan la ururin:', val: '$1,310' },
      { label: 'Hadhaa hore:', val: '$245' },
    ],
    total: '$5,000',
  },
  {
    icon: 'document-text',
    color: '#7c3aed',
    bg: '#ede9fe',
    title: 'Imtixaannaadka',
    body: 'Uma baahnid in macalinkasta maadadiisa Excel ku soo qoro, Diiwaan ayaa iskugu kaa gaynaya haybana xogta imtixaannaadka ardayda.',
    marks: [
      { subject: 'Mathematics', score: 88 },
      { subject: 'Science', score: 74 },
      { subject: 'Somali', score: 92 },
    ],
  },
];

// ─── Plans ───────────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: 'Dugsi Yar', nameEn: 'Basic', price: '$10',
    capacity: 'Ilaa 100 Arday', highlighted: false, color: Colors.primaryLight,
    features: ['Xaadiriska Ardayda', 'Xogta Ardayda', 'Warbixinta Waalidka', 'Maaliyadda Fudud'],
  },
  {
    name: 'Dugsi Dhexe', nameEn: 'Standard', price: '$20',
    capacity: 'Ilaa 500 Arday', highlighted: true, color: Colors.accent,
    features: ['Wax kasta oo Basic ah', 'Imtixaannaadka', 'SMS & Farriin', 'Risk Score Ardayda', 'Warbixinta Faahfaahsan'],
  },
  {
    name: 'Dugsi Weyn', nameEn: 'Premium', price: '$50',
    capacity: 'Arday aan xad lahayn', highlighted: false, color: Colors.success,
    features: ['Wax kasta oo Standard ah', 'Multi-branch Support', 'Priority Support', 'Custom Reports', 'API Access'],
  },
];

export default function OnboardingScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isDesktop = width > 900;
  const { t } = useLocalization();

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <NavBar navigation={navigation} t={t} isDesktop={isDesktop} />
      <HeroSection navigation={navigation} t={t} isDesktop={isDesktop} />
      <ComparisonSection isDesktop={isDesktop} />
      <AboutSection isDesktop={isDesktop} navigation={navigation} />
      <FeaturesSection isDesktop={isDesktop} />
      <PricingSection isDesktop={isDesktop} />
      <FooterSection />
    </ScrollView>
  );
}

// ─── Nav Bar ─────────────────────────────────────────────────────────────────
function NavBar({ navigation, t, isDesktop }) {
  return (
    <View style={styles.nav}>
      <AppLogo size={26} />
      {isDesktop && (
        <View style={styles.navLinks}>
          {['Home', 'Features', 'Pricing', 'Contact'].map((l) => (
            <Text key={l} style={styles.navLink}>{l}</Text>
          ))}
        </View>
      )}
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <LanguageSwitcher />
        <Pressable onPress={() => navigation.navigate('Login')} style={styles.navLoginBtn}>
          <Text style={styles.navLoginText}>{t('login')} →</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection({ navigation, t, isDesktop }) {
  return (
    <LinearGradient colors={['#f0fdf8', '#e8f5e9', '#ffffff']} style={[styles.hero, { paddingVertical: isDesktop ? 80 : 52 }]}>
      <View style={[styles.heroInner, { flexDirection: isDesktop ? 'row' : 'column' }]}>
        {/* Left text */}
        <View style={[styles.heroLeft, { alignItems: isDesktop ? 'flex-start' : 'center' }]}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>☁️  Cloud-Based School Management System</Text>
          </View>
          <Text style={[styles.heroTitle, { fontSize: isDesktop ? 46 : 30, textAlign: isDesktop ? 'left' : 'center' }]}>
            Si Fudud U Maamul Xogta{' '}
            <Text style={styles.heroTitleAccent}>Ardayda!</Text>
          </Text>
          <Text style={[styles.heroSubtitle, { textAlign: isDesktop ? 'left' : 'center' }]}>
            Kobciye waxa uu kaa caawinayaa inaad qaab fudud u maamusho xogta ardayda iyo macluumaadka dugsigaaga.
          </Text>
          <View style={[styles.heroActions, { justifyContent: isDesktop ? 'flex-start' : 'center' }]}>
            <Pressable onPress={() => navigation.navigate('Pricing')} style={styles.heroCta}>
              <LinearGradient colors={['#0A2E6B', '#1E4F96']} style={styles.heroCtaGrad}>
                <Text style={styles.heroCtaText}>Bilaaw Hadda →</Text>
              </LinearGradient>
            </Pressable>
            <Pressable onPress={() => showRegisterSchoolSheet(navigation)} style={styles.heroOutline}>
              <Text style={styles.heroOutlineText}>Dugsigaaga diiwaan geli</Text>
            </Pressable>
          </View>
          {/* Stats */}
          <View style={[styles.statsRow, { justifyContent: isDesktop ? 'flex-start' : 'center' }]}>
            {[['500+', 'Arday'], ['50+', 'Dugsi'], ['3', 'Magaalo']].map(([v, l]) => (
              <View key={l} style={styles.statBox}>
                <Text style={styles.statVal}>{v}</Text>
                <Text style={styles.statLbl}>{l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Right: App mockup */}
        {isDesktop && (
          <View style={styles.heroMockupWrap}>
            <AppMockup />
          </View>
        )}
      </View>
      {!isDesktop && (
        <View style={{ marginTop: 32, alignSelf: 'center', width: '100%', maxWidth: 340 }}>
          <AppMockup />
        </View>
      )}
    </LinearGradient>
  );
}

function AppMockup() {
  return (
    <View style={styles.mockup}>
      {/* Header bar */}
      <LinearGradient colors={['#0A2E6B', '#1E4F96']} style={styles.mockupHeader}>
        <Text style={styles.mockupHeaderText}>Kobciye</Text>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="search" size={12} color="#fff" />
          </View>
          <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="menu" size={12} color="#fff" />
          </View>
        </View>
      </LinearGradient>
      {/* School chips */}
      <View style={{ flexDirection: 'row', gap: 8, padding: 10 }}>
        <View style={[styles.schoolChip, { backgroundColor: '#16a34a' }]}>
          <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>✓ AL-MAAX SECONDARY</Text>
        </View>
        <View style={[styles.schoolChip, { backgroundColor: '#e2e8f0' }]}>
          <Text style={{ color: '#64748b', fontSize: 9, fontWeight: '600' }}>AL-MAAX PRIMARY</Text>
        </View>
      </View>
      {/* Student rows */}
      {[
        { name: 'Mustafa Ali', grade: 'Form 4A', color: '#16a34a' },
        { name: 'Saadaqa Ahmed', grade: 'Class 3', color: '#0891b2' },
        { name: 'Amina Yonis', grade: 'Form 3B', color: '#7c3aed' },
        { name: 'Abdullahi Osman', grade: 'Form 2D', color: '#e11d48' },
      ].map((s) => (
        <View key={s.name} style={styles.mockupRow}>
          <View style={[styles.mockupAvatar, { backgroundColor: `${s.color}22` }]}>
            <Ionicons name="person" size={12} color={s.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#0f172a' }}>{s.name}</Text>
            <Text style={{ fontSize: 9, color: '#64748b' }}>{s.grade}</Text>
          </View>
          <View style={[styles.mockupBadge, { backgroundColor: `${s.color}18` }]}>
            <Text style={{ fontSize: 8, color: s.color, fontWeight: '700' }}>Secondary</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

// ─── Comparison ───────────────────────────────────────────────────────────────
function ComparisonSection({ isDesktop }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Faa'iidooyinka Nidaamka <Text style={{ color: '#16a34a' }}>Kobciye</Text>
      </Text>
      <Text style={styles.sectionSub}>
        Waa nidaam loo diyaariyay inuu daboolo baahiyaha gaarka ah ee xarumaha waxbarashada wuxuuna dugsigaaga siinayaa faa'iidooyin badan.
      </Text>
      <View style={[styles.compRow, { flexDirection: isDesktop ? 'row' : 'column' }]}>
        {/* Others card */}
        <View style={[styles.compCard, styles.compCardBad, { flex: isDesktop ? 1 : undefined }]}>
          <View style={styles.compCardHeader}>
            <Text style={styles.compCardTitleBad}>Nidaamyada Kale</Text>
            <View style={[styles.compHeaderIcon, { backgroundColor: '#fee2e2' }]}>
              <Ionicons name="close" size={16} color="#ef4444" />
            </View>
          </View>
          {OTHERS_CONS.map((c) => (
            <View key={c} style={styles.compItem}>
              <Ionicons name="close-circle" size={16} color="#ef4444" />
              <Text style={styles.compItemTextBad}>{c}</Text>
            </View>
          ))}
        </View>
        {/* Kobciye card */}
        <View style={[styles.compCard, styles.compCardGood, { flex: isDesktop ? 1 : undefined }]}>
          <View style={styles.compCardHeader}>
            <AppLogo size={18} />
            <View style={[styles.compHeaderIcon, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
            </View>
          </View>
          {KOBCIYE_PROS.map((p) => (
            <View key={p} style={styles.compItem}>
              <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
              <Text style={styles.compItemTextGood}>{p}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function AboutSection({ isDesktop, navigation }) {
  return (
    <View style={[styles.section, { backgroundColor: '#fff' }]}>
      <View style={[styles.aboutRow, { flexDirection: isDesktop ? 'row' : 'column', gap: isDesktop ? 48 : 28 }]}>
        <View style={{ flex: isDesktop ? 1 : undefined }}>
          <Text style={styles.sectionTitle}>
            Ku Saabsan <Text style={{ color: '#16a34a' }}>Kobciye</Text> Software
          </Text>
          <Text style={{ color: '#16a34a', fontWeight: '600', fontSize: 14, lineHeight: 22, marginBottom: 14 }}>
            Kobciye waa barnaamij casri ah oo loogu talagalay in lagu fududeeyo maamulka iyo kaydinta macluumaadka ardayda, waxa uu kuu ogolaanaya inaad hal taabasho ku maamusho dhammaan xogaha ardayda.
          </Text>
          <Pressable onPress={() => navigation.navigate('Login')} style={styles.heroCta}>
            <LinearGradient colors={['#0A2E6B', '#1E4F96']} style={styles.heroCtaGrad}>
              <Text style={styles.heroCtaText}>Gal Akoonkaaga →</Text>
            </LinearGradient>
          </Pressable>
        </View>
        <View style={[styles.aboutImageBox, { flex: isDesktop ? 1 : undefined }]}>
          <LinearGradient colors={['#dcfce7', '#bbf7d0']} style={styles.aboutImageInner}>
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, gap: 12 }}>
              <LinearGradient colors={['#0A2E6B', '#1E4F96']} style={{ width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="school" size={32} color="#fff" />
              </LinearGradient>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#0A2E6B' }}>Kobciye School System</Text>
              <Text style={{ fontSize: 13, color: '#16a34a', fontWeight: '600', textAlign: 'center' }}>Si xaroogo leh u maamul xogta ardayda oo ka rayso waraaqihi.</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                {['Attendance', 'Payments', 'Exams'].map((b) => (
                  <View key={b} style={{ backgroundColor: '#0A2E6B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{b}</Text>
                  </View>
                ))}
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
function FeaturesSection({ isDesktop }) {
  return (
    <View style={[styles.section, { backgroundColor: '#f8fafc' }]}>
      <Text style={styles.sectionTitle}>Qaybaha Ugu Muhiimsan</Text>
      <Text style={styles.sectionSub}>Kobciye waxaa ku jira qaybaha ugu muhiimsan ee maamulka dugsiga oo dhan</Text>
      <View style={[styles.featureCardsRow, { flexDirection: isDesktop ? 'row' : 'column' }]}>
        {FEATURES.map((f) => (
          <FeatureCard key={f.title} feature={f} />
        ))}
      </View>
    </View>
  );
}

function FeatureCard({ feature: f }) {
  return (
    <View style={styles.featureCard}>
      {/* Mini mockup */}
      <View style={[styles.featureCardMockup, { backgroundColor: f.bg }]}>
        {f.items ? (
          <View style={{ gap: 8 }}>
            {f.items.map((s) => (
              <View key={s.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 10, padding: 8 }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: `${f.color}22`, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="person" size={13} color={f.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#0f172a' }}>{s.name}</Text>
                  <Text style={{ fontSize: 9.5, color: '#64748b' }}>{s.grade}</Text>
                </View>
                <View style={{ backgroundColor: `${f.color}18`, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 }}>
                  <Text style={{ fontSize: 8.5, color: f.color, fontWeight: '700' }}>{s.type}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : f.stats ? (
          <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 12, gap: 6 }}>
            <Text style={{ fontSize: 10, color: '#64748b', fontWeight: '600' }}>Wadata Lacagta</Text>
            <Text style={{ fontSize: 22, fontWeight: '800', color: f.color }}>{f.total}</Text>
            {f.stats.map((s) => (
              <View key={s.label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 10.5, color: '#64748b' }}>{s.label}</Text>
                <Text style={{ fontSize: 10.5, fontWeight: '700', color: '#0f172a' }}>{s.val}</Text>
              </View>
            ))}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
              {['eDahab', 'Cash'].map((m) => (
                <View key={m} style={{ backgroundColor: `${f.color}18`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                  <Text style={{ fontSize: 9, color: f.color, fontWeight: '700' }}>{m}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={{ gap: 6 }}>
            {f.marks.map((m) => (
              <View key={m.subject} style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: '#0f172a' }}>{m.subject}</Text>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: f.color }}>{m.score}%</Text>
                </View>
                <View style={{ height: 5, borderRadius: 3, backgroundColor: `${f.color}22`, overflow: 'hidden' }}>
                  <View style={{ width: `${m.score}%`, height: '100%', backgroundColor: f.color, borderRadius: 3 }} />
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
      {/* Text */}
      <View style={{ padding: 16 }}>
        <Text style={[styles.featureCardTitle, { color: '#0f172a' }]}>{f.title}</Text>
        <Text style={styles.featureCardBody}>{f.body}</Text>
      </View>
    </View>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
function PricingSection({ isDesktop }) {
  return (
    <View style={[styles.section, { backgroundColor: '#fff' }]}>
      <Text style={styles.sectionTitle}>
        Doorso <Text style={{ color: '#16a34a' }}>Qorshaha</Text> Kuu Haboon
      </Text>
      <Text style={styles.sectionSub}>Bil koowaad bilaash ah — keli keliya lacag bixin hadaad ku qanacsatid</Text>
      <View style={[styles.planRow, { flexDirection: isDesktop ? 'row' : 'column', alignItems: isDesktop ? 'flex-end' : 'stretch' }]}>
        {PLANS.map((p) => (
          <PlanCard key={p.name} plan={p} isDesktop={isDesktop} />
        ))}
      </View>
    </View>
  );
}

function PlanCard({ plan: p, isDesktop }) {
  return (
    <View style={[
      styles.planCard,
      { flex: isDesktop ? 1 : undefined },
      p.highlighted && styles.planCardHighlighted,
    ]}>
      {p.highlighted && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>⭐  Ugu Caansan</Text>
        </View>
      )}
      <Text style={styles.planName}>{p.name}</Text>
      <Text style={styles.planNameEn}>{p.nameEn}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 10, gap: 2 }}>
        <Text style={[styles.planPrice, { color: p.color }]}>{p.price}</Text>
        <Text style={{ color: '#64748b', marginBottom: 6, fontSize: 13 }}>/bil</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
        <Ionicons name="people" size={14} color={p.color} />
        <Text style={{ fontWeight: '700', fontSize: 13, color: '#374151' }}>{p.capacity}</Text>
      </View>
      <View style={{ marginTop: 14, gap: 8 }}>
        {p.features.map((f) => (
          <View key={f} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Ionicons name="checkmark-circle" size={15} color="#16a34a" />
            <Text style={{ fontSize: 13, color: '#374151' }}>{f}</Text>
          </View>
        ))}
      </View>
      <Pressable onPress={() => showRegisterSchoolSheet()} style={[styles.planCta, p.highlighted && { backgroundColor: '#0A2E6B', borderWidth: 0 }]}>
        <Text style={[styles.planCtaText, p.highlighted && { color: '#fff' }]}>Doorso →</Text>
      </Pressable>
    </View>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function FooterSection() {
  return (
    <LinearGradient colors={['#0A2E6B', '#0f172a']} style={styles.footer}>
      <AppLogo size={24} light />
      <Text style={styles.footerText}>
        Kobciye — Cloud-Based School Management System{'\n'}Gabiley, Somaliland · kobciye.com
      </Text>
      <Text style={styles.footerCopy}>© 2025 Kobciye. Dhammaan xuquuqda way ilaalisan yihiin.</Text>
    </LinearGradient>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },

  // Nav
  nav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingVertical: 16,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  navLinks: { flexDirection: 'row', gap: 28 },
  navLink: { fontSize: 14, fontWeight: '600', color: '#374151' },
  navLoginBtn: {
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10,
    backgroundColor: '#0A2E6B',
  },
  navLoginText: { color: '#fff', fontWeight: '700', fontSize: 13.5 },

  // Hero
  hero: { paddingHorizontal: 24 },
  heroInner: { maxWidth: 1100, alignSelf: 'center', width: '100%', gap: 40, alignItems: 'center' },
  heroLeft: { flex: 1, gap: 0 },
  heroBadge: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(22,163,74,0.1)',
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 30,
    borderWidth: 1, borderColor: 'rgba(22,163,74,0.25)', marginBottom: 18,
  },
  heroBadgeText: { fontSize: 12, fontWeight: '600', color: '#16a34a' },
  heroTitle: { fontWeight: '900', color: '#0f172a', lineHeight: 54, letterSpacing: -1, marginBottom: 16 },
  heroTitleAccent: { color: '#16a34a' },
  heroSubtitle: { fontSize: 15.5, color: '#64748b', lineHeight: 24, marginBottom: 24, maxWidth: 480 },
  heroActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  heroCta: { borderRadius: 12, overflow: 'hidden' },
  heroCtaGrad: { paddingHorizontal: 24, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroCtaText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  heroOutline: {
    paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#0A2E6B',
  },
  heroOutlineText: { color: '#0A2E6B', fontWeight: '700', fontSize: 14 },
  statsRow: { flexDirection: 'row', gap: 24 },
  statBox: { alignItems: 'center' },
  statVal: { fontSize: 24, fontWeight: '800', color: '#0A2E6B' },
  statLbl: { fontSize: 11, color: '#64748b', fontWeight: '600', marginTop: 2 },

  // Mockup
  heroMockupWrap: { flex: 1, maxWidth: 340 },
  mockup: {
    backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden',
    shadowColor: '#0A2E6B', shadowOpacity: 0.18, shadowRadius: 32, shadowOffset: { width: 0, height: 12 },
    borderWidth: 1, borderColor: '#e2e8f0',
  },
  mockupHeader: { padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mockupHeaderText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  schoolChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  mockupRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  mockupAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  mockupBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },

  // Sections
  section: { paddingHorizontal: 24, paddingVertical: 60, alignItems: 'center', backgroundColor: '#f8fafc' },
  sectionTitle: { fontSize: 28, fontWeight: '900', color: '#0f172a', textAlign: 'center', letterSpacing: -0.5, marginBottom: 12 },
  sectionSub: { fontSize: 14.5, color: '#64748b', textAlign: 'center', lineHeight: 22, maxWidth: 560, marginBottom: 32 },

  // Comparison
  compRow: { gap: 16, width: '100%', maxWidth: 860, alignSelf: 'center' },
  compCard: { borderRadius: 20, padding: 22, borderWidth: 1.5 },
  compCardBad: { backgroundColor: '#fff5f5', borderColor: '#fecaca' },
  compCardGood: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  compCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  compCardTitleBad: { fontSize: 15, fontWeight: '800', color: '#ef4444' },
  compHeaderIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  compItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  compItemTextBad: { fontSize: 13.5, color: '#374151', flex: 1 },
  compItemTextGood: { fontSize: 13.5, color: '#15803d', flex: 1, fontWeight: '600' },

  // About
  aboutRow: { width: '100%', maxWidth: 1000, alignSelf: 'center', alignItems: 'center' },
  aboutImageBox: { borderRadius: 20, overflow: 'hidden', minHeight: 220 },
  aboutImageInner: { flex: 1, padding: 28, minHeight: 220, borderRadius: 20 },

  // Features
  featureCardsRow: { gap: 18, width: '100%', maxWidth: 1000, alignSelf: 'center' },
  featureCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 22, overflow: 'hidden',
    borderWidth: 1, borderColor: '#e2e8f0',
    shadowColor: '#0A2E6B', shadowOpacity: 0.07, shadowRadius: 20, shadowOffset: { width: 0, height: 8 },
  },
  featureCardMockup: { padding: 16, minHeight: 160 },
  featureCardTitle: { fontSize: 16, fontWeight: '800', marginBottom: 6 },
  featureCardBody: { fontSize: 13, color: '#64748b', lineHeight: 20 },

  // Pricing
  planRow: { gap: 16, width: '100%', maxWidth: 900, alignSelf: 'center' },
  planCard: {
    backgroundColor: '#fff', borderRadius: 22, padding: 24,
    borderWidth: 1.5, borderColor: '#e2e8f0',
    shadowColor: '#0A2E6B', shadowOpacity: 0.06, shadowRadius: 24, shadowOffset: { width: 0, height: 8 },
  },
  planCardHighlighted: {
    borderColor: '#0A2E6B', borderWidth: 2,
    shadowColor: '#0A2E6B', shadowOpacity: 0.16, shadowRadius: 32, shadowOffset: { width: 0, height: 12 },
  },
  popularBadge: {
    alignSelf: 'flex-start', backgroundColor: '#0A2E6B',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 30, marginBottom: 14,
  },
  popularText: { color: '#fff', fontSize: 11.5, fontWeight: '700' },
  planName: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  planNameEn: { fontSize: 12, fontWeight: '600', color: '#94a3b8', marginTop: 2 },
  planPrice: { fontSize: 36, fontWeight: '900', letterSpacing: -1 },
  planCta: {
    marginTop: 20, height: 48, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#0A2E6B',
    alignItems: 'center', justifyContent: 'center',
  },
  planCtaText: { color: '#0A2E6B', fontWeight: '800', fontSize: 15 },

  // Footer
  footer: { padding: 36, alignItems: 'center', gap: 14 },
  footerText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, textAlign: 'center', lineHeight: 20 },
  footerCopy: { color: 'rgba(255,255,255,0.4)', fontSize: 11.5, textAlign: 'center' },
});
