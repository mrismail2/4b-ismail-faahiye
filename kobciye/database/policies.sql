-- =====================================================================
-- Kobciye — Phase 2: Row Level Security Policies
-- =====================================================================
-- SECURITY MODEL
--   - RLS is the source of truth for data isolation — never the frontend.
--   - super_admin   : full platform visibility (all schools).
--   - school_admin  : full read/write within own school only.
--   - teacher       : read own school; write attendance/results/notes/
--                     quran-progress only for classes they're assigned to.
--   - accountant    : manage payments & fee promises within own school.
--   - parent        : read-only, only for linked children (parent_students).
--   - student       : read-only, only their own records (students.user_id).
--   - anon/public   : no access to any private table.
--
-- Run order: schema.sql -> functions.sql -> policies.sql -> seed.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- Enable RLS everywhere. No table is left world-readable by default.
-- ---------------------------------------------------------------------
alter table public.schools enable row level security;
alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.students enable row level security;
alter table public.parents enable row level security;
alter table public.parent_students enable row level security;
alter table public.teachers enable row level security;
alter table public.teacher_assignments enable row level security;
alter table public.attendance enable row level security;
alter table public.payments enable row level security;
alter table public.mobile_money_transactions enable row level security;
alter table public.fee_promises enable row level security;
alter table public.exams enable row level security;
alter table public.exam_results enable row level security;
alter table public.quran_progress enable row level security;
alter table public.teacher_notes enable row level security;
alter table public.risk_scores enable row level security;
alter table public.parent_timeline enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;

-- =====================================================================
-- 1. schools
--    super_admin manages every school. school_admin (and everyone in
--    that school) may read their own school record only.
-- =====================================================================
drop policy if exists schools_select on public.schools;
create policy schools_select on public.schools
  for select
  using (
    public.is_super_admin()
    or id = public.get_my_school_id()
  );

drop policy if exists schools_insert on public.schools;
create policy schools_insert on public.schools
  for insert
  with check (public.is_super_admin());

drop policy if exists schools_update on public.schools;
create policy schools_update on public.schools
  for update
  using (public.is_super_admin())
  with check (public.is_super_admin());

drop policy if exists schools_delete on public.schools;
create policy schools_delete on public.schools
  for delete
  using (public.is_super_admin());

-- =====================================================================
-- 2. profiles
--    Everyone can see their own profile. Admins can see profiles inside
--    their own school. super_admin sees all. Nobody can self-elevate:
--    role/school_id changes are restricted to admins via the with-check.
-- =====================================================================
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select
  using (
    id = auth.uid()
    or public.is_super_admin()
    or (public.is_school_admin() and school_id = public.get_my_school_id())
  );

-- Row creation is handled by the handle_new_user() trigger (security
-- definer), so normal users never need an INSERT policy on profiles.
-- We still add a narrow one for admins provisioning staff profiles.
drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles
  for insert
  with check (
    public.is_super_admin()
    or (public.is_school_admin() and school_id = public.get_my_school_id())
  );

-- Users may update *non-sensitive* fields of their own profile (name,
-- phone, avatar, language). They can never change their own role,
-- school_id, status or is_active — only admins can.
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select role from public.profiles where id = auth.uid())
    and school_id is not distinct from (select school_id from public.profiles where id = auth.uid())
    and status = (select status from public.profiles where id = auth.uid())
    and is_active = (select is_active from public.profiles where id = auth.uid())
  );

drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin on public.profiles
  for update
  using (
    public.is_super_admin()
    or (public.is_school_admin() and school_id = public.get_my_school_id())
  )
  with check (
    public.is_super_admin()
    or (public.is_school_admin() and school_id = public.get_my_school_id())
  );

drop policy if exists profiles_delete on public.profiles;
create policy profiles_delete on public.profiles
  for delete
  using (public.is_super_admin());

-- =====================================================================
-- 3. classes
-- =====================================================================
drop policy if exists classes_select on public.classes;
create policy classes_select on public.classes
  for select
  using (public.is_super_admin() or public.same_school(school_id));

drop policy if exists classes_modify on public.classes;
create policy classes_modify on public.classes
  for all
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
  )
  with check (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
  );

-- =====================================================================
-- 4. students
--    - school_admin: full access within own school.
--    - teacher: read students in classes they are assigned to.
--    - parent: read only linked children.
--    - student: read only own record (students.user_id = auth.uid()).
--      NOTE: access is keyed off user_id, never off student_code —
--      typing a code can never grant access to someone else's record.
-- =====================================================================
drop policy if exists students_select on public.students;
create policy students_select on public.students
  for select
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (public.get_my_role() = 'accountant' and public.same_school(school_id))
    or (public.get_my_role() = 'teacher' and class_id is not null and public.is_teacher_assigned_to_class(class_id))
    or (public.get_my_role() = 'parent' and public.is_parent_of_student(id))
    or (public.get_my_role() = 'student' and user_id = auth.uid())
  );

drop policy if exists students_modify on public.students;
create policy students_modify on public.students
  for all
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
  )
  with check (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
  );

-- =====================================================================
-- 5. parents
-- =====================================================================
drop policy if exists parents_select on public.parents;
create policy parents_select on public.parents
  for select
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or user_id = auth.uid()
  );

drop policy if exists parents_modify on public.parents;
create policy parents_modify on public.parents
  for all
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
  )
  with check (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
  );

-- =====================================================================
-- 6. parent_students
--    Parents may see only their own links — never the full roster.
-- =====================================================================
drop policy if exists parent_students_select on public.parent_students;
create policy parent_students_select on public.parent_students
  for select
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or exists (
      select 1 from public.parents pr
      where pr.id = parent_students.parent_id and pr.user_id = auth.uid()
    )
    or (public.get_my_role() = 'student' and public.is_student_owner(student_id))
  );

drop policy if exists parent_students_modify on public.parent_students;
create policy parent_students_modify on public.parent_students
  for all
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
  )
  with check (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
  );

-- =====================================================================
-- 7. teachers
-- =====================================================================
drop policy if exists teachers_select on public.teachers;
create policy teachers_select on public.teachers
  for select
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or user_id = auth.uid()
  );

drop policy if exists teachers_modify on public.teachers;
create policy teachers_modify on public.teachers
  for all
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
  )
  with check (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
  );

-- =====================================================================
-- 8. teacher_assignments
--    Teachers can see only their own assignments, never the full list.
-- =====================================================================
drop policy if exists teacher_assignments_select on public.teacher_assignments;
create policy teacher_assignments_select on public.teacher_assignments
  for select
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or exists (
      select 1 from public.teachers t
      where t.id = teacher_assignments.teacher_id and t.user_id = auth.uid()
    )
  );

drop policy if exists teacher_assignments_modify on public.teacher_assignments;
create policy teacher_assignments_modify on public.teacher_assignments
  for all
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
  )
  with check (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
  );

-- =====================================================================
-- 9. attendance
--    - student: own attendance only
--    - parent: linked child's attendance only
--    - teacher: manage attendance only for assigned classes
--    - school_admin: manage all attendance within own school
-- =====================================================================
drop policy if exists attendance_select on public.attendance;
create policy attendance_select on public.attendance
  for select
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (public.get_my_role() = 'teacher' and class_id is not null and public.is_teacher_assigned_to_class(class_id))
    or (public.get_my_role() = 'parent' and public.is_parent_of_student(student_id))
    or (public.get_my_role() = 'student' and public.is_student_owner(student_id))
  );

drop policy if exists attendance_insert on public.attendance;
create policy attendance_insert on public.attendance
  for insert
  with check (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (
      public.get_my_role() = 'teacher'
      and public.same_school(school_id)
      and class_id is not null
      and public.is_teacher_assigned_to_class(class_id)
    )
  );

drop policy if exists attendance_update on public.attendance;
create policy attendance_update on public.attendance
  for update
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (
      public.get_my_role() = 'teacher'
      and class_id is not null
      and public.is_teacher_assigned_to_class(class_id)
    )
  )
  with check (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (
      public.get_my_role() = 'teacher'
      and public.same_school(school_id)
      and class_id is not null
      and public.is_teacher_assigned_to_class(class_id)
    )
  );

drop policy if exists attendance_delete on public.attendance;
create policy attendance_delete on public.attendance
  for delete
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
  );

-- =====================================================================
-- 10. payments
--     Teacher has NO access (per Phase 2 spec — may be granted later).
-- =====================================================================
drop policy if exists payments_select on public.payments;
create policy payments_select on public.payments
  for select
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (public.get_my_role() = 'accountant' and public.same_school(school_id))
    or (public.get_my_role() = 'parent' and public.is_parent_of_student(student_id))
    or (public.get_my_role() = 'student' and public.is_student_owner(student_id))
  );

drop policy if exists payments_modify on public.payments;
create policy payments_modify on public.payments
  for all
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (public.get_my_role() = 'accountant' and public.same_school(school_id))
  )
  with check (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (public.get_my_role() = 'accountant' and public.same_school(school_id))
  );

-- =====================================================================
-- 11. mobile_money_transactions
--     Financial reconciliation data — accountants & admins only.
-- =====================================================================
drop policy if exists mmt_select on public.mobile_money_transactions;
create policy mmt_select on public.mobile_money_transactions
  for select
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (public.get_my_role() = 'accountant' and public.same_school(school_id))
  );

drop policy if exists mmt_modify on public.mobile_money_transactions;
create policy mmt_modify on public.mobile_money_transactions
  for all
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (public.get_my_role() = 'accountant' and public.same_school(school_id))
  )
  with check (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (public.get_my_role() = 'accountant' and public.same_school(school_id))
  );

-- =====================================================================
-- 12. fee_promises
-- =====================================================================
drop policy if exists fee_promises_select on public.fee_promises;
create policy fee_promises_select on public.fee_promises
  for select
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (public.get_my_role() = 'accountant' and public.same_school(school_id))
    or (public.get_my_role() = 'parent' and public.is_parent_of_student(student_id))
    or (public.get_my_role() = 'student' and public.is_student_owner(student_id))
  );

drop policy if exists fee_promises_modify on public.fee_promises;
create policy fee_promises_modify on public.fee_promises
  for all
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (public.get_my_role() = 'accountant' and public.same_school(school_id))
  )
  with check (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (public.get_my_role() = 'accountant' and public.same_school(school_id))
  );

-- =====================================================================
-- 13. exams
-- =====================================================================
drop policy if exists exams_select on public.exams;
create policy exams_select on public.exams
  for select
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (public.get_my_role() = 'teacher' and class_id is not null and public.is_teacher_assigned_to_class(class_id))
    or (public.get_my_role() in ('parent', 'student', 'accountant') and public.same_school(school_id))
  );

drop policy if exists exams_modify on public.exams;
create policy exams_modify on public.exams
  for all
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (
      public.get_my_role() = 'teacher'
      and class_id is not null
      and public.is_teacher_assigned_to_class(class_id)
    )
  )
  with check (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (
      public.get_my_role() = 'teacher'
      and public.same_school(school_id)
      and class_id is not null
      and public.is_teacher_assigned_to_class(class_id)
    )
  );

-- =====================================================================
-- 14. exam_results
--     - student: own results
--     - parent: linked child's results
--     - teacher: manage results only for assigned classes (joined via exams.class_id)
--     - school_admin: manage all results within own school
-- =====================================================================
drop policy if exists exam_results_select on public.exam_results;
create policy exam_results_select on public.exam_results
  for select
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (
      public.get_my_role() = 'teacher'
      and exists (
        select 1 from public.exams e
        where e.id = exam_results.exam_id
          and e.class_id is not null
          and public.is_teacher_assigned_to_class(e.class_id)
      )
    )
    or (public.get_my_role() = 'parent' and public.is_parent_of_student(student_id))
    or (public.get_my_role() = 'student' and public.is_student_owner(student_id))
  );

drop policy if exists exam_results_modify on public.exam_results;
create policy exam_results_modify on public.exam_results
  for all
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (
      public.get_my_role() = 'teacher'
      and exists (
        select 1 from public.exams e
        where e.id = exam_results.exam_id
          and e.class_id is not null
          and public.is_teacher_assigned_to_class(e.class_id)
      )
    )
  )
  with check (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (
      public.get_my_role() = 'teacher'
      and public.same_school(school_id)
      and exists (
        select 1 from public.exams e
        where e.id = exam_results.exam_id
          and e.class_id is not null
          and public.is_teacher_assigned_to_class(e.class_id)
      )
    )
  );

-- =====================================================================
-- 15. quran_progress
-- =====================================================================
drop policy if exists quran_progress_select on public.quran_progress;
create policy quran_progress_select on public.quran_progress
  for select
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (
      public.get_my_role() = 'teacher'
      and exists (
        select 1 from public.teachers t
        where t.id = quran_progress.teacher_id and t.user_id = auth.uid()
      )
    )
    or (public.get_my_role() = 'parent' and public.is_parent_of_student(student_id))
    or (public.get_my_role() = 'student' and public.is_student_owner(student_id))
  );

drop policy if exists quran_progress_modify on public.quran_progress;
create policy quran_progress_modify on public.quran_progress
  for all
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (
      public.get_my_role() = 'teacher'
      and exists (
        select 1 from public.teachers t
        where t.id = quran_progress.teacher_id and t.user_id = auth.uid()
      )
    )
  )
  with check (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (
      public.get_my_role() = 'teacher'
      and public.same_school(school_id)
      and exists (
        select 1 from public.teachers t
        where t.id = quran_progress.teacher_id and t.user_id = auth.uid()
      )
    )
  );

-- =====================================================================
-- 16. teacher_notes
--     Parents/students do NOT see raw teacher notes in Phase 2 — only
--     admins, the authoring teacher, and (within own school) other staff.
-- =====================================================================
drop policy if exists teacher_notes_select on public.teacher_notes;
create policy teacher_notes_select on public.teacher_notes
  for select
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (
      public.get_my_role() = 'teacher'
      and exists (
        select 1 from public.teachers t
        where t.id = teacher_notes.teacher_id and t.user_id = auth.uid()
      )
    )
  );

drop policy if exists teacher_notes_modify on public.teacher_notes;
create policy teacher_notes_modify on public.teacher_notes
  for all
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (
      public.get_my_role() = 'teacher'
      and exists (
        select 1 from public.teachers t
        where t.id = teacher_notes.teacher_id and t.user_id = auth.uid()
      )
    )
  )
  with check (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (
      public.get_my_role() = 'teacher'
      and public.same_school(school_id)
      and exists (
        select 1 from public.teachers t
        where t.id = teacher_notes.teacher_id and t.user_id = auth.uid()
      )
    )
  );

-- =====================================================================
-- 17. risk_scores
--     Read-only intelligence output. Visible to staff + the family it
--     concerns; only the calculation function (security definer) writes.
-- =====================================================================
drop policy if exists risk_scores_select on public.risk_scores;
create policy risk_scores_select on public.risk_scores
  for select
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (public.get_my_role() = 'teacher' and public.same_school(school_id))
    or (public.get_my_role() = 'parent' and public.is_parent_of_student(student_id))
    or (public.get_my_role() = 'student' and public.is_student_owner(student_id))
  );

-- Direct writes are restricted to admins; routine writes happen through
-- calculate_student_risk(), which runs as SECURITY DEFINER and bypasses
-- this check safely (function owner privileges, not caller's).
drop policy if exists risk_scores_modify on public.risk_scores;
create policy risk_scores_modify on public.risk_scores
  for all
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
  )
  with check (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
  );

-- =====================================================================
-- 18. parent_timeline
-- =====================================================================
drop policy if exists parent_timeline_select on public.parent_timeline;
create policy parent_timeline_select on public.parent_timeline
  for select
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (public.get_my_role() = 'teacher' and public.same_school(school_id))
    or (public.get_my_role() = 'parent' and public.is_parent_of_student(student_id))
    or (public.get_my_role() = 'student' and public.is_student_owner(student_id))
  );

drop policy if exists parent_timeline_modify on public.parent_timeline;
create policy parent_timeline_modify on public.parent_timeline
  for all
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (public.get_my_role() = 'teacher' and public.same_school(school_id))
  )
  with check (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or (public.get_my_role() = 'teacher' and public.same_school(school_id))
  );

-- =====================================================================
-- 19. notifications
--     Each user sees notifications addressed to them personally, or
--     broadcast to their role within their school. Admins manage all.
-- =====================================================================
drop policy if exists notifications_select on public.notifications;
create policy notifications_select on public.notifications
  for select
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
    or target_user_id = auth.uid()
    or (
      target_role = public.get_my_role()
      and school_id is not distinct from public.get_my_school_id()
    )
  );

drop policy if exists notifications_modify on public.notifications;
create policy notifications_modify on public.notifications
  for all
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
  )
  with check (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
  );

-- A user may mark their own notifications as read.
drop policy if exists notifications_update_own on public.notifications;
create policy notifications_update_own on public.notifications
  for update
  using (target_user_id = auth.uid())
  with check (target_user_id = auth.uid());

-- =====================================================================
-- 20. audit_logs
--     Append-only, staff-visible record. Nobody can edit or delete
--     history through the API — only insert (via security-definer
--     helpers / triggers in later phases) and read by admins.
-- =====================================================================
drop policy if exists audit_logs_select on public.audit_logs;
create policy audit_logs_select on public.audit_logs
  for select
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
  );

drop policy if exists audit_logs_insert on public.audit_logs;
create policy audit_logs_insert on public.audit_logs
  for insert
  with check (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
  );

-- No update/delete policies exist on purpose — audit history is immutable.

-- =====================================================================
-- 21. plans
--     Public, read-only catalogue (used on the marketing/onboarding
--     screens). Only super_admin manages pricing.
-- =====================================================================
drop policy if exists plans_select on public.plans;
create policy plans_select on public.plans
  for select
  using (is_active = true or public.is_super_admin());

drop policy if exists plans_modify on public.plans;
create policy plans_modify on public.plans
  for all
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- =====================================================================
-- 22. subscriptions
--     School admins can see (read-only) their own school's billing
--     status; only super_admin manages subscriptions.
-- =====================================================================
drop policy if exists subscriptions_select on public.subscriptions;
create policy subscriptions_select on public.subscriptions
  for select
  using (
    public.is_super_admin()
    or (public.is_school_admin() and public.same_school(school_id))
  );

drop policy if exists subscriptions_modify on public.subscriptions;
create policy subscriptions_modify on public.subscriptions
  for all
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- =====================================================================
-- End of policies.sql — continue with seed.sql
-- =====================================================================
