<script setup lang="ts">
import useUserStore from "~/store/userStore";
import LoginForm from "~/components/LoginForm.vue";
import {useI18n} from "vue-i18n"

import {useRouter} from "#vue-router";

const {locale} = useI18n()
const router = useRouter()

definePageMeta({
  layout: 'empty',
  layoutTransition: {
    name: 'layout-fade'
  }
});

const userStore = useUserStore();
const { t } = useI18n();

let showSetUsernameDialog = ref<boolean>(false)
let showResetPwdDialog = ref<boolean>(false)

const usernameClick = () => {
  console.log('aaa');
  showSetUsernameDialog.value = true
};

const changePwdClick = () => {
  console.log('bbb');
  showResetPwdDialog.value = true
};

onMounted(() => {
  if (userStore.isAuthed && userStore.user.id >= 0) {

  } else  {
    router.replace({path: `/${locale.value}/`})
    console.log('111')
  }
})
</script>

<template>
  <div class="root">
    <!-- 用户信息卡片 -->
    <v-card variant="outlined" :elevation="0" :border="0">
      <template v-slot:title>
        <p class="card-title">{{ t('profile.yourInfo') }}</p>
      </template>
      <template v-slot:item>
        <div class="field-container">
          <!-- 用户 ID 字段 -->
          <div class="field-item" @click="usernameClick">
            <p class="field-title">
              # {{ userStore.user.id || 'Un' }}
            </p>
            <p class="field-hint">{{ t('profile.userId') }}</p>
          </div>
          <!-- 用户名 字段 -->
          <div class="field-item">
            <div class="field-content" @click="usernameClick">
              <p class="field-title">
                {{ userStore.user.username || '' }}
              </p>
              <div class="field-title-hint">
                <v-icon class="ml-2">mdi-square-edit-outline</v-icon>
                {{ t('profile.editUsername') }}
              </div>
            </div>
            <p class="field-hint">{{ t('profile.usernameHint') }}</p>
          </div>
        </div>
      </template>
    </v-card>

    <!-- 修改密码卡片 -->
    <v-card variant="outlined" :elevation="0" :border="0" class="mt-4">
      <template v-slot:title>
        <p class="card-title">{{ t('profile.changePwd') }}</p>
      </template>
      <template v-slot:item>
        <div class="change-pwd-container" @click="changePwdClick">
          <p class="change-pwd-hint">{{ t('profile.resetPwdHint') }}</p>
          <v-icon class="change-pwd-icon" size="18">mdi-rotate-right</v-icon>
        </div>
      </template>
    </v-card>

    <div class="text-center pa-4">
      <v-dialog
          v-model="showSetUsernameDialog"
          width="auto"
      >
        <SetUsername />
      </v-dialog>
    </div>

    <div class="text-center pa-4">
      <v-dialog
          v-model="showResetPwdDialog"
          width="auto"
      >
        <ResetPassword />
      </v-dialog>
    </div>


  </div>
</template>

<style scoped lang="less">
.root {
  // 根元素样式，可按需添加
}

.card-title {
  font-size: 1.2rem;
  font-weight: bold;
}

.field-container {
  padding: 1rem 0;

  .field-item {
    margin-bottom: 1.5rem;

    &:hover {
      .field-title {
        opacity: 0.8;
      }

      .field-title-hint {
        opacity: 0.8;
      }
    }

    .field-title {
      font-size: 2rem;
      font-weight: bold;
      opacity: 0.9;
      transition: opacity 300ms ease-in-out;
    }

    .field-content {
      display: flex;
      align-items: baseline;
    }

    .field-title-hint {
      opacity: 0;
      transition: opacity 300ms ease-in-out;
      margin-left: 0.5rem;
      font-size: 0.9rem;
    }
  }
}

.field-hint {
  font-size: 0.9rem;
  opacity: 0.6;
}

.change-pwd-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
}

.change-pwd-hint {
  font-size: 0.9rem;
  opacity: 0.6;
}

.change-pwd-icon {
  margin-left: 8px;
}
</style>