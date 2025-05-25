<script setup lang="ts">
import {ref} from 'vue';
import {updateUserPasswordById} from "~/api/user";
import {ca} from "vuetify/locale";
import useThemeStore from "~/store/themeStore";

const props = defineProps<{
  closeUpdatePassword: () => void
}>()

const themeStore = useThemeStore()
// 表单验证状态
const valid = ref(false);
// 旧密码输入
const oldPassword = ref('');
// 新密码输入
const newPassword = ref('');

// 旧密码验证规则
const oldPasswordRules = [
  (value: string) => {
    if (value) return true;
    return '旧密码是必填项';
  },
];

// 新密码验证规则
const newPasswordRules = [
  (value: string) => {
    if (value) return true;
    return '新密码是必填项';
  },
  (value: string) => {
    if (value.length >= 6) return true;
    return '新密码长度需大于等于 6 位';
  },
  (value: string) => {
  if (value === oldPassword.value) {
    return '新密码不能与旧密码相同'
  }
  }
];

// 提交表单方法
const submitForm = async () => {
  if (valid.value) {
    console.log('重置密码表单提交', {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    });
    // 重置密码逻辑可在此调用 API
    let {code} = await updateUserPasswordById(oldPassword.value, newPassword.value)
    switch (code) {
      case 200: {
        themeStore.showMessage('重置密码完成，在下次重新登录后请使用新密码登录。', 'success')
        setTimeout(() => props.closeUpdatePassword(), 500)
        break
      }
      case 409: {
        themeStore.showMessage('新密码不能与原先的密码相同', 'warning')
        break
      }
      default: {
        themeStore.showMessage('其他错误', 'error')
      }
    }
  }
};
</script>

<template>
  <v-card class="password-reset-card">
    <template v-slot:title style="padding: 48px 0 30px 0">
      <p class="ml-2">重置密码</p>
    </template>
    <v-card-item>
      <v-form v-model="valid" class="ma-2">
        <v-row>
          <v-col cols="12">
            <v-text-field
                variant="outlined"
                v-model="oldPassword"
                :rules="oldPasswordRules"
                label="旧密码"
                type="password"
                required
                clearable
                density="compact"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
                variant="outlined"
                v-model="newPassword"
                :rules="newPasswordRules"
                label="新密码"
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
          :color="valid ? 'success' : ''"
          variant="tonal"
          style="width: 100%"
          :disabled="!valid"
          @click="submitForm"
          density="default"
      >
        确认重置
      </v-btn>
    </v-card-item>
  </v-card>
</template>

<style scoped lang="less">
.password-reset-card {
  width: 400px;
  padding-bottom: 30px;
}

.title-part {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 16px;

  .reset-title {
    font-size: 1.4rem;
  }
}
</style>