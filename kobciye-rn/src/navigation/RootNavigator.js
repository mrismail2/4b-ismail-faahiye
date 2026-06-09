import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import PricingScreen from '../screens/PricingScreen';
import SuperAdminDashboard from '../screens/dashboards/SuperAdminDashboard';
import SchoolAdminDashboard from '../screens/dashboards/SchoolAdminDashboard';
import TeacherDashboard from '../screens/dashboards/TeacherDashboard';
import AccountantDashboard from '../screens/dashboards/AccountantDashboard';
import ParentDashboard from '../screens/dashboards/ParentDashboard';
import StudentDashboard from '../screens/dashboards/StudentDashboard';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

// Wraps each dashboard screen so it always receives the current
// authenticated user as a route param (mirrors the Flutter router's
// `auth.currentUser!` injection at each dashboard route).
function withCurrentUser(ScreenComponent) {
  return function Wrapped(props) {
    const { currentUser } = useAuth();
    return <ScreenComponent {...props} route={{ ...props.route, params: { ...props.route.params, user: currentUser } }} />;
  };
}

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Pricing" component={PricingScreen} />
      <Stack.Screen name="SuperAdminDashboard" component={withCurrentUser(SuperAdminDashboard)} />
      <Stack.Screen name="SchoolAdminDashboard" component={withCurrentUser(SchoolAdminDashboard)} />
      <Stack.Screen name="TeacherDashboard" component={withCurrentUser(TeacherDashboard)} />
      <Stack.Screen name="AccountantDashboard" component={withCurrentUser(AccountantDashboard)} />
      <Stack.Screen name="ParentDashboard" component={withCurrentUser(ParentDashboard)} />
      <Stack.Screen name="StudentDashboard" component={withCurrentUser(StudentDashboard)} />
    </Stack.Navigator>
  );
}
