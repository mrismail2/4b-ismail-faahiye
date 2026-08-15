/* ============================================================
   KAABE — Design tokens
   Hal meel oo midabada, meelaha banaan iyo hooska laga hagaajiyo.
   ============================================================ */

export const colors = {
  primary: '#1D4E89',
  primaryDark: '#153A66',
  primarySoft: '#E8F0FA',

  accent: '#E0A458',
  accentSoft: '#FBF0DF',

  green: '#0E9F6E',
  greenSoft: '#E3F6EF',
  red: '#D64545',
  redSoft: '#FBEAEA',
  amber: '#C77700',
  amberSoft: '#FDF1DC',

  bg: '#F5F7FA',
  surface: '#FFFFFF',
  ink: '#101A28',
  ink2: '#3C4A5C',
  muted: '#7A8798',
  line: '#E6EBF2',
};

export const radius = { sm: 10, md: 14, lg: 20 };

export const spacing = { xs: 6, sm: 10, md: 14, lg: 18, xl: 24 };

export const shadow = {
  card: {
    shadowColor: '#12233D',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
};

/* Midabada calaamadaha xaadiriska */
export const attendanceColors = {
  present: { bg: colors.greenSoft, fg: colors.green },
  absent: { bg: colors.redSoft, fg: colors.red },
  late: { bg: colors.amberSoft, fg: colors.amber },
  excused: { bg: colors.primarySoft, fg: colors.primary },
};

/* Midabo loo qoondeeyo sawirka magaca (avatar) */
export const avatarColors = [
  '#1D4E89', '#0E9F6E', '#C77700', '#7C3AED',
  '#0891B2', '#D64545', '#B45309', '#4F46E5',
];

export function avatarColor(seed = '') {
  let sum = 0;
  for (let i = 0; i < seed.length; i += 1) sum += seed.charCodeAt(i);
  return avatarColors[sum % avatarColors.length];
}

export function initials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
