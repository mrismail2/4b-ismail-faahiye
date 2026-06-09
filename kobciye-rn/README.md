# Kobciye School Management SaaS

**Kobciye** (meaning "to grow and develop" in Somali) is a professional school management SaaS built with React Native / Expo (SDK 51). It gives schools, teachers, parents and students one trusted platform for day-to-day school management — localized in Somali and English.

---

## Phase 1 Status: UI Foundation Complete

All screens, dashboards, widgets and navigation are complete as a fully interactive UI prototype. Demo accounts let anyone explore every role without a backend.

---

## Installation

```bash
cd kobciye-rn
npm install --legacy-peer-deps
```

## Run on Web

```bash
npx expo start -c
# then press w to open in browser
```

Or export a static web build:

```bash
npx expo export --platform web --output-dir dist
```

---

## Demo Login Accounts

All accounts use the password: **preview** (any text works in demo mode)

| Role | Email |
|---|---|
| Super Admin | super@kobciye.com |
| School Admin | admin@school.com |
| Teacher | teacher@school.com |
| Accountant | accountant@school.com |
| Parent | parent@school.com |
| Student | student@school.com |

On the Login screen, tap any portal chip under "Explore Demo Portals" to jump straight into that role's dashboard. Student and Parent portals are publicly accessible; Admin, Teacher, Accountant and Super Admin show a prompt to register a school.

---

## Phase 1 Modules

### What's fully working (interactive UI)
- **Onboarding** — hero, feature cards, roadmap, pricing tiers, language switcher
- **Pricing Screen** — 3 detailed plan cards (Basic/Standard/Premium) with feature lists and CTA
- **Login** — email/password form, forgot password modal, 6-role demo portal chips
- **Register School Sheet** — 3-step modal: school info (name, city, type, student count, country, logo), admin account, plan selection
- **All 6 role dashboards** — each with bottom navigation, sidebar, notification bell, FAB
- **Student Dashboard** — attendance, exams, results, my teacher, messaging, notices sections; quick actions
- **Parent Dashboard** — child switcher, attendance, exams, payments, teacher, messaging, timeline, notices; quick actions
- **Accountant Dashboard** — payment management, student list; quick actions (collect payment, unpaid students, generate receipt, send reminder)
- **Teacher Dashboard** — lesson prep, attendance marking, exams
- **School Admin Dashboard** — student/staff management, reports, permissions
- **Super Admin Dashboard** — platform-wide management

### Placeholder sections (built but data-free)
- Attendance calendar details (data will come from Supabase in Phase 2)
- Exam result submission and grading workflow
- Payment collection and receipt generation
- Parent report generation (SMS/WhatsApp)
- Permission management granular controls
- Real-time messaging (shell present, no websocket yet)
- Student timeline

---

## Phase 2 Plan — Supabase Database

The database schema is already written in `database/`. Run these files in the Supabase SQL Editor in order:

```
1. database/schema.sql      — 22 tables
2. database/functions.sql   — 12 helper functions + triggers
3. database/policies.sql    — Row-level security for all tables
4. database/seed.sql        — Sample data matching demo accounts
```

Or use the combined migration file:

```
database/migrations/001_phase2_initial_schema_combined.sql
```

Phase 2 wires the UI to live Supabase data using real queries.

---

## Phase 3 Plan — Real Authentication

Phase 3 replaces the demo sign-in with Supabase Auth:

- Real email/password login per role
- School onboarding flow (admin creates school, invites staff)
- Avatar and document storage via Supabase Storage
- Edge Functions for automatic parent report generation (Somali + English)
- Real-time attendance and messaging via Supabase Realtime

---

## Tech Stack

- **React Native / Expo SDK 51** — cross-platform (iOS, Android, Web)
- **React Navigation** — native stack + bottom tabs
- **expo-linear-gradient** — all gradients
- **@expo/vector-icons (Ionicons)** — all icons
- **Supabase** (Phase 2+) — Postgres database, Auth, Storage, Realtime

---

## Project Structure

```
src/
  constants/       — colors, gradients, typography, roles
  context/         — AuthContext, LocalizationContext
  navigation/      — RootNavigator, roleRedirect
  screens/         — Onboarding, Login, Pricing, all 6 dashboards
  widgets/         — Reusable components (StatCard, AppButton, QuickActions, etc.)
database/          — Supabase SQL files (Phase 2)
```
