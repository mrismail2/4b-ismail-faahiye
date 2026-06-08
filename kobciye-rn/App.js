import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { LocalizationProvider } from './src/context/LocalizationContext';
import { RequestSchoolAccountSheetHost } from './src/widgets/RequestSchoolAccountSheet';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <LocalizationProvider>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <RootNavigator />
            <RequestSchoolAccountSheetHost />
          </NavigationContainer>
        </AuthProvider>
      </LocalizationProvider>
    </SafeAreaProvider>
  );
}
