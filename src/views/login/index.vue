<template>
  <div>
    <el-dialog :model-value="visible" width="580px" :append-to-body="false" :show-close="true" :close-on-click-modal="false" @close="handleClose">
      <div class="login-container">
        <div class="title-wrap">
          <div class="main-title">欢迎登录</div>
          <div class="sub-title">智云万象·舆情分析研判平台</div>
        </div>
        <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef">
          <el-form-item prop="username">
            <img src="../../assets/img/login/user-icon.png" alt="" />
            <el-input v-model="loginForm.username" placeholder="用户名" />
          </el-form-item>
          <el-form-item prop="password">
            <img src="../../assets/img/login/lock-icon.png" alt="" />
            <el-input :type="dataMap.passwordShow ? 'text' : 'password'" placeholder="密码" v-model="loginForm.password" />
            <img src="../../assets/img/login/eye-icon.png" alt="" v-if="dataMap.passwordShow" @click="passwordShowClick" />
            <img src="../../assets/img/login/eye-close-icon.png" alt="" v-else @click="passwordShowClick" />
          </el-form-item>

          <div class="record-wrap">
            <el-checkbox>记住我</el-checkbox>
          </div>
          <el-button type="primary" @click="submitHandle">登录</el-button>

          <div class="rule-wrap">
            <el-checkbox v-model="dataMap.protocol" />
            <div class="text">已阅读并同意智云万象·舆情分析研判平台帐号 <a href="">用户协议</a> 和 <a href="">隐私政策</a></div>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import CryptoJS from 'crypto-js'
import { Message } from '@/utils/message'
import { loginAjax } from '@/api/auth'
import useUserStore from '@/store/user'

const userStore = useUserStore()

const emit = defineEmits(['close'])
const loginFormRef = ref(null)

defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})
const dataMap = reactive({
  passwordShow: false,
  protocol: false,
})
const loginForm = reactive({
  username: '',
  password: '',
})
const loginRules = {
  username: [{ required: true, trigger: 'change', message: '请输入用户名' }],
  password: [{ required: true, trigger: 'change', message: '请输入密码' }],
}

// 密码显隐切换
const passwordShowClick = () => {
  dataMap.passwordShow = !dataMap.passwordShow
}

// 关键
const handleClose = () => {
  emit('close')
}

// 登陆
const submitHandle = () => {
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      const { username, password } = loginForm || {}
      const param = {
        account: username,
        pwd: CryptoJS.MD5(password).toString(),
      }
      loginAjax(param)
        .then((res: any) => {
          const { code, msg, data } = res || {}
          if (code === 0) {
            userStore.setUserInfo(data)
            emit('close')

            Message('success', '登陆成功')
          } else {
            Message('error', msg)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
  })
}
</script>

<style scoped lang="less">
.login-container {
  padding: 50px 90px 70px;
}

.title-wrap {
  font-family: PingFang SC;
  margin-bottom: 18px;
  .main-title {
    font-size: 36px;
    line-height: 40px;
    color: #05073b;
  }
  .sub-title {
    font-size: 14px;
    line-height: 20px;
    color: #05073b;
    margin-top: 5px;
  }
}

.record-wrap {
  height: 18px;
  display: flex;
  align-items: center;
}

.rule-wrap {
  height: 18px;
  display: flex;
  align-items: flex-start;
  margin-top: 35px;
  padding: 0px 8px;
  :deep(.el-checkbox) {
    width: 16px;
    height: 16px;
    margin-top: 2px;
  }
  .text {
    line-height: 20px;
    margin-left: 6px;
    a {
      color: #409eff;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

:deep(.el-dialog) {
  padding: 0px;
  border-radius: 12px;
  .el-form-item {
    margin-bottom: 20px;
  }
  .el-button {
    width: 100%;
    height: 32px;
    border-radius: 32px;
    background: #409eff;
    margin-top: 26px;
  }
}

:deep(.el-form-item__content) {
  height: 40px;
  border-radius: 4px;
  padding: 0px 12px;
  box-sizing: border-box;
  background: #f2f4f7;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  img {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  .el-input {
    width: 100%;
    height: 100%;
    .el-input__wrapper {
      padding: 0px 8px;
      outline: none !important;
      border: none !important;
      box-shadow: none !important;
      background-color: #f2f4f7 !important;
      .el-input__inner {
        -webkit-box-shadow: 0 0 0 1000px #f2f4f7 inset;
      }
    }
  }
}
</style>
