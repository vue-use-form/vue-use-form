import fs from 'fs'
import path from 'path'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import execa from 'execa'

const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7)

export default defineConfig({
  plugins: [vue(), copyVuePlugin()],
  define: {
    __COMMIT__: JSON.stringify(commit),
    __VUE_PROD_DEVTOOLS__: JSON.stringify(true),
  },
  optimizeDeps: {
    exclude: ['@vue/repl'],
  },
})

function copyVuePlugin(): Plugin {
  return {
    name: 'copy-vue',
    generateBundle() {
      const copyFile = (file: string, toBasename?: string) => {
        const filePath = path.resolve(__dirname, file)
        const basename = toBasename || path.basename(file)
        if (!fs.existsSync(filePath)) {
          throw new Error(
            `${basename} not built. `
              + 'Run "nr build vue -f esm-browser" first.',
          )
        }
        this.emitFile({
          type: 'asset',
          fileName: basename,
          source: fs.readFileSync(filePath, 'utf-8'),
        })
      }

      copyFile('node_modules/vue/dist/vue.runtime.esm-browser.js')
      copyFile('node_modules/vue/server-renderer/index.mjs', 'server-renderer.esm-browser.js')
      copyFile('../packages/core/dist/index.mjs', 'vue-use-form.js')
    },
  }
}
