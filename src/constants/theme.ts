/**
 * Colori dell'app in modalità chiara e scura: toni caldi da forno,
 * con un accento color crosta.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#2B2118',
    background: '#FBF7F1',
    backgroundElement: '#F1E8DC',
    backgroundSelected: '#E6D6C2',
    textSecondary: '#7A6A5A',
    accent: '#B5651D',
    onAccent: '#FFFFFF',
    border: '#E2D4C2',
  },
  dark: {
    text: '#F5EDE3',
    background: '#17120E',
    backgroundElement: '#241C16',
    backgroundSelected: '#3A2D22',
    textSecondary: '#B9A894',
    accent: '#E09A52',
    onAccent: '#17120E',
    border: '#3A2D22',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: { sans: 'system-ui, sans-serif', serif: 'Georgia, serif', rounded: 'system-ui, sans-serif', mono: 'ui-monospace, monospace' },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
