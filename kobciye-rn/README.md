# Kobciye RN (Expo / React Native — Phase 1)

React Native / Expo port of the Kobciye school platform (Phase 1 UI:
splash, onboarding, login, role dashboards, theming and EN/SO localization).

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
