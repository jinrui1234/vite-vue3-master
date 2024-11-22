<!-- 数据趋势图 -->
<template>
  <div class="chart-container">
    <div class="header">
      <div class="left">
        <span>数据趋势-{{ name }}</span>
        <span class="tip" v-if="isShow">(当前时刻在看此内容的人数)</span>
      </div>
      <div class="right">
        <div class="tip">
          <div class="line"></div>
          <span>{{ name }}</span>
        </div>
        <div class="tip">
          <div class="line line-color"></div>
          <span>增量</span>
        </div>
      </div>
    </div>
    <div :id="id" class="chart-warper"></div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as echarts from 'echarts'

import { bigNumberTransform } from '@/utils/util'

type EChartsOption = echarts.EChartsOption
const route = useRoute()

const props = defineProps({
  id: {
    type: String,
    default: 'chart',
  },
  name: {
    type: String,
    default: '原创量',
  },
  x: {
    type: Array,
  },
  y: {
    type: Array,
  },
  y2: {
    type: Array,
  },
})

const SERIES = {
  type: 'line',
  smooth: 0.5,
  symbolSize: 10,
  lineStyle: {
    width: 3, // 设置虚线宽度
  },
  showSymbol: false,
}

const isShow = computed(() => {
  return route.query.source === 'douyin' && props.id === 'read'
})

watch(
  () => props.x,
  () => {
    initMap()
  }
)

watch(
  () => props.y,
  () => {
    initMap()
  }
)

let myChart: any = null
const init = () => {
  const chartDom = document.getElementById(`${props.id}`)
  myChart = echarts.init(chartDom)
  initMap()
}

let timer = false
const initMap = () => {
  if (timer) return
  timer = true
  setTimeout(() => {
    timer = false
    myChart?.clear()
    if (props.y2?.length > 1) {
      getDictOptionsOne()
    } else {
      getDictOptionsTwo()
    }
  }, 200)
}

// 曲线图
const getDictOptionsOne = () => {
  const { x, y, y2 } = props
  const AXIS = {
    name: '',
    type: 'value',
    inverse: props.name === '榜位值',
    // 整条y轴
    axisLine: {
      show: true,
    },
    // y轴上的小横线
    axisTick: {
      show: false,
    },
  }
  const option: EChartsOption = {
    grid: {
      top: '8%',
      left: '3%',
      right: '3.5%',
      bottom: '5%',
      containLabel: true,
    },
    xAxis: [
      {
        name: '',
        type: 'category',
        data: x,
        boundaryGap: false, //数据从 Y 轴起始
        axisTick: {
          show: true, // 不显示坐标轴刻度线
        },
        axisLine: {
          show: true, // 不显示坐标轴线
        },
      },
    ],
    yAxis: [
      AXIS,
      {
        ...AXIS,
        position: 'right',
      },
    ],
    series: [
      {
        data: y,
        name: '访问量',
        yAxisIndex: 0,
        ...SERIES,
      },
      {
        data: y2,
        name: '增量',
        yAxisIndex: 1,
        ...SERIES,
      },
    ],
    color: ['#409EFF', '#F37B1D'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross', // 'line' 直线指示器  'shadow' 阴影指示器  'none' 无指示器  'cross' 十字准星指示器。
        axis: 'auto', // 指示器的坐标轴。
      },
      showContent: true,
      formatter: function (arg) {
        const { name, data } = arg?.[0]
        const { data: data2 } = arg?.[1]
        const res1 = bigNumberTransform(parseInt(data), true, 2)
        const res2 = bigNumberTransform(parseInt(data2), true, 2)
        const html = `<div class="echart-tooltip">
        <span class="echart-time">${name}</span>
        <div class="echart-tip">
          <div class="echart-tooltip-cycle"></div>
          ${props.name}:${res1 || 0}
          </div>
        <div class=echart-tip>
          <div class="echart-tooltip-cycle icon"></div>
          增量:${res2 || 0}
        </div>
      </div>`
        return html
      },
      backgroundColor: '#fff',
      textStyle: {
        height: 20,
        lineHeight: 20,
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: 500,
        color: '#23262f',
      },
      extraCssText: 'border-radius: 10px;box-shadow: 0px 10px 32px 0px rgba(31, 47, 70, 0.12)',
      padding: [10, 15, 10, 15],
      position: function (point, params, dom, rect, size) {
        return [point[0] - size.contentSize[0] / 2, point[1] - 76]
      },
    },
  }

  option && myChart.setOption(option)
}

// 柱状图
const getDictOptionsTwo = () => {
  const { x, y } = props
  const option = {
    grid: {
      top: '8%',
      left: '3%',
      right: '3.5%',
      bottom: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: x,
      axisTick: {
        show: true,
      },
      axisLine: {
        show: true,
      },
    },
    yAxis: {
      type: 'value',
      inverse: props.name === '榜位值',
      axisLine: {
        show: true,
      },
      axisTick: {
        show: false,
      },
    },
    series: [
      {
        data: y,
        type: 'bar',
        barWidth: 80,
        barMinHeight: 10,
        itemStyle: {
          normal: {
            color: '#409EFF',
          },
        },
        label: {
          show: true,
          position: props.name === '榜位值' ? 'insideBottom' : 'top',
          formatter: ({ value }) => {
            return value ? bigNumberTransform(parseInt(value), true, 2) : 0
          },
        },
      },
    ],
  }
  option && myChart.setOption(option)
}

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
})
</script>

<style lang="less" scoped>
.chart-container {
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 39px 9px rgb(81 69 159 / 9%);
}

.header {
  box-sizing: content-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 28px;
  padding-top: 20px;
  padding-right: 15px;
  margin: 0 44px 6px;

  .left {
    font-size: 17px;
    font-weight: 500;

    .tip {
      font-size: 11px;
      font-weight: 500;
      opacity: 0.8;
    }
  }

  .right {
    display: flex;
    align-items: center;

    .tip {
      display: flex;
      align-items: center;
      font-size: 12px;

      .line {
        width: 16px;
        height: 3px;
        margin-right: 4px;
        background-color: #409eff;
      }

      .line-color {
        background-color: #f37b1d;
      }
    }

    .tip + .tip {
      margin-left: 14px;
    }
  }
}

.chart-warper {
  width: 100%;
  height: 240px;
}
</style>
<style>
.echart-tooltip {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &::after {
    position: absolute;
    bottom: -27px;
    left: 50%;
    width: 34px;
    height: 18px;
    content: '';
    background-image: url('@/assets/img/report/arrow-icon.png');
    background-position: center;
    background-size: cover;
    transform: translateX(-50%);
  }

  .echart-tip {
    display: flex;
    align-items: center;
    opacity: 0.75;

    .echart-tooltip-cycle {
      width: 12px;
      height: 12px;
      margin-right: 5px;
      margin-bottom: 1px;
      background: #409eff;
      border-radius: 50%;

      &.icon {
        background-color: #f37b1d;
      }
    }
  }

  .echart-time {
    margin-bottom: 3px;
    margin-left: -1px;
  }
}
</style>
