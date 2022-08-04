import { defineConfig } from 'vite'
import type { UserConfigExport } from 'vitest/config'
import { alias } from './alias'

export default defineConfig({
  optimizeDeps: {
    entries: [],
  },
  resolve: {
    alias,
  },
  test: {},
} as UserConfigExport &{ test: any })
