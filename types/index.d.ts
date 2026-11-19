import { Control, type ControlOptions } from "leaflet";

/** A visual theme applied to map tiles and optional elements. */
export interface Theme {
  label: string;
  filter: string;
  icon?: string;
  controlStyle?: "light" | "dark";
  className?: string;
  applyToSelectors?: string | string[];
}

/** Theme definitions keyed by their unique identifiers. */
export interface ThemeCollection {
  [themeKey: string]: Theme;
}

/** Configuration options for the theme control. */
export interface ThemeControlOptions extends ControlOptions {
  themes?: ThemeCollection;
  defaultTheme?: string;
  storageKey?: string;
  detectSystemTheme?: boolean;
  cssSelector?: string;
  addButton?: boolean;
  enableEditor?: boolean;
  onChange?: (themeKey: string, theme: Theme) => void;
  getLabel?: (themeKey: string) => string;
  getEditorLabels?: (key: string) => string;
  panelPosition?: "topright" | "topleft" | "bottomright" | "bottomleft";
  panelZIndex?: number;
}

/** Theme editor UI. Available when `enableEditor` is true. */
export class ThemeEditor {
  openThemeSelector(): void;
  openThemeEditor(themeKey: string): void;
  close(): void;
  open(): void;
}

/** Leaflet control for switching map themes. */
export class ThemeControl extends Control<ThemeControlOptions> {
  editor?: ThemeEditor;

  constructor(options?: ThemeControlOptions);
  setTheme(themeKey: string, save?: boolean): void;
  getCurrentTheme(): string;
  getThemes(): ThemeCollection;
  updateButtonLabel(): void;
}

/** Default theme presets included with the plugin. */
export const DEFAULT_THEMES: {
  light: Theme;
  dark: Theme;
  grayscale: Theme;
  custom: Theme;
};
