import type { VoiceRuntime, VoiceRuntimeEvents, VoiceRuntimeStatus } from '@/types/aren';

/**
 * Phase 01 local voice runtime.
 *
 * This is the concrete implementation behind the {@link VoiceRuntime} seam.
 * It performs NO network I/O and NEVER fabricates assistant responses. It only
 * models connection status so the UI can render an honest "connected" state.
 *
 * Phase 02 will introduce a GeminiLiveVoiceRuntime implementing the same
 * interface; the UI/state layer will not change.
 */
export class LocalVoiceRuntime implements VoiceRuntime {
  private _status: VoiceRuntimeStatus = 'disconnected';
  private events: VoiceRuntimeEvents = {};

  get status(): VoiceRuntimeStatus {
    return this._status;
  }

  private setStatus(next: VoiceRuntimeStatus) {
    this._status = next;
    this.events.onStatusChange?.(next);
  }

  setEvents(events: VoiceRuntimeEvents): void {
    this.events = events;
  }

  async connect(): Promise<void> {
    // Local runtime is immediately available — no transport to negotiate.
    this.setStatus('connected');
  }

  async disconnect(): Promise<void> {
    this.setStatus('disconnected');
  }

  startListening(): void {
    // No-op in Phase 01. Real audio capture arrives with Gemini Live (Phase 02).
  }

  stopListening(): void {
    // No-op in Phase 01.
  }
}
