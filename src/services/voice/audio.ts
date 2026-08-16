import { AUDIO_INPUT, AUDIO_OUTPUT } from './config';

/**
 * Real-time audio architecture (foundation only).
 *
 * These interfaces define the seam for native microphone capture and PCM
 * playback. Real implementations require a native Android development build
 * (Phase 04) — see docs/PHASE_02.md. No audio is captured or played here.
 *
 * Wire format (Gemini Live): input = mono signed 16-bit little-endian PCM at
 * 16 kHz; output = 16-bit little-endian PCM at 24 kHz.
 */

/** Recommended realtime chunk: 20 ms of 16 kHz PCM16 = 320 samples = 640 bytes. */
export const INPUT_CHUNK_MS = 20;
export const INPUT_CHUNK_BYTES = (AUDIO_INPUT.sampleRate * 2 * INPUT_CHUNK_MS) / 1000;
export const OUTPUT_SAMPLE_RATE = AUDIO_OUTPUT.sampleRate;

/** Emits base64 PCM16 mic frames + a 0..1 amplitude for the Orb. */
export interface AudioCaptureSource {
  start(): Promise<void>;
  stop(): Promise<void>;
  onFrame(cb: (pcm16Base64: string) => void): void;
  /** Real input amplitude (0..1) — drives LISTENING/HEARING when available. */
  onAmplitude(cb: (level: number) => void): void;
}

/** Plays 24 kHz PCM16 audio streamed from the runtime. */
export interface AudioPlaybackSink {
  enqueue(pcm16Base64: string): void;
  flush(): void;
  stop(): void;
}

/** No-op capture used until native audio exists. Never fakes amplitude. */
export class NoopAudioCapture implements AudioCaptureSource {
  async start(): Promise<void> {}
  async stop(): Promise<void> {}
  onFrame(): void {}
  onAmplitude(): void {}
}

/** No-op playback used until native audio exists. */
export class NoopAudioPlayback implements AudioPlaybackSink {
  enqueue(): void {}
  flush(): void {}
  stop(): void {}
}
