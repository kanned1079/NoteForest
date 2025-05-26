<script setup lang="ts">
import {ref} from 'vue';
import {updateUserPasswordById} from "~/api/user";
import useThemeStore from "~/store/themeStore";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const props = defineProps<{
  closeUpdatePassword: () => void
}>();

const themeStore = useThemeStore();
const valid = ref(false);
const oldPassword = ref('');
const newPassword = ref('');

// 旧密码验证规则（翻译错误提示）
const oldPasswordRules = [
  (value: string) => value ? true : t('password.oldRequired'),
];

// 新密码验证规则（翻译错误提示）
const newPasswordRules = [
  (value: string) => value ? true : t('password.newRequired'),
  (value: string) => value.length >= 6 ? true : t('password.newMinLength', {length: 6}),
  (value: string) => value !== oldPassword.value || t('password.newSameAsOld'),
];

const submitForm = async () => {
  if (valid.value) {
    const {code} = await updateUserPasswordById(oldPassword.value, newPassword.value);
    switch (code) {
      case 200:
        themeStore.showMessage(t('password.resetSuccess'), 'success');
        setTimeout(() => props.closeUpdatePassword(), 500);
        break;
      case 409:
        themeStore.showMessage(t('password.newSameAsOld'), 'warning');
        break;
      default:
        themeStore.showMessage(t('password.resetError'), 'error');
    }
  }
};
</script>

<template>
  <v-card class="password-reset-card">
    <template v-slot:title style="padding: 48px 0 30px 0">
      <p class="ml-2">{{ t('password.resetTitle') }}</p>
    </template>
    <v-card-item>
      <v-form v-model="valid" class="ma-2">
        <v-row>
          <v-col cols="12">
            <v-text-field
                variant="outlined"
                v-model="oldPassword"
                :rules="oldPasswordRules"
                :label="t('password.oldPassword')"
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
                :label="t('password.newPassword')"
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
        {{ t('password.confirmReset') }}
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