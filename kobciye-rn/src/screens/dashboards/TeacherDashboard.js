import React from 'react';
import { Colors, Gradients } from '../../constants/colors';
import DashboardShell from '../../widgets/DashboardShell';
import OverviewPage from '../../widgets/OverviewPage';
import StatCard from '../../widgets/StatCard';
import HighlightBanner from '../../widgets/HighlightBanner';
import SectionPlaceholder from '../../widgets/SectionPlaceholder';
import SettingsPage from '../../widgets/SettingsPage';

// Order mirrors navItemsForRole(teacher): Dashboard, Classes, Attendance, Notes, Settings.
export default function TeacherDashboard({ route }) {
  const user = route.params.user;

  return (
    <DashboardShell
      user={user}
      roleLabelKey="role_teacher"
      pages={[
        <OverviewPage
          titleKey="overview"
          stats={[
            <StatCard label="Assigned classes" value="4" icon="easel" tint={Colors.primaryLight} trend="this term" trendUp />,
            <StatCard label="Attendance pending" value="2" icon="checkbox" tint={Colors.accent} trend="today" trendUp={false} />,
            <StatCard label="Students needing attention" value="5" icon="hand-left" tint={Colors.danger} trend="this week" trendUp={false} />,
            <StatCard label="Qur'an entries pending" value="11" icon="book" tint={Colors.success} trend="to record" trendUp={false} />,
          ]}
          highlight={
            <HighlightBanner
              title="Wrap up today's attendance"
              message="Grade 3B and Grade 4A still need today's attendance marked before 4:00 PM."
              icon="time"
              gradient={Gradients.brand}
              actionLabel="Mark attendance"
            />
          }
        />,
        <SectionPlaceholder titleKey="classes" icon="easel" gradient={Gradients.growth} />,
        <SectionPlaceholder titleKey="attendance" icon="checkbox" gradient={Gradients.brand} />,
        <SectionPlaceholder titleKey="notes" icon="document" gradient={Gradients.gold} />,
        <SettingsPage user={user} roleLabelKey="role_teacher" />,
      ]}
    />
  );
}
