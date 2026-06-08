import { Colors } from './colors';

// Centralized typography scale for Kobciye — clean, confident, readable
// at small sizes for parents/students on phones and spacious on desktop.

export const Text = {
  display: { fontSize: 30, fontWeight: '800', letterSpacing: -0.5, color: Colors.text, lineHeight: 36 },
  h1: { fontSize: 21, fontWeight: '800', letterSpacing: -0.3, color: Colors.text },
  h2: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2, color: Colors.text },
  body: { fontSize: 14, fontWeight: '500', color: Colors.text, lineHeight: 21 },
  bodyMuted: { fontSize: 13, fontWeight: '500', color: Colors.muted, lineHeight: 19 },
  caption: { fontSize: 11, fontWeight: '600', letterSpacing: 0.4, color: Colors.muted },
  button: { fontSize: 15, fontWeight: '700', letterSpacing: 0.1, color: Colors.white },
  statValue: { fontSize: 23, fontWeight: '800', letterSpacing: -0.5, color: Colors.text },
};

export const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

export const Shadows = {
  card: {
    shadowColor: Colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  floating: {
    shadowColor: Colors.primary,
    shadowOpacity: 0.16,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 },
    elevation: 6,
  },
};
