# AREN

## Personal Voice Intelligence

AREN is an Android-first personal voice intelligence assistant designed around presence, voice interaction, state awareness, controlled autonomy, and trust.

## Vision

AREN should feel like an intelligent presence rather than a conventional AI application.

The core interaction hierarchy is:

VOICE
↓
STATE
↓
ORB
↓
CONTEXT
↓
CONTROL

## Product Principles

- Presence over interface
- Voice-first interaction
- Human and conversational behavior
- Honest capability reporting
- Verified actions instead of fabricated completion
- Calm premium visual language
- State-driven interaction
- Privacy and security by design
- Accessibility from the foundation

## Core Experience

The AREN Orb is the primary visual expression of the assistant.

The Orb communicates AREN's 12 canonical states:

- Idle
- Listening
- Hearing
- Thinking
- Planning
- Searching
- Executing
- Speaking
- Verifying
- Success
- Error
- Offline

The Orb is not simply a button. It is a state visualization system. It is
rendered natively with `@shopify/react-native-skia` as a dotted "thought-orb",
taking visual inspiration (concepts only) from the MIT-licensed
[thinking-orbs](https://github.com/Jakubantalik/thinking-orbs) project —
see [docs/ATTRIBUTIONS.md](docs/ATTRIBUTIONS.md).

## Technology Direction

AREN is Android-first. Phase 01 establishes the app shell and visual system on
a cross-platform Expo / React Native foundation:

- Expo (SDK 57)
- React Native (New Architecture)
- TypeScript (strict)
- Expo Router (file-based routing)
- React Native Reanimated (Orb motion / state cross-fades)
- React Native Gesture Handler (Orb voice-surface interaction)
- `@shopify/react-native-skia` (native dotted-orb rendering — bundled in Expo Go)
- Feature-based architecture with centralized design tokens

The voice runtime is kept behind an abstraction seam so the transport can
evolve independently of the UI:

- Gemini Live WebSocket for real-time voice interaction (Phase 02+)

> Note: earlier drafts referenced a native Kotlin / Jetpack Compose shell.
> The Phase 01 application shell is implemented with Expo / React Native as
> selected for this build; deeper native Android capabilities (device control,
> accessibility services) remain planned for later phases.

## Architecture

Gemini Live WebSocket
↓
Voice Runtime
↓
AREN Runtime State
↓
AREN State (React Context / hooks)
↓
AREN UI
↓
Orb + Voice + Context + Controls

The UI must remain independent from the Gemini implementation so the voice
runtime can evolve without rewriting the interface. In Phase 01 this seam is
the `VoiceRuntime` interface (`src/types/aren.ts`), backed by a local,
no-network implementation (`src/state/arenState/voiceRuntime.ts`).

## Design Language

Primary direction: Quiet Intelligence.

Visual characteristics:

- Near-black foundation
- Soft white typography
- Spectral blue/cyan/violet Orb
- Restrained atmospheric glow
- Generous negative space
- Minimal controls
- Human warmth without visual clutter

## Brand

Product name: AREN

Package: com.webwithroni.aren

The supplied AREN logo is the canonical brand reference.

The logo and Orb are separate systems: the logo identifies AREN; the Orb expresses AREN state.

## Development Phases

### Phase 01 — Foundation

- Android project bootstrap
- Design tokens
- Brand system
- Orb architecture
- Orb state system
- Home foundation
- Accessibility foundation
- Reduced motion
- Development state simulator

### Phase 02 — Gemini Live

- Gemini Live WebSocket
- Microphone pipeline
- Audio streaming
- Voice state synchronization
- Speaking/listening lifecycle

### Phase 03 — Conversation

- Conversation continuity
- History
- Memory foundation

### Phase 04 — Capabilities

- Device controls
- Applications
- Tools
- Permissions
- Capability verification

### Phase 05 — Agency

- Planning
- Multi-step execution
- Confirmation
- Recovery
- Verification

### Phase 06 — Trust

- Permission UX
- Privacy controls
- Audit history
- Action verification
- Failure recovery

### Phase 07 — Production

- Performance
- Security
- Reliability
- Testing
- Release hardening

## Repository Rules

- Never commit API keys.
- Never commit private credentials.
- Never claim an action completed without verification.
- Do not bypass capability or permission checks.
- Do not mix experimental UI with production runtime logic.
- Keep state, runtime, and UI layers separated.

## Current Status

Phase 01 — Implemented (Expo / React Native foundation).

See [docs/PHASE_01.md](docs/PHASE_01.md) for the full implementation report,
architecture, and how to run the app on Android.

## Getting Started

```bash
yarn install
yarn start        # Expo dev server (press "a" for Android)
# or
yarn android      # build & launch on a connected Android device/emulator
```

Project checks:

```bash
yarn typecheck    # tsc --noEmit
yarn lint         # eslint
```

## License

Private project. All rights reserved unless otherwise specified.
