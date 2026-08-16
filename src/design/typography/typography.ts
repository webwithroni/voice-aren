import type { TextStyle } from 'react-native';

/**
 * Inter font families (loaded via @expo-google-fonts/inter in the root layout).
 */
export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
} as const;

export type TypographyVariant =
  | 'displayXl'
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bodyLarge'
  | 'body'
  | 'bodyMedium'
  | 'caption'
  | 'status'
  | 'button';

/**
 * Semantic typography tokens. Font weight is retained for platforms that
 * synthesize weight; on Android the family file carries the weight.
 */
export const typography: Record<TypographyVariant, TextStyle> = {
  displayXl: { fontFamily: fontFamily.semibold, fontSize: 40, lineHeight: 48, fontWeight: '600' },
  display: { fontFamily: fontFamily.semibold, fontSize: 32, lineHeight: 40, fontWeight: '600' },
  h1: { fontFamily: fontFamily.semibold, fontSize: 28, lineHeight: 36, fontWeight: '600' },
  h2: { fontFamily: fontFamily.semibold, fontSize: 24, lineHeight: 32, fontWeight: '600' },
  h3: { fontFamily: fontFamily.semibold, fontSize: 20, lineHeight: 28, fontWeight: '600' },
  bodyLarge: { fontFamily: fontFamily.regular, fontSize: 17, lineHeight: 26, fontWeight: '400' },
  body: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 22, fontWeight: '400' },
  bodyMedium: { fontFamily: fontFamily.medium, fontSize: 15, lineHeight: 22, fontWeight: '500' },
  caption: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 18, fontWeight: '400' },
  status: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18, fontWeight: '500' },
  button: { fontFamily: fontFamily.semibold, fontSize: 15, lineHeight: 20, fontWeight: '600' },
};

/** Fonts to load at startup. Keys must match the family names above. */
export const interFontMap = {
  Inter_400Regular: fontFamily.regular,
  Inter_500Medium: fontFamily.medium,
  Inter_600SemiBold: fontFamily.semibold,
} as const;
