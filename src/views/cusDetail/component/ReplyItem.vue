<template>
  <div class="reply-wrap">
    <img class="icon" src="@/assets/img/list/case-info.png" alt="" />
    <div class="item">{{ item?.loginName }}</div>
    <div class="item">部门: {{ item?.deptName }}</div>
    <div class="item">时间: {{ item?.created_at }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  item: {
    type: Object,
    default: () => {},
  },
})
</script>

<style scoped lang="less">
.reply-wrap {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  height: 35px;
  padding: 0 10px;
  overflow: hidden; /* 确保超出容器的内容被截断 */
  font-size: 15px;
  color: #515151;
  text-overflow: ellipsis; /* 在文本末尾显示省略号 */
  white-space: nowrap; /* 防止文本换行 */
  background: #fff;
  border-top-left-radius: 9px;
  border-top-right-radius: 9px;
  box-shadow: 0 4px 39px 9px rgb(81 69 159 / 9%);

  .icon {
    width: 25px;
    height: 25px;
    margin-top: -1.5px;
    margin-right: 3.5px;
  }

  .item + .item {
    margin-left: 30px;
  }
}
</style>
