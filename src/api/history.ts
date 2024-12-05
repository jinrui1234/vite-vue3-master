import request from '@/api/index'

// 历史报告列表
export function getOldReportAjax(param: any) {
  return request({
    url: `/api/report/v1/list`,
    method: 'get',
    params: param,
  })
}

// 历史报告详情
export function getOldReportDetailAjax(param: any) {
  return request({
    url: `/api/report/v1/detail`,
    method: 'get',
    params: param,
  })
}

// 删除历史报告列表
export function deleteOldReportAjax(param: any) {
  return request({
    url: `/api/report/v1/delete`,
    method: 'post',
    data: param,
  })
}

// 保存历史报告
export function saveOldReportAjax(param: any) {
  return request({
    url: `/api/report/v1/save`,
    method: 'post',
    data: param,
  })
}
