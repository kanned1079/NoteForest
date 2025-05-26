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
const docUuid = route.params.id

const {data, error} = await useApiFetchRequest<DocumentItem>(
    `/api/v1/knowledge/${docUuid}`,
    {
      method: 'GET',
      server: true, // 显式开启 SSR（默认是 false）
      auth: false
    }
)

if (error) {
  router.back()
}

const documentData = ref<DocumentItem | null>(data || null)

type CommentItem = {
  id: string
  email: string
  username?: string
  content: string
  created_at: string
  updated_at: string
}

const commentList = ref<CommentItem[]>([
  {
    id: '7ac774bd-f635-4d33-8b67-80da816e5995',
    email: 'kanned1079@gmail.com',
    content: 'tim老师，这两年有很多音乐剧中巡，很多国际知名音乐剧演员也来开演唱会，感觉剧圈的热度大了很多，能不能去伦敦或者纽约介绍一下百老汇或者西区的音乐剧，采访一下当地演员，去分享一下现场看音乐剧的感觉，或者介绍一下剧院设施和这个行业的前景，感觉会很有意思',
    created_at: '2025-05-25T10:30:00Z',
    updated_at: '2025-05-25T10:35:00Z',
  },
  {
    id: 'c2e3f40a-41d2-45d9-9d87-2b6aafe5b13b',
    email: 'alice@example.com',
    username: 'Alice',
    content: '文介绍 风光人文摄影 接地气的梗 夸张的表现形式 技术派的专场\n' +
        '你要什么 应有尽有',
    created_at: '2025-05-25T09:20:00Z',
    updated_at: '2025-05-25T09:20:00Z',
  },
  {
    id: 'e9731824-b8cc-4f4e-bd99-9462430a4f84',
    email: 'bob@example.com',
    username: 'Bob',
    content: '我一直很好奇，omakese往往都爱强调自己食材新鲜，早上市场挑货/空运什么。可每个客人就给那么一小点，一晚翻台率也有限，这背后的经济学原理是怎么样？例如各种肉买了一大块，一晚只服务了几座，剩下的靠着厨子的精妙的先进先出原则刺身/腌制/熟成什么窍门控制尽量物尽其用，实在不行了剩下的扔掉？客人虽然每一件都没吃到多少，但他们本身也为了菜品的多样性而承担了这部分的成本？',
    created_at: '2025-05-24T18:45:00Z',
    updated_at: '2025-05-24T19:00:00Z',
  },
  {
    id: 'a91313f1-3aa9-4e54-926d-e6db4c7b7d79',
    email: 'charlie@domain.com',
    content: '中国古代好像没有冠夫姓这制度吧，好像也是从西方来的，像民国开始出现了把名字前加上夫姓。还好新中国成立了，不然的话也可能像日本那样',
    created_at: '2025-05-23T15:00:00Z',
    updated_at: '2025-05-23T15:00:00Z',
  },
  {
    id: 'df3e0c22-9d6a-4cf1-ae4b-c5c3d1196de7',
    email: 'daniel@sample.net',
    username: 'Daniel',
    content: 'Nice work! I’ll be looking forward to your next article.',
    created_at: '2025-05-22T13:35:00Z',
    updated_at: '2025-05-22T14:10:00Z',
  },
  {
    id: '22e4a378-8b0a-4f2b-a5e2-d23dc7802fae',
    email: 'no_name@ghostmail.com',
    content: 'Interesting perspective. I hadn’t thought of it that way.',
    created_at: '2025-05-21T11:10:00Z',
    updated_at: '2025-05-21T11:15:00Z',
  },
])

const id = 'preview-only';
const text = ref('# Hello Editor');
// const scrollElement = document.documentElement;

onMounted(() => {
  console.log(docUuid)
})

</script>

<template>

  <div class="root">

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


    <v-alert
        text="因为一些原因，评论区暂时不可见。 / 因為一些原因，評論區暫時不可見。 / 何らかの理由により、コメント欄は一時的に利用できません。 / 어떤 이유에서인지, 댓글 섹션을 일시적으로 이용할 수 없습니다. / For some reason, the comments section is temporarily unavailable. / Pour une raison quelconque, la section commentaires est temporairement indisponible. / Jostain syystä kommenttiosio on tilapäisesti poissa käytöstä. / Бо баъзе сабабҳо, бахши шарҳҳо муваққатан дастрас нест."
        type="warning"
        variant="outlined"
        :icon="false"
    ></v-alert>

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



</style>