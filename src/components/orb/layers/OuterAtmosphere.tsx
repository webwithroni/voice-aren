import React, { useId } from 'react';
import Animated from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { colors } from '@/design';
import type { OrbLayerStyle } from '../orbTypes';

interface LayerProps {
  size: number;
  style?: OrbLayerStyle;
}

/**
 * Outer atmosphere — the soft ambient glow that surrounds the Orb.
 * A single restrained violet→blue radial fading to transparent.
 */
export function OuterAtmosphere({ size, style }: LayerProps) {
  const uid = useId().replace(/:/g, '');
  const id = `atmo-${uid}`;
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={colors.orb.violet} stopOpacity={0.22} />
            <Stop offset="45%" stopColor={colors.orb.blue} stopOpacity={0.12} />
            <Stop offset="100%" stopColor={colors.orb.violet} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
      </Svg>
    </Animated.View>
  );
}
