/* ============================================================
   Fasalkayga — Kaydka dhexe (AsyncStorage)

   Dhammaan xogtu waxay ku jirtaa HAL fure: `fasalkayga_store_v1`.
   Xisaabta oo dhan waxay ku jirtaa `model.js` (saafi, la tijaabin karo);
   faylkani wuxuu qabtaa kaydinta oo keliya, kadibna wuu dib u dhoofiyaa
   model-ka si shaashaduhu hal meel uga soo qaataan.

   DIGNIIN: kani waa prototype frontend ah. Furayaasha sirta ah waxay ku
   jiraan qalabka oo keliya (plain text). Ka hor isticmaalka dhabta ah waa
   in lagu beddelo backend leh authentication sax ah.
   ============================================================ */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buildSeed } from '../data/seed';

export * from './model';

const STORE_KEY = 'fasalkayga_store_v1';

export async function loadStore() {
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

export async function saveStore(store) {
  await AsyncStorage.setItem(STORE_KEY, JSON.stringify(store));
  return store;
}

export async function resetStore() {
  const seed = buildSeed();
  await AsyncStorage.setItem(STORE_KEY, JSON.stringify(seed));
  return seed;
}
