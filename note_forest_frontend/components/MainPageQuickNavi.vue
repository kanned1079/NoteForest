<script setup lang="ts">
import {useApiFetchRequest} from "~/composables/useApiFetch";
import type {GithubUserSearchResponse} from "~/types/github";
import type {DocumentItem, GetDocumentsData} from "~/types/doc";
import {useCommonFetch} from "~/composables/useCommonFetch";
import {useRouter, useRoute} from "#vue-router";
import {useI18n} from "vue-i18n";
import {ref} from 'vue'

const {locale} = useI18n()
const router = useRouter()
const route = useRoute()

const props = defineProps<{
  overview: boolean
}>()

// const {code, data, error} = await useApiFetchRequest<GetDocumentsData>(
//     `/api/v1/knowledge`,
//     {
//       method: 'GET',
//       server: true,
//       auth: false
//     }
// )

const fetchDocumentsOnClient = async () => {
  let {code, data, error} = await useCommonFetch<GetDocumentsData>('/api/v1/knowledge', {
    method: 'GET',
    auth: false
  }, {
  })
  if (code === 200 && data?.documents && !error) {
    data.documents.forEach((doc: DocumentItem) => knowledgeList.value.push(doc))
  } else {
    console.log('fetch err')
  }

}

const knowledgeList = ref<DocumentItem[]>([])

onMounted(() => {
  // console.log('knowledgeList: ', data)
  // if (code === 200 && data?.documents && !error) {
  //   data.documents.forEach((doc: DocumentItem) => knowledgeList.value.push(doc))
  // } else {
  //   console.log('fetch err')
  // }

  fetchDocumentsOnClient()

})

</script>

<template>
  <div class="root">
    <div class="search-root">

      <v-btn
          style="opacity: 0.8"
          variant="text"
          density="default"
          v-if="route.path !== `/${locale}/knowledge`"
          @click="router.push({path: `/${locale}/knowledge`})"
      >
        前往文章列表页
        <template v-slot:append>
          <v-icon class="mr-2">mdi-chevron-right</v-icon>
        </template>
      </v-btn>


      <v-btn
          style="opacity: 0.8"
          variant="flat"
          class="ml-3"
          density="default"
          @click=""
      >
        <template v-slot:prepend>
          <v-icon class="mr-2">mdi-magnify</v-icon>
        </template>
        搜索文章
        <template v-slot:append>
          <div class="ml-3" style="border: #a5a5a5 1px solid; border-radius: 4px; padding: 1px 4px; font-size: 0.7rem">Cmd+K</div>
        </template>

      </v-btn>


    </div>

    <v-card
        v-for="i in knowledgeList"
        variant="flat"
        class="mt-3 doc-item pt-1 pb-0"
    >
      <v-card-text>
        <p class="font-weight-black" style="font-size: 1.3rem">{{ i.title }}</p>
        <p class="mt-1">{{ i.subtitle }}</p>
        <div style="display: flex; flex-direction: row; align-items: center; justify-content: flex-start">
          <div style="opacity: 0.7;" class="mr-4">{{ i.id }}</div>
          <p :style="i.created_at !== i.updated_at?{textDecoration: 'line-through'}:null" style="opacity: 0.5;">{{ new Date(i.created_at).toLocaleString() }}</p>
          <v-icon v-if="i.created_at !== i.updated_at" size="small" class="ml-1 mr-1" style="opacity: 0.6">mdi-arrow-right-thin</v-icon>
          <p v-if="i.created_at !== i.updated_at" style="opacity: 0.6;">{{ new Date(i.updated_at).toLocaleString() }} 更新</p>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped lang="less">
.root {
  padding-top: 16px;

  .search-root {
    text-align: right;
    padding-bottom: 8px;
  }
}

.doc-item {
  transition: ease-in-out 200ms;
}

.doc-item:hover {
  transform: translateX(0) translateY(-3px);
}
</style>