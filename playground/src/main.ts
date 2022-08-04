import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { Quasar } from 'quasar'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

const app = createApp(App)

app.use(router)
app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
})
app.use(ElementPlus)
app.mount('#app')
