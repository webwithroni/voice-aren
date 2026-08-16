# AREN — Product Requirements & Progress

## Original problem statement
Build AREN Phase 01: the Android-first visual and interaction foundation for a
personal voice intelligence assistant, using Expo + React Native + TypeScript +
Expo Router + Reanimated + Gesture Handler, connected to the existing GitHub
repo `webwithroni/voice-aren`. Principle: **Presence > Interface**. Hierarchy:
Voice → State → Orb → Context → Control. Phase 01 excludes Gemini, auth,
backend, Firebase, device control, accessibility services, autonomy, memory.

## Product principles (static)
- Presence over interface; voice-first; the Orb is AREN's visual expression.
- Quiet Intelligence: calm, premium, restrained, near-black dark system.
- Honest capability reporting; no fabricated responses.
- Accessibility from the foundation.
- UI depends only on an abstract `VoiceRuntime`, never on Gemini directly.

## Architecture
Expo SDK 57 / RN 0.86 / React 19 / TS strict / Expo Router (root `src/app`).
Feature-based `src/` layout with centralized `@/design` tokens. State via React
Context (`ArenStateProvider`). Voice runtime abstraction seam in
`src/types/aren.ts`, local impl in `src/state/arenState/voiceRuntime.ts`.
Orb = 5 layered SVG components animated with Reanimated 4.

## Implemented — Phase 01 (2026-06)
- Project foundation (Expo/RN/TS/Router) connected to existing repo.
- Design tokens: colors, typography (Inter), spacing (8pt), radius, motion.
- Dark visual system, semantic state colors, surface/border system.
- AREN Orb: layered, animated, one identity across 12 states.
- Home screen (connection → Orb → status → dev controls).
- Tap-to-toggle IDLE↔LISTENING; developer state simulator for all states.
- Accessibility: scalable text, semantic labels, 48dp targets, reduced motion,
  screen-reader announcements, non-color state signaling.
- Docs updated (README, ARCHITECTURE, ROADMAP) + docs/PHASE_01.md report.
- Verified: `yarn typecheck` ✅, `yarn lint` ✅, Android `expo export` (1796
  modules) ✅. Not run on a physical Android device in this environment.

## Orb replacement (2026-06) — Native Skia thought-orb
- Replaced the placeholder gradient-sphere Orb with a native
  `@shopify/react-native-skia` dotted "thought-orb" (Expo Go SDK 57, no dev
  build, no WebGL). Inspiration (concepts only) from thinking-orbs (MIT);
  attribution in docs/ATTRIBUTIONS.md.
- Architecture: `orbEngine.ts` (pure worklet geometry → draw list),
  `orbProfiles.ts` (per-state continuous params), `Orb.tsx` (Skia layers:
  atmosphere, rings, 48-dot particle field, inner energy, core). State changes
  cross-fade by interpolating profiles; UI-thread only, zero React re-renders.
- State model changed to the 12 canonical states: dropped PAUSED, added
  SEARCHING (scan meridian). Old SVG layer components removed.
- Developer state simulator gated to `__DEV__` only (not in consumer UI).
- Verified: typecheck ✅, lint ✅, Android expo export (Skia+worklets) ✅,
  engine numeric validation ✅. Not run on a physical device in this env.

## Backlog
- P0 (Phase 02): GeminiLiveVoiceRuntime behind VoiceRuntime seam; mic pipeline;
  audio streaming; authoritative runtime→Orb state sync; connection recovery.
- P1 (Phase 03): conversation continuity, history, memory foundation.
- P2 (Phase 04+): device controls, permissions UX, agency/planning, trust,
  production hardening.

## Notes / limitations
- Container is aarch64; bundled `hermesc` is x86_64 → Hermes bytecode step can't
  run here. JS bundling fully validated via JSC export. `yarn android` locally
  to run on device.
- No auth / no secrets created (nothing added to test_credentials.md).
