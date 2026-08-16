import { Easing } from 'react-native-reanimated';

/**
 * Motion tokens. Durations follow the AREN transition bands:
 * micro (tap/press feedback), standard (UI transitions), expressive (Orb state
 * cross-fades), ambient (continuous breathing / orbital motion).
 */
export const motion = {
  duration: {
    micro: 140, // 100–160ms
    standard: 260, // 200–320ms
    expressive: 520, // 400–700ms
    ambient: 4000, // 2–8s continuous
  },
  easing: {
    standard: Easing.bezier(0.4, 0, 0.2, 1),
    calm: Easing.inOut(Easing.sin),
    entrance: Easing.out(Easing.cubic),
    exit: Easing.in(Easing.cubic),
  },
} as const;

export type Motion = typeof motion;
