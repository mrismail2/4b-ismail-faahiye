import React from 'react';
import { Colors, Gradients } from '../../constants/colors';
import DashboardShell from '../../widgets/DashboardShell';
import OverviewPage from '../../widgets/OverviewPage';
import StatCard from '../../widgets/StatCard';
import HighlightBanner from '../../widgets/HighlightBanner';
import SectionPlaceholder from '../../widgets/SectionPlaceholder';
import AttendanceSection from '../../widgets/AttendanceSection';
import ExamsSection from '../../widgets/ExamsSection';
import PaymentsSection from '../../widgets/PaymentsSection';
import MessagingSection from '../../widgets/MessagingSection';
import TeacherProfileCard from '../../widgets/TeacherProfileCard';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Text as TextStyles, Spacing } from '../../constants/text';

function ChildTeacherPage() {
  return (
    <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
      <View style={{ gap: 4 }}>
        <Text style={TextStyles.h1}>Yusuf's teacher</Text>
        <Text style={TextStyles.bodyMuted}>Your child's class teacher and subject teachers — message them anytime through Kobciye.</Text>
      </View>
      <TeacherProfileCard
        name="Teacher Amina Yusuf"
        subject="Mathematics"
        responsibility="Class teacher"
        className="Grade 5 - A"
      />
      <TeacherProfileCard
        name="Teacher Sahra Maxamed"
        subject="Science"
        responsibility="Subject teacher"
        className="Grade 5 - A"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.md, paddingBottom: Spacing.xl },
});

// Order mirrors navItemsForRole(parent): Dashboard, Attendance, Exams, Payments, My Teacher, Messages, Timeline, Notices.
export default function ParentDashboard({ route }) {
  const user = route.params.user;

  return (
    <DashboardShell
      user={user}
      roleLabelKey="role_parent"
      pages={[
        <OverviewPage
          titleKey="overview"
          stats={[
            <StatCard label="Attendance this month" value="96%" icon="checkbox" tint={Colors.success} trend="great" trendUp />,
            <StatCard label="Outstanding fees" value="$0" icon="card" tint={Colors.primaryLight} trend="all clear" trendUp />,
            <StatCard label="Latest exam average" value="88%" icon="ribbon" tint={Colors.accent} trend="+4%" trendUp />,
            <StatCard label="Latest report" value="Today" icon="paper-plane" tint={Colors.success} trend="from class teacher" trendUp />,
          ]}
          highlight={
            <HighlightBanner
              title="Yusuf had a great week 🎉"
              message="Full attendance, a strong exam result, and a kind note from his teacher about helping classmates."
              icon="sparkles"
              gradient={Gradients.growth}
            />
          }
        />,
        <AttendanceSection title="Yusuf's attendance" />,
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
