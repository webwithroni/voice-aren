import type React from 'react';
import type Animated from 'react-native-reanimated';

/** The exact `style` prop type accepted by Reanimated's Animated.View. */
export type OrbLayerStyle = React.ComponentProps<typeof Animated.View>['style'];
