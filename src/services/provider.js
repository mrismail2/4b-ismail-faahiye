/* ============================================================
   KAABE — Doorashada provider-ka

   Haddii `.env` la buuxiyay → Supabase (habka dhabta ah).
   Haddii kale       → AsyncStorage (habka tijaabada).

   Shaashaduhu isla interface-ka ayay isticmaalaan labadaba.
   ============================================================ */
import { isSupabaseConfigured } from './supabase';
import * as local from './localProvider';
import * as remote from './remoteProvider';

export const provider = isSupabaseConfigured() ? remote : local;

export const isLive = provider.mode === 'live';

export { isSupabaseConfigured };
