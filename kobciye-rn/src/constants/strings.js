// Simple key -> {en, so} translation table.
// Only visible UI strings go through this table — database role values
// (see AppRole) are never translated.

export const STRINGS = {
  appName: { en: 'Kobciye', so: 'Kobciye' },
  tagline: { en: 'Learn • Grow • Succeed', so: 'Baro • Koboc • Guulayso' },

  // Navigation / sidebar
  dashboard: { en: 'Dashboard', so: 'Shaashadda Maamulka' },
  students: { en: 'Students', so: 'Ardayda' },
  parents: { en: 'Parents', so: 'Waalidiinta' },
  teachers: { en: 'Teachers', so: 'Macallimiinta' },
  classes: { en: 'Classes', so: 'Fasallada' },
  attendance: { en: 'Attendance', so: 'Xaadiriska' },
  payments: { en: 'Payments', so: 'Lacag-bixinta' },
  exams: { en: 'Exams', so: 'Imtixaannada' },
  results: { en: 'Results', so: 'Natiijooyinka' },
  riskScore: { en: 'Risk Score', so: 'Qiimeynta Khatarta' },
  lessons: { en: 'Lesson Prep', so: 'Diyaarinta Casharrada' },
  messaging: { en: 'Messages', so: 'Fariimaha' },
  teacherProfile: { en: 'My Teacher', so: 'Macallinkayga' },
  permissions: { en: 'Staff & Permissions', so: 'Shaqaalaha & Ogolaanshaha' },
  subscription: { en: 'Subscription', so: 'Diiwaangelinta' },
  parentReports: { en: 'Parent Reports', so: 'Warbixinta Waalidka' },
  progress: { en: 'Progress', so: 'Horumarka' },
  reports: { en: 'Reports', so: 'Warbixinnada' },
  timeline: { en: 'Timeline', so: 'Taariikhda' },
  notices: { en: 'Notices', so: 'Ogeysiisyada' },
  notes: { en: 'Notes', so: 'Qoraallada' },
  settings: { en: 'Settings', so: 'Dejinta' },
  logout: { en: 'Log out', so: 'Ka bax' },

  // Generic
  overview: { en: 'Overview', so: 'Guudmar' },
  goodMorning: { en: 'Good morning', so: 'Subax wanaagsan' },
  comingSoon: { en: 'Coming in a later phase', so: 'Wuxuu iman doonaa marxalad xigta' },

  // Roles
  role_super_admin: { en: 'Super Admin', so: 'Maamule Guud' },
  role_school_admin: { en: 'School Admin', so: 'Maamulaha Dugsiga' },
  role_teacher: { en: 'Teacher', so: 'Macallin' },
  role_accountant: { en: 'Accountant', so: 'Xisaabiye' },
  role_parent: { en: 'Parent', so: 'Waalid' },
  role_student: { en: 'Student', so: 'Arday' },

  // Auth
  welcomeBack: { en: 'Welcome back', so: 'Soo dhowow mar kale' },
  signInToContinue: { en: 'Sign in to your Kobciye dashboard', so: 'Gal akoonkaaga Kobciye si aad u sii wadato' },
  email: { en: 'Email', so: 'Iimaylka' },
  password: { en: 'Password', so: 'Furaha sirta ah' },
  signIn: { en: 'Sign in', so: 'Gal' },
  forgotPassword: { en: 'Forgot password?', so: 'Ma illowday furahaaga?' },
  requestSchoolAccount: { en: 'Request a school account', so: 'Codso akoon dugsi' },
  quickDemoAccess: { en: 'Preview the app', so: 'Eeg muunadda app-ka' },
  previewStudentPortal: { en: 'Preview Student Portal', so: 'Eeg Goobta Ardayga' },
  previewParentPortal: { en: 'Preview Parent Portal', so: 'Eeg Goobta Waalidka' },

  // Onboarding / landing
  getStarted: { en: 'Get started', so: 'Bilow' },
  login: { en: 'Login', so: 'Soo gal' },
  heroTitle: { en: 'A school platform that helps every student grow', so: 'Goob dugsiyeed ka caawisa arday kasta inuu koboco' },
  heroSubtitle: {
    en: 'Kobciye gives schools, teachers and parents one trusted place to manage students, attendance, payments, exams and lesson preparation — and to spot students who need support, early.',
    so: 'Kobciye waxay dugsiyada, macallimiinta iyo waalidiinta siisaa hal goob lagu kalsoonaan karo si loo maamulo ardayda, xaadiriska, lacag-bixinta, imtixaannada iyo diyaarinta casharrada — oo lagu ogaado ardayda u baahan taageero, goor hore.',
  },
  pricingTitle: { en: 'Simple pricing that grows with your school', so: 'Qiimo fudud oo la kobcaysa dugsigaaga' },
  pricingSubtitle: {
    en: "Pick the plan that matches your school's size today — upgrade any time as your student roll grows. No setup fees, no surprises.",
    so: 'Dooro qorshaha ku habboon cabbirka dugsigaaga maanta — kor u qaad waqti kasta marka ardaydaadu kordho. Ma jiraan kharashyo bilow ah ama wax lama filaan ah.',
  },
};

export const LANGUAGES = {
  english: { code: 'en', label: 'English' },
  somali: { code: 'so', label: 'Af-Soomaali' },
};

export function translate(key, langCode) {
  const entry = STRINGS[key];
  if (!entry) return key;
  return entry[langCode] ?? entry.en ?? key;
}
