import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from './AppCard';
import AppButton from './AppButton';
import Avatar from './Avatar';
import PermissionBadge from './PermissionBadge';
import { Colors, Gradients } from '../constants/colors';
import { Text as TextStyles, Spacing } from '../constants/text';

const ROLE_TINTS = {
  school_admin: Colors.primary, teacher: Colors.primaryLight, accountant: Colors.accent, parent: Colors.success, student: Colors.muted,
};

const STAFF = [
  {
    name: 'Teacher Amina Yusuf', role: 'teacher', assignedClass: 'Grade 5 - A', subject: 'Mathematics',
    permissions: ['students.view', 'attendance.view', 'attendance.mark', 'exams.view', 'exams.create', 'lessons.create', 'messages.send'],
  },
  {
    name: 'Faadumo Cabdi (Accountant)', role: 'accountant', assignedClass: null, subject: null,
    permissions: ['payments.view', 'payments.create', 'payments.update', 'students.view', 'reports.view'],
  },
  {
    name: 'Cali Xasan (School Admin)', role: 'school_admin', assignedClass: null, subject: null,
    permissions: ['students.view', 'students.create', 'students.update', 'attendance.view', 'exams.create', 'payments.view', 'reports.view'],
  },
];

function StaffCard({ member }) {
  const tint = ROLE_TINTS[member.role] || Colors.muted;
  return (
    <AppCard style={{ gap: 14 }}>
      <View style={styles.row}>
        <Avatar name={member.name} size={50} gradient={Gradients.brand} />
        <View style={{ flex: 1 }}>
          <Text style={TextStyles.h2}>{member.name}</Text>
          <View style={[styles.roleChip, { backgroundColor: `${tint}1A` }]}>
            <Text style={[styles.roleText, { color: tint }]}>{member.role.replace('_', ' ')}</Text>
          </View>
        </View>
      </View>
      {(member.assignedClass || member.subject) && (
        <View style={styles.metaRow}>
          {member.assignedClass && (
            <View style={styles.metaItem}>
              <Ionicons name="easel-outline" size={14} color={Colors.muted} />
              <Text style={TextStyles.bodyMuted}>{member.assignedClass}</Text>
            </View>
          )}
          {member.subject && (
            <View style={styles.metaItem}>
              <Ionicons name="book-outline" size={14} color={Colors.muted} />
              <Text style={TextStyles.bodyMuted}>{member.subject}</Text>
            </View>
          )}
        </View>
      )}
      <View>
        <Text style={[TextStyles.caption, { color: Colors.muted, marginBottom: 8 }]}>Permissions</Text>
        <View style={styles.badgeWrap}>
          {member.permissions.map((p) => <PermissionBadge key={p} label={p} />)}
        </View>
      </View>
    </AppCard>
  );
}

// School-admin "staff & permissions" placeholder — assigning roles,
// classes/subjects (for teachers) and granular permission badges.
export default function PermissionsSection({ staff = STAFF }) {
  return (
    <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={TextStyles.h1}>Staff & permissions</Text>
          <Text style={TextStyles.bodyMuted}>Add staff, assign classes/subjects and grant exactly the access each role needs.</Text>
        </View>
        <AppButton label="Add staff member" icon={<Ionicons name="person-add-outline" size={16} color="#fff" />} variant="primary" gradient={[Colors.primary, Colors.primaryLight]} />
      </View>

      <AppCard style={styles.formPreview}>
        <Text style={[TextStyles.caption, { color: Colors.muted, marginBottom: 10 }]}>New staff form (preview)</Text>
        <View style={styles.formGrid}>
          {['Full name', 'Profile photo', 'Role', 'Phone', 'Email', 'Assigned class (teachers)', 'Assigned subject (teachers)', 'Permissions'].map((field) => (
            <View key={field} style={styles.formField}>
              <Ionicons name="create-outline" size={13} color={Colors.muted} />
              <Text style={[TextStyles.caption, { color: Colors.muted }]}>{field}</Text>
            </View>
          ))}
        </View>
      </AppCard>

      {staff.map((member, i) => <StaffCard key={i} member={member} />)}

      <AppCard style={styles.placeholderNote}>
        <Ionicons name="construct-outline" size={16} color={Colors.muted} />
        <Text style={[TextStyles.caption, { color: Colors.muted, flex: 1 }]}>
          Placeholder roster — creating real accounts, photo uploads and saving granular permissions to Supabase land with the backend permissions module.
        </Text>
      </AppCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.md, paddingBottom: Spacing.xl },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  roleChip: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginTop: 5 },
  roleText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badgeWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  formPreview: {},
  formGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  formField: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, minWidth: 150 },
  placeholderNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
});
