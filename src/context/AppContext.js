/* ============================================================
   Fasalkayga — Provider-ka guud

   Hal meel ayaa lagu hayaa kaydka (store) iyo qofka soo galay (session).
   Shaashadaha waxay isticmaalaan `mutate()` — waxay qaadataa hawl saafi ah
   oo store cusub soo celisa, ka dibna waxay AsyncStorage ku kaydisaa.
   ============================================================ */
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loadStore, saveStore, resetStore,
  registerUser as registerUserOp, verifyLogin,
} from '../services/storage';

const SESSION_KEY = 'fasalkayga_session_v1';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [store, setStore] = useState(null);
  const [userId, setUserId] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [loaded, session] = await Promise.all([
          loadStore(),
          AsyncStorage.getItem(SESSION_KEY),
        ]);
        if (cancelled) return;
        setStore(loaded);
        if (session) {
          const exists = (loaded.users || []).some((u) => u.user_id === session);
          if (exists) setUserId(session);
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* Qofka soo galay had iyo jeer waxaa laga soo saaraa store si xogtiisu
     u cusboonaato marka fasal loo qoondeeyo. */
  const user = useMemo(() => {
    if (!store || !userId) return null;
    return (store.users || []).find((u) => u.user_id === userId) || null;
  }, [store, userId]);

  /* mutate(fn) — fn(store) => store cusub. Wuxuu soo celiyaa store-ka cusub. */
  const mutate = useCallback(async (fn) => {
    if (!store) throw new Error('Kaydka weli lama soo dejin.');
    const next = fn(store);
    setStore(next);
    await saveStore(next);
    return next;
  }, [store]);

  const login = useCallback(async (phone, password) => {
    const current = store || (await loadStore());
    const found = verifyLogin(current, phone, password);
    setUserId(found.user_id);
    await AsyncStorage.setItem(SESSION_KEY, found.user_id);
    return found;
  }, [store]);

  const register = useCallback(async (payload) => {
    const current = store || (await loadStore());
    const { store: next, user: created } = registerUserOp(current, payload);
    setStore(next);
    await saveStore(next);
    setUserId(created.user_id);
    await AsyncStorage.setItem(SESSION_KEY, created.user_id);
    return created;
  }, [store]);

  const logout = useCallback(async () => {
    setUserId(null);
    await AsyncStorage.removeItem(SESSION_KEY);
  }, []);

  const resetAll = useCallback(async () => {
    const fresh = await resetStore();
    setStore(fresh);
    setUserId(null);
    await AsyncStorage.removeItem(SESSION_KEY);
  }, []);

  const value = useMemo(() => ({
    store, user, ready, mutate, login, register, logout, resetAll,
  }), [store, user, ready, mutate, login, register, logout, resetAll]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp waa in lagu isticmaalo AppProvider gudahiisa.');
  return ctx;
}
