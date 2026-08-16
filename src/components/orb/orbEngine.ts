import type { OrbProfile } from './orbProfiles';

/**
 * AREN Orb geometry engine.
 *
 * Pure, closure-free math (Reanimated worklets) that turns an OrbProfile + a
 * time value into a finished draw list: a set of projected particle dots plus a
 * few scalar values for the core, inner energy, orbital rings and atmosphere.
 * A renderer just draws the result and derives nothing itself.
 *
 * Concepts (dotted globe, scan meridian, rolling waveform, tilted orbits) are
 * adapted from Jakub Antalik's "thinking-orbs" (MIT) — see docs/ATTRIBUTIONS.md.
 */

export interface BaseDot {
  x: number;
  y: number;
  z: number;
  lat: number;
  lon: number;
  seed: number;
}

export interface RenderDot {
  x: number;
  y: number;
  r: number;
  a: number;
}

export interface OrbFrame {
  dots: RenderDot[];
  coreR: number;
  coreInnerR: number;
  coreA: number;
  innerR: number;
  innerA: number;
  ringA: number;
  ringRot: number;
  atmoR: number;
  atmoA: number;
}

/**
 * Fibonacci-sphere distribution of particle base positions (computed once, on
 * the JS thread). Each dot carries latitude/longitude for waveform + scan math
 * and a stable pseudo-random seed for density culling.
 */
export function makeBaseDots(count: number): BaseDot[] {
  const dots: BaseDot[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(1, count - 1)) * 2;
    const rxy = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = i * golden;
    const x = Math.cos(theta) * rxy;
    const z = Math.sin(theta) * rxy;
    const lat = Math.asin(Math.max(-1, Math.min(1, y)));
    const lon = Math.atan2(z, x);
    const seed = ((Math.sin(i * 127.1) * 43758.5453) % 1 + 1) % 1;
    dots.push({ x, y, z, lat, lon, seed });
  }
  return dots;
}

/** Linearly interpolate every field of two profiles. Worklet-safe. */
export function lerpProfile(a: OrbProfile, b: OrbProfile, t: number): OrbProfile {
  'worklet';
  const m = t < 0 ? 0 : t > 1 ? 1 : t;
  return {
    energy: a.energy + (b.energy - a.energy) * m,
    spin: a.spin + (b.spin - a.spin) * m,
    tilt: a.tilt + (b.tilt - a.tilt) * m,
    wave: a.wave + (b.wave - a.wave) * m,
    waveSpeed: a.waveSpeed + (b.waveSpeed - a.waveSpeed) * m,
    scan: a.scan + (b.scan - a.scan) * m,
    scanSpeed: a.scanSpeed + (b.scanSpeed - a.scanSpeed) * m,
    converge: a.converge + (b.converge - a.converge) * m,
    expand: a.expand + (b.expand - a.expand) * m,
    direction: a.direction + (b.direction - a.direction) * m,
    structure: a.structure + (b.structure - a.structure) * m,
    disrupt: a.disrupt + (b.disrupt - a.disrupt) * m,
    density: a.density + (b.density - a.density) * m,
    desat: a.desat + (b.desat - a.desat) * m,
    core: a.core + (b.core - a.core) * m,
    ring: a.ring + (b.ring - a.ring) * m,
    breath: a.breath + (b.breath - a.breath) * m,
  };
}

/**
 * Compute a finished orb frame for the given (interpolated) profile and time.
 * `t` is in seconds. All output coordinates are in canvas pixels.
 */
export function computeOrbFrame(
  p: OrbProfile,
  t: number,
  size: number,
  base: BaseDot[],
): OrbFrame {
  'worklet';
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.3;

  const spinA = t * (0.2 + p.spin * 1.6);
  const tilt = p.tilt;
  const breathe = 1 + 0.03 * Math.sin(t * (0.6 + p.breath));
  const pulse = 1 + p.expand * 0.22 * Math.sin(t * 2.4);
  const conv = 1 - p.converge * (0.3 + 0.14 * Math.sin(t * 3.2));
  const scanLon = t * (0.8 + p.scanSpeed) - Math.PI;
  const travelLon = t * 1.4 - Math.PI;

  const cosSpin = Math.cos(spinA);
  const sinSpin = Math.sin(spinA);
  const cosTilt = Math.cos(tilt);
  const sinTilt = Math.sin(tilt);

  const dots: RenderDot[] = [];
  for (let i = 0; i < base.length; i++) {
    const b = base[i];

    // Rotate around Y (spin), then around X (fixed tilt).
    let x = b.x * cosSpin + b.z * sinSpin;
    let z = -b.x * sinSpin + b.z * cosSpin;
    let y = b.y;
    const y2 = y * cosTilt - z * sinTilt;
    const z2 = y * sinTilt + z * cosTilt;
    y = y2;
    z = z2;

    // Radial modulation: breathing, converge, expand, rolling waveform.
    let rs = breathe * conv * pulse;
    rs *= 1 + p.wave * 0.16 * Math.sin(b.lat * 3 - t * (2 + p.waveSpeed));
    x *= rs;
    y *= rs;
    z *= rs;

    // Controlled disruption on a subset (ERROR).
    if (p.disrupt > 0 && i % 3 === 0) {
      x += p.disrupt * 0.1 * Math.sin(t * 22 + i);
      y += p.disrupt * 0.08 * Math.cos(t * 19 + i * 1.3);
    }

    const depth = (z + 1) / 2; // 0 (back) .. 1 (front)
    const dScale = 0.55 + 0.45 * depth;
    let r = size * 0.011 * dScale * (0.85 + 0.5 * p.energy);
    let a = p.energy * (0.15 + 0.85 * depth);

    // Soft density culling for sparse states.
    if (b.seed > p.density) {
      a *= Math.max(0, 1 - (b.seed - p.density) * 5);
    }
    a *= 1 - p.desat * 0.35;

    // Scan meridian (SEARCHING): illuminate dots near the sweeping longitude.
    if (p.scan > 0) {
      let dl = b.lon - scanLon;
      dl = Math.atan2(Math.sin(dl), Math.cos(dl));
      const boost = Math.exp(-(dl * dl) / 0.05) * p.scan;
      a += boost * 0.9;
      r *= 1 + boost * 0.9;
    }

    // Traveling equatorial highlight (EXECUTING): energy that travels.
    if (p.direction > 0) {
      let dl = b.lon - travelLon;
      dl = Math.atan2(Math.sin(dl), Math.cos(dl));
      const eq = Math.exp(-(b.lat * b.lat) / 0.15);
      const boost = Math.exp(-(dl * dl) / 0.08) * eq * p.direction;
      a += boost * 0.8;
      r *= 1 + boost * 0.6;
    }

    // Ordered latitude banding (PLANNING): calm, deliberate structure.
    if (p.structure > 0) {
      const band = Math.abs(Math.sin(b.lat * 5));
      a *= 1 - p.structure * 0.28 * (1 - band);
    }

    if (a < 0) a = 0;
    if (a > 1) a = 1;

    dots.push({ x: cx + x * R, y: cy + y * R, r: r > 0 ? r : 0, a });
  }

  const coreBase = size * 0.05;
  const coreR =
    coreBase * (1 + 0.25 * Math.sin(t * 1.6) + p.expand * 0.6 + p.converge * 0.3) *
    (0.8 + 0.6 * p.core);
  const coreA = 0.45 + 0.55 * p.core;
  const innerR = size * 0.16 * (1 + 0.1 * Math.sin(t * 1.2)) * (0.7 + 0.5 * p.energy);
  const innerA = 0.2 * p.energy + 0.15 * p.core;
  const ringA = p.ring * (0.45 + 0.55 * p.energy);
  const ringRot = (spinA * 0.7) % (Math.PI * 2);
  const atmoR = size * 0.46;
  const atmoA = 0.08 + 0.12 * p.energy;

  return {
    dots,
    coreR,
    coreInnerR: coreR * 0.5,
    coreA,
    innerR,
    innerA,
    ringA,
    ringRot,
    atmoR,
    atmoA,
  };
}
