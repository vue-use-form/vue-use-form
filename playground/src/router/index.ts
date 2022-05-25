import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import ElementPlus from '../pages/element-plus.vue'
import ClassValidator from '../pages/class-validator/class-validator.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/element-plus',
  },
  {
    path: '/element-plus',
    component: ElementPlus,
    name: 'element-plus',
  },
  {
    path: '/class-validator',
    component: ClassValidator,
    name: 'class-validator',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
