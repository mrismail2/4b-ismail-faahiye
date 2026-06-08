import React, { createContext, useContext, useState, useMemo } from 'react';
import { AppRole } from '../constants/roles';

// Phase 1 is UI-only: signIn accepts any of the seeded demo emails below
// (password is ignored) so every role-based dashboard can be reviewed
// without a live backend.

const DEMO_ACCOUNTS = {
  'super@kobciye.com': {
    id: 'demo-super',
    fullName: 'Amina Yusuf',
    email: 'super@kobciye.com',
    role: AppRole.superAdmin,
  },
  'admin@kobciye.com': {
    id: 'demo-admin',
    fullName: 'Maxamed Cali',
    email: 'admin@kobciye.com',
    role: AppRole.schoolAdmin,
    schoolId: 'demo-school-1',
  },
  'teacher@kobciye.com': {
    id: 'demo-teacher',
    fullName: 'Hodan Warsame',
    email: 'teacher@kobciye.com',
    role: AppRole.teacher,
    schoolId: 'demo-school-1',
  },
  'accountant@kobciye.com': {
    id: 'demo-accountant',
    fullName: 'Khadar Nuur',
    email: 'accountant@kobciye.com',
    role: AppRole.accountant,
    schoolId: 'demo-school-1',
  },
  'parent@kobciye.com': {
    id: 'demo-parent',
    fullName: 'Faadumo Xasan',
    email: 'parent@kobciye.com',
    role: AppRole.parent,
    schoolId: 'demo-school-1',
  },
  'student@kobciye.com': {
    id: 'demo-student',
    fullName: 'Yusuf Maxamed',
    email: 'student@kobciye.com',
    role: AppRole.student,
    schoolId: 'demo-school-1',
  },
};

export const DEMO_ACCOUNT_LIST = Object.values(DEMO_ACCOUNTS);

export function userInitials(user) {
  if (!user?.fullName) return '?';
  const parts = user.fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0].slice(0, 1) + parts[parts.length - 1].slice(0, 1)).toUpperCase();
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signIn = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 700));

    const user = DEMO_ACCOUNTS[email.trim().toLowerCase()];
    if (!user) {
      setError('No demo account found for that email.');
      setLoading(false);
      return false;
    }
    setCurrentUser(user);
    setLoading(false);
    return true;
  };

  const signOut = async () => setCurrentUser(null);

  const value = useMemo(
    () => ({ currentUser, isAuthenticated: !!currentUser, loading, error, signIn, signOut }),
    [currentUser, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
