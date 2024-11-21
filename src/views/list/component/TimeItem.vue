<template>
  <div class="time-wrap">
    <div :class="['tab-item', el.id === timeId ? 'active' : '']" v-for="el of list" :key="el.id" @click="handleClick(el)">
      {{ el.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['clickYear'])
defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  timeId: {
    type: Number,
  },
})

const handleClick = (el: any) => {
  emit('clickYear', el?.name, el?.id)
}
</script>

<style scoped lang="less">
.time-wrap {
  position: relative;
  left: 50%;
  display: inline-flex;
  justify-content: center;
  height: 28px;
  margin: 22px 0 13px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transform: translateX(-50%);

  .tab-item {
    padding: 4px 16px;
    font-size: 12px;
    color: #606266;
    cursor: pointer;
    background-color: #fff;

    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    &:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    &.active {
      color: #fff;
      background: #409eff;
    }
  }

  .tab-item + .tab-item {
    border-left: 1px solid #dcdfe6;
  }
}
</style>
