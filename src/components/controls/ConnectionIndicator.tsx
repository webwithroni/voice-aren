import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/base/AppText';
import { colors, spacing } from '@/design';
import type { VoiceRuntimeStatus } from '@/types/aren';

interface ConnectionIndicatorProps {
  status: VoiceRuntimeStatus;
}

const STATUS_META: Record<VoiceRuntimeStatus, { label: string; color: string }> = {
  connected: { label: 'Connected', color: colors.semantic.live },
  connecting: { label: 'Connecting', color: colors.semantic.warning },
  disconnected: { label: 'Offline', color: colors.semantic.offline },
};

/**
 * Minimal top-of-screen connection state for the voice runtime.
 */
export function ConnectionIndicator({ status }: ConnectionIndicatorProps) {
  const meta = STATUS_META[status];
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Connection ${meta.label}`}
      style={styles.container}
      testID="connection-indicator"
    >
      <View style={[styles.dot, { backgroundColor: meta.color }]} accessibilityElementsHidden />
      <AppText variant="caption" color={colors.text.tertiary}>
        {meta.label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
