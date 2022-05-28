import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { transformAssetUrls } from '@quasar/vite-plugin'
import Unocss from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    Unocss({}),
  ],
})
