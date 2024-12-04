<template>
  <div class="app-container">
    <!-- 左侧导航栏 -->
    <LeftNav v-if="isShow" @login="loginHandle" />

    <!-- 登陆 -->
    <Login :visible="dataMap.visible" @close="dataMap.visible = false" />

    <!-- 备案号 -->
    <FooterBar v-if="isShow" />

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
import FooterBar from '@/component/FooterBar.vue'

const route = useRoute()
const dataMap = reactive({
  visible: false,
  isShow: true,
})

const isShow = computed(() => {
  return route.name !== 'Pdf'
})

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
  background: #d2e9fe;
  background-image: url('./assets/img/bg-icon.png');
  background-repeat: no-repeat;
  background-size: 100% 599px;
}
</style>
