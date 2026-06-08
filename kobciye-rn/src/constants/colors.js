// Kobciye brand palette — derived directly from the logo color system.
// "Kobciye" means something that grows, develops and improves — the
// gradients lean on deep blue (trust) moving toward growth green and a
// gold accent (achievement / "succeed").

export const Colors = {
  primary: '#0A2E6B',
  primaryLight: '#1E4F96',
  success: '#4E9B51',
  accent: '#CFAD5E',

  background: '#F7F9FC',
  surface: '#FFFFFF',
  text: '#1A1F2B',
  border: '#D9E1EC',

  muted: '#64748B',
  danger: '#DC2626',
  warning: '#CFAD5E',
  info: '#1E4F96',

  white: '#FFFFFF',
};

export const glass = (opacity) => `rgba(255,255,255,${opacity})`;

// Gradient color pairs — used with expo-linear-gradient.
export const Gradients = {
  brand: [Colors.primary, Colors.primaryLight],
  growth: [Colors.primaryLight, Colors.success],
  gold: [Colors.primary, Colors.accent],
  riskHigh: ['#DC2626', '#F3851C'],
  riskMedium: [Colors.accent, '#F3851C'],
  riskLow: [Colors.success, Colors.primaryLight],
};
