<template>
  <div class="agreement-container">
    <div class="content">
      <!-- 隐私 -->
      <Secret v-if="Number(type)" />
      <!-- 协议 -->
      <Protocol v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import Protocol from './component/Protocol.vue'
import Secret from './component/Secret.vue'
const { type } = useRoute()?.query
</script>

<style scoped lang="less">
.agreement-container {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  overflow-y: auto;
  .content {
    width: 1000px;
    margin: 0px auto;
  }
}
</style>
