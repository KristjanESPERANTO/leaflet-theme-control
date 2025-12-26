# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.1.2](https://github.com/kristjanesperanto/leaflet-theme-control/compare/v0.1.1...v0.1.2) (2025-12-26)

### Documentation

- update installation section (npm package is published) ([8fd83c7](https://github.com/kristjanesperanto/leaflet-theme-control/commit/8fd83c7aaaf1f86b08010ad93a605d883485dc28))

### Chores

- **examples:** improve info-box readability in dark mode ([e147b67](https://github.com/kristjanesperanto/leaflet-theme-control/commit/e147b673b462b81da4625c0aba2f523bafe9a4bd))

## [0.1.1](https://github.com/kristjanesperanto/leaflet-theme-control/compare/v0.1.0...v0.1.1) (2025-12-26)

### Chores

- update homepage URL to point to GitHub Pages ([65c24ce](https://github.com/kristjanesperanto/leaflet-theme-control/commit/65c24ce0a968a41d73f864848785a6fcf595aa98))
- update TypeScript types and homepage URL ([fd5b32b](https://github.com/kristjanesperanto/leaflet-theme-control/commit/fd5b32bdc0d0fabd108dc49828a7e6c2811aa964))

## [0.1.0](https://github.com/kristjanesperanto/leaflet-theme-control/compare/v0.0.5...v0.1.0) (2025-12-26)

### Features

- auto-update button label on language change ([edc98d3](https://github.com/kristjanesperanto/leaflet-theme-control/commit/edc98d3186888965e151a82331e5ea5d1afdcfda))

## [0.0.5](https://github.com/kristjanesperanto/leaflet-theme-control/compare/v0.0.4...v0.0.5) (2025-12-26)

### Features

- support i18n for button aria-label and title ([c2bd797](https://github.com/kristjanesperanto/leaflet-theme-control/commit/c2bd7975cddcfa7bc441a6ececf6d45bbd2fe375))

## [0.0.4](https://github.com/kristjanesperanto/leaflet-theme-control/compare/v0.0.3...v0.0.4) (2025-12-26)

### Bug Fixes

- only show edit button for the active theme ([17b65f8](https://github.com/kristjanesperanto/leaflet-theme-control/commit/17b65f818be8ce50f91ad9ee53f660ed4d0fdddb))

## [0.0.3](https://github.com/kristjanesperanto/leaflet-theme-control/compare/v0.0.2...v0.0.3) (2025-12-26)

### Bug Fixes

- reset button now properly restores default theme values ([e04c83d](https://github.com/kristjanesperanto/leaflet-theme-control/commit/e04c83d70befeb1ca8863173bb8544b2b4e10e43))

## [0.0.2](https://github.com/kristjanesperanto/leaflet-theme-control/compare/v0.0.1...v0.0.2) (2025-12-25)

### Features

- add panelPosition and panelZIndex options ([cabb053](https://github.com/kristjanesperanto/leaflet-theme-control/commit/cabb053526bf81b9a3979086e706e1fbccfdf6fe))
- comprehensive editor improvements ([380e982](https://github.com/kristjanesperanto/leaflet-theme-control/commit/380e9822c772225f506fe9f75d61b25c839a53b2))
- enhance mobile UX and CSS integration ([2c31288](https://github.com/kristjanesperanto/leaflet-theme-control/commit/2c31288f95a2e5fb90375eae92a440b70b9eeb10))

### Documentation

- update README with new options and improvements ([62efc73](https://github.com/kristjanesperanto/leaflet-theme-control/commit/62efc73be551131754343b25d0fd304ea077da55))

### Chores

- add .versionrc.json for versioning configuration ([799689c](https://github.com/kristjanesperanto/leaflet-theme-control/commit/799689cb02ec7f2a42a88f0c52ec43c029e1134f))

## [0.0.1] - 2024-12-25

### Initial Release

First public release of Leaflet Theme Control - a Leaflet control for switching between visual themes using CSS filters.

#### Features

- **Multiple Built-in Themes**: Light, Dark, Grayscale, and Custom themes out of the box
- **CSS Filter-based**: No need for multiple tile sources - themes use CSS filters on existing tiles
- **Persistent Storage**: Saves user theme preference in localStorage
- **System Theme Detection**: Automatically detects OS dark mode preference via `prefers-color-scheme`
- **Live Theme Switching**: Instant theme changes without reloading map tiles
- **Theme Editor**: Optional UI for customizing themes with visual sliders (filters: invert, hue-rotate, saturate, brightness, contrast, sepia, grayscale)
- **Accessibility**: ARIA labels, keyboard navigation, role="radiogroup" for theme selection
- **i18n Ready**: Customizable labels via `getLabel` and `getEditorLabels` callback functions
- **TypeScript Definitions**: Full type definitions in `types/index.d.ts`
- **CSS Custom Properties**: 60+ CSS variables (`--ltc-*`) for easy visual customization
- **Programmatic API**: Use without UI button for custom integrations
- **ES6 Modules**: Modern ES6 module with named exports (`ThemeControl`, `ThemeEditor`, `DEFAULT_THEMES`)

#### Requirements

- **Leaflet** ≥2.0.0-alpha.1 (Leaflet v2 only, does not support Leaflet v1.x)

#### API

**Options:**

- `position`: Control position (default: `"topright"`)
- `themes`: Theme definitions (default: `DEFAULT_THEMES`)
- `defaultTheme`: Initial theme key (default: `"light"`)
- `storageKey`: localStorage key (default: `"leaflet-theme"`)
- `detectSystemTheme`: Detect OS dark mode (default: `true`)
- `cssSelector`: Elements to apply filter to (default: `".leaflet-tile-pane"`)
- `addButton`: Add UI button to map (default: `true`)
- `enableEditor`: Enable theme editor UI (default: `false`)
- `onChange`: Callback when theme changes: `(themeKey, theme) => {}`
- `getLabel`: Function for translated theme labels: `(themeKey) => string`
- `getEditorLabels`: Function for translated editor UI labels: `(key) => string`

**Methods:**

- `setTheme(themeKey)`: Switch to specific theme
- `getCurrentTheme()`: Get current theme key
- `getThemes()`: Get all available themes

**Editor Methods (when `enableEditor: true`):**

- `editor.open()`: Open theme selector panel
- `editor.openThemeEditor(themeKey)`: Open editor for specific theme
- `editor.close()`: Close editor panel

#### Credits

Originally developed for the [Veggiekarte](https://veggiekarte.de) project.

[0.0.1]: https://github.com/kristjanesperanto/leaflet-theme-control/releases/tag/v0.0.1
