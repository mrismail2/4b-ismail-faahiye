import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('coordinator');
  const { login } = useAuth();

  const roles = [
    { id: 'admin', label: 'Administrator', desc: 'Full access to all phases' },
    { id: 'manager', label: 'Manager', desc: 'Planning, Execution, Monitoring' },
    { id: 'coordinator', label: 'Coordinator', desc: 'Execution & Monitoring' },
    { id: 'viewer', label: 'Viewer', desc: 'View only' },
  ];

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email');
      return;
    }

    try {
      await login(email, selectedRole, { email, name: email.split('@')[0] });
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Phase Manager</Text>
        <Text style={styles.subtitle}>Multi-Phase Project Management</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Select Role</Text>
        <View style={styles.roleContainer}>
          {roles.map(role => (
            <TouchableOpacity
              key={role.id}
              style={[
                styles.roleButton,
                selectedRole === role.id && styles.roleButtonActive,
              ]}
              onPress={() => setSelectedRole(role.id)}
            >
              <Text
                style={[
                  styles.roleLabel,
                  selectedRole === role.id && styles.roleLabelActive,
                ]}
              >
                {role.label}
              </Text>
              <Text
                style={[
                  styles.roleDesc,
                  selectedRole === role.id && styles.roleDescActive,
                ]}
              >
                {role.desc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Demo App • No authentication required</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  form: {
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  roleContainer: {
    marginTop: 12,
  },
  roleButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  roleButtonActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  roleDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  roleLabelActive: {
    color: '#3B82F6',
  },
  roleDescActive: {
    color: '#3B82F6',
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 14,
    marginTop: 32,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
