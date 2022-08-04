import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { transformAssetUrls } from '@quasar/vite-plugin'
import VForm from '@vue-use-form/v-form/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VForm(),
    vue({
      template: { transformAssetUrls },
    }),
  ],
})
