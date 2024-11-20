<template>
  <div>
    <el-dialog
      :model-value="visible"
      title="预案详情"
      width="900"
      :append-to-body="false"
      :show-close="true"
      :close-on-click-modal="false"
      @close="confirmClick"
    >
      <div class="detail-wrap" v-html="content"></div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirmClick"> 确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { watch, nextTick } from 'vue'
const emit = defineEmits(['close'])
const prop = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  content: {
    type: String,
    default: '',
  },
})

const confirmClick = () => {
  emit('close')
}

watch(
  () => prop.visible,
  (value) => {
    if (value) {
      nextTick(() => {
        document.getElementsByClassName('detail-wrap')?.[0]?.scrollTo({ top: 0 })
      })
    }
  }
)
</script>

<style scoped lang="less">
.detail-wrap {
  max-height: 550px;
  padding: 0 12px;
  overflow-y: auto;
  font-family: 'Source Han Sans CN', sans-serif;
  font-size: 15px;
  font-weight: 350;
  line-height: 24px;
  color: #05073b;
  user-select: none;

  :deep(p) {
    margin: 0 !important;
    text-indent: 2em;
  }

  :deep(h2) {
    text-align: center;
  }

  :deep(ol) {
    padding-left: 32px !important;
    margin: 0;

    p {
      margin: 0 !important;
      text-indent: 0 !important;
    }
  }

  :deep(ul) {
    padding-left: 32px !important;
    margin: 0;

    p {
      margin: 0 !important;
      text-indent: 0 !important;
    }
  }

  :deep(li) {
    position: relative;

    &::before {
      position: absolute;
      left: -1em;
      color: black;
      content: '•';
    }
  }
}

:deep(.el-dialog__header) {
  font-weight: 600;
}
</style>
