<template>
  <div class="label-wrap">
    <div class="left">数据趋势:</div>
    <div class="right">
      实时热度<span>{{ hot }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  hot: {
    type: String,
  },
})
</script>

<style lang="less" scoped>
.label-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  line-height: 36px;

  .left {
    font-size: 24px;
    font-weight: 600;
    color: #333;
  }

  .right {
    font-size: 24px;
    font-weight: 500;
    color: #999;

    span {
      margin-left: 10px;
      font-size: 36px;
      font-weight: bold;
      color: #409eff;
    }
  }
}
</style>
