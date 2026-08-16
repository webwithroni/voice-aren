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

The Orb communicates:

- Listening
- Hearing
- Thinking
- Planning
- Executing
- Speaking
- Verifying
- Success
- Error
- Paused
- Offline
- Backup

The Orb is not simply a button. It is a state visualization system.

## Technology Direction

- Android
- Kotlin
- Jetpack Compose
- Material 3 foundation with a custom AREN visual system
- Kotlin Coroutines
- StateFlow
- ViewModel architecture
- Gemini Live WebSocket for real-time voice interaction

## Architecture

Gemini Live WebSocket
↓
Voice Runtime
↓
AREN Runtime State
↓
StateFlow / ViewModel
↓
AREN UI
↓
Orb + Voice + Context + Controls

The UI must remain independent from the Gemini implementation so the voice runtime can evolve without rewriting the interface.

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

Phase 01 — Preparing

## License

Private project. All rights reserved unless otherwise specified.
