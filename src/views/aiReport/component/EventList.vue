<!-- 案例、文档、热点列表 -->
<template>
  <div class="event-list-wrap">
    <LabelWrap :title="title" style="margin-bottom: 10px" :isShowBtn="false" @re-submit="submit" />

    <slot></slot>

    <el-table v-if="listShow" :data="list" :scrollbar-always-on="true" max-height="462" @selection-change="handleSelectionChange">
      <!-- checkbox框 -->
      <!-- <el-table-column type="selection" width="28" v-if="isCaseBool" /> -->

      <!-- 标题 -->
      <el-table-column prop="title" :label="`${title}标题`">
        <template #default="scope">
          <span class="title" @click="open(scope.row)">
            {{ scope.row.title }}
          </span>
        </template>
      </el-table-column>

      <!-- 发布时间 -->
      <el-table-column prop="created_at" label="发布时间" align="center" width="120">
        <template #default="scope">
          <span>{{ scope.row.created_at?.split(' ')?.[0] }}</span>
        </template>
      </el-table-column>

      <!-- 关联度 -->
      <el-table-column label="关联度" align="center" width="120">
        <template #default="scope">
          <span>{{ scope.row.score?.toFixed(2) }}</span>
        </template>
      </el-table-column>

      <!-- 文章来源 -->
      <el-table-column prop="source" label="文章来源" align="center" width="200">
        <template #default="scope">
          <span>{{ isHotBool ? SOURCE_ZH[scope.row.source] : scope.row.source }}</span>
        </template>
      </el-table-column>

      <!--  操作 -->
      <el-table-column label="操作" align="center" width="120" v-if="isFileBool">
        <template #default="scope">
          <span class="download" @click="openDetailClick(scope.row)">查看</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 预案详情 -->
    <FileDetail :visible="dataMap.visible" :content="dataMap.content" @close="dataMap.visible = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@/utils/message'
import { SOURCE_ZH } from '../config'
import { getFileDetailAjax } from '@/api/home'

import LabelWrap from './LabelWrap.vue'
import FileDetail from './FileDetail.vue'

const prop = defineProps({
  title: {
    type: String,
  },
  isStop: {
    type: Boolean,
  },
  isShowBtn: {
    type: Boolean,
    default: true,
  },
  listShow: {
    type: Boolean,
    default: true,
  },
  list: {
    type: Array,
    default: () => [],
  },
})
const router = useRouter()
const emit = defineEmits(['clickCase', 'reSubmit'])

const dataMap = reactive({
  visible: false,
  content: '',
})

// 属地案例
const isCaseBool = computed(() => {
  return prop.title?.includes('历史处置')
})

// 预案参考
const isFileBool = computed(() => {
  return prop.title?.includes('回应处置')
})

// 热点列表
const isHotBool = computed(() => {
  return prop.title?.includes('关联热点')
})

// 重新生成
const submit = (item: any) => {
  emit('reSubmit', item)
}

// 打开详情
const open = (item: any) => {
  if (isFileBool.value) {
    openDetailClick(item)
    return
  }
  const { case_id, aid, source, pos } = item || {}
  const name = isCaseBool.value ? 'CusDetail' : 'Detail'

  // 人民网留言详情，需要等后端接口
  if (source === '人民网留言' && name === 'CusDetail') {
    Message('warning', '详情展示正在开发中，敬请期待')
    return
  }

  const page = router.resolve({
    name: name,
    query: {
      aid: aid ?? case_id,
      source: source,
      tab: '搜索',
      pos: pos ?? -999,
    },
  })
  window.open(page.href, '_blank')
}

// 查看预案
const openDetailClick = ({ doc_id }: any) => {
  getFileDetailAjax(doc_id)
    .then((res: any) => {
      const { code, data, msg } = res || {}
      if (code === 0 && data?.content) {
        dataMap.content = data?.content
        dataMap.visible = true
      } else {
        Message('error', msg)
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

const handleSelectionChange = (list: any) => {
  if (isCaseBool.value) {
    emit('clickCase', list)
  }
}
</script>

<style scoped lang="less">
.event-list-wrap {
  width: 100%;
  margin-top: 20px;

  .title {
    overflow: hidden;
    font-family: 'PingFang SC', sans-serif;
    color: #409eff;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  .download {
    color: #409eff;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  :deep(.el-table__inner-wrapper) {
    margin-top: 10px;
    page-break-inside: avoid;
    thead {
      th {
        background: #f5f7fa;
      }
    }
  }
}
</style>
