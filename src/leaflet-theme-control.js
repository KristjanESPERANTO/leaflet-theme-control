import { Control, DomEvent, DomUtil, Util } from 'leaflet'
import { DEFAULT_THEMES } from './leaflet-theme-control-themes.js'
import { ThemeEditor } from './leaflet-theme-editor.js'

/**
 * ThemeControl - Leaflet control for switching visual themes
 *
 * Supports multiple themes using CSS filters:
 * - Light (default)
 * - Dark (inverted colors)
 * - Grayscale (black & white)
 * - Custom themes via options
 */
export class ThemeControl extends Control {
  static {
    this.setDefaultOptions({
      position: 'topright',
      themes: null, // Will be set to a copy of DEFAULT_THEMES in initialize
      defaultTheme: 'light',
      storageKey: 'leaflet-theme',
      detectSystemTheme: true,
      cssSelector: '.leaflet-tile-pane',
      addButton: true, // Add UI button to map (set to false for programmatic control only)
      enableEditor: false, // Enable theme editor UI
      onChange: null,
      getLabel: null, // Function to get translated theme labels: (themeKey) => string
      getEditorLabels: null, // Function to get translated editor UI labels: (key) => string
    })
  }

  initialize(options) {
    Util.setOptions(this, options)

    // Create a deep copy of DEFAULT_THEMES to avoid mutating the original
    if (!this.options.themes) {
      this.options.themes = {}
      Object.keys(DEFAULT_THEMES).forEach((key) => {
        this.options.themes[key] = { ...DEFAULT_THEMES[key] }
      })
    }

    this.root = document.documentElement
    this.savedTheme = localStorage.getItem(this.options.storageKey)

    // AbortController for automatic event cleanup
    this._abortController = new AbortController()

    // Setup media query listener for system theme changes
    if (this.options.detectSystemTheme) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      this.prefersDark = mediaQuery.matches

      mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually selected a theme
        if (!this.savedTheme) {
          this.setTheme(e.matches ? 'dark' : this.options.defaultTheme)
        }
      }, { signal: this._abortController.signal })
    }
    else {
      this.prefersDark = false
    }

    // Initialize theme editor if enabled
    if (this.options.enableEditor) {
      this.editor = new ThemeEditor(this)
    }

    // Set initial theme
    const initialTheme = this._determineInitialTheme()
    this.currentTheme = initialTheme
    this._applyTheme(initialTheme, false)
  }

  _determineInitialTheme() {
    // 1. Check localStorage
    if (this.savedTheme && this.options.themes[this.savedTheme]) {
      return this.savedTheme
    }

    // 2. Check system preference (if enabled)
    if (this.options.detectSystemTheme && this.prefersDark && this.options.themes.dark) {
      return 'dark'
    }

    // 3. Use default
    return this.options.defaultTheme
  }

  onAdd(map) {
    this.map = map

    // Add theme selector panel to map container if editor enabled
    if (this.options.enableEditor && this.editor) {
      const panel = this.editor.createPanel()
      map.getContainer().appendChild(panel)
    }

    // Return empty container if no button should be added
    if (!this.options.addButton) {
      const container = DomUtil.create('div', 'leaflet-control-theme-hidden')
      container.style.display = 'none'
      return container
    }

    const container = DomUtil.create('div', 'leaflet-bar leaflet-control-theme')
    const button = DomUtil.create('button', 'leaflet-control-theme-button', container)

    button.type = 'button'
    this._updateButton(button, this.currentTheme)

    // Store button reference for updates
    this.button = button

    // Event listener - inline arrow function (no need to store reference)
    DomEvent.on(button, 'click', (event) => {
      DomEvent.stop(event)

      if (this.options.enableEditor && this.editor) {
        this.editor.openThemeSelector()
      }
      else {
        this._cycleTheme()
      }
    })

    return container
  }

  onRemove() {
    // Abort all event listeners
    this._abortController.abort()

    // Cleanup editor
    if (this.editor) {
      this.editor.cleanup()
    }

    this.button = null
    this.map = null
  }

  _updateButton(button, themeKey) {
    if (!button) return // No button if addButton: false

    const theme = this.options.themes[themeKey]
    const label = this._getThemeLabel(themeKey)

    button.setAttribute('aria-label', 'Theme: ' + label)
    button.title = 'Theme: ' + label
    button.textContent = theme.icon || '🎨'
  }

  _getThemeLabel(themeKey) {
    // Use custom label function if provided
    if (this.options.getLabel) {
      return this.options.getLabel(themeKey)
    }

    // Use theme's built-in label
    const theme = this.options.themes[themeKey]
    return theme.label || themeKey
  }

  _cycleTheme() {
    const themeKeys = Object.keys(this.options.themes)
    const currentIndex = themeKeys.indexOf(this.currentTheme)
    const nextIndex = (currentIndex + 1) % themeKeys.length
    const nextTheme = themeKeys[nextIndex]

    this.setTheme(nextTheme)
  }

  setTheme(themeKey) {
    if (!this.options.themes[themeKey]) {
      console.warn(`Theme "${themeKey}" not found`)
      return
    }

    this.currentTheme = themeKey
    this._applyTheme(themeKey, true)
    this._updateButton(this.button, themeKey)
  }

  _applyTheme(themeKey, save = true) {
    const theme = this.options.themes[themeKey]

    // Set data-theme attribute on root
    this.root.setAttribute('data-theme', themeKey)

    // Set control style (light or dark controls)
    const controlStyle = theme.controlStyle || 'light'
    this.root.setAttribute('data-control-style', controlStyle)

    // Remove all theme classes from root
    Object.values(this.options.themes).forEach((t) => {
      if (t.className) {
        this.root.classList.remove(t.className)
      }
    })

    // Add current theme class to root
    if (theme.className) {
      this.root.classList.add(theme.className)
    }

    // Apply CSS filter to map tiles
    const mapElements = document.querySelectorAll(this.options.cssSelector)
    mapElements.forEach((el) => {
      if (theme.filter) {
        el.style.filter = theme.filter
      }
      else {
        el.style.filter = ''
      }
    })

    // Collect all selectors from all themes to clear filters first
    const allSelectors = new Set()
    Object.values(this.options.themes).forEach((t) => {
      if (t.applyToSelectors) {
        const selectors = Array.isArray(t.applyToSelectors)
          ? t.applyToSelectors
          : [t.applyToSelectors]
        selectors.forEach(s => allSelectors.add(s))
      }
    })

    // Clear filters from all possible selectors
    allSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector)
      elements.forEach((el) => {
        el.style.filter = ''
      })
    })

    // Apply CSS filter to additional custom selectors (if specified in current theme)
    if (theme.applyToSelectors) {
      const selectors = Array.isArray(theme.applyToSelectors)
        ? theme.applyToSelectors
        : [theme.applyToSelectors]

      selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector)
        elements.forEach((el) => {
          if (theme.filter) {
            el.style.filter = theme.filter
          }
        })
      })
    }

    // Save to localStorage
    if (save) {
      localStorage.setItem(this.options.storageKey, themeKey)
    }

    // Trigger onChange callback
    if (this.options.onChange) {
      this.options.onChange(themeKey, theme)
    }
  }

  getCurrentTheme() {
    return this.currentTheme
  }

  getThemes() {
    return this.options.themes
  }
}

export { DEFAULT_THEMES }
