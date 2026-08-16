# AREN Roadmap

## Phase 01 — Foundation

Status: IMPLEMENTED

- [x] Project bootstrap (Expo / React Native / TypeScript / Expo Router)
- [x] Brand identity (logo reference in `assets/brand/`)
- [x] Design system (colors, typography, spacing, radius, motion tokens)
- [x] Orb (layered, animated, single visual identity)
- [x] State architecture (`ArenState` + `VoiceRuntime` abstraction seam)
- [x] Home screen
- [x] Accessibility (scalable text, semantic labels, reduced-motion, announcements)
- [x] Development state simulator

## Phase 02 — Gemini Live (voice runtime + audio foundation)

Status: IMPLEMENTED (architecture) · SIMULATED (runtime) · Gemini connection DEFERRED

- [x] Full `VoiceRuntime` interface (connect/disconnect/start/stop/sendAudio/
      sendText/interrupt + lifecycle events)
- [x] `LocalEchoVoiceRuntime` — realistic simulated lifecycle (drives the Orb)
- [x] `GeminiLiveVoiceRuntime` — architecture around `gemini-3.1-flash-live-preview`,
      ephemeral-token seam, **connection disabled** (no key in client)
- [x] Real-time audio architecture (PCM 16 kHz in / 24 kHz out, chunk sizing,
      capture/playback interfaces)
- [ ] Live Gemini WebSocket connection — DEFERRED (needs secure token backend)
- [ ] Native microphone capture + audio playback — REQUIRES device/dev build
- [ ] Connection recovery / session resumption — architected, not activated

See [docs/PHASE_02.md](PHASE_02.md).

## Phase 03 — Conversation

Status: PLANNED

- Conversation state
- History
- Context continuity
- Memory foundation

## Phase 04 — Capabilities

Status: PLANNED

- Android capabilities
- App interactions
- Device controls
- Permissions
- Verification

## Phase 05 — Agent

Status: PLANNED

- Planning
- Tool selection
- Multi-step actions
- Confirmation
- Recovery

## Phase 06 — Trust

Status: PLANNED

- Privacy
- Permissions
- Auditability
- Verified completion

## Phase 07 — Production

Status: PLANNED

- Testing
- Security
- Performance
- Reliability
- Release
