import AsyncStorage from '@react-native-async-storage/async-storage';
import { seedInitialData } from '../data/seedData';

const STORAGE_KEY = 'phase_manager_app_data_v1';

export const initializeAppData = async () => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    if (!existing) {
      const initialData = seedInitialData();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
  } catch (error) {
    console.error('Failed to initialize app data:', error);
    throw error;
  }
};

export const loadAppData = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    const initialData = seedInitialData();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  } catch (error) {
    console.error('Failed to load app data:', error);
    throw error;
  }
};

export const saveAppData = async (data) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save app data:', error);
    throw error;
  }
};

export const clearAppData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear app data:', error);
    throw error;
  }
};

export const getPhasesByRole = (appData, userRole) => {
  if (!appData?.phases) return [];

  const roleAccessMap = {
    admin: ['all'],
    manager: ['planning', 'execution', 'monitoring'],
    coordinator: ['execution', 'monitoring'],
    viewer: ['monitoring'],
  };

  const allowedSections = roleAccessMap[userRole] || [];
  if (allowedSections.includes('all')) {
    return appData.phases;
  }

  return appData.phases.filter(phase =>
    allowedSections.includes(phase.section)
  );
};

export const getTasksByPhase = (appData, phaseId) => {
  const phase = appData?.phases?.find(p => p.id === phaseId);
  return phase?.tasks || [];
};

export const addTaskToPhase = async (appData, phaseId, taskData) => {
  const phases = (appData?.phases || []).map(phase => {
    if (phase.id === phaseId) {
      return {
        ...phase,
        tasks: [
          ...(phase.tasks || []),
          {
            id: `task_${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'pending',
            ...taskData,
          },
        ],
      };
    }
    return phase;
  });

  const updated = { ...appData, phases };
  await saveAppData(updated);
  return updated;
};

export const updateTaskStatus = async (appData, phaseId, taskId, status) => {
  const phases = (appData?.phases || []).map(phase => {
    if (phase.id === phaseId) {
      return {
        ...phase,
        tasks: (phase.tasks || []).map(task =>
          task.id === taskId ? { ...task, status, updatedAt: new Date().toISOString() } : task
        ),
      };
    }
    return phase;
  });

  const updated = { ...appData, phases };
  await saveAppData(updated);
  return updated;
};
