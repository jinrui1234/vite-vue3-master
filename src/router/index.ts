import { RouteRecordRaw, createWebHashHistory, createRouter } from 'vue-router'
import eventBus from '@/utils/mitt'
import { getStorage, clearStorage } from '@/utils/localStorage'
import useUserStore from '@/store/user'

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/aiReport' },

  { path: '/oldReportList', name: 'OldReportList', component: () => import('@/views/oldReportList/index.vue') },

  { path: '/aiReport', name: 'AiReport', component: () => import('@/views/aiReport/index.vue') },

  { path: '/report', name: 'Report', component: () => import('@/views/report/index.vue') },

  { path: '/collect', name: 'Collect', component: () => import('@/views/collect/index.vue') },

  { path: '/list', name: 'List', component: () => import('@/views/list/index.vue') },

  { path: '/detail', name: 'Detail', component: () => import('@/views/detail/index.vue') },

  { path: '/cusDetail', name: 'CusDetail', component: () => import('@/views/cusDetail/index.vue') },

  { path: '/pdf', name: 'Pdf', component: () => import('@/views/pdf/Pdf.vue') },

  { path: '/purePdf', name: 'PurePdf', component: () => import('@/views/pdf/PurePdf.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const white = ['/aiReport', '/pdf', '/purePdf']
router.beforeEach((to, from, next) => {
  const refresh_token = getStorage('refresh_token')
  if (!!refresh_token) {
    next()
  } else {
    if (white.indexOf(to.path) !== -1) {
      next()
      return
    }
    const userStore = useUserStore()
    userStore.resetUserInfo()
    clearStorage()
    eventBus.emit('loginHandle')
    next(false)
  }
})

export default router
