<template>
  <div class="list-item-wrap">
    <div class="title-wrap">
      <img class="doc-icon" src="@/assets/img/list/doc-icon.png" />
      <img class="doc-icon doc-icon-s" src="@/assets/img/list/doc-icon-s.png" />
      <div class="title" @click="jumpPage(item)">{{ item.title || '-' }}</div>
      <div class="time">{{ item.create_time || '-' }}</div>
      <img class="delete-icon" src="@/assets/img/list/delete-icon.png" @click.prevent="deleteClick(item.id)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { REPORT_TYPE } from '@/views/aiReport/config'

const emit = defineEmits(['deleteClick'])
defineProps({
  item: {
    type: Object,
    default: () => {},
  },
})

const router = useRouter()

// 删除历史记录
const deleteClick = (id: string) => {
  emit('deleteClick', { id: id })
}

// 跳转历史报告详情页
const jumpPage = ({ id, type = '1' }: any) => {
  const name = REPORT_TYPE[type]
  const url = router.resolve({
    name: name,
    query: {
      id: id,
      isHistory: 1,
    },
  })
  window.open(url.href, '_blank')
}
</script>

<style scoped lang="less">
.list-item-wrap {
  width: 100%;
  height: 40px;
  border-radius: 9px;
  background: #ffffff;
  color: #05073b;
  box-shadow: 0px 3px 16px 0px rgba(0, 0, 0, 0.1);
  padding: 8px 12px;
  margin-top: 10px;
  box-sizing: border-box;
}

.title-wrap {
  width: 100%;
  height: 24px;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  display: flex;
  align-items: center;

  &:hover {
    background: #ecf5ff;
    color: #409eff;
    .doc-icon,
    .time {
      display: none;
    }
    .doc-icon-s,
    .delete-icon {
      display: inline-block;
    }
  }

  .doc-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }

  .doc-icon-s {
    display: none;
  }

  .title {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    margin: 0px 20px 0px 6px;
  }

  .time {
    text-align: center;
  }

  .delete-icon {
    flex-shrink: 0;
    width: 13px;
    height: 13px;
    cursor: pointer;
    display: none;
  }
}
</style>
