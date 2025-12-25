/**
 * Built-in theme presets with CSS filters
 */
export const DEFAULT_THEMES = {
  light: {
    label: 'Light',
    filter: '',
    icon: '☀️',
    controlStyle: 'light',
    className: 'theme-light',
  },
  dark: {
    label: 'Dark',
    filter: 'invert(1) hue-rotate(180deg) saturate(0.6) brightness(0.5)',
    icon: '🌙',
    controlStyle: 'dark',
    className: 'theme-dark',
  },
  grayscale: {
    label: 'Grayscale',
    filter: 'grayscale(1)',
    icon: '⚫',
    controlStyle: 'light',
    className: 'theme-grayscale',
  },
  custom: {
    label: 'Custom',
    filter: 'invert(1) hue-rotate(180deg) saturate(1) brightness(1) contrast(1) sepia(0.5) grayscale(0.5)',
    icon: '🎨',
    controlStyle: 'dark',
    className: 'theme-custom',
  },
}
