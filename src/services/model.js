/* ============================================================
   Fasalkayga — Xisaabta saafiga ah (pure model)

   Faylkani MA taabto AsyncStorage. Hawl walba waxay qaadataa store
   ka dibna waxay soo celisaa store CUSUB — sidaas awgeed waa la
   tijaabin karaa Node gudihiisa (`npm run check`).

   Qaab-dhismeedka aqoonsiga waxaa laga tixraacay Kobciye:
     · school_id  — furaha iskuulka
     · class_id   — caalami ahaan gaar ah: `${school_id}_class_${slug}`
     · student_internal_id — furaha xiriirka (xaadiris, lacag)
     · student_id — aqoonsiga la arko ee iskuulka soo saaro (ARD-000001)
   ============================================================ */

/* ---------- caawiyayaal ---------- */

const now = () => new Date().toISOString();

/* Aqoonsi gaar ah. `Date.now()` KELIYA kuma filna: laba diiwaan oo hal
   millisecond lagu abuuro way isku dhici lahaayeen (tusaale: ardayda si
   degdeg ah loo galiyo), taasoo isku darta xaadiriskooda iyo lacagtooda.
   Sidaas awgeed waxaa lagu daray tirin iyo lambar random ah. */
let idCounter = 0;
function uid(prefix) {
  idCounter += 1;
  const time = Date.now().toString(36);
  const seq = idCounter.toString(36);
  const rand = Math.random().toString(36).slice(2, 7);
  return `${prefix}_${time}${seq}${rand}`;
}

export function slugify(text = '') {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || `x${Date.now()}`;
}

export function makeClassId(schoolId, name) {
  return `${schoolId}_class_${slugify(name)}`;
}

/* Aqoonsiga arday ee la arko: TUS-000001 */
export function nextStudentId(store) {
  const prefix = store.school?.prefix || 'STU';
  const used = (store.students || [])
    .map((s) => Number(String(s.student_id || '').split('-')[1]))
    .filter((n) => !Number.isNaN(n));
  const next = (used.length ? Math.max(...used) : 0) + 1;
  return `${prefix}-${String(next).padStart(6, '0')}`;
}

/* Bisha hadda: 2026-08 */
export function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const MONTH_NAMES = [
  'Janaayo', 'Febraayo', 'Maarso', 'Abriil', 'Maajo', 'Juun',
  'Luulyo', 'Agoosto', 'Sebtembar', 'Oktoobar', 'Nofembar', 'Desembar',
];

export function monthLabel(month) {
  const [y, m] = String(month).split('-');
  const idx = Number(m) - 1;
  return `${MONTH_NAMES[idx] || m} ${y}`;
}

export function shiftMonth(month, delta) {
  const [y, m] = String(month).split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function formatMoney(amount, currency = '$') {
  const n = Number(amount) || 0;
  return `${currency}${n.toFixed(2)}`;
}

/* ---------- isticmaalayaal (super admin + macalin oo keliya) ---------- */

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  TEACHER: 'teacher',
};

export const ROLE_LABEL = {
  super_admin: 'Maamulaha Guud',
  teacher: 'Macalin',
};

export function findUserByPhone(store, phone) {
  const key = String(phone || '').trim();
  return (store.users || []).find((u) => u.phone === key) || null;
}

export function registerUser(store, { fullName, phone, password, role }) {
  if (!fullName?.trim()) throw new Error('Magaca waa qasab.');
  if (!phone?.trim()) throw new Error('Taleefanka waa qasab.');
  if (!password || password.length < 4) throw new Error('Furaha waa inuu ka badan yahay 4 xaraf.');
  if (role !== ROLES.SUPER_ADMIN && role !== ROLES.TEACHER) throw new Error('Doorka la doortay ma saxna.');
  if (findUserByPhone(store, phone)) throw new Error('Taleefankan hore ayaa loo diiwaan geliyay.');

  const user = {
    user_id: uid('user'),
    school_id: store.school.school_id,
    role,
    full_name: fullName.trim(),
    phone: String(phone).trim(),
    password,
    assigned_class_ids: [],
    created_at: now(),
  };

  return { store: { ...store, users: [...(store.users || []), user] }, user };
}

export function verifyLogin(store, phone, password) {
  const user = findUserByPhone(store, phone);
  if (!user || user.password !== password) throw new Error('Taleefanka ama furaha waa khalad.');
  return user;
}

export function updateUser(store, userId, patch) {
  return {
    ...store,
    users: (store.users || []).map((u) => (u.user_id === userId ? { ...u, ...patch } : u)),
  };
}

export function teachers(store) {
  return (store.users || []).filter((u) => u.role === ROLES.TEACHER);
}

/* ---------- fasalada ---------- */

export function addClass(store, { name, level, monthlyFee, teacherId }) {
  if (!name?.trim()) throw new Error('Magaca fasalka waa qasab.');
  const schoolId = store.school.school_id;
  const classId = makeClassId(schoolId, name);
  if ((store.classes || []).some((c) => c.class_id === classId)) {
    throw new Error('Fasal magacan leh hore ayuu u jiray.');
  }

  const klass = {
    class_id: classId,
    school_id: schoolId,
    name: name.trim(),
    level: level?.trim() || '',
    monthly_fee: Number(monthlyFee) || 0,
    teacher_id: teacherId || null,
    created_at: now(),
  };

  let next = { ...store, classes: [...(store.classes || []), klass] };
  if (teacherId) next = assignTeacher(next, classId, teacherId);
  return next;
}

export function updateClass(store, classId, patch) {
  const next = {
    ...store,
    classes: (store.classes || []).map((c) => (c.class_id === classId ? { ...c, ...patch } : c)),
  };
  if (Object.prototype.hasOwnProperty.call(patch, 'teacher_id')) {
    return assignTeacher(next, classId, patch.teacher_id);
  }
  return next;
}

export function deleteClass(store, classId) {
  return {
    ...store,
    classes: (store.classes || []).filter((c) => c.class_id !== classId),
    students: (store.students || []).filter((s) => s.class_id !== classId),
    attendance: (store.attendance || []).filter((a) => a.class_id !== classId),
    fees: (store.fees || []).filter((f) => f.class_id !== classId),
    users: (store.users || []).map((u) => ({
      ...u,
      assigned_class_ids: (u.assigned_class_ids || []).filter((id) => id !== classId),
    })),
  };
}

/* Hal macalin ayaa fasalka leh — ka saar kuwii kale, ku dar kan cusub */
export function assignTeacher(store, classId, teacherId) {
  return {
    ...store,
    classes: (store.classes || []).map((c) =>
      c.class_id === classId ? { ...c, teacher_id: teacherId || null } : c),
    users: (store.users || []).map((u) => {
      if (u.role !== ROLES.TEACHER) return u;
      const current = u.assigned_class_ids || [];
      const without = current.filter((id) => id !== classId);
      const shouldHave = u.user_id === teacherId;
      return { ...u, assigned_class_ids: shouldHave ? [...without, classId] : without };
    }),
  };
}

export function getClassById(store, classId) {
  return (store.classes || []).find((c) => c.class_id === classId) || null;
}

/* Fasalada uu qofku arki karo: maamulaha guud dhammaan, macalinka kuwiisa */
export function classesForUser(store, user) {
  const all = store.classes || [];
  if (!user) return [];
  if (user.role === ROLES.SUPER_ADMIN) return all;
  const allowed = user.assigned_class_ids || [];
  return all.filter((c) => allowed.includes(c.class_id));
}

export function canAccessClass(user, classId) {
  if (!user) return false;
  if (user.role === ROLES.SUPER_ADMIN) return true;
  return (user.assigned_class_ids || []).includes(classId);
}

/* ---------- ardayda ---------- */

export function studentsByClass(store, classId) {
  return (store.students || [])
    .filter((s) => s.class_id === classId && s.status === 'active')
    .sort((a, b) => a.full_name.localeCompare(b.full_name));
}

export function addStudent(store, { classId, fullName, gender, guardianPhone, monthlyFee }) {
  if (!fullName?.trim()) throw new Error('Magaca ardayga waa qasab.');
  const klass = getClassById(store, classId);
  if (!klass) throw new Error('Fasalka lama helin.');

  const student = {
    student_internal_id: uid('student'),
    student_id: nextStudentId(store),
    school_id: store.school.school_id,
    class_id: classId,
    full_name: fullName.trim(),
    gender: gender || '',
    guardian_phone: guardianPhone?.trim() || '',
    monthly_fee: monthlyFee === '' || monthlyFee == null
      ? Number(klass.monthly_fee) || 0
      : Number(monthlyFee) || 0,
    status: 'active',
    created_at: now(),
  };

  return { ...store, students: [...(store.students || []), student] };
}

export function updateStudent(store, internalId, patch) {
  return {
    ...store,
    students: (store.students || []).map((s) =>
      s.student_internal_id === internalId ? { ...s, ...patch, updated_at: now() } : s),
  };
}

/* Ardayga lama tirtiro — waxaa loo calaamadiyaa 'left' si taariikhdu u haray */
export function removeStudent(store, internalId) {
  return updateStudent(store, internalId, { status: 'left' });
}

/* ---------- xaadiriska ---------- */

export const ATTENDANCE_STATUSES = [
  { key: 'present', label: 'Jooga' },
  { key: 'absent', label: 'Maqan' },
  { key: 'late', label: 'Soo daahay' },
  { key: 'excused', label: 'Fasax' },
];

export function attendanceLabel(status) {
  return ATTENDANCE_STATUSES.find((s) => s.key === status)?.label || '—';
}

/* Diiwaanka maalin gaar ah: { [student_internal_id]: status } */
export function getRegister(store, classId, date) {
  const out = {};
  (store.attendance || [])
    .filter((a) => a.class_id === classId && a.date === date)
    .forEach((a) => { out[a.student_internal_id] = a.status; });
  return out;
}

export function saveRegister(store, { classId, date, register, recordedBy }) {
  const klass = getClassById(store, classId);
  const kept = (store.attendance || []).filter(
    (a) => !(a.class_id === classId && a.date === date));

  const fresh = Object.entries(register || {}).map(([studentId, status]) => ({
    school_id: klass?.school_id || store.school.school_id,
    class_id: classId,
    student_internal_id: studentId,
    date,
    status,
    recorded_by: recordedBy || 'unknown',
    recorded_at: now(),
  }));

  return { ...store, attendance: [...kept, ...fresh] };
}

/* Tirakoobka xaadiriska ardayga hal bil gudaheed */
export function attendanceSummary(store, classId, month) {
  const rows = (store.attendance || []).filter(
    (a) => a.class_id === classId && String(a.date).startsWith(month));
  const byStudent = {};
  rows.forEach((a) => {
    const cur = byStudent[a.student_internal_id] || { present: 0, absent: 0, late: 0, excused: 0, total: 0 };
    cur[a.status] = (cur[a.status] || 0) + 1;
    cur.total += 1;
    byStudent[a.student_internal_id] = cur;
  });
  return byStudent;
}

/* ---------- lacagaha bilaha ---------- */

export function getFeeRecord(store, studentInternalId, month) {
  return (store.fees || []).find(
    (f) => f.student_internal_id === studentInternalId && f.month === month) || null;
}

/* Xaaladda lacagta: bixiyay / qayb / ma bixin */
export function feeStatus(due, paid) {
  const d = Number(due) || 0;
  const p = Number(paid) || 0;
  if (p <= 0) return 'unpaid';
  if (p >= d) return 'paid';
  return 'partial';
}

export const FEE_STATUS_LABEL = {
  paid: 'Bixiyay',
  partial: 'Qayb bixiyay',
  unpaid: 'Ma bixin',
};

export function setPayment(store, { studentInternalId, month, amountPaid, recordedBy }) {
  const student = (store.students || []).find((s) => s.student_internal_id === studentInternalId);
  if (!student) throw new Error('Ardayga lama helin.');

  const paid = Math.max(0, Number(amountPaid) || 0);
  const due = Number(student.monthly_fee) || 0;
  const existing = getFeeRecord(store, studentInternalId, month);

  const record = {
    fee_id: existing?.fee_id || `fee_${studentInternalId}_${month}`,
    school_id: student.school_id,
    class_id: student.class_id,
    student_internal_id: studentInternalId,
    month,
    amount_due: due,
    amount_paid: paid,
    status: feeStatus(due, paid),
    recorded_by: recordedBy || 'unknown',
    updated_at: now(),
  };

  const kept = (store.fees || []).filter((f) => f.fee_id !== record.fee_id);
  return { ...store, fees: [...kept, record] };
}

/* Warbixinta lacagta fasalka hal bil */
export function classFeeSummary(store, classId, month) {
  const roster = studentsByClass(store, classId);
  let due = 0;
  let paid = 0;
  const rows = roster.map((student) => {
    const rec = getFeeRecord(store, student.student_internal_id, month);
    const studentDue = Number(student.monthly_fee) || 0;
    const studentPaid = Number(rec?.amount_paid) || 0;
    due += studentDue;
    paid += studentPaid;
    return {
      student,
      due: studentDue,
      paid: studentPaid,
      balance: Math.max(0, studentDue - studentPaid),
      status: feeStatus(studentDue, studentPaid),
    };
  });
  return { rows, due, paid, balance: Math.max(0, due - paid) };
}

/* Warbixin guud oo iskuulka oo dhan (maamulaha guud) */
export function schoolSummary(store, month) {
  const classes = store.classes || [];
  let due = 0;
  let paid = 0;
  let students = 0;
  classes.forEach((c) => {
    const s = classFeeSummary(store, c.class_id, month);
    due += s.due;
    paid += s.paid;
    students += s.rows.length;
  });
  return {
    classes: classes.length,
    students,
    teachers: teachers(store).length,
    due,
    paid,
    balance: Math.max(0, due - paid),
  };
}
