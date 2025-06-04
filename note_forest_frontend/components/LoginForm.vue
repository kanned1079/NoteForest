<script setup lang="ts">
import {ref} from 'vue'
import {processUserAuth} from "~/api/user";
import {useI18n} from "vue-i18n";
import {useTheme} from "vuetify";
import useThemeStore from "~/store/themeStore";

const {locale, t} = useI18n()

const props = defineProps<{
  closeLoginCard: () => void
}>()

const themeStore = useThemeStore()

// 表单验证状态
const valid = ref(false)
// 邮箱输入
const email = ref('')
// 密码输入
const password = ref('')

const loginCode = ref<number>(200)
const showLoginRes = ref<boolean>(false)

// 邮箱验证规则
const emailRules = [
  (value: string) => {
    if (value) return true
    return t('login.emailRequired')
  },
  (value: string) => {
    if (/.+@.+\..+/.test(value)) return true
    return t('login.emailInvalid')
  },
]

// 密码验证规则
const passwordRules = [
  (value: string) => {
    if (value) return true
    return t('login.passwordRequired')
  },
  (value: string) => {
    if (value.length >= 6) return true
    return t('login.passwordShort')
  },
]

const loginTipColor = ref<'success' | 'default' | 'warning' | 'error'>('success')
const loginTipText = ref<string>('')
const showRegisterDialog = ref<boolean>(false)

// 提交表单方法
const submitForm = async () => {
  if (!showRegisterDialog.value) {
    if (valid.value) {
      const {code} = await processUserAuth(email.value, password.value, 'login')
      // if (code !== 404) showLoginRes.value = true
      loginCode.value = code

      switch (code) {
        case 200:
          themeStore.showMessage(t('login.loginSuccess'), 'success')
          props.closeLoginCard()
          themeStore.toggleMenuDisplay()
          navigateTo({path: '/profile'})
          break
        case 400:
          themeStore.showMessage(t('login.formInvalid'), 'default')
          break
        case 404:
          showRegisterDialog.value = true
          break
        case 401:
          themeStore.showMessage(t('login.passwordError'), 'error')
          break
      }
    }
  } else {
    const {code} = await processUserAuth(email.value, password.value, 'register')
    showLoginRes.value = true
    loginCode.value = code

    switch (code) {
      case 200:
        loginTipColor.value = 'success'
        loginTipText.value = t('login.registerSuccess')

        props.closeLoginCard()
        break
      case 400:
        loginTipColor.value = 'default'
        loginTipText.value = t('login.formInvalid')
        break
      case 409:
        loginTipColor.value = 'error'
        loginTipText.value = t('login.userExists')
        break
    }
  }
}
</script>

<template>
  <v-card class="login-card-body">
    <div class="title-part">
      <p class="login-title">{{ showRegisterDialog ? t('login.registerTitle') : t('login.loginTitle') }}</p>
      <p class="app-name">{{ t('login.appName') }}</p>
    </div>
    <v-card-item v-if="!showRegisterDialog">
      <v-form v-model="valid" class="ma-2">
        <v-row>
          <v-col cols="12">
            <v-text-field
                variant="outlined"
                v-model="email"
                :rules="emailRules"
                :label="t('login.emailLabel')"
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
                :label="t('login.passwordLabel')"
                type="password"
                required
                clearable
                density="compact"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-item>

    <v-card-item class="ml-2 mr-2 mb-4" v-if="showRegisterDialog">
      <template v-slot:title style="font-weight: bold">
        {{ email }}
      </template>
      <template v-slot:subtitle style="font-size: 0.8rem; font-weight: bold">
        {{ t('login.emailAddress') }}
      </template>
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
        {{ t('login.loginButton') }}
      </v-btn>
    </v-card-item>

    <v-card-item class="ml-2 mr-2 pt-0" v-if="!showRegisterDialog">
      <v-alert
          density="compact"
          style="opacity: 0.5"
      >
        {{ t('login.autoRegisterTip') }}
      </v-alert>
    </v-card-item>

    <v-card-item class="ml-2 mr-2 pt-0" v-else>
      <v-alert
          density="compact"
          style="opacity: 1"
          color="warning"
          variant="tonal"
      >
        {{ t('login.confirmRegisterTip') }}
      </v-alert>
    </v-card-item>
  </v-card>

  <v-snackbar
      class="custom-snackbar"
      v-model="showLoginRes"
      timeout="3000"
      :color="loginTipColor"
      location="top"
      variant="flat"
  >
    <v-icon size="small" class="mr-1">mdi-information</v-icon>
    {{ loginTipText }}
  </v-snackbar>
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

.custom-snackbar {
  padding: 16px !important;
  font-size: 16px;
}
</style>