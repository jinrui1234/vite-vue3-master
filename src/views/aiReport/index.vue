<template>
  <div class="ai-report-container">
    <!-- 报告页封面 -->
    <div class="report-sub" v-if="!dataMap.loading">
      <Slogan />
      <Search />
    </div>

    <!-- 报告页主页 -->
    <div class="report-main" v-else>
      <Report />
      <!-- 停止/重新生成按钮 -->
      <!-- <div class="stop-btn" v-if="!stopStatus" @click="stopBtnClick">
      <img src="@/assets/img/report/earth-icon.webp" alt="" />
      <span>停止生成</span>
        </div>
        <div class="stop-btn" v-else @click="resetBtnClick">
        <img src="@/assets/img/report/reset-icon.png" alt="" />
        <span>重新生成</span>
        </div> -->
      <!-- 生成状态展示 -->
      <div class="loading-wrap">
        <img src="@/assets/img/report/loading-icon.webp" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

import Slogan from './component/Slogan.vue'
import Search from './component/Search.vue'
import Report from './component/Report.vue'

const dataMap = reactive({
  loading: false,
})
</script>

<style scoped lang="less">
.ai-report-container {
  width: 100%;
  height: 100%;
  padding-left: calc(50% - 495px);
  padding-right: calc(50% - 495px);
  box-sizing: border-box;
}

.report-sub {
  width: 100%;
  height: 100%;
  padding-top: 190px;
  box-sizing: border-box;
}

.report-main {
  width: 100%;
  height: 100%;
  padding: 30px 0 23px;
  box-sizing: border-box;
  position: relative;
  .loading-wrap {
    position: absolute;
    top: 42px;
    left: -44px;

    img {
      width: 32px;
      height: 32px;
    }
  }
}
</style>
