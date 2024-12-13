<template>
  <div>
    <!-- 事件概述 -->
    <template v-if="dataMap.summaryPrompt">
      <LabelWrap title="事件概述" style="margin-top: 10px" :disabled="!isStop" @re-submit="reSubmit('shijiangaishu', $event)" />
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
      <LabelWrap title="处置建议" style="margin-top: 10px" :disabled="!isStop" @re-submit="reSubmit('chuzhijianyi', $event)" />
      <div class="prompt" v-html="marked(dataMap.advicePrompt)"></div>
    </template>

    <!-- 风险预警 -->
    <template v-if="dataMap.warningPrompt">
      <LabelWrap title="风险预警" style="margin-top: 10px" :disabled="!isStop" @re-submit="reSubmit('fengxianyujing', $event)" />
      <div class="prompt" v-html="marked(dataMap.warningPrompt)"></div>
    </template>

    <!-- 历史处置 -->
    <template v-if="dataMap.casePrompt">
      <LabelWrap title="历史处置情况" style="margin-top: 10px" :isShowBtn="false" @re-submit="reSubmit('lishichuli', $event)" />
      <div class="prompt" v-html="marked(dataMap.casePrompt)"></div>
    </template>

    <!-- 回应处置参考 -->
    <template v-if="dataMap.filePrompt">
      <LabelWrap title="回应处置参考" style="margin-top: 10px" :isShowBtn="false" @re-submit="reSubmit('huiyingchuzhi', $event)" />
      <div class="prompt" v-html="marked(dataMap.filePrompt)"></div>
    </template>

    <!-- 关联热点 -->
    <template v-if="dataMap.searchPrompt">
      <LabelWrap title="关联热点" style="margin-top: 10px" :isShowBtn="false" @re-submit="reSubmit('guanlianredian', $event)" />
      <div class="prompt" v-html="marked(dataMap.searchPrompt)"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount } from 'vue'
import { marked } from 'marked'
import { useWatermark } from '@/utils/waterMark'
import { PROMPT_PROP, MODE_PROP, PROMPT_URL } from '../config'

import LabelWrap from '../component/LabelWrap.vue'
import LevelWrap from '../component/LevelWrap.vue'

const emit = defineEmits(['statusOperate'])

const prop = defineProps({
  isStop: {
    type: Boolean,
  },
})

const { setWatermark, clear } = useWatermark()
let webWorker = new Worker(new URL('../worker.js', import.meta.url), {
  type: 'module',
})
const dataMap = reactive({
  keyWord: '',
  url: '',

  selectType: '', // 研判类型

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
  isStop: true,
  loading: false,
})

// 重置
const reset = () => {
  dataMap.keyWord = ''
  dataMap.url = ''
  dataMap.selectType = ''

  dataMap.summaryPrompt = ''
  dataMap.eventLevel = ''
  dataMap.advicePrompt = ''
  dataMap.warningPrompt = ''
  dataMap.casePrompt = ''
  dataMap.filePrompt = ''
  dataMap.searchPrompt = ''
}

// 提交
const searchClick = async (param: any) => {
  reset()
  const { selectType, keyWord, url } = param
  dataMap.keyWord = keyWord
  dataMap.url = url
  dataMap.selectType = selectType
  try {
    await getReportPrompt({ type: 'shijiangaishu' })

    await getReportPrompt({ type: 'fengxiandengji' })

    if (dataMap.selectType === '2') {
      await getReportPrompt({ type: 'chuzhijianyi' })
    }

    await getReportPrompt({ type: 'fengxianyujing' })

    await getReportPrompt({ type: 'lishichuli' })

    await getReportPrompt({ type: 'huiyingchuzhi' })

    await getReportPrompt({ type: 'guanlianredian' })

    statusOperateClick(true, false)
  } catch (error) {
    statusOperateClick(true, false)
    console.error('发生错误3:', error)
  }
}

// 获取Prompt结果
const getReportPrompt = ({ type, regenerate = false, instruction = '', previous_report = '' }: any) => {
  const param: any = {
    type,
    prompt: dataMap.keyWord,
    url: dataMap.url,
    yanpan_type: MODE_PROP[dataMap.selectType],
    version: 'V2',
    regenerate,
    instruction,
    previous_report,
  }

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
        if (prop.isStop) throw new Error('停止生成了')
        return reader.read().then(async ({ done, value }) => {
          if (done) {
            if (type === 'fengxiandengji') {
              dataMap[PROMPT_PROP[type]] = promptText
            } else {
              dataMap[PROMPT_PROP[type]] = deleteLastChar(dataMap[PROMPT_PROP[type]])
            }
            return
          }
          try {
            // prompt生成的文本
            const aiText = decoder.decode(value, { stream: true })
            promptText = promptText + aiText
            if (!['fengxiandengji'].includes(type)) {
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

// 删除字符串最后一位
const deleteLastChar = (str: string) => {
  if (!str) return ''
  return str.slice(0, -1)
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
</style>
