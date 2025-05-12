<script setup lang="ts">
import {ref} from 'vue'
import type {GithubUserSearchResponse} from '~/types/github'
import {useI18n} from "vue-i18n";
import {useApiFetchRequest} from "~/composables/useApiFetch";

const {t} = useI18n()

const githubUsername = 'kanned1079'
const githubAvatarUrl = `https://ikanned.com:2444/d/Upload/58361983.jpeg`

// 预取数据，SSR + 客户端共享
// const {data, error} = await useFetch<GithubUserSearchResponse>(
//     () => `https://api.github.com/search/users?q=${githubUsername}`, {
//       method: 'GET'
//     }
// )
const { data, error } = await useApiFetchRequest<GithubUserSearchResponse>(
    `https://api.github.com/search/users?q=${githubUsername}`,
    {
      method: 'GET',
      server: true, // 显式开启 SSR（默认是 false）
      baseURL: undefined, // 👈️ 禁用封装默认的 apiBase（因为这是外部 API）
      auth: false
    }
)

const myUser = ref<GithubUserSearchResponse | null>(data ?? {
  total_count: 0,
  incomplete_results: false,
  items: [
    {
      login: '',
      avatar_url: '',
      html_url: '',
    }
  ]
})

onMounted(() => {
  console.log(myUser.value)
})

</script>


<template>
  <div class="root">
    <div class="title-part-root">
      <h2>关于</h2>
    </div>

    <div class="avatar-root">
      <v-avatar size="60%">
        <v-img
            sizes="100%"
            v-if="githubAvatarUrl"
            :src="githubAvatarUrl">
        </v-img>
        <v-icon v-else>{{ 'mdi-account-box-multiple' }}</v-icon>
      </v-avatar>
    </div>

    <v-card
        prepend-icon="$vuetify"
        :subtitle="t('aboutMe.nameSubTitle')"
        width="90%"
        variant="outlined"
        :border="0"
        elevation="0"
    >
      <template v-slot:title>
<!--        <span class="font-weight-black">{{ myUser?.items[0].login }}</span>-->
        <span class="font-weight-black">{{ 'kanned1079' }}</span>
      </template>

      <template v-slot:prepend>
        <v-avatar>
<!--          <v-img-->
<!--              v-if="myUser?.items[0].avatar_url"-->
<!--              :src="myUser?.items[0].avatar_url">-->
<!--          </v-img>-->
          <!--          <v-icon v-else>{{ 'mdi-account-box-multiple' }}</v-icon>-->
                    <v-icon>{{ 'mdi-text-box-multiple-outline' }}</v-icon>
        </v-avatar>
      </template>

      <v-card-text
          style="text-indent: 2em"
      >
        {{ t(`aboutMe.selfIntroduction.p1`) }}
        {{ t(`aboutMe.selfIntroduction.p2`) }}
      </v-card-text>
      <v-card-text
          style="text-indent: 2em; padding-top: 0"

      >
        {{ t(`aboutMe.selfIntroduction.p3`) }}
      </v-card-text>
    </v-card>

    <v-divider></v-divider>

    <div class="title-part-root part-gap">
      <h2>{{ t('aboutMe.subscribe') }}</h2>
    </div>

    <v-card
        width="90%"
        variant="outlined"
        :border="0"
        elevation="0"
    >
      <v-card-text style="text-indent: 2em">
        {{ t('aboutMe.subscribeDescription') }}
      </v-card-text>

     <v-card-item style="padding: 0!important;">
       <v-btn
           variant="outlined"
           style="margin: 0 16px; width: calc(100% - 32px)"
           :href="`https://github.com/kanned1079`"
           rel="noopener"
           target="_blank"
       >
         <template v-slot:prepend>
           <v-icon size="large">mdi-github</v-icon>
         </template>
         <template v-slot:append>
           <v-icon size="small">mdi-open-in-new</v-icon>
         </template>
         <p>{{ t('aboutMe.viewOnGithub') }}</p>
       </v-btn>
     </v-card-item>

      <v-card-item subtitle="WechatID: kanned1079" style="padding: 10px 16px 0 16px">
        <template v-slot:title>{{ t('aboutMe.wechat') }}</template>
      </v-card-item>

      <v-card-item subtitle="+86 175 0529 1544" style="padding: 0 16px">
        <template v-slot:title>{{ t('aboutMe.phone') }}</template>
      </v-card-item>
    </v-card>



  </div>
</template>

<style scoped lang="less">
.root {
  padding-top: 16px;
  padding-right: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title-part-root {
    width: 90%;
    padding: 0 16px;
  }

  .avatar-root {
    width: 90%;
    padding: 20px 16px;
    text-align: center;
  }

}

.part-gap {
  margin-top: 20px;
}
</style>