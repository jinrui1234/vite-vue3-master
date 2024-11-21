<template>
  <div class="progress-wrap">
    <div class="title">{{ item.name }}:</div>
    <div class="content">
      <el-progress :stroke-width="18" :percentage="PROGRESS_TYPE[item.value]" :status="PROGRESS_COLOR[item.value]" />
      <span class="tag">{{ item.value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const PROGRESS_TYPE = {
  较低: 33,
  中等: 66,
  较大: 100,
}
const PROGRESS_COLOR = {
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
.title {
  margin: 40px 0 16px;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
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
    height: auto !important;
    padding: 8px;
    margin-left: 10px;
    font-size: 19px;
    line-height: 26px;
    white-space: pre-wrap;
  }
}
</style>
