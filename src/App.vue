<template>
  <div class="app-container">
    <LeftNav />
    <!-- key 防止前后跳转同一个路由，页面不刷新 -->
    <RouterView :key="route.fullPath" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import LeftNav from '@/component/LeftNav.vue'

const route = useRoute()
</script>

<style scoped lang="less">
.app-container {
  width: 100%;
  height: 100%;
  min-width: 1440px;
  background: #d2e9fe;
  background-image: url('./assets/img/report/bg-icon.png');
  background-repeat: no-repeat;
  background-size: 100% 599px;
}
</style>
