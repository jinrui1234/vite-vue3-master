<template>
  <div class="empty-container">
    <img src="../assets/img/empty-icon.png" alt="" />
    <div class="text">{{ placeholder }}</div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  placeholder: {
    type: String,
    default: '暂无数据',
  },
})
</script>

<style lang="less" scoped>
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: 'Microsoft YaHei', sans-serif;
}

img {
  width: 560px;
  height: 156px;
}

.text {
  margin-top: 20px;
  font-family: 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  line-height: 22px;
  color: #909399;
  text-align: center;
}
</style>
