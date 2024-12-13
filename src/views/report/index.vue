<!-- 报告页 -->
<template>
  <div class="report-container" v-loading="loading" element-loading-text="加载中..." element-loading-background="rgba(122, 122, 122,0.15)">
    <div class="content" v-if="!loading">
      <Title :title="title" @jump="jumpPage(link)" />

      <ReportDoor />

      <TagList :item="item" v-for="item of infoList" :key="item.name" />

      <ProgressItem :item="item" v-for="item of reportData" :key="item.name" />

      <div class="summer-panel">
        <div class="title-label">数据总览:</div>
        <QuotaList v-if="summerList?.length || detailList?.length" :list="[...summerList, ...detailList]" />
      </div>

      <ChartHead :hot="hot_value" />

      <TimeTab style="margin: 20px auto 35px" :id="timeId" @tab-change="handleClickTab" />

      <template v-if="chartDate?.length">
        <ChartItem class="chart-item" v-for="el of chartDate" :key="el.id" :name="el.name" :id="el.id" :x="el.x" :y="el.y" :y2="el.y2" />
      </template>
      <Empty v-else />
    </div>
    <!-- <div class="downLoad" v-if="!loading"> -->
    <!-- <span>下载</span> -->
    <!-- <i-ep-download class="icon" /> -->
    <!-- </div> -->
  </div>
</template>
<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useInfo } from '@/utils/useInfo'
import { useWatermark } from '@/utils/waterMark'

import ChartItem from '@/views/aiReport/component/ChartItem.vue'
import TimeTab from '@/views/aiReport/component/TimeTab.vue'
import Empty from '@/views/aiReport/component/Empty.vue'
import ChartHead from '@/views/detail/component/ChartHead.vue'
import QuotaList from '@/views/detail/component/QuotaList.vue'

import Title from './component/Title.vue'
import TagList from './component/TagList.vue'
import ProgressItem from './component/ProgressItem.vue'
import ReportDoor from './component/ReportDoor.vue'

const { setWatermark, clear } = useWatermark()

const { loading, title, link, hot_value, timeId, infoList, reportData, detailList, summerList, chartDate, setTime } = useInfo()

// 点击tab
const handleClickTab = (id: string) => {
  setTime(id)
}

// 跳转外链
const jumpPage = (url: string) => {
  window.open(url)
}

onMounted(() => {
  setWatermark()
})

onBeforeUnmount(() => {
  clear()
})
</script>
<style lang="less" scoped>
.report-container {
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
  overflow-y: overlay;
  box-sizing: border-box;
  font-family: 'Microsoft YaHei', sans-serif;
  position: relative;

  .content {
    width: 100%;
    padding: 80px 70px 50px;
    background-color: #fff;
    background-repeat: repeat;
    border-radius: 9px;
    box-shadow: 0 3px 16px 0 rgb(0 0 0 / 10%);
    box-sizing: border-box;
  }
}

.title {
  font-size: 48px;
  font-weight: bold;
  line-height: 64px;
  color: #333;
  text-align: center;
  cursor: pointer;

  span:hover {
    opacity: 0.8;
  }
}

.summer-panel {
  padding-bottom: 34px;

  .title-label {
    margin: 30px 0 16px;
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
  }

  :deep(.quota-wrap) {
    grid-template-columns: repeat(6, 1fr);

    .item {
      .num {
        margin-bottom: 6px;
        font-size: 20px;
        line-height: 22px;
      }

      .des {
        font-size: 15px;
      }
    }
  }
}

.chart-item + .chart-item {
  margin-top: 26px;
}

.downLoad {
  position: absolute;
  top: 50px;
  right: calc(50% - 560px);
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  color: #409eff;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  .icon {
    margin-left: 2px;
    font-size: 16px;
  }
}
</style>
