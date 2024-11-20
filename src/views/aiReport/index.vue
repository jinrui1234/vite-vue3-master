<template>
  <div class="ai-report-container">
    <!-- 报告页封面 -->
    <div class="report-content">
      <template v-if="!dataMap.keyWord">
        <Slogan />
        <Search ref="searchRef" @submit="onSubmit" />
      </template>

      <template v-else>
        <Report ref="reportRef" />
      </template>
    </div>

    <template v-if="dataMap.keyWord">
      <!-- 停止/重新生成按钮 -->
      <div class="stop-btn" v-if="!stopStatus" @click="stopBtnClick">
        <img src="@/assets/img/report/earth-icon.webp" alt="" />
        <span>停止生成</span>
      </div>
      <div class="stop-btn" v-else @click="resetBtnClick">
        <img src="@/assets/img/report/reset-icon.png" alt="" />
        <span>重新生成</span>
      </div>
    </template>

    <!-- 生成状态展示 -->
    <div class="loading-wrap" v-if="dataMap.keyWord && !stopStatus">
      <img src="@/assets/img/report/loading-icon.webp" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick, computed, watch, onMounted, onUnmounted } from 'vue'
import eventBus from '@/utils/mitt'
import { ElMessage } from 'element-plus'
// import { getCountAjax, resetCountAjax } from '@/api/auth'
import Slogan from './component/Slogan.vue'
import Search from './component/Search.vue'
import Report from './component/Report.vue'

const reportRef = ref(null)
const searchRef = ref(null)
const timer = ref(null)

const dataMap = reactive({
  keyWord: '',
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
  nextTick(() => {
    reportRef.value?.searchClick(param)
  })
  // getCountAjax()
  //   .then((res: any) => {
  //     const { code, data, msg } = res || {}
  //     if (code === 0) {
  //       if (!data?.free_total) {
  //         ElMessage.error('暂无使用次数，请充值')
  //         return
  //       }
  //       dataMap.keyWord = param.keyWord
  //       resetCount()
  //       nextTick(() => {
  //         reportRef.value?.searchClick(param)
  //       })
  //     } else {
  //       ElMessage.error(msg)
  //     }
  //   })
  //   .catch((error) => {
  //     ElMessage.error(error)
  //   })
}

// const resetCount = () => {
//   resetCountAjax()
//     .then((res: any) => {
//       const { code, msg } = res || {}
//       if (code === 0) {
//       } else {
//         ElMessage.error(msg)
//       }
//     })
//     .catch((error) => {
//       ElMessage.error(error)
//     })
// }

// 开启新对话
const reportResetClick = () => {
  if (dataMap.keyWord && !stopStatus.value) {
    ElMessage.error('稍等片刻，等助手回复完毕再开启新对话哦~')
    return
  }
  dataMap.keyWord = ''
  stopBtnClick()
}

// 停止生成
const stopBtnClick = () => {
  reportRef.value?.searchStop()
}

//重新生成
const resetBtnClick = () => {
  searchRef.value?.handleSubmit(dataMap.keyWord)
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
  const node = document.getElementsByClassName('report-content')?.[0]
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

onMounted(() => {
  eventBus.on('reportReset', reportResetClick)
})
onUnmounted(() => {
  eventBus.off('reportReset', reportResetClick)
})
</script>

<style scoped lang="less">
.ai-report-container {
  width: 100%;
  height: 100%;
  padding-left: calc(50% - 495px);
  padding-right: calc(50% - 495px);
  padding-top: 25px;
  padding-bottom: 10px;
  box-sizing: border-box;
}

.report-content {
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
    margin-right: 3px;
    margin-bottom: 0.5px;
    cursor: pointer;
  }

  span {
    font-size: 14px;
    color: #4955f5;
    cursor: pointer;
  }
}

.loading-wrap {
  position: absolute;
  top: 42px;
  left: calc(50% - 495px - 40px);
  img {
    width: 32px;
    height: 32px;
  }
}
</style>
