import type { VoiceRuntime } from '@/types/aren';
import { VOICE_RUNTIME_KIND } from './config';
import { GeminiLiveVoiceRuntime } from './GeminiLiveVoiceRuntime';
import { LocalEchoVoiceRuntime } from './LocalEchoVoiceRuntime';

/**
 * Selects the active voice runtime.
 *
 * Default: the simulated local runtime (Expo Go friendly). Set
 * EXPO_PUBLIC_VOICE_RUNTIME=gemini to select the Gemini adapter — which stays
 * disconnected until the ephemeral-token backend exists.
 */
export function createVoiceRuntime(): VoiceRuntime {
  if (VOICE_RUNTIME_KIND === 'gemini') {
    return new GeminiLiveVoiceRuntime();
  }
  return new LocalEchoVoiceRuntime();
}
