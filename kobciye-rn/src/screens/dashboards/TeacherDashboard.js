import React from 'react';
import { Colors, Gradients } from '../../constants/colors';
import QuickActions from '../../widgets/QuickActions';
import DashboardShell from '../../widgets/DashboardShell';
import OverviewPage from '../../widgets/OverviewPage';
import StatCard from '../../widgets/StatCard';
import HighlightBanner from '../../widgets/HighlightBanner';
import SectionPlaceholder from '../../widgets/SectionPlaceholder';
import SettingsPage from '../../widgets/SettingsPage';
import AttendanceSection from '../../widgets/AttendanceSection';
import ExamsSection from '../../widgets/ExamsSection';
import LessonPrepSection from '../../widgets/LessonPrepSection';
import MessagingSection from '../../widgets/MessagingSection';
import ParentReportsSection from '../../widgets/ParentReportsSection';
import ClassPaymentsSection from '../../widgets/ClassPaymentsSection';

// Order mirrors navItemsForRole(teacher): Dashboard, Classes, Attendance, Exams, Lesson Prep, Payments, Messages, Parent Reports, Notes, Settings.
export default function TeacherDashboard({ route }) {
  const user = route.params.user;

  return (
    <DashboardShell
      user={user}
      roleLabelKey="role_teacher"
      pages={[
        <OverviewPage
          titleKey="overview"
          quickActions={
            <QuickActions actions={[
              { icon: 'checkbox-outline', label: 'Mark Attendance', gradient: ['#0891b2','#0e7490'] },
              { icon: 'document-text-outline', label: 'Upload Marks', gradient: ['#e11d48','#be123c'] },
              { icon: 'book-outline', label: 'Create Lesson', gradient: ['#CFAD5E','#b45309'] },
            ]} />
          }
          stats={[
            <StatCard label="Assigned classes" value="4" icon="easel" tint={Colors.primaryLight} trend="this term" trendUp />,
            <StatCard label="Attendance pending" value="2" icon="checkbox" tint={Colors.accent} trend="today" trendUp={false} />,
            <StatCard label="Exam results pending" value="3" icon="document-text" tint={Colors.primary} trend="to enter" trendUp={false} />,
            <StatCard label="Lesson preps pending" value="2" icon="book" tint={Colors.primaryLight} trend="due Friday" trendUp={false} />,
            <StatCard label="Class fees collected" value="2 / 4" icon="card" tint={Colors.accent} trend="this month" trendUp={false} />,
            <StatCard label="Unread messages" value="6" icon="chatbubble-ellipses" tint={Colors.success} trend="from parents" trendUp />,
            <StatCard label="Students needing attention" value="5" icon="hand-left" tint={Colors.danger} trend="this week" trendUp={false} />,
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
        <AttendanceSection />,
        <ExamsSection />,
        <LessonPrepSection showAddButton title="My lesson preparation" subtitle="Plan and submit lesson prep for your classes — school admin reviews and approves." />,
        <ClassPaymentsSection />,
        <MessagingSection />,
        <ParentReportsSection />,
        <SectionPlaceholder titleKey="notes" icon="document" gradient={Gradients.gold} />,
        <SettingsPage user={user} roleLabelKey="role_teacher" />,
      ]}
    />
  );
}
