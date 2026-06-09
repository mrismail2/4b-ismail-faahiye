import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, useWindowDimensions, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients } from '../../constants/colors';
import DashboardShell from '../../widgets/DashboardShell';
import SectionPlaceholder from '../../widgets/SectionPlaceholder';
import SettingsPage from '../../widgets/SettingsPage';
import AttendanceSection from '../../widgets/AttendanceSection';
import ExamsSection from '../../widgets/ExamsSection';
import LessonPrepSection from '../../widgets/LessonPrepSection';
import PaymentsSection from '../../widgets/PaymentsSection';
import PermissionsSection from '../../widgets/PermissionsSection';
import SubscriptionSection from '../../widgets/SubscriptionSection';
import MessagingSection from '../../widgets/MessagingSection';

const SCHOOL_BRANCHES = ['Dugsi Sare', 'Dugsi Hoose'];

const CLASSES = [
  { name: 'Form 1A', students: 45, teacher: 'Macalin Axmed' },
  { name: 'Form 2A', students: 48, teacher: 'Macalin Sahra' },
  { name: 'Form 3A', students: 42, teacher: 'Macalin Faadumo' },
  { name: 'Form 4A', students: 50, teacher: 'Macalin Cali' },
  { name: 'Form 5A', students: 38, teacher: 'Macalin Hodan' },
  { name: 'Form 6A', students: 44, teacher: 'Macalin Bile' },
];

const STAT_CARDS = [
  { icon: 'people', value: '267', label: 'Tirada Ardayda', color: '#0A2E6B', bg: '#EEF2FF' },
  { icon: 'cash', value: '$6,200', label: 'Lacagta Bishan', color: '#16a34a', bg: '#dcfce7' },
  { icon: 'checkbox', value: '94%', label: 'Xaadirinta Maanta', color: '#0891b2', bg: '#e0f2fe' },
  { icon: 'document-text', value: '5', label: 'Imtixaanka Sugaya', color: '#7c3aed', bg: '#ede9fe' },
];

const RECENT_NOTICES = [
  { icon: 'alert-circle', text: 'Grade 5A: 4 arday oo xaadir maahan', color: '#e11d48', time: '10 daq' },
  { icon: 'card', text: '27 arday oo lacag bixinta daahay', color: '#b45309', time: '1 sac' },
  { icon: 'document-text', text: '3 macalin oo casharrada gudbin waayay', color: '#7c3aed', time: '2 sac' },
];

function SchoolAdminOverview() {
  const [activeBranch, setActiveBranch] = useState(0);
  const [search, setSearch] = useState('');
  const { width } = useWindowDimensions();
  const cols = width > 700 ? 3 : 2;

  const filtered = CLASSES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }} showsVerticalScrollIndicator={false}>

      {/* School info card */}
      <LinearGradient colors={['#0A2E6B', '#1E4F96']} style={styles.schoolCard}>
        <View style={styles.schoolCardRow}>
          <View style={styles.schoolLogoCircle}>
            <Ionicons name="school" size={28} color="#0A2E6B" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.schoolCardName}>Dugsigaaga</Text>
            <View style={{ flexDirection: 'row', gap: 14, marginTop: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="home" size={13} color="rgba(255,255,255,0.75)" />
                <Text style={styles.schoolCardStat}>{CLASSES.length} Fasal</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="people" size={13} color="rgba(255,255,255,0.75)" />
                <Text style={styles.schoolCardStat}>{CLASSES.reduce((a, c) => a + c.students, 0)} Arday</Text>
              </View>
            </View>
          </View>
          <Pressable style={styles.newClassBtn}>
            <Ionicons name="add" size={14} color="#fff" />
            <Text style={styles.newClassBtnText}>Fasal Cusub</Text>
          </Pressable>
        </View>

        {/* Branch switcher */}
        <View style={styles.branchRow}>
          {SCHOOL_BRANCHES.map((b, i) => (
            <Pressable key={b} onPress={() => setActiveBranch(i)}
              style={[styles.branchChip, activeBranch === i && styles.branchChipActive]}>
              {activeBranch === i && <Ionicons name="checkmark-circle" size={12} color="#fff" style={{ marginRight: 4 }} />}
              <Text style={[styles.branchChipText, activeBranch === i && styles.branchChipTextActive]}>{b}</Text>
            </Pressable>
          ))}
        </View>
      </LinearGradient>

      {/* Stat cards row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingVertical: 16 }}>
        {STAT_CARDS.map((s) => (
          <View key={s.label} style={[styles.statPill, { backgroundColor: s.bg }]}>
            <View style={[styles.statPillIcon, { backgroundColor: `${s.color}22` }]}>
              <Ionicons name={s.icon} size={16} color={s.color} />
            </View>
            <Text style={[styles.statPillValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statPillLabel}>{s.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Quick actions */}
      <View style={styles.sectionWrap}>
        <Text style={styles.sectionHeader}>Ficilada Degdega ah</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {[
            { icon: 'person-add-outline', label: 'Arday Cusub', g: ['#0A2E6B','#1E4F96'] },
            { icon: 'card-outline', label: 'Lacag Qaado', g: ['#16a34a','#15803d'] },
            { icon: 'megaphone-outline', label: 'Dir Ogeysiis', g: ['#7c3aed','#6d28d9'] },
            { icon: 'document-text-outline', label: 'Imtixaan Samee', g: ['#0891b2','#0e7490'] },
            { icon: 'people-outline', label: 'Macalin Dar', g: ['#b45309','#92400e'] },
            { icon: 'bar-chart-outline', label: 'Warbixinta', g: ['#e11d48','#be123c'] },
          ].map((a) => (
            <Pressable key={a.label} style={{ alignItems: 'center', gap: 6 }}>
              <LinearGradient colors={a.g} style={styles.qaIcon}>
                <Ionicons name={a.icon} size={20} color="#fff" />
              </LinearGradient>
              <Text style={styles.qaLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Classes section */}
      <View style={styles.sectionWrap}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={styles.sectionHeader}>Fasallada:</Text>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={13} color="#94a3b8" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Raadi fasal..."
              placeholderTextColor="#94a3b8"
              style={styles.searchInput}
            />
          </View>
        </View>

        <View style={styles.classGrid}>
          {filtered.map((cls) => (
            <View key={cls.name} style={[styles.classCard, { width: `${Math.floor(100 / cols) - 2}%` }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.className}>{cls.name}</Text>
                <Pressable>
                  <Ionicons name="ellipsis-vertical" size={14} color="#94a3b8" />
                </Pressable>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                <Ionicons name="people" size={12} color="#64748b" />
                <Text style={styles.classStudentCount}>{cls.students}</Text>
              </View>
              <Text style={styles.classTeacher} numberOfLines={1}>{cls.teacher}</Text>
              <Pressable style={styles.furFasalBtn}>
                <LinearGradient colors={['#16a34a','#15803d']} style={styles.furFasalGrad}>
                  <Text style={styles.furFasalText}>FUR FASAL</Text>
                </LinearGradient>
              </Pressable>
            </View>
          ))}
        </View>
      </View>

      {/* Recent alerts */}
      <View style={[styles.sectionWrap, { marginBottom: 32 }]}>
        <Text style={styles.sectionHeader}>Ogeysiisyada Cusub</Text>
        {RECENT_NOTICES.map((n, i) => (
          <View key={i} style={styles.noticeRow}>
            <View style={[styles.noticeIcon, { backgroundColor: `${n.color}18` }]}>
              <Ionicons name={n.icon} size={16} color={n.color} />
            </View>
            <Text style={styles.noticeText}>{n.text}</Text>
            <Text style={styles.noticeTime}>{n.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default function SchoolAdminDashboard({ route }) {
  const user = route.params.user;

  return (
    <DashboardShell
      user={user}
      roleLabelKey="role_school_admin"
      pages={[
        <SchoolAdminOverview />,
        <SectionPlaceholder titleKey="students" icon="people" gradient={Gradients.brand} />,
        <AttendanceSection />,
        <ExamsSection />,
        <LessonPrepSection title="Diyaarinta Casharada" subtitle="Dib u eeg oo ansix qorshayaasha casharka ee macalimiiintu gudbiyen." />,
        <PaymentsSection variant="admin" />,
        <MessagingSection />,
        <PermissionsSection />,
        <SubscriptionSection />,
        <SettingsPage user={user} roleLabelKey="role_school_admin" />,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  // School card
  schoolCard: { paddingTop: 20, paddingHorizontal: 16, paddingBottom: 0 },
  schoolCardRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  schoolLogoCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  schoolCardName: { fontSize: 17, fontWeight: '800', color: '#fff' },
  schoolCardStat: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  newClassBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#16a34a', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
  },
  newClassBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // Branch switcher
  branchRow: { flexDirection: 'row', gap: 8, paddingBottom: 14 },
  branchChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  branchChipActive: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  branchChipText: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },
  branchChipTextActive: { color: '#fff' },

  // Stats
  statsScroll: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  statPill: {
    borderRadius: 16, padding: 14, alignItems: 'center', gap: 4, minWidth: 110,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  statPillIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  statPillValue: { fontSize: 20, fontWeight: '900', marginTop: 4 },
  statPillLabel: { fontSize: 10.5, color: '#64748b', fontWeight: '600', textAlign: 'center' },

  // Quick actions
  sectionWrap: { backgroundColor: '#fff', marginTop: 10, padding: 16 },
  sectionHeader: { fontSize: 15, fontWeight: '800', color: '#0f172a', marginBottom: 14 },
  qaIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  qaLabel: { fontSize: 11, fontWeight: '600', color: '#374151', textAlign: 'center', maxWidth: 60 },

  // Search
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#f8fafc', borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0',
    paddingHorizontal: 10, paddingVertical: 6, flex: 1, marginLeft: 12,
  },
  searchInput: { flex: 1, fontSize: 12, color: '#0f172a', outlineStyle: 'none' },

  // Class grid
  classGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: '2%' },
  classCard: {
    backgroundColor: '#f8fafc', borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  className: { fontSize: 13, fontWeight: '800', color: '#0f172a' },
  classStudentCount: { fontSize: 11, color: '#64748b', fontWeight: '600' },
  classTeacher: { fontSize: 10.5, color: '#94a3b8', marginTop: 2 },
  furFasalBtn: { marginTop: 10, borderRadius: 8, overflow: 'hidden' },
  furFasalGrad: { paddingVertical: 7, alignItems: 'center' },
  furFasalText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  // Notices
  noticeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9',
  },
  noticeIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  noticeText: { flex: 1, fontSize: 12.5, color: '#374151', fontWeight: '500' },
  noticeTime: { fontSize: 10.5, color: '#94a3b8', fontWeight: '500' },
});
