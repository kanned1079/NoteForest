<script setup lang="ts">
import type {DocumentItem} from "~/types/doc";
import {getDocumentByUuid} from "~/api/document";
import {useApiFetchRequest} from "~/composables/useApiFetch";
import type {GithubUserSearchResponse} from "~/types/github";
import {useRouter} from "vue-router";
import 'md-editor-v3/lib/preview.css';
import {MdPreview, MdCatalog} from 'md-editor-v3';
import useThemeStore from "~/store/themeStore";
import useUserStore from "~/store/userStore";
import {useI18n} from "vue-i18n";
import SsrTest from "~/components/SsrTest.vue";

definePageMeta({
  layout: 'empty',
  pageTransition: {
    name: 'layout-fade'
  }
})

const {t} = useI18n()

const userStore = useUserStore()
const themeStore = useThemeStore()
const route = useRoute()
const router = useRouter()
const docUuid = route.params.id as string

if (process.server) {
  console.log('[SSR] loading doc:', docUuid)
} else {
  console.log('[Client] loading doc:', docUuid)
}

// const {data, error} = await useApiFetchRequest<DocumentItem>(
//     `/api/v1/knowledge/${docUuid}`,
//     {
//       method: 'GET',
//       server: true, // 显式开启 SSR（默认是 false）
//       auth: false
//     }
// )

const data = await $fetch<DocumentItem>(`/api/v2/document/${docUuid}`)

if (!data) {
  // console.error('[SSR Error]', error.value)
  router.back()
}
//
// if (error) {
//   console.error('[SSR Error]', error.value)
//   router.back()
// }

const documentData = ref<DocumentItem | null>(data || null)

type CommentItem = {
  id: string
  email: string
  username?: string
  content: string
  created_at: string
  updated_at: string
}

const commentList = ref<CommentItem[]>([])

const id = 'preview-only';
const text = ref('# Hello Editor');
// const scrollElement = document.documentElement;

function toggleFullscreen(shouldEnter: boolean) {
  const el = document.documentElement

  if (shouldEnter) {
    if (!document.fullscreenElement) {
      if (el.requestFullscreen) el.requestFullscreen()
      else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen()
      else if ((el as any).mozRequestFullScreen) (el as any).mozRequestFullScreen()
      else if ((el as any).msRequestFullscreen) (el as any).msRequestFullscreen()
    }
  } else {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) document.exitFullscreen()
      else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen()
      else if ((document as any).mozCancelFullScreen) (document as any).mozCancelFullScreen()
      else if ((document as any).msExitFullscreen) (document as any).msExitFullscreen()
    }
  }
}


onMounted(() => {
  console.log(docUuid)

  if (!data) {
    router.back()
  }



})

</script>

<template>

<!--  <SsrTest />-->

  <div class="root">

    <div class="operate-part-root">
      <div class="operate-l">
        <v-btn
            style="opacity: 0.8; text-transform: none !important;"
            color="primary"
            variant="text"
            size="small"
            @click="router.back()">
          <template v-slot:prepend>
            <v-icon>mdi-chevron-left</v-icon>
          </template>
          {{ t('readDoc.back') }}
        </v-btn>
      </div>

      <div class="operate-r">
        <v-btn
            color="primary"
            variant="outlined"
            size="small"
            style="opacity: 0.8; text-transform: none !important;"
            @click="toggleFullscreen(true)">
          <template v-slot:append>
            <v-icon>mdi-fullscreen</v-icon>
          </template>
          {{ t('readDoc.enterFullScreen') }}
        </v-btn>
        <v-btn
            style="margin-left: 10px;opacity: 0.8; text-transform: none !important;"
            color="warning"
            variant="outlined"
            size="small"
            @click="toggleFullscreen(false)">
          <template v-slot:append>
            <v-icon>mdi-fullscreen-exit</v-icon>
          </template>
          {{ t('readDoc.exitFullScreen') }}
        </v-btn>

      </div>
    </div>

    <v-card
      variant="flat"
      height="200"
      class="mt-8 mb-8"
      v-if="documentData.image_url"

    >
      <v-parallax
          :src="documentData.image_url"
          scale="1"
      >
      </v-parallax>

    </v-card>

    <div class="doc">
      <!--      <p class="doc-title">{{ documentData.title }}</p>-->
      <!--      <p class="doc-subtitle">{{ documentData.subtitle }}</p>-->

<!--      <MdCatalog :editorId="id"  />-->
      <MdPreview
          :id="id"
          :modelValue="documentData?.content"
          :theme="themeStore.isDarkModeEnabled?'dark':undefined"
          :preview-theme="'github'"
      />
    </div>

    <div style="display: flex; flex-direction: row; align-items: center; justify-content: flex-end; margin-top: 60px; font-size: 0.8rem">
      <div style="opacity: 0.7;" class="mr-4">{{ documentData?.id }}</div>
      <p :style="documentData?.created_at !== documentData?.updated_at?{textDecoration: 'line-through'}:null" style="opacity: 0.5;">{{ new Date(documentData?.created_at || '').toLocaleString() }}</p>
      <v-icon v-if="documentData?.created_at !== documentData?.updated_at" size="small" class="ml-1 mr-1" style="opacity: 0.6">mdi-arrow-right-thin</v-icon>
      <p v-if="documentData?.created_at !== documentData?.updated_at" style="opacity: 0.6;">{{ new Date(documentData?.updated_at || '').toLocaleString() }} {{ t('docList.updated') }}</p>
    </div>

<!--    <v-parallax-->
<!--        src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"-->
<!--    >-->
<!--      <div class="d-flex flex-column fill-height justify-center align-center text-white">-->
<!--        <h1 class="text-h4 font-weight-thin mb-4">-->
<!--          Vuetify-->
<!--        </h1>-->
<!--        <h4 class="subheading">-->
<!--          Build your application today!-->
<!--        </h4>-->
<!--      </div>-->
<!--    </v-parallax>-->

    <v-divider style="margin: 10px 0 60px 0" />


    <v-alert
        text="因为一些原因，评论区暂时不可见。 / 因為一些原因，評論區暫時不可見。 / 何らかの理由により、コメント欄は一時的に利用できません。 / 어떤 이유에서인지, 댓글 섹션을 일시적으로 이용할 수 없습니다. / For some reason, the comments section is temporarily unavailable. / Pour une raison quelconque, la section commentaires est temporairement indisponible. / Jostain syystä kommenttiosio on tilapäisesti poissa käytöstä. / Бо баъзе сабабҳо, бахши шарҳҳо муваққатан дастрас нест."
        type="warning"
        variant="outlined"
        :icon="false"
        class="mb-10"
    ></v-alert>

    <div class="comment" v-if="false">
      <p class="comment-title">留言</p>
      <p class="comment-count">共 {{ 99 }} 条留言 （按照时间排序）</p>

      <v-card
          variant="text"
          style="margin-bottom: 16px"
      >
        <v-card-text class="pl-0 pr-0">
          <div>
            <v-text-field variant="outlined" label="添加你的留言" density="compact" hide-details/>
            <div style="margin-top: 10px">
              <v-btn
                  color="primary"
                  variant="text"
                  style="margin-right: 10px"

              >
                <template v-slot:prepend><v-icon>mdi-check</v-icon></template>
                留言
              </v-btn>
              <v-btn
                  color="primary"
                  variant="plain"
              >
                <template v-slot:prepend><v-icon>mdi-close</v-icon></template>

                取消
              </v-btn>
            </div>
          </div>
        </v-card-text>


      </v-card>


      <v-card
          v-for="i in commentList"
          :key="i.id"
          variant="text"
          style="margin-bottom: 26px"
      >
        <p style="font-size: 1rem">{{ i.content }}</p>
        <div style="display: flex; flex-direction: row; align-items: baseline; font-size: 0.8rem">
          <p style="font-weight: bold; opacity: 0.8">{{ i.username ? `${i.username}` : i.email }}</p>
          <p style="font-size: 0.8rem; margin-left: 10px; opacity: 0.5">
            {{ new Date(i.updated_at || i.created_at).toLocaleString() }}
            {{ i.created_at !== i.updated_at ? '修改过' : '' }}</p>
          <a v-if="i.email === userStore.user.email"
             @click="() => {}"
             class="del-btn"
          >删除
          </a>
        </div>

      </v-card>
    </div>




  </div>

  <!--  <MdCatalog :editorId="id" :scrollElement="scrollElement" />-->


</template>

<style scoped lang="less">
.root {
  padding: 0 60px 200px;

  .doc {
    .doc-title {
      font-size: 2rem;
      font-weight: bold;
    }

    .doc-subtitle {
      font-size: 0.9rem;
      margin-bottom: 20px;
      opacity: 0.7;
    }
  }

  .comment {

    .comment-title {
      font-size: 1.2rem;
      font-weight: bold;
    }

    .comment-count {
      opacity: 0.8;
      margin-bottom: 4px;
    }
  }
}

@media (max-width: 768px) {
  .root {
    padding: 0 0 200px 0;
  }
}

.del-btn {
  transition: ease-in-out 200ms;
  margin-left: 10px;
}

.del-btn:hover {
  opacity: 0.7;
  text-decoration: underline;
}


.md-editor {
  z-index: 1 !important;
  --md-border-color: #7c7c7c !important;
  border-radius: 4px;
  //border: #919191 solid 1px;
  --md-border-active-color: #000 !important;
  --md-bk-color: rgba(0, 0, 0, 0.0) !important;
}

.md-editor-dark {
  --md-bk-color: rgba(0, 0, 0, 0.0) !important;
  --md-border-color: #989898 !important;
}

.operate-part-root {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
  .operate-l {

  }
}

</style>