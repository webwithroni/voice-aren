import React from 'react';
import { View, type ViewProps } from 'react-native';

import { colors, radius } from '@/design';

type SurfaceLevel = 'primary' | 'elevated' | 'interactive';

interface SurfaceProps extends ViewProps {
  level?: SurfaceLevel;
  bordered?: boolean;
}

/**
 * Elevation-aware container. Uses the surface + border tokens so we never
 * duplicate raw background/border values across screens.
 */
export function Surface({
  level = 'primary',
  bordered = true,
  style,
  children,
  ...rest
}: SurfaceProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface[level],
          borderRadius: radius.xl,
          borderWidth: bordered ? 1 : 0,
          borderColor: colors.border.subtle,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
