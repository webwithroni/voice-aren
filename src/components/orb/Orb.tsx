import React, { useEffect, useMemo } from 'react';
import { BlurMask, Canvas, Circle, Group, useClock, vec } from '@shopify/react-native-skia';
import {
  interpolateColor,
  useDerivedValue,
  useSharedValue,
  withTiming,
  type DerivedValue,
  type SharedValue,
} from 'react-native-reanimated';

import { colors, motion } from '@/design';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { metaFor } from '@/state/arenState/stateMeta';
import type { ArenState } from '@/types/aren';
import { computeOrbFrame, makeBaseDots, lerpProfile, type OrbFrame } from './orbEngine';
import { PROFILES, type OrbProfile } from './orbProfiles';

export interface OrbProps {
  state: ArenState;
  /** Rendered diameter in px. */
  size?: number;
}

const DOT_COUNT = 48;
const FROZEN_T = 1400; // representative frozen frame for reduced motion

/** Spectral particle palette — constant AREN identity across every state. */
const DOT_PALETTE = [
  colors.orb.blue,
  colors.orb.cyan,
  colors.orb.core,
  colors.orb.blue,
  colors.orb.violet,
  colors.orb.cyan,
];

/** A single particle. Reads its slot from the shared frame on the UI thread. */
const Dot = React.memo(function Dot({
  index,
  frame,
  color,
}: {
  index: number;
  frame: DerivedValue<OrbFrame>;
  color: string;
}) {
  const cx = useDerivedValue(() => frame.value.dots[index].x);
  const cy = useDerivedValue(() => frame.value.dots[index].y);
  const r = useDerivedValue(() => frame.value.dots[index].r);
  const opacity = useDerivedValue(() => frame.value.dots[index].a);
  return <Circle cx={cx} cy={cy} r={r} color={color} opacity={opacity} />;
});

/**
 * The AREN Orb — a native, Skia-rendered dotted thought-orb.
 *
 * Layers: outer atmosphere → orbital rings → particle field → inner energy →
 * core. Animation runs entirely on the UI thread (Skia clock + Reanimated
 * shared values) with no React re-renders. State changes cross-fade by
 * interpolating between OrbProfiles rather than swapping animations.
 */
export function Orb({ state, size = 260 }: OrbProps) {
  const reducedMotion = useReducedMotion();

  const baseDots = useMemo(() => makeBaseDots(DOT_COUNT), []);
  const dotColors = useMemo(
    () => Array.from({ length: DOT_COUNT }, (_, i) => DOT_PALETTE[i % DOT_PALETTE.length]),
    [],
  );
  const center = useMemo(() => vec(size / 2, size / 2), [size]);
  const R = size * 0.3;

  const clock = useClock();
  const frozen = useSharedValue(FROZEN_T);
  const time: SharedValue<number> = reducedMotion ? frozen : clock;

  const p0 = useSharedValue<OrbProfile>(PROFILES[state]);
  const p1 = useSharedValue<OrbProfile>(PROFILES[state]);
  const morph = useSharedValue(1);
  const tintFrom = useSharedValue<string>(metaFor(state).semanticColor);
  const tintTo = useSharedValue<string>(metaFor(state).semanticColor);

  // Cross-fade to the new state's profile whenever the state changes.
  useEffect(() => {
    const target = PROFILES[state];
    const current = lerpProfile(p0.value, p1.value, morph.value);
    p0.value = current;
    p1.value = target;
    tintFrom.value = tintTo.value;
    tintTo.value = metaFor(state).semanticColor;

    if (reducedMotion) {
      p0.value = target;
      tintFrom.value = tintTo.value;
      morph.value = 1;
    } else {
      morph.value = 0;
      morph.value = withTiming(1, {
        duration: motion.duration.expressive,
        easing: motion.easing.standard,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, reducedMotion]);

  const frame = useDerivedValue(() => {
    const p = lerpProfile(p0.value, p1.value, morph.value);
    return computeOrbFrame(p, time.value / 1000, size, baseDots);
  });

  const tint = useDerivedValue(() =>
    interpolateColor(morph.value, [0, 1], [tintFrom.value, tintTo.value]),
  );

  const atmoR = useDerivedValue(() => frame.value.atmoR);
  const atmoA = useDerivedValue(() => frame.value.atmoA);
  const ringA = useDerivedValue(() => frame.value.ringA);
  const innerR = useDerivedValue(() => frame.value.innerR);
  const innerA = useDerivedValue(() => frame.value.innerA);
  const coreR = useDerivedValue(() => frame.value.coreR);
  const coreInnerR = useDerivedValue(() => frame.value.coreInnerR);
  const coreA = useDerivedValue(() => frame.value.coreA);

  const ring1 = useDerivedValue(() => [{ rotate: frame.value.ringRot }, { scaleY: 0.34 }]);
  const ring2 = useDerivedValue(() => [
    { rotate: -frame.value.ringRot * 0.8 },
    { scaleY: 0.62 },
  ]);

  return (
    <Canvas style={{ width: size, height: size }}>
      {/* 06 Outer atmosphere */}
      <Circle c={center} r={atmoR} color={tint} opacity={atmoA}>
        <BlurMask blur={size * 0.1} style="normal" />
      </Circle>

      {/* 03 Orbital / ring structure */}
      <Group origin={center} transform={ring1}>
        <Circle
          c={center}
          r={R * 1.16}
          style="stroke"
          strokeWidth={1.1}
          color={tint}
          opacity={ringA}
        />
      </Group>
      <Group origin={center} transform={ring2}>
        <Circle
          c={center}
          r={R * 0.94}
          style="stroke"
          strokeWidth={1}
          color={tint}
          opacity={ringA}
        />
      </Group>

      {/* 04 Particle field + 05 state-specific geometry */}
      {baseDots.map((_, i) => (
        <Dot key={i} index={i} frame={frame} color={dotColors[i]} />
      ))}

      {/* 02 Inner energy */}
      <Circle c={center} r={innerR} color={colors.orb.core} opacity={innerA}>
        <BlurMask blur={size * 0.06} style="normal" />
      </Circle>

      {/* 01 Core */}
      <Circle c={center} r={coreR} color={tint} opacity={coreA}>
        <BlurMask blur={size * 0.05} style="solid" />
      </Circle>
      <Circle c={center} r={coreInnerR} color={colors.orb.core} opacity={coreA} />
    </Canvas>
  );
}
