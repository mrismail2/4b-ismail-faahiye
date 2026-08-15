import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { useAppData } from '../context/AppDataContext';

export default function TaskDetailScreen({ route, navigation }) {
  const { task, phase } = route.params;
  const { updatePhase } = useAppData();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleStatusChange = async status => {
    const updatedTasks = (phase.tasks || []).map(t =>
      t.id === task.id ? { ...t, status, updatedAt: new Date().toISOString() } : t
    );
    await updatePhase(phase.id, { ...phase, tasks: updatedTasks });
    navigation.goBack();
  };

  const handleSaveEdit = async () => {
    if (!editedTask.title.trim()) {
      Alert.alert('Error', 'Task title cannot be empty');
      return;
    }

    const updatedTasks = (phase.tasks || []).map(t =>
      t.id === task.id ? { ...editedTask, updatedAt: new Date().toISOString() } : t
    );
    await updatePhase(phase.id, { ...phase, tasks: updatedTasks });
    setIsEditing(false);
    Alert.alert('Success', 'Task updated successfully');
  };

  const handleDelete = () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updatedTasks = (phase.tasks || []).filter(t => t.id !== task.id);
          await updatePhase(phase.id, { ...phase, tasks: updatedTasks });
          navigation.goBack();
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

  const getPriorityColor = priority => {
    const colors = {
      low: '#D1D5DB',
      medium: '#FCD34D',
      high: '#FCA5A5',
    };
    return colors[priority] || '#D1D5DB';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(editedTask.status) }]}>
            <Text style={[styles.statusText, { color: getStatusTextColor(editedTask.status) }]}>
              {editedTask.status}
            </Text>
          </View>
          {!isEditing && (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.content}>
        {isEditing ? (
          <>
            <View style={styles.editSection}>
              <Text style={styles.label}>Task Title</Text>
              <TextInput
                style={styles.titleInput}
                value={editedTask.title}
                onChangeText={text => setEditedTask({ ...editedTask, title: text })}
                placeholder="Enter task title"
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.descriptionInput, { textAlignVertical: 'top' }]}
                value={editedTask.description || ''}
                onChangeText={text => setEditedTask({ ...editedTask, description: text })}
                placeholder="Enter task description"
                multiline
                numberOfLines={4}
              />

              <Text style={styles.label}>Assignee</Text>
              <TextInput
                style={styles.input}
                value={editedTask.assignee}
                onChangeText={text => setEditedTask({ ...editedTask, assignee: text })}
                placeholder="Assigned to"
              />

              <Text style={styles.label}>Priority</Text>
              <View style={styles.priorityButtons}>
                {['low', 'medium', 'high'].map(priority => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityBtn,
                      editedTask.priority === priority && styles.priorityBtnActive,
                    ]}
                    onPress={() => setEditedTask({ ...editedTask, priority })}
                  >
                    <Text
                      style={[
                        styles.priorityBtnText,
                        editedTask.priority === priority && styles.priorityBtnTextActive,
                      ]}
                    >
                      {priority}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setEditedTask(task);
                    setIsEditing(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSaveEdit}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.infoCard}>
              <Text style={styles.title}>{editedTask.title}</Text>

              <View style={styles.metadataRow}>
                <View style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>Priority</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(editedTask.priority) }]}>
                    <Text style={styles.priorityText}>{editedTask.priority}</Text>
                  </View>
                </View>

                <View style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>Due Date</Text>
                  <Text style={styles.metadataValue}>
                    {new Date(editedTask.dueDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Assigned To</Text>
                <Text style={styles.infoValue}>{editedTask.assignee}</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Phase</Text>
                <Text style={styles.infoValue}>{phase.name}</Text>
              </View>

              {editedTask.description && (
                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Description</Text>
                  <Text style={styles.infoValue}>{editedTask.description}</Text>
                </View>
              )}

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Created</Text>
                <Text style={styles.infoValue}>
                  {new Date(editedTask.createdAt).toLocaleString()}
                </Text>
              </View>

              {editedTask.updatedAt && (
                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Last Updated</Text>
                  <Text style={styles.infoValue}>
                    {new Date(editedTask.updatedAt).toLocaleString()}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.actionSection}>
              <Text style={styles.actionTitle}>Update Status</Text>
              <View style={styles.statusButtons}>
                {['pending', 'in_progress', 'completed'].map(status => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusBtn,
                      editedTask.status === status && styles.statusBtnActive,
                      { borderColor: getStatusTextColor(status) },
                    ]}
                    onPress={() => handleStatusChange(status)}
                  >
                    <Text
                      style={[
                        styles.statusBtnText,
                        editedTask.status === status && styles.statusBtnTextActive,
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Delete Task</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  editBtn: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    lineHeight: 28,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  metadataItem: {
    flex: 1,
  },
  metadataLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  metadataValue: {
    fontSize: 14,
    color: '#1F2937',
    marginTop: 4,
    fontWeight: '500',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F2937',
  },
  infoSection: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  editSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  priorityBtnActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
  priorityBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  priorityBtnTextActive: {
    color: '#0369A1',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
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
  saveButton: {
    backgroundColor: '#3B82F6',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  actionSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  statusBtnActive: {
    backgroundColor: '#DBEAFE',
  },
  statusBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  statusBtnTextActive: {
    color: '#0369A1',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#DC2626',
    fontWeight: '600',
  },
});
