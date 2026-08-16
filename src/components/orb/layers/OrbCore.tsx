import React, { useId } from 'react';
import Animated from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import type { OrbLayerStyle } from '../orbTypes';

interface OrbCoreProps {
  size: number;
  /** Subtle state tint — expresses semantic state while keeping identity. */
  color: string;
  style?: OrbLayerStyle;
}

/**
 * Core — the bright, living center of the Orb. Its glow color is subtly tinted
 * by the current state; its scale/opacity pulse is driven by state motion.
 */
export function OrbCore({ size, color, style }: OrbCoreProps) {
  const uid = useId().replace(/:/g, '');
  const id = `core-${uid}`;
  const r = size / 2;
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={color} stopOpacity={0.98} />
            <Stop offset="34%" stopColor={color} stopOpacity={0.6} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={r} cy={r} r={r} fill={`url(#${id})`} />
      </Svg>
    </Animated.View>
  );
}
