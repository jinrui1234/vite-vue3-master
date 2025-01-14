import { getEchartDataAjax, getReportResultAjax, getDetailAjax, getFileListAjax, getCaseListAjax } from '@/api/home'
import { formatData, bigNumberTransform, minTransformHour, isExistence } from '@/utils/util'
import { ECHART_LABEL, EFFECT_PROP, SOURCE_ZH } from './config'
import { Message } from '@/utils/message'

// 曲线数据
export const getCurveDateClick = async (source, aid, timeId) => {
  try {
    const res = await getEchartDataAjax(source, timeId, aid)
    const { code, data, msg } = res || {}
    if (code === 0) {
      let arr = []
      Object.keys(data)?.forEach((el) => {
        if (ECHART_LABEL[el] && data[el]?.length) {
          const x = []
          const y = []
          // 曲线从0开始
          const y2 = ['0']
          data[el].forEach((item) => {
            // 事件轴以分钟、小时为单位
            const timeMode = ['1', '2'].includes(timeId) ? 'hour' : 'day'
            // 时间戳转换为时间格式
            x.push(formatData(item.time, timeMode))
            y.push(item.num)
          })
          data[`${el}_diff`].forEach((item) => {
            y2.push(item.num)
          })
          arr.push({
            name: ECHART_LABEL[el],
            id: el,
            x: x,
            y: y,
            y2: y2,
          })
        }
      })

      // 把热度值图表放到前面
      const index = arr.findIndex((el) => el.name === '热度值')
      if (index !== -1) {
        const item = arr.splice(index, 1)[0]
        arr.unshift(item)
      }

      // 当数据源为头条时,去除互动量数据
      if (source === 'toutiao') {
        arr = arr.filter((el) => el.name !== '互动量')
      }

      return {
        curveDate: data,
        curveDealDate: arr,
      }
    } else {
      messageShow(msg)
      return {
        curveDate: {},
        curveDealDate: [],
      }
    }
  } catch (error) {
    messageShow(error)
    return {
      curveDate: {},
      curveDealDate: [],
    }
  }
}

// 事件影响力
export const getReportResultClick = async (source, aid) => {
  try {
    const res = await getReportResultAjax(source, aid)
    const { code, data, msg } = res || {}
    if (code === 0 && data) {
      const arr = []
      Object.keys(data)?.forEach((el) => {
        if (!data[el] || !EFFECT_PROP[el]) return
        arr.push({
          name: EFFECT_PROP[el],
          value: data[el],
        })
      })
      return {
        eventEffect: arr,
      }
    } else {
      messageShow(msg)
      return {
        eventEffect: [],
      }
    }
  } catch (error) {
    messageShow(error)
    return {
      eventEffect: [],
    }
  }
}

// 案例列表
export const getCaseListClick = async (keyWord) => {
  try {
    const res = await getCaseListAjax(keyWord)
    const { code, data, msg } = JSON.parse(JSON.stringify(res || {}))
    if (code === 0) {
      const newList = data?.length ? data.slice(0, 10) : []
      const content = newList.map((el) => `${el.case_id}-${el.title}`)
      return {
        caseList: newList,
        caseContent: content?.join(','),
      }
    } else {
      messageShow(msg)
      return {
        caseList: [],
        caseContent: '',
      }
    }
  } catch (error) {
    messageShow(error)
    return {
      caseList: [],
      caseContent: '',
    }
  }
}

// 文档列表
export const getFileListClick = async (keyWord) => {
  try {
    const res = await getFileListAjax(keyWord)
    const { code, data, msg } = JSON.parse(JSON.stringify(res || {}))
    if (code === 0) {
      const newList = data?.length ? data.slice(0, 10) : []
      const content = newList.map((el) => `${el.doc_id}-${el.title}`)
      return {
        fileList: newList,
        fileContent: content?.join(','),
      }
    } else {
      messageShow(msg)
      return {
        fileList: [],
        fileContent: '',
      }
    }
  } catch (error) {
    messageShow(error)
    return {
      fileList: [],
      fileContent: '',
    }
  }
}

// 数据汇总(文章详情)
export const getArticleDateClick = async (source, aid, pos) => {
  try {
    const res = await getDetailAjax(source, aid)
    const { code, data, msg } = res || {}
    if (code === 0 && data) {
      const { duration, read, interact, comment, origin, rank, collect, share, hot_value } = data || {}
      const arr = []
      if (rank || isSpecialSource(source)) {
        arr.push({
          name: isSpecialSource(source) ? '搜索结果位置' : `${SOURCE_ZH[source]}热搜榜最高位置`,
          num: isSpecialSource(source) ? pos : rank,
          unit: '位',
        })
      }
      if (duration) {
        arr.push({
          name: '在榜时间',
          num: minTransformHour(duration),
          unit: '小时',
        })
      }
      if (isExistence(collect)) arr.push(getObj(collect, '收藏量'))
      if (isExistence(comment)) arr.push(getObj(comment, '评论量'))
      // 当数据源为头条时,去除互动量数据
      if (isExistence(interact) && source !== 'toutiao') {
        arr.push(getObj(interact, '互动量'))
      }
      if (isExistence(origin)) arr.push(getObj(origin, '原创量'))
      if (isExistence(read)) arr.push(getObj(read, '阅读量'))
      if (isExistence(share)) arr.push(getObj(share, '分享量'))

      return {
        hot_value: getHot(hot_value),
        eventDataCollection: arr,
      }
    } else {
      messageShow(msg)
      return {
        hot_value: '',
        eventDataCollection: [],
      }
    }
  } catch (error) {
    messageShow(error)
    return {
      hot_value: '',
      eventDataCollection: [],
    }
  }
}

// 特殊源(特殊源无最高位次，用当前列表位次代替)
const isSpecialSource = (source) => {
  return ['weibo', 'zhihu', 'baidu'].includes(source)
}

// 获取热度值
const getHot = (value) => {
  return value ? bigNumberTransform(parseInt(value), true, 2) : '-'
}

// 数据处理
const getObj = (count, title) => {
  const [num, tip] = bigNumberTransform(Number(count))
  return {
    name: title,
    num: num || 0,
    unit: tip,
  }
}

// 报错信息展示
const messageShow = () => {
  Message('error', info)
}
