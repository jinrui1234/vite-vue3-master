<template>
  <div class="left-nav-container">
    <img class="logo-icon" src="../assets/img/report/logo-icon.png" alt="" />

    <div class="tool-wrap">
      <div
        v-for="el of toolList"
        :key="el.label"
        :class="['tool-item', dataMap.currentTool === el.label ? 'active' : '']"
        @click="selectTool(el.name, el.label)"
      >
        <img :src="transformToUrl(el.icon, el.label)" alt="" />
        <div class="label">{{ el.label }}</div>
      </div>
    </div>

    <el-tooltip popper-class="tooltip-wrap" effect="light" :disabled="!isUse" :show-arrow="false" placement="right" :offset="18">
      <!-- 用户信息弹窗 -->
      <template #content>
        <div class="info-box">
          <div class="info-item" @click="loginClick">
            <img src="../assets/img/login/name-icon.png" alt="" />
            <div class="text">{{ isUse ? account : '登陆' }}</div>
          </div>
          <div v-if="isUse" class="info-item out" @click="loginOutClick">
            <img src="../assets/img/login/login-icon.png" alt="" />
            <div class="text">退出</div>
          </div>
        </div>
      </template>
      <img class="login-icon" src="../assets/img/report/login-icon.png " alt="" />
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import eventBus from '@/utils/mitt'
import { loginOutAjax } from '@/api/auth'
import useUserStore from '@/store/user'

const userStore = useUserStore()

const toolList = [
  {
    label: '新对话',
    name: 'AiReport',
    icon: 'report-icon',
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

const isUse = computed(() => {
  return sessionStorage.getItem('token')
})

const loginClick = () => {
  if (!isUse.value) {
    emit('login')
  }
}

const loginOutClick = () => {
  loginOutAjax()
    .then((res: any) => {
      const { code, msg } = res || {}
      if (code === 0) {
        userStore.resetUserInfo()
      } else {
        ElMessage.error(msg)
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

const selectTool = (name: string, label: string) => {
  if (name === 'AiReport' && route.name === 'AiReport') {
    eventBus.emit('reportReset')
    return
  }
  router.push({
    name: name,
    query: {
      tab: label,
    },
  })
}

watch(
  () => route.fullPath,
  () => {
    dataMap.currentTool = route?.query?.tab
  },
  {
    immediate: true,
  }
)
</script>

<style scoped lang="less">
.left-nav-container {
  width: 78px;
  border-radius: 12px;
  background: #fafbff;
  box-sizing: border-box;
  border: 1px solid #ffffff;
  box-shadow: 0px 6px 10px 0px rgba(0, 0, 0, 0.1);
  padding: 20px 0px 30px;
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
  width: 48px;
  cursor: pointer;
}

.tool-wrap {
  width: 48px;
  margin: 10px 0px 20px;
  padding: 10px 0px;
  border-top: 1px solid #d8d8d8;
  border-bottom: 1px solid #d8d8d8;
  .tool-item {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    margin: 9px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    img {
      width: 28px;
      height: 28px;
    }
    .label {
      line-height: 34px;
      font-size: 18px;
      text-align: center;
      border-radius: 8px;
      padding: 0px 12px;
      color: #ffffff;
      background: linear-gradient(116deg, #9482f8 14%, #4277f3 88%);
      font-family: Microsoft YaHei;
      display: none;
      white-space: nowrap;

      position: absolute;
      top: 50%;
      left: 66px;
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
  .info-box {
    border-radius: 6px;
    background: #ffffff;
    box-shadow: 0px 3px 16px 0px rgba(0, 0, 0, 0.1);
    .info-item {
      padding: 10px 15px 0px;
      display: flex;
      align-items: center;
      cursor: pointer;
      &.out {
        border-top: 1px solid #d8d8d8;
        margin-top: 10px;
        padding: 10px 15px 10px !important;
      }
      img {
        width: 15px;
        // height 15px;
      }
      .text {
        font-family: Microsoft YaHei;
        font-size: 15px;
        line-height: 20px;
        color: #3d3d3d;
        margin-left: 6px;
      }
    }
  }
}
</style>
