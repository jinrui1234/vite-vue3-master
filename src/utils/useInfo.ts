import { reactive, onMounted, toRefs } from 'vue'
import { Message } from '@/utils/message'
import { useRoute } from 'vue-router'
import { formatData, formatDateTime, bigNumberTransform } from '@/utils/util'
import { getDetailAjax, getEchartDataAjax, getReportResultAjax } from '@/api/home'
import { ECHART_LABEL, SOURCE_ZH } from '@/views/aiReport/config'

export function useInfo(type = 'report') {
  const { source, tab, aid, pos } = useRoute()?.query || {}

  const dataMap = reactive({
    title: '', // 文章标题

    link: '', // 文章链接

    descript: '', // 文章描述

    hot_value: '', // 热度值

    timeId: '2', // 时间

    infoList: [], // 信息总览

    reportData: [], // 报告数据

    detailList: [], // 数据总览
    summerList: [],

    chartDate: [], // 图表数据

    loading: true,
  })

  // 特殊源(特殊源无最高位次，用当前列表位次代替)
  const isSpecialSource = () => {
    return ['weibo', 'zhihu', 'baidu'].includes(source)
  }

  const getName = () => {
    if (isSpecialSource()) {
      return tab === '搜索' ? '搜索结果位置' : `${SOURCE_ZH[source]}热搜榜当前位置`
    } else {
      return `${SOURCE_ZH[source]}热搜榜最高位置`
    }
  }

  // 获取图表数据
  const getChartDateHandle = async () => {
    try {
      const res: any = await getEchartDataAjax(source, dataMap.timeId, aid)
      const { code, data: list, msg } = res || {}
      if (code === 0) {
        let arr: any = []
        Object.keys(list)?.forEach((el) => {
          if (ECHART_LABEL[el] && list[el]?.length) {
            const x: string[] = []
            const y: string[] = []
            const y2: string[] = ['0']

            list[el].forEach((item: any) => {
              const mode = ['1', '2'].includes(dataMap.timeId) ? 'hour' : 'day'
              x.push(formatData(item.time, mode))
              y.push(item.num)
            })

            list[`${el}_diff`].forEach((item: any) => {
              y2.push(item.num)
            })

            if (x?.length || y?.length) {
              arr.push({
                name: ECHART_LABEL[el],
                id: el,
                x: x,
                y: y,
                y2: y2,
              })
            }
          }
        })

        // 把热度值表单放到最前面
        const index = arr.findIndex((el: any) => el.name === '热度值')
        if (index !== -1) {
          const Item = arr.splice(index, 1)[0]
          arr.unshift(Item)
        }

        // 当数据源为头条时,去除互动量数据
        if (source === 'toutiao') {
          arr = arr?.filter((el: any) => el.name !== '互动量')
        }

        dataMap.chartDate = arr
      } else {
        Message('error', msg)
      }
    } catch (error: any) {
      // Message('error', error)
      console.error(error)
    }
  }

  // 获取报告结果
  const getReportResultHandle = async () => {
    try {
      const res: any = await getReportResultAjax(source, aid)
      const { code, data: list, msg } = res || {}
      if (code === 0 && list) {
        const { comment_report, hot_report, share_report } = list || {}
        const arr = []
        if (comment_report) {
          arr.push({
            name: '评论量',
            value: comment_report,
          })
        }
        if (hot_report) {
          arr.push({
            name: '热度值',
            value: hot_report,
          })
        }
        if (share_report) {
          arr.push({
            name: '传播量',
            value: share_report,
          })
        }
        dataMap.reportData = arr
      } else {
        Message('error', msg)
      }
    } catch (error: any) {
      Message('error', error)
    }
  }

  // 获取文章详情
  const getArticleDateHandle = async () => {
    try {
      const res: any = await getDetailAjax(source, aid)
      const { code, data: list, msg } = res || {}
      if (code === 0) {
        const { title, descript, duration, read, interact, comment, origin, rank, link, create_date, hot_value, collect, share } = list || {}
        dataMap.title = title
        dataMap.link = link
        dataMap.descript = descript
        dataMap.hot_value = getHot(hot_value)

        dataMap.infoList = [
          {
            name: '简 介',
            value: getDescript(descript),
          },
          {
            name: '时 间',
            value: formatDateTime(create_date),
          },
        ]

        const arr2 = []
        if (type !== 'report') {
          if (rank || isSpecialSource()) {
            arr2.push({
              name: getName(),
              num: isSpecialSource() ? pos : rank,
              unit: '位',
            })
          }
          if (duration) {
            arr2.push({
              name: '在榜时间',
              num: minToHour(duration),
              unit: '小时',
            })
          }
        } else {
          if (rank || isSpecialSource()) {
            arr2.push({
              name: getName(),
              num: isSpecialSource() ? `${pos}位` : `${rank}位`,
            })
          }
          if (duration) {
            arr2.push({
              name: '在榜时间',
              num: `${minToHour(duration)}小时`,
            })
          }
        }
        dataMap.summerList = arr2

        const arr = []
        if (collect !== undefined) arr.push(getObj(collect, '收藏量'))
        if (comment !== undefined) arr.push(getObj(comment, '评论量'))
        if (interact !== undefined && source !== 'toutiao') {
          arr.push(getObj(interact, '互动量'))
        }
        if (origin !== undefined) arr.push(getObj(origin, '原创量'))
        if (read !== undefined) arr.push(getObj(read, '阅读量'))
        if (share !== undefined) arr.push(getObj(share, '分享量'))
        dataMap.detailList = arr || []
      } else {
        Message('error', msg)
      }
    } catch (error: any) {
      Message('error', error)
    }
  }

  // 简介处理
  const getDescript = (content: string) => {
    if (!content) return ''
    const tip = content.replaceAll('\n', '')?.replaceAll(' ', '')
    return tip.length > 3000 ? tip.slice(0, 3000) + '.... 展开' : tip
  }

  // 数据处理
  const getObj = (count: number, title: string) => {
    if (type === 'report') {
      return {
        name: title,
        num: bigNumberTransform(Number(count), true) || 0,
      }
    } else {
      const [num, tip] = bigNumberTransform(Number(count))
      return {
        name: title,
        num: num || 0,
        unit: tip,
      }
    }
  }

  // 获取热度值
  const getHot = (value: any) => {
    return value ? bigNumberTransform(parseInt(value), true, 2) : '-'
  }

  // 分钟转化为小时
  const minToHour = (time: number | string) => {
    return (parseInt(time) / 60).toFixed(1)
  }

  // 设置timeId
  const setTime = (id: string) => {
    dataMap.timeId = id
    getChartDateHandle()
  }

  onMounted(() => {
    const requestArr = [getArticleDateHandle(), getChartDateHandle()]
    if (type === 'report') {
      requestArr.push(getReportResultHandle())
    }
    Promise.allSettled(requestArr).then(() => {
      dataMap.loading = false
    })
  })
  return {
    ...toRefs(dataMap),
    setTime: setTime,
  }
}
