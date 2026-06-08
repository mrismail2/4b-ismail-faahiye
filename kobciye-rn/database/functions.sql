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
