<template>
  <div class="item" v-for="(item, index) of list" :key="item.id" @click="goArticle(index, item.aid)">
    {{ `${index + 1}. ${item.title}` }}
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const prop = defineProps({
  list: {
    type: Array,
  },
  source: {
    type: String,
  },
})

//跳转详情页
const goArticle = (index: number, aid: number) => {
  const page = router.resolve({
    name: 'Detail',
    query: {
      source: prop.source,
      aid: aid,
      tab: '实时热点',
      pos: index + 1,
    },
  })
  window.open(page.href, '_blank')
}
</script>

<style scoped lang="less">
.item {
  height: 40px;
  padding: 0 18px 0 12px;
  overflow: hidden;
  font-size: 14px;
  line-height: 40px;
  color: #000;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  border-bottom: 2px solid #f5f5f5;
  border-radius: 4px;

  &:hover {
    color: #409eff;
  }
}
</style>
