import React, { useMemo } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { colors } from '@/design';
import type { OrbLayerStyle } from '../orbTypes';

interface ParticleFieldProps {
  size: number;
  count?: number;
  style?: OrbLayerStyle;
}

const DOT_SIZE = 3;

/**
 * Particle field — a slow orbiting ring of faint points that gives the Orb a
 * sense of contained energy. Rotation speed/opacity are driven by state.
 */
export function ParticleField({ size, count = 7, style }: ParticleFieldProps) {
  const dots = useMemo(() => {
    const radius = size / 2 - DOT_SIZE;
    const center = size / 2;
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        left: center + Math.cos(angle) * radius - DOT_SIZE / 2,
        top: center + Math.sin(angle) * radius - DOT_SIZE / 2,
        // Alternate the two spectral accents for subtle variety.
        color: i % 2 === 0 ? colors.orb.cyan : colors.orb.violet,
      };
    });
  }, [size, count]);

  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', width: size, height: size }, style]}>
      {dots.map((dot, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: dot.left,
            top: dot.top,
            width: DOT_SIZE,
            height: DOT_SIZE,
            borderRadius: DOT_SIZE / 2,
            backgroundColor: dot.color,
          }}
        />
      ))}
    </Animated.View>
  );
}
