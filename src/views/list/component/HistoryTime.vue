<template>
  <div>
    <el-dialog
      :model-value="visible"
      title="历史数据"
      width="1101px"
      :append-to-body="false"
      :show-close="true"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <!-- 年份选择 -->
      <TimeItem :list="dataMap.timeList" :timeId="dataMap.timeId" @click-year="clickYear" />

      <!-- 选中时间面包屑 -->
      <BreadList :list="dataMap.breadList" @click-bread="clickBread" />

      <div class="list-box">
        <div class="list">
          <div :class="['list-time', el.disable ? 'disable' : '']" v-for="el in dataMap.list" :key="el?.id" @click="handleSubmit(el)">
            {{ el?.name }}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { TIME_TYPE, TIME_PROP } from '../config.ts'
import { getDayTimeAjax } from '@/api/home'

import TimeItem from './TimeItem.vue'
import BreadList from './BreadList.vue'

const emit = defineEmits(['close', 'submit'])
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  source: {
    type: String,
    default: '',
  },
})
const dataMap = reactive({
  list: [],
  timeList: [],
  breadList: [],

  day: 0,
  hour: 0,

  isFirst: true,
  timeId: 0,
})

watch(
  () => props.visible,
  (value) => {
    if (value) getTime()
  }
)

// breadList是否已经存在当前值
const isExistence = computed(() => {
  return (name: string) => {
    return dataMap.breadList.some((el: any) => el.name === name)
  }
})

// 点击年份选择
const clickYear = (name: string, id: string) => {
  dataMap.timeId = id
  getBreadList(name, id, 'year')
  getTime('day')
}

// 点击面包屑
const clickBread = (type: string, index: number) => {
  getTime(TIME_TYPE[type])
  dataMap.breadList.splice(index + 1)
}

// 获取面包屑列表
const getBreadList = (name: string, id: string, type: string) => {
  if (type === 'year') {
    dataMap.breadList = [
      {
        name: name,
        id: id,
        type: type,
      },
    ]
  } else {
    if (isExistence.value(name)) return
    dataMap.breadList.push({
      name: name,
      id: id,
      type: type,
    })
  }
}

//初始化
const getTime = (type?: string) => {
  const params: any = getParams(type)
  getDayTimeAjax(props.source, params)
    .then((res: any) => {
      const { code, data, msg } = res || {}
      if (code == 0 && data?.list?.length) {
        if (dataMap.isFirst) {
          dataMap.timeList = data.list.map((el: any, index: number) => {
            if (!index) {
              dataMap.timeId = el
              getBreadList(`${el}年`, el, 'year')
            }
            return {
              name: `${el}年`,
              id: el,
            }
          })
          dataMap.isFirst = false
          getTime('day')
        } else {
          if (type === 'day') {
            dataMap.list = data.list.map((el: number) => {
              return {
                name: getDayFormate(el),
                id: el,
                type: type,
                disable: false,
              }
            })
          } else {
            const newArr = new Array(TIME_PROP[type]).fill(0)
            dataMap.list = newArr?.map((el: number, index: number) => {
              return {
                name: index.toString(),
                id: index,
                type: type,
                disable: !data.list.includes(index),
              }
            })
          }
        }
      } else {
        ElMessage.error(msg)
      }
    })
    .catch((error) => {
      ElMessage.error(error)
    })
}

// 获取请求参数
const getParams = (type: string) => {
  const { timeId, day, hour } = dataMap
  if (type === 'day') {
    return {
      year: timeId,
    }
  } else if (type === 'hour') {
    return {
      year: timeId,
      day: day,
    }
  } else if (type === 'min') {
    return {
      year: timeId,
      day: day,
      hour: hour,
    }
  } else {
    return {
      year: 0,
    }
  }
}

// 获取年月日时间格式
const getDayFormate = (time: number) => {
  const year = String(time)?.slice(0, 4)
  const month = String(time)?.slice(4, 6)
  const day = String(time)?.slice(6, 8)
  return `${year}-${month}-${day}`
}

//提交
const handleSubmit = (item: any) => {
  if (item?.disable) return
  const { type, id, name } = item
  if (type === 'min') {
    const { isBool, time } = isThreeDay(id)
    const params = {
      day: dataMap.day,
    }
    if (isBool) {
      params['hour'] = dataMap.hour
      params['min'] = id
    }
    emit('submit', isBool ? 'v1' : 'v2', params, time)
    reset()
  } else {
    if (type === 'day') dataMap.day = id
    if (type === 'hour') dataMap.hour = id
    getBreadList(name, id, type)
    getTime(TIME_TYPE[type])
  }
}

// 是否三天内时间
const isThreeDay = (min: string) => {
  const { day, hour, timeId } = dataMap
  const res1 = String(day)?.slice(4, 6)
  const res2 = String(day)?.slice(6, 8)
  const time = new Date(`${timeId}/${res1}/${res2} ${hour}:${min}`)?.getTime()
  const timed = new Date()?.getTime() - 24 * 3600000 * 3
  const selectTime = `(${timeId}年${res1}月${res2}日 ${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')})`
  return {
    isBool: time >= timed,
    time: selectTime,
  }
}

//取消
const handleClose = () => {
  emit('close')
  reset()
}

// 重置
const reset = () => {
  dataMap.timeList = []
  dataMap.breadList = []
  dataMap.list = []
  dataMap.isFirst = true
  dataMap.timeId = 0
  dataMap.day = 0
  dataMap.hour = 0
}
</script>

<style lang="less" scoped>
.list-box {
  width: 100%;
  height: 410px;
  overflow-y: auto;
  border: 1px solid #e9ecf1;

  .list {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: repeat(7, 1fr);

    .list-time {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 82px;
      font-size: 16px;
      font-weight: normal;
      color: #303133;
      cursor: pointer;
      border: 1px solid #e9ecf1;

      &:hover {
        color: #409eff;
        background: #ecf5ff;
      }

      &.disable {
        color: #303133 !important;
        cursor: not-allowed;
        background: #f6f6f8 !important;
      }
    }
  }
}

:deep(.el-overlay) {
  background: rgb(0 0 0 / 60%);
}

:deep(.el-dialog) {
  padding: 0 !important;

  .el-dialog__header {
    padding: 0 20px;
    margin-right: 0;
    line-height: 48px;
    background: #eff1f3;

    .el-dialog__title {
      font-size: 14px;
      font-weight: 500;
      line-height: 17px;
      color: #0d0d0d;
    }

    .el-dialog__headerbtn {
      top: 0;
      font-size: 18px;
    }
  }

  .el-dialog__body {
    padding: 0 50px 39px;
  }
}
</style>
