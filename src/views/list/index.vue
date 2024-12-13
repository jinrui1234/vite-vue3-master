<!-- 热点列表、历史列表、舆情报告 -->
<template>
  <div class="list-container" v-loading="dataMap.loading" element-loading-text="加载中..." element-loading-background="rgba(122, 122, 122, 0.05)">
    <div class="content" v-if="!dataMap.loading">
      <!-- 数据源 -->
      <SourceList :source="dataMap.sourceId" @select-source="clickSourceItem" />

      <!-- 面包屑 -->
      <div class="head">
        <span class="left">
          {{ `${isHistoryTab() ? '历史' : '实时'}热点数据 ${dataMap.currentTime}` }}
        </span>
        <div v-if="isHistoryTab()" class="right" @click="clickHistoryBtn">选择数据</div>
      </div>

      <!-- 列表内容 -->
      <div :class="['panel', isHistoryTab() ? 'add-padding' : '']">
        <ListItem v-if="dataMap.list?.length" :source="dataMap.sourceId" :list="dataMap.list" :page="dataMap.page" />

        <!-- 分页 -->
        <div class="page-wrap" v-if="isHistoryTab() && dataMap.list?.length">
          <el-pagination
            layout="prev, pager, next"
            :total="dataMap.total"
            :page-size="20"
            :current-page="dataMap.page"
            @current-change="pageChange"
          />
        </div>

        <!-- 空状态 -->
        <Empty v-if="!dataMap.list?.length && !dataMap.loading" style="margin-top: 180px" />
      </div>
    </div>

    <HistoryTime :visible="dataMap.visible" :source="dataMap.sourceId" @submit="handleSubmit" @close="handleClose" />
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { Message } from '@/utils/message'
import { getHotListAjax, getHistoryListAjax } from '@/api/home'

import Empty from '@/component/Empty.vue'
import HistoryTime from './component/HistoryTime.vue'
import SourceList from './component/SourceList.vue'
import ListItem from './component/ListItem.vue'

const { tab, source } = useRoute()?.query || {}

const dataMap = reactive({
  list: [],

  sourceId: 'weibo',
  isFirstInit: true,
  currentTime: '',

  page: 1,
  total: 0,

  mode: '',
  params: {},

  visible: false,
  loading: false,
})

// 是否历史tab
const isHistoryTab = () => {
  return tab === '历史热点'
}

//取消
const handleClose = () => {
  dataMap.visible = false
}

//提交
const handleSubmit = (mode: string, params: any, time: string) => {
  dataMap.visible = false
  dataMap.currentTime = time
  dataMap.page = 1
  init(mode, params)
}

//点击历史btn
const clickHistoryBtn = () => {
  dataMap.visible = true
}

// 点击数据源
const clickSourceItem = (id: string) => {
  dataMap.sourceId = id
  dataMap.page = 1
  init('v2', initTime())
}

// 分页改变
const pageChange = (page: number) => {
  dataMap.page = page
  init(dataMap.mode, dataMap.params)
}

// 获取初始化时间
const initTime = () => {
  if (!isHistoryTab()) return
  const now = new Date()
  now.setTime(now.getTime() - 24 * 60 * 60 * 1000)
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const date = now.getDate().toString().padStart(2, '0')
  dataMap.currentTime = `(${year}年${month}月${date}日)`
  return {
    day: Number(`${year}${month}${date}`),
  }
}

// 数据去重
const handleFilterData = (list: any) => {
  if (!list?.length) return []
  return list?.filter((el: any, index: number) => {
    return list?.findIndex((item: any) => item.title === el.title) === index
  })
}

const init = (mode?: string, params?: object) => {
  if (dataMap.isFirstInit) {
    dataMap.loading = true
    dataMap.isFirstInit = false
  }
  if (isHistoryTab()) {
    // 记录历史请求参数,分页请求时用
    if (dataMap.mode !== mode) dataMap.mode = mode
    if (JSON.stringify(dataMap.params) !== JSON.stringify(params)) {
      dataMap.params = params
    }
    getHistoryListAjax(dataMap.sourceId, mode, {
      page: dataMap.page,
      limit: 20,
      ...params,
    })
      .then((res: any) => {
        const { code, data, msg } = res || {}
        if (code == 0) {
          dataMap.list = data?.list || []
          dataMap.total = data.count
        } else {
          Message('error', msg)
        }
      })
      .catch((error) => {
        Message('error', error)
      })
      .finally(() => {
        closeClick()
      })
  } else {
    getHotListAjax(dataMap.sourceId)
      .then((res: any) => {
        const { code, data, msg } = res || {}
        if (code == 0) {
          if (dataMap.sourceId === 'pingshan') {
            dataMap.list = handleFilterData(data.list)
            return
          }
          dataMap.list = data?.list || []
        } else {
          Message('error', msg)
        }
      })
      .catch((error) => {
        Message('error', error)
      })
      .finally(() => {
        closeClick()
      })
  }
}

const closeClick = () => {
  setTimeout(() => {
    dataMap.loading = false
  }, 300)
}

onMounted(() => {
  if (source) dataMap.sourceId = source
  init('v2', initTime())
})

onBeforeUnmount(() => {
  dataMap.currentTime = ''
})
</script>

<style lang="less" scoped>
.list-container {
  width: 100%;
  height: 100%;
  padding-left: calc(50% - 580px);
  padding-right: calc(50% - 580px);
  padding-top: 40px;
  padding-bottom: 40px;
  background: #d2e9fe;
  background-image: url('http://download.ainewdata.com/download/images/wanxiang/bg-icon.png');
  background-repeat: no-repeat;
  background-size: 100% 599px;
  box-sizing: border-box;
  overflow-y: overlay;
  font-family: 'Microsoft YaHei', sans-serif;
}

.content {
  width: 100%;
  .head {
    display: flex;
    justify-content: space-between;
    height: 32px;
    padding: 0 15px;
    margin-top: 14px;
    margin-bottom: 10px;
    line-height: 32px;

    .left {
      font-size: 15px;
      color: #909399;
    }

    .right {
      width: 88px;
      font-size: 14px;
      font-weight: 500;
      line-height: 32px;
      color: #fff;
      text-align: center;
      cursor: pointer;
      background: #409eff;
      border-radius: 4px;

      &:hover {
        background: #79bbff;
      }
    }
  }

  .panel {
    position: relative;
    min-height: calc(100vh - 284px);
    padding: 20px 30px 12px;
    background: #fff;
    border-radius: 9px;
    box-shadow: 0 3px 16px 0 rgb(0 0 0 / 10%);

    &.add-padding {
      padding: 20px 30px 44px;
    }

    .page-wrap {
      position: absolute;
      bottom: 12px;
      left: 50%;
      display: flex;
      justify-content: center;
      transform: translateX(-50%);
    }
  }
}
</style>
