<template>
  <div class="app-container">
    <!-- 左侧导航栏 -->
    <LeftNav v-if="!noShow && !!getShowNav()" @login="loginHandle" />

    <!-- 登陆 -->
    <Login :visible="dataMap.visible" @close="dataMap.visible = false" />

    <!-- key 防止前后跳转同一个路由，页面不刷新 -->
    <RouterView :key="route.fullPath" />
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute } from 'vue-router'
import eventBus from '@/utils/mitt'

import LeftNav from '@/component/LeftNav.vue'
import Login from '@/views/login/index.vue'

const route = useRoute()

const dataMap = reactive({
  visible: false,
  noShow: false,
})

const noShow = computed(() => {
  return ['Pdf', 'PurePdf'].includes(route.name) && !Number(route.query?.isHistory)
})

const getShowNav = () => {
  return !window.location?.href?.includes('/agreement')
}

const loginHandle = () => {
  if (!dataMap.visible) dataMap.visible = true
}

onMounted(() => {
  eventBus.on('loginHandle', loginHandle)
})

onBeforeUnmount(() => {
  eventBus.off('loginHandle', loginHandle)
})
</script>

<style scoped lang="less">
.app-container {
  width: 100%;
  height: 100%;
  // min-width: 1440px;
}
</style>
