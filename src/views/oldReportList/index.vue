<template>
  <div
    class="old-report-list-container"
    v-loading="dataMap.loading"
    element-loading-text="加载中..."
    element-loading-background="rgba(122, 122, 122, 0.05)"
  >
    <div class="search-wrap">
      <input type="text" placeholder="搜索历史会话" v-model.trim="dataMap.keyText" />
      <img src="@/assets/img/list/search-icon.png" @click="searchClick" @keyup.enter="searchClick" />
    </div>

    <ListItem v-for="el of dataMap.list" :item="el" :key="el.id" @deleteClick="deleteClickHandle" />
    <el-pagination
      v-if="dataMap.total > dataMap.pageSize"
      background
      layout="prev, pager, next"
      :total="dataMap.total"
      :page-size="dataMap.pageSize"
      :current-page="dataMap.page"
      @current-change="pageChange"
    />

    <div class="empty-wrap" v-if="!dataMap.loading && !dataMap.list?.length">
      <Empty />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { getOldReportAjax, deleteOldReportAjax } from '@/api/history'
import { Message } from '@/utils/message'

import ListItem from './component/ListItem.vue'
import Empty from '@/component/Empty.vue'

const dataMap = reactive({
  keyText: '',
  list: [],

  total: 0,
  page: 1,
  pageSize: 10,
  loading: false,
})

const searchClick = () => {
  dataMap.page = 1
  getList()
}

const pageChange = (page: number) => {
  dataMap.page = page
  getList()
}

// 获取列表
const getList = () => {
  dataMap.loading = true
  const param = {
    title: dataMap.keyText,
    page: dataMap.page,
    limit: dataMap.pageSize,
  }
  getOldReportAjax(param)
    .then((res: any) => {
      const { code, msg, data } = res || {}
      const { list, count } = data || {}
      if (code === 0) {
        dataMap.list = list ?? []
        dataMap.total = count ?? 0
        if (!list?.length && count && dataMap.page > 1) {
          dataMap.page = dataMap.page - 1
          getList()
        }
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

// 删除历史记录
const deleteClickHandle = (param: any) => {
  deleteOldReportAjax(param)
    .then((res: any) => {
      const { code, msg } = res || {}
      if (code === 0) {
        getList()
        Message('success', '删除成功')
      } else {
        Message('error', msg)
      }
    })
    .catch((error) => {
      Message('error', error)
    })
}

const getSize = () => {
  const h = window.innerHeight || window.screen.height
  dataMap.pageSize = Math.floor((h - 240) / 50)
  getList()
}
onMounted(() => {
  getSize()
  // window.addEventListener('resize', getSize)
})
// onBeforeUnmount(() => {
//   window.removeEventListener('resize', getSize)
// })
</script>

<style scoped lang="less">
.old-report-list-container {
  width: 100%;
  height: 100%;
  padding-left: calc(50% - 500px);
  padding-right: calc(50% - 500px);
  padding-top: 70px;
  padding-bottom: 40px;
  background: #d2e9fe;
  background-image: url('http://download.ainewdata.com/download/images/wanxiang/bg-icon.png');
  background-repeat: no-repeat;
  background-size: 100% 599px;
  box-sizing: border-box;
  overflow-y: overlay;
  font-family: 'Microsoft YaHei', sans-serif;
}

.search-wrap {
  width: 100%;
  height: 56px;
  border-radius: 9px;
  background: #ffffff;
  box-sizing: border-box;
  border: 1px solid #f4f4f5;
  box-shadow: 0px 3px 16px 0px rgba(0, 0, 0, 0.1);
  padding: 0px 24px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;

  img {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-left: 12px;
    cursor: pointer;
  }

  input {
    flex: 1;
    border: none;
    height: 100%;
    outline: none;
    font-size: 14px;
    color: #05073b;
  }
}

:deep(.el-pagination) {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  button,
  li {
    background-color: #fff !important;
    &.is-active {
      background-color: #409eff !important;
    }
  }
}

.empty-wrap {
  width: 100%;
  margin-top: 120px;
}
</style>
