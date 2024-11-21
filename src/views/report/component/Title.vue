<template>
  <div class="title-wrap" @click="jumpPage()">
    <el-tooltip content="点击跳转原文链接" :enterable="true" :disabled="disable" effect="light" :hide-after="0" placement="top">
      <span class="text">{{ `【${title}】` }}</span>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: '',
  },
  disable: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['jump'])
const jumpPage = () => {
  emit('jump')
}
</script>

<style scoped lang="less">
.title-wrap {
  line-height: 64px;
  text-align: center;
  cursor: pointer;

  .text {
    font-size: 48px;
    font-weight: bold;
    color: #333;

    &:hover {
      // text-decoration: underline;
      opacity: 0.8;
    }
  }

  // .link {
  //   margin-left: -20px;
  //   font-size: 13px;
  //   line-height: 13px;

  //   &:hover {
  //     opacity: 0.8;
  //     // text-decoration: underline;
  //   }
  // }
}
</style>
