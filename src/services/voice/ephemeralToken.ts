import { API_BASE_URL } from './config';

/**
 * Ephemeral-token seam. The client obtains a short-lived token from the AREN
 * backend (which alone holds the Gemini API key). The client never stores or
 * sees a long-lived key.
 */
export interface EphemeralToken {
  token: string;
  model: string;
  expiresAt: string;
}

export interface EphemeralTokenProvider {
  getToken(): Promise<EphemeralToken>;
}

/** Provider used until the backend exists — always refuses, loudly and safely. */
export class NullTokenProvider implements EphemeralTokenProvider {
  async getToken(): Promise<EphemeralToken> {
    throw new Error(
      'No ephemeral-token backend configured. Deploy the AREN token service and ' +
        'set EXPO_PUBLIC_API_BASE_URL before enabling Gemini Live.',
    );
  }
}

/**
 * Fetches an ephemeral token from `${API_BASE_URL}/api/live/token`. The backend
 * authenticates the app user and locks model/config server-side. Wired for the
 * future; not called while Live is disabled.
 */
export class BackendTokenProvider implements EphemeralTokenProvider {
  constructor(
    private readonly baseUrl: string = API_BASE_URL,
    private readonly getAuthToken: () => Promise<string | null> = async () => null,
  ) {}

  async getToken(): Promise<EphemeralToken> {
    if (!this.baseUrl) {
      throw new Error('EXPO_PUBLIC_API_BASE_URL is not set; cannot request an ephemeral token.');
    }
    const auth = await this.getAuthToken();
    const res = await fetch(`${this.baseUrl}/api/live/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
      },
    });
    if (!res.ok) {
      throw new Error(`Token service failed: ${res.status}`);
    }
    const json = (await res.json()) as { token: string; model: string; expires_at: string };
    return { token: json.token, model: json.model, expiresAt: json.expires_at };
  }
}
