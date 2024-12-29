<template>
  <div class="left-nav-container">
    <img class="logo-icon" src="../assets/img/report/logo-icon.png" @click="jumpPage('AiReport')" />

    <div class="tool-wrap">
      <div
        v-for="el of toolList"
        :key="el.label"
        :class="['tool-item', dataMap.currentTool === el.label ? 'active' : '']"
        @click="jumpPage(el.name, el.label)"
      >
        <img :src="transformToUrl(el.icon, el.label)" />
        <div class="label">{{ el.label }}</div>
      </div>
    </div>

    <el-tooltip popper-class="tooltip-wrap" effect="light" :show-arrow="false" placement="right" :offset="15" :disabled="!isLogin">
      <!-- 用户信息弹窗 -->
      <template #content>
        <div class="info-box">
          <div class="info-item">
            <img src="../assets/img/login/name-icon.png" />
            <div class="text">{{ account }}</div>
          </div>
          <div class="info-item split-line" @click="loginOutClick">
            <img src="../assets/img/login/login-icon.png" />
            <div class="text">退出</div>
          </div>
        </div>
      </template>
      <img class="login-icon" src="../assets/img/report/login-icon.png " @click="loginClick" />
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getStorage, clearStorage } from '@/utils/localStorage'
import { Message } from '@/utils/message'
import eventBus from '@/utils/mitt'
import { loginOutAjax } from '@/api/auth'
import useUserStore from '@/store/user'

const userStore = useUserStore()

const toolList = [
  {
    label: '新对话',
    name: 'AiReport',
    icon: 'ai-report-icon',
  },
  {
    label: '历史会话',
    name: 'OldReportList',
    icon: 'report-list',
  },
  {
    label: '热搜榜',
    name: 'Collect',
    icon: 'collect-icon',
  },
  {
    label: '实时热点',
    name: 'List',
    icon: 'hot-icon',
  },
  {
    label: '舆情报告',
    name: 'List',
    icon: 'report-icon',
  },
  {
    label: '历史热点',
    name: 'List',
    icon: 'history-icon',
  },
]

const router = useRouter()
const route = useRoute()

const emit = defineEmits(['login'])
const dataMap = reactive({
  currentTool: '',
})

const account = computed(() => {
  return userStore.userInfo?.name
})

const isLogin = computed(() => {
  return !!userStore.userInfo?.name
})

const loginClick = () => {
  if (!isLogin.value) {
    emit('login')
  }
}

//退出
const loginOutClick = () => {
  loginOutAjax()
    .then((res: any) => {
      const { code, msg } = res || {}
      if (code === 0) {
        userStore.resetUserInfo()
        clearStorage()
        router.push('/')
        Message('success', '退出成功')
      } else {
        Message('error', msg)
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

const transformToUrl = (url: string, label?: string) => {
  const icon = dataMap.currentTool === label ? url + '-s' : url
  return new URL(`../assets/img/report/${icon}.png`, import.meta.url).href
}

//页面跳转
const jumpPage = (name: string, label?: string) => {
  if (!tokenIsExistence()) return
  // 新对话
  if (name === 'AiReport' && route.name === 'AiReport') {
    eventBus.emit('reportStop')
    return
  }

  // 历史对话
  if (name !== 'AiReport') {
    const url = router.resolve({
      name: name,
      query: name !== 'List' ? {} : { tab: label },
    })
    window.open(url.href)
  } else {
    router.push({
      name: 'AiReport',
    })
  }
}

// 检查token是否存在
const tokenIsExistence = () => {
  const refresh_token = getStorage('refresh_token')
  if (!refresh_token) {
    userStore.resetUserInfo()
    clearStorage()
    eventBus.emit('loginHandle')
    return false
  }
  return true
}

watch(
  () => route.fullPath,
  () => {
    if (route?.name === 'List') {
      dataMap.currentTool = route?.query?.tab
    } else {
      const currentItem = toolList.find((el) => el.name === route?.name)
      dataMap.currentTool = currentItem?.label || ''
    }
  },
  {
    immediate: true,
  }
)
</script>

<style scoped lang="less">
.left-nav-container {
  width: 70px;
  border-radius: 12px;
  background: #fafbff;
  box-sizing: border-box;
  border: 1px solid #ffffff;
  box-shadow: 0px 6px 10px 0px rgba(0, 0, 0, 0.1);
  padding: 20px 0px 25px;
  font-family: Microsoft YaHei;
  display: flex;
  flex-direction: column;
  align-items: center;

  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.logo-icon,
.login-icon {
  width: 45px;
  // height: 45px;
  cursor: pointer;
}

.tool-wrap {
  min-height: 279px;
  width: 48px;
  margin: 10px 0px 15px;
  padding: 10px 0px;
  border-top: 1px solid #d8d8d8;
  border-bottom: 1px solid #d8d8d8;
  .tool-item {
    width: 45px;
    height: 45px;
    border-radius: 8px;
    margin: 9px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    img {
      width: 26px;
      height: 26px;
    }
    .label {
      line-height: 30px;
      font-size: 15px;
      text-align: center;
      border-radius: 8px;
      padding: 0px 10px;
      color: #ffffff;
      background: linear-gradient(116deg, #9482f8 14%, #4277f3 88%);
      display: none;
      white-space: nowrap;
      position: absolute;
      top: 50%;
      left: 62px;
      transform: translateY(-50%);
    }
    &.active {
      background: #e7ebf6;
    }
    &:hover {
      background: #e7ebf6;
      .label {
        display: block;
      }
    }
  }
}
</style>
<style lang="less">
.tooltip-wrap {
  padding: 0px !important;
  border: none !important;
  font-family: Microsoft YaHei;
  .info-box {
    border-radius: 6px;
    background: #ffffff;
    box-shadow: 0px 3px 16px 0px rgba(0, 0, 0, 0.1);
    .info-item {
      padding: 10px 15px;
      display: flex;
      align-items: center;
      cursor: pointer;
      &.split-line {
        border-top: 1px solid #d8d8d8;
      }
      img {
        width: 15px;
        margin-bottom: 2px;
        margin-right: 6px;
      }
      .text {
        font-size: 15px;
        line-height: 20px;
        color: #3d3d3d;
      }
    }
  }
}
</style>
