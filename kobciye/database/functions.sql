-- =====================================================================
-- Kobciye — Phase 2: Functions & Triggers
-- =====================================================================
-- These helper functions are the building blocks that policies.sql uses
-- to enforce Row Level Security. Keep them SECURITY DEFINER + STABLE so
-- they can be safely called from inside RLS policies without recursion
-- or privilege-escalation surprises.
--
-- Run order: schema.sql -> functions.sql -> policies.sql -> seed.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. handle_updated_at()
--    Generic trigger: keeps updated_at fresh on every UPDATE.
-- ---------------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Attach to every table that has an updated_at column.
drop trigger if exists set_updated_at on public.schools;
create trigger set_updated_at before update on public.schools
  for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at on public.classes;
create trigger set_updated_at before update on public.classes
  for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at on public.students;
create trigger set_updated_at before update on public.students
  for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at on public.parents;
create trigger set_updated_at before update on public.parents
  for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at on public.teachers;
create trigger set_updated_at before update on public.teachers
  for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at on public.attendance;
create trigger set_updated_at before update on public.attendance
  for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at on public.payments;
create trigger set_updated_at before update on public.payments
  for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at on public.fee_promises;
create trigger set_updated_at before update on public.fee_promises
  for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at on public.exam_results;
create trigger set_updated_at before update on public.exam_results
  for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at on public.quran_progress;
create trigger set_updated_at before update on public.quran_progress
  for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at on public.subscriptions;
create trigger set_updated_at before update on public.subscriptions
  for each row execute function public.handle_updated_at();

-- ---------------------------------------------------------------------
-- handle_payment_balance()
--    Keeps payments.balance and payments.status consistent whenever
--    amount_due / amount_paid change. Mentioned in schema.sql comment
--    for payments.balance — implemented here as a safe trigger instead
--    of a generated column so historical rows stay easy to adjust.
-- ---------------------------------------------------------------------
create or replace function public.handle_payment_balance()
returns trigger
language plpgsql
as $$
begin
  new.balance := coalesce(new.amount_due, 0) - coalesce(new.amount_paid, 0);

  if new.status <> 'free' then
    if new.amount_paid <= 0 then
      new.status := 'unpaid';
    elsif new.balance <= 0 then
      new.status := 'paid';
    else
      new.status := 'partial';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists set_payment_balance on public.payments;
create trigger set_payment_balance before insert or update on public.payments
  for each row execute function public.handle_payment_balance();

-- ---------------------------------------------------------------------
-- 2. get_my_profile()
--    Returns the full profile row for the current authenticated user.
-- ---------------------------------------------------------------------
create or replace function public.get_my_profile()
returns public.profiles
language sql
stable
security definer
set search_path = public
as $$
  select p.*
  from public.profiles p
  where p.id = auth.uid();
$$;

-- ---------------------------------------------------------------------
-- 3. get_my_role()
-- ---------------------------------------------------------------------
create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ---------------------------------------------------------------------
-- 4. get_my_school_id()
-- ---------------------------------------------------------------------
create or replace function public.get_my_school_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select school_id from public.profiles where id = auth.uid();
$$;

-- ---------------------------------------------------------------------
-- 5. is_super_admin()
-- ---------------------------------------------------------------------
create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'super_admin'
  );
$$;

-- ---------------------------------------------------------------------
-- 6. is_school_admin()
-- ---------------------------------------------------------------------
create or replace function public.is_school_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'school_admin'
  );
$$;

-- ---------------------------------------------------------------------
-- 7. is_active_user()
-- ---------------------------------------------------------------------
create or replace function public.is_active_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active = true and status = 'active'
  );
$$;

-- ---------------------------------------------------------------------
-- 8. same_school(target_school_id uuid)
-- ---------------------------------------------------------------------
create or replace function public.same_school(target_school_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select target_school_id is not null
     and target_school_id = (select school_id from public.profiles where id = auth.uid());
$$;

-- ---------------------------------------------------------------------
-- 9. is_parent_of_student(target_student_id uuid)
--    True when the current user is a parent linked to the student via
--    parent_students -> parents.user_id = auth.uid().
-- ---------------------------------------------------------------------
create or replace function public.is_parent_of_student(target_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.parent_students ps
    join public.parents pr on pr.id = ps.parent_id
    where ps.student_id = target_student_id
      and pr.user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------
-- 10. is_student_owner(target_student_id uuid)
--     A student may only access their own record — never by guessing
--     student_code, only via the auth user linked through students.user_id.
-- ---------------------------------------------------------------------
create or replace function public.is_student_owner(target_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.students s
    where s.id = target_student_id
      and s.user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------
-- 11. is_teacher_assigned_to_class(target_class_id uuid)
-- ---------------------------------------------------------------------
create or replace function public.is_teacher_assigned_to_class(target_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.teacher_assignments ta
    join public.teachers t on t.id = ta.teacher_id
    where ta.class_id = target_class_id
      and t.user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------
-- 12. calculate_student_risk(target_student_id uuid)
--     First, simple, EXPLAINABLE risk calculation. Inserts/updates
--     risk_scores with risk_level, risk_score, reasons (jsonb) and a
--     recommended_action. Designed to be called by a school_admin /
--     teacher / scheduled job — never by students or parents directly
--     (enforced in policies.sql, not here).
-- ---------------------------------------------------------------------
create or replace function public.calculate_student_risk(target_student_id uuid)
returns public.risk_scores
language plpgsql
security definer
set search_path = public
as $$
declare
  v_school_id uuid;
  v_absences_this_month integer := 0;
  v_unpaid_months integer := 0;
  v_exam_drop numeric := 0;
  v_has_serious_note boolean := false;
  v_reasons jsonb := '[]'::jsonb;
  v_score numeric := 0;
  v_level text;
  v_action text;
  v_result public.risk_scores;
begin
  select school_id into v_school_id from public.students where id = target_student_id;

  if v_school_id is null then
    raise exception 'Student % not found', target_student_id;
  end if;

  -- Absences in the current calendar month.
  select count(*) into v_absences_this_month
  from public.attendance
  where student_id = target_student_id
    and status = 'absent'
    and attendance_date >= date_trunc('month', current_date)
    and attendance_date < date_trunc('month', current_date) + interval '1 month';

  -- Unpaid (or partially paid) months on record.
  select count(*) into v_unpaid_months
  from public.payments
  where student_id = target_student_id
    and status in ('unpaid', 'partial');

  -- Drop between the two most recent exam results (previous - latest, in marks).
  select coalesce(prev.marks_obtained - latest.marks_obtained, 0)
  into v_exam_drop
  from (
    select er.marks_obtained, er.created_at
    from public.exam_results er
    where er.student_id = target_student_id
    order by er.created_at desc
    limit 1
  ) latest
  left join lateral (
    select er2.marks_obtained
    from public.exam_results er2
    where er2.student_id = target_student_id
      and er2.created_at < latest.created_at
    order by er2.created_at desc
    limit 1
  ) prev on true;

  -- Any serious teacher note on file.
  select exists (
    select 1 from public.teacher_notes
    where student_id = target_student_id and severity = 'serious'
  ) into v_has_serious_note;

  -- ---- Build explainable reasons + score -----------------------------
  if v_absences_this_month >= 4 then
    v_reasons := v_reasons || jsonb_build_array(jsonb_build_object(
      'reason', 'high_absences', 'detail', v_absences_this_month || ' absences this month'));
    v_score := v_score + 40;
  elsif v_absences_this_month >= 2 then
    v_reasons := v_reasons || jsonb_build_array(jsonb_build_object(
      'reason', 'moderate_absences', 'detail', v_absences_this_month || ' absences this month'));
    v_score := v_score + 20;
  end if;

  if v_unpaid_months >= 2 then
    v_reasons := v_reasons || jsonb_build_array(jsonb_build_object(
      'reason', 'unpaid_fees', 'detail', v_unpaid_months || ' unpaid/partial months'));
    v_score := v_score + 30;
  elsif v_unpaid_months = 1 then
    v_reasons := v_reasons || jsonb_build_array(jsonb_build_object(
      'reason', 'one_unpaid_month', 'detail', '1 unpaid/partial month'));
    v_score := v_score + 15;
  end if;

  if v_exam_drop >= 20 then
    v_reasons := v_reasons || jsonb_build_array(jsonb_build_object(
      'reason', 'sharp_exam_drop', 'detail', 'Marks dropped by ' || v_exam_drop || ' points'));
    v_score := v_score + 25;
  elsif v_exam_drop >= 10 then
    v_reasons := v_reasons || jsonb_build_array(jsonb_build_object(
      'reason', 'exam_drop', 'detail', 'Marks dropped by ' || v_exam_drop || ' points'));
    v_score := v_score + 12;
  end if;

  if v_has_serious_note then
    v_reasons := v_reasons || jsonb_build_array(jsonb_build_object(
      'reason', 'serious_teacher_note', 'detail', 'A serious teacher note is on file'));
    v_score := v_score + 25;
  end if;

  -- ---- Classify level using the rules supplied for Phase 2 -----------
  if v_absences_this_month >= 4
     or v_unpaid_months >= 2
     or v_exam_drop >= 20
     or v_has_serious_note then
    v_level := 'high';
    v_action := 'Schedule an urgent meeting with the parent and class teacher.';
  elsif v_absences_this_month >= 2
     or v_unpaid_months = 1
     or (v_exam_drop >= 10 and v_exam_drop < 20) then
    v_level := 'medium';
    v_action := 'Monitor closely and send a check-in note to the parent.';
  else
    v_level := 'low';
    v_action := 'No action needed — keep up the regular check-ins.';
  end if;

  if v_reasons = '[]'::jsonb then
    v_reasons := jsonb_build_array(jsonb_build_object(
      'reason', 'no_concerns', 'detail', 'No risk indicators found in current records'));
  end if;

  -- risk_scores has no unique key on student_id, so each calculation
  -- inserts a fresh snapshot — callers read the latest via
  -- "order by calculated_at desc limit 1", preserving useful history.
  insert into public.risk_scores (school_id, student_id, risk_level, risk_score, reasons, recommended_action, calculated_at)
  values (v_school_id, target_student_id, v_level, v_score, v_reasons, v_action, now())
  returning * into v_result;

  return v_result;
end;
$$;

-- ---------------------------------------------------------------------
-- 13. handle_new_user()
--     Fires on every new auth.users row. Creates a SAFE default profile.
--     NEVER trusts raw_user_meta_data for role or school_id — a public
--     sign-up can never grant itself elevated access.
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, status, is_active, school_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    'parent',     -- safe default — never read role from user metadata
    'inactive',   -- must be activated by a school_admin / super_admin
    false,
    null          -- school assignment happens later, by an admin
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- End of functions.sql — continue with policies.sql
-- =====================================================================
