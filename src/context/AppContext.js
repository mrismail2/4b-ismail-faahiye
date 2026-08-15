/* ============================================================
   KAABE — Provider-ka guud

   Wuxuu haystaa store-ka iyo qofka soo galay, wuxuuna shaashadaha siiyaa
   `ops` — hawlo isku eg oo aan u kala baahnayn in ay ogaadaan in xogtu ka
   timid Supabase mise AsyncStorage.

   Ops kastaa wuxuu ku dhammaadaa `refresh()` si UI-gu had iyo jeer u muujiyo
   waxa dhab ahaantii kaydsan — gaar ahaan habka dhabta ah, halkaas oo
   database-ku diidi karo wax (RLS) app-kuna u malaynayo inay guulaysteen.
   ============================================================ */
import React, {
  createContext, useContext, useEffect, useMemo, useState, useCallback, useRef,
} from 'react';
import { provider, isLive } from '../services/provider';
import { getClassById, getStudentById } from '../services/model';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [store, setStore] = useState(null);
  const [userId, setUserId] = useState(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const storeRef = useRef(null);

  storeRef.current = store;

  /* ---------- bilowga ---------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const session = await provider.getSession();
        if (cancelled) return;
        if (session?.userId) {
          const snapshot = await provider.loadSnapshot(session.userId);
          if (cancelled) return;
          setStore(snapshot);
          setUserId(session.userId);
        } else if (!isLive) {
          /* Habka tijaabada: store-ka soo dej si bogga soo galitaanku u
             arko akoonka demo-ga. Habka dhabta ah lama akhriyo wax ilaa
             la soo galo. */
          const snapshot = await provider.loadSnapshot();
          if (!cancelled) setStore(snapshot);
        }
      } catch (e) {
        // soo galitaanku wuu dhacay — bogga soo galitaanka ayaa la tusayaa
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const refresh = useCallback(async (id = userId) => {
    if (!id) return null;
    const snapshot = await provider.loadSnapshot(id);
    setStore(snapshot);
    return snapshot;
  }, [userId]);

  /* Qofka soo galay had iyo jeer store-ka ayaa laga soo saaraa si xogtiisu
     u cusboonaato marka fasal loo qoondeeyo ama profile-ka la beddelo. */
  const user = useMemo(() => {
    if (!store || !userId) return null;
    return (store.users || []).find((u) => u.user_id === userId) || null;
  }, [store, userId]);

  /* ---------- soo galitaanka ---------- */

  const signIn = useCallback(async (email, password) => {
    setBusy(true);
    try {
      const { userId: id } = await provider.signIn({ email, password });
      const snapshot = await provider.loadSnapshot(id);
      setStore(snapshot);
      setUserId(id);
    } finally {
      setBusy(false);
    }
  }, []);

  const signUp = useCallback(async (payload) => {
    setBusy(true);
    try {
      const { userId: id } = await provider.signUp(payload);
      const snapshot = await provider.loadSnapshot(id);
      setStore(snapshot);
      setUserId(id);
    } finally {
      setBusy(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await provider.signOut();
    setUserId(null);
    if (!isLive) setStore(await provider.loadSnapshot());
    else setStore(null);
  }, []);

  const resetAll = useCallback(async () => {
    const fresh = await provider.resetAll();
    setUserId(null);
    setStore(fresh);
  }, []);

  /* ---------- ops ----------
     Halkan waxaa lagu darayaa xogta uu provider-ku u baahan yahay
     (school_id, class_id, lacagta waajibka) si shaashaduhu u fudud
     noqdaan. Kadib `refresh()`. */

  const ops = useMemo(() => {
    const current = () => storeRef.current;
    const schoolId = () => current()?.school?.school_id;

    const run = async (fn) => {
      setBusy(true);
      try {
        await fn();
        return await refresh();
      } finally {
        setBusy(false);
      }
    };

    return {
      addClass: (args) => run(() => provider.addClass({ ...args, schoolId: schoolId() })),
      updateClass: (classId, patch) => run(() => provider.updateClass(classId, patch)),
      deleteClass: (classId) => run(() => provider.deleteClass(classId)),
      assignTeacher: (classId, teacherId) => run(() => provider.assignTeacher(classId, teacherId)),

      addStudent: (args) => run(() => {
        const klass = getClassById(current(), args.classId);
        return provider.addStudent({
          ...args,
          schoolId: schoolId(),
          classFee: klass?.monthly_fee ?? 0,
        });
      }),
      updateStudent: (id, patch) => run(() => provider.updateStudent(id, patch)),
      removeStudent: (id) => run(() => provider.removeStudent(id)),
      setStudentPhoto: (id, uri) => run(() => {
        const student = getStudentById(current(), id);
        return provider.setStudentPhoto(id, uri, student?.class_id);
      }),

      saveRegister: (args) => run(() => provider.saveRegister({
        ...args,
        schoolId: schoolId(),
        recordedBy: userId,
      })),

      setPayment: (args) => run(() => {
        const student = getStudentById(current(), args.studentInternalId);
        return provider.setPayment({
          ...args,
          classId: student?.class_id,
          schoolId: schoolId(),
          amountDue: student?.monthly_fee ?? 0,
          recordedBy: userId,
        });
      }),

      updateProfile: (patch) => run(() => provider.updateProfile(userId, patch)),
    };
  }, [refresh, userId]);

  const value = useMemo(() => ({
    store, user, ready, busy, isLive,
    signIn, signUp, signOut, resetAll, refresh, ops,
  }), [store, user, ready, busy, signIn, signUp, signOut, resetAll, refresh, ops]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp waa in lagu isticmaalo AppProvider gudahiisa.');
  return ctx;
}
