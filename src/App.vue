<template>
  <div class="app-container">
    <!-- 左侧导航栏 -->
    <LeftNav @login="dataMap.visible = true" />

    <!-- 登陆 -->
    <Login :visible="dataMap.visible" @close="dataMap.visible = false" />

    <!-- 备案号 -->
    <FooterBar />

    <!-- key 防止前后跳转同一个路由，页面不刷新 -->
    <RouterView :key="route.fullPath" />
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { refreshTicketAjax } from '@/api/auth'
import useUserStore from '@/store/user'

import LeftNav from '@/component/LeftNav.vue'
import Login from '@/views/login/index.vue'
import FooterBar from '@/component/FooterBar.vue'

const userStore = useUserStore()
let webWorker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
})

const route = useRoute()
const dataMap = reactive({
  visible: false,
})

const resetTokenClick = () => {
  refreshTicketAjax()
    .then((res: any) => {
      const { code, msg, data } = res || {}
      if (code === 0) {
        userStore.setTicket(data.new_refresh_ticket)
      } else {
        ElMessage.error(msg)
      }
    })
    .catch((error) => {
      ElMessage.error(error)
    })
}

onMounted(() => {
  webWorker.postMessage({})
  webWorker.onmessage = () => {
    resetTokenClick()
  }
})

onBeforeUnmount(() => {
  if (webWorker) {
    webWorker.terminate()
    webWorker = null
  }
})
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
