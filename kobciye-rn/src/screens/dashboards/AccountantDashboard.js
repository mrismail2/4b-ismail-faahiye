import React from 'react';
import { Colors, Gradients } from '../../constants/colors';
import DashboardShell from '../../widgets/DashboardShell';
import OverviewPage from '../../widgets/OverviewPage';
import StatCard from '../../widgets/StatCard';
import HighlightBanner from '../../widgets/HighlightBanner';
import SectionPlaceholder from '../../widgets/SectionPlaceholder';
import SettingsPage from '../../widgets/SettingsPage';
import PaymentsSection from '../../widgets/PaymentsSection';

// Order mirrors navItemsForRole(accountant): Dashboard, Payments, Students, Settings.
export default function AccountantDashboard({ route }) {
  const user = route.params.user;

  return (
    <DashboardShell
      user={user}
      roleLabelKey="role_accountant"
      pages={[
        <OverviewPage
          titleKey="overview"
          stats={[
            <StatCard label="Unpaid students" value="38" icon="person-remove" tint={Colors.danger} trend="-5" trendUp />,
            <StatCard label="Collected this month" value="$9,420" icon="wallet" tint={Colors.success} trend="+$640" trendUp />,
            <StatCard label="Unmatched mobile-money" value="14" icon="phone-portrait" tint={Colors.accent} trend="review needed" trendUp={false} />,
            <StatCard label="Fee promises due" value="7" icon="people-circle" tint={Colors.primaryLight} trend="this week" trendUp />,
          ]}
          highlight={
            <HighlightBanner
              title="Mobile-money matching needs review"
              message="14 incoming payments couldn't be auto-matched to a student this week — a quick check will clear them."
              icon="checkbox"
              gradient={Gradients.gold}
              actionLabel="Review payments"
            />
          }
        />,
        <PaymentsSection variant="admin" />,
        <SectionPlaceholder titleKey="students" icon="people" gradient={Gradients.growth} />,
        <SettingsPage user={user} roleLabelKey="role_accountant" />,
      ]}
    />
  );
}
