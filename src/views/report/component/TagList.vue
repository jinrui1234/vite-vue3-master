<template>
  <div class="tag-wrap">
    <div class="title">{{ item.name }}:</div>
    <div class="tag-box">
      <el-tag class="tag" type="success">{{ item.value || '-' }}</el-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
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

.tag-box {
  display: flex;
  flex-wrap: wrap;

  .tag {
    height: auto !important;
    padding: 8px;
    font-size: 20px;
    line-height: 26px;
    word-break: break-all;
    white-space: pre-wrap;
  }
}
</style>
