/**
 * AREN color tokens — "Quiet Intelligence" dark visual system.
 * Near-black foundations with restrained, spectral orb accents.
 * These are the single source of truth for every color used in the app.
 */
export const colors = {
  background: {
    primary: '#07080A',
    secondary: '#0D0F12',
  },
  surface: {
    primary: '#12151A',
    elevated: '#181B21',
    interactive: '#1E2229',
  },
  border: {
    subtle: '#252A32',
    strong: '#343A44',
  },
  text: {
    primary: '#F5F7FA',
    secondary: '#A8AFBA',
    tertiary: '#6F7784',
  },
  /** Semantic state colors — never used as the *only* signal for a state. */
  semantic: {
    live: '#7DD3FC',
    active: '#60A5FA',
    thinking: '#A78BFA',
    executing: '#818CF8',
    success: '#6EE7B7',
    warning: '#FBBF24',
    error: '#FB7185',
    offline: '#717985',
  },
  /** Orb identity colors. Controlled opacity only — no rainbow gradients. */
  orb: {
    core: '#F5F7FA',
    blue: '#60A5FA',
    cyan: '#67E8F9',
    violet: '#A78BFA',
    success: '#6EE7B7',
    error: '#FB7185',
  },
} as const;

export type Colors = typeof colors;
