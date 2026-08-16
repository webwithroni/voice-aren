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

import type { ArenState, ArenStateMeta, VoiceRuntime, VoiceRuntimeStatus } from '@/types/aren';
import { metaFor } from './stateMeta';
import { LocalVoiceRuntime } from './voiceRuntime';

/** How long a transient state (e.g. SUCCESS) lingers before returning to IDLE. */
const TRANSIENT_DURATION_MS = 1600;

interface ArenStateValue {
  state: ArenState;
  meta: ArenStateMeta;
  connection: VoiceRuntimeStatus;
  /** Directly set a state (used by the developer state simulator). */
  setState: (next: ArenState) => void;
  /** Primary voice interaction: IDLE <-> LISTENING. */
  toggleListening: () => void;
}

const ArenStateContext = createContext<ArenStateValue | null>(null);

interface ProviderProps {
  children: React.ReactNode;
  /** Injectable runtime — defaults to the Phase 01 local runtime. */
  runtime?: VoiceRuntime;
  initialState?: ArenState;
}

export function ArenStateProvider({
  children,
  runtime,
  initialState = 'IDLE',
}: ProviderProps) {
  const runtimeRef = useRef<VoiceRuntime>(runtime ?? new LocalVoiceRuntime());
  const [state, setStateInternal] = useState<ArenState>(initialState);
  const [connection, setConnection] = useState<VoiceRuntimeStatus>('disconnected');
  const transientTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTransient = useCallback(() => {
    if (transientTimer.current) {
      clearTimeout(transientTimer.current);
      transientTimer.current = null;
    }
  }, []);

  const setState = useCallback(
    (next: ArenState) => {
      clearTransient();
      setStateInternal(next);

      const meta = metaFor(next);
      // Announce state changes for screen-reader users (not color-dependent).
      AccessibilityInfo.announceForAccessibility(meta.accessibilityLabel);

      if (meta.transient) {
        transientTimer.current = setTimeout(() => {
          setStateInternal('IDLE');
          transientTimer.current = null;
        }, TRANSIENT_DURATION_MS);
      }
    },
    [clearTransient],
  );

  const toggleListening = useCallback(() => {
    setState(state === 'LISTENING' ? 'IDLE' : 'LISTENING');
  }, [state, setState]);

  // Connect the runtime once on mount and mirror its status into React state.
  useEffect(() => {
    const rt = runtimeRef.current;
    rt.setEvents({ onStatusChange: setConnection });
    rt.connect();
    return () => {
      clearTransient();
      rt.disconnect();
    };
  }, [clearTransient]);

  const value = useMemo<ArenStateValue>(
    () => ({
      state,
      meta: metaFor(state),
      connection,
      setState,
      toggleListening,
    }),
    [state, connection, setState, toggleListening],
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
