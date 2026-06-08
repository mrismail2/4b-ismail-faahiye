# Kobciye RN (Expo / React Native — Phase 1 + Phase 2 Database)

Kobciye is a **school management SaaS** — React Native / Expo app that gives
schools, teachers, parents and students one trusted place for the things that
matter day to day: students & staff, attendance, exams, lesson preparation,
payments & subscription billing (priced by active student count), messaging
and automatic parent reports — all themed and localized in Somali/English.

## Core modules (Phase 1 UI)

- **Students, Teachers & Parents** — profiles with photo/avatar fallback, class assignment and family links
- **Attendance** — present / absent / late tracking with clear color-coded status and percentage summaries
- **Exams** — grades, marks, ranks and teacher notes, visible to students, parents, teachers and admins
- **Lesson preparation** — teachers submit lesson plans (draft → submitted → approved/needs revision); admins review
- **Payments & Subscription** — fee status/history for families, full revenue breakdown for accountants/admins, and a SaaS subscription dashboard showing the school's plan, usage and monthly fee (calculated by student count)
- **Messaging** — school-monitored chat between staff and families, plus dedicated teacher-profile cards with a "Message teacher" action
- **Parent reports** — template-based automatic updates (attendance, exam, payment reminder, general notice, teacher note) deliverable via SMS, WhatsApp or in-app notification
- **Staff & permissions** — role assignment (school admin, teacher, accountant, parent, student) with granular permission badges (e.g. `attendance.mark`, `exams.create`, `payments.view`)

> Note: the Qur'an / Madrasa progress module has been removed from Kobciye for
> now — the app's focus is general school management (students, teachers,
> parents, attendance, exams, payments, lessons, messaging and reports).

## Public preview & roadmap

Phase 1 public demo includes Student and Parent portals only. Admin, teacher,
accountant and super admin dashboards are planned for later phases. Real
Supabase database comes in Phase 2. Real authentication comes in Phase 3.

- **Phase 1** (this build) ships a public preview for the **Student** and
  **Parent** portals only. The Super Admin, School Admin, Teacher and
  Accountant dashboards remain fully built in the codebase but their demo
  accounts are disabled and not advertised on the public login screen.
- **Phase 2** — Supabase database schema, RLS security policies and helper
  functions are complete (see `database/` folder). UI is not yet wired to
  the real backend.
- **Phase 3** introduces real role-based login via Supabase Auth, at which
  point every role signs in with a real account and all UI modules connect
  to live Supabase data.

---

## Phase 2 — Database

### SQL run order

Run the files in this exact order against your Supabase project:

```
1. database/schema.sql
2. database/functions.sql
3. database/policies.sql
4. database/seed.sql
```

Or apply the single combined migration:

```
database/migrations/001_phase2_initial_schema.sql
```

### Tables created (22)

| Table | Purpose |
|---|---|
| `schools` | One row per school on the platform |
| `profiles` | One row per `auth.users` entry — role, status, school link |
| `students` | Student records linked to a school and class |
| `parents` | Parent records linked to a school |
| `parent_students` | Many-to-many: parent ↔ student links |
| `teachers` | Teacher records linked to a school |
| `classes` | Classes / grade groups within a school |
| `subjects` | Subjects taught within a school |
| `teacher_assignments` | Teacher ↔ class ↔ subject assignments |
| `attendance` | Daily attendance per student |
| `exams` | Exam definitions per class/subject |
| `exam_results` | Per-student results for each exam |
| `payments` | Fee payments per student |
| `lesson_preparations` | Teacher lesson plans with approval workflow |
| `messages` | School-monitored messages between users |
| `parent_reports` | Auto-generated parent update reports |
| `notifications` | In-app notifications per user |
| `permissions` | Global permission code registry |
| `role_permissions` | Per-school role → permission assignments |
| `plans` | SaaS pricing tiers (small/medium/large) |
| `subscriptions` | School ↔ plan subscriptions |
| `audit_logs` | Immutable action log for security/compliance |

### Functions created (12)

| Function | Purpose |
|---|---|
| `handle_updated_at()` | Trigger: auto-sets `updated_at = now()` on update |
| `get_my_profile()` | Returns the calling user's full profile row |
| `get_my_role()` | Returns the calling user's `app_role` |
| `get_my_school_id()` | Returns the calling user's `school_id` |
| `is_super_admin()` | True if caller is an active super admin |
| `is_school_admin()` | True if caller is an active school admin |
| `is_active_user()` | True if caller's profile is active |
| `same_school(school_id)` | True if caller belongs to the given school |
| `is_parent_of_student(student_id)` | True if caller is a linked parent of the student |
| `is_student_owner(student_id)` | True if caller IS the student (via profile link) |
| `is_teacher_assigned_to_class(class_id)` | True if caller has a teaching assignment for the class |
| `handle_new_user()` | Trigger on `auth.users`: creates profile with safe defaults |

### handle_new_user defaults

Every new Supabase Auth user gets:

```
role      = parent    (never trust frontend role selection)
status    = inactive
is_active = false
school_id = null      (assigned later by a school admin or super admin)
```

### RLS summary

RLS is enabled on all 22 tables. Access is enforced at the database
level — the frontend role selection is never trusted.

| Role | Scope |
|---|---|
| `super_admin` | Full platform access across all schools |
| `school_admin` | Full access within own school only |
| `teacher` | Read/write attendance, exams and lesson prep for assigned classes only |
| `accountant` | Read/write payments within own school only |
| `parent` | Read-only access to linked children's data |
| `student` | Read-only access to own data only |

### What remains for Phase 3

- Connect Supabase JS client (`src/services/supabase_config.js` has the placeholder keys)
- Replace `DEMO_ACCOUNTS` in `AuthContext.js` with `supabase.auth.signIn`
- Wire each UI section to real Supabase queries
- Implement real-time subscriptions for attendance, messages and notifications
- Build school onboarding flow (admin creates school, invites staff)
- Add storage bucket for avatars, lesson-prep attachments and report PDFs
- Set up Edge Functions for parent report generation (Somali/English)

---

## Run on web (Phase 1 UI)

```bash
cd kobciye-rn
npm install
npx expo start --web
```

Press `w` or open `http://localhost:8081` to view in the browser.

### Troubleshooting: blank white screen on web

If the web build shows a blank white page and the console reports
`_expoModulesCore.registerWebModule is not a function`, realign
Expo-managed dependencies then restart with a clean cache:

```bash
npx expo install --fix
npm install
npx expo start -c
```
