# AREN Architecture

## System Boundary

AREN is divided into independent layers.

### Voice Runtime

Responsible for real-time voice transport and Gemini Live communication.

### Runtime State

Responsible for translating voice and agent events into authoritative AREN states.

### UI State

Responsible for presenting runtime state through StateFlow/ViewModel.

### Visual System

Responsible for Orb, status, controls, motion, accessibility, and visual tokens.

## Dependency Direction

UI → Runtime State → Voice Runtime

The UI must not directly depend on Gemini WebSocket implementation details.

### Phase 01 realization (Expo / React Native)

The dependency direction above is enforced in code:

- UI (`src/components`, `src/features`) depends on the AREN state layer only.
- State (`src/state/arenState`) exposes `ArenState` via React Context and holds
  a reference to a `VoiceRuntime` implementation — never to Gemini directly.
- `VoiceRuntime` (`src/types/aren.ts`) is the abstraction seam. Phase 01 ships
  `LocalVoiceRuntime` (no network, no fabricated responses). Phase 02 will add a
  `GeminiLiveVoiceRuntime` implementing the same interface with no UI changes.

## State Model

The 12 canonical AREN presence states (see `src/types/aren.ts`):

IDLE
LISTENING
HEARING
THINKING
PLANNING
SEARCHING
EXECUTING
SPEAKING
VERIFYING
SUCCESS
ERROR
OFFLINE

## Future Voice Pipeline

Microphone
↓
Audio Capture
↓
Gemini Live WebSocket
↓
Voice Runtime
↓
AREN Runtime Controller
↓
StateFlow
↓
Compose UI
↓
AREN Orb
