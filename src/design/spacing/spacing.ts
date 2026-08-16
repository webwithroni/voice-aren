/**
 * 8pt spacing system. Use these tokens instead of hardcoded pixel values.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
  '5xl': 80,
  '6xl': 96,
  '7xl': 128,
} as const;

export type Spacing = typeof spacing;
export type SpacingToken = keyof Spacing;

/** Minimum accessible touch target (Android dp / iOS pt). */
export const TOUCH_TARGET_MIN = 48;
