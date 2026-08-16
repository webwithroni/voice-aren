/**
 * Core AREN domain types shared across UI, state, and (future) voice runtime.
 */

/** The 12 canonical AREN presence states. Order is intentional (lifecycle). */
export const AREN_STATES = [
  'IDLE',
  'LISTENING',
  'HEARING',
  'THINKING',
  'PLANNING',
  'SEARCHING',
  'EXECUTING',
  'SPEAKING',
  'VERIFYING',
  'SUCCESS',
  'ERROR',
  'OFFLINE',
] as const;

export type ArenState = (typeof AREN_STATES)[number];

/** Presentation metadata for a given state. */
export interface ArenStateMeta {
  state: ArenState;
  /** Concise status label, e.g. "Listening". */
  label: string;
  /** Screen-reader announcement, e.g. "AREN is listening." */
  accessibilityLabel: string;
  /** Semantic accent color. Never the *only* signal for the state. */
  semanticColor: string;
  /** Transient states auto-return to IDLE after a short moment. */
  transient: boolean;
}

/* -------------------------------------------------------------------------- */
/* Voice runtime abstraction boundary (Phase 02+: Gemini Live).               */
/* The UI depends ONLY on this interface, never on a concrete implementation. */
/* -------------------------------------------------------------------------- */

export type VoiceRuntimeStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error';

/** A transcript turn surfaced by the runtime (consumed by Phase 03). */
export interface VoiceTranscript {
  role: 'user' | 'assistant';
  text: string;
  final: boolean;
}

/**
 * Events emitted by a VoiceRuntime. The runtime is an EVENT SOURCE only — it
 * must not own an AREN state machine. `onPhase` reports which canonical AREN
 * state the runtime believes it is in; the ArenStateProvider remains the single
 * source of truth and decides what to render.
 */
export interface VoiceRuntimeEvents {
  onStatusChange?: (status: VoiceRuntimeStatus) => void;
  onPhase?: (state: ArenState) => void;
  onTranscript?: (turn: VoiceTranscript) => void;
  onResponseComplete?: () => void;
  onInterrupted?: () => void;
  onError?: (error: Error) => void;
}

/**
 * The seam between AREN's UI/state layer and any voice transport (e.g. Gemini
 * Live WebSocket). Concrete adapters must not fabricate assistant responses and
 * must not maintain a second AREN state machine.
 */
export interface VoiceRuntime {
  readonly status: VoiceRuntimeStatus;
  /** Human-readable identity, e.g. "AREN Local Runtime (simulated)". */
  readonly displayName: string;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  startListening(): void;
  stopListening(): void;
  /** Stream a base64 PCM16 (16 kHz) microphone frame. */
  sendAudio(pcm16Base64: string): void;
  /** Send a text turn (seed/context or typed input). */
  sendText(text: string): void;
  /** Barge-in: stop the current response and return to listening. */
  interrupt(): void;
  setEvents(events: VoiceRuntimeEvents): void;
}
