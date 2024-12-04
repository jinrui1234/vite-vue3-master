<!-- 数据总览 -->
<template>
  <div class="data-capture-wrap">
    <div class="item" v-for="el of list" :key="el.name">
      <div class="num">
        <span>{{ el.num }}</span>
        <span class="unit" v-if="el.unit">{{ el.unit }}</span>
      </div>
      <div class="des">{{ el.name }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})
</script>

<style lang="less" scoped>
.data-capture-wrap {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 18px;
  padding: 20px 0;
  background: #eff0f0;
  border-radius: 9px;
  page-break-inside: avoid;

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .num {
      margin-bottom: 4px;
      font-family: '京东金融数字体', sans-serif;
      font-size: 28px;
      font-weight: bold;
      line-height: 28px;

      .unit {
        margin-left: 3px;
        font-size: 16px;
        font-weight: 600;
        line-height: 22px;
        color: #999;
      }
    }

    .des {
      font-size: 16px;
      font-weight: 500;
      line-height: 22px;
      color: #999;
    }
  }
}
</style>
