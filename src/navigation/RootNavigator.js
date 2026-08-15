import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import PlanningScreen from '../screens/PlanningScreen';
import ExecutionScreen from '../screens/ExecutionScreen';
import MonitoringScreen from '../screens/MonitoringScreen';
import PhaseDetailScreen from '../screens/PhaseDetailScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const LoginNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

const PlanningStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#3B82F6' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="PlanningList"
        component={PlanningScreen}
        options={{ title: 'Planning Phase' }}
      />
      <Stack.Screen
        name="PhaseDetail"
        component={PhaseDetailScreen}
        options={({ route }) => ({ title: route.params?.phase?.name || 'Phase Details' })}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={({ route }) => ({ title: route.params?.task?.title || 'Task Details' })}
      />
    </Stack.Navigator>
  );
};

const ExecutionStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#10B981' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="ExecutionList"
        component={ExecutionScreen}
        options={{ title: 'Execution Phase' }}
      />
      <Stack.Screen
        name="PhaseDetail"
        component={PhaseDetailScreen}
        options={({ route }) => ({ title: route.params?.phase?.name || 'Phase Details' })}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={({ route }) => ({ title: route.params?.task?.title || 'Task Details' })}
      />
    </Stack.Navigator>
  );
};

const MonitoringStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#F59E0B' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="MonitoringList"
        component={MonitoringScreen}
        options={{ title: 'Monitoring Phase' }}
      />
      <Stack.Screen
        name="PhaseDetail"
        component={PhaseDetailScreen}
        options={({ route }) => ({ title: route.params?.phase?.name || 'Phase Details' })}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={({ route }) => ({ title: route.params?.task?.title || 'Task Details' })}
      />
    </Stack.Navigator>
  );
};

const DashboardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1F2937' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="DashboardList"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen
        name="PhaseDetail"
        component={PhaseDetailScreen}
        options={({ route }) => ({ title: route.params?.phase?.name || 'Phase Details' })}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={({ route }) => ({ title: route.params?.task?.title || 'Task Details' })}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <Icon name="grid" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Planning"
        component={PlanningStack}
        options={{
          tabBarLabel: 'Planning',
          tabBarIcon: ({ color }) => <Icon name="calendar" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Execution"
        component={ExecutionStack}
        options={{
          tabBarLabel: 'Execution',
          tabBarIcon: ({ color }) => <Icon name="zap" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Monitoring"
        component={MonitoringStack}
        options={{
          tabBarLabel: 'Monitoring',
          tabBarIcon: ({ color }) => <Icon name="eye" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const Icon = ({ name, size, color }) => {
  const icons = {
    grid: '◻',
    calendar: '📅',
    zap: '⚡',
    eye: '👁',
  };
  return <Text style={{ fontSize: size, color }}>{icons[name] || '•'}</Text>;
};

import { Text } from 'react-native';

export default function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return isAuthenticated ? <AppNavigator /> : <LoginNavigator />;
}
