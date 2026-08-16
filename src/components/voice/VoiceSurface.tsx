import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

import { Orb } from '@/components/orb';
import { TOUCH_TARGET_MIN } from '@/design';
import type { ArenState } from '@/types/aren';

interface VoiceSurfaceProps {
  state: ArenState;
  /** Screen-reader label describing AREN's current state. */
  accessibilityLabel: string;
  /** Toggle primary voice interaction (IDLE <-> LISTENING). */
  onToggle: () => void;
  size?: number;
}

/**
 * The Orb IS the voice interaction surface (no separate microphone button).
 * A tap toggles listening; the same action is exposed to screen readers via
 * onAccessibilityTap so it activates on double-tap.
 */
export function VoiceSurface({
  state,
  accessibilityLabel,
  onToggle,
  size = 240,
}: VoiceSurfaceProps) {
  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(onToggle)();
  });

  const isListening = state === 'LISTENING' || state === 'HEARING';

  return (
    <GestureDetector gesture={tap}>
      <View
        accessible
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Double tap to start or stop listening"
        accessibilityState={{ selected: isListening }}
        onAccessibilityTap={onToggle}
        style={styles.surface}
        testID="voice-surface"
      >
        <Orb state={state} size={size} />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  surface: {
    minWidth: TOUCH_TARGET_MIN,
    minHeight: TOUCH_TARGET_MIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
