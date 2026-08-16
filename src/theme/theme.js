/* ============================================================
   KAABE — Design tokens

   Midabada iyo qoraalku waxay ka yimaadaan design system-ka:
     Buluug  #0045AD · #005CE6 · #B0CCF7 · #D9E7FB
     Casaan  #B43333 · #F04444 · #FAC5C5 · #FDE3E3
     Cagaar  #0F8A63 · #14B888 · #B7E9D8 · #E3F7F0
     Madow   #171717 · #313131 · #FBFBFB · #FFFFFF
   Farta: Inter (H1 40 → Tag 12)
   ============================================================ */

export const palette = {
  blue900: '#0045AD',
  blue: '#005CE6',
  blue200: '#B0CCF7',
  blue50: '#D9E7FB',

  red900: '#B43333',
  red: '#F04444',
  red200: '#FAC5C5',
  red50: '#FDE3E3',

  green900: '#0F8A63',
  green: '#14B888',
  green200: '#B7E9D8',
  green50: '#E3F7F0',

  amber900: '#8A5A00',
  amber: '#E08A00',
  amber200: '#FBDFAE',
  amber50: '#FDF3E0',

  black: '#171717',
  black700: '#313131',
  grey50: '#FBFBFB',
  white: '#FFFFFF',
};

export const colors = {
  primary: palette.blue,
  primaryDark: palette.blue900,
  primarySoft: palette.blue50,
  primaryBorder: palette.blue200,

  accent: palette.amber,
  accentSoft: palette.amber50,

  green: palette.green900,
  greenSoft: palette.green50,
  greenBorder: palette.green200,

  red: palette.red900,
  redSoft: palette.red50,
  redBorder: palette.red200,

  amber: palette.amber900,
  amberSoft: palette.amber50,

  bg: palette.grey50,
  surface: palette.white,
  ink: palette.black,
  ink2: palette.black700,
  muted: '#6B7280',
  line: '#E8EBF0',
};

/* Farta — Inter ayaa la doorbidayaa, haddii kale nidaamka tiisa */
export const fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

export const type = {
  h1: { fontSize: 34, fontWeight: '800', letterSpacing: -0.5 },
  h2: { fontSize: 28, fontWeight: '800', letterSpacing: -0.4 },
  h3: { fontSize: 24, fontWeight: '800', letterSpacing: -0.3 },
  h5: { fontSize: 20, fontWeight: '700' },
  h6: { fontSize: 17, fontWeight: '700' },
  b1: { fontSize: 15, fontWeight: '500' },
  b1Bold: { fontSize: 15, fontWeight: '700' },
  b2: { fontSize: 13.5, fontWeight: '500' },
  b2Bold: { fontSize: 13.5, fontWeight: '700' },
  tag: { fontSize: 11.5, fontWeight: '700' },
};

export const radius = { sm: 10, md: 14, lg: 20, pill: 999 };

export const spacing = { xs: 6, sm: 10, md: 14, lg: 18, xl: 24 };

export const shadow = {
  card: {
    shadowColor: '#0B1C33',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  lifted: {
    shadowColor: '#0B1C33',
    shadowOpacity: 0.13,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
};

/* Midabada calaamadaha xaadiriska */
export const attendanceColors = {
  present: { bg: palette.green50, fg: palette.green900, border: palette.green200 },
  absent: { bg: palette.red50, fg: palette.red900, border: palette.red200 },
  late: { bg: palette.amber50, fg: palette.amber900, border: palette.amber200 },
  excused: { bg: palette.blue50, fg: palette.blue900, border: palette.blue200 },
};

/* Midabo loo qoondeeyo sawirka magaca (avatar) */
export const avatarColors = [
  palette.blue, palette.green900, palette.amber, '#7C3AED',
  '#0891B2', palette.red900, '#B45309', palette.blue900,
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
