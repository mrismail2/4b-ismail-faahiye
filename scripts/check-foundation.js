/* ============================================================
   KAABE — Hubinta aasaaska (`npm run check`)

   Wuxuu Node ku maraa xisaabta saafiga ah ee `src/services/model.js`
   si loo xaqiijiyo in:
     · aqoonsiga fasalka caalami ahaan gaar yahay
     · aqoonsiga ardayga uusan is celcelin
     · macalinku arko oo keliya fasaladiisa
     · casuumaaddu si sax ah u shaqayso (koodh, email, dhicitaan)
     · xaadiriska si sax ah loo kaydiyo/loo beddelo
     · lacagta bisha si sax ah loo xisaabiyo
   ============================================================ */
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const ROOT = path.join(__dirname, '..');

/* Fayl ESM ah u beddel CJS ka dibna ku shubo module cusub */
function loadModule(relPath) {
  const filename = path.join(ROOT, relPath);
  const source = fs.readFileSync(filename, 'utf8');
  const { code } = babel.transformSync(source, {
    filename,
    babelrc: false,
    configFile: false,
    plugins: ['@babel/plugin-transform-modules-commonjs'],
  });
  const module_ = { exports: {} };
  // eslint-disable-next-line no-new-func
  new Function('module', 'exports', 'require', code)(module_, module_.exports, require);
  return module_.exports;
}

const M = loadModule('src/services/model.js');

let passed = 0;
const failures = [];

function check(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failures.push({ name, message: e.message });
    console.log(`  ✗ ${name}\n      ${e.message}`);
  }
}

function assert(cond, message) {
  if (!cond) throw new Error(message || 'assertion failed');
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message || 'lama simna'}: la filayay ${expected}, la helay ${actual}`);
  }
}

/* ---------- store cusub oo tijaabo ah ---------- */
function freshStore() {
  return {
    schema_version: 1,
    school: { school_id: 'school_001', name: 'Iskuul Tijaabo', prefix: 'ARD', currency: '$' },
    users: [],
    classes: [],
    students: [],
    attendance: [],
    fees: [],
  };
}

console.log('\nKAABE — hubinta aasaaska\n');

/* ---------- 1. Isticmaalayaasha ---------- */
console.log('Isticmaalayaasha');

check('doorka super_admin iyo teacher oo keliya la aqbalo', () => {
  const s = freshStore();
  let threw = false;
  try {
    M.createUser(s, { fullName: 'Arday', email: 'u070@k.so', password: 'kaabe123', role: 'student' });
  } catch (e) { threw = true; }
  assert(threw, 'doorka "student" waa in la diido');

  const admin = M.createUser(s, {
    fullName: 'Maamule', email: 'u061@k.so', password: 'kaabe123', role: M.ROLES.SUPER_ADMIN,
  });
  assertEqual(admin.user.role, 'super_admin');
});

check('email la iska diiwaan geliyay mar labaad waa la diidaa', () => {
  let s = freshStore();
  s = M.createUser(s, { fullName: 'A', email: 'u061@k.so', password: 'kaabe123', role: M.ROLES.TEACHER }).store;
  let threw = false;
  try {
    M.createUser(s, { fullName: 'B', email: 'u061@k.so', password: 'kaabe456', role: M.ROLES.TEACHER });
  } catch (e) { threw = true; }
  assert(threw, 'emailka isku mid ah waa in la diido');
});

check('furaha khaldan waa la diidaa', () => {
  let s = freshStore();
  s = M.createUser(s, { fullName: 'A', email: 'u061@k.so', password: 'saxsax', role: M.ROLES.TEACHER }).store;
  let threw = false;
  try { M.verifyLogin(s, 'u061@k.so', 'khalad'); } catch (e) { threw = true; }
  assert(threw, 'furaha khaldan waa in la diido');
  assertEqual(M.verifyLogin(s, 'u061@k.so', 'saxsax').full_name, 'A');
});

/* ---------- 2. Fasalada ---------- */
console.log('\nFasalada');

check('class_id wuxuu ku bilaabmaa school_id waana gaar', () => {
  let s = freshStore();
  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10 });
  const id = s.classes[0].class_id;
  assertEqual(id, 'school_001_class_fasalka_1a');
  let threw = false;
  try { M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 12 }); } catch (e) { threw = true; }
  assert(threw, 'fasal magac isku mid ah waa in la diido');
});

check('hal fasal wuxuu leeyahay hal macalin oo keliya', () => {
  let s = freshStore();
  const a = M.createUser(s, { fullName: 'Macalin A', email: 'u061@k.so', password: 'kaabe123', role: M.ROLES.TEACHER });
  s = a.store;
  const b = M.createUser(s, { fullName: 'Macalin B', email: 'u062@k.so', password: 'kaabe123', role: M.ROLES.TEACHER });
  s = b.store;

  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10, teacherId: a.user.user_id });
  const classId = s.classes[0].class_id;
  assertEqual(M.classesForUser(s, M.findUserByEmail(s, 'u061@k.so')).length, 1);

  // loo wareejiyo macalin kale — kii hore waa inuu lumiyo
  s = M.assignTeacher(s, classId, b.user.user_id);
  assertEqual(M.classesForUser(s, M.findUserByEmail(s, 'u061@k.so')).length, 0, 'macalinkii hore');
  assertEqual(M.classesForUser(s, M.findUserByEmail(s, 'u062@k.so')).length, 1, 'macalinka cusub');
  assertEqual(M.getClassById(s, classId).teacher_id, b.user.user_id);
});

check('macalinku wuxuu arkaa fasaladiisa, maamuluhuna dhammaan', () => {
  let s = freshStore();
  const admin = M.createUser(s, { fullName: 'Maamule', email: 'u060@k.so', password: 'kaabe123', role: M.ROLES.SUPER_ADMIN });
  s = admin.store;
  const t = M.createUser(s, { fullName: 'Macalin', email: 'u061@k.so', password: 'kaabe123', role: M.ROLES.TEACHER });
  s = t.store;

  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10, teacherId: t.user.user_id });
  s = M.addClass(s, { name: 'Fasalka 2B', monthlyFee: 10 });

  assertEqual(M.classesForUser(s, M.findUserByEmail(s, 'u060@k.so')).length, 2, 'maamulaha');
  assertEqual(M.classesForUser(s, M.findUserByEmail(s, 'u061@k.so')).length, 1, 'macalinka');

  const otherId = s.classes[1].class_id;
  assert(!M.canAccessClass(M.findUserByEmail(s, 'u061@k.so'), otherId), 'macalinku ma gali karo fasal kale');
  assert(M.canAccessClass(M.findUserByEmail(s, 'u060@k.so'), otherId), 'maamuluhu wuu gali karaa');
});

check('tirtiridda fasalku way nadiifisaa ardayda, xaadiriska iyo lacagaha', () => {
  let s = freshStore();
  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10 });
  const classId = s.classes[0].class_id;
  s = M.addStudent(s, { classId, fullName: 'Fadumo Cali' });
  const sid = s.students[0].student_internal_id;
  s = M.saveRegister(s, { classId, date: '2026-08-10', register: { [sid]: 'present' } });
  s = M.setPayment(s, { studentInternalId: sid, month: '2026-08', amountPaid: 10 });

  s = M.deleteClass(s, classId);
  assertEqual(s.classes.length, 0, 'fasalada');
  assertEqual(s.students.length, 0, 'ardayda');
  assertEqual(s.attendance.length, 0, 'xaadiriska');
  assertEqual(s.fees.length, 0, 'lacagaha');
});

/* ---------- 3. Ardayda ---------- */
console.log('\nArdayda');

check('student_id wuu kordhaa isaguna ma celcelo', () => {
  let s = freshStore();
  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10 });
  const classId = s.classes[0].class_id;
  s = M.addStudent(s, { classId, fullName: 'Arday Kow' });
  s = M.addStudent(s, { classId, fullName: 'Arday Laba' });

  assertEqual(s.students[0].student_id, 'ARD-000001');
  assertEqual(s.students[1].student_id, 'ARD-000002');
  const ids = s.students.map((x) => x.student_id);
  assertEqual(new Set(ids).size, ids.length, 'aqoonsiyada waa inay gaar yihiin');
});

check('lacagta ardayga waxay ka dhaxashaa fasalka haddii la banayo', () => {
  let s = freshStore();
  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 15 });
  const classId = s.classes[0].class_id;
  s = M.addStudent(s, { classId, fullName: 'Arday Kow' });
  s = M.addStudent(s, { classId, fullName: 'Arday Laba', monthlyFee: 7 });

  assertEqual(s.students[0].monthly_fee, 15, 'dhaxalka fasalka');
  assertEqual(s.students[1].monthly_fee, 7, 'qiimo gaar ah');
});

check('ka saarista ardaygu ma tirtirto taariikhda', () => {
  let s = freshStore();
  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10 });
  const classId = s.classes[0].class_id;
  s = M.addStudent(s, { classId, fullName: 'Arday Kow' });
  const sid = s.students[0].student_internal_id;

  s = M.removeStudent(s, sid);
  assertEqual(s.students.length, 1, 'diiwaanku wuu jiraa');
  assertEqual(s.students[0].status, 'left');
  assertEqual(M.studentsByClass(s, classId).length, 0, 'liiska firfircoon');
});

/* ---------- 4. Xaadiriska ---------- */
console.log('\nXaadiriska');

check('xaadiriska maalin waa la kaydiyaa waana la beddelaa', () => {
  let s = freshStore();
  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10 });
  const classId = s.classes[0].class_id;
  s = M.addStudent(s, { classId, fullName: 'Arday Kow' });
  s = M.addStudent(s, { classId, fullName: 'Arday Laba' });
  const [a, b] = s.students.map((x) => x.student_internal_id);

  s = M.saveRegister(s, { classId, date: '2026-08-10', register: { [a]: 'present', [b]: 'absent' } });
  let reg = M.getRegister(s, classId, '2026-08-10');
  assertEqual(reg[a], 'present');
  assertEqual(reg[b], 'absent');
  assertEqual(s.attendance.length, 2);

  // dib u kaydin — waa in la beddelo, aan la tarmin
  s = M.saveRegister(s, { classId, date: '2026-08-10', register: { [a]: 'late', [b]: 'absent' } });
  reg = M.getRegister(s, classId, '2026-08-10');
  assertEqual(reg[a], 'late', 'beddelka');
  assertEqual(s.attendance.length, 2, 'lama tarmin');
});

check('maalmuhu isma faragelinayaan', () => {
  let s = freshStore();
  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10 });
  const classId = s.classes[0].class_id;
  s = M.addStudent(s, { classId, fullName: 'Arday Kow' });
  const sid = s.students[0].student_internal_id;

  s = M.saveRegister(s, { classId, date: '2026-08-10', register: { [sid]: 'present' } });
  s = M.saveRegister(s, { classId, date: '2026-08-11', register: { [sid]: 'absent' } });

  assertEqual(M.getRegister(s, classId, '2026-08-10')[sid], 'present');
  assertEqual(M.getRegister(s, classId, '2026-08-11')[sid], 'absent');
});

check('tirakoobka bisha waa sax', () => {
  let s = freshStore();
  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10 });
  const classId = s.classes[0].class_id;
  s = M.addStudent(s, { classId, fullName: 'Arday Kow' });
  const sid = s.students[0].student_internal_id;

  s = M.saveRegister(s, { classId, date: '2026-08-10', register: { [sid]: 'present' } });
  s = M.saveRegister(s, { classId, date: '2026-08-11', register: { [sid]: 'present' } });
  s = M.saveRegister(s, { classId, date: '2026-08-12', register: { [sid]: 'absent' } });
  s = M.saveRegister(s, { classId, date: '2026-09-01', register: { [sid]: 'absent' } });

  const sum = M.attendanceSummary(s, classId, '2026-08')[sid];
  assertEqual(sum.present, 2, 'jooga');
  assertEqual(sum.absent, 1, 'maqan');
  assertEqual(sum.total, 3, 'wadarta bisha Agoosto');
});

/* ---------- 5. Lacagaha ---------- */
console.log('\nLacagaha bilaha');

check('xaaladda lacagta: ma bixin / qayb / bixiyay', () => {
  assertEqual(M.feeStatus(10, 0), 'unpaid');
  assertEqual(M.feeStatus(10, 4), 'partial');
  assertEqual(M.feeStatus(10, 10), 'paid');
  assertEqual(M.feeStatus(10, 15), 'paid', 'wax ka badan waajibka');
});

check('wadarta fasalka waa sax', () => {
  let s = freshStore();
  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10 });
  const classId = s.classes[0].class_id;
  s = M.addStudent(s, { classId, fullName: 'Arday Kow' });
  s = M.addStudent(s, { classId, fullName: 'Arday Laba' });
  s = M.addStudent(s, { classId, fullName: 'Arday Saddex' });
  const [a, b] = s.students.map((x) => x.student_internal_id);

  s = M.setPayment(s, { studentInternalId: a, month: '2026-08', amountPaid: 10 });
  s = M.setPayment(s, { studentInternalId: b, month: '2026-08', amountPaid: 4 });

  const sum = M.classFeeSummary(s, classId, '2026-08');
  assertEqual(sum.due, 30, 'waajibka');
  assertEqual(sum.paid, 14, 'la bixiyay');
  assertEqual(sum.balance, 16, 'hadhaaga');
  assertEqual(sum.rows.find((r) => r.student.student_internal_id === a).status, 'paid');
  assertEqual(sum.rows.find((r) => r.student.student_internal_id === b).status, 'partial');
});

check('bilaha isma faragelinayaan', () => {
  let s = freshStore();
  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10 });
  const classId = s.classes[0].class_id;
  s = M.addStudent(s, { classId, fullName: 'Arday Kow' });
  const sid = s.students[0].student_internal_id;

  s = M.setPayment(s, { studentInternalId: sid, month: '2026-08', amountPaid: 10 });
  assertEqual(M.classFeeSummary(s, classId, '2026-08').paid, 10, 'Agoosto');
  assertEqual(M.classFeeSummary(s, classId, '2026-09').paid, 0, 'Sebtembar');
});

check('lacag dib loo qoray waa la beddelaa, lamana tarmiyo', () => {
  let s = freshStore();
  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10 });
  const classId = s.classes[0].class_id;
  s = M.addStudent(s, { classId, fullName: 'Arday Kow' });
  const sid = s.students[0].student_internal_id;

  s = M.setPayment(s, { studentInternalId: sid, month: '2026-08', amountPaid: 4 });
  s = M.setPayment(s, { studentInternalId: sid, month: '2026-08', amountPaid: 10 });

  assertEqual(s.fees.length, 1, 'hal diiwaan oo keliya');
  assertEqual(M.classFeeSummary(s, classId, '2026-08').paid, 10);
});

check('ardayga fasalka laga saaray lagama xisaabiyo lacagta', () => {
  let s = freshStore();
  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10 });
  const classId = s.classes[0].class_id;
  s = M.addStudent(s, { classId, fullName: 'Arday Kow' });
  s = M.addStudent(s, { classId, fullName: 'Arday Laba' });
  assertEqual(M.classFeeSummary(s, classId, '2026-08').due, 20);

  s = M.removeStudent(s, s.students[0].student_internal_id);
  assertEqual(M.classFeeSummary(s, classId, '2026-08').due, 10, 'mid ayaa haray');
});

check('warbixinta iskuulka way isku darsataa fasalada', () => {
  let s = freshStore();
  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10 });
  s = M.addClass(s, { name: 'Fasalka 2B', monthlyFee: 20 });
  const [c1, c2] = s.classes.map((c) => c.class_id);
  s = M.addStudent(s, { classId: c1, fullName: 'Arday Kow' });
  s = M.addStudent(s, { classId: c2, fullName: 'Arday Laba' });
  s = M.setPayment(s, {
    studentInternalId: s.students[0].student_internal_id, month: '2026-08', amountPaid: 10,
  });

  const sum = M.schoolSummary(s, '2026-08');
  assertEqual(sum.classes, 2, 'fasalada');
  assertEqual(sum.students, 2, 'ardayda');
  assertEqual(sum.due, 30, 'waajibka');
  assertEqual(sum.paid, 10, 'la bixiyay');
  assertEqual(sum.balance, 20, 'hadhaaga');
});

/* ---------- 6. Profile-ka iyo sawirada ---------- */
console.log('\nProfile-ka iyo sawirada');

check('emailku kiis ma eexdo (Case) marka la soo galo', () => {
  let s = freshStore();
  s = M.createUser(s, {
    fullName: 'Macalin', email: 'Macalin@Kaabe.SO', password: 'kaabe123', role: M.ROLES.TEACHER,
  }).store;
  assertEqual(M.verifyLogin(s, 'macalin@kaabe.so', 'kaabe123').full_name, 'Macalin');
  assertEqual(M.verifyLogin(s, '  MACALIN@KAABE.SO ', 'kaabe123').full_name, 'Macalin');
});

check('furaha gaaban waa la diidaa', () => {
  const s = freshStore();
  let threw = false;
  try {
    M.createUser(s, {
      fullName: 'A', email: 'a@k.so', password: '123', role: M.ROLES.TEACHER,
    });
  } catch (e) { threw = true; }
  assert(threw, 'fure ka yar 6 xaraf waa in la diido');
});

check('profile-ka macalinku wuu beddelmaa, doorkiisuse ma beddelmo', () => {
  let s = freshStore();
  const t = M.createUser(s, {
    fullName: 'Macalin', email: 't@k.so', password: 'kaabe123', role: M.ROLES.TEACHER,
  });
  s = t.store;

  s = M.updateProfile(s, t.user.user_id, {
    fullName: 'Macalin Cusub',
    phone: '0619999999',
    subject: 'Xisaab',
    bio: '5 sano oo waxbarid ah',
  });

  const updated = M.findUserByEmail(s, 't@k.so');
  assertEqual(updated.full_name, 'Macalin Cusub');
  assertEqual(updated.subject, 'Xisaab');
  assertEqual(updated.phone, '0619999999');
  /* Muhiim: doorku waa inuu sidiisii ahaado — `updateProfile` ma qaadato
     `role`, sida database-ka trigger-kiisu diido. */
  assertEqual(updated.role, 'teacher', 'doorku waa inuu sii ahaado macalin');
});

check('magac banaan lama kaydiyo', () => {
  let s = freshStore();
  const t = M.createUser(s, {
    fullName: 'Macalin', email: 't@k.so', password: 'kaabe123', role: M.ROLES.TEACHER,
  });
  s = t.store;
  let threw = false;
  try { M.updateProfile(s, t.user.user_id, { fullName: '   ' }); } catch (e) { threw = true; }
  assert(threw, 'magac banaan waa in la diido');
});

check('sawirka ardayga waa la geliyaa waana la beddelaa', () => {
  let s = freshStore();
  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10 });
  const classId = s.classes[0].class_id;

  s = M.addStudent(s, { classId, fullName: 'Arday Kow', photoUri: 'data:image/jpeg;base64,AAA' });
  const sid = s.students[0].student_internal_id;
  assertEqual(M.getStudentById(s, sid).photo_uri, 'data:image/jpeg;base64,AAA');

  s = M.setStudentPhoto(s, sid, 'data:image/jpeg;base64,BBB');
  assertEqual(M.getStudentById(s, sid).photo_uri, 'data:image/jpeg;base64,BBB');

  /* Sawirka beddelkiisu waa inuusan xogta kale taaban */
  assertEqual(M.getStudentById(s, sid).full_name, 'Arday Kow');
});

check('ardaygu sawir la\'aan wuu shaqeeyaa', () => {
  let s = freshStore();
  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10 });
  s = M.addStudent(s, { classId: s.classes[0].class_id, fullName: 'Arday Kow' });
  assertEqual(s.students[0].photo_uri, null);
});

/* ---------- 7. Casuumaadda macalimiinta ---------- */
console.log('\nCasuumaadda macalimiinta');

function storeWithAdmin() {
  const s = freshStore();
  s.invites = [];
  const admin = M.createUser(s, {
    fullName: 'Maamule', email: 'admin@k.so', password: 'kaabe123', role: M.ROLES.SUPER_ADMIN,
  });
  return { store: admin.store, adminId: admin.user.user_id };
}

check('casuumaadda koodhkeedu waa gaar yahay', () => {
  let { store: s, adminId } = storeWithAdmin();
  const codes = new Set();
  for (let i = 0; i < 40; i += 1) {
    const r = M.createInvite(s, { fullName: `Macalin ${i}`, email: `m${i}@k.so`, createdBy: adminId });
    s = r.store;
    codes.add(r.invite.code);
  }
  assertEqual(codes.size, 40, 'koodh kastaa waa inuu gaar noqdo');
  assert([...codes].every((c) => /^KAB-[A-Z2-9]{6}$/.test(c)), 'qaabka koodhka');
});

check('koodhka waa la aqbali karaa, macalinkuna wuu soo gali karaa', () => {
  let { store: s, adminId } = storeWithAdmin();
  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10 });
  const classId = s.classes[0].class_id;

  const r = M.createInvite(s, {
    fullName: 'Xaliimo Cali', email: 'xaliimo@k.so', classIds: [classId], createdBy: adminId,
  });
  s = r.store;

  const redeemed = M.redeemInvite(s, {
    code: r.invite.code, email: 'xaliimo@k.so', password: 'kaabe123',
  });
  s = redeemed.store;

  /* doorka casuumaadda ayaa go'aamiyay, ma aha qofka */
  assertEqual(redeemed.user.role, 'teacher');
  assertEqual(redeemed.user.full_name, 'Xaliimo Cali');
  /* fasalkii lagu daray casuumaadda waa in loo qoondeeyay */
  assertEqual(M.classesForUser(s, redeemed.user).length, 1, 'fasalka la qoondeeyay');
  assertEqual(M.getClassById(s, classId).teacher_id, redeemed.user.user_id);
  /* wuu soo geli karaa */
  assertEqual(M.verifyLogin(s, 'xaliimo@k.so', 'kaabe123').user_id, redeemed.user.user_id);
});

check('koodh la isticmaalay mar labaad lama isticmaali karo', () => {
  let { store: s, adminId } = storeWithAdmin();
  const r = M.createInvite(s, { fullName: 'Xaliimo', email: 'x@k.so', createdBy: adminId });
  s = M.redeemInvite(r.store, { code: r.invite.code, email: 'x@k.so', password: 'kaabe123' }).store;

  assertEqual(M.inviteState(M.findInviteByCode(s, r.invite.code)), 'accepted');
  let threw = false;
  try { M.redeemInvite(s, { code: r.invite.code, email: 'x@k.so', password: 'kaabe456' }); } catch (e) { threw = true; }
  assert(threw, 'koodh la aqbalay waa in la diido');
});

check('email kale koodhka kuma isticmaali karo', () => {
  const { store: s, adminId } = storeWithAdmin();
  const r = M.createInvite(s, { fullName: 'Xaliimo', email: 'xaliimo@k.so', createdBy: adminId });
  let threw = false;
  try {
    M.redeemInvite(r.store, { code: r.invite.code, email: 'qofkale@k.so', password: 'kaabe123' });
  } catch (e) { threw = true; }
  assert(threw, 'email aan la mid ahayn waa in la diido');
});

check('koodh la joojiyay lama aqbali karo', () => {
  const { store: s, adminId } = storeWithAdmin();
  const r = M.createInvite(s, { fullName: 'Xaliimo', email: 'x@k.so', createdBy: adminId });
  const revoked = M.revokeInvite(r.store, r.invite.invite_id);

  assertEqual(M.inviteState(M.findInviteByCode(revoked, r.invite.code)), 'revoked');
  let threw = false;
  try { M.redeemInvite(revoked, { code: r.invite.code, email: 'x@k.so', password: 'kaabe123' }); } catch (e) { threw = true; }
  assert(threw, 'koodh la joojiyay waa in la diido');
});

check('koodh dhacay lama aqbali karo', () => {
  const { store: s, adminId } = storeWithAdmin();
  const r = M.createInvite(s, { fullName: 'Xaliimo', email: 'x@k.so', createdBy: adminId });

  /* taariikhda dhicitaanka gadaal u celi */
  const expired = {
    ...r.store,
    invites: r.store.invites.map((i) => ({
      ...i, expires_at: new Date(Date.now() - 1000).toISOString(),
    })),
  };
  assertEqual(M.inviteState(M.findInviteByCode(expired, r.invite.code)), 'expired');
  let threw = false;
  try { M.redeemInvite(expired, { code: r.invite.code, email: 'x@k.so', password: 'kaabe123' }); } catch (e) { threw = true; }
  assert(threw, 'koodh dhacay waa in la diido');
});

check('koodhku kiis iyo meel-banaan ma eexdo', () => {
  const { store: s, adminId } = storeWithAdmin();
  const r = M.createInvite(s, { fullName: 'Xaliimo', email: 'x@k.so', createdBy: adminId });
  const messy = `  ${r.invite.code.toLowerCase()}  `;
  const redeemed = M.redeemInvite(r.store, { code: messy, email: 'x@k.so', password: 'kaabe123' });
  assertEqual(redeemed.user.role, 'teacher');
});

check('email hore u akoon leh lama casuumi karo', () => {
  let { store: s, adminId } = storeWithAdmin();
  let threw = false;
  try { M.createInvite(s, { fullName: 'Maamule Kale', email: 'admin@k.so', createdBy: adminId }); } catch (e) { threw = true; }
  assert(threw, 'email akoon leh waa in la diido');
});

check('hal email hal casuumaad furan ayuu haystaa', () => {
  let { store: s, adminId } = storeWithAdmin();
  s = M.createInvite(s, { fullName: 'Xaliimo', email: 'x@k.so', createdBy: adminId }).store;
  let threw = false;
  try { M.createInvite(s, { fullName: 'Xaliimo', email: 'x@k.so', createdBy: adminId }); } catch (e) { threw = true; }
  assert(threw, 'casuumaad labaad oo furan waa in la diido');

  /* laakiin marka la joojiyo, mid cusub waa la samayn karaa */
  const revoked = M.revokeInvite(s, s.invites[0].invite_id);
  const again = M.createInvite(revoked, { fullName: 'Xaliimo', email: 'x@k.so', createdBy: adminId });
  assertEqual(M.inviteState(again.invite), 'pending');
});

/* ---------- 8. Fasalka macalinka iyo tirtiridda ardayga ---------- */
console.log('\nFasalka macalinka iyo tirtiridda');

check('macalinku fasal wuu samayn karaa — KIISA ayuuna noqonayaa', () => {
  let { store: s, adminId } = storeWithAdmin();
  const r = M.createInvite(s, { fullName: 'Macalin', email: 'm@k.so', createdBy: adminId });
  const redeemed = M.redeemInvite(r.store, { code: r.invite.code, email: 'm@k.so', password: 'kaabe123' });
  s = redeemed.store;
  const teacher = redeemed.user;

  /* macalinku cid kale fasal uma samayn karo */
  const owner = M.ownerForNewClass(teacher, 'user_qof_kale');
  assertEqual(owner, teacher.user_id, 'macalinku had iyo jeer kiisa');

  s = M.addClass(s, { name: 'Fasalka 3C', monthlyFee: 20, teacherId: owner });
  const klass = s.classes[0];
  assertEqual(klass.teacher_id, teacher.user_id);
  assertEqual(M.classesForUser(s, M.findUserByEmail(s, 'm@k.so')).length, 1);
});

check('maamuluhu fasal cid kale ayuu u samayn karaa', () => {
  let { store: s, adminId } = storeWithAdmin();
  const admin = M.findUserByEmail(s, 'admin@k.so');
  const r = M.createInvite(s, { fullName: 'Macalin', email: 'm@k.so', createdBy: adminId });
  const redeemed = M.redeemInvite(r.store, { code: r.invite.code, email: 'm@k.so', password: 'kaabe123' });
  s = redeemed.store;

  const owner = M.ownerForNewClass(admin, redeemed.user.user_id);
  assertEqual(owner, redeemed.user.user_id, 'maamuluhu cidda uu doorto');
});

check('macalinku fasalka qof kale wax kama beddeli karo', () => {
  let { store: s, adminId } = storeWithAdmin();
  const a = M.createInvite(s, { fullName: 'Macalin A', email: 'a@k.so', createdBy: adminId });
  s = M.redeemInvite(a.store, { code: a.invite.code, email: 'a@k.so', password: 'kaabe123' }).store;
  const b = M.createInvite(s, { fullName: 'Macalin B', email: 'b@k.so', createdBy: adminId });
  s = M.redeemInvite(b.store, { code: b.invite.code, email: 'b@k.so', password: 'kaabe123' }).store;

  const teacherA = M.findUserByEmail(s, 'a@k.so');
  const teacherB = M.findUserByEmail(s, 'b@k.so');
  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10, teacherId: teacherA.user_id });
  const klass = M.getClassById(s, s.classes[0].class_id);

  assert(M.canEditClass(teacherA, klass), 'macalinka leh wuu beddeli karaa');
  assert(!M.canEditClass(teacherB, klass), 'macalinka kale ma beddeli karo');
  assert(M.canEditClass(M.findUserByEmail(s, 'admin@k.so'), klass), 'maamuluhu wuu beddeli karaa');
});

check('macalimiintu isku ma dhex qasmayaan', () => {
  let { store: s, adminId } = storeWithAdmin();
  const a = M.createInvite(s, { fullName: 'A', email: 'a@k.so', createdBy: adminId });
  s = M.redeemInvite(a.store, { code: a.invite.code, email: 'a@k.so', password: 'kaabe123' }).store;
  const b = M.createInvite(s, { fullName: 'B', email: 'b@k.so', createdBy: adminId });
  s = M.redeemInvite(b.store, { code: b.invite.code, email: 'b@k.so', password: 'kaabe123' }).store;

  const A = M.findUserByEmail(s, 'a@k.so');
  const B = M.findUserByEmail(s, 'b@k.so');
  s = M.addClass(s, { name: 'Fasalka A1', monthlyFee: 10, teacherId: A.user_id });
  s = M.addClass(s, { name: 'Fasalka B1', monthlyFee: 10, teacherId: B.user_id });
  s = M.addStudent(s, { classId: s.classes[0].class_id, fullName: 'Arday A' });
  s = M.addStudent(s, { classId: s.classes[1].class_id, fullName: 'Arday B' });

  const freshA = M.findUserByEmail(s, 'a@k.so');
  const freshB = M.findUserByEmail(s, 'b@k.so');
  assertEqual(M.classesForUser(s, freshA).length, 1, 'A');
  assertEqual(M.classesForUser(s, freshB).length, 1, 'B');
  assert(!M.canAccessClass(freshA, s.classes[1].class_id), 'A ma galo fasalka B');
  assert(!M.canAccessClass(freshB, s.classes[0].class_id), 'B ma galo fasalka A');
});

check('tirtiridda ardaygu way la baxdaa xaadiriska iyo lacagta', () => {
  let s = freshStore();
  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10 });
  const classId = s.classes[0].class_id;
  s = M.addStudent(s, { classId, fullName: 'Arday Kow' });
  s = M.addStudent(s, { classId, fullName: 'Arday Laba' });
  const [a, b] = s.students.map((x) => x.student_internal_id);

  s = M.saveRegister(s, { classId, date: '2026-08-10', register: { [a]: 'present', [b]: 'absent' } });
  s = M.setPayment(s, { studentInternalId: a, month: '2026-08', amountPaid: 10 });
  s = M.setPayment(s, { studentInternalId: b, month: '2026-08', amountPaid: 5 });

  s = M.deleteStudent(s, a);
  assertEqual(s.students.length, 1, 'ardayda');
  assertEqual(s.attendance.length, 1, 'xaadiriska');
  assertEqual(s.fees.length, 1, 'lacagaha');
  /* kii kale waa inuu sidiisii ahaado */
  assertEqual(M.classFeeSummary(s, classId, '2026-08').paid, 5);
});

check('ka saariddu taariikhda way haysaa, tirtiriddu way qaadaysaa', () => {
  let s = freshStore();
  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10 });
  const classId = s.classes[0].class_id;
  s = M.addStudent(s, { classId, fullName: 'Arday Kow' });
  const sid = s.students[0].student_internal_id;
  s = M.saveRegister(s, { classId, date: '2026-08-10', register: { [sid]: 'present' } });

  const softed = M.removeStudent(s, sid);
  assertEqual(softed.attendance.length, 1, 'ka saarid: xaadiriska wuu haray');
  assertEqual(M.studentsByClass(softed, classId).length, 0, 'liiska firfircoon');

  const hard = M.deleteStudent(s, sid);
  assertEqual(hard.attendance.length, 0, 'tirtirid: xaadiriska wuu baxay');
  assertEqual(hard.students.length, 0);
});

check('lacagta ardayga mar walba waa la beddeli karaa', () => {
  let s = freshStore();
  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10 });
  const classId = s.classes[0].class_id;
  s = M.addStudent(s, { classId, fullName: 'Arday Kow' });
  const sid = s.students[0].student_internal_id;

  assertEqual(M.classFeeSummary(s, classId, '2026-08').due, 10);
  s = M.updateStudent(s, sid, { monthly_fee: 25 });
  assertEqual(M.classFeeSummary(s, classId, '2026-08').due, 25, 'qiimo cusub');

  /* lacagta fasalkuna waa la beddeli karaa */
  s = M.updateClass(s, classId, { monthly_fee: 30 });
  assertEqual(M.getClassById(s, classId).monthly_fee, 30);
  /* ardaydii hore qiimahoodu ma beddelmayo — mid walba kiisa ayuu leeyahay */
  assertEqual(M.classFeeSummary(s, classId, '2026-08').due, 25, 'ardaygii hore');
});

/* ---------- 9. Caawiyayaasha taariikhda ---------- */
console.log('\nTaariikhda');

check('shiftMonth wuxuu si sax ah u gudbaa sanadka', () => {
  assertEqual(M.shiftMonth('2026-12', 1), '2027-01');
  assertEqual(M.shiftMonth('2026-01', -1), '2025-12');
  assertEqual(M.shiftMonth('2026-08', 2), '2026-10');
});

check('qaabka lacagta iyo bisha waa sax', () => {
  assertEqual(M.formatMoney(7.5, '$'), '$7.50');
  assertEqual(M.formatMoney(null, '$'), '$0.00');
  assertEqual(M.monthLabel('2026-08'), 'Agoosto 2026');
});

/* ---------- natiijada ---------- */
console.log(`\n${'='.repeat(48)}`);
if (failures.length) {
  console.log(`GUUL DARRO — ${passed} guuleystay, ${failures.length} fashilmay\n`);
  failures.forEach((f) => console.log(`  ✗ ${f.name}: ${f.message}`));
  process.exit(1);
}
console.log(`GUUL — dhammaan ${passed} hubin way guuleysteen`);
console.log(`${'='.repeat(48)}\n`);
