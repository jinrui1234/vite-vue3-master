<template>
  <div>
    <!-- 事件概述 -->
    <template v-if="dataMap.summaryPrompt">
      <LabelWrap title="事件概述" style="margin: 10px 0" :disabled="!isStop" @re-submit="reSubmit('shijiangaishu', $event)" />
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
      <LabelWrap title="处置建议" style="margin-bottom: 10px" :disabled="!isStop" @re-submit="reSubmit('chuzhijianyi', $event)" />
      <div class="prompt" style="margin-bottom: 20px" v-html="marked(dataMap.advicePrompt)"></div>
    </template>

    <!-- 风险预警 -->
    <template v-if="dataMap.warningPrompt">
      <LabelWrap title="风险预警" style="margin-bottom: 10px" :disabled="!isStop" @re-submit="reSubmit('fengxianyujing', $event)" />
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
      :isStop="isStop"
      :listShow="dataMap.caseListShow"
      @re-submit="reSubmit('lishichuli', $event)"
    >
      <div class="prompt" v-html="marked(dataMap.casePrompt)"></div>
    </EventList>

    <!-- 回应处置参考 -->
    <EventList
      v-if="dataMap.filePrompt"
      title="回应处置参考"
      :list="dataMap.fileList"
      :isStop="isStop"
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
      :isStop="isStop"
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
import { deleteLastChar } from '@/utils/util'
import { PROMPT_PROP, PROMPT_WHITE_TYPE } from '../config'
import { getCurveDateClick, getReportResultClick, getCaseListClick, getFileListClick, getArticleDateClick } from '@/views/aiReport/ajax.js'
import { getReportPromptAjax } from '@/api/home'

import LabelWrap from '../component/LabelWrap.vue'
import LevelWrap from '../component/LevelWrap.vue'
import SourceRatio from '../component/SourceRatio.vue'
import DataCaptureWrap from '../component/DataCaptureWrap.vue'
import EventList from '../component/EventList.vue'
import HotWrap from '../component/HotWrap.vue'
import TimeTab from '../component/TimeTab.vue'
import EventEffect from '../component/EventEffect.vue'
import ChartItem from '../component/ChartItem.vue'
import Empty from '../component/Empty.vue'

const emit = defineEmits(['statusOperate'])
const prop = defineProps({
  isStop: {
    type: Boolean,
  },
})

const { setWatermark, clearWatermark } = useWatermark()
let webWorker = new Worker(new URL('../worker.js', import.meta.url), {
  type: 'module',
})

const dataMap = reactive({
  keyWord: '',
  url: '',
  aid: '',
  source: '', // 数据来源
  selectType: '', // 研判类型
  hot_value: '', // 热度值

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

  // 历史处置情况
  casePrompt: '',
  casePromptList: [],
  caseList: [],
  caseListShow: false,

  // 回应处置参考
  filePrompt: '',
  fileList: [],
  fileListShow: false,

  // 关联热点
  searchPrompt: '',
  searchList: [],
})

// 重置
const reset = () => {
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
  dataMap.casePromptList = []
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
  const { source, aid, pos, selectType, keyWord, url = '', channelRate, list } = param
  dataMap.keyWord = keyWord
  dataMap.url = url
  dataMap.aid = aid
  dataMap.source = source
  dataMap.selectType = selectType

  try {
    // 数据趋势
    const { curveDate, curveDealDate } = await getCurveDateClick(source, aid, dataMap.timeId)

    // 事件概述
    await getReportPrompt({ type: 'shijiangaishu', data: JSON.stringify(curveDate) })

    // 风险等级
    await getReportPrompt({ type: 'fengxiandengji' })

    // 数据来源
    dataMap.caseSourceObj = channelRate

    // 处置建议
    if (dataMap.selectType === 'yqfenxi') {
      await getReportPrompt({ type: 'chuzhijianyi' })
    }

    // 风险预警
    await getReportPrompt({ type: 'fengxianyujing' })

    //事件影响力
    const { eventEffect } = await getReportResultClick(source, aid)
    dataMap.eventEffect = eventEffect

    //数据总览
    const { hot_value, eventDataCollection } = await getArticleDateClick(source, aid, pos)
    dataMap.hot_value = hot_value
    dataMap.eventDataCollection = eventDataCollection

    // 数据趋势
    dataMap.eventTrend = curveDealDate

    // 历史处置情况
    const { caseList, caseContent } = await getCaseListClick(keyWord)
    // await getReportPrompt({ type: 'shengchenganli' })
    await getReportPrompt({ type: 'lishichuli', content: caseContent })
    dataMap.caseList = caseList
    dataMap.caseListShow = true

    // 回应处置参考
    const { fileList, fileContent } = await getFileListClick(keyWord)
    await getReportPrompt({ type: 'huiyingchuzhi', content: fileContent })
    dataMap.fileList = fileList
    dataMap.fileListShow = true

    // 关联热点
    const { searchList, searchContent } = getSearchListClick(list)
    await getReportPrompt({ type: 'guanlianredian', content: searchContent })
    dataMap.searchList = searchList

    statusOperateClick(true, false)
  } catch (error) {
    statusOperateClick(true, false)
    console.error('发生错误3:', error)
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
const getReportPrompt = async ({ type, content = '', data = '', regenerate = false, instruction = '', previous_report = '' }: any) => {
  const param: any = {
    type,
    prompt: dataMap.keyWord,
    data,
    content,
    url: dataMap.url,
    yanpan_type: dataMap.selectType,
    version: 'V2',
    regenerate,
    instruction,
    previous_report,
  }
  const flag = type === 'shengchenganli' ? true : false
  try {
    const response = await getReportPromptAjax(param, flag)
    if (!response.body) return
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let promptText = ''
    let outText = ''
    let finished = false

    // while循环获取字符串
    while (!finished && !prop.isStop) {
      try {
        const { done, value } = await reader.read()
        if (done) {
          finished = true
          if (PROMPT_WHITE_TYPE.includes(param.type)) {
            dataMap[PROMPT_PROP[type]] = promptText
          } else {
            dataMap[PROMPT_PROP[type]] = deleteLastChar(outText)
          }
        } else {
          // 字节流转字符串
          const newText = decoder.decode(value, { stream: true })
          const num = promptText?.length
          promptText = promptText + newText

          if (!PROMPT_WHITE_TYPE.includes(param.type)) {
            for (let i = num; i < promptText.length; i++) {
              outText = deleteLastChar(outText) + promptText.charAt(i) + '|'
              dataMap[PROMPT_PROP[type]] = outText
              await delayTimeClick()
            }
          }
        }
      } catch (error) {
        console.error('发生错误1:', error)
      }
    }
    if (prop.isStop) throw new Error('停止生成了')
  } catch (error: any) {
    console.error('发生错误2:', error)
    throw new Error(error)
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
  const { curveDealDate } = await getCurveDateClick(dataMap.source, dataMap.aid, id)
  dataMap.eventTrend = curveDealDate
}

// 重新提交
const reSubmit = async (type: string, text: string) => {
  const param = {
    type: type,
    regenerate: true,
    instruction: text,
    previous_report: dataMap[PROMPT_PROP[type]],
  }
  try {
    statusOperateClick(false)
    dataMap[PROMPT_PROP[type]] = '|'
    await getReportPrompt(param)
    statusOperateClick(true)
  } catch (error) {
    statusOperateClick(true)
    console.error('重新提交失败:', error)
  }
}

// 状态操作
const statusOperateClick = (isStop?: boolean, loading?: boolean) => {
  emit('statusOperate', isStop, loading)
}

onMounted(() => {
  setWatermark()
})

onBeforeUnmount(() => {
  reset()
  clearWatermark()
  if (webWorker) {
    webWorker.terminate()
    webWorker = null
  }
})

defineExpose({
  dataMap,
  searchClick,
  reset,
})
</script>

<style scoped lang="less">
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
}

.chart-item + .chart-item {
  margin-top: 20px;
}

.effect-item + .effect-item {
  margin-top: 14px;
}
</style>
