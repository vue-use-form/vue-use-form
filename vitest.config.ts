import { defineConfig } from 'vite'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// import Vue from '@vitejs/plugin-vue'
import { alias } from './alias'

export default defineConfig({
  optimizeDeps: {
    entries: [],
  },
  // plugins: [Vue()],
  resolve: {
    alias,
  },
})
