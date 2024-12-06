<!-- 风险等级 -->
<template>
  <div class="level-wrap">
    <div id="main"></div>
    <div class="tip">( 风险等级 )</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import * as echarts from 'echarts'
const levelObj = {
  重大舆情: 86,
  较大舆情: 63,
  一般舆情: 37,
  低风险事件: 20,
}

const prop = defineProps({
  level: {
    type: String,
    default: '',
  },
})

const init = () => {
  const chartDom = document.getElementById('main')
  const myChart = echarts.init(chartDom)
  const option = {
    series: [
      {
        type: 'gauge',
        radius: '84%',
        axisLine: {
          lineStyle: {
            width: 24,
            color: [
              [0.25, '#67c23a'],
              [0.5, '#dfef2a'],
              [0.75, '#e6a23c'],
              [1, '#f56c6c'],
            ],
          },
        },
        pointer: {
          itemStyle: {
            color: 'auto',
          },
        },
        axisTick: {
          distance: -30,
          length: 8,
          lineStyle: {
            color: '#fff',
            width: 1,
          },
        },
        splitLine: {
          distance: -30,
          length: 20,
          lineStyle: {
            color: '#fff',
            width: 0,
          },
        },
        axisLabel: {
          color: '#fff',
          distance: 40,
          fontSize: 12,
        },
        detail: {
          valueAnimation: true,
          formatter: prop.level,
          color: 'inherit',
          fontSize: 15,
        },
        data: [
          {
            value: levelObj[prop.level],
          },
        ],
      },
    ],
  }
  option && myChart.setOption(option)
}

onMounted(() => {
  init()
})
</script>

<style scoped lang="less">
.level-wrap {
  width: 50%;
  height: 240px;
  page-break-inside: avoid;

  #main {
    width: 100%;
    min-height: calc(100% - 12px);
  }

  .tip {
    font-size: 12px;
    line-height: 12px;
    color: #666;
    text-align: center;
  }
}
</style>
