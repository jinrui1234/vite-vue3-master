<!--
 * @Author: nibin
 * @Date: 2024-07-08 14:26:36
 * @LastEditors: nibin
 * @LastEditTime: 2024-07-17 16:18:34
 * @Description: demo
-->
<template>
  <div class="demo-container" @click="clickHandle">
    demo:{{ demoStore.count }}
    <el-button type="primary">Primary</el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, defineProps, defineEmits, defineExpose } from 'vue'
// import { useRoute, useRouter } from "vue-router";
import useDemoStore from '@/store/demo'
const demoStore = useDemoStore()

defineProps({
  name: {
    type: String,
    default: 'defaultName',
  },
})

defineEmits([])
defineExpose({})

// const route = useRoute();
// const router = useRouter();

const dataMap = reactive({
  name: '',
})

const clickHandle = () => {
  demoStore.increment()

  dataMap.name = 'changeName'
  console.log('clickHandle')
}
</script>

<style scoped lang="less">
.demo-container {
  width: 100%;
  height: 100%;
}
</style>
