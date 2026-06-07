# School Pulse AI — Phase 1

A mobile-first **School Intelligence App** built with Flutter Web, Dart and
Supabase. Phase 1 delivers the project skeleton, design system, navigation,
authentication shell and role-based dashboard shells for all six platform
roles — ready to be wired up to a real Supabase backend in later phases.

> School Pulse AI is **not** a normal school management website. It focuses on
> Student Risk Scoring, parent communication in Somali/English, mobile money
> payment matching, offline attendance, Qur'an/Madrasa progress tracking,
> parent trust timelines and school intelligence dashboards.

---

## 1. Folder structure

```
lib/
├── main.dart                     # Entry point — boots Supabase + runs the app
├── app.dart                      # Root widget: Provider setup, theme, router
├── core/
│   ├── constants/
│   │   ├── app_roles.dart        # Raw DB role values (never translated)
│   │   ├── app_breakpoints.dart  # Responsive layout breakpoints
│   │   ├── nav_items.dart        # Per-role navigation destinations
│   │   └── supabase_config.dart  # Supabase URL / anon key placeholders
│   ├── theme/
│   │   ├── app_colors.dart       # Brand palette + gradients
│   │   ├── app_text_styles.dart  # Typography scale
│   │   └── app_theme.dart        # Material 3 ThemeData
│   ├── router/
│   │   ├── app_router.dart       # go_router config + auth/role guards
│   │   └── role_redirect.dart    # role -> dashboard route mapping
│   ├── utils/                    # (reserved for Phase 2+)
│   └── widgets/
│       ├── glass_card.dart           # Glassmorphism surface
│       ├── gradient_button.dart      # Premium CTA button
│       ├── stat_card.dart            # Dashboard metric card
│       ├── language_switcher.dart    # EN / SO pill toggle
│       ├── section_placeholder.dart  # "Coming in next phase" panel
│       └── dashboard_shell.dart      # Responsive sidebar / bottom-nav shell
├── features/
│   ├── splash/splash_screen.dart
│   ├── auth/login_screen.dart
│   ├── dashboards/
│   │   ├── super_admin_dashboard.dart
│   │   ├── school_admin_dashboard.dart
│   │   ├── teacher_dashboard.dart
│   │   ├── accountant_dashboard.dart
│   │   ├── parent_dashboard.dart
│   │   ├── student_dashboard.dart
│   │   └── widgets/
│   │       ├── overview_page.dart
│   │       └── highlight_banner.dart
│   ├── settings/settings_page.dart
│   ├── risk_score/            # (Phase 2+)
│   ├── attendance/            # (Phase 2+)
│   ├── payments/              # (Phase 2+)
│   ├── mobile_money/          # (Phase 2+)
│   ├── fee_promises/          # (Phase 2+)
│   ├── quran_progress/        # (Phase 2+)
│   ├── parent_timeline/       # (Phase 2+)
│   ├── students/              # (Phase 2+)
│   ├── parents/               # (Phase 2+)
│   └── teachers/              # (Phase 2+)
├── services/
│   ├── supabase_service.dart       # Supabase client lifecycle (anon key only)
│   ├── auth_service.dart           # Auth + session state (with demo mode)
│   └── localization_service.dart   # EN / SO translation + persistence
├── models/
│   └── app_user.dart               # Mirrors `profiles` table
└── l10n/
    └── app_strings.dart            # English / Somali UI string table
```

---

## 2. Files created in Phase 1

All files listed in the folder structure above are new. Notable ones:

- **Theme system** — `core/theme/*` implements the full brand palette
  (`#021454`, `#175DED`, `#6B28CB`, `#C80D97`, `#F3851C`, `#F7B500`, etc.),
  glassmorphism cards, gradients, soft shadows and rounded surfaces.
- **Responsive shell** — `core/widgets/dashboard_shell.dart` automatically
  switches between a desktop **sidebar** and a mobile **bottom navigation
  bar** based on `core/constants/app_breakpoints.dart`.
- **Localization** — `l10n/app_strings.dart` + `services/localization_service.dart`
  provide a lightweight `context.t('key')` translation API for English and
  Somali. **Database role values are never translated** — only their display
  labels (`role_teacher`, `role_parent`, …) are.
- **Auth shell** — `features/auth/login_screen.dart` is a beautiful
  glassmorphism login screen with an email/password form, a language
  switcher and **demo quick-access chips** (since no live Supabase project is
  connected yet). The role is *never* chosen by the user — it is resolved
  from the `profiles` table (or the demo account map) after sign-in, and
  `core/router/role_redirect.dart` sends each role to its own dashboard.
- **Six dashboard shells** — Super Admin, School Admin, Teacher, Accountant,
  Parent and Student each get a tailored navigation menu
  (`core/constants/nav_items.dart`), an overview page with stat cards and a
  highlight banner, and placeholder panels for modules arriving in Phase 2+.
- **Supabase placeholder** — `core/constants/supabase_config.dart` and
  `services/supabase_service.dart` wire up the client *only* when real
  credentials are supplied via `--dart-define`, and only ever use the public
  anon key (the `service_role` key must never reach the frontend).

---

## 3. How to run Flutter Web

Flutter SDK (stable channel, web support enabled) is required.

```bash
cd school_pulse_ai
flutter pub get

# Demo mode (no backend yet) — just run:
flutter run -d chrome

# With a real Supabase project (Phase 2+):
flutter run -d chrome \
  --dart-define=SUPABASE_URL=https://YOUR-PROJECT.supabase.co \
  --dart-define=SUPABASE_ANON_KEY=YOUR-PUBLIC-ANON-KEY
```

To produce an optimized production build (also generates the PWA service
worker / manifest):

```bash
flutter build web --release
# Output: build/web — serve it with any static file host
```

### Demo accounts (no backend required)

The login screen's **DEMO QUICK ACCESS** chips sign you straight into any
role's dashboard. You can also type the email manually with any password:

| Role          | Email                          |
|---------------|--------------------------------|
| Super Admin   | super@schoolpulse.ai           |
| School Admin  | admin@schoolpulse.ai           |
| Teacher       | teacher@schoolpulse.ai         |
| Accountant    | accountant@schoolpulse.ai      |
| Parent        | parent@schoolpulse.ai          |
| Student       | student@schoolpulse.ai         |

---

## 4. How to test the responsive layout

1. Run `flutter run -d chrome`.
2. Open Chrome DevTools (F12) → toggle device toolbar (Ctrl/Cmd+Shift+M).
3. Try these widths:
   - **< 600px** (e.g. iPhone SE) — top app bar + **bottom navigation bar**.
   - **600–1024px** (tablet) — same mobile-style layout, wider stat grid.
   - **≥ 1024px** (desktop) — fixed **sidebar** with brand header, nav items
     and user footer, plus a top bar with greeting and language switcher.
4. Resize the browser window directly — the shell switches layouts live via
   `LayoutBuilder` / `MediaQuery` breakpoints (`core/constants/app_breakpoints.dart`).
5. Toggle the **EN / SO** pill in the top bar or login screen to confirm all
   visible UI strings switch language instantly (role values stay in English
   in the database, only their on-screen labels change).

---

## 5. What is completed (Phase 1)

- ✅ Flutter Web project structure (`lib/core`, `lib/features`, `lib/services`, `lib/models`, `lib/l10n`)
- ✅ Brand theme system (colors, gradients, typography, Material 3 theme)
- ✅ Responsive layout primitives (breakpoints, sidebar, bottom navigation)
- ✅ Splash screen with branded gradient + animation
- ✅ Login screen (glassmorphism, EN/SO switcher, demo quick access, role-based redirect)
- ✅ Role-based dashboard shells for all 6 roles (Super Admin, School Admin,
  Teacher, Accountant, Parent, Student) with overview pages, stat cards and
  highlight banners
- ✅ Bottom navigation (mobile) and sidebar (desktop) navigation per role
- ✅ Somali / English localization setup with persisted language preference
  (default: English)
- ✅ Supabase configuration placeholder + client lifecycle service (anon-key only)
- ✅ go_router with authentication + role-based route guards
- ✅ PWA manifest & metadata configured for "School Pulse AI"

## 6. What remains for Phase 2

- 🔲 Full Supabase schema (`schools`, `profiles`, `students`, `parents`,
  `parent_students`, `teachers`, `classes`, `attendance`, `payments`,
  `mobile_money_transactions`, `fee_promises`, `exams`, `exam_results`,
  `quran_progress`, `teacher_notes`, `risk_scores`, `parent_timeline`,
  `notifications`, `audit_logs`) + Row Level Security policies
- 🔲 Real Supabase Auth wiring (replace demo accounts)
- 🔲 Student Risk Score engine (explainable scoring + reasons + recommended actions)
- 🔲 Somali parent report generator (text-based, then WhatsApp/SMS/voice/push)
- 🔲 Mobile Money Payment Matching module (matching engine + review queue)
- 🔲 Fee Promise tracking (promised / reminded / paid / broken_promise)
- 🔲 Offline attendance mode (local cache, pending-sync indicator, dedupe)
- 🔲 Qur'an / Madrasa progress tracking module
- 🔲 Parent Trust Timeline
- 🔲 Teacher workload dashboard data wiring
- 🔲 School Intelligence dashboard data wiring
- 🔲 Full Parent App and Student App data wiring

---

## 7. Tech stack

- Flutter Web (Material 3) + Dart
- `supabase_flutter` (Supabase Auth, PostgreSQL, Row Level Security — Phase 2+)
- `go_router` for declarative, guarded routing
- `provider` for state management
- `shared_preferences` for persisted language preference / future offline sync
- PWA-ready (manifest + service worker via `flutter build web`)

**Security note:** the frontend only ever uses the Supabase **anon key**.
The `service_role` key must stay server-side (e.g. Supabase Edge Functions)
and is never referenced anywhere in this Flutter project.
