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

// ─── Plans (per-student pricing) ─────────────────────────────────────────────
const PLANS = [
  {
    name: 'Dugsiyada Yar-Yar',
    pricePerStudent: '$0.07',
    minNote: '*Dugsiga ka yar 500 oo Arday waxa uu bixinayaa $35',
    icon: '🏠',
    features: [
      'Nidaamka Xaadirinta',
      'Nidaamka Imtixaannaadka',
      'Warbixinaha Ardayga',
      'Ururinta Iida',
      'Nidaamka Xisaabaadka',
      'Nidaamka Shaqaalaha',
      'Faracyada Dugsiga (1)',
      'Akoonka Ardayga',
      'Akoonka Waalidka',
    ],
    highlighted: false,
  },
  {
    name: 'Dugsiyada Waawayn',
    pricePerStudent: '$0.1',
    minNote: '*Dugsiga ka yar 500 oo Arday waxa uu bixinayaa $45',
    icon: '🏢',
    features: [
      'Nidaamka Xaadirinta',
      'Nidaamka Imtixaannaadka',
      'Warbixinaha Ardayga',
      'Ururinta Iida',
      'Nidaamka Xisaabaadka',
      'Nidaamka Shaqaalaha',
      'Faracyada Dugsiga (3)',
      'Akoonka Ardayga',
      'Akoonka Waalidka',
    ],
    highlighted: true,
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
      <AppShowcaseSection isDesktop={isDesktop} navigation={navigation} />
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

// ─── App Showcase (phone mockup + floating cards) ──────────────────────────
function AppShowcaseSection({ isDesktop, navigation }) {
  return (
    <View style={styles.showcaseSection}>
      <Text style={styles.sectionTitle}>
        Kobciye ku Horumar <Text style={{ color: '#16a34a' }}>Dugsigaaga</Text>
      </Text>
      <Text style={styles.sectionSub}>
        Nidaamka ugu fudud ee aad ku maamusho xogta ardayda — mar walba gacantaada ku jirta. Bilaaw isticmaalka Kobciye Software.
      </Text>
      <View style={[styles.showcaseWrap, { flexDirection: isDesktop ? 'row' : 'column' }]}>
        {/* Left floating cards */}
        {isDesktop && (
          <View style={styles.showcaseLeft}>
            <View style={styles.floatCardGreen}>
              <Text style={styles.floatCardLabel}>Total income</Text>
              <Text style={styles.floatCardBig}>$6,000</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <Ionicons name="trending-up" size={12} color="#16a34a" />
                <Text style={{ fontSize: 11, color: '#16a34a', fontWeight: '700' }}>47.3%</Text>
              </View>
            </View>
            <View style={[styles.floatCardSmall, { backgroundColor: '#16a34a', marginTop: 20 }]}>
              <Text style={styles.floatCardSmallNum}>117</Text>
              <Text style={styles.floatCardSmallLbl}>Tirada galefta dugsigu{'\n'}bilaabo</Text>
            </View>
          </View>
        )}

        {/* Center phone mockup */}
        <View style={styles.phoneMockupWrap}>
          <View style={styles.phoneMockup}>
            {/* Phone header bar */}
            <LinearGradient colors={['#0A2E6B', '#1E4F96']} style={styles.phoneMockupHeader}>
              <AppLogo size={14} light />
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="search" size={11} color="#fff" />
                </View>
                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="menu" size={11} color="#fff" />
                </View>
              </View>
            </LinearGradient>
            {/* School type chips */}
            <View style={{ flexDirection: 'row', gap: 6, padding: 10 }}>
              <View style={[styles.schoolChipGreen]}>
                <Text style={{ color: '#fff', fontSize: 8, fontWeight: '700' }}>✓ Dugsi Sare</Text>
              </View>
              <View style={[styles.schoolChipGray]}>
                <Text style={{ color: '#64748b', fontSize: 8, fontWeight: '600' }}>Dugsi Hoose</Text>
              </View>
            </View>
            {/* Stats row */}
            <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 10, marginBottom: 8 }}>
              {[
                { icon: 'home', val: '5 Fasal', color: '#0891b2' },
                { icon: 'people', val: '300 Arday', color: '#16a34a' },
              ].map((s) => (
                <View key={s.val} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name={s.icon} size={10} color={s.color} />
                  <Text style={{ fontSize: 9.5, color: '#374151', fontWeight: '600' }}>{s.val}</Text>
                </View>
              ))}
            </View>
            {/* Add class button */}
            <View style={{ paddingHorizontal: 10 }}>
              <LinearGradient colors={['#0A2E6B', '#1E4F96']} style={{ borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Ionicons name="add" size={12} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>Fasal Cusub</Text>
              </LinearGradient>
            </View>
            {/* Class grid */}
            <View style={{ padding: 10 }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#0f172a', marginBottom: 8 }}>Fasallada:</Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {['Form 1A', 'Form 2A'].map((cls) => (
                  <View key={cls} style={{ flex: 1, backgroundColor: '#f8fafc', borderRadius: 10, padding: 8, borderWidth: 1, borderColor: '#e2e8f0' }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#0f172a' }}>{cls}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 }}>
                      <Ionicons name="people" size={9} color="#64748b" />
                      <Text style={{ fontSize: 8.5, color: '#64748b' }}>45</Text>
                    </View>
                    <View style={{ marginTop: 6, backgroundColor: '#16a34a', borderRadius: 6, paddingVertical: 4, paddingHorizontal: 6, alignSelf: 'flex-start' }}>
                      <Text style={{ color: '#fff', fontSize: 7.5, fontWeight: '700' }}>FUR FASAL</Text>
                    </View>
                  </View>
                ))}
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                {['Form 3A', 'Form 4A'].map((cls) => (
                  <View key={cls} style={{ flex: 1, backgroundColor: '#f8fafc', borderRadius: 10, padding: 8, borderWidth: 1, borderColor: '#e2e8f0' }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#0f172a' }}>{cls}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 }}>
                      <Ionicons name="people" size={9} color="#64748b" />
                      <Text style={{ fontSize: 8.5, color: '#64748b' }}>45</Text>
                    </View>
                    <View style={{ marginTop: 6, backgroundColor: '#16a34a', borderRadius: 6, paddingVertical: 4, paddingHorizontal: 6, alignSelf: 'flex-start' }}>
                      <Text style={{ color: '#fff', fontSize: 7.5, fontWeight: '700' }}>FUR FASAL</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Right floating cards */}
        {isDesktop && (
          <View style={styles.showcaseRight}>
            <View style={[styles.floatCardSmall, { backgroundColor: '#16a34a' }]}>
              <Text style={styles.floatCardSmallNum}>183</Text>
              <Text style={styles.floatCardSmallLbl}>Tirada ardayda{'\n'}buugta</Text>
            </View>
            <View style={[styles.floatAvatarCard, { marginTop: 20 }]}>
              <View style={{ flexDirection: 'row' }}>
                {['#0891b2', '#16a34a', '#7c3aed', '#e11d48'].map((c, i) => (
                  <View key={i} style={[styles.floatAvatar, { backgroundColor: c, marginLeft: i === 0 ? 0 : -8 }]}>
                    <Ionicons name="person" size={10} color="#fff" />
                  </View>
                ))}
                <View style={[styles.floatAvatar, { backgroundColor: '#0A2E6B', marginLeft: -8 }]}>
                  <Text style={{ color: '#fff', fontSize: 7, fontWeight: '800' }}>+300</Text>
                </View>
              </View>
              <Text style={{ fontSize: 10, color: '#374151', fontWeight: '600', marginTop: 6 }}>Ardayda bilaashka</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
function PricingSection({ isDesktop }) {
  return (
    <View style={[styles.section, { backgroundColor: '#fff' }]}>
      <Text style={styles.sectionTitle}>
        Qiimaha Barnaamij-ka <Text style={{ color: '#16a34a' }}>Kobciye</Text>
      </Text>
      <Text style={styles.sectionSub}>
        Qiimaha software-ku waxa uu ku salaysan yahay Khidmad bille ah taaso ka iminaysa tirada ardayda dugsiga
      </Text>
      <View style={[styles.planRow, { flexDirection: isDesktop ? 'row' : 'column', alignItems: isDesktop ? 'flex-start' : 'stretch' }]}>
        {PLANS.map((p) => (
          <PlanCard key={p.name} plan={p} isDesktop={isDesktop} />
        ))}
      </View>
    </View>
  );
}

function PlanCard({ plan: p, isDesktop }) {
  return (
    <View style={[styles.planCard, { flex: isDesktop ? 1 : undefined }, p.highlighted && styles.planCardHighlighted]}>
      {/* Diamond price badge */}
      <View style={styles.diamondWrap}>
        <LinearGradient colors={['#0f172a', '#1E293B']} style={styles.diamondBadge}>
          <Text style={styles.diamondPrice}>{p.pricePerStudent}</Text>
          <Text style={styles.diamondSub}>/Arday</Text>
        </LinearGradient>
      </View>

      <View style={{ padding: 20, paddingTop: 48 }}>
        <Text style={styles.planName}>{p.icon}  {p.name}</Text>
        <Text style={styles.planFeaturesTitle}>Nidaamyada Aad ka Dhex Helayso:</Text>
        <View style={{ gap: 7, marginTop: 8 }}>
          {p.features.map((f) => (
            <View key={f} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <Text style={{ color: '#16a34a', fontSize: 13, fontWeight: '700' }}>✓</Text>
              <Text style={{ fontSize: 12.5, color: '#374151' }}>{f}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.planMinNote}>{p.minNote}</Text>
        <Pressable onPress={() => showRegisterSchoolSheet()} style={styles.planCta}>
          <LinearGradient colors={['#0A2E6B', '#1E4F96']} style={styles.planCtaGrad}>
            <Text style={styles.planCtaText}>Bilaaw Hadda →</Text>
          </LinearGradient>
        </Pressable>
      </View>
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

  // App Showcase
  showcaseSection: { paddingHorizontal: 24, paddingVertical: 60, alignItems: 'center', backgroundColor: '#f0f7ff' },
  showcaseWrap: { width: '100%', maxWidth: 980, alignSelf: 'center', gap: 24, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  showcaseLeft: { alignItems: 'flex-end', gap: 0, minWidth: 160 },
  showcaseRight: { alignItems: 'flex-start', gap: 0, minWidth: 160 },
  floatCardGreen: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14,
    shadowColor: '#0A2E6B', shadowOpacity: 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 6 },
    minWidth: 140, borderWidth: 1, borderColor: '#e2e8f0',
  },
  floatCardLabel: { fontSize: 10, color: '#94a3b8', fontWeight: '600' },
  floatCardBig: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginTop: 2 },
  floatCardSmall: {
    borderRadius: 14, padding: 12, minWidth: 100,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 14, shadowOffset: { width: 0, height: 4 },
  },
  floatCardSmallNum: { fontSize: 26, fontWeight: '900', color: '#fff' },
  floatCardSmallLbl: { fontSize: 9.5, color: 'rgba(255,255,255,0.85)', marginTop: 3, lineHeight: 13 },
  floatAvatarCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 12,
    shadowColor: '#0A2E6B', shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 4 },
    borderWidth: 1, borderColor: '#e2e8f0',
  },
  floatAvatar: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  phoneMockupWrap: { alignItems: 'center' },
  phoneMockup: {
    width: 280, borderRadius: 24, overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 3, borderColor: '#0f172a',
    shadowColor: '#0A2E6B', shadowOpacity: 0.22, shadowRadius: 36, shadowOffset: { width: 0, height: 14 },
  },
  phoneMockupHeader: { padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  schoolChipGreen: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, backgroundColor: '#16a34a' },
  schoolChipGray: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, backgroundColor: '#e2e8f0', borderWidth: 1, borderColor: '#cbd5e1' },

  // Pricing
  planRow: { gap: 16, width: '100%', maxWidth: 860, alignSelf: 'center' },
  planCard: {
    backgroundColor: '#fff', borderRadius: 22, overflow: 'hidden',
    borderWidth: 1.5, borderColor: '#e2e8f0', paddingTop: 0,
    shadowColor: '#0A2E6B', shadowOpacity: 0.07, shadowRadius: 24, shadowOffset: { width: 0, height: 8 },
  },
  planCardHighlighted: {
    borderColor: '#0A2E6B', borderWidth: 2,
    shadowColor: '#0A2E6B', shadowOpacity: 0.16, shadowRadius: 32, shadowOffset: { width: 0, height: 12 },
  },
  diamondWrap: { alignItems: 'center', marginTop: -1, zIndex: 2 },
  diamondBadge: {
    width: 88, height: 88, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
    marginTop: 16,
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 14, shadowOffset: { width: 0, height: 4 },
  },
  diamondPrice: { fontSize: 18, fontWeight: '900', color: '#16a34a', transform: [{ rotate: '-45deg' }], letterSpacing: -0.5 },
  diamondSub: { fontSize: 10, color: 'rgba(255,255,255,0.7)', transform: [{ rotate: '-45deg' }], fontWeight: '600', marginTop: -2 },
  planName: { fontSize: 17, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  planFeaturesTitle: { fontSize: 12.5, fontWeight: '700', color: '#64748b', marginBottom: 2 },
  planMinNote: { fontSize: 11.5, color: '#0891b2', fontWeight: '600', marginTop: 16, marginBottom: 4 },
  planCta: { marginTop: 12, borderRadius: 12, overflow: 'hidden' },
  planCtaGrad: { paddingVertical: 13, alignItems: 'center', justifyContent: 'center' },
  planCtaText: { color: '#fff', fontWeight: '800', fontSize: 14 },

  // Footer
  footer: { padding: 36, alignItems: 'center', gap: 14 },
  footerText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, textAlign: 'center', lineHeight: 20 },
  footerCopy: { color: 'rgba(255,255,255,0.4)', fontSize: 11.5, textAlign: 'center' },
});
