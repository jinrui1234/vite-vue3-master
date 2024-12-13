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
        <LabelWrap title="事件概述" style="margin-top: 10px" :isShowBtn="false" />
        <div class="prompt" v-html="marked(dataMap.summaryPrompt)"></div>
      </template>

      <!-- 风险等级 -->
      <template v-if="dataMap.eventLevel">
        <LabelWrap title="风险等级" style="margin-top: 10px" :isShowBtn="false" />
        <div style="display: flex; justify-content: center">
          <LevelWrap :level="dataMap.eventLevel" />
        </div>
      </template>

      <!-- 处置建议 -->
      <template v-if="dataMap.advicePrompt">
        <LabelWrap title="处置建议" style="margin-top: 10px" :isShowBtn="false" />
        <div class="prompt" v-html="marked(dataMap.advicePrompt)"></div>
      </template>

      <!-- 风险预警 -->
      <template v-if="dataMap.warningPrompt">
        <LabelWrap title="风险预警" style="margin-top: 10px" :isShowBtn="false" />
        <div class="prompt" v-html="marked(dataMap.warningPrompt)"></div>
      </template>

      <!-- 历史处置 -->
      <template v-if="dataMap.casePrompt">
        <LabelWrap title="历史处置情况" style="margin-top: 10px" :isShowBtn="false" />
        <div class="prompt" v-html="marked(dataMap.casePrompt)"></div>
      </template>

      <!-- 回应处置参考 -->
      <template v-if="dataMap.filePrompt">
        <LabelWrap title="回应处置参考" style="margin-top: 10px" :isShowBtn="false" />
        <div class="prompt" v-html="marked(dataMap.filePrompt)"></div>
      </template>

      <!-- 关联热点 -->
      <template v-if="dataMap.searchPrompt">
        <LabelWrap title="关联热点" style="margin-top: 10px" :isShowBtn="false" />
        <div class="prompt" v-html="marked(dataMap.searchPrompt)"></div>
      </template>
    </div>

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

import LabelWrap from '@/views/aiReport/component/LabelWrap.vue'
import LevelWrap from '@/views/aiReport/component/LevelWrap.vue'
import ReportDoor from '@/views/aiReport/component/ReportDoor.vue'

const { id, isHistory } = useRoute()?.query || {}
const router = useRouter()

const dataMap = reactive({
  keyWord: '',

  // 事件概述
  summaryPrompt: '',
  // 事件等级
  eventLevel: '',
  // 处置建议
  advicePrompt: '',
  // 风险预警
  warningPrompt: '',

  // 历史处置情况
  casePrompt: '',
  // 回应处置参考
  filePrompt: '',
  // 关联热点
  searchPrompt: '',

  // 停止生成
  loading: false,
  // 下载loading
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

  dataMap.summaryPrompt = config.summaryPrompt
  dataMap.eventLevel = config.eventLevel
  dataMap.advicePrompt = config.advicePrompt
  dataMap.warningPrompt = config.warningPrompt

  dataMap.casePrompt = config.casePrompt
  dataMap.filePrompt = config.filePrompt
  dataMap.searchPrompt = config.searchPrompt
}

//下载
const downloadClick = async () => {
  dataMap.downloadLoading = true
  const url = router.resolve({
    name: 'PurePdf',
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
  background: #d2e9fe;
  background-image: url('http://download.ainewdata.com/download/images/wanxiang/bg-icon.png');
  background-repeat: no-repeat;
  background-size: 100% 599px;
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
</style>
