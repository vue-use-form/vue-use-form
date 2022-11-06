import { defineConfig } from 'vite'
import type { UserConfigExport } from 'vitest/config'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import Vue from '@vitejs/plugin-vue'
import { alias } from './alias'

export default defineConfig({
  optimizeDeps: {
    entries: [],
  },
  plugins: [Vue()],
  resolve: {
    alias,
  },
  test: {
    environment: 'jsdom',
  },
} as UserConfigExport &{ test: any })
