<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { GithubUserSearchResponse } from '~/types/github'
import { useI18n } from 'vue-i18n'
import avatarImg from '~/public/author_avatar.jpeg'
import avatarBg from '~/public/mihuan39.jpg'
import avatarBg2 from '~/public/131825292_p0_small.jpg'
import useThemeStore from "~/store/themeStore";

const { t } = useI18n()
const themeStore = useThemeStore()
const githubUsername = 'kanned1079'

const myUser = ref<GithubUserSearchResponse | null>({
  total_count: 0,
  incomplete_results: false,
  items: [
    {
      login: '',
      avatar_url: '',
      html_url: '',
    },
  ],
})

onMounted(() => {
  // console.log(myUser.value)
})
</script>

<template>
  <div class="root">
    <v-card elevation="0" class="profile-card" rounded="lg"
            :color="!themeStore.isDarkModeEnabled?'primary-darken-1':null" :variant="null" border="1"
        :style="!themeStore.isDarkModeEnabled?{backgroundColor: `rgba(255,255,255,0.5)`}:{backgroundColor: `rgba(23,23,23,0.5)`}"
      >
      <!-- 顶部背景图 -->
      <div class="header-bg" :style="themeStore.isDarkModeEnabled?{filter: `brightness(30%)`}:null">
        <v-img :src="avatarBg2" cover height="220" style="opacity: 1;" />
      </div>

      <!-- 头像浮动区域 -->
      <div class="avatar-float" :style="themeStore.isDarkModeEnabled?{filter: `brightness(60%)`}:null">
        <v-avatar size="160">
          <v-img :src="avatarImg" alt="avatar" />
        </v-avatar>
      </div>

      <!-- 内容主体 -->
      <div class="content" style="backdrop-filter: blur(10px);">
        <h2 class="text-center">{{ t('aboutMe.title') }}</h2>
        <!--        <p class="subtitle text-center">{{ t('aboutMe.nameSubTitle') }}</p>-->
                <p class="subtitle text-center">{{ githubUsername }}</p>

        <v-card-text style="text-indent: 2em">
          {{ t('aboutMe.selfIntroduction.p1') }}<br />
          {{ t('aboutMe.selfIntroduction.p2') }}
        </v-card-text>
        <v-card-text style="text-indent: 2em; padding-top: 0">
          {{ t('aboutMe.selfIntroduction.p3') }}
        </v-card-text>

        <v-divider class="my-4" />

        <h3 class="text-center">{{ t('aboutMe.subscribe') }}</h3>
        <v-card-text class="text-center" style="text-indent: 2em">
          {{ t('aboutMe.subscribeDescription') }}
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn
              variant="outlined"
              :href="`https://github.com/${githubUsername}`"
              target="_blank"
              rel="noopener"
              class="text-none"
          >
            <v-icon start style="margin-left: 4px">mdi-github</v-icon>
            {{ t('aboutMe.viewOnGithub') }}
            <v-icon end small style="margin-right: 4px">mdi-open-in-new</v-icon>
          </v-btn>
        </v-card-actions>

        <v-card-text class="text-center mt-4">
          <div><strong>{{ t('aboutMe.wechat') }}:</strong> kanned1079</div>
          <div><strong>{{ t('aboutMe.phone') }}:</strong> +86 175 0529 1544</div>
        </v-card-text>
      </div>
    </v-card>
  </div>
</template>

<style scoped lang="less">
.root {
  //margin-top: 82px;
  margin-top: 16px;
  display: flex;
  justify-content: center;
  padding: 0 16px;
}

.profile-card {
  width: 100%;
  max-width: 640px;
  overflow: visible;
  position: relative;
}

.header-bg {
  position: relative;
  overflow: hidden;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.avatar-float {
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.content {
  background-color: rgba(0,0,0,0.0);
  margin-top: 80px;
  padding: 24px;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.text-none {
  text-transform: none !important;
}

.subtitle {
  font-size: 1.1rem;
  margin-top: 4px;
}
</style>