import React from 'react';
import { Colors, Gradients } from '../../constants/colors';
import DashboardShell from '../../widgets/DashboardShell';
import OverviewPage from '../../widgets/OverviewPage';
import StatCard from '../../widgets/StatCard';
import HighlightBanner from '../../widgets/HighlightBanner';
import SectionPlaceholder from '../../widgets/SectionPlaceholder';

// Order mirrors navItemsForRole(parent): Dashboard, Attendance, Payments, Timeline, Notices.
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
            <StatCard label="Qur'an juz' completed" value="6" icon="book" tint={Colors.success} trend="on track" trendUp />,
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
        <SectionPlaceholder titleKey="attendance" icon="checkbox" gradient={Gradients.brand} />,
        <SectionPlaceholder titleKey="payments" icon="card" gradient={Gradients.gold} />,
        <SectionPlaceholder titleKey="timeline" icon="time" gradient={Gradients.growth} />,
        <SectionPlaceholder titleKey="notices" icon="megaphone" gradient={Gradients.riskMedium} />,
      ]}
    />
  );
}
