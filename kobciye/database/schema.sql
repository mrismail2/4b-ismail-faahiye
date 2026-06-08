-- =====================================================================
-- Kobciye — Phase 2: Database Schema
-- =====================================================================
-- Multi-school SaaS school-intelligence platform.
--
-- CORE PRINCIPLE: every row that belongs to a school carries school_id.
-- Isolation between schools is enforced later in policies.sql via
-- Row Level Security — never rely on frontend filtering alone.
--
-- Run order: schema.sql -> functions.sql -> policies.sql -> seed.sql
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1. schools
-- ---------------------------------------------------------------------
create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  school_type text,
  country text,
  city text,
  address text,
  phone text,
  email text,
  logo_url text,
  status text not null default 'trial',
  is_active boolean not null default true,
  trial_starts_at timestamptz,
  trial_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 2. profiles  (links auth.users -> role + school)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  school_id uuid references public.schools(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  role text not null default 'parent',
  status text not null default 'inactive',
  is_active boolean not null default false,
  avatar_url text,
  language text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (
    role in ('super_admin', 'school_admin', 'teacher', 'accountant', 'parent', 'student')
  )
);

create index if not exists idx_profiles_school_id on public.profiles(school_id);
create index if not exists idx_profiles_role on public.profiles(role);

-- ---------------------------------------------------------------------
-- 3. classes
-- ---------------------------------------------------------------------
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,
  grade_level text,
  academic_year text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_classes_school_id on public.classes(school_id);

-- ---------------------------------------------------------------------
-- 4. students
-- ---------------------------------------------------------------------
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  class_id uuid references public.classes(id),
  user_id uuid references auth.users(id),
  full_name text not null,
  student_code text,
  admission_number text,
  gender text,
  date_of_birth date,
  phone text,
  address text,
  status text not null default 'active',
  monthly_fee numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- student_code / admission_number must be unique *within the same school*,
  -- but may repeat across different schools.
  constraint students_school_code_unique unique (school_id, student_code),
  constraint students_school_admission_unique unique (school_id, admission_number)
);

create index if not exists idx_students_school_id on public.students(school_id);
create index if not exists idx_students_class_id on public.students(class_id);
create index if not exists idx_students_user_id on public.students(user_id);

-- ---------------------------------------------------------------------
-- 5. parents
-- ---------------------------------------------------------------------
create table if not exists public.parents (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  user_id uuid references auth.users(id),
  full_name text not null,
  phone text,
  email text,
  address text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_parents_school_id on public.parents(school_id);
create index if not exists idx_parents_user_id on public.parents(user_id);

-- ---------------------------------------------------------------------
-- 6. parent_students  (links parents <-> children)
-- ---------------------------------------------------------------------
create table if not exists public.parent_students (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  parent_id uuid not null references public.parents(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  relationship text,
  created_at timestamptz not null default now(),
  constraint parent_students_unique unique (parent_id, student_id)
);

create index if not exists idx_parent_students_school_id on public.parent_students(school_id);
create index if not exists idx_parent_students_parent_id on public.parent_students(parent_id);
create index if not exists idx_parent_students_student_id on public.parent_students(student_id);

-- ---------------------------------------------------------------------
-- 7. teachers
-- ---------------------------------------------------------------------
create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  user_id uuid references auth.users(id),
  full_name text not null,
  phone text,
  email text,
  subject_specialty text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_teachers_school_id on public.teachers(school_id);
create index if not exists idx_teachers_user_id on public.teachers(user_id);

-- ---------------------------------------------------------------------
-- 8. teacher_assignments
-- ---------------------------------------------------------------------
create table if not exists public.teacher_assignments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  class_id uuid references public.classes(id),
  subject text,
  academic_year text,
  created_at timestamptz not null default now()
);

create index if not exists idx_teacher_assignments_school_id on public.teacher_assignments(school_id);
create index if not exists idx_teacher_assignments_teacher_id on public.teacher_assignments(teacher_id);
create index if not exists idx_teacher_assignments_class_id on public.teacher_assignments(class_id);

-- ---------------------------------------------------------------------
-- 9. attendance
-- ---------------------------------------------------------------------
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  class_id uuid references public.classes(id),
  teacher_id uuid references public.teachers(id),
  attendance_date date not null,
  status text not null,
  note text,
  sync_status text not null default 'synced',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint attendance_status_check check (status in ('present', 'absent', 'late')),
  constraint attendance_student_date_unique unique (student_id, attendance_date)
);

create index if not exists idx_attendance_school_id on public.attendance(school_id);
create index if not exists idx_attendance_student_id on public.attendance(student_id);
create index if not exists idx_attendance_class_id on public.attendance(class_id);
create index if not exists idx_attendance_date on public.attendance(attendance_date);

-- ---------------------------------------------------------------------
-- 10. payments
-- ---------------------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  month text,
  year integer,
  amount_due numeric not null default 0,
  amount_paid numeric not null default 0,
  -- Maintained safely via trigger (see functions.sql: handle_payment_balance)
  -- rather than a generated column, so it stays simple to backfill/adjust.
  balance numeric not null default 0,
  status text not null default 'unpaid',
  payment_method text,
  payment_date date,
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payments_status_check check (status in ('paid', 'unpaid', 'partial', 'free'))
);

create index if not exists idx_payments_school_id on public.payments(school_id);
create index if not exists idx_payments_student_id on public.payments(student_id);
create index if not exists idx_payments_year_month on public.payments(year, month);

-- ---------------------------------------------------------------------
-- 11. mobile_money_transactions
-- ---------------------------------------------------------------------
create table if not exists public.mobile_money_transactions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  phone text,
  sender_name text,
  amount numeric not null,
  reference_text text,
  transaction_date timestamptz,
  matched_student_id uuid references public.students(id),
  match_status text not null default 'unmatched',
  confidence_score numeric,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint mmt_match_status_check check (
    match_status in ('matched', 'unmatched', 'needs_review', 'confirmed')
  )
);

create index if not exists idx_mmt_school_id on public.mobile_money_transactions(school_id);
create index if not exists idx_mmt_matched_student_id on public.mobile_money_transactions(matched_student_id);

-- ---------------------------------------------------------------------
-- 12. fee_promises
-- ---------------------------------------------------------------------
create table if not exists public.fee_promises (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  parent_id uuid references public.parents(id),
  promised_amount numeric not null,
  promised_date date not null,
  reminder_date date,
  note text,
  status text not null default 'promised',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint fee_promises_status_check check (
    status in ('promised', 'reminded', 'paid', 'broken_promise')
  )
);

create index if not exists idx_fee_promises_school_id on public.fee_promises(school_id);
create index if not exists idx_fee_promises_student_id on public.fee_promises(student_id);

-- ---------------------------------------------------------------------
-- 13. exams
-- ---------------------------------------------------------------------
create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  class_id uuid references public.classes(id),
  name text not null,
  subject text,
  exam_date date,
  total_marks numeric not null default 100,
  academic_year text,
  created_at timestamptz not null default now()
);

create index if not exists idx_exams_school_id on public.exams(school_id);
create index if not exists idx_exams_class_id on public.exams(class_id);

-- ---------------------------------------------------------------------
-- 14. exam_results
-- ---------------------------------------------------------------------
create table if not exists public.exam_results (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  exam_id uuid not null references public.exams(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  marks_obtained numeric,
  grade text,
  teacher_note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint exam_results_unique unique (exam_id, student_id)
);

create index if not exists idx_exam_results_school_id on public.exam_results(school_id);
create index if not exists idx_exam_results_student_id on public.exam_results(student_id);
create index if not exists idx_exam_results_exam_id on public.exam_results(exam_id);

-- ---------------------------------------------------------------------
-- 15. quran_progress
-- ---------------------------------------------------------------------
create table if not exists public.quran_progress (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  teacher_id uuid references public.teachers(id),
  surah_name text,
  ayah_from integer,
  ayah_to integer,
  memorization_progress numeric,
  revision_status text,
  tajweed_level text,
  teacher_note text,
  progress_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_quran_progress_school_id on public.quran_progress(school_id);
create index if not exists idx_quran_progress_student_id on public.quran_progress(student_id);

-- ---------------------------------------------------------------------
-- 16. teacher_notes
-- ---------------------------------------------------------------------
create table if not exists public.teacher_notes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  teacher_id uuid references public.teachers(id),
  note_type text,
  severity text not null default 'normal',
  note text not null,
  created_at timestamptz not null default now(),
  constraint teacher_notes_severity_check check (severity in ('normal', 'important', 'serious'))
);

create index if not exists idx_teacher_notes_school_id on public.teacher_notes(school_id);
create index if not exists idx_teacher_notes_student_id on public.teacher_notes(student_id);

-- ---------------------------------------------------------------------
-- 17. risk_scores
-- ---------------------------------------------------------------------
create table if not exists public.risk_scores (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  risk_level text not null,
  risk_score numeric,
  reasons jsonb not null default '[]'::jsonb,
  recommended_action text,
  calculated_at timestamptz not null default now(),
  constraint risk_scores_level_check check (risk_level in ('low', 'medium', 'high'))
);

create index if not exists idx_risk_scores_school_id on public.risk_scores(school_id);
create index if not exists idx_risk_scores_student_id on public.risk_scores(student_id);

-- ---------------------------------------------------------------------
-- 18. parent_timeline
-- ---------------------------------------------------------------------
create table if not exists public.parent_timeline (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  parent_id uuid references public.parents(id),
  event_type text,
  title text,
  description text,
  event_date timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_parent_timeline_school_id on public.parent_timeline(school_id);
create index if not exists idx_parent_timeline_student_id on public.parent_timeline(student_id);

-- ---------------------------------------------------------------------
-- 19. notifications
-- ---------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references public.schools(id) on delete cascade,
  target_role text,
  target_user_id uuid references auth.users(id),
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_school_id on public.notifications(school_id);
create index if not exists idx_notifications_target_user_id on public.notifications(target_user_id);

-- ---------------------------------------------------------------------
-- 20. audit_logs
-- ---------------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references public.schools(id),
  user_id uuid references auth.users(id),
  action text not null,
  table_name text,
  record_id uuid,
  description text,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_school_id on public.audit_logs(school_id);
create index if not exists idx_audit_logs_user_id on public.audit_logs(user_id);

-- ---------------------------------------------------------------------
-- 21. plans  (platform-level, not school-scoped)
-- ---------------------------------------------------------------------
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price_monthly numeric not null default 0,
  currency text not null default 'USD',
  student_limit integer,
  features jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 22. subscriptions
-- ---------------------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  plan_id uuid references public.plans(id),
  status text not null default 'trial',
  amount numeric not null default 0,
  currency text not null default 'USD',
  started_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subscriptions_status_check check (
    status in ('trial', 'active', 'expired', 'suspended', 'cancelled')
  )
);

create index if not exists idx_subscriptions_school_id on public.subscriptions(school_id);
create index if not exists idx_subscriptions_plan_id on public.subscriptions(plan_id);

-- =====================================================================
-- End of schema.sql — continue with functions.sql
-- =====================================================================
