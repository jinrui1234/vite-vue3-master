import request from '@/api/index'
import axios from 'axios'

// 获取实时数据列表
export function getHotListAjax(source: string, num = 9999) {
  return request({
    url: `/api/hot/v1/list`,
    method: 'get',
    params: {
      num: num,
      source: source,
    },
  })
}

// 获取历史数据
export function getHistoryListAjax(source: string, mode: string, param: any) {
  const url = mode === 'v2' ? '/api/hot/v1/group/history/list' : '/api/hot/v1/group/list'
  return request({
    url: url,
    method: 'get',
    params: {
      ...param,
      source: source,
    },
  })
}

// 获取时间节点
export function getDayTimeAjax(source: string, param: object) {
  return request({
    url: `/api/hot/v1/group/data`,
    method: 'get',
    params: {
      ...param,
      source: source,
    },
  })
}

// 获取文章详情
export function getDetailAjax(source: string, aid: any) {
  return request({
    url: `/api/hot/v1/detail`,
    method: 'get',
    params: {
      aid: aid,
      source: source,
    },
  })
}

// 获取图表数据
export function getEchartDataAjax(source: string, type: number, aid: number | string) {
  return request({
    url: `/api/hot/v1/curve`,
    method: 'get',
    params: {
      type: type,
      aid: aid,
      source: source,
    },
  })
}

// 获取热点列表
export function geSearchListAjax(title = '') {
  return request({
    url: `/api/query/v2/get/doc`,
    method: 'get',
    params: {
      title: title,
    },
  })
}

// 获取预案列表
export function getFileListAjax(word: string) {
  return request({
    url: `/api/query/v2/case_doc/get/doc?title=${word}`,
    method: 'get',
  })
}

// 获取预案详情
export function getFileDetailAjax(id: string) {
  return request({
    url: `/api/case/v2/doc/detail?doc_id=${id}`,
    method: 'get',
  })
}

// 获取客户案例列表
export function getCaseListAjax(word: string) {
  return request({
    url: `/api/query/v2/case/get/doc?title=${word}`,
    method: 'get',
  })
}

// 获取客户案例详情
export function getCusDetailAjax(aid: number | string, source: string) {
  const url = source === '人民网留言' ? '/api/case/v1/people/detail' : '/api/case/v1/detail'
  return request({
    url: `${url}?case_id=${aid}`,
    method: 'get',
  })
}

// 获取报告数据
export function getReportResultAjax(source: string, aid: number) {
  return request({
    url: `/api/hot/v1/report`,
    method: 'get',
    params: {
      aid: aid,
      source: source,
    },
  })
}

// 大模型-获取事件分类
export function getEventResultAjax(param: any) {
  return request({
    url: '/api/case/v2/event_result',
    method: 'post',
    data: {
      case: param,
    },
  })
}

// 大模型-获取事件等级
export function getGradeResultAjax(param: any) {
  return request({
    url: '/api/case/v2/grade_result',
    method: 'post',
    data: {
      case: param,
    },
  })
}

//pdf下载
export function pdfDownloadAjax(param: any) {
  return axios({
    method: 'post',
    // url: 'http://localhost:8071/download-pdf',
    url: 'http://47.103.197.242:8071/download-pdf',
    responseType: 'blob',
    data: param,
  })
}

// 获取大模型流式文本
export function getReportPromptAjax(param: any, type?: boolean) {
  const url = type ? 'http://47.102.185.52:80/get_report' : 'http://47.100.50.180:80/get_report'
  return fetch(url, {
    method: 'post',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(param),
  })
}
