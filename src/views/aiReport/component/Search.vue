<template>
  <div class="search-wrap">
    <div class="left-wrap">
      <img class="robot-icon" src="@/assets/img/report/robot-icon.png" />
    </div>
    <div class="right-wrap">
      <div class="tool-wrap">
        <TypeList />
      </div>
      <el-input
        type="textarea"
        placeholder="请输入您关注的舆情主题或者事件描述，可以输入文本、链接"
        v-model.trim="dataMap.textareaValue"
        @keyup.enter="() => handleSubmit()"
      />
      <div class="btn" @click="() => handleSubmit()">
        <img src="@/assets/img/report/submit-icon.png" alt="" />
        <span>提交</span>
      </div>
    </div>

    <div class="mode-wrap">
      <div :class="['mode-item', dataMap.currentType === el.id ? 'active' : '']" v-for="el of modeList" :key="el.id" @click="typeClick(el.id)">
        <img :src="transformToUrl(el.icon, el.id)" alt="" />
        <span>{{ el.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TypeList from './TypeList.vue'
defineProps({
  status: {
    type: Boolean,
  },
  stopStatus: {
    type: Boolean,
    default: true,
  },
})
const modeList = [
  {
    id: '1',
    name: '前端研判',
    icon: 'judge-icon',
  },
  {
    id: '2',
    name: '舆情分析',
    icon: 'assay-icon',
  },
]
const dataMap = reactive({
  type: '2',
  textareaValue: '',

  currentType: '1',
})

const typeClick = (id: string) => {
  dataMap.currentType = id
}

const transformToUrl = (url: string, id?: string) => {
  const icon = dataMap.currentType === id ? url + '-s' : url
  return new URL(`../../../assets/img/report/${icon}.png`, import.meta.url).href
}

// 提交
const handleSubmit = () => {}

defineExpose({
  handleSubmit,
})
</script>

<style scoped lang="less">
.search-wrap {
  width: 100%;
  height: 135px;
  margin-top: 20px;
  border-radius: 12px;
  box-shadow: 0 3px 16px 0 rgb(0 0 0 / 10%);
  display: flex;
  position: relative;
}

.left-wrap {
  display: flex;
  justify-content: center;
  width: 60px;
  padding-top: 30px;
  background: #f4f4f5;

  img {
    width: 48px;
    height: 48px;
  }
}

.right-wrap {
  position: relative;
  flex: 1;
  background: #fff;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;

  .tool-wrap {
    height: 32px;
    padding: 0px 15px;
    border-bottom: 1px solid #d8d8d8;
    display: flex;
    justify-content: flex-end;
  }

  :deep(.el-textarea__inner) {
    height: 102px !important;
    padding: 8px;
    font-size: 14px;
    color: #222329;
    border-radius: 12px;
    box-shadow: none;
  }

  .btn {
    position: absolute;
    right: 16px;
    bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    padding: 0 16px;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    user-select: none;
    background: #409eff;
    border-radius: 100px;

    &:hover {
      background: #5cb6ff;
    }

    img {
      width: 13px;
      height: 13px;
      margin-top: 1px;
      margin-right: 6px;
    }
  }
}

.mode-wrap {
  display: flex;
  position: absolute;
  top: -46px;
  left: 60px;
  .mode-item {
    height: 34px;
    border-radius: 10px;
    background: #ffffff;
    padding: 0px 15px;
    color: #3d3d3d;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    &.active {
      background: linear-gradient(114deg, #9482f8 14%, #4277f3 88%);
      color: #fff;
    }
    img {
      width: 24px;
      height: 24px;
    }
    span {
      font-family: Microsoft YaHei;
      font-size: 15px;
      line-height: 22px;

      margin-left: 4px;
    }
  }
  .mode-item + .mode-item {
    margin-left: 12px;
  }
}
</style>
