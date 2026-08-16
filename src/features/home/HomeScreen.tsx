import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConnectionIndicator } from '@/components/controls/ConnectionIndicator';
import { StateSimulator } from '@/components/controls/StateSimulator';
import { StatusLabel } from '@/components/status/StatusLabel';
import { VoiceSurface } from '@/components/voice/VoiceSurface';
import { colors, spacing } from '@/design';
import { useArenState } from '@/hooks';

/**
 * AREN home — deliberately minimal. The Orb dominates; everything else is a
 * quiet supporting cue. Hierarchy: connection → Orb → status → controls.
 *
 * The developer state simulator is gated to development builds only, so it is
 * never part of the consumer interface.
 */
export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { state, meta, connection, setState, toggleListening } = useArenState();

  const orbSize = Math.min(width * 0.82, height * 0.42, 340);

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.base },
      ]}
      testID="home-screen"
    >
      <View style={styles.top}>
        <ConnectionIndicator status={connection} />
      </View>

      <View style={styles.center}>
        <VoiceSurface
          state={state}
          accessibilityLabel={meta.accessibilityLabel}
          onToggle={toggleListening}
          size={orbSize}
        />
        <View style={styles.status}>
          <StatusLabel
            label={meta.label}
            color={meta.semanticColor}
            accessibilityLabel={meta.accessibilityLabel}
          />
        </View>
      </View>

      {__DEV__ ? (
        <View style={styles.bottom}>
          <StateSimulator current={state} onSelect={setState} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.lg,
  },
  top: {
    alignItems: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2xl'],
  },
  status: {
    minHeight: 44,
    alignItems: 'center',
  },
  bottom: {
    justifyContent: 'flex-end',
  },
});
