-- =====================================================================
-- Kobciye — Phase 2: Seed Data
-- =====================================================================
-- Safe, illustrative demo data for a single demo school. No rows are
-- inserted into auth.users here — creating real auth users must go
-- through Supabase Auth (see "Demo auth users" note at the bottom),
-- never by writing directly into auth.users or storing passwords in
-- application tables.
--
-- Run order: schema.sql -> functions.sql -> policies.sql -> seed.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- Subscription plans (platform-level)
-- ---------------------------------------------------------------------
insert into public.plans (name, price_monthly, currency, student_limit, features, is_active)
values
  ('Basic',    10, 'USD', 100,  '["Attendance", "Payments", "Notices"]'::jsonb, true),
  ('Standard', 30, 'USD', 400,  '["Attendance", "Payments", "Notices", "Exams", "Quran progress"]'::jsonb, true),
  ('Premium',  50, 'USD', 2000, '["Attendance", "Payments", "Notices", "Exams", "Quran progress", "Risk intelligence", "Mobile money matching"]'::jsonb, true)
on conflict do nothing;

-- ---------------------------------------------------------------------
-- Demo school
-- ---------------------------------------------------------------------
insert into public.schools (id, name, school_type, country, city, address, phone, email, status, is_active, trial_starts_at, trial_ends_at)
values (
  '00000000-0000-0000-0000-000000000001',
  'Kobciye Demo School',
  'primary_and_secondary',
  'Somalia',
  'Mogadishu',
  'Hodan District, Mogadishu',
  '+252610000000',
  'demo@kobciye.com',
  'trial',
  true,
  now(),
  now() + interval '30 days'
)
on conflict (id) do nothing;

-- Subscribe the demo school to the Standard plan (trial).
insert into public.subscriptions (school_id, plan_id, status, amount, currency, started_at, ends_at)
select
  '00000000-0000-0000-0000-000000000001',
  p.id,
  'trial',
  p.price_monthly,
  p.currency,
  now(),
  now() + interval '30 days'
from public.plans p
where p.name = 'Standard'
on conflict do nothing;

-- ---------------------------------------------------------------------
-- Classes
-- ---------------------------------------------------------------------
insert into public.classes (id, school_id, name, grade_level, academic_year, is_active)
values
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Grade 5 - A', 'Grade 5', '2025/2026', true),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'Grade 6 - B', 'Grade 6', '2025/2026', true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- Sample teacher (profile/user is created via Supabase Auth — see
-- README "Demo auth users" section. user_id stays null until then).
-- ---------------------------------------------------------------------
insert into public.teachers (id, school_id, full_name, phone, email, subject_specialty, status)
values (
  '00000000-0000-0000-0000-000000000201',
  '00000000-0000-0000-0000-000000000001',
  'Teacher Amina Yusuf',
  '+252610000010',
  'teacher@kobciye.com',
  'Mathematics & Qur''an',
  'active'
)
on conflict (id) do nothing;

insert into public.teacher_assignments (id, school_id, teacher_id, class_id, subject, academic_year)
values (
  '00000000-0000-0000-0000-000000000301',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000201',
  '00000000-0000-0000-0000-000000000101',
  'Mathematics',
  '2025/2026'
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- Sample accountant
-- ---------------------------------------------------------------------
-- Accountants are stored as profiles (role = 'accountant') rather than
-- a dedicated table — see profiles.role check constraint in schema.sql.
-- A demo accountant profile is created post-Auth-signup; see README.

-- ---------------------------------------------------------------------
-- Sample students
-- ---------------------------------------------------------------------
insert into public.students (id, school_id, class_id, full_name, student_code, admission_number, gender, date_of_birth, status, monthly_fee)
values
  ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Yusuf Faadumo Xasan', 'STU-0001', 'ADM-2025-001', 'male',   '2014-03-12', 'active', 25),
  ('00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'Hodan Cabdullahi',   'STU-0002', 'ADM-2025-002', 'female', '2013-07-02', 'active', 25)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- Sample parent + parent-child link
-- ---------------------------------------------------------------------
insert into public.parents (id, school_id, full_name, phone, email, status)
values (
  '00000000-0000-0000-0000-000000000501',
  '00000000-0000-0000-0000-000000000001',
  'Faadumo Xasan',
  '+252610000020',
  'parent@kobciye.com',
  'active'
)
on conflict (id) do nothing;

insert into public.parent_students (id, school_id, parent_id, student_id, relationship)
values (
  '00000000-0000-0000-0000-000000000601',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000501',
  '00000000-0000-0000-0000-000000000401',
  'mother'
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- Sample attendance (current month, for risk-score testing)
-- ---------------------------------------------------------------------
insert into public.attendance (id, school_id, student_id, class_id, teacher_id, attendance_date, status, sync_status)
values
  ('00000000-0000-0000-0000-000000000701', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000201', date_trunc('month', current_date)::date + 0, 'present', 'synced'),
  ('00000000-0000-0000-0000-000000000702', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000201', date_trunc('month', current_date)::date + 1, 'present', 'synced'),
  ('00000000-0000-0000-0000-000000000703', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000201', date_trunc('month', current_date)::date + 2, 'late',    'synced'),
  ('00000000-0000-0000-0000-000000000704', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000201', date_trunc('month', current_date)::date + 0, 'present', 'synced')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- Sample payments
-- (balance/status are recalculated automatically by the
--  handle_payment_balance trigger from functions.sql)
-- ---------------------------------------------------------------------
insert into public.payments (id, school_id, student_id, month, year, amount_due, amount_paid, status, payment_method, payment_date)
values
  ('00000000-0000-0000-0000-000000000801', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000401', 'May',  2026, 25, 25, 'paid',   'mobile_money', '2026-05-03'),
  ('00000000-0000-0000-0000-000000000802', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000401', 'June', 2026, 25, 0,  'unpaid', null, null),
  ('00000000-0000-0000-0000-000000000803', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000402', 'June', 2026, 25, 25, 'paid',   'cash', '2026-06-01')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- Sample Qur'an progress
-- ---------------------------------------------------------------------
insert into public.quran_progress (id, school_id, student_id, teacher_id, surah_name, ayah_from, ayah_to, memorization_progress, revision_status, tajweed_level, teacher_note, progress_date)
values (
  '00000000-0000-0000-0000-000000000901',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000401',
  '00000000-0000-0000-0000-000000000201',
  'Al-Mulk', 1, 15, 0.62, 'on_track', 'intermediate',
  'Confident recitation, needs more work on tajweed of madd letters.',
  current_date
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- Sample risk score
-- (Normally produced by calculate_student_risk(); a static example row
--  is seeded here so dashboards have something to render immediately.)
-- ---------------------------------------------------------------------
insert into public.risk_scores (id, school_id, student_id, risk_level, risk_score, reasons, recommended_action, calculated_at)
values (
  '00000000-0000-0000-0000-000000000a01',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000402',
  'low',
  5,
  '[{"reason": "no_concerns", "detail": "No risk indicators found in current records"}]'::jsonb,
  'No action needed — keep up the regular check-ins.',
  now()
)
on conflict (id) do nothing;

-- =====================================================================
-- Demo auth users (DO NOT create directly in SQL)
-- =====================================================================
-- Passwords must only ever be handled by Supabase Auth — never stored
-- in application tables. To wire the rows above to real logins:
--
--   1. In Supabase Studio -> Authentication -> Users -> "Add user",
--      create users for each demo persona, e.g.:
--        admin@kobciye.com / school_admin
--        teacher@kobciye.com / teacher
--        accountant@kobciye.com / accountant
--        parent@kobciye.com / parent
--        student@kobciye.com / student
--
--   2. handle_new_user() will auto-create a 'parent'/'inactive' profile
--      for each. As super_admin / via the SQL editor, update each
--      profile's role, status, is_active and school_id, e.g.:
--
--        update public.profiles
--        set role = 'school_admin', status = 'active', is_active = true,
--            school_id = '00000000-0000-0000-0000-000000000001'
--        where email = 'admin@kobciye.com';
--
--   3. Link the teacher/parent/student profiles to their matching
--      teachers / parents / students rows by setting user_id, e.g.:
--
--        update public.teachers set user_id = '<auth-user-uuid>'
--        where email = 'teacher@kobciye.com';
--
--        update public.parents set user_id = '<auth-user-uuid>'
--        where email = 'parent@kobciye.com';
--
--        update public.students set user_id = '<auth-user-uuid>'
--        where student_code = 'STU-0001';
--
-- This keeps Phase 2 entirely free of stored passwords while still
-- giving you a fully-linked demo dataset to test RLS against in the
-- Supabase SQL editor (using "set local role" / impersonation, or by
-- signing in for real once Phase 3 wires up Supabase Auth).
-- =====================================================================
