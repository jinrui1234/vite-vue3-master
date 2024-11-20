<!-- 模块head -->
<template>
  <div class="label-wrap">
    <div class="label-head-wrap">
      <div class="title">{{ title }}</div>
      <div class="btn-wrap" v-show="isShowBtn">
        <el-tooltip :content="`重新生成${title}`" :disabled="disabled" placement="top">
          <span :class="[disabled ? 'disabled' : '']" @click="edit"> 重新生成 </span>
        </el-tooltip>
      </div>
    </div>

    <!-- 编辑按钮-弹窗 -->
    <el-dialog v-model="dataMap.visible" title="编辑" width="600">
      <el-input
        v-model.trim="dataMap.inputValue"
        type="textarea"
        placeholder="请输入您对此模块的要求，以便智能生成合适的内容，如未填写，提交后将使用当前已有提示词进行生成"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm"> 提交 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const emit = defineEmits(['reSubmit'])
const prop = defineProps({
  title: {
    type: String,
    default: '',
  },
  isShowBtn: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const dataMap = reactive({
  inputValue: '',
  visible: false,
})

const edit = () => {
  if (prop.disabled) return
  dataMap.visible = true
}

const cancel = () => {
  dataMap.visible = false
  dataMap.inputValue = ''
}

const confirm = () => {
  emit('reSubmit', dataMap.inputValue)
  cancel()
}
</script>

<style scoped lang="less">
.label-head-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  font-family: 'Microsoft YaHei', sans-serif;

  .title {
    font-size: 20px;
    font-weight: bold;
    color: #05073b;
  }

  .btn-wrap {
    display: flex;
    align-items: center;

    span {
      font-size: 15px;
      color: #409eff;
      cursor: pointer;

      &:hover {
        color: #66b1ff;
      }
    }
  }
}

:deep(.el-textarea__inner) {
  width: 100%;
  min-height: 100px !important;
  padding: 8px;
  font-size: 14px;
  color: #222329;
}
</style>
