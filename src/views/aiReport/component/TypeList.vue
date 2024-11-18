<!-- 模版列表 -->
<template>
  <div class="type-wrap">
    <span>{{ typeList[dataMap.currentType] }}</span>
    <el-tooltip effect="light" placement="top">
      <img src="@/assets/img/report/type-icon.png" />
      <template #content>
        <div class="list-wrap">
          <div class="item" v-for="el of Object.keys(typeList)" :key="el" @click="typeClick(el)">{{ typeList[el] }}</div>
        </div>
      </template>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
const typeList = {
  '1': '周报',
  '2': '月报',
}
const dataMap = reactive({
  currentType: '1',
})
const typeClick = (id: string) => {
  dataMap.currentType = id
}
</script>

<style scoped lang="less">
.type-wrap {
  height: 100%;
  display: flex;
  align-items: center;
  img {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  span {
    font-family: Microsoft YaHei;
    font-size: 14px;
    line-height: 18px;
    color: #3d3d3d;
    margin-right: 6px;
  }
}
</style>
<style lang="less">
.list-wrap {
  .item {
    padding: 2px 4px;
    font-size: 14px;
    line-height: 20px;
    border: 5px;
    cursor: pointer;
    &:hover {
      background: #f5f5f5;
    }
  }
  .item + .item {
    margin-top: 6px;
  }
}
</style>
