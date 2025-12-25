# Leaflet Theme Control

A Leaflet control for switching between visual themes using CSS filters. Perfect for adding dark mode, grayscale, and custom visual modes to your maps without requiring multiple tile layers.

![Leaflet Theme Control Screenshot](screenshot.png)

## Features

- 🌓 **Multiple themes**: Light, Dark, Grayscale, Custom
- ♿ **Accessibility**: Adaptable themes for better visibility
- 🎨 **CSS Filters**: No need for multiple tile sources
- 💾 **Persistent**: Saves user preference in localStorage
- 🔍 **System Detection**: Automatically detects OS dark mode preference
- 🌍 **i18n Ready**: Customizable labels via callback function
- 🪶 **Lightweight**: Zero dependencies (except Leaflet)
- ⚡ **Performance**: Instant theme switching without reloading tiles

## Installation

### As npm package (coming soon)

```bash
npm install leaflet-theme-control
```

**With bundler (Webpack, Vite, Rollup):**

```javascript
import { ThemeControl } from "leaflet-theme-control";
import "leaflet-theme-control/src/leaflet-theme-control.css";
```

**Without bundler (plain HTML):**

```html
<link rel="stylesheet" href="node_modules/leaflet-theme-control/src/leaflet-theme-control.css" />

<script type="importmap">
  {
    "imports": {
      "leaflet-theme-control": "./node_modules/leaflet-theme-control/src/leaflet-theme-control.js"
    }
  }
</script>

<script type="module">
  import { ThemeControl } from "leaflet-theme-control";
  // Your code here
</script>
```

**Or via CDN (coming soon):**

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet-theme-control/src/leaflet-theme-control.css" />

<script type="importmap">
  {
    "imports": {
      "leaflet-theme-control": "https://unpkg.com/leaflet-theme-control/src/leaflet-theme-control.js"
    }
  }
</script>

<script type="module">
  import { ThemeControl } from "leaflet-theme-control";
</script>
```

### As local module (development)

**HTML:**

```html
<link rel="stylesheet" href="./third-party/leaflet-theme-control/src/leaflet-theme-control.css" />
```

**JavaScript:**

```javascript
import { ThemeControl } from "./third-party/leaflet-theme-control/src/leaflet-theme-control.js";
```

## Usage

### Basic Example

```javascript
import L from "leaflet";
import { ThemeControl } from "leaflet-theme-control";

const map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

// Add theme control
new ThemeControl().addTo(map);
```

### With Custom Options

```javascript
new ThemeControl({
  position: "topright",
  defaultTheme: "light",
  detectSystemTheme: true,
  storageKey: "my-map-theme",

  // Custom label function for i18n
  getLabel: (themeKey) => {
    return i18n.t(`themes.${themeKey}`);
  },

  // Callback when theme changes
  onChange: (themeKey, theme) => {
    console.log(`Theme changed to: ${themeKey}`);
  }
}).addTo(map);
```

### Custom Themes

```javascript
import { ThemeControl } from "leaflet-theme-control";

new ThemeControl({
  themes: {
    light: {
      label: "Light Mode",
      filter: "",
      icon: "☀️",
      controlStyle: "light",
      className: "theme-light"
    },
    dark: {
      label: "Dark Mode",
      filter: "invert(1) hue-rotate(180deg) saturate(0.6) brightness(0.5)",
      icon: "🌙",
      controlStyle: "dark",
      className: "theme-dark",
      applyToSelectors: [".my-sidebar", ".my-header"] // Apply filter to these elements too
    },
    monochrome: {
      label: "Black & White",
      filter: "grayscale(1) contrast(1.2)",
      icon: "⚫",
      controlStyle: "light",
      className: "theme-mono",
      applyToSelectors: ".my-sidebar" // Single selector also works
    },
    custom: {
      label: "My Theme",
      filter: "invert(1) hue-rotate(180deg) saturate(1) brightness(1) contrast(1) sepia(0.5) grayscale(0.5)",
      icon: "🎨",
      controlStyle: "dark",
      className: "theme-custom",
      applyToSelectors: [".my-sidebar", ".my-footer"]
    }
  }
}).addTo(map);
```

**Theme Properties:**

- `filter`: CSS filter string (applied to map and `applyToSelectors`)
- `controlStyle`: `"light"` or `"dark"` for Leaflet controls styling
- `className`: CSS class added to `<html>` element (for custom styling)
- `applyToSelectors`: String or Array of CSS selectors to apply the same filter to

**Use Cases:**

- `applyToSelectors`: Apply the same dark mode filter to sidebar, header, footer etc.
- `className`: Style elements differently per theme with CSS

```css
/* Using className for custom styling */
.theme-dark .my-button {
  background: #2d2d2d;
  color: #e0e0e0;
}

/* Elements in applyToSelectors get the filter automatically */
.my-sidebar {
  background: white; /* Will be inverted in dark mode */
}
```

### Programmatic Control (No UI Button)

For advanced use cases where you want to control themes from your own UI:

```javascript
// Create control without visible button
const themeControl = new ThemeControl({
  addButton: false, // No UI button
  enableEditor: true, // Editor still available programmatically
  onChange: (theme) => {
    console.log("Theme changed:", theme);
  }
});

map.addControl(themeControl);

// Control themes programmatically
themeControl.setTheme("dark");
console.log(themeControl.getCurrentTheme()); // "dark"

// Open editor from custom button
myCustomButton.onclick = () => {
  themeControl.editor.open();
};
```

See [examples/api.html](examples/api.html) for a complete example.

## API

### Options

| Option              | Type     | Default                | Description                                                         |
| ------------------- | -------- | ---------------------- | ------------------------------------------------------------------- |
| `position`          | String   | `"topright"`           | Position of the control                                             |
| `themes`            | Object   | `DEFAULT_THEMES`       | Theme definitions                                                   |
| `defaultTheme`      | String   | `"light"`              | Initial theme                                                       |
| `storageKey`        | String   | `"leaflet-theme"`      | localStorage key                                                    |
| `detectSystemTheme` | Boolean  | `true`                 | Detect OS dark mode                                                 |
| `cssSelector`       | String   | `".leaflet-tile-pane"` | Elements to apply filter to                                         |
| `addButton`         | Boolean  | `true`                 | Add UI button to map (set to `false` for programmatic control only) |
| `enableEditor`      | Boolean  | `false`                | Enable theme editor UI with customization sliders                   |
| `onChange`          | Function | `null`                 | Callback on theme change: `(themeKey, theme) => {}`                 |
| `getLabel`          | Function | `null`                 | Function to get translated theme labels: `(themeKey) => string`     |
| `getEditorLabels`   | Function | `null`                 | Function to get translated editor UI labels: `(key) => string`      |

### Methods

| Method               | Returns  | Description              |
| -------------------- | -------- | ------------------------ |
| `setTheme(themeKey)` | `void`   | Switch to specific theme |
| `getCurrentTheme()`  | `String` | Get current theme key    |
| `getThemes()`        | `Object` | Get all available themes |

### Editor API (when `enableEditor: true`)

| Method                             | Returns | Description                    |
| ---------------------------------- | ------- | ------------------------------ |
| `editor.open()`                    | `void`  | Open theme selector panel      |
| `editor.openThemeEditor(themeKey)` | `void`  | Open editor for specific theme |
| `editor.close()`                   | `void`  | Close editor panel             |

## Built-in Themes

- **Light**: Default, no filter
- **Dark**: Inverted colors with adjusted hue, saturation, and brightness
- **Grayscale**: Black and white for printing or reduced distraction
- **Custom**: Fully customizable theme with combined filters (editable via theme editor)

## Browser Support

Works in all modern browsers that support CSS filters:

- Chrome/Edge 18+
- Firefox 35+
- Safari 9.1+

## License

MIT License. See [LICENSE](LICENSE.md) for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Credits

Originally developed for the [Veggiekarte](https://veggiekarte.de) project. But hopefully useful for others too!
