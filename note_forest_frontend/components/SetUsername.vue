<script setup lang="ts">
import { ref } from 'vue'
import useUserStore from "~/store/userStore";

import {updateUsername} from "~/api/user";
import useThemeStore from "~/store/themeStore";

const props = defineProps<{
  closeUpdateUsername: () => void
}>()

const themeStore = useThemeStore()
const userStore = useUserStore()
// 表单验证状态
const valid = ref(false)
// 用户名输入
const username = ref('')

const showAlert = ref<boolean>(false)

// 用户名验证规则
const usernameRules = [
  (value: string) => {
    if (value) return true
    return '用户名是必填项'
  },
  (value: string) => {
  if (value === userStore.user.username) return '新用户名不可以与先前的相同'
  },
  (value: string) => {
    if (/^[^\d].{3,19}$/.test(value)) return true
    return '用户名长度需在 4 - 20 位之间，且不能以数字开头'
  },
]

// 提交表单方法
const submitForm = async () => {
  if (valid.value) {
    console.log('设置用户名表单提交', {
      username: username.value
    })
    let {code} = await updateUsername(username.value)
    switch (code) {
      case 200: {
        themeStore.showMessage('成功', 'success')
        props.closeUpdateUsername()
        break
      }
    }

  }

}

onMounted(() => {
  username.value = userStore.user.username || ''
  // message('ok', 'warning')
})
</script>

<template>
  <v-card
      class="username-setting-card"
  >
    <template v-slot:title style="padding: 48px 0 30px 0">
      <p class="ml-2">设置您的用户名</p>
    </template>
    <v-card-item>
      <v-form v-model="valid" class="ma-2">
        <v-row>
          <v-col cols="12">
            <v-text-field
                variant="outlined"
                v-model="username"
                :rule="usernameRules"
                label="用户名"
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
        确认
      </v-btn>
    </v-card-item>
  </v-card>

  <v-snackbar
      v-model="showAlert"
      timeout="3000"
      location="top"
      variant="elevated"
      class="pa-0"


  >
    <v-alert type="warning" variant="tonal">6666</v-alert>



  </v-snackbar>

</template>

<style scoped lang="less">
.username-setting-card {
  width: 400px;
  padding-bottom: 30px;
}
.title-part {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 16px;
  .setting-title {
    font-size: 1.4rem;
  }
}
</style>