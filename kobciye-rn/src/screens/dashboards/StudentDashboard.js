import React from 'react';
import { Colors, Gradients } from '../../constants/colors';
import DashboardShell from '../../widgets/DashboardShell';
import OverviewPage from '../../widgets/OverviewPage';
import StatCard from '../../widgets/StatCard';
import HighlightBanner from '../../widgets/HighlightBanner';
import SectionPlaceholder from '../../widgets/SectionPlaceholder';

// Order mirrors navItemsForRole(student): Dashboard, Attendance, Results, Progress, Notices.
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
            <StatCard label="Qur'an progress" value="Juz' 7" icon="book" tint={Colors.accent} trend="memorizing" trendUp />,
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
        <SectionPlaceholder titleKey="attendance" icon="checkbox" gradient={Gradients.brand} />,
        <SectionPlaceholder titleKey="results" icon="ribbon" gradient={Gradients.growth} />,
        <SectionPlaceholder titleKey="progress" icon="trending-up" gradient={Gradients.gold} />,
        <SectionPlaceholder titleKey="notices" icon="megaphone" gradient={Gradients.riskMedium} />,
      ]}
    />
  );
}
