<!-- 报告装饰门 -->
<template>
  <div class="report-door-wrap">
    <img class="left-icon" src="@/assets/img/report/star-icon.png" alt="" />
    <img class="right-icon" src="@/assets/img/report/star-icon.png" alt="" />
    <div class="spite"></div>
    <div class="spite spite2"></div>
    <span class="label">舆情研判参考</span>
  </div>
</template>
<style scoped lang="less">
.report-door-wrap {
  position: relative;
  width: 100%;
  padding: 0 60px;
  margin: 30px 0;
  font-size: 27px;
  line-height: 38px;
  color: #05073b;
  text-align: center;
  box-sizing: border-box;

  img {
    position: absolute;
    top: 50%;
    width: 38px;
    height: 38px;
    transform: translateY(-50%);
  }

  .left-icon {
    left: 50%;
    margin-left: 100px;
  }

  .right-icon {
    right: 50%;
    margin-right: 100px;
  }

  .spite {
    position: absolute;
    top: 50%;
    width: 295px;
    height: 2px;
    background: #ed0000;
    transform: translateY(-50%);
  }

  .spite2 {
    right: 60px !important;
  }
}
</style>
