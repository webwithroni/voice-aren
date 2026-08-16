import React from 'react';
import { Text as RNText, type TextProps } from 'react-native';

import { colors, typography, type TypographyVariant } from '@/design';

interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
}

/**
 * Typography primitive. Applies a semantic typography token + color.
 * Text remains scalable for accessibility, capped to protect layout.
 */
export function AppText({
  variant = 'body',
  color = colors.text.primary,
  style,
  maxFontSizeMultiplier = 1.6,
  ...rest
}: AppTextProps) {
  return (
    <RNText
      allowFontScaling
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={[typography[variant], { color }, style]}
      {...rest}
    />
  );
}
