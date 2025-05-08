<script setup lang="ts">
import {useApiFetchRequest} from "~/composables/useApiFetch";
import type {GithubUserSearchResponse} from "~/types/github";

definePageMeta({})

type KnowledgeItem = {
  id: number;
  title: string;
  subtitle: string;
  show?: boolean;
  content: string;
  created_at: Date
}

type FetchKnowledgeRes = {
  code: number
  data: {
    data: KnowledgeItem[]
  }
  message: string
}

const { data, error } = await useApiFetchRequest<FetchKnowledgeRes>(
    `http://localhost:8081/api/v1/knowledge`,
    {
      method: 'GET',
      server: true,
      baseURL: undefined,
      auth: false
    }
)

const knowledgeList = ref<KnowledgeItem[]>([])

onMounted(() => {
  console.log(data.value)
  if (data.value.code === 200) {
    data.value.data.data.forEach((i: KnowledgeItem) => knowledgeList.value.push(i))
  }
})

</script>

<template>
  <div class="root">
    <div class="search-root">
      <v-btn
          style="opacity: 0.8"
          variant="outlined"
          density="default"
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
        hover
        :title="i.title"
        :subtitle="i.subtitle"
        class="mt-3"
    >
      <v-card-text>
        {{ i.content }}
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
</style>