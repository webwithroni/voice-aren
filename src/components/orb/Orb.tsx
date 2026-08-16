import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { ArenState } from '@/types/aren';
import { InnerEnergy } from './layers/InnerEnergy';
import { OrbCore } from './layers/OrbCore';
import { OuterAtmosphere } from './layers/OuterAtmosphere';
import { ParticleField } from './layers/ParticleField';
import { PrimaryField } from './layers/PrimaryField';
import { orbMotionFor } from './orbMotion';

export interface OrbProps {
  state: ArenState;
  /** Diameter of the primary sphere in px. */
  size?: number;
}

/**
 * The AREN Orb — the primary visual expression of AREN.
 *
 * Composed of five layers (outer atmosphere, particle field, primary field,
 * inner energy, core). State is communicated through motion + a subtly tinted
 * core, while the spectral identity stays constant. Honors reduce-motion by
 * rendering a calm static presence.
 */
export function Orb({ state, size = 240 }: OrbProps) {
  const reducedMotion = useReducedMotion();
  const config = orbMotionFor(state);

  const container = size * 1.9;
  const particleSize = size * 1.34;
  const innerSize = size * 0.92;
  const coreSize = size * 0.42;

  const breath = useSharedValue(0.5);
  const spin = useSharedValue(0);
  const core = useSharedValue(0.5);
  const amp = useSharedValue(0);
  const disrupt = useSharedValue(0);

  useEffect(() => {
    cancelAnimation(breath);
    cancelAnimation(spin);
    cancelAnimation(core);
    cancelAnimation(amp);
    cancelAnimation(disrupt);

    if (reducedMotion) {
      // Static, low-energy presence — no looping animation.
      breath.value = 0.5;
      spin.value = 0;
      core.value = 0.6;
      amp.value = 0;
      disrupt.value = 0;
      return;
    }

    breath.value = withRepeat(
      withTiming(1, { duration: config.breathDuration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );

    core.value = withRepeat(
      withTiming(1, { duration: config.coreDuration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );

    if (config.rotationDuration > 0) {
      spin.value = withRepeat(
        withTiming(1, { duration: config.rotationDuration, easing: Easing.linear }),
        -1,
        false,
      );
    } else {
      spin.value = withTiming(spin.value, { duration: 0 });
    }

    if (config.audioReactive) {
      // Simulated amplitude — irregular sequence so it never feels metronomic.
      amp.value = withRepeat(
        withSequence(
          withTiming(0.9, { duration: 180 }),
          withTiming(0.35, { duration: 220 }),
          withTiming(1, { duration: 140 }),
          withTiming(0.5, { duration: 260 }),
        ),
        -1,
        true,
      );
    } else {
      amp.value = withTiming(0, { duration: 320 });
    }

    if (config.disruption) {
      disrupt.value = withRepeat(
        withSequence(withTiming(1, { duration: 90 }), withTiming(-1, { duration: 90 })),
        -1,
        true,
      );
    } else {
      disrupt.value = withTiming(0, { duration: 220 });
    }

    return () => {
      cancelAnimation(breath);
      cancelAnimation(spin);
      cancelAnimation(core);
      cancelAnimation(amp);
      cancelAnimation(disrupt);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, reducedMotion]);

  const {
    breathMin,
    breathMax,
    coreScaleMin,
    coreScaleMax,
    coreOpacityMin,
    coreOpacityMax,
    atmosphereOpacity,
    particleOpacity,
    ampScale,
  } = config;

  const atmosphereStyle = useAnimatedStyle(() => ({
    opacity: atmosphereOpacity * (0.85 + 0.15 * breath.value),
    transform: [{ scale: interpolate(breath.value, [0, 1], [0.96, 1.06]) }],
  }));

  const particleStyle = useAnimatedStyle(() => ({
    opacity: particleOpacity,
    transform: [{ rotate: `${spin.value * 360}deg` }],
  }));

  const primaryStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(breath.value, [0, 1], [breathMin, breathMax]) + amp.value * ampScale },
    ],
  }));

  const innerEnergyStyle = useAnimatedStyle(() => ({
    opacity: interpolate(core.value, [0, 1], [0.45, 0.85]),
    transform: [{ rotate: `${-spin.value * 360}deg` }],
  }));

  const coreStyle = useAnimatedStyle(() => ({
    opacity: interpolate(core.value, [0, 1], [coreOpacityMin, coreOpacityMax]),
    transform: [
      { scale: interpolate(core.value, [0, 1], [coreScaleMin, coreScaleMax]) + amp.value * 0.12 },
    ],
  }));

  const disruptStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: disrupt.value * 4 }],
  }));

  const offset = (layer: number) => ({ left: (container - layer) / 2, top: (container - layer) / 2 });

  return (
    <Animated.View style={[styles.container, { width: container, height: container }, disruptStyle]}>
      <OuterAtmosphere size={container} style={atmosphereStyle} />
      <ParticleField size={particleSize} style={[offset(particleSize), particleStyle]} />
      <PrimaryField size={size} style={[offset(size), primaryStyle]} />
      <InnerEnergy size={innerSize} style={[offset(innerSize), innerEnergyStyle]} />
      <OrbCore size={coreSize} color={config.coreColor} style={[offset(coreSize), coreStyle]} />
      {/* Static fallback marker kept invisible; layers above carry identity. */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
