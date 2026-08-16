/**
 * Core AREN domain types shared across UI, state, and (future) voice runtime.
 */

/** All AREN presence states. Order is intentional (lifecycle order). */
export const AREN_STATES = [
  'IDLE',
  'LISTENING',
  'HEARING',
  'THINKING',
  'PLANNING',
  'EXECUTING',
  'SPEAKING',
  'VERIFYING',
  'SUCCESS',
  'ERROR',
  'PAUSED',
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

export type VoiceRuntimeStatus = 'disconnected' | 'connecting' | 'connected';

export interface VoiceRuntimeEvents {
  /** Authoritative state changes originating from the runtime. */
  onStateChange?: (state: ArenState) => void;
  /** Connection lifecycle changes. */
  onStatusChange?: (status: VoiceRuntimeStatus) => void;
}

/**
 * The seam between AREN's UI/state layer and any future voice transport
 * (e.g. Gemini Live WebSocket). Phase 01 ships a local, no-network
 * implementation. No implementation may fabricate assistant responses.
 */
export interface VoiceRuntime {
  readonly status: VoiceRuntimeStatus;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  startListening(): void;
  stopListening(): void;
  setEvents(events: VoiceRuntimeEvents): void;
}
