import React from 'react';
import { Colors, Gradients } from '../../constants/colors';
import DashboardShell from '../../widgets/DashboardShell';
import OverviewPage from '../../widgets/OverviewPage';
import StatCard from '../../widgets/StatCard';
import HighlightBanner from '../../widgets/HighlightBanner';
import SectionPlaceholder from '../../widgets/SectionPlaceholder';
import SettingsPage from '../../widgets/SettingsPage';

// Order mirrors navItemsForRole(super_admin): Dashboard, Students, Payments, Risk Score, Settings.
export default function SuperAdminDashboard({ route }) {
  const user = route.params.user;

  return (
    <DashboardShell
      user={user}
      roleLabelKey="role_super_admin"
      pages={[
        <OverviewPage
          titleKey="overview"
          stats={[
            <StatCard label="Schools on platform" value="31" icon="business" tint={Colors.primaryLight} trend="+4 this term" trendUp />,
            <StatCard label="Pending school requests" value="6" icon="hourglass" tint={Colors.accent} trend="review needed" trendUp={false} />,
            <StatCard label="Active students" value="11,204" icon="people" tint={Colors.success} trend="+318" trendUp />,
            <StatCard label="Schools on trial" value="9" icon="ribbon" tint={Colors.primary} trend="free month" trendUp />,
          ]}
          highlight={
            <HighlightBanner
              title="Platform health check"
              message="6 new school requests are waiting for approval, and 2 schools have subscriptions ending this week."
              icon="shield-checkmark"
              gradient={Gradients.brand}
              actionLabel="Review requests"
            />
          }
        />,
        <SectionPlaceholder titleKey="students" icon="people" gradient={Gradients.growth} />,
        <SectionPlaceholder titleKey="payments" icon="card" gradient={Gradients.gold} />,
        <SectionPlaceholder titleKey="riskScore" icon="analytics" gradient={Gradients.riskHigh} />,
        <SettingsPage user={user} roleLabelKey="role_super_admin" />,
      ]}
    />
  );
}
