/* ============================================================
   KAABE — Habka wareegga

   Doorku wuxuu go'aamiyaa waxa la arko:
     · Maamulaha Guud → Guudmar · Fasalada · Macalimiin · Akoon
     · Macalin        → Fasaladayda · Akoon
   ============================================================ */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../context/AppContext';
import { ROLES } from '../services/model';
import { colors } from '../theme/theme';
import { Loading } from '../components/ui';

import AuthScreen from '../screens/auth/AuthScreen';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import ClassesScreen from '../screens/admin/ClassesScreen';
import TeachersScreen from '../screens/admin/TeachersScreen';
import TeacherHomeScreen from '../screens/teacher/TeacherHomeScreen';
import ClassDetailScreen from '../screens/ClassDetailScreen';
import StudentProfileScreen from '../screens/StudentProfileScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const stackOptions = {
  headerStyle: { backgroundColor: colors.primary, elevation: 0, shadowOpacity: 0 },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: { fontWeight: '700' },
};

/* Tab kastaa wuxuu leeyahay stack si fasalka iyo profile-ka ardayga loo furo */
function withClassStack(name, title, Component) {
  return function StackScreen() {
    return (
      <Stack.Navigator screenOptions={stackOptions}>
        <Stack.Screen
          name={name}
          component={Component}
          options={{ title, headerShown: false }}
        />
        <Stack.Screen
          name="ClassDetail"
          component={ClassDetailScreen}
          options={{ title: 'Fasalka' }}
        />
        <Stack.Screen
          name="StudentProfile"
          component={StudentProfileScreen}
          options={{ title: 'Ardayga' }}
        />
      </Stack.Navigator>
    );
  };
}

const AdminHomeStack = withClassStack('AdminHome', 'Guudmar', AdminHomeScreen);
const ClassesStack = withClassStack('Classes', 'Fasalada', ClassesScreen);
const TeachersStack = withClassStack('Teachers', 'Macalimiinta', TeachersScreen);
const TeacherHomeStack = withClassStack('TeacherHome', 'Fasaladayda', TeacherHomeScreen);

const ICONS = {
  Guudmar: 'home',
  Fasalada: 'albums',
  Fasaladayda: 'albums',
  Macalimiin: 'people',
  Akoon: 'person-circle',
};

function tabOptions({ route }) {
  return {
    headerShown: false,
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.muted,
    tabBarStyle: { borderTopColor: colors.line, height: 62, paddingBottom: 9, paddingTop: 7 },
    tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
    tabBarIcon: ({ color, focused }) => {
      const base = ICONS[route.name] || 'ellipse';
      const name = focused ? base : `${base}-outline`;
      return <Ionicons name={name} size={22} color={color} />;
    },
  };
}

function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={tabOptions}>
      <Tab.Screen name="Guudmar" component={AdminHomeStack} />
      <Tab.Screen name="Fasalada" component={ClassesStack} />
      <Tab.Screen name="Macalimiin" component={TeachersStack} />
      <Tab.Screen name="Akoon" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function TeacherTabs() {
  return (
    <Tab.Navigator screenOptions={tabOptions}>
      <Tab.Screen name="Fasaladayda" component={TeacherHomeStack} />
      <Tab.Screen name="Akoon" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { ready, user, store } = useApp();

  if (!ready) return <Loading label="KAABE waa la furayaa…" />;
  if (!user || !store) return <AuthScreen />;

  return user.role === ROLES.SUPER_ADMIN ? <AdminTabs /> : <TeacherTabs />;
}
