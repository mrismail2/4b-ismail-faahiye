/* ============================================================
   KAABE — Client-ka Supabase

   Furayaasha waxay ka yimaadaan Expo public env vars (eeg .env.example).
   Session-ku wuxuu ku kaydsan yahay AsyncStorage si soo galitaanku u
   sii jiro marka app-ka dib loo furo.

   `isSupabaseConfigured()` ayaa u sheegaya app-ka inuu u shaqeeyo
   "local mode" (AsyncStorage) ilaa backend-ka la xiro.
   ============================================================ */
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL || '';

/* Furaha PUBLIC anon oo keliya ayaa halkan la akhriyaa — WELIGEED
   service-role. Kaasi RLS oo dhan wuu dhaafaa waana inuu server-ka
   ku sii jiro. */
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export function isSupabaseConfigured() {
  return Boolean(url && anonKey);
}

export const supabase = isSupabaseConfigured()
  ? createClient(url, anonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

/* Khaladaadka Postgres oo farriin Soomaali ah loo beddelo */
export function translateError(error) {
  if (!error) return 'Wax baa qaldamay.';
  const message = String(error.message || error);

  if (message.includes('Invalid login credentials')) {
    return 'Emailka ama furaha waa khalad.';
  }
  if (message.includes('User already registered')) {
    return 'Emailkan hore ayaa loo diiwaan geliyay.';
  }
  if (message.includes('duplicate key') && message.includes('classes')) {
    return 'Fasal magacan leh hore ayuu u jiray.';
  }
  if (message.includes('duplicate key')) {
    return 'Diiwaankan hore ayuu u jiray.';
  }
  if (message.includes('row-level security') || message.includes('violates row-level')) {
    return 'Ogolaansho ma lihid inaad tan sameyso.';
  }
  if (message.includes('Doorka lama beddeli karo')) {
    return 'Doorkaaga iskaa uma beddeli kartid.';
  }
  if (message.includes('Failed to fetch') || message.includes('Network request failed')) {
    return 'Internetku ma shaqaynayo. Isku day mar kale.';
  }
  return message;
}
