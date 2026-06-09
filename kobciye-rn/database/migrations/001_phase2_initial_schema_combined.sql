-- =============================================================
-- Kobciye Migration 001 — Phase 2 Initial Schema (Combined)
-- Single file for migration tools (supabase db push, flyway, etc.)
-- Contains: schema.sql → functions.sql → policies.sql → seed.sql
-- =============================================================
-- =====================================================================
-- schema.sql
-- =====================================================================

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


-- =====================================================================
-- functions.sql
-- =====================================================================

-- =============================================================
-- Kobciye Phase 2 — Functions
-- Run after schema.sql
-- =============================================================

-- =============================================================
-- handle_updated_at()
-- Automatically set updated_at = now() on any row update.
-- =============================================================

create or replace function handle_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Attach to every table that has updated_at
do $$
declare
  t text;
begin
  foreach t in array array[
    'schools','profiles','classes','subjects','students','parents',
    'teachers','attendance','exams','exam_results','payments',
    'lesson_preparations','messages','parent_reports','plans',
    'subscriptions'
  ]
  loop
    execute format(
      'drop trigger if exists trg_updated_at on %I;
       create trigger trg_updated_at
         before update on %I
         for each row execute function handle_updated_at();',
      t, t
    );
  end loop;
end;
$$;

-- =============================================================
-- get_my_profile()
-- Returns the calling user's profile row.
-- =============================================================

create or replace function get_my_profile()
returns setof profiles
language sql
security definer
stable
set search_path = public
as $$
  select * from profiles where id = auth.uid();
$$;

-- =============================================================
-- get_my_role()
-- Returns the calling user's role.
-- =============================================================

create or replace function get_my_role()
returns app_role
language sql
security definer
stable
set search_path = public
as $$
  select role from profiles where id = auth.uid();
$$;

-- =============================================================
-- get_my_school_id()
-- Returns the calling user's school_id.
-- =============================================================

create or replace function get_my_school_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select school_id from profiles where id = auth.uid();
$$;

-- =============================================================
-- is_super_admin()
-- =============================================================

create or replace function is_super_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and role = 'super_admin'
      and is_active = true
  );
$$;

-- =============================================================
-- is_school_admin()
-- =============================================================

create or replace function is_school_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and role = 'school_admin'
      and is_active = true
  );
$$;

-- =============================================================
-- is_active_user()
-- =============================================================

create or replace function is_active_user()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and is_active = true
      and status = 'active'
  );
$$;

-- =============================================================
-- same_school(school_id uuid)
-- True when the calling user belongs to the given school.
-- =============================================================

create or replace function same_school(p_school_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and school_id = p_school_id
      and is_active = true
  );
$$;

-- =============================================================
-- is_parent_of_student(student_id uuid)
-- True when the calling user is a linked parent of the student.
-- =============================================================

create or replace function is_parent_of_student(p_student_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from parent_students ps
    join parents pa on pa.id = ps.parent_id
    where pa.profile_id = auth.uid()
      and ps.student_id = p_student_id
  );
$$;

-- =============================================================
-- is_student_owner(student_id uuid)
-- True when the calling user IS the student (via profile link).
-- =============================================================

create or replace function is_student_owner(p_student_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from students
    where id = p_student_id
      and profile_id = auth.uid()
  );
$$;

-- =============================================================
-- is_teacher_assigned_to_class(class_id uuid)
-- True when the calling teacher has an assignment to the class.
-- =============================================================

create or replace function is_teacher_assigned_to_class(p_class_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from teacher_assignments ta
    join teachers t on t.id = ta.teacher_id
    where t.profile_id = auth.uid()
      and ta.class_id = p_class_id
  );
$$;

-- =============================================================
-- handle_new_user()
-- Trigger: called after INSERT on auth.users.
-- Creates a profile row with safe defaults — role=parent,
-- status=inactive, is_active=false, school_id=null.
-- The school admin or super admin must activate the user later.
-- =============================================================

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    email,
    role,
    status,
    is_active,
    school_id
  ) values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    'parent',      -- safe default: never trust frontend role selection
    'inactive',
    false,
    null           -- must be assigned by a school admin
  );
  return new;
end;
$$;

-- Attach to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();


-- =====================================================================
-- policies.sql
-- =====================================================================

-- =============================================================
-- Kobciye Phase 2 — Row Level Security Policies
-- Run after functions.sql
-- =============================================================

-- =============================================================
-- Helper: enable RLS on all private tables
-- =============================================================

alter table profiles              enable row level security;
alter table schools               enable row level security;
alter table classes               enable row level security;
alter table subjects              enable row level security;
alter table students              enable row level security;
alter table parents               enable row level security;
alter table parent_students       enable row level security;
alter table teachers              enable row level security;
alter table teacher_assignments   enable row level security;
alter table attendance            enable row level security;
alter table exams                 enable row level security;
alter table exam_results          enable row level security;
alter table payments              enable row level security;
alter table lesson_preparations   enable row level security;
alter table messages              enable row level security;
alter table parent_reports        enable row level security;
alter table notifications         enable row level security;
alter table permissions           enable row level security;
alter table role_permissions      enable row level security;
alter table plans                 enable row level security;
alter table subscriptions         enable row level security;
alter table audit_logs            enable row level security;

-- =============================================================
-- SCHOOLS
-- super_admin: full access
-- school_admin/others: read own school only
-- =============================================================

drop policy if exists "schools: super_admin full access" on schools;
create policy "schools: super_admin full access"
  on schools for all
  using (is_super_admin());

drop policy if exists "schools: members read own school" on schools;
create policy "schools: members read own school"
  on schools for select
  using (same_school(id));

-- =============================================================
-- PROFILES
-- =============================================================

drop policy if exists "profiles: super_admin full access" on profiles;
create policy "profiles: super_admin full access"
  on profiles for all
  using (is_super_admin());

drop policy if exists "profiles: school_admin manages own school" on profiles;
create policy "profiles: school_admin manages own school"
  on profiles for all
  using (
    is_school_admin()
    and school_id = get_my_school_id()
  );

drop policy if exists "profiles: user reads own row" on profiles;
create policy "profiles: user reads own row"
  on profiles for select
  using (id = auth.uid());

drop policy if exists "profiles: user updates own row" on profiles;
create policy "profiles: user updates own row"
  on profiles for update
  using (id = auth.uid())
  with check (
    id = auth.uid()
    -- prevent self-promotion: role and school_id are immutable by the user
    and role = (select role from profiles where id = auth.uid())
    and school_id = (select school_id from profiles where id = auth.uid())
  );

-- =============================================================
-- CLASSES
-- =============================================================

drop policy if exists "classes: super_admin full access" on classes;
create policy "classes: super_admin full access"
  on classes for all using (is_super_admin());

drop policy if exists "classes: school_admin manages own school" on classes;
create policy "classes: school_admin manages own school"
  on classes for all
  using (is_school_admin() and same_school(school_id));

drop policy if exists "classes: members read own school" on classes;
create policy "classes: members read own school"
  on classes for select
  using (same_school(school_id));

-- =============================================================
-- SUBJECTS
-- =============================================================

drop policy if exists "subjects: super_admin full access" on subjects;
create policy "subjects: super_admin full access"
  on subjects for all using (is_super_admin());

drop policy if exists "subjects: school_admin manages own school" on subjects;
create policy "subjects: school_admin manages own school"
  on subjects for all
  using (is_school_admin() and same_school(school_id));

drop policy if exists "subjects: members read own school" on subjects;
create policy "subjects: members read own school"
  on subjects for select
  using (same_school(school_id));

-- =============================================================
-- STUDENTS
-- =============================================================

drop policy if exists "students: super_admin full access" on students;
create policy "students: super_admin full access"
  on students for all using (is_super_admin());

drop policy if exists "students: school_admin manages own school" on students;
create policy "students: school_admin manages own school"
  on students for all
  using (is_school_admin() and same_school(school_id));

drop policy if exists "students: teacher reads assigned classes" on students;
create policy "students: teacher reads assigned classes"
  on students for select
  using (
    get_my_role() = 'teacher'
    and same_school(school_id)
    and is_teacher_assigned_to_class(class_id)
  );

drop policy if exists "students: accountant reads own school" on students;
create policy "students: accountant reads own school"
  on students for select
  using (
    get_my_role() = 'accountant'
    and same_school(school_id)
  );

drop policy if exists "students: parent reads linked children" on students;
create policy "students: parent reads linked children"
  on students for select
  using (
    get_my_role() = 'parent'
    and is_parent_of_student(id)
  );

drop policy if exists "students: student reads own row" on students;
create policy "students: student reads own row"
  on students for select
  using (
    get_my_role() = 'student'
    and is_student_owner(id)
  );

-- =============================================================
-- PARENTS
-- =============================================================

drop policy if exists "parents: super_admin full access" on parents;
create policy "parents: super_admin full access"
  on parents for all using (is_super_admin());

drop policy if exists "parents: school_admin manages own school" on parents;
create policy "parents: school_admin manages own school"
  on parents for all
  using (is_school_admin() and same_school(school_id));

drop policy if exists "parents: parent reads own row" on parents;
create policy "parents: parent reads own row"
  on parents for select
  using (profile_id = auth.uid());

-- =============================================================
-- PARENT_STUDENTS
-- =============================================================

drop policy if exists "parent_students: super_admin full access" on parent_students;
create policy "parent_students: super_admin full access"
  on parent_students for all using (is_super_admin());

drop policy if exists "parent_students: school_admin manages own school" on parent_students;
create policy "parent_students: school_admin manages own school"
  on parent_students for all
  using (is_school_admin() and same_school(school_id));

drop policy if exists "parent_students: parent reads own links" on parent_students;
create policy "parent_students: parent reads own links"
  on parent_students for select
  using (
    get_my_role() = 'parent'
    and exists (
      select 1 from parents p
      where p.id = parent_id and p.profile_id = auth.uid()
    )
  );

-- =============================================================
-- TEACHERS
-- =============================================================

drop policy if exists "teachers: super_admin full access" on teachers;
create policy "teachers: super_admin full access"
  on teachers for all using (is_super_admin());

drop policy if exists "teachers: school_admin manages own school" on teachers;
create policy "teachers: school_admin manages own school"
  on teachers for all
  using (is_school_admin() and same_school(school_id));

drop policy if exists "teachers: teacher reads own row" on teachers;
create policy "teachers: teacher reads own row"
  on teachers for select
  using (profile_id = auth.uid());

drop policy if exists "teachers: school members read teachers" on teachers;
create policy "teachers: school members read teachers"
  on teachers for select
  using (same_school(school_id));

-- =============================================================
-- TEACHER_ASSIGNMENTS
-- =============================================================

drop policy if exists "teacher_assignments: super_admin full access" on teacher_assignments;
create policy "teacher_assignments: super_admin full access"
  on teacher_assignments for all using (is_super_admin());

drop policy if exists "teacher_assignments: school_admin manages own school" on teacher_assignments;
create policy "teacher_assignments: school_admin manages own school"
  on teacher_assignments for all
  using (is_school_admin() and same_school(school_id));

drop policy if exists "teacher_assignments: teacher reads own" on teacher_assignments;
create policy "teacher_assignments: teacher reads own"
  on teacher_assignments for select
  using (
    get_my_role() = 'teacher'
    and exists (
      select 1 from teachers t
      where t.id = teacher_id and t.profile_id = auth.uid()
    )
  );

-- =============================================================
-- ATTENDANCE
-- =============================================================

drop policy if exists "attendance: super_admin full access" on attendance;
create policy "attendance: super_admin full access"
  on attendance for all using (is_super_admin());

drop policy if exists "attendance: school_admin manages own school" on attendance;
create policy "attendance: school_admin manages own school"
  on attendance for all
  using (is_school_admin() and same_school(school_id));

drop policy if exists "attendance: teacher manages assigned classes" on attendance;
create policy "attendance: teacher manages assigned classes"
  on attendance for all
  using (
    get_my_role() = 'teacher'
    and same_school(school_id)
    and is_teacher_assigned_to_class(class_id)
  );

drop policy if exists "attendance: parent reads linked children" on attendance;
create policy "attendance: parent reads linked children"
  on attendance for select
  using (
    get_my_role() = 'parent'
    and is_parent_of_student(student_id)
  );

drop policy if exists "attendance: student reads own" on attendance;
create policy "attendance: student reads own"
  on attendance for select
  using (
    get_my_role() = 'student'
    and is_student_owner(student_id)
  );

-- =============================================================
-- EXAMS
-- =============================================================

drop policy if exists "exams: super_admin full access" on exams;
create policy "exams: super_admin full access"
  on exams for all using (is_super_admin());

drop policy if exists "exams: school_admin manages own school" on exams;
create policy "exams: school_admin manages own school"
  on exams for all
  using (is_school_admin() and same_school(school_id));

drop policy if exists "exams: teacher manages assigned classes" on exams;
create policy "exams: teacher manages assigned classes"
  on exams for all
  using (
    get_my_role() = 'teacher'
    and same_school(school_id)
    and is_teacher_assigned_to_class(class_id)
  );

drop policy if exists "exams: parent reads published exams" on exams;
create policy "exams: parent reads published exams"
  on exams for select
  using (
    get_my_role() = 'parent'
    and is_published = true
    and exists (
      select 1 from students s
      where s.class_id = exams.class_id
        and is_parent_of_student(s.id)
    )
  );

drop policy if exists "exams: student reads own published exams" on exams;
create policy "exams: student reads own published exams"
  on exams for select
  using (
    get_my_role() = 'student'
    and is_published = true
    and exists (
      select 1 from students s
      where s.class_id = exams.class_id
        and is_student_owner(s.id)
    )
  );

-- =============================================================
-- EXAM_RESULTS
-- =============================================================

drop policy if exists "exam_results: super_admin full access" on exam_results;
create policy "exam_results: super_admin full access"
  on exam_results for all using (is_super_admin());

drop policy if exists "exam_results: school_admin manages own school" on exam_results;
create policy "exam_results: school_admin manages own school"
  on exam_results for all
  using (is_school_admin() and same_school(school_id));

drop policy if exists "exam_results: teacher manages own school results" on exam_results;
drop policy if exists "exam_results: teacher manages assigned class results" on exam_results;
create policy "exam_results: teacher manages assigned class results"
  on exam_results for all
  using (
    get_my_role() = 'teacher'
    and same_school(school_id)
    and exists (
      select 1
      from exams e
      join teacher_assignments ta on ta.class_id = e.class_id
        and (ta.subject_id = e.subject_id or e.subject_id is null)
      join teachers t on t.id = ta.teacher_id
      where e.id = exam_results.exam_id
        and t.profile_id = auth.uid()
    )
  );

drop policy if exists "exam_results: parent reads linked children published" on exam_results;
create policy "exam_results: parent reads linked children published"
  on exam_results for select
  using (
    get_my_role() = 'parent'
    and is_published = true
    and is_parent_of_student(student_id)
  );

drop policy if exists "exam_results: student reads own published" on exam_results;
create policy "exam_results: student reads own published"
  on exam_results for select
  using (
    get_my_role() = 'student'
    and is_published = true
    and is_student_owner(student_id)
  );

-- =============================================================
-- PAYMENTS
-- =============================================================

drop policy if exists "payments: super_admin full access" on payments;
create policy "payments: super_admin full access"
  on payments for all using (is_super_admin());

drop policy if exists "payments: school_admin manages own school" on payments;
create policy "payments: school_admin manages own school"
  on payments for all
  using (is_school_admin() and same_school(school_id));

drop policy if exists "payments: accountant manages own school" on payments;
create policy "payments: accountant manages own school"
  on payments for all
  using (
    get_my_role() = 'accountant'
    and same_school(school_id)
  );

drop policy if exists "payments: parent reads own children payments" on payments;
create policy "payments: parent reads own children payments"
  on payments for select
  using (
    get_my_role() = 'parent'
    and is_parent_of_student(student_id)
  );

drop policy if exists "payments: student reads own payments" on payments;
create policy "payments: student reads own payments"
  on payments for select
  using (
    get_my_role() = 'student'
    and is_student_owner(student_id)
  );

-- =============================================================
-- LESSON_PREPARATIONS
-- =============================================================

drop policy if exists "lesson_preparations: super_admin full access" on lesson_preparations;
create policy "lesson_preparations: super_admin full access"
  on lesson_preparations for all using (is_super_admin());

drop policy if exists "lesson_preparations: school_admin manages own school" on lesson_preparations;
create policy "lesson_preparations: school_admin manages own school"
  on lesson_preparations for all
  using (is_school_admin() and same_school(school_id));

drop policy if exists "lesson_preparations: teacher manages own" on lesson_preparations;
create policy "lesson_preparations: teacher manages own"
  on lesson_preparations for all
  using (
    get_my_role() = 'teacher'
    and exists (
      select 1 from teachers t
      where t.id = teacher_id and t.profile_id = auth.uid()
    )
  );

-- =============================================================
-- MESSAGES
-- =============================================================

drop policy if exists "messages: super_admin full access" on messages;
create policy "messages: super_admin full access"
  on messages for all using (is_super_admin());

drop policy if exists "messages: school_admin reads own school" on messages;
create policy "messages: school_admin reads own school"
  on messages for select
  using (is_school_admin() and same_school(school_id));

drop policy if exists "messages: sender or recipient access" on messages;
create policy "messages: sender or recipient access"
  on messages for all
  using (
    sender_id = auth.uid()
    or recipient_id = auth.uid()
  );

-- =============================================================
-- PARENT_REPORTS
-- =============================================================

drop policy if exists "parent_reports: super_admin full access" on parent_reports;
create policy "parent_reports: super_admin full access"
  on parent_reports for all using (is_super_admin());

drop policy if exists "parent_reports: school_admin manages own school" on parent_reports;
create policy "parent_reports: school_admin manages own school"
  on parent_reports for all
  using (is_school_admin() and same_school(school_id));

drop policy if exists "parent_reports: teacher reads own school" on parent_reports;
create policy "parent_reports: teacher reads own school"
  on parent_reports for select
  using (get_my_role() = 'teacher' and same_school(school_id));

drop policy if exists "parent_reports: parent reads own children sent reports" on parent_reports;
create policy "parent_reports: parent reads own children sent reports"
  on parent_reports for select
  using (
    get_my_role() = 'parent'
    and is_sent = true
    and is_parent_of_student(student_id)
  );

-- =============================================================
-- NOTIFICATIONS
-- =============================================================

drop policy if exists "notifications: super_admin full access" on notifications;
create policy "notifications: super_admin full access"
  on notifications for all using (is_super_admin());

drop policy if exists "notifications: user reads own" on notifications;
create policy "notifications: user reads own"
  on notifications for select
  using (recipient_id = auth.uid());

drop policy if exists "notifications: user updates own (mark read)" on notifications;
create policy "notifications: user updates own (mark read)"
  on notifications for update
  using (recipient_id = auth.uid());

-- =============================================================
-- PERMISSIONS (reference table — readable by authenticated users)
-- =============================================================

drop policy if exists "permissions: authenticated can read" on permissions;
create policy "permissions: authenticated can read"
  on permissions for select
  using (auth.role() = 'authenticated');

drop policy if exists "permissions: super_admin full access" on permissions;
create policy "permissions: super_admin full access"
  on permissions for all using (is_super_admin());

-- =============================================================
-- ROLE_PERMISSIONS
-- =============================================================

drop policy if exists "role_permissions: super_admin full access" on role_permissions;
create policy "role_permissions: super_admin full access"
  on role_permissions for all using (is_super_admin());

drop policy if exists "role_permissions: school_admin manages own school" on role_permissions;
create policy "role_permissions: school_admin manages own school"
  on role_permissions for all
  using (is_school_admin() and same_school(school_id));

drop policy if exists "role_permissions: authenticated read own school" on role_permissions;
create policy "role_permissions: authenticated read own school"
  on role_permissions for select
  using (same_school(school_id));

-- =============================================================
-- PLANS (public read — pricing page)
-- =============================================================

drop policy if exists "plans: public read active" on plans;
create policy "plans: public read active"
  on plans for select
  using (is_active = true);

drop policy if exists "plans: super_admin full access" on plans;
create policy "plans: super_admin full access"
  on plans for all using (is_super_admin());

-- =============================================================
-- SUBSCRIPTIONS
-- =============================================================

drop policy if exists "subscriptions: super_admin full access" on subscriptions;
create policy "subscriptions: super_admin full access"
  on subscriptions for all using (is_super_admin());

drop policy if exists "subscriptions: school_admin reads own" on subscriptions;
create policy "subscriptions: school_admin reads own"
  on subscriptions for select
  using (is_school_admin() and same_school(school_id));

-- =============================================================
-- AUDIT_LOGS
-- =============================================================

drop policy if exists "audit_logs: super_admin full access" on audit_logs;
create policy "audit_logs: super_admin full access"
  on audit_logs for all using (is_super_admin());

drop policy if exists "audit_logs: school_admin reads own school" on audit_logs;
create policy "audit_logs: school_admin reads own school"
  on audit_logs for select
  using (is_school_admin() and same_school(school_id));

drop policy if exists "audit_logs: insert for authenticated" on audit_logs;
create policy "audit_logs: insert for authenticated"
  on audit_logs for insert
  with check (actor_id = auth.uid());


-- =====================================================================
-- seed.sql
-- =====================================================================

-- =============================================================
-- Kobciye Phase 2 — Seed Data
-- Run after policies.sql
-- Safe to re-run (uses ON CONFLICT DO NOTHING)
-- =============================================================

-- =============================================================
-- PLANS
-- =============================================================

insert into plans (tier, name, price_usd, max_students, description) values
  ('small',  'Small School',  10.00, 100,  'Perfect for small and community schools — every core tool included.')
on conflict (tier) do nothing;

insert into plans (tier, name, price_usd, max_students, description) values
  ('medium', 'Medium School', 20.00, 500,  'For growing schools that need more classes and deeper insight.')
on conflict (tier) do nothing;

insert into plans (tier, name, price_usd, max_students, description) values
  ('large',  'Large School',  50.00, null, 'Unlimited students and staff — priority support and every module.')
on conflict (tier) do nothing;

-- =============================================================
-- PERMISSIONS
-- =============================================================

insert into permissions (code, module, description) values
  ('students.view',           'students',      'View student list and profiles'),
  ('students.create',         'students',      'Enroll new students'),
  ('students.edit',           'students',      'Edit student records'),
  ('students.delete',         'students',      'Remove students'),
  ('attendance.view',         'attendance',    'View attendance records'),
  ('attendance.mark',         'attendance',    'Mark and edit attendance'),
  ('exams.view',              'exams',         'View exams and results'),
  ('exams.create',            'exams',         'Create and publish exams'),
  ('exams.grade',             'exams',         'Enter and edit exam results'),
  ('payments.view',           'payments',      'View payment records'),
  ('payments.create',         'payments',      'Record new payments'),
  ('payments.edit',           'payments',      'Edit payment entries'),
  ('lessons.view',            'lessons',       'View lesson preparations'),
  ('lessons.submit',          'lessons',       'Submit lesson preparations'),
  ('lessons.review',          'lessons',       'Review and approve lesson preps'),
  ('messages.send',           'messages',      'Send messages to parents and teachers'),
  ('reports.view',            'reports',       'View parent reports'),
  ('reports.generate',        'reports',       'Generate and send parent reports'),
  ('staff.view',              'staff',         'View staff list'),
  ('staff.manage',            'staff',         'Add, edit and deactivate staff'),
  ('permissions.manage',      'permissions',   'Manage role permissions'),
  ('subscription.view',       'subscription',  'View subscription details'),
  ('subscription.manage',     'subscription',  'Change subscription plan')
on conflict (code) do nothing;

-- =============================================================
-- DEMO SCHOOL (used only in development / staging)
-- Remove or replace before production.
-- =============================================================

insert into schools (id, name, slug, city, country) values
  ('00000000-0000-0000-0000-000000000001', 'Kobciye Demo School', 'kobciye-demo', 'Mogadishu', 'Somalia')
on conflict (slug) do nothing;
