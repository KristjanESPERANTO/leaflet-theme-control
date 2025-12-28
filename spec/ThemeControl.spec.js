import { describe, expect, it, beforeEach } from 'vitest'
import { DEFAULT_THEMES, ThemeControl } from '../src/leaflet-theme-control.js'

describe('DEFAULT_THEMES', () => {
  it('should export default themes', () => {
    expect(DEFAULT_THEMES).toBeDefined()
    expect(Object.keys(DEFAULT_THEMES)).toContain('light')
    expect(Object.keys(DEFAULT_THEMES)).toContain('dark')
    expect(Object.keys(DEFAULT_THEMES)).toContain('grayscale')
    expect(Object.keys(DEFAULT_THEMES)).toContain('custom')
  })

  it('should have valid theme structure', () => {
    Object.values(DEFAULT_THEMES).forEach((theme) => {
      expect(theme).toHaveProperty('label')
      expect(theme).toHaveProperty('filter')
      expect(theme).toHaveProperty('icon')
      expect(theme).toHaveProperty('controlStyle')
    })
  })

  it('should have correct control styles', () => {
    expect(DEFAULT_THEMES.light.controlStyle).toBe('light')
    expect(DEFAULT_THEMES.dark.controlStyle).toBe('dark')
    expect(DEFAULT_THEMES.grayscale.controlStyle).toBe('light')
  })
})

describe('localStorage Integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should allow storing and retrieving theme keys', () => {
    const key = 'test-theme'
    const value = 'dark'

    localStorage.setItem(key, value)
    expect(localStorage.getItem(key)).toBe(value)
  })

  it('should handle missing keys gracefully', () => {
    expect(localStorage.getItem('nonexistent')).toBeNull()
  })

  it('should allow removing items', () => {
    localStorage.setItem('temp', 'value')
    localStorage.removeItem('temp')
    expect(localStorage.getItem('temp')).toBeNull()
  })

  it('should clear all items', () => {
    localStorage.setItem('key1', 'value1')
    localStorage.setItem('key2', 'value2')
    localStorage.clear()
    expect(localStorage.getItem('key1')).toBeNull()
    expect(localStorage.getItem('key2')).toBeNull()
  })
})

describe('Theme Filter Strings', () => {
  it('should have valid CSS filter syntax for dark theme', () => {
    const darkFilter = DEFAULT_THEMES.dark.filter
    expect(darkFilter).toMatch(/invert\(/)
    expect(darkFilter).toMatch(/hue-rotate\(/)
  })

  it('should have no filter for light theme', () => {
    expect(DEFAULT_THEMES.light.filter).toBe('')
  })

  it('should have grayscale filter for grayscale theme', () => {
    const grayscaleFilter = DEFAULT_THEMES.grayscale.filter
    expect(grayscaleFilter).toMatch(/grayscale\(/)
  })
})

describe('ThemeControl with Custom Themes', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should store original theme values on initialization', () => {
    const customThemes = {
      ...DEFAULT_THEMES,
      dark: {
        ...DEFAULT_THEMES.dark,
        filter: 'invert(1) hue-rotate(200deg) saturate(0.9) brightness(0.9)',
      },
    }

    const control = new ThemeControl({
      themes: customThemes,
      addButton: false,
    })

    expect(control.originalThemes).toBeDefined()
    expect(control.originalThemes.dark).toBeDefined()
    expect(control.originalThemes.dark.filter).toBe('invert(1) hue-rotate(200deg) saturate(0.9) brightness(0.9)')
  })

  it('should store original theme values for default themes when no custom themes provided', () => {
    const control = new ThemeControl({
      addButton: false,
    })

    expect(control.originalThemes).toBeDefined()
    expect(control.originalThemes.dark).toBeDefined()
    expect(control.originalThemes.dark.filter).toBe(DEFAULT_THEMES.dark.filter)
    expect(control.originalThemes.light.filter).toBe(DEFAULT_THEMES.light.filter)
  })

  it('should preserve all original theme properties', () => {
    const customThemes = {
      light: {
        ...DEFAULT_THEMES.light,
        filter: '',
      },
      dark: {
        ...DEFAULT_THEMES.dark,
        filter: 'invert(1) hue-rotate(200deg)',
        controlStyle: 'dark',
      },
      custom: {
        label: 'My Custom',
        filter: 'sepia(0.5)',
        controlStyle: 'light',
      },
    }

    const control = new ThemeControl({
      themes: customThemes,
      addButton: false,
    })

    expect(control.originalThemes.light.filter).toBe('')
    expect(control.originalThemes.dark.filter).toBe('invert(1) hue-rotate(200deg)')
    expect(control.originalThemes.dark.controlStyle).toBe('dark')
    expect(control.originalThemes.custom.filter).toBe('sepia(0.5)')
    expect(control.originalThemes.custom.controlStyle).toBe('light')
  })

  it('should not mutate DEFAULT_THEMES when using custom themes', () => {
    const originalDarkFilter = DEFAULT_THEMES.dark.filter

    const customThemes = {
      ...DEFAULT_THEMES,
      dark: {
        ...DEFAULT_THEMES.dark,
        filter: 'invert(1) hue-rotate(200deg)',
      },
    }

    const control = new ThemeControl({
      themes: customThemes,
      addButton: false,
    })

    // Control should use the custom filter
    expect(control.originalThemes.dark.filter).toBe('invert(1) hue-rotate(200deg)')

    // DEFAULT_THEMES should remain unchanged
    expect(DEFAULT_THEMES.dark.filter).toBe(originalDarkFilter)
  })
})
