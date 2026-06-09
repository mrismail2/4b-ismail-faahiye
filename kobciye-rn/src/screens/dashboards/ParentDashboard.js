import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Gradients } from '../../constants/colors';
import DashboardShell from '../../widgets/DashboardShell';
import SectionPlaceholder from '../../widgets/SectionPlaceholder';
import AttendanceSection from '../../widgets/AttendanceSection';
import ExamsSection from '../../widgets/ExamsSection';
import PaymentsSection from '../../widgets/PaymentsSection';
import MessagingSection from '../../widgets/MessagingSection';
import TeacherProfileCard from '../../widgets/TeacherProfileCard';

const CHILDREN = [
  {
    id: 'yusuf', name: 'Yusuf Maxamed', grade: 'Form 5A', color: '#0A2E6B',
    attendance: '96%', attendanceTrend: '+2%',
    exams: [
      { subject: 'Xisaab', score: 88, total: 100 },
      { subject: 'Sayniska', score: 74, total: 100 },
      { subject: 'Af Soomaali', score: 92, total: 100 },
    ],
    fees: { paid: '$150', due: '$0', status: 'Bixiyay' },
    teacher: 'Macalin Amina Yuusuf',
    notice: 'Yusuf toddobaadkii wuxuu si fiican u dhameeyay — xaadir buuxa, natiijaduna wanaagsan.',
  },
  {
    id: 'hibo', name: 'Hibo Maxamed', grade: 'Form 3B', color: '#16a34a',
    attendance: '88%', attendanceTrend: '-3%',
    exams: [
      { subject: 'Xisaab', score: 72, total: 100 },
      { subject: 'Sayniska', score: 81, total: 100 },
      { subject: 'Af Soomaali', score: 85, total: 100 },
    ],
    fees: { paid: '$120', due: '$30', status: 'Haray' },
    teacher: 'Macalin Sahra Maxamed',
    notice: 'Hibo waxay u baahan tahay diirada Xisaabta — macalinka ayaa kala hadlay.',
  },
  {
    id: 'axmed', name: 'Axmed Maxamed', grade: 'Form 1C', color: '#0891b2',
    attendance: '100%', attendanceTrend: 'Buuxa',
    exams: [
      { subject: 'Xisaab', score: 95, total: 100 },
      { subject: 'Sayniska', score: 90, total: 100 },
      { subject: 'Af Soomaali', score: 88, total: 100 },
    ],
    fees: { paid: '$100', due: '$0', status: 'Bixiyay' },
    teacher: 'Macalin Bile Cali',
    notice: 'Axmed waa arday ku dhaqan oo wax ku ool ah — natiijaduna heer sare.',
  },
];

function ParentOverview() {
  const [activeId, setActiveId] = useState('yusuf');
  const child = CHILDREN.find(c => c.id === activeId);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <LinearGradient colors={['#0A2E6B', '#1E4F96']} style={styles.header}>
        <Text style={styles.headerTitle}>Macluumaadka Caruurta</Text>
        <Text style={styles.headerSub}>Xulo ilmaha aad doonayso inaad arayso</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 14 }}
          contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
          {CHILDREN.map((c) => (
            <Pressable key={c.id} onPress={() => setActiveId(c.id)}
              style={[styles.childChip, activeId === c.id && { backgroundColor: '#16a34a', borderColor: '#16a34a' }]}>
              <View style={[styles.childAvatar, { backgroundColor: `${c.color}55` }]}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#fff' }}>{c.name[0]}</Text>
              </View>
              <View>
                <Text style={[styles.childChipName, activeId === c.id && { color: '#fff' }]}>{c.name.split(' ')[0]}</Text>
                <Text style={[styles.childChipGrade, activeId === c.id && { color: 'rgba(255,255,255,0.8)' }]}>{c.grade}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Child profile card */}
      <View style={styles.childCard}>
        <View style={styles.childCardLeft}>
          <LinearGradient colors={[child.color, `${child.color}bb`]} style={styles.childBigAvatar}>
            <Text style={{ fontSize: 22, fontWeight: '900', color: '#fff' }}>{child.name[0]}</Text>
          </LinearGradient>
          <View>
            <Text style={styles.childCardName}>{child.name}</Text>
            <View style={[styles.gradeBadge, { backgroundColor: `${child.color}18` }]}>
              <Ionicons name="school" size={11} color={child.color} />
              <Text style={[styles.gradeBadgeText, { color: child.color }]}>{child.grade}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.attendanceBadge, { backgroundColor: `${child.color}18` }]}>
          <Text style={[styles.attendancePct, { color: child.color }]}>{child.attendance}</Text>
          <Text style={styles.attendanceLbl}>Xaadir</Text>
        </View>
      </View>

      {/* Quick actions */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>Ficilada Degdega ah</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
          {[
            { icon: 'checkbox-outline', label: 'Xaadiristii', g: ['#16a34a','#15803d'] },
            { icon: 'document-text-outline', label: 'Imtixaanka', g: ['#7c3aed','#6d28d9'] },
            { icon: 'card-outline', label: 'Lacagta', g: ['#0891b2','#0e7490'] },
            { icon: 'chatbubble-outline', label: 'Farriin Dir', g: ['#CFAD5E','#b45309'] },
          ].map((a) => (
            <Pressable key={a.label} style={{ alignItems: 'center', gap: 6 }}>
              <LinearGradient colors={a.g} style={styles.qaBtn}>
                <Ionicons name={a.icon} size={20} color="#fff" />
              </LinearGradient>
              <Text style={styles.qaLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Exam results */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>Natiijada Imtixaanka</Text>
        {child.exams.map((e) => (
          <View key={e.subject} style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text style={styles.examSubject}>{e.subject}</Text>
              <Text style={[styles.examScore, {
                color: e.score >= 85 ? '#16a34a' : e.score >= 70 ? '#b45309' : '#e11d48'
              }]}>{e.score}/{e.total}</Text>
            </View>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, {
                width: `${e.score}%`,
                backgroundColor: e.score >= 85 ? '#16a34a' : e.score >= 70 ? '#b45309' : '#e11d48',
              }]} />
            </View>
          </View>
        ))}
      </View>

      {/* Fees */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>Xaaladda Lacagta</Text>
        <View style={styles.feesCard}>
          <View style={styles.feeItem}>
            <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
            <View>
              <Text style={styles.feeValue}>{child.fees.paid}</Text>
              <Text style={styles.feeLabel}>La bixiyay</Text>
            </View>
          </View>
          <View style={styles.feeDivider} />
          <View style={styles.feeItem}>
            <Ionicons name={child.fees.due === '$0' ? 'checkmark-circle' : 'alert-circle'} size={20}
              color={child.fees.due === '$0' ? '#16a34a' : '#e11d48'} />
            <View>
              <Text style={[styles.feeValue, { color: child.fees.due === '$0' ? '#16a34a' : '#e11d48' }]}>
                {child.fees.due}
              </Text>
              <Text style={styles.feeLabel}>Hadhay</Text>
            </View>
          </View>
          <View style={[styles.feeStatusBadge,
            { backgroundColor: child.fees.due === '$0' ? '#dcfce7' : '#fee2e2', marginLeft: 'auto' }]}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: child.fees.due === '$0' ? '#16a34a' : '#e11d48' }}>
              {child.fees.status}
            </Text>
          </View>
        </View>
      </View>

      {/* Teacher note */}
      <View style={[styles.sectionBox, { marginBottom: 32 }]}>
        <Text style={styles.sectionTitle}>Faallo Macalinka</Text>
        <View style={styles.noticeCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <View style={[styles.teacherAvatar, { backgroundColor: `${child.color}22` }]}>
              <Ionicons name="person" size={14} color={child.color} />
            </View>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#0f172a' }}>{child.teacher}</Text>
          </View>
          <Text style={{ fontSize: 13, color: '#374151', lineHeight: 20 }}>{child.notice}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function ChildTeacherPage() {
  return (
    <ScrollView contentContainerStyle={{ gap: 16, padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={{ gap: 4 }}>
        <Text style={{ fontSize: 22, fontWeight: '900', color: '#0f172a' }}>Macalinka Ilmaha</Text>
        <Text style={{ fontSize: 13, color: '#64748b', lineHeight: 20 }}>
          Macalinka fasalka iyo macalimaha maaddooyinka — farriin u dir xilligasta.
        </Text>
      </View>
      <TeacherProfileCard name="Macalin Amina Yuusuf" subject="Xisaab" responsibility="Macalinka fasalka" className="Form 5A" />
      <TeacherProfileCard name="Macalin Sahra Maxamed" subject="Sayniska" responsibility="Macalinka maaddada" className="Form 5A" />
    </ScrollView>
  );
}

export default function ParentDashboard({ route }) {
  const user = route.params.user;
  return (
    <DashboardShell
      user={user}
      roleLabelKey="role_parent"
      pages={[
        <ParentOverview />,
        <AttendanceSection title="Xaadirinta Ilmaha" />,
        <ExamsSection />,
        <PaymentsSection variant="self" />,
        <ChildTeacherPage />,
        <MessagingSection />,
        <SectionPlaceholder titleKey="timeline" icon="time" gradient={Gradients.growth} />,
        <SectionPlaceholder titleKey="notices" icon="megaphone" gradient={Gradients.riskMedium} />,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 20, paddingHorizontal: 16, paddingBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff' },
  headerSub: { fontSize: 12.5, color: 'rgba(255,255,255,0.75)', marginTop: 3 },
  childChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  childAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  childChipName: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.9)' },
  childChipGrade: { fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: '500' },
  childCard: {
    backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12,
    borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#0A2E6B', shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 4 },
    borderWidth: 1, borderColor: '#e2e8f0',
  },
  childCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  childBigAvatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  childCardName: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 5 },
  gradeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  gradeBadgeText: { fontSize: 11, fontWeight: '700' },
  attendanceBadge: { alignItems: 'center', padding: 10, borderRadius: 14 },
  attendancePct: { fontSize: 20, fontWeight: '900' },
  attendanceLbl: { fontSize: 10, color: '#64748b', fontWeight: '600' },
  sectionBox: { backgroundColor: '#fff', marginTop: 10, padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a', marginBottom: 14 },
  qaBtn: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  qaLabel: { fontSize: 10.5, fontWeight: '600', color: '#374151', textAlign: 'center' },
  examSubject: { fontSize: 13, fontWeight: '600', color: '#374151' },
  examScore: { fontSize: 13, fontWeight: '800' },
  progressBg: { height: 6, borderRadius: 3, backgroundColor: '#e2e8f0', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  feesCard: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: '#f8fafc', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#e2e8f0',
  },
  feeItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  feeValue: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  feeLabel: { fontSize: 11, color: '#64748b', fontWeight: '500' },
  feeDivider: { width: 1, height: 36, backgroundColor: '#e2e8f0' },
  feeStatusBadge: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  noticeCard: { backgroundColor: '#f8fafc', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  teacherAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
