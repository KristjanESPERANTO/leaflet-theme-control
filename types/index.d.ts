import * as L from "leaflet";

declare module "leaflet" {
  /**
   * Definition of a theme with its properties.
   */
  interface Theme {
    /**
     * The display label for the theme.
     */
    label: string;

    /**
     * CSS filter string to apply to map tiles and elements.
     * @example "invert(1) hue-rotate(180deg) saturate(0.6) brightness(0.5)"
     */
    filter: string;

    /**
     * Icon to display in the theme button (emoji or HTML).
     * @default "🎨"
     */
    icon?: string;

    /**
     * Style of the Leaflet controls for this theme.
     * @default "light"
     */
    controlStyle?: "light" | "dark";

    /**
     * CSS class to add to the document root when this theme is active.
     */
    className?: string;

    /**
     * Additional CSS selectors to apply the filter to.
     * Can be a single selector or an array of selectors.
     * @example ".my-custom-element"
     * @example [".element1", ".element2"]
     */
    applyToSelectors?: string | string[];
  }

  /**
   * Collection of themes keyed by their unique identifiers.
   */
  interface ThemeCollection {
    [themeKey: string]: Theme;
  }

  /**
   * Options for the ThemeControl.
   */
  interface ThemeControlOptions extends ControlOptions {
    /**
     * Collection of available themes.
     * If not provided, uses DEFAULT_THEMES (light, dark, grayscale, custom).
     */
    themes?: ThemeCollection;

    /**
     * The default theme to use on initial load.
     * @default "light"
     */
    defaultTheme?: string;

    /**
     * LocalStorage key for saving the selected theme.
     * @default "leaflet-theme"
     */
    storageKey?: string;

    /**
     * Automatically detect and use system dark mode preference.
     * @default true
     */
    detectSystemTheme?: boolean;

    /**
     * CSS selector for the elements to apply the theme filter to.
     * @default ".leaflet-tile-pane"
     */
    cssSelector?: string;

    /**
     * Add the theme toggle button to the map.
     * Set to false for programmatic control only.
     * @default true
     */
    addButton?: boolean;

    /**
     * Enable the theme editor UI for customizing themes.
     * @default false
     */
    enableEditor?: boolean;

    /**
     * Callback function called when the theme changes.
     * @param themeKey - The key of the newly selected theme
     * @param theme - The theme object
     */
    onChange?: (themeKey: string, theme: Theme) => void;

    /**
     * Custom function to get translated theme labels.
     * @param themeKey - The key of the theme
     * @returns The translated label
     */
    getLabel?: (themeKey: string) => string;

    /**
     * Custom function to get translated editor UI labels.
     * @param key - The label key (e.g., "selectTheme", "customize", "close")
     * @returns The translated label
     */
    getEditorLabels?: (key: string) => string;

    /**
     * Position of the theme editor panel.
     * @default "topright"
     */
    panelPosition?: "topright" | "topleft" | "bottomright" | "bottomleft";

    /**
     * Z-index for the theme editor panel.
     * @default 1000
     */
    panelZIndex?: number;
  }

  /**
   * Leaflet control for switching between visual themes.
   *
   * Supports multiple themes using CSS filters:
   * - Light (default)
   * - Dark (inverted colors)
   * - Grayscale (black & white)
   * - Custom themes via options
   *
   * @example
   * ```typescript
   * import { ThemeControl } from 'leaflet-theme-control';
   *
   * const themeControl = new ThemeControl({
   *   position: 'topright',
   *   defaultTheme: 'dark',
   *   enableEditor: true,
   *   onChange: (themeKey, theme) => {
   *     console.log('Theme changed to:', themeKey);
   *   }
   * }).addTo(map);
   * ```
   */
  class ThemeControl extends Control {
    options: ThemeControlOptions;

    /**
     * Creates a new ThemeControl instance.
     * @param options - Configuration options
     */
    constructor(options?: ThemeControlOptions);

    /**
     * Sets the active theme.
     * @param themeKey - The key of the theme to activate
     */
    setTheme(themeKey: string): void;

    /**
     * Gets the currently active theme key.
     * @returns The key of the current theme
     */
    getCurrentTheme(): string;

    /**
     * Gets all available themes.
     * @returns The theme collection
     */
    getThemes(): ThemeCollection;

    /**
     * Updates the button label text.
     * Useful for updating translations after a language change.
     * Called automatically when html[lang] attribute changes (since v0.1.0).
     */
    updateButtonLabel(): void;
  }
}

/**
 * Default theme presets included with the plugin.
 */
export const DEFAULT_THEMES: {
  light: L.Theme;
  dark: L.Theme;
  grayscale: L.Theme;
  custom: L.Theme;
};

/**
 * ThemeControl class for managing map themes.
 */
export { ThemeControl } from "leaflet";
