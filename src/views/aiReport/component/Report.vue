<template>
  <div class="report-wrap">
    <div class="title">{{ `【${dataMap.keyWord}舆情报告】` }}</div>

    <ReportDoor />

    <!-- 事件概述 -->
    <template v-if="dataMap.summaryPrompt">
      <LabelWrap title="事件概述" style="margin: 10px 0" :disabled="!dataMap.isStop" @re-submit="reSubmit('shijiangaishu', $event)" />
      <div class="prompt" v-html="marked(dataMap.summaryPrompt)"></div>
    </template>

    <!-- 风险等级 、数据来源 -->
    <template v-if="dataMap.eventLevel && Object.keys(dataMap.caseSourceObj)?.length">
      <LabelWrap title="风险等级与数据来源" style="margin-top: 20px" :isShowBtn="false" />
      <div style="display: flex; align-items: center">
        <LevelWrap :level="dataMap.eventLevel" />
        <SourceRatio :list="dataMap.caseSourceObj" />
      </div>
    </template>

    <!-- 处置建议 -->
    <template v-if="dataMap.advicePrompt">
      <LabelWrap title="处置建议" style="margin-bottom: 10px" :disabled="!dataMap.isStop" @re-submit="reSubmit('chuzhijianyi', $event)" />
      <div class="prompt" style="margin-bottom: 20px" v-html="marked(dataMap.advicePrompt)"></div>
    </template>

    <!-- 风险预警 -->
    <template v-if="dataMap.warningPrompt">
      <LabelWrap title="风险预警" style="margin-bottom: 10px" :disabled="!dataMap.isStop" @re-submit="reSubmit('fengxianyujing', $event)" />
      <div class="prompt" v-html="marked(dataMap.warningPrompt)"></div>
    </template>

    <!-- 事件影响力 -->
    <template v-if="dataMap.eventEffect?.length">
      <LabelWrap title="事件影响力" style="margin: 20px 0 10px" :isShowBtn="false" />
      <EventEffect class="effect-item" v-for="item of dataMap.eventEffect" :item="item" :key="item.name" />
    </template>

    <!-- 数据总览 -->
    <template v-if="dataMap.eventDataCollection?.length">
      <LabelWrap title="数据总览" style="margin: 20px 0 10px" :isShowBtn="false" />
      <DataCaptureWrap :list="dataMap.eventDataCollection" />
    </template>

    <!-- 话题趋势 -->
    <template v-if="dataMap.hot_value">
      <HotWrap :hot="dataMap.hot_value" />
      <TimeTab style="margin-bottom: 20px" :id="dataMap.timeId" @tab-change="timeTabClick" />
    </template>

    <template v-if="dataMap.eventTrend?.length">
      <ChartItem class="chart-item" v-for="el of dataMap.eventTrend" :key="el.id" :name="el.name" :id="el.id" :x="el.x" :y="el.y" :y2="el.y2" />
    </template>
    <Empty v-if="dataMap.hot_value && !dataMap.eventTrend?.length" />

    <!-- 历史处置情况 -->
    <EventList
      v-if="dataMap.casePrompt"
      title="历史处置情况"
      :list="dataMap.caseList"
      :isStop="dataMap.isStop"
      :listShow="dataMap.caseListShow"
      @click-case="clickCaseHandle"
      @re-submit="reSubmit('lishichuli', $event)"
    >
      <div class="prompt" v-html="marked(dataMap.casePrompt)"></div>
    </EventList>

    <!-- 回应处置参考 -->
    <EventList
      v-if="dataMap.filePrompt"
      title="回应处置参考"
      :list="dataMap.fileList"
      :isStop="dataMap.isStop"
      :listShow="dataMap.fileListShow"
      @re-submit="reSubmit('huiyingchuzhi', $event)"
    >
      <div class="prompt" v-html="marked(dataMap.filePrompt)"></div>
    </EventList>

    <!-- 关联热点 -->
    <EventList
      v-if="dataMap.searchPrompt"
      title="关联热点"
      :list="dataMap.searchList"
      :isStop="dataMap.isStop"
      :listShow="!!dataMap.searchList?.length"
      @re-submit="reSubmit('guanlianredian', $event)"
    >
      <div class="prompt" v-html="marked(dataMap.searchPrompt)"></div>
    </EventList>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount } from 'vue'
import { marked } from 'marked'
import { useWatermark } from '@/utils/waterMark'
import { PROMPT_PROP, EFFECT_PROP, MODE_PROP, ECHART_LABEL, SOURCE_ZH, PROMPT_URL } from './../config'
import { bigNumberTransform, formatData, minTransformHour, isExistence } from '@/utils/util'
import { getDetailAjax, getReportResultAjax, getEchartDataAjax, getCaseListAjax, getFileListAjax } from '@/api/home'

import ReportDoor from './ReportDoor.vue'
import LabelWrap from './LabelWrap.vue'
import LevelWrap from './LevelWrap.vue'
import SourceRatio from './SourceRatio.vue'
import DataCaptureWrap from './DataCaptureWrap.vue'
import EventList from './EventList.vue'
import HotWrap from './HotWrap.vue'
import TimeTab from './TimeTab.vue'
import EventEffect from './EventEffect.vue'
import ChartItem from './ChartItem.vue'
import Empty from './Empty.vue'

const { setWatermark, clear } = useWatermark()
let webWorker = new Worker(new URL('../worker.js', import.meta.url), {
  type: 'module',
})
const dataMap = reactive({
  keyWord: '',
  hot_value: '', // 热度值

  source: '', // 数据来源
  aid: '',
  selectType: '', // 研判类型
  timeId: '2', // 数据趋势-时间

  // 事件概述
  summaryPrompt: '',
  // 事件等级
  eventLevel: '',
  // 数据来源占比
  caseSourceObj: {},
  //事件影响力
  eventEffect: [],
  // 处置建议
  advicePrompt: '',
  // 风险预警
  warningPrompt: '',
  // 数据汇总
  eventDataCollection: [],
  // 数据趋势
  eventTrend: [],
  eventTrendCopy: {},

  // 历史处置情况
  casePrompt: '',
  // 历史处置情况-列表
  caseList: [],
  caseListShow: false,
  // 回应处置参考
  filePrompt: '',
  // 回应处置参考-列表
  fileList: [],
  fileListShow: false,
  // 关联热点
  searchPrompt: '',
  // 热点列表
  searchList: [],

  // 停止生成
  isStop: true,
  loading: false,
})

// 重置
const reset = () => {
  dataMap.loading = true
  dataMap.isStop = false
  dataMap.keyWord = ''
  dataMap.hot_value = ''

  dataMap.summaryPrompt = ''
  dataMap.eventLevel = ''
  dataMap.caseSourceObj = {}
  dataMap.advicePrompt = ''
  dataMap.warningPrompt = ''

  dataMap.eventEffect = []
  dataMap.eventDataCollection = []
  dataMap.eventTrend = []

  dataMap.casePrompt = ''
  dataMap.caseList = []
  dataMap.caseListShow = false
  dataMap.filePrompt = ''
  dataMap.fileList = []
  dataMap.fileListShow = false
  dataMap.searchPrompt = ''
  dataMap.searchList = []
}

// 提交
const searchClick = async (param: any) => {
  reset()
  const { source, aid, pos, selectType, keyWord, url, channelRate, list } = param
  dataMap.keyWord = keyWord
  dataMap.source = source
  dataMap.selectType = selectType
  dataMap.aid = aid
  try {
    await getChartDateClick(source, aid)

    await getReportPrompt('shijiangaishu', keyWord, '', url)

    await getReportPrompt('fengxiandengji', keyWord, '', url)

    dataMap.caseSourceObj = channelRate

    await getReportPrompt('chuzhijianyi', keyWord, '', url)

    await getReportPrompt('fengxianyujing', keyWord, '', url)

    await getReportResultClick(source, aid)

    await getArticleDateClick(source, aid, pos)

    setChartDateClick(source)

    const { caseList, caseContent } = await getCaseListClick(keyWord)
    await getReportPrompt('lishichuli', keyWord, caseContent, url)
    dataMap.caseList = caseList
    dataMap.caseListShow = true

    const { fileList, fileContent } = await getFileListClick(keyWord)
    await getReportPrompt('huiyingchuzhi', keyWord, fileContent, url)
    dataMap.fileList = fileList
    dataMap.fileListShow = true

    const { searchList, searchContent } = getSearchListClick(list)
    await getReportPrompt('guanlianredian', keyWord, searchContent, url)
    dataMap.searchList = searchList

    dataMap.isStop = true
    dataMap.loading = false
  } catch (error) {
    dataMap.isStop = true
    dataMap.loading = false
    console.error('发生错误3:', error)
  }
}

// 获取数据趋势
const getChartDateClick = async (source, aid) => {
  try {
    const res: any = await getEchartDataAjax(source, dataMap.timeId, aid)
    const { code, data } = res || {}
    if (code === 0) {
      dataMap.eventTrendCopy = JSON.parse(JSON.stringify(data))
    }
  } catch (error) {
    console.error('获取数据趋势:', error)
  }
}

const setChartDateClick = async (source: string) => {
  const obj = dataMap.eventTrendCopy
  let arr: any = []
  Object.keys(obj)?.forEach((el) => {
    if (ECHART_LABEL[el] && obj[el]?.length) {
      const x = []
      const y = []
      const y2 = ['0']
      obj[el].forEach((item: any) => {
        const timeMode = ['1', '2'].includes(dataMap.timeId) ? 'hour' : 'day'
        x.push(formatData(item.time, timeMode))
        y.push(item.num)
      })
      obj[`${el}_diff`].forEach((item: any) => {
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
  const index = arr.findIndex((el: any) => el.name === '热度值')
  if (index !== -1) {
    const Item = arr.splice(index, 1)[0]
    arr.unshift(Item)
  }

  // 当数据源为头条时,去除互动量数据
  if (source === 'toutiao') {
    arr = arr?.filter((el: any) => el.name !== '互动量')
  }

  dataMap.eventTrend = arr
}

// 事件影响力
const getReportResultClick = async (source: string, aid: string) => {
  try {
    const res: any = await getReportResultAjax(source, aid)
    const { code, data } = res || {}
    if (code === 0 && data) {
      const arr: any = []
      Object.keys(data)?.forEach((el) => {
        if (!data[el] || !EFFECT_PROP[el]) return
        arr.push({
          name: EFFECT_PROP[el],
          value: data[el],
        })
      })
      dataMap.eventEffect = arr
    }
  } catch (error: any) {
    console.error('事件影响力:', error)
  }
}

// 特殊源(特殊源无最高位次，用当前列表位次代替)
const isSpecialSource = (source: string) => {
  return ['weibo', 'zhihu', 'baidu'].includes(source)
}

// 获取文章详情（数据汇总）
const getArticleDateClick = async (source, aid, pos) => {
  try {
    const res: any = await getDetailAjax(source, aid)
    const { code, data } = res || {}
    if (code === 0 && data) {
      const { duration, read, interact, comment, origin, rank, collect, share, hot_value } = (data || {}) as any
      const arr: any = []
      dataMap.hot_value = getHot(hot_value)

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
      dataMap.eventDataCollection = arr
    }
  } catch (error: any) {
    console.error('获取文章详情:', error)
  }
}

// 获取热度值
const getHot = (value: any) => {
  return value ? bigNumberTransform(parseInt(value), true, 2) : '-'
}

// 数据处理
const getObj = (count: number, title: string) => {
  const [num, tip] = bigNumberTransform(Number(count))
  return {
    name: title,
    num: num || 0,
    unit: tip,
  }
}

// 获取案例列表
const getCaseListClick = async (keyWord: string) => {
  try {
    const res = await getCaseListAjax(keyWord)
    const { code, data, msg } = JSON.parse(JSON.stringify(res || {}))
    if (code === 0) {
      const newList = data?.length ? data.slice(0, 10) : []
      const content = newList.map((el: any) => `${el.case_id}-${el.title}`)
      return {
        caseList: newList,
        caseContent: content?.join(','),
      }
    } else {
      console.error('获取案例列表:', msg)
      return {}
    }
  } catch (error) {
    console.error('获取案例列表:', error)
    return {}
  }
}

// 获取文档列表
const getFileListClick = async (keyWord: string) => {
  try {
    const res = await getFileListAjax(keyWord)
    const { code, data, msg } = JSON.parse(JSON.stringify(res || {}))
    if (code === 0) {
      const newList = data?.length ? data.slice(0, 10) : []
      const content = newList.map((el: any) => `${el.doc_id}-${el.title}`)
      return {
        fileList: newList,
        fileContent: content?.join(','),
      }
    } else {
      console.error('获取文档列表报错:', msg)
      return {}
    }
  } catch (error) {
    console.error('获取文档列表报错:', error)
    return {}
  }
}

// 获取搜索列表
const getSearchListClick = (list: any) => {
  const content = list?.map((el: any) => {
    return `${el.aid}-${el.source}-${el.title}`
  })
  return {
    searchList: list,
    searchContent: content?.join(','),
  }
}

// 获取Prompt结果
const getReportPrompt = (type: string, prompt: string, content = '', url = '') => {
  // 当为舆情分析时，展示处置建议
  if (type === 'chuzhijianyi' && dataMap.selectType !== '2') return
  const param: any = {
    type: type, // 模块名
    prompt: prompt, // 关键词
    content: content, // 列表信息(案例、文档、搜索)
    url: url, // 关键词为链接，文本传空
    yanpan_type: MODE_PROP[dataMap.selectType], //分析类型
    version: 'V2', //V1-旧版，V2-新版
  }

  // 事件详情 - 传数据趋势
  if (type === 'shijiangaishu') param.data = JSON.stringify(dataMap.eventTrendCopy)

  return fetch(PROMPT_URL, {
    method: 'post',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(param),
  })
    .then((response) => {
      return response.body
    })
    .then((body: any) => {
      const reader = body.getReader()
      const decoder = new TextDecoder()
      let promptText = ''
      function read() {
        if (dataMap.isStop) throw new Error('停止生成了')
        return reader.read().then(async ({ done, value }) => {
          if (done) {
            dataMap[PROMPT_PROP[type]] = type !== 'fengxiandengji' ? deleteLastChar(dataMap[PROMPT_PROP[type]]) : promptText
            return
          }
          try {
            // prompt生成的文本
            const aiText = decoder.decode(value, { stream: true })
            // console.error("aiText", aiText);
            promptText = promptText + aiText
            if (type !== 'fengxiandengji') {
              await aiOutput(type, promptText)
            }
          } catch (error) {
            console.error('发生错误:', error)
          }
          return read()
        })
      }
      return read()
    })
    .catch((error) => {
      console.error('发生错误2:', error)
      throw new Error(error)
    })
}

// 渐进式输出
const aiOutput = async (type, word) => {
  let num = 0
  if (dataMap[PROMPT_PROP[type]]?.endsWith('|')) {
    num = dataMap[PROMPT_PROP[type]]?.length - 1
  }
  for (let i = num; i < word.length; i++) {
    if (!word[i]) break
    dataMap[PROMPT_PROP[type]] = deleteLastChar(dataMap[PROMPT_PROP[type]]) + word.charAt(i) + '|'
    await delayTimeClick()
  }
}

// 延时器
const delayTimeClick = () => {
  return new Promise((resolve) => {
    webWorker.postMessage({})
    webWorker.onmessage = () => {
      resolve(true)
    }
  })
}

// 图表时间选择
const timeTabClick = async (id: number | string) => {
  dataMap.timeId = id
  await getChartDateClick(dataMap.source, dataMap.aid)
  setChartDateClick(dataMap.source)
}

// 展示案例详情
const clickCaseHandle = () => {}

// 删除字符串最后一位
const deleteLastChar = (str: string) => {
  if (!str) return ''
  return str.slice(0, -1)
}

// 停止生成
const searchStop = () => {
  dataMap.isStop = true
  dataMap.loading = false
}

// 重新提交
const reSubmit = async (type, word) => {
  try {
    dataMap.isStop = false
    dataMap[PROMPT_PROP[type]] = '|'
    const text = word || dataMap.keyWord
    await getReportPrompt(type, text)
    dataMap.isStop = true
  } catch (error) {
    dataMap.isStop = true
    console.error('重新提交失败:', error)
  }
}

onMounted(() => {
  setWatermark()
})

onBeforeUnmount(() => {
  clear()
  reset()
  if (webWorker) {
    webWorker.terminate()
    webWorker = null
  }
})

defineExpose({
  dataMap,
  searchClick,
  searchStop,
  reset,
})
</script>

<style scoped lang="less">
.report-wrap {
  width: 100%;
  min-height: 100%;
  padding: 40px 40px 30px;
  background: hsl(240, 33%, 99%);
  border-radius: 12px;
  box-shadow: 0 3px 16px 0 rgb(0 0 0 / 10%);
  box-sizing: border-box;
  position: relative;

  &::-webkit-scrollbar {
    display: none;
  }
}

.title {
  font-family: 'Source Han Sans CN', sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 32px;
  color: #05073b;
  text-align: center;
}

.prompt {
  font-family: 'Source Han Sans CN', sans-serif;
  font-size: 15px;
  font-weight: 350;
  line-height: 24px;
  color: #05073b;

  :deep(p) {
    margin: 0 !important;
    text-indent: 2em;
  }

  :deep(h1) {
    margin: 8px 0;
  }

  :deep(h2) {
    margin: 8px 0;
  }

  :deep(h3) {
    margin: 8px 0;
    font-weight: normal !important;
  }

  :deep(h4) {
    margin: 6px 0;
  }

  :deep(h5) {
    margin: 4px 0;
  }

  :deep(ol) {
    padding-left: 32px !important;
    margin: 0;

    p {
      margin: 0 !important;
      text-indent: 0 !important;
    }
  }

  :deep(ul) {
    padding-left: 32px !important;
    margin: 0;

    p {
      margin: 0 !important;
      text-indent: 0 !important;
    }
  }

  // :deep(li) {
  // position: relative;
  // &::before {
  //   position: absolute;
  //   left: -1em;
  //   color: black;
  //   content: '•';
  // }
  // }
}

.chart-item + .chart-item {
  margin-top: 20px;
}

.effect-item + .effect-item {
  margin-top: 14px;
}
</style>
