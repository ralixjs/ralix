import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    environmentOptions: {
      jsdom: {
        url: 'http://example.com/'
      }
    },
    setupFiles: ['./tests/setup.js'],
    include: ['tests/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**']
    }
  }
})
