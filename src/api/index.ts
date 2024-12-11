import axios from 'axios'
import { refreshTicketAjax } from '@/api/auth'
import eventBus from '@/utils/mitt'
import { getStorage, setStorage, clearStorage } from '@/utils/localStorage'
import useUserStore from '@/store/user'

const service = axios.create({
  baseURL: '',
  // timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
})
service.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded'

//删除重复请求
const pending: any = []
const { CancelToken } = axios
const removePending = (config: any) => {
  for (const p in pending) {
    if (pending[p].url === `${config.url}&${config.method}`) {
      pending[p].f()
      pending.splice(p, 1)
    }
  }
}

// request拦截器
service.interceptors.request.use(
  (config) => {
    //删除重复请求
    removePending(config)
    config.cancelToken = new CancelToken((c) => {
      pending.push({ url: `${config.url}&${config.method}`, f: c })
    })

    const token = getStorage('token')
    const refresh_token = getStorage('refresh_token')
    config.headers['ticket'] = token
    config.headers['refreshTicket'] = refresh_token

    return config
  },
  (error) => {
    throw new Error(error)
  }
)

// 响应拦截器
let refreshing = false
let queue: any = []
service.interceptors.response.use(
  async (response) => {
    const res = response.data
    const config = response.config

    if (config.url?.includes('/login') || config.url?.includes('/refresh/ticket')) {
      return res
    }

    if (refreshing) {
      return new Promise((resolve) => {
        queue.push({
          config,
          resolve,
        })
      })
    }

    if (res?.code === 401) {
      refreshing = true
      const new_token = await resetTokenClick()
      refreshing = false

      if (new_token) {
        queue.forEach(({ config, resolve }: any) => {
          resolve(service(config))
        })
        return service(config)
      } else {
        queue = []
        clearStorage()
        const userStore = useUserStore()
        userStore.resetUserInfo()
        eventBus.emit('loginHandle')
      }
    }
    return res
  },
  (e) => {
    throw new Error(e.message)
  }
)

const resetTokenClick = async () => {
  try {
    const res: any = await refreshTicketAjax()
    const { code, data } = res || {}
    if (code === 0) {
      setStorage('token', data.new_refresh_ticket, 0)
      return data.new_refresh_ticket
    } else {
      return null
    }
  } catch (error: any) {
    return null
  }
}

export default service
