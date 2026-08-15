/* ============================================================
   KAABE — Provider-ka maxalliga ah (AsyncStorage)

   Kani waa habka tijaabada: xogtu qalabka ayay ku jirtaa. Wuxuu hirgeliyaa
   ISLA interface-ka `remoteProvider.js` — sidaas shaashaduhu ma oga midka
   ay la hadlayaan.

   DIGNIIN: furayaasha sirta ah plain text ayay ku jiraan. Habkani waa demo
   oo keliya; wax dhab ah waxaad u isticmaashaa Supabase (eeg .env.example).
   ============================================================ */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buildSeed } from '../data/seed';
import * as M from './model';

const STORE_KEY = 'kaabe_store_v1';
const SESSION_KEY = 'kaabe_session_v1';

export const mode = 'local';

async function read() {
  try {
    const raw = await AsyncStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.schema_version) return parsed;
    }
  } catch (e) {
    // xogtu way kharribantay — dib u abuur
  }
  const seed = buildSeed();
  await AsyncStorage.setItem(STORE_KEY, JSON.stringify(seed));
  return seed;
}

async function write(store) {
  await AsyncStorage.setItem(STORE_KEY, JSON.stringify(store));
  return store;
}

/* Hawl saafi ah ku shaqee kadibna kaydi */
async function apply(fn) {
  const store = await read();
  const next = fn(store);
  return write(next);
}

/* ---------- soo galitaanka ---------- */

export async function getSession() {
  const userId = await AsyncStorage.getItem(SESSION_KEY);
  if (!userId) return null;
  const store = await read();
  const exists = (store.users || []).some((u) => u.user_id === userId);
  return exists ? { userId } : null;
}

export async function signIn({ email, password }) {
  const store = await read();
  const user = M.verifyLogin(store, email, password);
  await AsyncStorage.setItem(SESSION_KEY, user.user_id);
  return { userId: user.user_id };
}

export async function signUp({ fullName, email, phone, password, role }) {
  const store = await read();
  const { store: next, user } = M.registerUser(store, { fullName, email, phone, password, role });
  await write(next);
  await AsyncStorage.setItem(SESSION_KEY, user.user_id);
  return { userId: user.user_id };
}

export async function signOut() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

/* ---------- xogta ---------- */

export async function loadSnapshot() {
  return read();
}

export async function resetAll() {
  const seed = buildSeed();
  await write(seed);
  await AsyncStorage.removeItem(SESSION_KEY);
  return seed;
}

/* ---------- fasalada ---------- */

export const addClass = (args) => apply((s) => M.addClass(s, args));
export const updateClass = (classId, patch) => apply((s) => M.updateClass(s, classId, patch));
export const deleteClass = (classId) => apply((s) => M.deleteClass(s, classId));
export const assignTeacher = (classId, teacherId) => apply((s) => M.assignTeacher(s, classId, teacherId));

/* ---------- ardayda ---------- */

export const addStudent = (args) => apply((s) => M.addStudent(s, args));
export const updateStudent = (id, patch) => apply((s) => M.updateStudent(s, id, patch));
export const removeStudent = (id) => apply((s) => M.removeStudent(s, id));
export const setStudentPhoto = (id, uri) => apply((s) => M.setStudentPhoto(s, id, uri));

/* ---------- xaadiriska iyo lacagta ---------- */

export const saveRegister = (args) => apply((s) => M.saveRegister(s, args));
export const setPayment = (args) => apply((s) => M.setPayment(s, args));

/* ---------- profile-ka ---------- */

export const updateProfile = (userId, patch) => apply((s) => M.updateProfile(s, userId, patch));
