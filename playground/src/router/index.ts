import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import Normal from '../pages/normal.vue'
import ClassValidator from '../pages/class-validator/class-validator.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/normal',
  },
  {
    path: '/normal',
    component: Normal,
  },
  {
    path: '/class-validator',
    component: ClassValidator,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
