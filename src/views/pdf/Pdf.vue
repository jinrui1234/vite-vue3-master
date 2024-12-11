<template>
  <div
    :class="[Number(isHistory) ? 'report-history-wrap' : 'report-history-pdf-wrap']"
    v-loading="dataMap.loading"
    element-loading-text="加载中..."
    element-loading-background="rgba(122, 122, 122, 0.05)"
  >
    <div :class="[Number(isHistory) ? 'content' : '']" v-if="!dataMap.loading">
      <div class="title">{{ `【${dataMap.keyWord}舆情报告】` }}</div>

      <ReportDoor />

      <!-- 事件概述 -->
      <template v-if="dataMap.summaryPrompt">
        <LabelWrap title="事件概述" style="margin: 10px 0" :isShowBtn="false" />
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
        <LabelWrap title="处置建议" style="margin-bottom: 10px" :isShowBtn="false" />
        <div class="prompt" style="margin-bottom: 20px" v-html="marked(dataMap.advicePrompt)"></div>
      </template>

      <!-- 风险预警 -->
      <template v-if="dataMap.warningPrompt">
        <LabelWrap title="风险预警" style="margin-bottom: 10px" :isShowBtn="false" />
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
      <EventList v-if="dataMap.casePrompt" title="历史处置情况" :list="dataMap.caseList" :isShowBtn="false" :listShow="dataMap.caseListShow">
        <div class="prompt" v-html="marked(dataMap.casePrompt)"></div>
      </EventList>

      <!-- 回应处置参考 -->
      <EventList v-if="dataMap.filePrompt" title="回应处置参考" :list="dataMap.fileList" :isShowBtn="false" :listShow="dataMap.fileListShow">
        <div class="prompt" v-html="marked(dataMap.filePrompt)"></div>
      </EventList>

      <!-- 关联热点 -->
      <EventList v-if="dataMap.searchPrompt" title="关联热点" :list="dataMap.searchList" :isShowBtn="false" :listShow="!!dataMap.searchList?.length">
        <div class="prompt" v-html="marked(dataMap.searchPrompt)"></div>
      </EventList>
    </div>

    <!-- 下载 -->
    <div class="operate-wrap" v-if="Number(isHistory) && !dataMap.loading">
      <div class="stop-btn" v-if="dataMap.downloadLoading">
        <img class="download-icon" src="@/assets/img/report/download-icon.webp" alt="" />
        <span class="download">下载中</span>
      </div>
      <div class="stop-btn" @click="downloadClick" v-else>
        <img src="@/assets/img/report/download-icon.png" alt="" />
        <span>下载</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { marked } from 'marked'
import { getOldReportDetailAjax } from '@/api/history'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@/utils/message'
import { getHost } from '@/utils/util'
import { pdfDownloadAjax } from '@/api/home'

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

const { id, isHistory } = useRoute()?.query || {}
const router = useRouter()

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

  // 数据趋势-时间
  timeId: '2',

  loading: false,
  downloadLoading: false,
})

// 获取历史详情
const getReportDetail = () => {
  dataMap.loading = true
  getOldReportDetailAjax(id, isHistory)
    .then((res: any) => {
      const { code, msg, data } = res || {}
      if (code === 0) {
        const obj = data?.content
        if (obj) setDataMap(obj)
      } else {
        Message('error', msg)
      }
    })
    .catch((error) => {
      Message('error', error)
    })
    .finally(() => {
      dataMap.loading = false
    })
}

const setDataMap = (param: any) => {
  const config = JSON.parse(param || '{}')
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

  // 数据趋势-时间
  dataMap.timeId = config.timeId
}

//下载
const downloadClick = async () => {
  dataMap.downloadLoading = true
  const url = router.resolve({
    name: 'Pdf',
    query: {
      isHistory: 0,
      id: id,
    },
  })
  try {
    const param = {
      url: getHost() + url.href,
      fileName: dataMap.keyWord,
    }
    const res = await pdfDownloadAjax(param)
    if (res?.status === 200) {
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = param.fileName || new Date().getTime()
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  } catch (error) {
    Message('error', '系统错误,请刷新后重试')
  }
  dataMap.downloadLoading = false
}

onMounted(() => {
  getReportDetail()
})
</script>
<style scoped lang="less">
.report-history-wrap {
  width: 100%;
  height: 100%;
  padding-left: calc(50% - 500px);
  padding-right: calc(50% - 500px);
  padding-top: 20px;
  padding-bottom: 10px;
  box-sizing: border-box;
  overflow-y: overlay;
  font-family: 'Microsoft YaHei', sans-serif;
  &::-webkit-scrollbar {
    display: none;
  }

  .content {
    width: 100%;
    min-height: calc(100% - 30px);
    border-radius: 12px;
    box-sizing: border-box;
    background-color: #fff;
    padding: 40px 40px 30px;
    background: hsl(240, 33%, 99%);
    box-shadow: 0 3px 16px 0 rgb(0 0 0 / 10%);
  }
}

.report-history-pdf-wrap {
  width: 100%;
  height: auto;
  min-width: 1100px;
  min-height: 100%;
  overflow-y: overlay;
  background: #fdfdfe;
  box-sizing: border-box;
  padding: 40px 40px 30px;
  font-family: 'Microsoft YaHei', sans-serif;
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
}

.operate-wrap {
  display: flex;
  justify-content: flex-end;
  .stop-btn {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 30px;
    padding-right: 12px;

    &:hover {
      opacity: 0.8;
    }

    img {
      width: 15px;
      height: 15px;
      margin-right: 2px;
      margin-bottom: 0.5px;
      cursor: pointer;
    }

    .download-icon {
      width: 18px;
      height: 18px;
    }

    span {
      font-size: 14px;
      color: #4955f5;
      cursor: pointer;
    }

    .download {
      cursor: not-allowed !important;
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
