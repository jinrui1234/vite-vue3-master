<!-- 数据趋势-head -->
<template>
  <div class="hot-wrap">
    <div class="left">数据趋势</div>
    <div class="right">
      <span>实时热度</span>
      <span class="hot">{{ hot }}</span>
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
.hot-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  margin: 20px 0 10px;
  font-family: 'Microsoft YaHei', sans-serif;

  .left {
    font-size: 20px;
    font-weight: bold;
    color: #05073b;
  }

  .right {
    font-size: 15px;
    color: #999;

    .hot {
      margin-left: 6px;
      font-family: '京东金融数字体', sans-serif;
      font-size: 20px;
      font-weight: bold;
      color: #409eff;
    }
  }
}
</style>
