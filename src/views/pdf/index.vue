<template>
  <div class="report-wrap">
    <div class="title">{{ `【${dataMap.keyWord}舆情报告】` }}</div>

    <ReportDoor />

    <!-- 事件概述 -->
    <template v-if="dataMap.summaryPrompt">
      <LabelWrap title="事件概述" style="margin: 10px 0" :disabled="!dataMap.isStop" />
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
      <LabelWrap title="处置建议" style="margin-bottom: 10px" :disabled="!dataMap.isStop" />
      <div class="prompt" style="margin-bottom: 20px" v-html="marked(dataMap.advicePrompt)"></div>
    </template>

    <!-- 风险预警 -->
    <template v-if="dataMap.warningPrompt">
      <LabelWrap title="风险预警" style="margin-bottom: 10px" :disabled="!dataMap.isStop" />
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
      <TimeTab style="margin-bottom: 20px" :id="dataMap.timeId" />
    </template>

    <template v-if="dataMap.eventTrend?.length">
      <ChartItem class="chart-item" v-for="el of dataMap.eventTrend" :key="el.id" :name="el.name" :id="el.id" :x="el.x" :y="el.y" :y2="el.y2" />
    </template>
    <Empty v-if="dataMap.hot_value && !dataMap.eventTrend?.length" />

    <!-- 历史处置情况 -->
    <EventList v-if="dataMap.casePrompt" title="历史处置情况" :list="dataMap.caseList" :isStop="dataMap.isStop" :listShow="dataMap.caseListShow">
      <div class="prompt" v-html="marked(dataMap.casePrompt)"></div>
    </EventList>

    <!-- 回应处置参考 -->
    <EventList v-if="dataMap.filePrompt" title="回应处置参考" :list="dataMap.fileList" :isStop="dataMap.isStop" :listShow="dataMap.fileListShow">
      <div class="prompt" v-html="marked(dataMap.filePrompt)"></div>
    </EventList>

    <!-- 关联热点 -->
    <EventList
      v-if="dataMap.searchPrompt"
      title="关联热点"
      :list="dataMap.searchList"
      :isStop="dataMap.isStop"
      :listShow="!!dataMap.searchList?.length"
    >
      <div class="prompt" v-html="marked(dataMap.searchPrompt)"></div>
    </EventList>
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { marked } from 'marked'
import { useRoute } from 'vue-router'

import ReportDoor from '@/views/aiReport/component/ReportDoor.vue'
import LabelWrap from '@/views/aiReport/component/LabelWrap.vue'
import LevelWrap from '@/views/aiReport/component/LevelWrap.vue'
import SourceRatio from '@/views/aiReport/component/SourceRatio.vue'
import DataCaptureWrap from '@/views/aiReport/component/DataCaptureWrap.vue'
import EventList from '@/views/aiReport/component/EventList.vue'
import HotWrap from '@/views/aiReport/component/HotWrap.vue'
import TimeTab from '@/views/aiReport/component/TimeTab.vue'
import EventEffect from '@/views/aiReport/component/EventEffect.vue'
import ChartItem from '@/views/aiReport/component/ChartItem.vue'
import Empty from '@/views/aiReport/component/Empty.vue'

const { pdfConfig } = useRoute()?.query || {}
const dataMap = reactive({
  keyWord: '',
  hot_value: '', // 热度值

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

  // 数据来源
  source: '',
  aid: '',
  // 研判类型
  selectType: '',

  // 停止生成
  isStop: true,
  loading: false,
  // 数据趋势-时间
  timeId: '2',
})

onMounted(() => {
  const config = JSON.parse(pdfConfig || '{}')
  dataMap.keyWord = config.keyWord
  dataMap.hot_value = config.hot_value // 热度值

  // 事件概述
  dataMap.summaryPrompt = config.summaryPrompt
  // 事件等级
  dataMap.eventLevel = config.eventLevel
  // 数据来源占比
  dataMap.caseSourceObj = config.caseSourceObj
  //事件影响力
  dataMap.eventEffect = config.eventEffect
  // 处置建议
  dataMap.advicePrompt = config.advicePrompt
  // 风险预警
  dataMap.warningPrompt = config.warningPrompt
  // 数据汇总
  dataMap.eventDataCollection = config.eventDataCollection
  // 数据趋势
  dataMap.eventTrend = config.eventTrend
  dataMap.eventTrendCopy = config.eventTrendCopy

  // 历史处置情况
  dataMap.casePrompt = config.casePrompt
  // 历史处置情况-列表
  dataMap.caseList = config.caseList
  dataMap.caseListShow = config.caseListShow
  // 回应处置参考
  dataMap.filePrompt = config.filePrompt
  // 回应处置参考-列表
  dataMap.fileList = config.fileList
  dataMap.fileListShow = config.fileListShow
  // 关联热点
  dataMap.searchPrompt = config.searchPrompt
  // 热点列表
  dataMap.searchList = config.searchList

  // 数据来源
  dataMap.source = config.source
  dataMap.aid = config.aid
  // 研判类型
  dataMap.selectType = config.selectType

  // 停止生成
  dataMap.isStop = config.isStop
  dataMap.loading = config.loading
  // 数据趋势-时间
  dataMap.timeId = config.timeId
})
</script>
<style scoped lang="less">
.report-wrap {
  width: 100%;
  height: auto;
  min-width: 1100px;
  min-height: 100%;
  overflow-y: overlay;
  background: #fdfdfe;
  box-sizing: border-box;
  padding: 40px 40px 30px;
  font-family: 'Microsoft YaHei', sans-serif;

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

:deep(.left-nav-container) {
  display: none !important;
}

:deep(.footer-container) {
  display: none !important;
}

.chart-item + .chart-item {
  margin-top: 20px;
}

.effect-item + .effect-item {
  margin-top: 14px;
}
</style>
