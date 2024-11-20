<!-- 数据趋势-时间选择 -->
<template>
  <div class="time-container">
    <div class="time-box">
      <div :class="['time-text', id === el.id ? 'active' : '']" v-for="el of timeList" :key="el.id" @click="handleClickTab(el.id)">
        {{ el.tabName }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const timeList = [
  {
    tabName: '1小时',
    id: '1',
  },
  {
    tabName: '24小时',
    id: '2',
  },
  {
    tabName: '7天',
    id: '3',
  },
  {
    tabName: '15天',
    id: '4',
  },
]

defineProps({
  id: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['tabChange'])
const handleClickTab = (id: any) => {
  emit('tabChange', id)
}
</script>

<style lang="less" scoped>
.time-container {
  display: flex;
  align-items: center;
  justify-content: center;

  .time-box {
    display: flex;
    height: 32px;
    background: #fff;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    border-radius: 4px;

    .time-text {
      width: auto;
      height: 30px;
      padding: 0 16px;
      font-size: 14px;
      line-height: 30px;
      color: #606266;
      text-align: center;
      cursor: pointer;

      &:hover {
        color: #fff;
        background: #409eff;
      }

      &.active {
        color: #fff;
        background: #409eff;
      }
    }

    .time-text + .time-text {
      border-left: 1px solid #dcdfe6;
    }
  }
}
</style>
