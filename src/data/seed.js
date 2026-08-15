/* ============================================================
   KAABE — Xogta bilowga (habka tijaabada oo keliya)

   Kani wuxuu shaqeeyaa marka `.env` la banayo. Marka Supabase la xiro,
   xogtu database-ka ayay ka timaadaa, faylkanina lama isticmaalo.
   ============================================================ */

const SCHOOL_ID = 'school_001';

/* Akoonka maamulaha ee tijaabada. Habka dhabta ah, akoonka waxaa lagu
   abuuraa Supabase Auth (eeg supabase/README.md). */
const DEMO_ADMIN = {
  user_id: 'user_admin_demo',
  school_id: SCHOOL_ID,
  role: 'super_admin',
  full_name: 'Maamulaha Tijaabada',
  email: 'maamule@kaabe.so',
  phone: '0611111111',
  password: 'kaabe123',
  subject: '',
  bio: '',
  photo_uri: null,
  assigned_class_ids: [],
  created_at: new Date().toISOString(),
};

export function buildSeed() {
  return {
    schema_version: 1,
    created_at: new Date().toISOString(),
    school: {
      school_id: SCHOOL_ID,
      name: 'Iskuulka KAABE',
      prefix: 'ARD',
      currency: '$',
    },
    users: [DEMO_ADMIN],
    classes: [],
    students: [],
    attendance: [],
    fees: [],
  };
}

export const DEMO_CREDENTIALS = {
  email: DEMO_ADMIN.email,
  password: DEMO_ADMIN.password,
};
