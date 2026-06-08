import React from 'react';
import { Colors, Gradients } from '../../constants/colors';
import DashboardShell from '../../widgets/DashboardShell';
import OverviewPage from '../../widgets/OverviewPage';
import StatCard from '../../widgets/StatCard';
import HighlightBanner from '../../widgets/HighlightBanner';
import SectionPlaceholder from '../../widgets/SectionPlaceholder';
import SettingsPage from '../../widgets/SettingsPage';

// Order mirrors navItemsForRole(school_admin): Dashboard, Students, Attendance, Payments, Risk Score, Settings.
export default function SchoolAdminDashboard({ route }) {
  const user = route.params.user;

  return (
    <DashboardShell
      user={user}
      roleLabelKey="role_school_admin"
      pages={[
        <OverviewPage
          titleKey="overview"
          stats={[
            <StatCard label="Total students" value="642" icon="people" tint={Colors.primaryLight} trend="+18" trendUp />,
            <StatCard label="Attendance today" value="94%" icon="checkbox" tint={Colors.success} trend="+2.1%" trendUp />,
            <StatCard label="Unpaid fees" value="$3,140" icon="card" tint={Colors.accent} trend="27 students" trendUp={false} />,
            <StatCard label="High-risk students" value="8" icon="warning" tint={Colors.danger} trend="+1" trendUp={false} />,
          ]}
          highlight={
            <HighlightBanner
              title="Needs your attention today"
              message="Grade 5A has 4 students with repeated absences, and 3 teachers haven't submitted attendance yet."
              icon="alert-circle"
              gradient={Gradients.riskHigh}
              actionLabel="View at-risk classes"
            />
          }
        />,
        <SectionPlaceholder titleKey="students" icon="people" gradient={Gradients.brand} />,
        <SectionPlaceholder titleKey="attendance" icon="checkbox" gradient={Gradients.growth} />,
        <SectionPlaceholder titleKey="payments" icon="card" gradient={Gradients.gold} />,
        <SectionPlaceholder titleKey="riskScore" icon="analytics" gradient={Gradients.riskHigh} />,
        <SettingsPage user={user} roleLabelKey="role_school_admin" />,
      ]}
    />
  );
}
