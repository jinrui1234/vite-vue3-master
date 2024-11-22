<template>
  <div class="collect-container" v-loading="dataMap.loading" element-loading-text="加载中..." element-loading-background="rgba(122, 122, 122, 0.05)">
    <div class="content" v-show="!dataMap.loading">
      <el-row :gutter="25">
        <el-col :span="8" v-for="el of dataMap.list" :key="el.title">
          <div class="hot-item">
            <CollectHead :icon="el.icon" :title="el.title" :source="el.source" />
            <div class="item-box">
              <CollectItem v-if="el.list?.length" :list="el.list" :source="el.source" />
              <div class="empty" v-else>暂无数据，请稍后再试</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { Message } from '@/utils/message'
import { getHotListAjax } from '@/api/home.ts'
import { SOURCE_LIST } from '@/views/list/config'

import CollectHead from './component/CollectHead.vue'
import CollectItem from './component/CollectItem.vue'

const dataMap = reactive({
  list: SOURCE_LIST,

  pageSize: 10,
  loading: true,
})

//获取数据源
const getList = async () => {
  for (const el of dataMap.list) {
    try {
      const res: any = await getHotListAjax(el.source, dataMap.pageSize)
      const { code, data } = res || {}
      if (code === 0) {
        el.list = data.list
      } else {
        Message('error', '网络错误，请稍后重试')
      }
    } catch (error) {
      Message('error', '网络错误，请稍后重试')
    }
  }
  dataMap.loading = false
}

onMounted(() => {
  getList()
})
</script>
<style lang="less" scoped>
.collect-container {
  width: 100%;
  height: 100%;
  padding-left: calc(50% - 580px);
  padding-right: calc(50% - 580px);
  padding-top: 40px;
  padding-bottom: 60px;
  box-sizing: border-box;
  overflow-y: overlay;
  font-family: 'Microsoft YaHei', sans-serif;
}

.content {
  width: 100%;

  .hot-item {
    margin-bottom: 25px;

    .item-box {
      position: relative;
      box-sizing: border-box;
      min-height: 436px;
      padding: 5px 0 20px;
      background-color: #fff;
      border-radius: 0 0 9px 9px;
      box-shadow: 0 1px 8px 0 rgb(0 0 0 / 10%);

      .empty {
        position: absolute;
        top: 50%;
        left: 50%;
        height: 100px;
        font-size: 15px;
        color: rgb(121 112 112);
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
