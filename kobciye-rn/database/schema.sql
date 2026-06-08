-- =============================================================
-- Kobciye Phase 2 — Schema
-- Run order: schema.sql → functions.sql → policies.sql → seed.sql
-- =============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =============================================================
-- ENUMS
-- =============================================================

create type app_role as enum (
  'super_admin',
  'school_admin',
  'teacher',
  'accountant',
  'parent',
  'student'
);

create type user_status as enum (
  'active',
  'inactive',
  'suspended'
);

create type attendance_status as enum (
  'present',
  'absent',
  'late',
  'excused'
);

create type payment_status as enum (
  'paid',
  'pending',
  'overdue',
  'partial',
  'waived'
);

create type payment_method as enum (
  'cash',
  'mobile_money',
  'bank_transfer',
  'cheque',
  'other'
);

create type lesson_status as enum (
  'draft',
  'submitted',
  'approved',
  'needs_revision'
);

create type message_status as enum (
  'sent',
  'delivered',
  'read'
);

create type plan_tier as enum (
  'small',
  'medium',
  'large'
);

create type subscription_status as enum (
  'trialing',
  'active',
  'past_due',
  'cancelled'
);

-- =============================================================
-- SCHOOLS
-- =============================================================

create table if not exists schools (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  slug          text unique not null,
  address       text,
  city          text,
  country       text default 'Somalia',
  phone         text,
  email         text,
  logo_url      text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================================
-- PROFILES  (one row per auth.users row)
-- =============================================================

create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  school_id     uuid references schools(id) on delete set null,
  full_name     text not null,
  email         text not null,
  phone         text,
  avatar_url    text,
  role          app_role not null default 'parent',
  status        user_status not null default 'inactive',
  is_active     boolean not null default false,
  language      text not null default 'en',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================================
-- CLASSES
-- =============================================================

create table if not exists classes (
  id            uuid primary key default uuid_generate_v4(),
  school_id     uuid not null references schools(id) on delete cascade,
  name          text not null,
  grade_level   text,
  academic_year text not null,
  capacity      int,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================================
-- SUBJECTS
-- =============================================================

create table if not exists subjects (
  id            uuid primary key default uuid_generate_v4(),
  school_id     uuid not null references schools(id) on delete cascade,
  name          text not null,
  code          text,
  description   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================================
-- STUDENTS
-- =============================================================

create table if not exists students (
  id            uuid primary key default uuid_generate_v4(),
  school_id     uuid not null references schools(id) on delete cascade,
  profile_id    uuid references profiles(id) on delete set null,
  class_id      uuid references classes(id) on delete set null,
  full_name     text not null,
  date_of_birth date,
  gender        text,
  enrollment_no text,
  enrolled_at   date not null default current_date,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================================
-- PARENTS
-- =============================================================

create table if not exists parents (
  id            uuid primary key default uuid_generate_v4(),
  school_id     uuid not null references schools(id) on delete cascade,
  profile_id    uuid references profiles(id) on delete set null,
  full_name     text not null,
  phone         text,
  email         text,
  relationship  text default 'parent',
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================================
-- PARENT_STUDENTS  (many-to-many link)
-- =============================================================

create table if not exists parent_students (
  id            uuid primary key default uuid_generate_v4(),
  school_id     uuid not null references schools(id) on delete cascade,
  parent_id     uuid not null references parents(id) on delete cascade,
  student_id    uuid not null references students(id) on delete cascade,
  relationship  text default 'parent',
  is_primary    boolean not null default false,
  created_at    timestamptz not null default now(),
  unique(parent_id, student_id)
);

-- =============================================================
-- TEACHERS
-- =============================================================

create table if not exists teachers (
  id            uuid primary key default uuid_generate_v4(),
  school_id     uuid not null references schools(id) on delete cascade,
  profile_id    uuid references profiles(id) on delete set null,
  full_name     text not null,
  employee_no   text,
  specialization text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================================
-- TEACHER_ASSIGNMENTS  (teacher → class + subject)
-- =============================================================

create table if not exists teacher_assignments (
  id            uuid primary key default uuid_generate_v4(),
  school_id     uuid not null references schools(id) on delete cascade,
  teacher_id    uuid not null references teachers(id) on delete cascade,
  class_id      uuid not null references classes(id) on delete cascade,
  subject_id    uuid references subjects(id) on delete set null,
  academic_year text not null,
  is_class_teacher boolean not null default false,
  created_at    timestamptz not null default now(),
  unique(teacher_id, class_id, subject_id, academic_year)
);

-- =============================================================
-- ATTENDANCE
-- =============================================================

create table if not exists attendance (
  id            uuid primary key default uuid_generate_v4(),
  school_id     uuid not null references schools(id) on delete cascade,
  student_id    uuid not null references students(id) on delete cascade,
  class_id      uuid not null references classes(id) on delete cascade,
  recorded_by   uuid references profiles(id) on delete set null,
  date          date not null,
  status        attendance_status not null default 'present',
  note          text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique(student_id, date)
);

-- =============================================================
-- EXAMS
-- =============================================================

create table if not exists exams (
  id            uuid primary key default uuid_generate_v4(),
  school_id     uuid not null references schools(id) on delete cascade,
  class_id      uuid references classes(id) on delete set null,
  subject_id    uuid references subjects(id) on delete set null,
  created_by    uuid references profiles(id) on delete set null,
  title         text not null,
  description   text,
  exam_date     date,
  total_marks   numeric(6,2),
  pass_marks    numeric(6,2),
  academic_year text,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================================
-- EXAM_RESULTS
-- =============================================================

create table if not exists exam_results (
  id            uuid primary key default uuid_generate_v4(),
  school_id     uuid not null references schools(id) on delete cascade,
  exam_id       uuid not null references exams(id) on delete cascade,
  student_id    uuid not null references students(id) on delete cascade,
  marks_obtained numeric(6,2),
  grade         text,
  rank          int,
  remarks       text,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique(exam_id, student_id)
);

-- =============================================================
-- PAYMENTS
-- =============================================================

create table if not exists payments (
  id            uuid primary key default uuid_generate_v4(),
  school_id     uuid not null references schools(id) on delete cascade,
  student_id    uuid not null references students(id) on delete cascade,
  recorded_by   uuid references profiles(id) on delete set null,
  amount        numeric(10,2) not null,
  currency      text not null default 'USD',
  method        payment_method not null default 'cash',
  status        payment_status not null default 'pending',
  description   text,
  due_date      date,
  paid_at       timestamptz,
  reference_no  text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================================
-- LESSON_PREPARATIONS
-- =============================================================

create table if not exists lesson_preparations (
  id            uuid primary key default uuid_generate_v4(),
  school_id     uuid not null references schools(id) on delete cascade,
  teacher_id    uuid not null references teachers(id) on delete cascade,
  class_id      uuid not null references classes(id) on delete cascade,
  subject_id    uuid references subjects(id) on delete set null,
  reviewed_by   uuid references profiles(id) on delete set null,
  title         text not null,
  objectives    text,
  content       text,
  resources     text,
  lesson_date   date,
  status        lesson_status not null default 'draft',
  feedback      text,
  reviewed_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================================
-- MESSAGES
-- =============================================================

create table if not exists messages (
  id            uuid primary key default uuid_generate_v4(),
  school_id     uuid not null references schools(id) on delete cascade,
  sender_id     uuid not null references profiles(id) on delete cascade,
  recipient_id  uuid not null references profiles(id) on delete cascade,
  subject       text,
  body          text not null,
  status        message_status not null default 'sent',
  is_school_monitored boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================================
-- PARENT_REPORTS
-- =============================================================

create table if not exists parent_reports (
  id            uuid primary key default uuid_generate_v4(),
  school_id     uuid not null references schools(id) on delete cascade,
  student_id    uuid not null references students(id) on delete cascade,
  generated_by  uuid references profiles(id) on delete set null,
  title         text not null,
  body_en       text,
  body_so       text,
  report_date   date not null default current_date,
  is_sent       boolean not null default false,
  sent_at       timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================================
-- NOTIFICATIONS
-- =============================================================

create table if not exists notifications (
  id            uuid primary key default uuid_generate_v4(),
  school_id     uuid references schools(id) on delete cascade,
  recipient_id  uuid not null references profiles(id) on delete cascade,
  title         text not null,
  body          text,
  type          text,
  is_read       boolean not null default false,
  read_at       timestamptz,
  created_at    timestamptz not null default now()
);

-- =============================================================
-- PERMISSIONS
-- =============================================================

create table if not exists permissions (
  id            uuid primary key default uuid_generate_v4(),
  code          text unique not null,
  description   text,
  module        text,
  created_at    timestamptz not null default now()
);

-- =============================================================
-- ROLE_PERMISSIONS
-- =============================================================

create table if not exists role_permissions (
  id            uuid primary key default uuid_generate_v4(),
  school_id     uuid references schools(id) on delete cascade,
  role          app_role not null,
  permission_id uuid not null references permissions(id) on delete cascade,
  created_at    timestamptz not null default now(),
  unique(school_id, role, permission_id)
);

-- =============================================================
-- PLANS
-- =============================================================

create table if not exists plans (
  id            uuid primary key default uuid_generate_v4(),
  tier          plan_tier not null unique,
  name          text not null,
  price_usd     numeric(8,2) not null,
  max_students  int,
  description   text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================================
-- SUBSCRIPTIONS
-- =============================================================

create table if not exists subscriptions (
  id            uuid primary key default uuid_generate_v4(),
  school_id     uuid not null references schools(id) on delete cascade,
  plan_id       uuid not null references plans(id) on delete restrict,
  status        subscription_status not null default 'trialing',
  trial_ends_at timestamptz,
  current_period_start timestamptz,
  current_period_end   timestamptz,
  cancelled_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================================
-- AUDIT_LOGS
-- =============================================================

create table if not exists audit_logs (
  id            uuid primary key default uuid_generate_v4(),
  school_id     uuid references schools(id) on delete set null,
  actor_id      uuid references profiles(id) on delete set null,
  action        text not null,
  table_name    text,
  record_id     uuid,
  old_data      jsonb,
  new_data      jsonb,
  ip_address    inet,
  created_at    timestamptz not null default now()
);

-- =============================================================
-- INDEXES
-- =============================================================

create index if not exists idx_profiles_school_id      on profiles(school_id);
create index if not exists idx_profiles_role           on profiles(role);
create index if not exists idx_students_school_id      on students(school_id);
create index if not exists idx_students_class_id       on students(class_id);
create index if not exists idx_parents_school_id       on parents(school_id);
create index if not exists idx_parent_students_parent  on parent_students(parent_id);
create index if not exists idx_parent_students_student on parent_students(student_id);
create index if not exists idx_teachers_school_id      on teachers(school_id);
create index if not exists idx_teacher_assignments_teacher on teacher_assignments(teacher_id);
create index if not exists idx_teacher_assignments_class   on teacher_assignments(class_id);
create index if not exists idx_attendance_student_date on attendance(student_id, date);
create index if not exists idx_attendance_class_date   on attendance(class_id, date);
create index if not exists idx_exams_school_id         on exams(school_id);
create index if not exists idx_exam_results_exam_id    on exam_results(exam_id);
create index if not exists idx_exam_results_student_id on exam_results(student_id);
create index if not exists idx_payments_school_id      on payments(school_id);
create index if not exists idx_payments_student_id     on payments(student_id);
create index if not exists idx_lesson_prep_teacher_id  on lesson_preparations(teacher_id);
create index if not exists idx_lesson_prep_school_id   on lesson_preparations(school_id);
create index if not exists idx_messages_recipient      on messages(recipient_id);
create index if not exists idx_messages_sender         on messages(sender_id);
create index if not exists idx_notifications_recipient on notifications(recipient_id);
create index if not exists idx_audit_logs_school_id    on audit_logs(school_id);
create index if not exists idx_audit_logs_actor_id     on audit_logs(actor_id);
