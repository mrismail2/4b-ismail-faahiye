import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { getPhasesByRole } from '../services/dataRepository';

export default function PlanningScreen({ navigation }) {
  const { appData, addPhase } = useAppData();
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPhaseName, setNewPhaseName] = useState('');

  const planningPhases = useMemo(() => {
    const phases = getPhasesByRole(appData, user?.role);
    return phases.filter(p => p.section === 'planning');
  }, [appData, user?.role]);

  const handleAddPhase = async () => {
    if (!newPhaseName.trim()) {
      Alert.alert('Error', 'Please enter a phase name');
      return;
    }

    try {
      await addPhase({
        name: newPhaseName,
        section: 'planning',
        description: 'New planning phase',
        status: 'pending',
        progress: 0,
        owner: user?.name || 'Unassigned',
        color: '#3B82F6',
        icon: 'calendar',
        tasks: [],
      });
      setNewPhaseName('');
      setShowAddModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add phase');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Planning Phase</Text>
        <Text style={styles.subtitle}>Organize and prepare for execution</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
        <Text style={styles.addButtonText}>+ Add New Phase</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {planningPhases.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No planning phases yet</Text>
            <Text style={styles.emptyText}>Create your first planning phase to get started</Text>
          </View>
        ) : (
          planningPhases.map(phase => (
            <TouchableOpacity
              key={phase.id}
              style={styles.phaseCard}
              onPress={() => navigation.navigate('PhaseDetail', { phase })}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardTitle}>
                  <Text style={styles.phaseName}>{phase.name}</Text>
                  <Text style={styles.phaseDate}>
                    {new Date(phase.startDate).toLocaleDateString()} -{' '}
                    {new Date(phase.endDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: '#DBEAFE' }]}>
                  <Text style={[styles.badgeText, { color: '#0369A1' }]}>{phase.status}</Text>
                </View>
              </View>

              <Text style={styles.phaseDescription}>{phase.description}</Text>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${phase.progress}%`, backgroundColor: phase.color },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{phase.progress}%</Text>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Tasks</Text>
                  <Text style={styles.statValue}>{phase.tasks?.length || 0}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Owner</Text>
                  <Text style={styles.statValue}>{phase.owner.split(' ')[0]}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Planning Phase</Text>

            <TextInput
              style={styles.input}
              placeholder="Phase name"
              value={newPhaseName}
              onChangeText={setNewPhaseName}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setNewPhaseName('');
                  setShowAddModal(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleAddPhase}>
                <Text style={styles.submitButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#3B82F6',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#DBEAFE',
    marginTop: 4,
  },
  addButton: {
    margin: 16,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  phaseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    flex: 1,
  },
  phaseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  phaseDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  phaseDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    minWidth: 30,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#1F2937',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
