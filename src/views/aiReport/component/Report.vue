<template>
  <div class="report-wrap"></div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.report-wrap {
  width: 100%;
  height: 100%;
  padding: 40px 40px 30px;
  overflow-y: overlay;
  box-sizing: border-box;
  background: #fdfdfe;
  border-radius: 12px;
  box-shadow: 0 3px 16px 0 rgb(0 0 0 / 10%);

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
