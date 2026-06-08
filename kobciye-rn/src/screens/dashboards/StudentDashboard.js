import React from 'react';
import { Colors, Gradients } from '../../constants/colors';
import DashboardShell from '../../widgets/DashboardShell';
import OverviewPage from '../../widgets/OverviewPage';
import StatCard from '../../widgets/StatCard';
import HighlightBanner from '../../widgets/HighlightBanner';
import SectionPlaceholder from '../../widgets/SectionPlaceholder';
import AttendanceSection from '../../widgets/AttendanceSection';
import ExamsSection from '../../widgets/ExamsSection';
import MessagingSection from '../../widgets/MessagingSection';
import TeacherProfileCard from '../../widgets/TeacherProfileCard';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Text as TextStyles, Spacing } from '../../constants/text';

function MyTeacherPage() {
  return (
    <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
      <View style={{ gap: 4 }}>
        <Text style={TextStyles.h1}>My teacher</Text>
        <Text style={TextStyles.bodyMuted}>Your class teacher and subject teachers — message them anytime through Kobciye.</Text>
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
      <TeacherProfileCard
        name="Teacher Cabdiraxman Cali"
        subject="English"
        responsibility="Subject teacher"
        className="Grade 5 - A"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.md, paddingBottom: Spacing.xl },
});

// Order mirrors navItemsForRole(student): Dashboard, Attendance, Exams, Results, My Teacher, Messages, Notices.
export default function StudentDashboard({ route }) {
  const user = route.params.user;

  return (
    <DashboardShell
      user={user}
      roleLabelKey="role_student"
      pages={[
        <OverviewPage
          titleKey="overview"
          stats={[
            <StatCard label="My attendance" value="97%" icon="checkbox" tint={Colors.success} trend="this term" trendUp />,
            <StatCard label="Latest result" value="A-" icon="ribbon" tint={Colors.primaryLight} trend="Mathematics" trendUp />,
            <StatCard label="Payment status" value="Paid" icon="card" tint={Colors.success} trend="up to date" trendUp />,
          ]}
          highlight={
            <HighlightBanner
              title="Keep up the great work! 🌟"
              message="You've had perfect attendance for 3 weeks in a row — your teacher left you an encouraging note."
              icon="trophy"
              gradient={Gradients.gold}
            />
          }
        />,
        <AttendanceSection title="My attendance" />,
        <ExamsSection />,
        <SectionPlaceholder titleKey="results" icon="ribbon" gradient={Gradients.growth} />,
        <MyTeacherPage />,
        <MessagingSection />,
        <SectionPlaceholder titleKey="notices" icon="megaphone" gradient={Gradients.riskMedium} />,
      ]}
    />
  );
}
