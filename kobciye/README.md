# Kobciye 🌱

**Kobciye** — Somali for *"something that grows, develops, improves"* — is a
mobile-first **School Intelligence Platform** built with Flutter Web. It gives
schools, teachers, parents and students one trusted, beautiful place to manage
students, attendance, payments, exams and Qur'an/Madrasa progress — and to
spot students who need support, early.

> **Tagline:** Learn • Grow • Succeed  /  Baro • Koboc • Guulayso

This repository currently contains **Phase 1**: the complete app foundation —
theme system, routing, responsive shells, screens and demo authentication —
with no real backend wired up yet (see [What remains](#what-remains-for-phase-2)).

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

## What remains for Phase 2

- 🔜 Real Supabase project, database schema and Row Level Security policies
- 🔜 Real Supabase Auth (replacing the demo `AuthService`)
- 🔜 Student, parent, teacher, attendance, payments and exams data models + CRUD
- 🔜 Student Risk Score engine
- 🔜 Parent Somali Report generation
- 🔜 Mobile Money payment matching
- 🔜 Fee Promise tracking system
- 🔜 Offline attendance capture and sync
- 🔜 Qur'an / Madrasa progress tracking
- 🔜 Parent Trust Timeline
- 🔜 Teacher Workload Dashboard
- 🔜 Reports, notifications and PWA/mobile deployment polish

> **Future roadmap:** Phase 2 (Supabase backend) → Phase 3 (real auth & RLS) →
> Phase 4 (students/attendance/payments core) → Phase 5 (exams & results) →
> Phase 6 (Risk Score) → Phase 7 (Parent Somali Report) → Phase 8 (Mobile
> Money matching) → Phase 9 (Fee Promises) → Phase 10 (Offline attendance) →
> Phase 11 (Qur'an/Madrasa progress & Trust Timeline) → Phase 12 (PWA / mobile
> deployment polish).
