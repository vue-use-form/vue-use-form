import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createUseForm } from '../../packages/core/src/createUseForm'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus).use(createUseForm())
app.mount('#app')
