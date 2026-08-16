import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/base/AppText';
import { colors, spacing } from '@/design';

interface StatusLabelProps {
  label: string;
  color: string;
  /** Full screen-reader description, e.g. "AREN is listening." */
  accessibilityLabel: string;
  /** Optional supporting context line (max one extra line). */
  context?: string;
}

/**
 * Concise status readout below the Orb. A small state dot provides a secondary
 * (non-color-only) cue alongside the always-present text label.
 */
export function StatusLabel({ label, color, accessibilityLabel, context }: StatusLabelProps) {
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={context ? `${accessibilityLabel} ${context}` : accessibilityLabel}
      style={styles.container}
      testID="status-label"
    >
      <View style={styles.row}>
        <View
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={[styles.dot, { backgroundColor: color }]}
        />
        <AppText variant="status" color={colors.text.secondary} testID="status-label-text">
          {label}
        </AppText>
      </View>
      {context ? (
        <AppText
          variant="caption"
          color={colors.text.tertiary}
          numberOfLines={1}
          style={styles.context}
        >
          {context}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  context: {
    textAlign: 'center',
  },
});
