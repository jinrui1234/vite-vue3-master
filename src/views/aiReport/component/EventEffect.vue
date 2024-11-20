<!-- 事件影响力 -->
<template>
  <div class="event-effect-wrap">
    <div class="title">{{ item.name }}:</div>
    <div class="content">
      <el-progress :stroke-width="10" :percentage="TYPE[item.value]" :status="COLOR[item.value]" />
      <span class="tag">{{ item.value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const TYPE = {
  较低: 33,
  中等: 66,
  较大: 100,
}
const COLOR = {
  较低: 'success',
  中等: 'warning',
  较大: 'exception',
}

defineProps({
  item: {
    type: Object,
  },
})
</script>

<style scoped lang="less">
.event-effect-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 40px;
}

.title {
  margin-right: 25px;
  font-family: 'Source Han Sans', sans-serif;
  font-size: 15px;
  font-weight: bold;
  line-height: 22px;
}

.content {
  display: flex;
  align-items: center;

  :deep(.el-progress) {
    width: 600px;

    .el-progress__text {
      display: none;
    }
  }

  .tag {
    padding-left: 16px;
    font-size: 14px;
    font-weight: 350;
    line-height: 22px;
    color: rgb(0 0 0 / 45%);
    white-space: pre-wrap;
  }
}
</style>
