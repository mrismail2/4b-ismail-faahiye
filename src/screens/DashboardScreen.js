import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { getPhasesByRole } from '../services/dataRepository';

export default function DashboardScreen({ navigation }) {
  const { appData } = useAppData();
  const { user, logout } = useAuth();

  const visiblePhases = useMemo(() => {
    return getPhasesByRole(appData, user?.role);
  }, [appData, user?.role]);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const getTotalProgress = () => {
    if (visiblePhases.length === 0) return 0;
    const total = visiblePhases.reduce((sum, phase) => sum + (phase.progress || 0), 0);
    return Math.round(total / visiblePhases.length);
  };

  const getStatusCounts = () => {
    const counts = { active: 0, pending: 0, completed: 0 };
    visiblePhases.forEach(phase => {
      counts[phase.status] = (counts[phase.status] || 0) + 1;
    });
    return counts;
  };

  const getTotalTasks = () => {
    return visiblePhases.reduce((sum, phase) => sum + (phase.tasks?.length || 0), 0);
  };

  const statusCounts = getStatusCounts();
  const totalProgress = getTotalProgress();
  const totalTasks = getTotalTasks();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name || user?.id}!</Text>
          <Text style={styles.role}>{user?.role?.toUpperCase()}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.statCard1]}>
          <Text style={styles.statValue}>{visiblePhases.length}</Text>
          <Text style={styles.statLabel}>Phases</Text>
        </View>
        <View style={[styles.statCard, styles.statCard2]}>
          <Text style={styles.statValue}>{totalTasks}</Text>
          <Text style={styles.statLabel}>Total Tasks</Text>
        </View>
        <View style={[styles.statCard, styles.statCard3]}>
          <Text style={styles.statValue}>{totalProgress}%</Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
        <View style={[styles.statCard, styles.statCard4]}>
          <Text style={styles.statValue}>{statusCounts.active || 0}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phase Overview</Text>
        {visiblePhases.map(phase => (
          <TouchableOpacity
            key={phase.id}
            style={styles.phaseCard}
            onPress={() => navigation.navigate('PhaseDetail', { phase })}
          >
            <View style={[styles.phaseHeader, { borderLeftColor: phase.color }]}>
              <View style={styles.phaseInfo}>
                <Text style={styles.phaseName}>{phase.name}</Text>
                <Text style={styles.phaseSection}>{phase.section.toUpperCase()}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      phase.status === 'active'
                        ? '#DBEAFE'
                        : phase.status === 'pending'
                        ? '#FEF3C7'
                        : '#DCFCE7',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        phase.status === 'active'
                          ? '#0369A1'
                          : phase.status === 'pending'
                          ? '#92400E'
                          : '#16A34A',
                    },
                  ]}
                >
                  {phase.status}
                </Text>
              </View>
            </View>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${phase.progress}%`, backgroundColor: phase.color },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{phase.progress}% Complete</Text>

            <Text style={styles.phaseDescription}>{phase.description}</Text>

            <View style={styles.phaseFooter}>
              <Text style={styles.owner}>Owner: {phase.owner}</Text>
              <Text style={styles.taskCount}>{phase.tasks?.length || 0} tasks</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#1F2937',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  role: {
    fontSize: 12,
    color: '#D1D5DB',
    marginTop: 4,
  },
  logoutBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statsGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statCard1: { backgroundColor: '#DBEAFE' },
  statCard2: { backgroundColor: '#DCFCE7' },
  statCard3: { backgroundColor: '#FEF3C7' },
  statCard4: { backgroundColor: '#FCE7F3' },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  phaseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    paddingLeft: 12,
    marginBottom: 12,
  },
  phaseInfo: {
    flex: 1,
  },
  phaseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  phaseSection: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  phaseDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  phaseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  owner: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  taskCount: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
});
