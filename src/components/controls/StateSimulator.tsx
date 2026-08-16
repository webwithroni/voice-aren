import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/base/AppText';
import { Surface } from '@/components/base/Surface';
import { colors, radius, spacing, TOUCH_TARGET_MIN } from '@/design';
import { AREN_STATES, metaFor } from '@/state/arenState/stateMeta';
import type { ArenState } from '@/types/aren';

interface StateSimulatorProps {
  current: ArenState;
  onSelect: (state: ArenState) => void;
}

/**
 * Developer-only state controller. Lets the developer drive every AREN state
 * locally, without any voice runtime. Collapsed by default to keep the home
 * screen calm and Orb-dominant.
 */
export function StateSimulator({ current, onSelect }: StateSimulatorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Surface level="elevated" style={styles.container} testID="state-simulator">
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel="Developer state simulator"
        accessibilityHint="Double tap to show or hide the list of AREN states"
        onPress={() => setOpen((v) => !v)}
        style={styles.header}
        testID="simulator-toggle"
      >
        <AppText variant="caption" color={colors.text.tertiary}>
          DEVELOPER · STATE SIMULATOR
        </AppText>
        <AppText variant="caption" color={colors.text.secondary}>
          {open ? 'Hide' : `${metaFor(current).label}`}
        </AppText>
      </Pressable>

      {open ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {AREN_STATES.map((s) => {
            const active = s === current;
            return (
              <Pressable
                key={s}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`Set state ${metaFor(s).label}`}
                onPress={() => onSelect(s)}
                style={[styles.chip, active && styles.chipActive]}
                testID={`state-chip-${s}`}
              >
                <View style={[styles.chipDot, { backgroundColor: metaFor(s).semanticColor }]} />
                <AppText
                  variant="status"
                  color={active ? colors.text.primary : colors.text.tertiary}
                >
                  {s}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
  },
  header: {
    minHeight: TOUCH_TARGET_MIN,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chips: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
    paddingRight: spacing.base,
  },
  chip: {
    minHeight: TOUCH_TARGET_MIN,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.surface.interactive,
  },
  chipActive: {
    borderColor: colors.border.strong,
    backgroundColor: colors.surface.primary,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
