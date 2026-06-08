import React from 'react';
import { Colors, Gradients } from '../../constants/colors';
import DashboardShell from '../../widgets/DashboardShell';
import OverviewPage from '../../widgets/OverviewPage';
import StatCard from '../../widgets/StatCard';
import HighlightBanner from '../../widgets/HighlightBanner';
import SectionPlaceholder from '../../widgets/SectionPlaceholder';
import SettingsPage from '../../widgets/SettingsPage';
import AttendanceSection from '../../widgets/AttendanceSection';
import ExamsSection from '../../widgets/ExamsSection';
import LessonPrepSection from '../../widgets/LessonPrepSection';
import PaymentsSection from '../../widgets/PaymentsSection';
import PermissionsSection from '../../widgets/PermissionsSection';
import SubscriptionSection from '../../widgets/SubscriptionSection';

// Order mirrors navItemsForRole(school_admin): Dashboard, Students, Attendance, Exams, Lesson Prep, Payments, Permissions, Subscription, Settings.
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
            <StatCard label="Exams pending review" value="5" icon="document-text" tint={Colors.primary} trend="2 due today" trendUp={false} />,
            <StatCard label="Lesson preps pending" value="9" icon="book" tint={Colors.primaryLight} trend="3 overdue" trendUp={false} />,
            <StatCard label="Subscription" value="Trial · 18 days" icon="card" tint={Colors.accent} />,
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
        <AttendanceSection />,
        <ExamsSection />,
        <LessonPrepSection title="Lesson preparation review" subtitle="Review and approve lesson plans submitted by teachers — approve, request changes or send feedback." />,
        <PaymentsSection variant="admin" />,
        <PermissionsSection />,
        <SubscriptionSection />,
        <SettingsPage user={user} roleLabelKey="role_school_admin" />,
      ]}
    />
  );
}
