/**
 * Corner radius tokens.
 */
export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  '2xl': 28,
  full: 999,
} as const;

export type Radius = typeof radius;
export type RadiusToken = keyof Radius;
