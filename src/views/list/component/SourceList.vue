<template>
  <div class="source-list-wrap">
    <div v-for="(el, index) in data.list" :key="index">
      <div :class="['item', el.source === source ? 'active' : '']" @click="selectSourceTab(el.source)">
        <img :src="transformToUrl(el.icon)" alt="" />
        <div class="title">{{ el.title }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { SOURCE_LIST } from '../config.ts'

const emit = defineEmits(['selectSource'])
defineProps({
  source: {
    type: String,
    default: '',
  },
})
const data = reactive({
  list: SOURCE_LIST,
})

const selectSourceTab = (id: string) => {
  emit('selectSource', id)
}

const transformToUrl = (icon: string) => {
  return new URL(`../../../assets/img/source/${icon}`, import.meta.url).href
}
</script>

<style scoped lang="less">
.source-list-wrap {
  // padding: 12px 20px;
  // border-radius: 9px;
  // background-color: #fff;
  // border: 1px solid #e6e6e6;
  // box-shadow: 0 3px 16px 0 rgb(0 0 0 / 10%);
  // display: grid;
  // grid-template-rows: repeat(5, 30px);
  // grid-template-columns: repeat(6, 184px);
  // row-gap: 7px;
  // column-gap: 10.5px;
  display: flex;
  flex-wrap: wrap;
  padding: 12px 20px;
  background-color: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 9px;
  box-shadow: 0 3px 16px 0 rgb(0 0 0 / 10%);

  .item {
    // height: 28px;
    // padding: 2px 6px;
    // box-sizing: border-box;
    // cursor: pointer;
    // display: inline-flex;
    // align-items: center;

    display: flex;
    align-items: center;
    height: 28px;
    padding: 2px 6px;
    margin-right: 40px;
    cursor: pointer;

    img {
      width: 22px;
      height: 22px;
      margin-right: 8px;
    }

    .title {
      font-size: 14.5px;
      color: #000;
    }

    &:hover {
      color: #f4f4f5;
      background: #409eff;
      border-radius: 4px;
    }
  }

  .active {
    color: #f4f4f5;
    background: #409eff;
    border-radius: 4px;
  }
}
</style>
