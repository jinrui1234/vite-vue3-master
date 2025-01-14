<template>
  <div class="search-wrap">
    <div class="left-wrap">
      <img class="robot-icon" src="@/assets/img/report/robot-icon.png" />
    </div>
    <div class="right-wrap">
      <div class="tool-wrap">
        <!-- 模版列表 -->
        <TypeList />
      </div>
      <el-input
        type="textarea"
        placeholder="请输入您关注的舆情主题或者事件描述，可以输入文本、链接"
        v-model.trim="dataMap.textareaValue"
        @keyup.enter="() => getCountClick()"
      />
      <div class="btn" @click="() => getCountClick()">
        <img src="@/assets/img/report/submit-icon.png" alt="" />
        <span>提交</span>
      </div>
    </div>
    <!-- 模式列表 -->
    <div class="mode-wrap">
      <div :class="['mode-item', dataMap.currentMode === el.id ? 'active' : '']" v-for="el of MODE_LIST" :key="el.id" @click="modeClick(el.id)">
        <img :src="transformToUrl(el.icon, el.id)" alt="" />
        <span>{{ el.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Message } from '@/utils/message'
import { isLink } from '@/utils/util'
import { geSearchListAjax } from '@/api/home'
import { getCountAjax } from '@/api/auth'
import { getReportPromptAjax } from '@/api/home'
import { MODE_LIST } from '../config'

import TypeList from './TypeList.vue'

const emit = defineEmits(['submit', 'start'])
defineProps({
  stopStatus: {
    type: Boolean,
    default: true,
  },
})

const dataMap = reactive({
  textareaValue: '',
  currentMode: 'yqfenxi', //模式
})

// 模式切换
const modeClick = (id: string) => {
  dataMap.currentMode = id
}

// 提交之前，先验证有无次数
const getCountClick = (value?: string) => {
  getCountAjax()
    .then((res: any) => {
      const { code, data, msg } = res || {}
      if (code === 0) {
        if (!data?.free_total) {
          Message('error', '暂无使用次数，请联系管理员')
          return
        }
        handleSubmit(value)
      } else {
        Message('error', msg)
      }
    })
    .catch((error) => {
      Message('error', error)
    })
}

// 提交
const handleSubmit = (value?: string) => {
  const text = value || dataMap.textareaValue?.trim()
  if (!text) {
    Message('warning', '请输入您关注的舆情主题或者事件描述')
    return
  }
  if (isLink(text)) {
    getTitleClick(text)
  } else {
    getList(text, '')
  }
}

// 链接获取标题
const getTitleClick = async (url: string) => {
  const param = {
    type: 'huoqubiaoti',
    prompt: url,
    version: 'V2',
    yanpan_type: dataMap.currentMode,
  }
  try {
    const response = await getReportPromptAjax(param)
    if (!response.body) return
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let promptText = ''
    let finished = false

    // while循环获取字符串
    while (!finished) {
      try {
        const { done, value } = await reader.read()
        if (done) {
          finished = true
          if (promptText) {
            getList(promptText, url)
          } else {
            Message('warning', '暂无数据，请重新输入较精确的关键词')
          }
        } else {
          // 字节流转字符串
          const data = decoder.decode(value, { stream: true })
          const { status, topic } = JSON.parse(data || '{}')
          if (status === '200') promptText = promptText + topic
        }
      } catch (error) {
        console.error('发生错误1:', error)
      }
    }
  } catch (error) {
    console.error('发生错误:', error)
  }
}

// 获取关联热点列表
const getList = async (text: string, url: string) => {
  emit('start', text)
  let firstItem: any = {}
  try {
    const res: any = await geSearchListAjax(text)
    const { list, channel_rate } = JSON.parse(JSON.stringify(res?.data || {}))
    if (res?.code === 0) {
      // list无数据
      if (!list?.length) {
        emit('submit', {
          keyWord: text,
          url,
          selectType: dataMap.currentMode,
          reportMode: '2',
        })
        dataMap.textareaValue = ''
        return
      }
      // list有数据
      list.forEach((el: any, index: number) => {
        el.pos = index + 1
      })
      const listCopy = list?.slice(0, 10)
      // 优选选取展示的数据顺序
      let selectedItem1 = null
      if (text?.includes('坪山')) {
        selectedItem1 = listCopy?.find((el: any) => el.source === 'pingshan')
      }
      let selectedItem2 = null
      if (text?.includes('深圳')) {
        selectedItem2 = listCopy?.find((el: any) => el.source === 'shenzhen')
      }
      const selectedItem3 = listCopy?.find((el: any) => el.source === 'toutiao')

      firstItem = selectedItem1 || selectedItem2 || selectedItem3 || list?.[0] || {}
      const { source, aid, pos } = firstItem || {}

      if (source && aid) {
        emit('submit', {
          keyWord: text,
          url,
          source,
          aid,
          pos,
          list: list ?? [],
          selectType: dataMap.currentMode,
          channelRate: channel_rate,
          reportMode: '1',
        })
        dataMap.textareaValue = ''
      }
    } else {
      Message('error', res.msg)
    }
  } catch (error) {
    console.error('获取列表失败', error)
  }
}

// 图片路径转换
const transformToUrl = (url: string, id?: string) => {
  const icon = dataMap.currentMode === id ? url + '-s' : url
  return new URL(`../../../assets/img/report/${icon}.png`, import.meta.url).href
}

defineExpose({
  getCountClick,
})
</script>

<style scoped lang="less">
.search-wrap {
  width: 100%;
  height: 135px;
  margin-top: 20px;
  border-radius: 12px;
  box-shadow: 0 3px 16px 0 rgb(0 0 0 / 10%);
  display: flex;
  position: relative;
}

.left-wrap {
  width: 60px;
  padding-top: 40px;
  background: #f4f4f5;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  display: flex;
  justify-content: center;

  img {
    width: 48px;
    height: 48px;
  }
}

.right-wrap {
  position: relative;
  flex: 1;
  background: #fff;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;

  .tool-wrap {
    height: 32px;
    padding: 0px 15px;
    border-bottom: 1px solid #d8d8d8;
    display: flex;
    justify-content: flex-end;
  }

  :deep(.el-textarea__inner) {
    height: 102px !important;
    padding: 8px;
    font-size: 14px;
    color: #222329;
    border-radius: 12px;
    box-shadow: none;
  }

  .btn {
    position: absolute;
    right: 16px;
    bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    padding: 0 16px;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    user-select: none;
    background: #409eff;
    border-radius: 100px;

    &:hover {
      background: #5cb6ff;
    }

    img {
      width: 13px;
      height: 13px;
      margin-top: 1px;
      margin-right: 6px;
    }
  }
}

.mode-wrap {
  display: flex;
  position: absolute;
  top: -46px;
  left: 60px;
  .mode-item {
    height: 34px;
    border-radius: 10px;
    background: #ffffff;
    padding: 0px 15px;
    color: #3d3d3d;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    &.active {
      background: linear-gradient(114deg, #9482f8 14%, #4277f3 88%);
      color: #fff;
    }
    img {
      width: 24px;
      height: 24px;
    }
    span {
      font-family: Microsoft YaHei;
      font-size: 15px;
      line-height: 22px;

      margin-left: 4px;
    }
  }
  .mode-item + .mode-item {
    margin-left: 12px;
  }
}
</style>
