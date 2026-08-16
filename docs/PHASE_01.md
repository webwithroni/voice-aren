# AREN — Phase 01 Implementation Report

**Design direction:** Quiet Intelligence · **Principle:** Presence > Interface
**Interface hierarchy:** Voice → State → Orb → Context → Control

Phase 01 establishes the Android-first visual and interaction foundation for
AREN. There is **no** Gemini integration, authentication, backend, Firebase,
device control, accessibility services, autonomous actions, or memory in this
phase — by design.

---

## Stack

| Concern        | Choice                                         |
| -------------- | ---------------------------------------------- |
| Framework      | Expo SDK 57 (New Architecture)                 |
| Runtime        | React Native 0.86, React 19                    |
| Language       | TypeScript (strict)                            |
| Routing        | Expo Router (file-based, root `src/app`)       |
| Animation      | React Native Reanimated 4                      |
| Gestures       | React Native Gesture Handler                   |
| Orb rendering  | `@shopify/react-native-skia` (Expo Go SDK 57)  |
| Fonts          | Inter via `@expo-google-fonts/inter`           |
| Android package| `com.webwithroni.aren`                         |

## Architecture

```
src/
├── app/                     # Expo Router routes
│   ├── _layout.tsx          # Fonts, providers, gesture root, dark theme
│   └── index.tsx            # Home route
├── components/
│   ├── base/                # AppText, Surface (token-driven primitives)
│   ├── orb/                 # Skia Orb + geometry engine + state profiles
│   │   ├── Orb.tsx          # Skia canvas: atmosphere, rings, particles, core
│   │   ├── orbEngine.ts     # Pure worklet math → per-frame draw list
│   │   └── orbProfiles.ts   # Per-state continuous parameters (cross-faded)
│   ├── status/              # StatusLabel
│   ├── voice/               # VoiceSurface (Orb as the voice surface)
│   └── controls/            # ConnectionIndicator, StateSimulator (dev-only)
├── design/                  # Centralized tokens
│   ├── colors/ typography/ spacing/ radius/ motion/
│   └── index.ts             # Barrel — import from '@/design'
├── features/
│   └── home/                # HomeScreen composition
├── state/
│   └── arenState/           # Provider, stateMeta, VoiceRuntime (local)
├── hooks/                   # useArenState, useReducedMotion
├── types/                   # ArenState + VoiceRuntime abstraction seam
└── utils/                   # color helpers
```

### The abstraction boundary (no Gemini yet)

```
UI  →  AREN State  →  VoiceRuntime (interface)  →  [Phase 02] Gemini Live WebSocket
```

- `VoiceRuntime` is defined in `src/types/aren.ts`.
- Phase 01 ships `LocalVoiceRuntime` (`src/state/arenState/voiceRuntime.ts`):
  no network, no audio, **no fabricated assistant responses**.
- The UI never imports a concrete runtime — only `useArenState()`.

## The Orb (native Skia thought-orb)

The Orb is a native, GPU-rasterised **dotted thought-orb** rendered with
`@shopify/react-native-skia` — not a gradient sphere and not a static image. It
keeps one recognisable AREN identity (spectral particles on a tilted globe)
across every state.

**Layers:**

```
06 Outer atmosphere   soft radial glow (blurred)
03 Orbital rings      two tilted, counter-rotating stroked ellipses
04 Particle field     48 depth-shaded dots on a Fibonacci sphere
05 State geometry     scan meridian / rolling waveform / traveling highlight
02 Inner energy       blurred central bloom
01 Core               tinted, blurred core + bright center
07 Interaction        tap toggles LISTENING; state morph is the response
```

**How it works (no React re-renders during animation):**

- `orbEngine.ts` holds pure, closure-free **Reanimated worklet** math. Given an
  `OrbProfile` and a time value it returns a finished draw list (dots + core /
  ring / atmosphere scalars). Validated: all 12 states produce finite,
  in-range values for 48 dots across sampled timestamps.
- `orbProfiles.ts` describes each state as **continuous parameters** (energy,
  spin, wave, scan, converge, expand, direction, structure, disrupt, density,
  desat, core, ring, breath).
- State changes **cross-fade** by interpolating between the previous and target
  profile (`withTiming`, expressive easing) — never an instant swap.
- The animation clock is Skia's `useClock`; geometry runs on the UI thread and
  feeds Skia shape props directly. React does not re-render per frame.

**States (12 canonical):** IDLE, LISTENING, HEARING, THINKING, PLANNING,
SEARCHING, EXECUTING, SPEAKING, VERIFYING, SUCCESS, ERROR, OFFLINE. All are
local simulated states in Phase 01, driven by the **developer-only** state
simulator (rendered only when `__DEV__`).

Behavioural language (dotted globe, scan meridian, rolling waveform) is adapted
from Jakub Antalik's **thinking-orbs** (MIT) — concepts only, no code copied.
See [ATTRIBUTIONS.md](ATTRIBUTIONS.md).

## Interaction

- **Tap the Orb:** IDLE → LISTENING; tap again: LISTENING → IDLE.
- The Orb itself is the voice surface — there is no primary microphone button.
- The **developer-only** simulator (shown only in `__DEV__`) exposes all 12
  states; it is never part of the consumer interface.

## Accessibility

- Scalable text (`AppText`, capped multiplier to protect layout).
- Semantic roles/labels on all interactive + status elements.
- Touch targets ≥ 48dp (`TOUCH_TARGET_MIN`).
- Reduced-motion support: the Orb renders a calm static presence.
- Screen-reader state announcements, e.g. *"AREN is listening."*
- State is never signaled by color alone — a text label is always present.

## Design tokens

All values are centralized in `src/design` and referenced everywhere (no
duplicated raw colors/spacing in components):

- **Colors:** near-black backgrounds, subtle surfaces, spectral orb accents.
- **Typography:** Display XL → Button semantic variants (Inter).
- **Spacing:** 8pt system (4…128).
- **Radius:** 6/10/14/20/28/999.
- **Motion:** shared durations + easings.

## Project checks (this build)

| Check                          | Result                                                   |
| ------------------------------ | -------------------------------------------------------- |
| `yarn typecheck` (tsc strict)  | ✅ Pass (0 errors)                                       |
| `yarn lint` (eslint)           | ✅ Pass (0 errors, 0 warnings)                           |
| `expo export` (Android graph)  | ✅ Pass — Skia + Reanimated worklets bundled (JSC)       |
| Orb engine numeric validation  | ✅ Pass — 12 states finite, in-range, 48 dots, lerp OK   |
| No browser-only dependency     | ✅ Skia is native; no WebGL / DOM APIs used              |
| Android device run             | ⏳ Verify locally (`yarn android` / Expo Go)             |

## Known limitations

- **Not run on a physical Android device in this environment.** Validated via
  typecheck, lint, a full Metro export of the Android JS graph (Skia +
  worklets), and a numeric validation of the Orb geometry engine. Hermes
  **bytecode** compilation cannot run in this container (`aarch64` host vs the
  bundled x86_64 `hermesc`) — an environment-only limitation, so export was run
  with the JSC engine. Run `yarn android` (or Expo Go) on your machine to see
  the live Orb.
- `@shopify/react-native-skia` is bundled in Expo Go for SDK 57, so no custom
  dev build is required.
- Simulated states only — no live audio, no Gemini (by design for Phase 01).
- `LocalVoiceRuntime` reports "connected" immediately (local, always available).

## Next phase

Phase 02 — Gemini Live: implement `GeminiLiveVoiceRuntime` behind the existing
`VoiceRuntime` seam, add the microphone pipeline and audio streaming, and wire
authoritative runtime state into the Orb — with no UI rewrite.
