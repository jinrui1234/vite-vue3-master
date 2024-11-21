<template>
  <div :class="['list-item', isReportTab() ? 'padding-2' : '']" v-for="(item, index) in list" :key="index">
    <span class="list-index">{{ num(index) }}</span>

    <span class="list-title" @click="jumpPage('Detail', item, index)">
      {{ item.title }}
    </span>

    <div class="list-btn" v-if="isReportTab()" @click="jumpPage('Report', item, index)">查看报告</div>

    <template v-else>
      <div class="list-count" v-if="item.hot_value !== undefined">
        <span>热度值 {{ getHot(item) }}</span>
      </div>
      <div class="list-count rank" v-else>
        <span>最高榜位 {{ item.rank ?? '-' }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { bigNumberTransform } from '@/utils/util'

const router = useRouter()
const { tab } = useRoute()?.query || {}

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  sourceId: {
    type: String,
    default: '',
  },
  page: {
    type: Number,
    default: 1,
  },
})

const num = computed(() => {
  return (index: number) => {
    return (props.page - 1) * 20 + index + 1
  }
})

const isReportTab = () => {
  return tab === '舆情报告'
}

//跳转详情页
const jumpPage = (name: string, item: any, index: number) => {
  const page = router.resolve({
    name: name,
    query: {
      aid: item?.aid,
      source: props.sourceId,
      tab: tab,
      rank: index + 1,
    },
  })
  window.open(page.href, '_blank')
}

const getHot = (item: any) => {
  const value = item?.hot_value
  return value ? bigNumberTransform(parseInt(value), true, 2) : '-'
}
</script>

<style scoped lang="less">
.list-item {
  display: flex;
  align-items: center;
  padding-top: 4px;
  padding-bottom: 4px;
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: normal;
  line-height: 16px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: rgb(66 161 255 / 15%);
  }

  &.padding-2 {
    padding-top: 2px !important;
    padding-bottom: 2px !important;
    margin-bottom: 10px !important;
  }

  .list-index {
    width: 40px;
    padding-left: 10px;
    color: #333;
  }

  .list-title {
    flex: 1;
    overflow: hidden;
    color: #409eff;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .list-count {
    width: 130px;
    padding: 0 6px;
    text-align: left;
    white-space: nowrap;

    &.rank {
      width: 100px;
    }
  }

  .list-btn {
    width: 88px;
    font-size: 13px;
    font-weight: 500;
    line-height: 22px;
    color: #fff;
    text-align: center;
    letter-spacing: 1px;
    cursor: pointer;
    background: #409eff;
    border-radius: 4px;
    // &:hover {
    // background: #79bbff;
    // opacity: 0.85;
    // }
  }
}
</style>
