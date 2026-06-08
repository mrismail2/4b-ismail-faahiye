# Kobciye 🌱

**Kobciye** — Somali for *"something that grows, develops, improves"* — is a
mobile-first **School Intelligence Platform** built with Flutter Web. It gives
schools, teachers, parents and students one trusted, beautiful place to manage
students, attendance, payments, exams and Qur'an/Madrasa progress — and to
spot students who need support, early.

> **Tagline:** Learn • Grow • Succeed  /  Baro • Koboc • Guulayso

This repository currently contains:
- **Phase 1**: the complete app foundation — theme system, routing, responsive
  shells, screens and demo authentication (no real backend wired up yet).
- **Phase 2**: the complete Supabase **database foundation & security
  model** — schema, helper functions and Row Level Security policies living
  under [`database/`](#phase-2--supabase-database-foundation--security). The
  app itself still uses demo auth; real Supabase wiring is Phase 3.

---

## App concept & roles

Kobciye serves six roles, each with a tailored dashboard. Role **values** in
code are fixed and must never be translated:

| Role | Code value | Home route |
|---|---|---|
| Super Admin | `super_admin` | `/super-admin` |
| School Admin | `school_admin` | `/school-admin` |
| Teacher | `teacher` | `/teacher` |
| Accountant | `accountant` | `/accountant` |
| Parent | `parent` | `/parent` |
| Student | `student` | `/student` |

## Color palette

| Role | Hex | Usage |
|---|---|---|
| Primary (Deep Blue) | `#0A2E6B` | Brand, headers, primary actions |
| Primary Light (Blue) | `#1E4F96` | Gradients, secondary accents |
| Success (Growth Green) | `#4E9B51` | Positive trends, growth gradient |
| Accent (Gold) | `#CFAD5E` | Highlights, gold gradient, CTAs |
| Background | `#F7F9FC` | App background |
| Surface | `#FFFFFF` | Cards, sheets |
| Text | `#1A1F2B` | Primary text |
| Border | `#D9E1EC` | Dividers, outlines |

## Languages

Kobciye ships with English (default) and Somali / Af-Soomaali, switchable at
any time via the language pill in the top bar. Translations live in
`lib/l10n/app_strings.dart` behind a tiny `LocalizationService` + `context.t()`
helper, making it easy to add new languages or strings later. **Role values
are intentionally left untranslated.**

---

## Folder structure

```
lib/
├── main.dart
├── app.dart
├── core/
│   ├── constants/        # colors, typography, routes, roles, nav items
│   ├── theme/            # AppTheme (Material 3)
│   ├── responsive/       # breakpoints + ResponsiveLayout helper
│   ├── widgets/          # AppLogo, AppButton, AppCard, AppSidebar,
│   │                     # AppBottomNav, StatCard, DashboardShell, ...
│   └── router/           # buildRouter — go_router + role guards
├── features/
│   ├── splash/
│   ├── onboarding/
│   ├── auth/             # login screen (UI-only, demo accounts)
│   ├── dashboards/
│   │   ├── super_admin/
│   │   ├── school_admin/
│   │   ├── teacher/
│   │   ├── accountant/
│   │   ├── parent/
│   │   ├── student/
│   │   └── widgets/      # OverviewPage, HighlightBanner, SectionPlaceholder
│   └── settings/
├── l10n/
│   └── app_strings.dart
├── services/
│   ├── auth_service.dart        # demo-mode AuthService (ChangeNotifier)
│   ├── localization_service.dart
│   └── supabase_config.dart     # placeholder Supabase credentials
└── models/
    └── app_user.dart
```

## Screens created

- **Splash** — animated brand mark on the deep-blue → blue gradient, fades
  into the onboarding screen.
- **Onboarding / Landing** — hero with logo, headline and CTAs (Get Started,
  Login, Request a school account), a "what Kobciye does" capability grid, and
  a "what's growing next" teaser grid for the 8 future signature features.
- **Login** — mobile-first card with email/password fields, password
  visibility toggle, Sign in / Forgot password / Request a school account, and
  a "Quick demo access" row of chips for all six demo roles. UI-only — backed
  by a placeholder `AuthService.signIn()` that simulates a network call.
- **Six role dashboards** (Super Admin, School Admin, Teacher, Accountant,
  Parent, Student) — each rendered through a shared `DashboardShell` with
  role-specific stat cards, highlight banners and placeholder sections that
  exactly mirror that role's navigation order.
- **Settings** — profile summary, language switcher and sign-out, embedded as
  a tab inside the relevant dashboards.

## Theme system

`AppTheme.light` builds a Material 3 `ThemeData` from `ColorScheme.fromSeed`
seeded with the brand primary, then layers custom styling for cards, inputs,
buttons (elevated/outlined/text), chips, navigation bars and dividers so every
widget in the app looks consistent out of the box. Supporting constants:

- `AppColors` — palette + brand gradients (`brandGradient`, `growthGradient`,
  `goldGradient`, plus risk-level gradients for later phases)
- `AppText` — typography scale (display, h1, h2, body, caption, button, …)
- `AppSpacing` — spacing scale (xs → xxl)
- `AppShadows` — soft elevation presets for cards and floating surfaces

## Responsive design

`AppBreakpoints` defines mobile (<600), tablet (600–1023) and desktop (≥1024)
ranges, and `ResponsiveLayout.value()` lets any widget pick a different value
per breakpoint. The `DashboardShell` uses this to switch between a bottom
navigation bar (mobile/tablet) and a persistent sidebar (desktop) without
duplicating page content — the same pages render in both layouts.

---

## How to run (Flutter Web)

```bash
cd kobciye
flutter pub get
flutter run -d chrome          # local dev with hot reload
# or build a release bundle:
flutter build web --release
```

The build output lands in `build/web/` and can be served with any static file
server, e.g. `python3 -m http.server 8000 -d build/web`.

### Demo sign-in

No backend is connected yet — use any of the seeded demo accounts shown as
chips on the login screen (e.g. `admin@kobciye.com`) with any password to
explore each role's dashboard.

---

## What is completed in Phase 1

- ✅ Flutter Web project scaffold with `go_router`, `provider`, `shared_preferences`
- ✅ Full theme system (colors, typography, spacing, shadows, component themes)
- ✅ Routing with auth + role guards (unauthenticated/public routes, role-home
  redirects, cross-role access prevention)
- ✅ Splash, onboarding/landing and login screens
- ✅ Six role-based dashboard shells with role-correct navigation, stat cards
  and placeholder sections
- ✅ Responsive mobile/tablet/desktop layouts (bottom nav vs. sidebar)
- ✅ English/Somali localization with a live language switcher
- ✅ Placeholder Supabase config (`supabaseUrl` / `supabaseAnonKey`) ready for
  Phase 3
- ✅ Demo-mode authentication (`AuthService`) simulating sign-in without a
  backend

---

## Phase 2 — Supabase database foundation & security

Phase 2 builds the **complete database foundation and security model** for
Kobciye on Supabase/PostgreSQL — no frontend wiring, no real login yet (that's
Phase 3). Everything lives under [`database/`](database/):

```
database/
├── schema.sql                          # 22 tables, constraints, indexes
├── functions.sql                       # helper functions, triggers, handle_new_user()
├── policies.sql                        # Row Level Security policies for every table
├── seed.sql                            # demo school, classes, students, payments, …
└── migrations/
    └── 001_phase2_initial_schema.sql   # single-entry-point migration (schema+functions+policies)
```

### Core principle

> Every school-owned row carries a `school_id`. **One school must never see
> another school's data — and that boundary is enforced by PostgreSQL Row
> Level Security, never by frontend filtering.** The `anon` key is the only
> Supabase key that may ever ship in the app; `service_role` must never be
> exposed to the frontend, because it bypasses RLS entirely.

### 1. SQL run order

For a fresh Supabase project, open the SQL editor and run, **in this exact
order**:

1. `database/schema.sql` — creates all 22 tables, constraints and indexes
2. `database/functions.sql` — creates helper functions and triggers
   (including `handle_new_user()`, attached to `auth.users`)
3. `database/policies.sql` — enables RLS and creates every policy
4. `database/seed.sql` — inserts demo data (safe — no `auth.users` rows)

Alternatively, `database/migrations/001_phase2_initial_schema.sql` is a single
entry point for CLI-based workflows (`supabase db push` / `migration up`) that
runs steps 1–3 via `\i` includes; run `seed.sql` separately afterwards.

All scripts are **idempotent and additive** — they use
`create table if not exists`, `create or replace function`, and
`drop policy if exists` before each `create policy`. They never `DROP TABLE`,
never reset data, and are safe to re-run.

### 2. Tables created (22)

`schools`, `profiles`, `classes`, `students`, `parents`, `parent_students`,
`teachers`, `teacher_assignments`, `attendance`, `payments`,
`mobile_money_transactions`, `fee_promises`, `exams`, `exam_results`,
`quran_progress`, `teacher_notes`, `risk_scores`, `parent_timeline`,
`notifications`, `audit_logs`, `plans`, `subscriptions`.

`profiles.role` is constrained to exactly six values — `super_admin`,
`school_admin`, `teacher`, `accountant`, `parent`, `student` — matching the
Flutter app's role codes one-for-one (never translated).

### 3. Functions created (13)

| Function | Purpose |
|---|---|
| `handle_updated_at()` | Trigger: keeps `updated_at` fresh on every UPDATE |
| `get_my_profile()` | Returns the current user's full profile row |
| `get_my_role()` | Returns `profiles.role` for `auth.uid()` |
| `get_my_school_id()` | Returns `profiles.school_id` for `auth.uid()` |
| `is_super_admin()` | True if the current user's role is `super_admin` |
| `is_school_admin()` | True if the current user's role is `school_admin` |
| `is_active_user()` | True if the current profile is active |
| `same_school(uuid)` | True if a target `school_id` matches the caller's |
| `is_parent_of_student(uuid)` | True if caller is a parent linked via `parent_students` |
| `is_student_owner(uuid)` | True if `students.user_id = auth.uid()` |
| `is_teacher_assigned_to_class(uuid)` | True if caller is assigned to that class via `teacher_assignments` |
| `calculate_student_risk(uuid)` | Explainable risk engine — see below |
| `handle_new_user()` | Trigger on `auth.users` insert — creates a **safe** default profile |

A bonus trigger function, `handle_payment_balance()`, keeps
`payments.balance` and `payments.status` (`paid`/`unpaid`/`partial`/`free`)
consistent automatically whenever `amount_due`/`amount_paid` change.

### 4. Row Level Security summary

RLS is **enabled on all 22 tables**; nothing is readable by default. Policies
follow this model:

| Role | Access |
|---|---|
| `super_admin` | Full visibility & management across all schools (platform admin) |
| `school_admin` | Full read/write — but only inside their own `school_id` |
| `teacher` | Read own school; write attendance / exam results / notes / Qur'an progress **only for classes they are assigned to** (`teacher_assignments`) |
| `accountant` | Manage `payments`, `fee_promises`, `mobile_money_transactions` within own school; no access to student academic records |
| `parent` | Read-only, and only for **linked children** via `parent_students` — can never browse the full student roster or edit anything |
| `student` | Read-only, and only their **own** records, matched via `students.user_id = auth.uid()` |
| anon / public | No access to any private table (`plans` is the only public read, and only active rows) |

Every policy is built from the helper functions above (`is_super_admin()`,
`same_school()`, `is_parent_of_student()`, …), so the security logic lives in
one auditable place rather than being repeated inline per table.

`audit_logs` is **append-only** — only `select`/`insert` policies exist, so
history can never be edited or deleted through the API.

### 5. How `school_id` isolation works

Every school-owned table carries a `school_id` column referencing
`schools(id)`. Policies call `same_school(school_id)`, which compares the
row's `school_id` against `get_my_school_id()` — the caller's own
`profiles.school_id`, looked up server-side. A user from School A can never
construct a query that returns School B's rows: PostgreSQL itself filters
them out before the result ever reaches the client, regardless of what the
frontend asks for.

### 6. How parent → child security works

Parents never query `students` directly by ID or browse a roster. Instead:

1. A `parents` row is linked to the parent's `auth.users` id via `user_id`.
2. `parent_students` links that `parents.id` to one or more `students.id`.
3. `is_parent_of_student(student_id)` checks this chain
   (`parent_students.parent_id -> parents.user_id = auth.uid()`).

Every policy that exposes student-linked data (`students`, `attendance`,
`payments`, `exam_results`, `quran_progress`, `parent_timeline`,
`fee_promises`, `risk_scores`) calls this helper, so a parent automatically
sees **only** their own children's rows — and a parent with two children sees
both, never anyone else's.

### 7. How student self-access works

Students authenticate as themselves — never by typing a `student_code`.
`students.user_id` links the academic record to the Supabase Auth user, and
`is_student_owner(student_id)` checks `students.user_id = auth.uid()`. Every
student-facing policy is keyed off this function, so guessing or typing
another student's code can **never** unlock their data — only the linked
auth identity can.

### 8. How teacher assigned-class access works

`teacher_assignments` links a `teachers` row (itself linked to
`auth.users` via `user_id`) to specific `classes`. The helper
`is_teacher_assigned_to_class(class_id)` walks that chain. Policies on
`attendance`, `exams`, `exam_results`, `students` (read), etc. all gate
teacher writes/reads through this — a teacher can mark attendance or enter
results only for classes they are explicitly assigned to, never for the
whole school.

### 9. How risk score calculation works

`calculate_student_risk(student_id)` is a `SECURITY DEFINER` function that
computes a **simple, explainable** score from real data — no black-box ML in
Phase 2:

- **High risk** if: ≥ 4 absences this month, **or** ≥ 2 unpaid/partial
  payment months, **or** an exam score drop ≥ 20 points, **or** any
  `serious` teacher note on file.
- **Medium risk** if: ≥ 2 absences this month, **or** exactly 1 unpaid month,
  **or** an exam drop between 10–20 points.
- **Low risk**: otherwise.

It writes a snapshot into `risk_scores` with `risk_level`, a numeric
`risk_score`, a `reasons` JSON array (e.g.
`{"reason": "high_absences", "detail": "4 absences this month"}`) so the UI
can explain *why* a student was flagged, and a plain-language
`recommended_action`. Because the function runs as `SECURITY DEFINER`, it can
write `risk_scores` rows safely without granting students/parents direct
write access — they remain strictly read-only for their own/linked children.

### 10. How to test in Supabase

1. Create a fresh Supabase project (or use an empty one).
2. Open **SQL Editor** and run the four files in the order listed above.
3. Open **Table Editor** and confirm all 22 tables exist with RLS badges
   showing "Enabled".
4. Create a few demo **Auth users** (Authentication → Users → Add user) and
   follow the "Demo auth users" instructions at the bottom of `seed.sql` to
   safely link them to seeded `profiles` / `teachers` / `parents` / `students`
   rows (this never stores a password anywhere but Supabase Auth).
5. In the SQL editor, use `select set_config('request.jwt.claims', json_build_object('sub', '<user-uuid>')::text, true);`
   together with `set local role authenticated;` (or the Supabase
   "Impersonate user" feature in newer Studio versions) to run queries *as*
   a specific user, and confirm:
   - A `parent` only ever sees their linked child's rows in `students`,
     `attendance`, `payments`, `exam_results`, etc.
   - A `student` only ever sees their own rows.
   - A `teacher` only sees/writes data for their assigned class(es).
   - A `school_admin` sees only their own school; never another school's.
   - `select public.calculate_student_risk('<student-uuid>')` inserts an
     explainable row into `risk_scores`.

### 11. What remains for Phase 3

- 🔜 Wire up real Supabase Auth (replacing the demo `AuthService`) using the
  `supabaseUrl` / `supabaseAnonKey` placeholders in `supabase_config.dart`
- 🔜 Real sign-in/sign-up flows backed by `auth.signInWithPassword` etc.
- 🔜 Frontend Supabase queries for profile, school and role-aware routing
- 🔜 Replace placeholder dashboard data with live RLS-protected queries
- 🔜 Session persistence, password reset and account-activation flows
- 🔜 Admin tooling to activate new sign-ups and assign roles/school_id safely

> **Future roadmap:** Phase 1 (Flutter foundation) → **Phase 2 (Supabase
> database & RLS — this phase)** → Phase 3 (real auth & live queries) →
> Phase 4 (students/attendance/payments core UI) → Phase 5 (exams & results)
> → Phase 6 (Risk Score UI) → Phase 7 (Parent Somali Report) → Phase 8
> (Mobile Money matching) → Phase 9 (Fee Promises) → Phase 10 (Offline
> attendance) → Phase 11 (Qur'an/Madrasa progress & Trust Timeline) →
> Phase 12 (PWA / mobile deployment polish).
