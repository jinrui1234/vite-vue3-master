<template>
  <div class="head-wrap">
    <div class="title-box">
      <img src="@/assets/img/list/avater-icon.png" />

      <div class="title" @click="handleLink(link)">
        <span class="text" title="点击跳转原文链接">{{ title }}</span>
        <span class="link">(阅读原文)</span>
      </div>
    </div>

    <div class="tip">{{ removeHTMLTags(descript) }}</div>
  </div>
</template>

<script setup lang="ts">
import { removeHTMLTags } from '@/utils/util'
defineProps({
  title: {
    type: String,
  },
  link: {
    type: String,
  },
  descript: {
    type: String,
  },
})
//跳转详情
const handleLink = (url: string) => {
  window.open(url)
}
</script>

<style scoped lang="less">
.head-wrap {
  color: #05073b;

  .title-box {
    display: flex;
    align-items: center;
    width: 100%;

    img {
      width: 50px;
      height: 50px;
    }

    .title {
      margin-left: 14px;
      cursor: pointer;

      .text {
        font-size: 40px;
        font-weight: 600;
        &:hover {
          text-decoration: underline;
          opacity: 0.9;
        }
      }

      .link {
        margin-left: 3px;
        font-size: 13px;
        line-height: 13px;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }

  .tip {
    margin-top: 24px;
    margin-bottom: 30px;
    font-size: 24px;
    font-weight: normal;
    line-height: 1.5;
    word-break: break-word;
  }
}
</style>
