# Kobciye School Management SaaS

**Kobciye** (Af-Soomaali: "in la kobciyo") — Premium school management SaaS built with React Native / Expo SDK 51. Localized in Somali and English.

---

## Phase 1 Status: Public Demo — Parent & Student Portals

Phase 1 is **frontend UI only**. No backend, no database, no real authentication.

Public demo exposes **Parent Portal** and **Student Portal** only.  
Admin, Teacher, Accountant, and Super Admin dashboards are built in the codebase but are not accessible from the public demo login. They will be enabled in internal/staging phases.

---

## How to Run

```bash
npm install --legacy-peer-deps
npx expo start -c
```

Then press **`w`** to open in browser, or scan QR code in Expo Go.

---

## Demo Accounts (Public Phase 1)

| Role    | Email                   | Password     |
|---------|-------------------------|--------------|
| Parent  | parent@kobciye.com      | any password |
| Student | student@kobciye.com     | any password |

> Admin, teacher, accountant, and super admin accounts exist in the codebase (commented out in `AuthContext.js`) for internal use only.

---

## Public Demo Flow

```
Landing Page → Get Started → Pricing → Register Your School
Landing Page → Login → Parent Portal  or  Student Portal
```

---

## Screens & Features

### Public Landing Page
- Hero section with app mockup
- Comparison: Nidaamyada Kale vs Kobciye
- Feature cards (Attendance, Payments, Exams)
- App showcase section with floating stats
- Pricing section (per-student pricing)
- Footer

### Login Screen
- Email + password sign in
- Forgot Password (mock success only — no real email)
- Register Your School (mock form — no real backend)
- Explore Demo Portals: Parent + Student only

### Parent Dashboard
- Multi-student switcher (Yusuf, Hibo, Axmed — mock data)
- Child profile card with attendance %
- Exam results with progress bars
- Fees status card
- Teacher note
- Navigation: Attendance, Exams, Payments, Teacher, Messaging, Timeline, Notices

### Student Dashboard
- Student profile
- Attendance summary
- Exam grades
- Payment status
- Messages, Notices

---

## Phase 1 — What is Mock Only

| Feature                        | Status         |
|-------------------------------|----------------|
| Register Your School           | Mock UI only   |
| Forgot Password                | Mock UI only   |
| Pricing / Plan selection       | Mock UI only   |
| Parent multi-student switcher  | Mock data only |
| Notifications                  | Mock data only |
| Attendance marking             | Mock data only |
| Exam results                   | Mock data only |
| Payments                       | Mock data only |
| Messaging                      | Mock UI only   |
| Profile photo upload           | Not included — will be added in a future phase using Expo-compatible packages |

---

## Roadmap

| Phase   | Description                                   |
|---------|-----------------------------------------------|
| Phase 1 | Frontend UI — Parent & Student portals (done) |
| Phase 2 | Supabase database integration                 |
| Phase 3 | Real authentication (Supabase Auth)           |
| Phase 4 | Admin, Teacher, Accountant portals go live    |
| Phase 5 | Mobile money payments, SMS, offline mode      |

---

## Tech Stack

- React Native / Expo SDK 51
- Expo Web (static export)
- React Navigation v6
- expo-linear-gradient
- @expo/vector-icons (Ionicons)
- Context API (AuthContext, LocalizationContext)

---

## Folder Structure

```
kobciye-rn/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── OnboardingScreen.js
│   │   ├── PricingScreen.js
│   │   └── dashboards/
│   │       ├── ParentDashboard.js
│   │       ├── StudentDashboard.js
│   │       ├── SchoolAdminDashboard.js   (not in public demo)
│   │       ├── TeacherDashboard.js       (not in public demo)
│   │       ├── AccountantDashboard.js    (not in public demo)
│   │       └── SuperAdminDashboard.js    (not in public demo)
│   ├── widgets/
│   ├── constants/
│   ├── context/
│   └── navigation/
├── assets/
├── App.js
└── package.json
```

---

Built by **Ismail Abdirahman Ahmed (Ismail Fahie)** · Kobciye, Gabiley, Somaliland  
© 2025 Kobciye. All rights reserved.
