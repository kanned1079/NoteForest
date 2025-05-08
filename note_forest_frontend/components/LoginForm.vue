<script setup lang="ts">
import { ref } from 'vue'

// 表单验证状态
const valid = ref(false)
// 邮箱输入
const email = ref('')
// 密码输入
const password = ref('')

// 邮箱验证规则
const emailRules = [
  (value: string) => {
    if (value) return true
    return '邮箱地址是必填项'
  },
  (value: string) => {
    if (/.+@.+\..+/.test(value)) return true
    return '请输入有效的邮箱地址'
  },
]

// 密码验证规则
const passwordRules = [
  (value: string) => {
    if (value) return true
    return '密码是必填项'
  },
  (value: string) => {
    if (value.length >= 6) return true
    return '密码长度至少为 6 个字符'
  },
]

// 提交表单方法
const submitForm = () => {
  if (valid.value) {
    console.log('登录表单提交', {
      email: email.value,
      password: password.value
    })
    // 登录逻辑可在此调用 API
  }
}
</script>

<template>
  <v-card class="login-card-body">
    <div class="title-part">
      <p class="login-title">登入到您的账户</p>
      <p class="app-name">Note Forest</p>
    </div>
    <v-card-item>
      <v-form v-model="valid" class="ma-2">
        <v-row>
          <v-col cols="12">
            <v-text-field
                variant="outlined"
                v-model="email"
                :rules="emailRules"
                label="邮箱地址"
                required
                clearable
                density="compact"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
                variant="outlined"
                v-model="password"
                :rules="passwordRules"
                label="输入密码"
                type="password"
                required
                clearable
                density="compact"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-item>

    <v-card-item class="ml-2 mr-2 pt-0">
      <v-btn
          :color="valid?'success':''"
          variant="tonal"
          style="width: 100%"
          :disabled="!valid"
          @click="submitForm"
          density="default"
      >
        登入 / 注册
      </v-btn>
    </v-card-item>

    <v-card-item class="ml-2 mr-2 pt-0">
      <v-alert
        density="compact"
        style="opacity: 0.5"
      >
        如果您没有账户，将为您自动注册，请务必确认您的密码是否输入正确。
      </v-alert>
    </v-card-item>

  </v-card>
</template>

<style scoped lang="less">
.login-card-body {
  width: 400px;
  padding-bottom: 30px;
}
.title-part {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 16px;
  .login-title {
    font-size: 1.4rem;
  }
  .app-name {
    font-size: 0.9rem;
    opacity: 0.8;
  }
}
</style>