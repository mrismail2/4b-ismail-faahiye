import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useAppData } from '../context/AppDataContext';

export default function PhaseDetailScreen({ route, navigation }) {
  const { phase } = route.params;
  const { appData, updatePhase, updateAppData } = useAppData();
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      const newTask = {
        id: `task_${Date.now()}`,
        title: newTaskTitle,
        description: '',
        status: 'pending',
        priority: 'medium',
        assignee: newTaskAssignee || 'Unassigned',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      };

      const updatedPhase = {
        ...phase,
        tasks: [...(phase.tasks || []), newTask],
      };

      await updatePhase(phase.id, updatedPhase);
      setNewTaskTitle('');
      setNewTaskAssignee('');
      setShowAddTaskModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add task');
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    const updatedTasks = (phase.tasks || []).map(t =>
      t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
    );
    await updatePhase(phase.id, { ...phase, tasks: updatedTasks });
  };

  const handleDeleteTask = async (taskId) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updatedTasks = (phase.tasks || []).filter(t => t.id !== taskId);
          await updatePhase(phase.id, { ...phase, tasks: updatedTasks });
        },
      },
    ]);
  };

  const getStatusColor = status => {
    const colors = {
      pending: '#FEF3C7',
      in_progress: '#DBEAFE',
      completed: '#DCFCE7',
    };
    return colors[status] || '#F3F4F6';
  };

  const getStatusTextColor = status => {
    const colors = {
      pending: '#92400E',
      in_progress: '#0369A1',
      completed: '#16A34A',
    };
    return colors[status] || '#6B7280';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { backgroundColor: phase.color }]}>
        <Text style={styles.title}>{phase.name}</Text>
        <Text style={styles.section}>{phase.section.toUpperCase()}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Status</Text>
            <View style={[styles.badge, { backgroundColor: getStatusColor(phase.status) }]}>
              <Text style={[styles.badgeText, { color: getStatusTextColor(phase.status) }]}>
                {phase.status}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Owner</Text>
            <Text style={styles.value}>{phase.owner}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Progress</Text>
            <Text style={styles.value}>{phase.progress}%</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Start Date</Text>
            <Text style={styles.value}>{new Date(phase.startDate).toLocaleDateString()}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>End Date</Text>
            <Text style={styles.value}>{new Date(phase.endDate).toLocaleDateString()}</Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${phase.progress}%`, backgroundColor: phase.color },
                ]}
              />
            </View>
          </View>

          <Text style={styles.description}>{phase.description}</Text>
        </View>

        <View style={styles.tasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tasks ({phase.tasks?.length || 0})</Text>
            <TouchableOpacity
              style={styles.addTaskBtn}
              onPress={() => setShowAddTaskModal(true)}
            >
              <Text style={styles.addTaskText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {(!phase.tasks || phase.tasks.length === 0) ? (
            <View style={styles.emptyTasks}>
              <Text style={styles.emptyText}>No tasks yet. Add one to get started!</Text>
            </View>
          ) : (
            phase.tasks.map(task => (
              <View key={task.id} style={styles.taskCard}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('TaskDetail', { task, phase })}
                  style={styles.taskContent}
                >
                  <View style={styles.taskHeader}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                      <Text style={styles.priorityText}>{task.priority}</Text>
                    </View>
                  </View>

                  <Text style={styles.taskAssignee}>Assigned to: {task.assignee}</Text>

                  <View style={styles.taskFooter}>
                    <Text style={styles.dueDate}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                      <Text style={[styles.statusText, { color: getStatusTextColor(task.status) }]}>
                        {task.status}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <View style={styles.taskActions}>
                  {task.status !== 'completed' && (
                    <TouchableOpacity
                      onPress={() => handleUpdateTaskStatus(task.id, 'completed')}
                      style={[styles.actionBtn, styles.completeBtn]}
                    >
                      <Text style={styles.actionBtnText}>✓</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => handleDeleteTask(task.id)}
                    style={[styles.actionBtn, styles.deleteBtn]}
                  >
                    <Text style={styles.actionBtnText}>×</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      <Modal visible={showAddTaskModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Task</Text>

            <Text style={styles.inputLabel}>Task Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter task title"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />

            <Text style={styles.inputLabel}>Assignee</Text>
            <TextInput
              style={styles.input}
              placeholder="Assign to (optional)"
              value={newTaskAssignee}
              onChangeText={setNewTaskAssignee}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setNewTaskTitle('');
                  setNewTaskAssignee('');
                  setShowAddTaskModal(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleAddTask}>
                <Text style={styles.submitButtonText}>Create Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const getPriorityColor = priority => {
  const colors = {
    low: '#D1D5DB',
    medium: '#FCD34D',
    high: '#FCA5A5',
  };
  return colors[priority] || '#D1D5DB';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressBarContainer: {
    marginVertical: 12,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 12,
    lineHeight: 18,
  },
  tasksSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addTaskBtn: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addTaskText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyTasks: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    flexDirection: 'row',
  },
  taskContent: {
    flex: 1,
    padding: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1F2937',
  },
  taskAssignee: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeBtn: {
    backgroundColor: '#DCFCE7',
  },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
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
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
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
