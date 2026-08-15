import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppDataProvider } from './src/context/AppDataContext';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { initializeAppData } from './src/services/dataRepository';

export default function App() {
  useEffect(() => {
    initializeAppData().catch(err => console.error('Failed to initialize app data:', err));
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppDataProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          <StatusBar barStyle="dark-content" />
        </AppDataProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
