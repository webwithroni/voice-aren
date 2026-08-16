import { colors } from '@/design';
import type { ArenState } from '@/types/aren';

/**
 * Per-state Orb motion configuration.
 *
 * The Orb keeps ONE visual identity across every state — the same spectral
 * cyan → blue → violet field. State is communicated through *motion* and a
 * subtly tinted core, never by redrawing the orb. Values are intentionally
 * restrained so no two states feel dramatically different.
 */
export interface OrbMotionConfig {
  /** Base breathing scale range for the primary field. */
  breathMin: number;
  breathMax: number;
  breathDuration: number;

  /** Core glow pulse. */
  coreScaleMin: number;
  coreScaleMax: number;
  coreOpacityMin: number;
  coreOpacityMax: number;
  coreDuration: number;
  /** Subtle core tint — expresses semantic state while keeping identity. */
  coreColor: string;

  /** Full particle-field rotation duration in ms (0 = no rotation). */
  rotationDuration: number;
  particleOpacity: number;
  atmosphereOpacity: number;

  /** Audio-reactive-style movement using simulated amplitude. */
  audioReactive: boolean;
  ampScale: number;

  /** Controlled disruption (ERROR only). */
  disruption: boolean;
}

const base: OrbMotionConfig = {
  breathMin: 0.98,
  breathMax: 1.04,
  breathDuration: 4200,
  coreScaleMin: 0.9,
  coreScaleMax: 1.06,
  coreOpacityMin: 0.7,
  coreOpacityMax: 0.95,
  coreDuration: 3600,
  coreColor: colors.orb.core,
  rotationDuration: 60000,
  particleOpacity: 0.35,
  atmosphereOpacity: 0.8,
  audioReactive: false,
  ampScale: 0,
  disruption: false,
};

const overrides: Record<ArenState, Partial<OrbMotionConfig>> = {
  // Very slow breathing — a calm resting presence.
  IDLE: {},

  // Responsive expansion + subtle audio-style reaction.
  LISTENING: {
    breathMin: 0.99,
    breathMax: 1.1,
    breathDuration: 1500,
    coreColor: colors.orb.cyan,
    coreDuration: 1200,
    rotationDuration: 24000,
    particleOpacity: 0.5,
    atmosphereOpacity: 1,
    audioReactive: true,
    ampScale: 0.06,
  },

  // More responsive energy movement.
  HEARING: {
    breathMin: 0.99,
    breathMax: 1.08,
    breathDuration: 900,
    coreColor: colors.orb.cyan,
    coreDuration: 800,
    rotationDuration: 16000,
    particleOpacity: 0.55,
    atmosphereOpacity: 1,
    audioReactive: true,
    ampScale: 0.05,
  },

  // Internal flowing movement.
  THINKING: {
    breathMin: 0.99,
    breathMax: 1.05,
    breathDuration: 2400,
    coreColor: colors.orb.violet,
    coreDuration: 1600,
    rotationDuration: 8000,
    particleOpacity: 0.5,
    atmosphereOpacity: 0.95,
  },

  // Structured, steady directional motion.
  PLANNING: {
    breathMin: 0.99,
    breathMax: 1.05,
    breathDuration: 2800,
    coreColor: colors.semantic.executing,
    coreDuration: 2000,
    rotationDuration: 12000,
    particleOpacity: 0.5,
  },

  // Directional energy movement.
  EXECUTING: {
    breathMin: 0.99,
    breathMax: 1.06,
    breathDuration: 1500,
    coreColor: colors.semantic.executing,
    coreDuration: 1100,
    rotationDuration: 6000,
    particleOpacity: 0.6,
    atmosphereOpacity: 1,
  },

  // Audio-reactive style movement (simulated output).
  SPEAKING: {
    breathMin: 0.99,
    breathMax: 1.09,
    breathDuration: 600,
    coreColor: colors.orb.blue,
    coreDuration: 500,
    rotationDuration: 20000,
    particleOpacity: 0.5,
    atmosphereOpacity: 1,
    audioReactive: true,
    ampScale: 0.08,
  },

  // Focused, concentrated movement.
  VERIFYING: {
    breathMin: 0.995,
    breathMax: 1.03,
    breathDuration: 1800,
    coreColor: colors.orb.cyan,
    coreDuration: 1400,
    rotationDuration: 30000,
    particleOpacity: 0.45,
  },

  // Brief controlled release.
  SUCCESS: {
    breathMin: 1.0,
    breathMax: 1.08,
    breathDuration: 900,
    coreColor: colors.orb.success,
    coreDuration: 700,
    coreOpacityMax: 1,
    rotationDuration: 40000,
    particleOpacity: 0.5,
    atmosphereOpacity: 1,
  },

  // Controlled disruption.
  ERROR: {
    breathMin: 0.98,
    breathMax: 1.03,
    breathDuration: 1200,
    coreColor: colors.orb.error,
    coreDuration: 600,
    rotationDuration: 0,
    particleOpacity: 0.4,
    atmosphereOpacity: 0.9,
    disruption: true,
  },

  // Almost static.
  PAUSED: {
    breathMin: 0.995,
    breathMax: 1.01,
    breathDuration: 6000,
    coreColor: colors.text.secondary,
    coreDuration: 5000,
    coreOpacityMin: 0.4,
    coreOpacityMax: 0.6,
    rotationDuration: 0,
    particleOpacity: 0.2,
    atmosphereOpacity: 0.5,
  },

  // Minimal, low-energy appearance.
  OFFLINE: {
    breathMin: 0.99,
    breathMax: 1.02,
    breathDuration: 7000,
    coreColor: colors.semantic.offline,
    coreDuration: 6000,
    coreOpacityMin: 0.3,
    coreOpacityMax: 0.5,
    rotationDuration: 0,
    particleOpacity: 0.12,
    atmosphereOpacity: 0.35,
  },
};

export function orbMotionFor(state: ArenState): OrbMotionConfig {
  return { ...base, ...overrides[state] };
}
