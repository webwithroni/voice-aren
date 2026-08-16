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
| Vector/Orb     | React Native SVG                               |
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
│   ├── orb/                 # Orb + orbMotion + 5 layers
│   │   └── layers/          # OuterAtmosphere, ParticleField, PrimaryField,
│   │                        # InnerEnergy, OrbCore
│   ├── status/              # StatusLabel
│   ├── voice/               # VoiceSurface (Orb as the voice surface)
│   └── controls/            # ConnectionIndicator, StateSimulator
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

## The Orb

A reusable animated component (not a static image) composed of five layers,
maintaining one constant AREN identity across every state:

`Outer atmosphere → Particle field → Primary field → Inner energy → Core`

State is communicated through **motion** + a subtly tinted core (never by
redrawing the orb). Per-state motion lives in `src/components/orb/orbMotion.ts`.

**States:** IDLE, LISTENING, HEARING, THINKING, PLANNING, EXECUTING, SPEAKING,
VERIFYING, SUCCESS, ERROR, PAUSED, OFFLINE. All are local simulated states in
Phase 01, driven by the **developer state simulator** on the home screen.

## Interaction

- **Tap the Orb:** IDLE → LISTENING; tap again: LISTENING → IDLE.
- The Orb itself is the voice surface — there is no primary microphone button.
- The developer simulator exposes every other state.

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

| Check                         | Result                                             |
| ----------------------------- | -------------------------------------------------- |
| `yarn install`                | ✅ Pass                                            |
| `yarn typecheck` (tsc strict) | ✅ Pass (0 errors)                                 |
| `yarn lint` (eslint)          | ✅ Pass (0 errors, 0 warnings)                     |
| `expo export` (Android graph) | ✅ Pass — 1796 modules bundled (JSC engine)        |
| Android device run            | ⏳ Verify locally (`yarn android`)                 |

## Known limitations

- **Not run on a physical Android device in this environment.** The build was
  validated via typecheck, lint, and a full Metro export of the Android JS
  graph. Hermes **bytecode** compilation could not run here because the CI
  container is `aarch64` while the bundled `hermesc` is an x86_64 binary — an
  environment-only limitation. Run `yarn android` on your machine to verify.
- Simulated states only — no live audio, no Gemini (by design for Phase 01).
- `LocalVoiceRuntime` reports "connected" immediately (local, always available).

## Next phase

Phase 02 — Gemini Live: implement `GeminiLiveVoiceRuntime` behind the existing
`VoiceRuntime` seam, add the microphone pipeline and audio streaming, and wire
authoritative runtime state into the Orb — with no UI rewrite.
