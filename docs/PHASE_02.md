# AREN — Phase 02 Implementation Report

**Scope:** Voice runtime + Gemini Live architecture + real-time audio
foundation. The live Gemini connection is intentionally **deferred**; a
realistic **simulated** runtime drives the Orb in the meantime.

Status legend: **IMPLEMENTED** · **SIMULATED** · **NOT IMPLEMENTED** ·
**REQUIRES DEVICE TEST** · **DEFERRED**

---

## Architectural decisions

1. **The AREN state machine stays the single source of truth.** Voice runtimes
   are *event sources* only — they emit `onPhase` / `onStatusChange` /
   `onResponseComplete` / `onInterrupted` / `onError`, and `ArenStateProvider`
   decides what to render. No runtime keeps its own AREN state machine.
2. **The Expo client never holds a long-lived Gemini API key.** The secure flow
   is: AREN client → ephemeral token (from AREN backend) → Gemini Live
   WebSocket. The client only ever receives a short-lived token.
3. **Model:** `gemini-3.1-flash-live-preview` (the deprecated `2.0-flash-live`
   and `live-2.5-flash-preview` are not used).
4. **Live is disabled by a boolean master switch** (`LIVE_ENABLED = false`) so
   the exact wire protocol is documented and type-checked without connecting.
5. **Audio is architected, not captured.** Real PCM capture/playback is a native
   concern (dev build, Phase 04); interfaces + formats are defined now.

## New files

```
src/services/voice/
├── config.ts                  # model, endpoints, PCM formats, LIVE_ENABLED, wire builders
├── ephemeralToken.ts          # EphemeralTokenProvider seam (Null + Backend providers)
├── audio.ts                   # AudioCapture/Playback interfaces + Noop impls + chunk math
├── LocalEchoVoiceRuntime.ts   # SIMULATED realistic lifecycle runtime (default)
├── GeminiLiveVoiceRuntime.ts  # Gemini adapter — DISABLED skeleton
├── createVoiceRuntime.ts      # factory (env-selected)
└── index.ts                   # barrel
.env / .env.example            # EXPO_PUBLIC_VOICE_RUNTIME, EXPO_PUBLIC_API_BASE_URL (no secrets)
```

## Changed files

- `src/types/aren.ts` — expanded `VoiceRuntime` (sendAudio/sendText/interrupt/
  displayName), richer `VoiceRuntimeEvents`, `VoiceTranscript`, extended
  `VoiceRuntimeStatus` (+reconnecting/error).
- `src/state/arenState/ArenStateProvider.tsx` — uses `createVoiceRuntime()`;
  maps runtime events → AREN states; `toggleListening` delegates to the runtime;
  manual `setState` interrupts the runtime first; exposes `runtimeLabel`.
- `src/components/controls/ConnectionIndicator.tsx` — handles the two new statuses.
- `src/components/controls/StateSimulator.tsx` + `features/home/HomeScreen.tsx` —
  show the active runtime label (marks the simulated runtime clearly).
- Removed the Phase 01 `src/state/arenState/voiceRuntime.ts` (superseded).

## What is real vs simulated

| Capability | Status |
| --- | --- |
| VoiceRuntime interface + event model | **IMPLEMENTED** |
| Runtime → AREN state → Orb reaction | **IMPLEMENTED** (Orb reacts to real runtime events) |
| Local lifecycle (connect/listen/hear/think/speak/complete/interrupt/reconnect/disconnect/error) | **SIMULATED** (deterministic, no fabricated text) |
| Gemini Live wire protocol (URL, setup, realtimeInput, transcripts, turnComplete, goAway) | **IMPLEMENTED** as disabled skeleton |
| Gemini Live connection | **DEFERRED** (needs ephemeral-token backend) |
| Ephemeral-token client seam | **IMPLEMENTED** (Null/Backend providers; not called) |
| Real microphone capture / amplitude | **NOT IMPLEMENTED** — **REQUIRES DEVICE TEST** (native, Phase 04) |
| Real 24 kHz PCM playback | **NOT IMPLEMENTED** — **REQUIRES DEVICE TEST** (native, Phase 04) |

**No capability is faked.** The simulated runtime announces itself as
"AREN Local Runtime (simulated)"; the Gemini adapter reports itself disabled and
refuses to connect.

## Static validation (this build)

| Check | Result |
| --- | --- |
| `yarn typecheck` | ✅ 0 errors |
| `yarn lint` | ✅ 0 errors / 0 warnings |
| `expo export` (Android) | ✅ bundled (JSC; aarch64 host can't run x86_64 hermesc) |
| Logic checks (20 assertions) | ✅ lifecycle sequence + Gemini disabled + wire builders |

Logic check verified sequence: `LISTENING → HEARING → THINKING → SPEAKING →
IDLE`, barge-in returns to `LISTENING`, Gemini stays `disconnected` + emits a
clear disabled error, and the wire builders produce the v1alpha constrained URL,
`models/gemini-3.1-flash-live-preview`, `responseModalities:["AUDIO"]`, and
`audio/pcm;rate=16000`.

## Requires physical Android device testing

Nothing in Phase 02 requires a device *to function* (the simulated runtime runs
in Expo Go). Device testing here means confirming the **Orb reacts to the
simulated voice lifecycle** in Expo Go:

- [ ] App launches in Expo Go
- [ ] Tap Orb → status "Listening", Orb enters LISTENING
- [ ] Shortly after, Orb shows HEARING
- [ ] Tap Orb again → THINKING → SPEAKING → back to Ready (IDLE)
- [ ] Developer simulator shows "AREN Local Runtime (simulated)"
- [ ] All 12 states still selectable and animate
- [ ] Reduced-motion still renders a calm static Orb

Real microphone/audio and Gemini Live are **not** part of this gate.

## Deferred to later gates

- Backend ephemeral-token service (mints short-lived tokens; holds the Gemini key).
- Native audio pipeline (expo-audio / native module) — Phase 04 dev build.
- Enabling `LIVE_ENABLED` and end-to-end Gemini Live audio (device-tested).
