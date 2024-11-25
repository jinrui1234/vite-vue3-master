import { RouteRecordRaw, createWebHashHistory, createRouter } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/aiReport' },

  { path: '/aiReport', name: 'AiReport', component: () => import('@/views/aiReport/index.vue') },

  { path: '/report', name: 'Report', component: () => import('@/views/report/index.vue') },

  { path: '/collect', name: 'Collect', component: () => import('@/views/collect/index.vue') },

  { path: '/list', name: 'List', component: () => import('@/views/list/index.vue') },

  { path: '/detail', name: 'Detail', component: () => import('@/views/detail/index.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// router.beforeEach((to, from, next) => {
//   const hasToken = sessionStorage.getItem('token')
//   if (hasToken) {
//     next()
//   } else {
//     next()
//   }
// })

export default router
