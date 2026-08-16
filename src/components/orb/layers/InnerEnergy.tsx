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
 * Inner energy — an offset highlight that rotates slowly within the sphere,
 * suggesting internal movement / thought. Rotation is driven by state motion.
 */
export function InnerEnergy({ size, style }: LayerProps) {
  const uid = useId().replace(/:/g, '');
  const id = `inner-${uid}`;
  const r = size / 2;
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="30%" r="55%">
            <Stop offset="0%" stopColor={colors.orb.core} stopOpacity={0.5} />
            <Stop offset="55%" stopColor={colors.orb.cyan} stopOpacity={0.14} />
            <Stop offset="100%" stopColor={colors.orb.cyan} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={r} cy={r} r={r} fill={`url(#${id})`} />
      </Svg>
    </Animated.View>
  );
}
