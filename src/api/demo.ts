import service from './index'

const baseUrl = '...'

export function get(params: any) {
  return service({
    method: 'get',
    url: `${baseUrl}/work-order/pushedMessage/list`,
    params: params,
  })
}

export function post(params: any) {
  return service({
    method: 'post',
    url: `${baseUrl}/work-order/pushedMessage/update/list`,
    data: params,
  })
}
