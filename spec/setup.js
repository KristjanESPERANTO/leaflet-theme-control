import { beforeEach, vi } from 'vitest'

beforeEach(() => {
  // happy-dom provides a standards-compatible localStorage implementation.
  localStorage.clear()

  // Setup matchMedia mock
  globalThis.matchMedia = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
})
