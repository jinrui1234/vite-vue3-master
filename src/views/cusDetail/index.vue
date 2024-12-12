<!-- 坪山特有的案例详情 -->
<template>
  <div
    class="cus-detail-container"
    v-loading="dataMap.loading"
    element-loading-text="加载中..."
    element-loading-background="rgba(122, 122, 122,0.15)"
  >
    <div class="content" v-if="!dataMap.loading">
      <ArticleTitle
        :title="dataMap.case?.article_title || dataMap.case?.title"
        :link="dataMap.case?.article_url || dataMap.case?.link"
        :descript="dataMap.case?.article_content || dataMap.case?.content"
      />

      <div class="detail-container">
        <div class="title">案例详情</div>

        <div class="detail-box">
          <div class="item" v-for="el in dataMap.list" :key="el.value">
            <span class="item-title">{{ `${el.key}` }}:</span>
            <span>{{ `${el.value}` }}</span>
          </div>
        </div>
      </div>

      <div class="reply-detainer-container">
        <div class="title">{{ `${dataMap.reply?.length}个回复` }}</div>

        <div class="reply-box" v-for="(el, index) in dataMap.reply" :key="index">
          <ReplyItem :item="el" />
          <div class="text">{{ removeHTMLTags(el?.trace_content || el?.content) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { Message } from '@/utils/message'
import { getCusDetailAjax } from '@/api/home'
import { removeHTMLTags } from '@/utils/util'

import ArticleTitle from '@/views/detail/component/ArticleTitle.vue'
import ReplyItem from './component/ReplyItem.vue'

const { aid, source } = useRoute()?.query || {}
const dataMap = reactive({
  case: {},
  reply: [],
  list: [],
  loading: true,
})

// 获取案例详情
const getCaseDetailHandler = async () => {
  try {
    const res = await getCusDetailAjax(aid, source)
    const { code, data, msg } = JSON.parse(JSON.stringify(res || {}))
    if (code === 0) {
      if (Object.keys(data)?.length) {
        dataMap.case = data.case
        dataMap.reply = data.reply || []
        const {
          loginName,
          dept_name,
          article_time,
          created_at,
          article_form,
          article_author,
          grade_name,
          event_classify_names,
          author,
          leader,
          create_time_fmt,
          type_name,
          domain,
          stat,
        } = data.case || {}
        if (source === '人民网留言') {
          pushList('用户', author)
          pushList('留言对象', leader)
          pushList('领域', domain)
          pushList('时间', create_time_fmt)
          pushList('状态', stat)
          pushList('类型', type_name)
        } else {
          pushList('下发人', loginName)
          pushList('作者', article_author)
          pushList('处理部门', '--')
          pushList('下发部门', dept_name)
          pushList('信息来源', article_form)
          pushList('舆情分类', event_classify_names)
          pushList('下发时间', created_at)
          pushList('发现时间', article_time)
          pushList('舆情性质', grade_name)
        }
      }
    } else {
      Message.error(msg)
    }
  } catch (error) {
    Message.error(error)
  }
}

const pushList = (key: string, value: string) => {
  dataMap.list.push({
    key: key,
    value: value || '--',
  })
}

onMounted(async () => {
  await getCaseDetailHandler()
  setTimeout(() => {
    dataMap.loading = false
  }, 500)
})
</script>

<style scoped lang="less">
.cus-detail-container {
  width: 100%;
  height: 100%;
  padding-left: calc(50% - 580px);
  padding-right: calc(50% - 580px);
  padding-top: 40px;
  padding-bottom: 40px;
  background: #d2e9fe;
  background-image: url('@/assets/img/bg-icon.png');
  background-repeat: no-repeat;
  background-size: 100% 599px;
  box-sizing: border-box;
  overflow-y: overlay;
  font-family: 'Microsoft YaHei', sans-serif;
}

.content {
  width: 100%;
  position: relative;
}

.detail-container {
  padding: 20px 30px 34px;
  margin-bottom: 25px;
  background-color: #fff;
  border-radius: 9px;
  box-shadow: 0 3px 16px 0 rgb(0 0 0 / 10%);

  .title {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
    line-height: 28px;
    color: #333;
  }

  .detail-box {
    display: grid;
    grid-template-rows: 38px 38px;
    grid-template-columns: repeat(3, 1fr);
    width: 100%;
    height: 100%;
    padding: 15px;
    background: #f7f7f7;
    border-radius: 9px;
    box-sizing: border-box;

    .item {
      display: grid;
      grid-template-rows: 30px;
      grid-template-columns: repeat(2, 1fr);
      overflow: hidden; /* 确保超出容器的内容被截断 */
      font-size: 17px;
      line-height: 38px;
      color: #999;
      text-overflow: ellipsis; /* 在文本末尾显示省略号 */
      white-space: nowrap; /* 防止文本换行 */
      .item-title {
        margin-right: 6px;
        text-align: right;
      }
    }
  }
}

.reply-detainer-container {
  padding: 20px 30px 34px;
  background-color: #fff;
  border-radius: 9px;
  box-shadow: 0 3px 16px 0 rgb(0 0 0 / 10%);

  .title {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
    line-height: 28px;
    color: #333;
  }

  .reply-box {
    height: auto;
    border-radius: 9px;

    .text {
      min-height: 80px;
      padding: 13px 35px;
      font-size: 16px;
      line-height: 26px;
      background: #f5f5f5;
      border-bottom-right-radius: 9px;
      border-bottom-left-radius: 9px;
    }
  }

  .reply-box + .reply-box {
    margin-top: 32px;
  }
}
</style>
