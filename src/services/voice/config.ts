/**
 * Gemini Live configuration + wire-format helpers.
 *
 * The live connection is intentionally DISABLED (`LIVE_ENABLED = false`) until a
 * secure backend that mints short-lived ephemeral tokens exists. The Expo client
 * must NEVER hold a long-lived Gemini API key — it only ever receives an
 * ephemeral token from the AREN backend. See docs/PHASE_02.md.
 */

/** Current Gemini Live realtime model. */
export const GEMINI_LIVE_MODEL = 'gemini-3.1-flash-live-preview';

/**
 * Master switch for the live Gemini connection. Typed as `boolean` (not a
 * literal) so the disabled skeleton below remains reachable/type-checked.
 */
export const LIVE_ENABLED: boolean = false;

/** Ephemeral-token WebSocket endpoint (v1alpha, constrained). */
export const LIVE_WS_BASE =
  'wss://generativelanguage.googleapis.com/ws/' +
  'google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained';

/** Live wire audio formats: mono signed 16-bit little-endian PCM. */
export const AUDIO_INPUT = { mimeType: 'audio/pcm;rate=16000', sampleRate: 16000 } as const;
export const AUDIO_OUTPUT = { sampleRate: 24000 } as const;

/** Public (non-secret) backend base URL that mints ephemeral tokens. */
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

/** Which voice runtime to use. Defaults to the local echo lifecycle. */
export type VoiceRuntimeKind = 'echo' | 'gemini';
export const VOICE_RUNTIME_KIND: VoiceRuntimeKind =
  process.env.EXPO_PUBLIC_VOICE_RUNTIME === 'gemini' ? 'gemini' : 'echo';

/** Build the ephemeral-token WebSocket URL. Token goes in `access_token`. */
export function buildLiveUrl(token: string): string {
  return `${LIVE_WS_BASE}?access_token=${encodeURIComponent(token)}`;
}

/** First message on a live socket must be `setup`. */
export function buildSetupMessage() {
  return {
    setup: {
      model: `models/${GEMINI_LIVE_MODEL}`,
      generationConfig: { responseModalities: ['AUDIO'] },
      inputAudioTranscription: {},
      outputAudioTranscription: {},
      realtimeInputConfig: { automaticActivityDetection: { disabled: false } },
      sessionResumption: {},
    },
  };
}

/** Wrap a base64 PCM16 mic frame for `realtimeInput`. */
export function buildRealtimeAudioMessage(pcm16Base64: string) {
  return {
    realtimeInput: {
      audio: { data: pcm16Base64, mimeType: AUDIO_INPUT.mimeType },
    },
  };
}
