<template>
  <div class="left-nav-container">
    <img class="logo-icon" :src="transformToUrl('logo-icon')" alt="" />
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
    <img class="login-icon" :src="transformToUrl('login-icon')" alt="" />
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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

const dataMap = reactive({
  currentTool: '',
})

const transformToUrl = (url: string, label?: string) => {
  const icon = dataMap.currentTool === label ? url + '-s' : url
  return new URL(`../assets/img/report/${icon}.png`, import.meta.url).href
}

const selectTool = (name: string, label: string) => {
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

      position: absolute;
      top: 50%;
      right: -120px; // ??
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
