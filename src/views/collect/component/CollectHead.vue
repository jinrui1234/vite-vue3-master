<template>
  <div class="head-wrap">
    <div class="head-left">
      <img :src="transformToUrl()" />
      <div class="title">{{ title }}</div>
    </div>
    <div class="more" @click="jumpPage">更多</div>
  </div>
</template>

<script setup="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const prop = defineProps({
  icon: {
    type: String,
  },
  source: {
    type: String,
  },
  title: {
    type: String,
  },
})

//图片路径处理
const transformToUrl = () => {
  return new URL(`../../../assets/img/source/${prop.icon}`, import.meta.url).href
}

// 跳转实时热点
const jumpPage = () => {
  router.push({
    name: 'List',
    query: {
      tab: '实时热点',
      source: prop.source,
    },
  })
}
</script>

<style lang="less" scoped>
.head-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 16px 0 20px;
  color: #05073b;
  background: #ecf5ff;
  border-radius: 9px 9px 0 0;

  .head-left {
    display: flex;

    .title {
      font-size: 20px;
      font-weight: 600;
    }

    img {
      width: 28px;
      height: 28px;
      margin-right: 10px;
    }
  }

  .more {
    font-size: 14px;
    font-weight: normal;
    cursor: pointer;

    &:hover {
      font-weight: 500;
    }
  }
}
</style>
