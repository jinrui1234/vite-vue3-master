<template>
  <div class="summer-wrap">
    <div class="area_gray" v-for="(el, index) of list" :key="el.name">
      <div class="area_gray_text">{{ el.name }}</div>
      <div class="area_gray_num">
        <span class="left" v-if="!index">第</span>
        <span class="num">{{ el.num }}</span>
        <span class="right">{{ el.unit }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  list: {
    type: Array,
  },
})
</script>

<style scoped lang="less">
.summer-wrap {
  display: flex;
  height: 190px;
  background: #f7f7f7;
  border-radius: 9px;

  .area_gray {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .area_gray_text {
      margin-bottom: 14px;
      font-size: 24px;
      font-weight: 500;
      line-height: 24px;
      color: #999;
    }

    .area_gray_num {
      font-size: 24px;
      font-weight: 600;
      line-height: 22px;
      color: #3d3d3d;

      .num {
        // margin-left: 5px;
        font-size: 64px;
        font-weight: bold;
        line-height: 64px;
        color: #409eff;
        letter-spacing: 0;
        vertical-align: auto;
      }

      .right {
        margin-left: 3px;
      }

      .left {
        margin-right: 3px;
      }
    }
  }
}
</style>
