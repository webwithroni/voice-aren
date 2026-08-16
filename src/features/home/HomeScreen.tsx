import React from 'react';
import { StyleSheet, View } from 'react-native';
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
 */
export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { state, meta, connection, setState, toggleListening } = useArenState();

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
          size={240}
        />
        <View style={styles.status}>
          <StatusLabel
            label={meta.label}
            color={meta.semanticColor}
            accessibilityLabel={meta.accessibilityLabel}
          />
        </View>
      </View>

      <View style={styles.bottom}>
        <StateSimulator current={state} onSelect={setState} />
      </View>
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
    gap: spacing.xl,
  },
  status: {
    minHeight: 40,
    alignItems: 'center',
  },
  bottom: {
    justifyContent: 'flex-end',
  },
});
