<template>
  <div :class="['bread-container', listLength > 1 ? '' : 'disable']">
    <div class="item" v-for="(el, index) in list" :key="el.name" @click="clickHandle(el, index)">
      <span :class="[isEndEl(index) ? '' : 'text']">{{ el.name }}</span>
      <img v-if="!isEndEl(index)" src="@/assets/img/left-arrow-icon.png" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const emit = defineEmits(['clickBread'])
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})

// 获取列表长度
const listLength = computed(() => {
  return props.list?.length
})

// 是否最后列表元素
const isEndEl = computed(() => {
  return (index: number) => {
    return index === listLength.value - 1
  }
})

//点击面包屑
const clickHandle = (el: any, index: number) => {
  if (isEndEl.value(index)) return
  emit('clickBread', el?.type, index)
}
</script>

<style scoped lang="less">
.bread-container {
  display: flex;
  margin-bottom: 7px;
  margin-left: 1px;
  font-size: 16px;
  line-height: 16px;

  &.disable {
    visibility: hidden;
  }

  .item {
    display: flex;
    align-items: center;

    .text {
      cursor: pointer;

      &:hover {
        color: #409eff;
        text-decoration: underline;
      }
    }

    img {
      width: 16px;
      height: 16px;
      margin: 0 1px;
    }
  }
}
</style>
