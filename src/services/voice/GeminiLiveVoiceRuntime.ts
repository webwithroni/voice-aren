import type {
  VoiceRuntime,
  VoiceRuntimeEvents,
  VoiceRuntimeStatus,
} from '@/types/aren';
import {
  buildLiveUrl,
  buildRealtimeAudioMessage,
  buildSetupMessage,
  GEMINI_LIVE_MODEL,
  LIVE_ENABLED,
} from './config';
import { NullTokenProvider, type EphemeralTokenProvider } from './ephemeralToken';

/**
 * Gemini Live voice runtime (architecture only — connection DISABLED).
 *
 * Built around `gemini-3.1-flash-live-preview` and the secure flow:
 *   AREN client → ephemeral token (from AREN backend) → Gemini Live WebSocket.
 * The client never holds a long-lived Gemini API key. `connect()` refuses while
 * `LIVE_ENABLED` is false; the connected code path exists to document the exact
 * wire protocol and will be activated once the token backend is deployed and
 * tested on a real device.
 *
 * This adapter is an event source only — it does not own an AREN state machine.
 */
export class GeminiLiveVoiceRuntime implements VoiceRuntime {
  readonly displayName = `Gemini Live (${GEMINI_LIVE_MODEL}) — disabled`;

  private _status: VoiceRuntimeStatus = 'disconnected';
  private events: VoiceRuntimeEvents = {};
  private ws: WebSocket | null = null;

  constructor(private readonly tokens: EphemeralTokenProvider = new NullTokenProvider()) {}

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

  async connect(): Promise<void> {
    if (!LIVE_ENABLED) {
      this.setStatus('disconnected');
      this.events.onError?.(
        new Error(
          'Gemini Live is disabled until the secure ephemeral-token backend is deployed. ' +
            'The Expo client will never hold a long-lived Gemini API key.',
        ),
      );
      return;
    }

    // --- Activated only when LIVE_ENABLED === true (post-backend, device-tested). ---
    this.setStatus('connecting');
    const { token } = await this.tokens.getToken();
    const ws = new WebSocket(buildLiveUrl(token));
    this.ws = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify(buildSetupMessage()));
      this.setStatus('connected');
    };
    ws.onerror = () => {
      this.setStatus('error');
      this.events.onError?.(new Error('Gemini Live socket error'));
    };
    ws.onclose = () => this.setStatus('disconnected');
    ws.onmessage = (event) => this.handleMessage(event.data as string);
  }

  private handleMessage(raw: string) {
    const msg = JSON.parse(raw);
    const server = msg.serverContent;
    if (server?.inputTranscription?.text) {
      this.events.onTranscript?.({ role: 'user', text: server.inputTranscription.text, final: false });
    }
    if (server?.outputTranscription?.text) {
      this.events.onTranscript?.({
        role: 'assistant',
        text: server.outputTranscription.text,
        final: false,
      });
    }
    const parts = server?.modelTurn?.parts ?? [];
    for (const part of parts) {
      if (part.inlineData?.mimeType?.startsWith('audio/pcm')) {
        this.events.onPhase?.('SPEAKING');
        // TODO(Phase 04 native): decode base64 PCM → AudioPlaybackSink (24 kHz).
      }
    }
    if (server?.interrupted) this.events.onInterrupted?.();
    if (server?.turnComplete) this.events.onResponseComplete?.();
    if (msg.goAway) this.setStatus('reconnecting');
    // TODO: track sessionResumptionUpdate handles for reconnect continuity.
  }

  startListening(): void {
    this.events.onPhase?.('LISTENING');
    // Automatic activity detection handles turn boundaries; audio flows via sendAudio().
  }

  stopListening(): void {
    // With automatic VAD there is no explicit stop; kept for interface parity.
  }

  sendAudio(pcm16Base64: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(buildRealtimeAudioMessage(pcm16Base64)));
    }
  }

  sendText(text: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          clientContent: {
            turns: [{ role: 'user', parts: [{ text }] }],
            turnComplete: true,
          },
        }),
      );
    }
  }

  interrupt(): void {
    // Gemini performs server-side barge-in on new input; reflect it locally.
    this.events.onInterrupted?.();
    this.events.onPhase?.('LISTENING');
  }

  async disconnect(): Promise<void> {
    this.ws?.close();
    this.ws = null;
    this.setStatus('disconnected');
  }
}
