<!-- 数据来源 -->
<template>
  <div class="source-ratio-container">
    <div id="source-main"></div>
    <div class="tip">( 热点数据来源 )</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import * as echarts from 'echarts'
import { SOURCE_ZH } from '../config'

const prop = defineProps({
  list: {
    type: Object,
    default: () => ({}),
  },
})

const init = (list: any[]) => {
  const node = document.getElementById('source-main')
  const myChart = echarts.init(node)
  const option = {
    label: {
      formatter: '{b} ({d}%)',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {d}%',
    },
    series: [
      {
        type: 'pie',
        radius: ['30%', '76%'],
        data: list,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
  option && myChart.setOption(option)
}

onMounted(() => {
  const dealList = Object.entries(prop.list).map((item) => {
    return {
      value: item[1],
      name: SOURCE_ZH[item[0]] || '-',
    }
  })
  init(dealList)
})
</script>

<style scoped lang="less">
.source-ratio-container {
  width: 50%;
  height: 240px;
  page-break-inside: avoid;

  #source-main {
    width: 100%;
    height: calc(100% - 12px);
  }

  .tip {
    font-size: 12px;
    line-height: 12px;
    color: #666;
    text-align: center;
  }
}
</style>
