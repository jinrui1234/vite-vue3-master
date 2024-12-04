<!-- eslint-disable vue/no-lone-template -->
<template>
  <div class="ai-report-container">
    <!-- 报告页封面 -->
    <div class="content">
      <Slogan v-show="!dataMap.keyWord" />
      <Search ref="searchRef" @submit="onSubmit" v-show="!dataMap.keyWord" />

      <Report ref="reportRef" v-if="dataMap.keyWord" />
    </div>

    <div class="operate-wrap" v-if="dataMap.keyWord">
      <!-- 下载 -->
      <template v-if="stopStatus">
        <div class="stop-btn" v-if="dataMap.downloadLoading">
          <img src="@/assets/img/report/download-icon.webp" alt="" />
          <span class="download">下载中</span>
        </div>
        <div class="stop-btn" @click="downloadClick" v-else>
          <img src="@/assets/img/report/download-icon.png" alt="" />
          <span>下载</span>
        </div>
      </template>

      <!-- 停止/重新生成按钮 -->
      <div class="stop-btn" v-if="!stopStatus" @click="stopBtnClick">
        <img src="@/assets/img/report/earth-icon.webp" alt="" />
        <span>停止生成</span>
      </div>
      <div class="stop-btn" v-else @click="resetBtnClick">
        <img src="@/assets/img/report/reset-icon.png" alt="" />
        <span>重新生成</span>
      </div>
    </div>

    <!-- 生成状态展示 -->
    <div class="loading-wrap" v-if="dataMap.keyWord && !stopStatus">
      <img src="@/assets/img/report/loading-icon.webp" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import eventBus from '@/utils/mitt'
import { useRouter } from 'vue-router'
import { Message } from '@/utils/message'
import { getHost } from '@/utils/util'
import { resetCountAjax } from '@/api/auth'
import { pdfDownloadAjax } from '@/api/home'

import Slogan from './component/Slogan.vue'
import Search from './component/Search.vue'
import Report from './component/Report.vue'

const router = useRouter()

const reportRef = ref(null)
const searchRef = ref(null)
const timer = ref(null)

const dataMap = reactive({
  keyWord: '',

  downloadLoading: false,
  loading: false,
})

// 停止状态
const stopStatus = computed(() => {
  return reportRef.value?.dataMap?.isStop
})

const loadingStatus = computed(() => {
  return reportRef.value?.dataMap?.loading
})

// 提交
const onSubmit = (param: any) => {
  dataMap.keyWord = param.keyWord
  resetCount()
  nextTick(() => {
    reportRef.value?.searchClick(param)
  })
}

const resetCount = () => {
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

// 开启新对话
const reportStopClick = () => {
  if (dataMap.keyWord && !stopStatus.value) {
    Message('error', '稍等片刻，等助手回复完毕再开启新对话哦~')
    return
  }
  dataMap.keyWord = ''
  stopBtnClick()
}

//下载
const downloadClick = async () => {
  dataMap.downloadLoading = true
  const url = router.resolve({
    name: 'Pdf',
    query: {
      pdfConfig: JSON.stringify(reportRef.value?.dataMap),
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

// 停止生成
const stopBtnClick = () => {
  reportRef.value?.searchStop()
}

//重新生成
const resetBtnClick = () => {
  searchRef.value?.getCount(dataMap.keyWord)
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

watch(loadingStatus, (value) => {
  const node = document.getElementsByClassName('content')?.[0]
  if (value) {
    addIntervalClick(node)
    // 添加鼠标事件
    node?.addEventListener('wheel', (e) => wheelEvent(e, node))
  } else {
    if (timer.value) {
      setTimeout(() => {
        clearInterval(timer.value)
        timer.value = null
      }, 600)
    }
    // 移除鼠标事件
    node?.removeEventListener('wheel', (e) => wheelEvent(e, node))
  }
})

watch(
  () => dataMap.keyWord,
  (value) => {
    const node = document.getElementsByClassName('footer-container')?.[0]
    if (node) node.style.display = value ? 'none' : 'flex'
  },
  { immediate: true }
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
}

.content {
  width: 100%;
  height: calc(100% - 30px);
  border-radius: 12px;
  box-sizing: border-box;
  overflow-y: overlay;
  position: relative;

  &::-webkit-scrollbar {
    display: none;
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
