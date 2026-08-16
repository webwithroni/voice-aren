import { Easing } from 'react-native-reanimated';

/**
 * Motion tokens. The Orb reads richer per-state motion from `orbMotion.ts`;
 * these are the shared durations/easings for general UI transitions.
 */
export const motion = {
  duration: {
    micro: 120,
    short: 220,
    medium: 320,
    long: 500,
  },
  easing: {
    standard: Easing.bezier(0.4, 0, 0.2, 1),
    calm: Easing.inOut(Easing.sin),
    entrance: Easing.out(Easing.cubic),
    exit: Easing.in(Easing.cubic),
  },
} as const;

export type Motion = typeof motion;
