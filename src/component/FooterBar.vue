<template>
  <div class="footer-container">
    <div class="title">版权所有舆情科学研判平台</div>
    <div class="tip" @click="jumpPage">京ICP备2024069940号-1</div>
  </div>
</template>
<script setup lang="ts">
const jumpPage = () => {
  window.open('https://beian.miit.gov.cn/')
}
</script>

<style lang="less" scoped>
.footer-container {
  width: 100%;
  font-size: 14px;
  line-height: 16px;
  color: #999;
  font-family: 'Microsoft YaHei', sans-serif;
  display: flex;
  justify-content: center;

  position: absolute;
  bottom: 25px;
  left: 0;
}

.tip {
  margin-left: 25px;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
