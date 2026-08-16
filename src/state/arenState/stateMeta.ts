import { colors } from '@/design';
import { AREN_STATES, type ArenState, type ArenStateMeta } from '@/types/aren';

/**
 * Single source of truth mapping each AREN state to its presentation metadata:
 * concise label, screen-reader announcement, semantic accent, and whether the
 * state is transient (auto-returns to IDLE).
 */
export const STATE_META: Record<ArenState, ArenStateMeta> = {
  IDLE: {
    state: 'IDLE',
    label: 'Ready',
    accessibilityLabel: 'AREN is ready.',
    semanticColor: colors.semantic.active,
    transient: false,
  },
  LISTENING: {
    state: 'LISTENING',
    label: 'Listening',
    accessibilityLabel: 'AREN is listening.',
    semanticColor: colors.semantic.live,
    transient: false,
  },
  HEARING: {
    state: 'HEARING',
    label: 'Hearing',
    accessibilityLabel: 'AREN is hearing you.',
    semanticColor: colors.semantic.live,
    transient: false,
  },
  THINKING: {
    state: 'THINKING',
    label: 'Thinking',
    accessibilityLabel: 'AREN is thinking.',
    semanticColor: colors.semantic.thinking,
    transient: false,
  },
  PLANNING: {
    state: 'PLANNING',
    label: 'Planning',
    accessibilityLabel: 'AREN is planning.',
    semanticColor: colors.semantic.executing,
    transient: false,
  },
  EXECUTING: {
    state: 'EXECUTING',
    label: 'Working',
    accessibilityLabel: 'AREN is working.',
    semanticColor: colors.semantic.executing,
    transient: false,
  },
  SPEAKING: {
    state: 'SPEAKING',
    label: 'Speaking',
    accessibilityLabel: 'AREN is speaking.',
    semanticColor: colors.semantic.active,
    transient: false,
  },
  VERIFYING: {
    state: 'VERIFYING',
    label: 'Checking',
    accessibilityLabel: 'AREN is checking.',
    semanticColor: colors.orb.cyan,
    transient: false,
  },
  SUCCESS: {
    state: 'SUCCESS',
    label: 'Done',
    accessibilityLabel: 'AREN finished.',
    semanticColor: colors.semantic.success,
    transient: true,
  },
  ERROR: {
    state: 'ERROR',
    label: 'Something went wrong',
    accessibilityLabel: 'AREN ran into a problem.',
    semanticColor: colors.semantic.error,
    transient: false,
  },
  PAUSED: {
    state: 'PAUSED',
    label: 'Paused',
    accessibilityLabel: 'AREN is paused.',
    semanticColor: colors.semantic.warning,
    transient: false,
  },
  OFFLINE: {
    state: 'OFFLINE',
    label: 'Offline',
    accessibilityLabel: 'AREN is offline.',
    semanticColor: colors.semantic.offline,
    transient: false,
  },
};

export function metaFor(state: ArenState): ArenStateMeta {
  return STATE_META[state];
}

export { AREN_STATES };
