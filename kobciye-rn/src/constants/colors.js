// Kobciye brand palette — derived directly from the logo color system.
// "Kobciye" means something that grows, develops and improves — the
// gradients lean on deep blue (trust) moving toward growth green and a
// gold accent (achievement / "succeed").

export const Colors = {
  primary: '#0A2E6B',
  primaryLight: '#1E4F96',
  primary50: '#EEF2FF',
  success: '#16a34a',
  successLight: '#dcfce7',
  accent: '#CFAD5E',
  accentLight: '#fef3c7',
  purple: '#7c3aed',
  purpleLight: '#ede9fe',
  teal: '#0891b2',
  tealLight: '#e0f2fe',
  rose: '#e11d48',
  roseLight: '#ffe4e6',
  background: '#F7F9FC',
  surface: '#FFFFFF',
  surfaceHover: '#F0F4FF',
  text: '#0F172A',
  textSecondary: '#334155',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  muted: '#64748B',
  mutedLight: '#94A3B8',
  danger: '#DC2626',
  warning: '#CFAD5E',
  white: '#FFFFFF',
};

export const glass = (opacity) => `rgba(255,255,255,${opacity})`;

// Gradient color pairs — used with expo-linear-gradient.
export const Gradients = {
  brand: ['#0A2E6B', '#1E4F96'],
  brandVibrant: ['#0A2E6B', '#2563EB'],
  growth: ['#1E4F96', '#16a34a'],
  gold: ['#0A2E6B', '#CFAD5E'],
  purple: ['#7c3aed', '#6d28d9'],
  teal: ['#0891b2', '#0e7490'],
  rose: ['#e11d48', '#be123c'],
  riskHigh: ['#DC2626', '#F3851C'],
  riskMedium: ['#CFAD5E', '#F3851C'],
  riskLow: ['#16a34a', '#1E4F96'],
  dark: ['#0F172A', '#1E293B'],
  glass: ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)'],
};
