<template>
  <div class="quota-wrap">
    <div class="item" v-for="el of list" :key="el.name">
      <div class="num">
        {{ el.num }}
        <span v-if="el.unit">{{ el.unit }}</span>
      </div>
      <div class="des">{{ el.name }}</div>
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

<style lang="less" scoped>
.quota-wrap {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 20px;
  margin-top: 40px;

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .num {
      margin-bottom: 10px;
      font-size: 36px;
      font-weight: bold;
      line-height: 36px;

      span {
        margin-left: -8px;
        font-size: 18px;
        font-weight: 600;
        line-height: 22px;
        color: #999;
        letter-spacing: 0;
      }
    }

    .des {
      font-size: 18px;
      font-weight: 500;
      line-height: 22px;
      color: #999;
      letter-spacing: 0;
    }
  }
}
</style>
