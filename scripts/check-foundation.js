/* ============================================================
   Fasalkayga — Hubinta aasaaska (`npm run check`)

   Wuxuu Node ku maraa xisaabta saafiga ah ee `src/services/model.js`
   si loo xaqiijiyo in:
     · aqoonsiga fasalka caalami ahaan gaar yahay
     · aqoonsiga ardayga uusan is celcelin
     · macalinku arko oo keliya fasaladiisa
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

console.log('\nFasalkayga — hubinta aasaaska\n');

/* ---------- 1. Isticmaalayaasha ---------- */
console.log('Isticmaalayaasha');

check('doorka super_admin iyo teacher oo keliya la aqbalo', () => {
  const s = freshStore();
  let threw = false;
  try {
    M.registerUser(s, { fullName: 'Arday', phone: '070', password: '1234', role: 'student' });
  } catch (e) { threw = true; }
  assert(threw, 'doorka "student" waa in la diido');

  const admin = M.registerUser(s, {
    fullName: 'Maamule', phone: '061', password: '1234', role: M.ROLES.SUPER_ADMIN,
  });
  assertEqual(admin.user.role, 'super_admin');
});

check('taleefan la iska diiwaan geliyay mar labaad waa la diidaa', () => {
  let s = freshStore();
  s = M.registerUser(s, { fullName: 'A', phone: '061', password: '1234', role: M.ROLES.TEACHER }).store;
  let threw = false;
  try {
    M.registerUser(s, { fullName: 'B', phone: '061', password: '5678', role: M.ROLES.TEACHER });
  } catch (e) { threw = true; }
  assert(threw, 'taleefanka isku mid ah waa in la diido');
});

check('furaha khaldan waa la diidaa', () => {
  let s = freshStore();
  s = M.registerUser(s, { fullName: 'A', phone: '061', password: 'sax1', role: M.ROLES.TEACHER }).store;
  let threw = false;
  try { M.verifyLogin(s, '061', 'khalad'); } catch (e) { threw = true; }
  assert(threw, 'furaha khaldan waa in la diido');
  assertEqual(M.verifyLogin(s, '061', 'sax1').full_name, 'A');
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
  const a = M.registerUser(s, { fullName: 'Macalin A', phone: '061', password: '1234', role: M.ROLES.TEACHER });
  s = a.store;
  const b = M.registerUser(s, { fullName: 'Macalin B', phone: '062', password: '1234', role: M.ROLES.TEACHER });
  s = b.store;

  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10, teacherId: a.user.user_id });
  const classId = s.classes[0].class_id;
  assertEqual(M.classesForUser(s, M.findUserByPhone(s, '061')).length, 1);

  // loo wareejiyo macalin kale — kii hore waa inuu lumiyo
  s = M.assignTeacher(s, classId, b.user.user_id);
  assertEqual(M.classesForUser(s, M.findUserByPhone(s, '061')).length, 0, 'macalinkii hore');
  assertEqual(M.classesForUser(s, M.findUserByPhone(s, '062')).length, 1, 'macalinka cusub');
  assertEqual(M.getClassById(s, classId).teacher_id, b.user.user_id);
});

check('macalinku wuxuu arkaa fasaladiisa, maamuluhuna dhammaan', () => {
  let s = freshStore();
  const admin = M.registerUser(s, { fullName: 'Maamule', phone: '060', password: '1234', role: M.ROLES.SUPER_ADMIN });
  s = admin.store;
  const t = M.registerUser(s, { fullName: 'Macalin', phone: '061', password: '1234', role: M.ROLES.TEACHER });
  s = t.store;

  s = M.addClass(s, { name: 'Fasalka 1A', monthlyFee: 10, teacherId: t.user.user_id });
  s = M.addClass(s, { name: 'Fasalka 2B', monthlyFee: 10 });

  assertEqual(M.classesForUser(s, M.findUserByPhone(s, '060')).length, 2, 'maamulaha');
  assertEqual(M.classesForUser(s, M.findUserByPhone(s, '061')).length, 1, 'macalinka');

  const otherId = s.classes[1].class_id;
  assert(!M.canAccessClass(M.findUserByPhone(s, '061'), otherId), 'macalinku ma gali karo fasal kale');
  assert(M.canAccessClass(M.findUserByPhone(s, '060'), otherId), 'maamuluhu wuu gali karaa');
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

/* ---------- 6. Caawiyayaasha taariikhda ---------- */
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
