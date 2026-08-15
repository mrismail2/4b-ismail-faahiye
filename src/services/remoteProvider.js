/* ============================================================
   KAABE — Provider-ka Supabase (habka dhabta ah)

   Wuxuu hirgeliyaa ISLA interface-ka `localProvider.js`. Muhiimadda ugu
   weyn: `loadSnapshot()` wuxuu safafka Supabase u beddelaa ISLA qaabka
   store-ka maxalliga ah — sidaas hawlaha akhrinta ee `model.js`
   (classFeeSummary, studentsByClass, iwm) labada habba way u shaqeeyaan.

   Ammaanku RLS ayuu ku jiraa (eeg supabase/migrations). Halkan waxaa jira
   UI-ga oo keliya — macalin isku dayaya inuu fasal kale galo, database-ka
   ayaa diidaya, ma aha app-ka.
   ============================================================ */
import { supabase, translateError } from './supabase';
import { feeStatus } from './model';

export const mode = 'live';

function client() {
  if (!supabase) throw new Error('Supabase lama habayn.');
  return supabase;
}

function guard(error) {
  if (error) throw new Error(translateError(error));
}

/* ---------- soo galitaanka ---------- */

export async function getSession() {
  const { data, error } = await client().auth.getSession();
  guard(error);
  return data?.session?.user ? { userId: data.session.user.id } : null;
}

export async function signIn({ email, password }) {
  const { data, error } = await client().auth.signInWithPassword({
    email: String(email).trim().toLowerCase(),
    password,
  });
  guard(error);
  return { userId: data.user.id };
}

/* Isdiiwaan gelin: akoon auth ah + saf `profiles` ah. Iskuulku waa kan
   la doortay (ama kan kaliya ee jira haddii mid keliya uu jiro). */
export async function signUp({ fullName, email, phone, password, role, schoolId }) {
  const db = client();

  const { data, error } = await db.auth.signUp({
    email: String(email).trim().toLowerCase(),
    password,
    options: { data: { full_name: fullName } },
  });
  guard(error);

  const userId = data.user?.id;
  if (!userId) throw new Error('Akoonka lama abuurin. Hubi emailkaaga.');

  let targetSchool = schoolId;
  if (!targetSchool) {
    const { data: schools, error: schoolErr } = await db.from('schools').select('id').limit(2);
    guard(schoolErr);
    if (!schools?.length) throw new Error('Weli iskuul lama abuurin. La xiriir maamulaha.');
    targetSchool = schools[0].id;
  }

  const { error: profileErr } = await db.from('profiles').insert({
    id: userId,
    school_id: targetSchool,
    role,
    full_name: fullName.trim(),
    phone: String(phone || '').trim(),
  });
  guard(profileErr);

  return { userId };
}

export async function signOut() {
  const { error } = await client().auth.signOut();
  guard(error);
}

/* ---------- sawirada (signed URL, 1 saac) ---------- */

async function signedUrl(bucket, path) {
  if (!path) return null;
  const { data, error } = await client().storage.from(bucket).createSignedUrl(path, 3600);
  if (error) return null;
  return data?.signedUrl || null;
}

/* Sawirka data-URI ah u beddel bytes ka dibna u shub Storage */
async function uploadImage(bucket, path, dataUri) {
  const db = client();
  const response = await fetch(dataUri);
  const blob = await response.blob();
  const { error } = await db.storage.from(bucket).upload(path, blob, {
    contentType: blob.type || 'image/jpeg',
    upsert: true,
  });
  guard(error);
  return path;
}

/* ---------- snapshot: Supabase → qaabka store-ka ---------- */

export async function loadSnapshot(userId) {
  const db = client();

  const { data: me, error: meErr } = await db
    .from('profiles').select('*').eq('id', userId).single();
  guard(meErr);

  const [schoolRes, profileRes, classRes, studentRes] = await Promise.all([
    db.from('schools').select('*').eq('id', me.school_id).single(),
    db.from('profiles').select('*').eq('school_id', me.school_id),
    db.from('classes').select('*').eq('school_id', me.school_id).order('name'),
    db.from('students').select('*').eq('school_id', me.school_id),
  ]);
  guard(schoolRes.error);
  guard(profileRes.error);
  guard(classRes.error);
  guard(studentRes.error);

  /* Xaadiriska iyo lacagta waxaa RLS-ku kala soocayaa — macalinku wuxuu
     helayaa kuwa fasaladiisa oo keliya. */
  const [attendanceRes, feeRes] = await Promise.all([
    db.from('attendance').select('*'),
    db.from('fees').select('*'),
  ]);
  guard(attendanceRes.error);
  guard(feeRes.error);

  const classes = (classRes.data || []).map((c) => ({
    class_id: c.id,
    school_id: c.school_id,
    name: c.name,
    level: c.level || '',
    monthly_fee: Number(c.monthly_fee) || 0,
    teacher_id: c.teacher_id,
    created_at: c.created_at,
  }));

  /* `assigned_class_ids` waxaa laga soo saaraa classes.teacher_id — hal
     ilo run ah, sidaas isma khilaafi karaan. */
  const users = await Promise.all((profileRes.data || []).map(async (p) => ({
    user_id: p.id,
    school_id: p.school_id,
    role: p.role,
    full_name: p.full_name,
    email: p.email || '',
    phone: p.phone || '',
    subject: p.subject || '',
    bio: p.bio || '',
    photo_uri: await signedUrl('avatars', p.photo_path),
    photo_path: p.photo_path || null,
    assigned_class_ids: classes.filter((c) => c.teacher_id === p.id).map((c) => c.class_id),
    created_at: p.created_at,
  })));

  const students = await Promise.all((studentRes.data || []).map(async (s) => ({
    student_internal_id: s.id,
    student_id: s.student_code,
    school_id: s.school_id,
    class_id: s.class_id,
    full_name: s.full_name,
    gender: s.gender || '',
    guardian_phone: s.guardian_phone || '',
    monthly_fee: Number(s.monthly_fee) || 0,
    photo_uri: await signedUrl('student-photos', s.photo_path),
    photo_path: s.photo_path || null,
    status: s.status,
    created_at: s.created_at,
  })));

  return {
    schema_version: 1,
    school: {
      school_id: schoolRes.data.id,
      name: schoolRes.data.name,
      prefix: schoolRes.data.student_prefix,
      currency: schoolRes.data.currency,
    },
    users,
    classes,
    students,
    attendance: (attendanceRes.data || []).map((a) => ({
      school_id: a.school_id,
      class_id: a.class_id,
      student_internal_id: a.student_id,
      date: a.attendance_date,
      status: a.status,
      recorded_by: a.recorded_by,
    })),
    fees: (feeRes.data || []).map((f) => ({
      fee_id: f.id,
      school_id: f.school_id,
      class_id: f.class_id,
      student_internal_id: f.student_id,
      month: f.month,
      amount_due: Number(f.amount_due) || 0,
      amount_paid: Number(f.amount_paid) || 0,
      status: feeStatus(f.amount_due, f.amount_paid),
    })),
  };
}

/* ---------- fasalada ---------- */

export async function addClass({ name, level, monthlyFee, teacherId, schoolId }) {
  const { error } = await client().from('classes').insert({
    school_id: schoolId,
    name: String(name).trim(),
    level: String(level || '').trim(),
    monthly_fee: Number(monthlyFee) || 0,
    teacher_id: teacherId || null,
  });
  guard(error);
}

export async function updateClass(classId, patch) {
  const row = {};
  if (patch.level !== undefined) row.level = patch.level;
  if (patch.monthly_fee !== undefined) row.monthly_fee = patch.monthly_fee;
  if (patch.name !== undefined) row.name = patch.name;
  if (Object.prototype.hasOwnProperty.call(patch, 'teacher_id')) row.teacher_id = patch.teacher_id;
  const { error } = await client().from('classes').update(row).eq('id', classId);
  guard(error);
}

export async function deleteClass(classId) {
  /* `on delete cascade` ayaa nadiifinaya ardayda, xaadiriska iyo lacagaha */
  const { error } = await client().from('classes').delete().eq('id', classId);
  guard(error);
}

export async function assignTeacher(classId, teacherId) {
  const { error } = await client().from('classes')
    .update({ teacher_id: teacherId || null }).eq('id', classId);
  guard(error);
}

/* ---------- ardayda ---------- */

export async function addStudent({ classId, schoolId, fullName, gender, guardianPhone, monthlyFee, photoUri, classFee }) {
  const db = client();

  /* Lambarka waxaa soo saaraya database-ka (`for update`) — sidaas laba
     macalin oo isku mar arday galiyaa isku lambar ma helayaan. */
  const { data: code, error: codeErr } = await db.rpc('next_student_code', {
    target_school: schoolId,
  });
  guard(codeErr);

  const fee = monthlyFee === '' || monthlyFee == null
    ? Number(classFee) || 0
    : Number(monthlyFee) || 0;

  const { data, error } = await db.from('students').insert({
    school_id: schoolId,
    class_id: classId,
    student_code: code,
    full_name: String(fullName).trim(),
    gender: gender || '',
    guardian_phone: String(guardianPhone || '').trim(),
    monthly_fee: fee,
  }).select('id').single();
  guard(error);

  if (photoUri) await setStudentPhoto(data.id, photoUri, classId);
}

export async function updateStudent(studentId, patch) {
  const row = {};
  if (patch.full_name !== undefined) row.full_name = patch.full_name;
  if (patch.gender !== undefined) row.gender = patch.gender;
  if (patch.guardian_phone !== undefined) row.guardian_phone = patch.guardian_phone;
  if (patch.monthly_fee !== undefined) row.monthly_fee = patch.monthly_fee;
  if (patch.status !== undefined) row.status = patch.status;
  const { error } = await client().from('students').update(row).eq('id', studentId);
  guard(error);
}

export async function removeStudent(studentId) {
  return updateStudent(studentId, { status: 'left' });
}

/* Jidku wuxuu ku bilaabmaa class_id si RLS-ku `can_touch_class` u hubiyo */
export async function setStudentPhoto(studentId, dataUri, classId) {
  const path = `${classId}/${studentId}.jpg`;
  await uploadImage('student-photos', path, dataUri);
  const { error } = await client().from('students')
    .update({ photo_path: path }).eq('id', studentId);
  guard(error);
}

/* ---------- xaadiriska ---------- */

export async function saveRegister({ classId, schoolId, date, register, recordedBy }) {
  const db = client();
  const rows = Object.entries(register || {})
    .filter(([, status]) => !!status)
    .map(([studentId, status]) => ({
      school_id: schoolId,
      class_id: classId,
      student_id: studentId,
      attendance_date: date,
      status,
      recorded_by: recordedBy,
      recorded_at: new Date().toISOString(),
    }));

  /* Ardayga la calaamad-tirtiray waa in safkiisii la saaraa */
  const marked = rows.map((r) => r.student_id);
  const { data: existing, error: exErr } = await db.from('attendance')
    .select('id, student_id').eq('class_id', classId).eq('attendance_date', date);
  guard(exErr);

  const stale = (existing || []).filter((r) => !marked.includes(r.student_id)).map((r) => r.id);
  if (stale.length) {
    const { error } = await db.from('attendance').delete().in('id', stale);
    guard(error);
  }

  if (rows.length) {
    /* `unique (student_id, attendance_date)` ayaa ka dhigaysa mid la
       beddelo — lama tarmiyo */
    const { error } = await db.from('attendance')
      .upsert(rows, { onConflict: 'student_id,attendance_date' });
    guard(error);
  }
}

/* ---------- lacagta ---------- */

export async function setPayment({ studentInternalId, classId, schoolId, month, amountPaid, amountDue, recordedBy }) {
  const { error } = await client().from('fees').upsert({
    school_id: schoolId,
    class_id: classId,
    student_id: studentInternalId,
    month,
    amount_due: Number(amountDue) || 0,
    amount_paid: Math.max(0, Number(amountPaid) || 0),
    recorded_by: recordedBy,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'student_id,month' });
  guard(error);
}

/* ---------- profile-ka ---------- */

export async function updateProfile(userId, { fullName, phone, subject, bio, photoUri }) {
  const db = client();
  const row = {};
  if (fullName !== undefined) row.full_name = String(fullName).trim();
  if (phone !== undefined) row.phone = String(phone).trim();
  if (subject !== undefined) row.subject = String(subject).trim();
  if (bio !== undefined) row.bio = String(bio).trim();

  if (photoUri) {
    const path = `${userId}/avatar.jpg`;
    await uploadImage('avatars', path, photoUri);
    row.photo_path = path;
  }

  /* Ogow: `role` iyo `school_id` halkan lagama dirayo — trigger-ka
     database-ku wuu diidayaa isbeddelkooda. */
  const { error } = await db.from('profiles').update(row).eq('id', userId);
  guard(error);
}

export async function resetAll() {
  throw new Error('Habka dhabta ah xogta lagama tirtiro app-ka.');
}
