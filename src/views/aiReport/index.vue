<!-- eslint-disable vue/no-lone-template -->
<template>
  <div class="ai-report-container">
    <!-- 报告页封面 -->
    <div class="content">
      <Slogan v-show="!dataMap.keyWord" />
      <Search ref="searchRef" @submit="onSubmit" @start="onStart" v-show="!dataMap.keyWord" />

      <div class="report-wrap" v-if="dataMap.keyWord">
        <div class="title">{{ `【${dataMap.keyWord}舆情报告】` }}</div>
        <ReportDoor />
        <Report ref="reportRef" v-if="dataMap.reportMode === '1'" :isStop="dataMap.isStop" @statusOperate="statusOperateClick" />
        <PureReport ref="pureReportRef" v-if="dataMap.reportMode === '2'" :isStop="dataMap.isStop" @statusOperate="statusOperateClick" />
      </div>
    </div>

    <div class="operate-wrap" v-if="dataMap.keyWord">
      <!-- 下载 -->
      <template v-if="dataMap.isStop && !dataMap.loading">
        <div class="stop-btn" v-if="dataMap.downloadLoading">
          <img class="download-icon" src="@/assets/img/report/download-icon.webp" alt="" />
          <span class="download">下载中</span>
        </div>
        <div class="stop-btn" @click="downloadClick" v-else>
          <img src="@/assets/img/report/download-icon.png" alt="" />
          <span>下载</span>
        </div>
      </template>

      <!-- 停止/重新生成按钮 -->
      <div class="stop-btn" v-if="!dataMap.isStop" @click="stopBtnClick">
        <img src="@/assets/img/report/earth-icon.webp" alt="" />
        <span>停止生成</span>
      </div>
      <div class="stop-btn" v-else @click="resetBtnClick">
        <img src="@/assets/img/report/reset-icon.png" alt="" />
        <span>重新生成</span>
      </div>
    </div>

    <!-- 生成状态展示 -->
    <div class="loading-wrap" v-if="dataMap.keyWord && (!dataMap.isStop || dataMap.loading)">
      <img src="@/assets/img/report/loading-icon.webp" alt="" />
    </div>

    <FooterBar style="margin-bottom: 14px" v-if="!dataMap.keyWord" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick, watch, onMounted, onBeforeUnmount } from 'vue'
import eventBus from '@/utils/mitt'
import { useRouter } from 'vue-router'
import { Message } from '@/utils/message'
import { getHost } from '@/utils/util'
import { REPORT_TYPE } from './config'

import { resetCountAjax } from '@/api/auth'
import { pdfDownloadAjax } from '@/api/home'
import { saveOldReportAjax } from '@/api/history'

import Slogan from './component/Slogan.vue'
import Search from './component/Search.vue'
import ReportDoor from './component/ReportDoor.vue'

import FooterBar from '@/component/FooterBar.vue'

import Report from './mode/Report.vue'
import PureReport from './mode/PureReport.vue'

const router = useRouter()

const reportRef = ref(null)
const pureReportRef = ref(null)

const searchRef = ref(null)
const timer = ref(null)

const dataMap = reactive({
  keyWord: '',
  reportMode: '', // 1-公共模版 2-大模型模版

  loading: false,
  isStop: true,
  downloadLoading: false,
})

// 状态设置
const statusOperateClick = (isStop: any, loading: any) => {
  if (isStop !== 'undefined') dataMap.isStop = isStop
  if (loading !== 'undefined') dataMap.loading = loading
}

// 开始搜索
const onStart = (text: string) => {
  dataMap.keyWord = text
  dataMap.loading = true
}

// 提交
const onSubmit = (param: any) => {
  dataMap.reportMode = param?.reportMode
  updateCount()
  nextTick(() => {
    dataMap.isStop = false
    dataMap.reportMode === '1' ? reportRef.value?.searchClick(param) : pureReportRef.value?.searchClick(param)
  })
}

// 开启新对话
const reportStopClick = () => {
  if (dataMap.keyWord && !dataMap.isStop) {
    Message('error', '稍等片刻，等助手回复完毕再开启新对话哦~')
    return
  }
  dataMap.keyWord = ''
  dataMap.reportMode = ''
  stopBtnClick()
}

//下载
const downloadClick = async () => {
  dataMap.downloadLoading = true
  const pdfConfig = dataMap.reportMode === '1' ? reportRef.value?.dataMap : pureReportRef.value?.dataMap
  const name = REPORT_TYPE[dataMap.reportMode]
  const url = router.resolve({
    name: name,
    query: {
      isHistory: 0,
      pdfConfig: JSON.stringify(pdfConfig),
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
    console.error(error)
  }
  dataMap.downloadLoading = false
}

// 保存历史报告
const saveOldReportClick = () => {
  const content = dataMap.reportMode === '1' ? reportRef.value?.dataMap : pureReportRef.value?.dataMap
  const param = {
    title: dataMap.keyWord,
    content: JSON.stringify(content),
    type: dataMap.reportMode,
  }
  saveOldReportAjax(param)
    .then((res: any) => {
      const { code, msg } = res || {}
      if (code !== 0) {
        Message('error', msg)
      }
    })
    .catch((error) => {
      Message('error', error)
    })
}

// 停止生成
const stopBtnClick = () => {
  dataMap.isStop = true
  dataMap.loading = false
}

//重新生成
const resetBtnClick = () => {
  dataMap.reportMode === '1' ? reportRef.value?.reset() : pureReportRef.value?.reset()
  searchRef.value?.getCountClick(dataMap.keyWord)
}

// 更新报告使用次数
const updateCount = () => {
  resetCountAjax()
    .then((res: any) => {
      const { code, msg } = res || {}
      if (code === 0) {
      } else {
        Message('error', msg)
      }
    })
    .catch((error) => {
      Message('error', error)
    })
}

// 添加定时器
const addIntervalClick = (node: any) => {
  timer.value = setInterval(() => {
    node.scrollTop = node?.scrollHeight
  }, 500)
}

// 鼠标事件
const wheelEvent = (e: any, node: any) => {
  if (e.deltaY < 0) {
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
  } else {
    if (node?.scrollTop + node?.clientHeight > node?.scrollHeight - 10) {
      if (!timer.value) addIntervalClick(node)
    }
  }
}

watch(
  () => dataMap.loading,
  (value) => {
    const node = document.getElementsByClassName('content')?.[0]
    if (value) {
      addIntervalClick(node)
      node?.addEventListener('wheel', (e) => wheelEvent(e, node))
    } else {
      if (timer.value) {
        setTimeout(() => {
          clearInterval(timer.value)
          timer.value = null
        }, 600)
      }
      node?.removeEventListener('wheel', (e) => wheelEvent(e, node))
    }
  }
)

watch(
  () => dataMap.isStop,
  (value: boolean) => {
    if (value && dataMap.reportMode) {
      setTimeout(() => {
        saveOldReportClick()
      }, 500)
    }
  }
)

onMounted(() => {
  eventBus.on('reportStop', reportStopClick)
})
onBeforeUnmount(() => {
  stopBtnClick()
  eventBus.off('reportStop', reportStopClick)
})
</script>

<style scoped lang="less">
.ai-report-container {
  width: 100%;
  height: 100%;
  padding-left: calc(50% - 500px);
  padding-right: calc(50% - 500px);
  padding-top: 20px;
  padding-bottom: 10px;
  box-sizing: border-box;
  font-family: 'Microsoft YaHei', sans-serif;
  position: relative;
}

.content {
  width: 100%;
  height: calc(100% - 30px);
  border-radius: 12px;
  overflow-y: overlay;
  &::-webkit-scrollbar {
    display: none;
  }

  .report-wrap {
    width: 100%;
    min-height: 100%;
    padding: 40px 40px 30px;
    background: hsl(240, 33%, 99%);
    box-shadow: 0 3px 16px 0 rgb(0 0 0 / 10%);
    box-sizing: border-box;
    .title {
      font-family: 'Source Han Sans CN', sans-serif;
      font-size: 28px;
      font-weight: 700;
      line-height: 32px;
      color: #05073b;
      text-align: center;
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
  .stop-btn + .stop-btn {
    margin-left: 6px;
  }
}

.loading-wrap {
  position: absolute;
  top: 42px;
  left: calc(50% - 500px - 40px);
  img {
    width: 32px;
    height: 32px;
  }
}
</style>
