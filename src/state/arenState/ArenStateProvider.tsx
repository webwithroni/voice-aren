import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AccessibilityInfo } from 'react-native';

import { createVoiceRuntime } from '@/services/voice';
import type { ArenState, ArenStateMeta, VoiceRuntime, VoiceRuntimeStatus } from '@/types/aren';
import { metaFor } from './stateMeta';

/** How long a transient state (e.g. SUCCESS) lingers before returning to IDLE. */
const TRANSIENT_DURATION_MS = 1600;

interface ArenStateValue {
  state: ArenState;
  meta: ArenStateMeta;
  connection: VoiceRuntimeStatus;
  /** Identity of the active runtime (e.g. simulated vs Gemini). */
  runtimeLabel: string;
  /** Directly set a state (used by the developer state simulator). */
  setState: (next: ArenState) => void;
  /** Primary voice interaction: IDLE <-> LISTENING via the runtime. */
  toggleListening: () => void;
}

const ArenStateContext = createContext<ArenStateValue | null>(null);

interface ProviderProps {
  children: React.ReactNode;
  /** Injectable runtime — defaults to the selected runtime (local echo). */
  runtime?: VoiceRuntime;
  initialState?: ArenState;
}

export function ArenStateProvider({ children, runtime, initialState = 'IDLE' }: ProviderProps) {
  const [rt] = useState<VoiceRuntime>(() => runtime ?? createVoiceRuntime());
  const [state, setStateInternal] = useState<ArenState>(initialState);
  const [connection, setConnection] = useState<VoiceRuntimeStatus>('disconnected');
  const transientTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef<ArenState>(initialState);

  const clearTransient = useCallback(() => {
    if (transientTimer.current) {
      clearTimeout(transientTimer.current);
      transientTimer.current = null;
    }
  }, []);

  // The provider is the single source of truth: apply a state, announce it for
  // screen readers, and schedule the return to IDLE for transient states.
  const applyState = useCallback(
    (next: ArenState) => {
      clearTransient();
      stateRef.current = next;
      setStateInternal(next);
      const meta = metaFor(next);
      AccessibilityInfo.announceForAccessibility(meta.accessibilityLabel);
      if (meta.transient) {
        transientTimer.current = setTimeout(() => {
          stateRef.current = 'IDLE';
          setStateInternal('IDLE');
          transientTimer.current = null;
        }, TRANSIENT_DURATION_MS);
      }
    },
    [clearTransient],
  );

  // Developer-simulator / manual override: interrupt any in-flight runtime
  // lifecycle, then force the requested state.
  const setState = useCallback(
    (next: ArenState) => {
      rt.interrupt();
      applyState(next);
    },
    [applyState, rt],
  );

  const toggleListening = useCallback(() => {
    if (stateRef.current === 'LISTENING' || stateRef.current === 'HEARING') {
      rt.stopListening();
    } else {
      rt.startListening();
    }
  }, [rt]);

  // Wire runtime events into the provider once, and connect.
  useEffect(() => {
    rt.setEvents({
      onStatusChange: setConnection,
      onPhase: applyState,
      onResponseComplete: () => applyState('IDLE'),
      onInterrupted: () => applyState('LISTENING'),
      onError: () => setConnection('error'),
    });
    rt.connect();
    return () => {
      clearTransient();
      rt.disconnect();
    };
  }, [rt, applyState, clearTransient]);

  const value = useMemo<ArenStateValue>(
    () => ({
      state,
      meta: metaFor(state),
      connection,
      runtimeLabel: rt.displayName,
      setState,
      toggleListening,
    }),
    [state, connection, rt, setState, toggleListening],
  );

  return <ArenStateContext.Provider value={value}>{children}</ArenStateContext.Provider>;
}

export function useArenState(): ArenStateValue {
  const ctx = useContext(ArenStateContext);
  if (!ctx) {
    throw new Error('useArenState must be used within an ArenStateProvider');
  }
  return ctx;
}
