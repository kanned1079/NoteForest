<script setup lang="ts">
import { useApiFetchRequest } from "~/composables/useApiFetch";
import type { GithubUserSearchResponse } from "~/types/github";
import type { DocumentItem, GetDocumentsData } from "~/types/doc";
import { useCommonFetch } from "~/composables/useCommonFetch";
import { useRouter, useRoute } from "#vue-router";
import { useI18n } from "vue-i18n";
import { ref, onMounted, onBeforeMount } from 'vue'
import useThemeStore from "~/store/themeStore";
import {useFormatTags} from "~/composables/useFormatTagsStr";

const themeStore = useThemeStore()
const { locale, t } = useI18n()
const router = useRouter()
const route = useRoute()

const props = defineProps<{
  overview: boolean
}>()

function isMacPlatform() {
  if ('userAgentData' in navigator) {
    // 使用类型断言告诉 TypeScript 这个属性存在
    return (navigator as any).userAgentData.platform === 'macOS'
  }
  return /mac/i.test(navigator.userAgent)
}

const handleKeydown = (e: KeyboardEvent) => {
  const isMac = isMacPlatform()
  const cmdOrAltPressed = isMac ? e.metaKey : e.altKey

  if (cmdOrAltPressed && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    showSearchDialog.value = true
  }
}

const searchTitle = ref<string>('')

const fetchDocumentsOnClient = async () => {
  // const { code, data, error } = await useCommonFetch<GetDocumentsData>(
  //     `/api/v1/knowledge?search=${searchTitle.value}&page=${page.value}&size=${size.value}`,
  //     { method: 'GET', auth: false }
  // )

  try {
    showSearchDialog.value = false
    const data = await $fetch<GetDocumentsData>(`/api/v2/document?search=${searchTitle.value}&page=${page.value}&size=${size.value}`)
    console.log(data.documents)
    if (data.documents && data.documents.length > 0) {
      knowledgeList.value = data.documents
    } else {
      themeStore.showMessage(t('docList.searchResultNoData'), 'warning')
    }
    total.value = data.total || 0
  } catch (err: any) {
    console.log(t('docList.fetchError')) // 使用现有翻译键
  }

  // if (code === 200 && data?.documents && !error) {
  //   knowledgeList.value = data.documents
  //   total.value = data.total || 0
  // } else {
  //   console.log(t('docList.fetchError')) // 使用现有翻译键
  // }
}

const knowledgeList = ref<DocumentItem[]>([])
const showSearchDialog = ref<boolean>(false)
const page = ref<number>(1)
const size = ref<number>(10)
const total = ref<number>(0)

const knowledgeItemClick = (id: string) => {
  navigateTo({ path: `/${locale.value}/knowledge/${id}` })
}

onBeforeMount(() => {
  if (route.path.endsWith('knowledge')) {
    size.value = 10
    isMainPage.value = false
    const sizeFromLocal = localStorage.getItem('size')
    if (sizeFromLocal) {
      size.value = JSON.parse(sizeFromLocal) || 10
    }
  } else {
    isMainPage.value = true
  }
})

const isMainPage = ref<boolean>(true)

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  fetchDocumentsOnClient()
})

onBeforeMount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="root">
    <div class="search-root">
      <v-btn
          style="opacity: 0.8;text-transform: none"
          variant="text"
          density="default"
          v-if="route.path !== `/${locale}/knowledge`"
          @click="router.push({ path: `/${locale}/knowledge` })"
      >
        {{ t('docList.goToListPage') }}
        <template v-slot:append>
          <v-icon class="mr-2">mdi-chevron-right</v-icon>
        </template>
      </v-btn>

      <v-btn
          style="opacity: 0.8;text-transform: none"
          variant="flat"
          class="ml-3"
          density="default"
          @click="showSearchDialog=true"
      >
        <template v-slot:prepend>
          <v-icon class="mr-2">mdi-magnify</v-icon>
        </template>
        {{ t('docList.searchArticles') }}
        <template v-slot:append>
          <div class="ml-3" style="border: #a5a5a5 1px solid; border-radius: 4px; padding: 1px 4px; font-size: 0.7rem;text-transform: none">
            {{ t('docList.searchShortcut') }}
          </div>
        </template>
      </v-btn>
    </div>

    <v-card
        v-for="i in knowledgeList"
        variant="outlined"
        border="1"
        elevation="0"
        class="mt-6 doc-item pb-0"
        @click="knowledgeItemClick(i.id)"
    >
      <v-card-text style="padding: 10px 16px">
        <p class="font-weight-black" style="font-size: 1.3rem">{{ i.title }}</p>
        <p class="mt-1">{{ i.subtitle.slice(0, 40) }}{{ i.subtitle.length > 40 ? '...' : '' }}</p>
        <div style="display: flex; flex-direction: row; align-items: center; justify-content: flex-start">
<!--          <div style="opacity: 0.7;" class="mr-4">{{ i.id }}</div>-->
          <v-chip
              v-for="(tag, index) in useFormatTags(i.category)"
              :key="index"
              class="mr-1"
              label
              variant="flat"
              style="opacity: 0.9"
              density="comfortable"
              size="x-small"
          >
            {{ tag }}
          </v-chip>
          <p :style="i.created_at !== i.updated_at ? { textDecoration: 'line-through' } : null" style="opacity: 0.5; margin-left: 8px">
            {{ new Date(i.created_at || '').toLocaleString() }}
          </p>
          <v-icon v-if="i.created_at !== i.updated_at" size="small" class="ml-1 mr-1" style="opacity: 0.6">
            mdi-arrow-right-thin
          </v-icon>
          <p v-if="i.created_at !== i.updated_at" style="opacity: 0.6;">
            {{ new Date(i.updated_at || '').toLocaleString() }} {{ t('docList.updated') }}
          </p>
        </div>
      </v-card-text>
    </v-card>

    <PaginationFooter
        v-if="!isMainPage"
        style="margin-top: 20px"
        v-model:page="page"
        v-model:size="size"
        :total="total"
        @update="fetchDocumentsOnClient"
    />

    <p style="font-size: 0.9rem; margin-top: 10px; opacity: 0.7; margin-left: 4px" v-else>
      {{ t('docList.paginationTip') }}
    </p>

    <div class="text-center pa-4">
      <v-dialog
          v-model="showSearchDialog"
          width="auto"
          style="padding-bottom: 20%"
      >
        <div style="min-width: 320px; width: 450px">
          <v-text-field
              variant="solo"
              append-inner-icon="mdi-magnify"
              :placeholder="t('docList.searchPlaceholder')"
              v-model="searchTitle"
              autofocus
              @keyup.enter="fetchDocumentsOnClient"
          ></v-text-field>
        </div>
      </v-dialog>
    </div>
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