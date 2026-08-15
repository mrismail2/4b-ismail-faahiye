/* ============================================================
   Fasalkayga — Xogta bilowga

   Halkan waa MEESHA KELIYA ee xogta tusaalaha lagu abuuro. Kaydka
   dhexe mar keliya ayaa la abuuraa (marka ugu horreysa ee app-ka la furo);
   ka dib wax walba waxay ka yimaadaan AsyncStorage.
   ============================================================ */

const SCHOOL_ID = 'school_001';

/* Akoonka maamulaha guud ee tijaabada — waa in la beddelo dhab ahaan */
const DEMO_ADMIN = {
  user_id: 'user_admin_demo',
  school_id: SCHOOL_ID,
  role: 'super_admin',
  full_name: 'Maamulaha Tijaabada',
  phone: '0611111111',
  password: 'admin123',
  assigned_class_ids: [],
  created_at: new Date().toISOString(),
};

export function buildSeed() {
  return {
    schema_version: 1,
    created_at: new Date().toISOString(),
    school: {
      school_id: SCHOOL_ID,
      name: 'Iskuulka Fasalkayga',
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
  phone: DEMO_ADMIN.phone,
  password: DEMO_ADMIN.password,
};
