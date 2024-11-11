import { RouteRecordRaw, createWebHashHistory, createRouter } from 'vue-router'

const routes: Array<RouteRecordRaw> = [{ path: '/demo', name: 'Demo', component: () => import('@/views/Demo.vue') }]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
