<!-- 事件详情页 -->
<template>
  <div class="detail-container" v-loading="loading" element-loading-text="加载中..." element-loading-background="rgba(122, 122, 122,0.15)">
    <div class="content" v-if="!loading">
      <ArticleTitle :title="title" :link="link" :descript="descript" />

      <div class="summer-panel">
        <div class="title-wrap">
          <span>数据总览:</span>
          <div class="btn" @click="jumpPage">查看报告</div>
        </div>
        <SummerList v-if="summerList?.length" :list="summerList" />
        <QuotaList v-if="detailList?.length" :list="detailList" />
      </div>

      <!-- 图表 -->
      <div class="chart">
        <HotWrap :hot="hot_value" />

        <TimeTab style="margin-bottom: 30px" :id="timeId" @tab-change="handleClickTab" />

        <template v-if="chartDate?.length">
          <ChartItem class="chart-item" v-for="el of chartDate" :key="el.id" :name="el.name" :id="el.id" :x="el.x" :y="el.y" :y2="el.y2" />
        </template>
        <Empty v-else />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useInfo } from '@/utils/useInfo'

import QuotaList from './component/QuotaList.vue'
import SummerList from './component/SummerList.vue'
import ArticleTitle from './component/ArticleTitle.vue'

import ChartItem from '@/views/aiReport/component/ChartItem.vue'
import TimeTab from '@/views/aiReport/component/TimeTab.vue'
import Empty from '@/views/aiReport/component/Empty.vue'
import HotWrap from '@/views/aiReport/component/HotWrap.vue'

const router = useRouter()
const { aid, source, tab, rank } = useRoute()?.query || {}

const { loading, title, link, descript, hot_value, timeId, detailList, summerList, chartDate, setTime } = useInfo('info')

// 点击tab
const handleClickTab = (id: string) => {
  setTime(id)
}

//跳转详情页
const jumpPage = () => {
  const page = router.resolve({
    name: 'Report',
    query: {
      aid,
      source,
      tab,
      rank,
    },
  })
  window.open(page.href, '_blank')
}
</script>

<style lang="less" scoped>
.detail-container {
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
  position: relative;

  .summer-panel {
    padding: 20px 30px 34px;
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 9px;
    box-shadow: 0 3px 16px 0 rgb(0 0 0 / 10%);

    .title-wrap {
      display: flex;
      align-self: center;
      justify-content: space-between;
      height: 28px;
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: 600;
      line-height: 28px;
      color: #333;

      .btn {
        padding: 0 10px;
        font-size: 14px;
        font-weight: 500;
        line-height: 28px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.5px;
        cursor: pointer;
        background: #409eff;
        border-radius: 4px;

        &:hover {
          background: #79bbff;
        }
      }
    }
  }

  .chart {
    position: relative;
    padding: 20px 30px 40px;
    background-color: #fff;
    border-radius: 9px;
    box-shadow: 0 3px 16px 0 rgb(0 0 0 / 10%);

    .chart-item + .chart-item {
      margin-top: 26px;
    }
  }
}
</style>
