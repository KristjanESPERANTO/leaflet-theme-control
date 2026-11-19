import { Map } from "leaflet";
import { DEFAULT_THEMES, ThemeControl, type Theme, type ThemeCollection, type ThemeControlOptions } from "leaflet-theme-control";

const themes: ThemeCollection = {
  night: {
    label: "Night",
    filter: "invert(1)",
    controlStyle: "dark"
  }
};

const options: ThemeControlOptions = {
  position: "bottomright",
  themes,
  defaultTheme: "night",
  enableEditor: true,
  onChange: (themeKey, theme) => {
    const key: string = themeKey;
    const selectedTheme: Theme = theme;
    console.log(key, selectedTheme);
  }
};

const map = new Map(document.createElement("div"));
const control = new ThemeControl(options).addTo(map);
const currentTheme: string = control.getCurrentTheme();
const availableThemes: ThemeCollection = control.getThemes();
const defaultFilter: string = DEFAULT_THEMES.dark.filter;

control.setTheme("night");
control.updateButtonLabel();
control.editor?.openThemeSelector();
control.editor?.openThemeEditor("night");
control.editor?.open();
control.editor?.close();

console.log(currentTheme, availableThemes, defaultFilter);

// @ts-expect-error Leaflet only accepts documented control positions.
new ThemeControl({ position: "center" });
