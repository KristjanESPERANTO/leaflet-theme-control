import { beforeEach, vi } from 'vitest'

// Setup localStorage mock for happy-dom
beforeEach(() => {
  const storage = {}
  globalThis.localStorage = {
    getItem: key => storage[key] || null,
    setItem: (key, value) => {
      storage[key] = String(value)
    },
    removeItem: (key) => {
      delete storage[key]
    },
    clear: () => {
      Object.keys(storage).forEach(key => delete storage[key])
    },
  }

  // Setup matchMedia mock
  globalThis.matchMedia = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
})
