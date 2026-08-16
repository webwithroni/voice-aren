import type {
  ArenState,
  VoiceRuntime,
  VoiceRuntimeEvents,
  VoiceRuntimeStatus,
} from '@/types/aren';

/**
 * Local development voice runtime.
 *
 * Clearly identifies itself as SIMULATED. It does NOT pretend to be Gemini and
 * produces NO fabricated assistant text. It exercises the real lifecycle —
 * connect, listen, hear, think, speak, response-complete, interrupt (barge-in),
 * disconnect, error — and reports phases so the AREN state machine (and the
 * Orb) react to genuine runtime events rather than hard-coded animation.
 */
export class LocalEchoVoiceRuntime implements VoiceRuntime {
  readonly displayName = 'AREN Local Runtime (simulated)';

  private _status: VoiceRuntimeStatus = 'disconnected';
  private events: VoiceRuntimeEvents = {};
  private timers: ReturnType<typeof setTimeout>[] = [];

  get status(): VoiceRuntimeStatus {
    return this._status;
  }

  setEvents(events: VoiceRuntimeEvents): void {
    this.events = events;
  }

  private setStatus(next: VoiceRuntimeStatus) {
    this._status = next;
    this.events.onStatusChange?.(next);
  }

  private phase(state: ArenState) {
    this.events.onPhase?.(state);
  }

  private clearTimers() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }

  private after(ms: number, fn: () => void) {
    this.timers.push(setTimeout(fn, ms));
  }

  async connect(): Promise<void> {
    this.setStatus('connecting');
    this.after(220, () => this.setStatus('connected'));
  }

  async disconnect(): Promise<void> {
    this.clearTimers();
    this.setStatus('disconnected');
  }

  startListening(): void {
    this.clearTimers();
    this.phase('LISTENING');
    // Simulate speech being detected shortly after listening begins.
    this.after(600, () => this.phase('HEARING'));
  }

  stopListening(): void {
    this.runProcessingTurn();
  }

  sendText(_text: string): void {
    // A typed turn also drives the processing lifecycle (no fabricated reply).
    this.runProcessingTurn();
  }

  sendAudio(_pcm16Base64: string): void {
    // No native audio in the simulated runtime; real capture arrives in Phase 04.
  }

  interrupt(): void {
    // Barge-in: stop whatever is happening and return to listening.
    this.clearTimers();
    this.events.onInterrupted?.();
    this.phase('LISTENING');
  }

  /** Deterministic local lifecycle: think → speak → response complete → idle. */
  private runProcessingTurn() {
    this.clearTimers();
    this.phase('THINKING');
    this.after(700, () => this.phase('SPEAKING'));
    this.after(1900, () => {
      this.events.onResponseComplete?.();
      this.phase('IDLE');
    });
  }
}
