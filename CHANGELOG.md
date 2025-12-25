# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
