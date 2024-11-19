import request from '@/api/index'

import useUserStore from '@/store/user'

// 登陆
export function loginAjax(param: any) {
  return request({
    url: `/api/common/v1/login`,
    method: 'post',
    data: param,
  })
}

// 登出
export function loginOutAjax() {
  const userStore = useUserStore()
  return request({
    url: `/api/common/v1/logout`,
    method: 'get',
    params: { user_id: userStore.userInfo?.user_id },
  })
}

// 刷新ticket
export function refreshTicketAjax() {
  const userStore = useUserStore()
  return request({
    url: `/api/common/v1/refresh/ticket`,
    method: 'get',
    params: { user_id: userStore.userInfo?.user_id },
  })
}

// 获取次数
export function getCountAjax() {
  const userStore = useUserStore()
  return request({
    url: `/api/report/v1/user/free_num`,
    method: 'get',
    params: { user_id: userStore.userInfo?.user_id },
  })
}

// 重置次数
export function resetCountAjax() {
  const userStore = useUserStore()
  return request({
    url: `/api/report/v1/user/free_num/save`,
    method: 'post',
    params: { user_id: userStore.userInfo?.user_id },
  })
}
