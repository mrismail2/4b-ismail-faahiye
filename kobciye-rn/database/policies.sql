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
create policy "exam_results: teacher manages own school results"
  on exam_results for all
  using (
    get_my_role() = 'teacher'
    and same_school(school_id)
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
