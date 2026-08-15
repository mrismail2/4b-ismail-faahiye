import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadAppData, saveAppData } from '../services/dataRepository';

const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      const data = await loadAppData();
      setAppData(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load app data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateAppData = async (updates) => {
    try {
      const newData = { ...appData, ...updates };
      setAppData(newData);
      await saveAppData(newData);
      return newData;
    } catch (err) {
      console.error('Failed to update app data:', err);
      setError(err.message);
      throw err;
    }
  };

  const addPhase = async (phaseData) => {
    if (!appData) return;
    const newPhases = [...(appData.phases || [])];
    const newPhase = {
      id: `phase_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...phaseData,
    };
    newPhases.push(newPhase);
    return updateAppData({ phases: newPhases });
  };

  const updatePhase = async (phaseId, updates) => {
    if (!appData) return;
    const newPhases = (appData.phases || []).map(p =>
      p.id === phaseId ? { ...p, ...updates } : p
    );
    return updateAppData({ phases: newPhases });
  };

  const deletePhase = async (phaseId) => {
    if (!appData) return;
    const newPhases = (appData.phases || []).filter(p => p.id !== phaseId);
    return updateAppData({ phases: newPhases });
  };

  const value = {
    appData,
    loading,
    error,
    updateAppData,
    addPhase,
    updatePhase,
    deletePhase,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
};
