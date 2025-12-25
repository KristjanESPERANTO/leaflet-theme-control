import { describe, expect, it, beforeEach } from 'vitest'
import { DEFAULT_THEMES } from '../src/leaflet-theme-control.js'

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
