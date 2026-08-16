import React, { useId } from 'react';
import Animated from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { colors } from '@/design';
import { withOpacity } from '@/utils/color';
import type { OrbLayerStyle } from '../orbTypes';

interface LayerProps {
  size: number;
  style?: OrbLayerStyle;
}

/**
 * Primary field — the main Orb sphere. A controlled-opacity
 * cyan → blue → violet radial, lit from the upper-left to read as a sphere.
 * A faint rim adds depth. This is the constant AREN identity.
 */
export function PrimaryField({ size, style }: LayerProps) {
  const uid = useId().replace(/:/g, '');
  const fillId = `primary-${uid}`;
  const r = size / 2;
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={fillId} cx="38%" cy="34%" r="72%">
            <Stop offset="0%" stopColor={colors.orb.cyan} stopOpacity={0.92} />
            <Stop offset="46%" stopColor={colors.orb.blue} stopOpacity={0.8} />
            <Stop offset="100%" stopColor={colors.orb.violet} stopOpacity={0.55} />
          </RadialGradient>
        </Defs>
        <Circle cx={r} cy={r} r={r} fill={`url(#${fillId})`} />
        <Circle
          cx={r}
          cy={r}
          r={r - 1}
          fill="none"
          stroke={withOpacity(colors.orb.cyan, 0.35)}
          strokeWidth={1}
        />
      </Svg>
    </Animated.View>
  );
}
