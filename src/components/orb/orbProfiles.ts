import type { ArenState } from '@/types/aren';

/**
 * An OrbProfile is a set of *continuous* parameters that fully describe how the
 * AREN Orb looks and moves in a given state. States are never swapped as
 * discrete animations — instead these parameters are cross-faded, so the Orb
 * morphs smoothly between any two states while keeping one visual identity.
 *
 * Behavioural language is adapted (not copied) from the concepts in
 * Jakub Antalik's "thinking-orbs" (MIT): a dotted globe, a scan meridian, a
 * rolling waveform, tilted orbital particles. See docs/ATTRIBUTIONS.md.
 */
export interface OrbProfile {
  /** Global brightness / liveliness (0..1). */
  energy: number;
  /** Rotation-rate factor for the particle sphere. */
  spin: number;
  /** Fixed tilt of the sphere (radians) — gives orbital depth. */
  tilt: number;
  /** Rolling waveform amplitude (LISTENING / HEARING). */
  wave: number;
  /** Waveform roll speed. */
  waveSpeed: number;
  /** Scan-meridian intensity (SEARCHING). */
  scan: number;
  /** Scan-meridian sweep speed. */
  scanSpeed: number;
  /** Inward pull toward the core (THINKING / VERIFYING). */
  converge: number;
  /** Outward expansion pulse (SPEAKING / SUCCESS). */
  expand: number;
  /** Traveling equatorial highlight (EXECUTING) — energy that travels. */
  direction: number;
  /** Latitude banding / ordered motion (PLANNING). */
  structure: number;
  /** Controlled asymmetric disruption (ERROR). */
  disrupt: number;
  /** Fraction of particles visible (sparse for IDLE / OFFLINE). */
  density: number;
  /** Desaturation toward offline gray. */
  desat: number;
  /** Core glow intensity. */
  core: number;
  /** Orbital-ring opacity. */
  ring: number;
  /** Breathing rate factor. */
  breath: number;
}

const BASE: OrbProfile = {
  energy: 0.55,
  spin: 0.12,
  tilt: 0.5,
  wave: 0,
  waveSpeed: 2,
  scan: 0,
  scanSpeed: 1.1,
  converge: 0,
  expand: 0,
  direction: 0,
  structure: 0,
  disrupt: 0,
  density: 1,
  desat: 0,
  core: 0.55,
  ring: 0.35,
  breath: 0.5,
};

function profile(overrides: Partial<OrbProfile>): OrbProfile {
  return { ...BASE, ...overrides };
}

/**
 * Per-state profiles. Differences are intentionally restrained — the user must
 * always recognise the same AREN Orb; only its energy and behaviour shift.
 */
export const PROFILES: Record<ArenState, OrbProfile> = {
  // Extremely slow breathing, sparse particles, calm presence, lowest energy.
  IDLE: profile({
    energy: 0.42,
    spin: 0.06,
    density: 0.55,
    core: 0.45,
    ring: 0.25,
    breath: 0.35,
  }),

  // Responsive expansion + rolling waveform; visibly attentive.
  LISTENING: profile({
    energy: 0.8,
    spin: 0.14,
    wave: 0.9,
    waveSpeed: 2.4,
    density: 0.9,
    core: 0.7,
    ring: 0.45,
    breath: 0.7,
  }),

  // Faster micro-reactions than LISTENING — perceptual attention.
  HEARING: profile({
    energy: 0.9,
    spin: 0.18,
    wave: 1.1,
    waveSpeed: 4,
    density: 0.95,
    core: 0.75,
    ring: 0.5,
    breath: 0.9,
  }),

  // Internal particles active, energy moving toward the center.
  THINKING: profile({
    energy: 0.8,
    spin: 0.4,
    converge: 0.55,
    density: 1,
    core: 0.85,
    ring: 0.4,
    breath: 0.6,
  }),

  // Structured, deliberate motion; orbital elements align.
  PLANNING: profile({
    energy: 0.75,
    spin: 0.16,
    structure: 0.9,
    density: 1,
    core: 0.65,
    ring: 0.6,
    breath: 0.5,
  }),

  // A scan meridian sweeps the dotted globe, illuminating dots as it passes.
  SEARCHING: profile({
    energy: 0.8,
    spin: 0.1,
    scan: 1,
    scanSpeed: 1.4,
    density: 1,
    core: 0.6,
    ring: 0.5,
    breath: 0.5,
  }),

  // Directional, traveling energy — a clear sense of forward action.
  EXECUTING: profile({
    energy: 0.9,
    spin: 0.55,
    direction: 1,
    density: 1,
    core: 0.8,
    ring: 0.55,
    breath: 0.6,
  }),

  // Audio-reactive expansion waves — calm but alive; differs from LISTENING.
  SPEAKING: profile({
    energy: 0.95,
    spin: 0.2,
    expand: 0.9,
    density: 0.95,
    core: 0.9,
    ring: 0.5,
    breath: 1.1,
  }),

  // Particles converge, focused central energy, short controlled pulses.
  VERIFYING: profile({
    energy: 0.85,
    spin: 0.22,
    converge: 0.85,
    density: 1,
    core: 0.95,
    ring: 0.45,
    breath: 0.7,
  }),

  // Brief controlled outward release (transient → settles to IDLE).
  SUCCESS: profile({
    energy: 1,
    spin: 0.2,
    expand: 1,
    density: 1,
    core: 1,
    ring: 0.6,
    breath: 0.9,
  }),

  // Controlled disruption — brief asymmetry, restrained; never alarming.
  ERROR: profile({
    energy: 0.7,
    spin: 0.05,
    disrupt: 0.8,
    density: 0.9,
    core: 0.7,
    ring: 0.3,
    breath: 0.4,
  }),

  // Almost static, desaturated, minimal energy — clearly different from IDLE.
  OFFLINE: profile({
    energy: 0.28,
    spin: 0.02,
    density: 0.4,
    desat: 1,
    core: 0.3,
    ring: 0.15,
    breath: 0.2,
  }),
};

export function profileFor(state: ArenState): OrbProfile {
  return PROFILES[state];
}
