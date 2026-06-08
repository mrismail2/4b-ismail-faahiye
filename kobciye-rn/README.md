# Kobciye RN (Expo / React Native — Phase 1)

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

This phase ships these as polished UI/product placeholders — see the
"placeholder note" card at the bottom of each section for what's mock data
today versus what arrives once the Supabase backend modules are connected.

## Run on web

```bash
npm install --legacy-peer-deps
npx expo start -c
```

Then press `w` (or open the printed `http://localhost:8081`) to view it
in the browser.

## Troubleshooting: blank white screen on web

If the web build shows a blank white page and the Chrome console reports
an error like `_expoModulesCore.registerWebModule is not a function`, it
means an Expo-managed dependency (commonly `@expo/vector-icons`) drifted
to a version newer than this project's Expo SDK (51) supports. Fix it by
realigning all Expo-managed dependencies, then restart with a clean cache:

```bash
npx expo install --fix
npm install
npx expo start -c
```
