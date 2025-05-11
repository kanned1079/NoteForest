<script setup lang="ts">
import LoginForm from "~/components/LoginForm.vue";

definePageMeta({
  layout: 'empty',
  pageTransition: {
    name: 'layout-fade'
  }
})
import {ref, shallowRef, onMounted, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {fetchAllDocuments} from '~/api/document'
import type {DocumentItem} from '~/types/doc'

const {locale} = useI18n()

// 表格数据与分页
const knowledgeArr = ref<DocumentItem[]>([])
const total = ref(0)
const page = ref(1)
const size = ref(10)

const dataIsLoading = ref<boolean>(true)
const showSearchDialog = ref<boolean>(false)
const handleKeydown = (e: KeyboardEvent) => {
  // 对于 Mac 和 Windows，Alt 键会被统一识别为 e.altKey
  if (e.altKey && e.key === 'Enter') {
    showSearchDialog.value = true
    console.log('Alt/Option + Enter pressed')
  }
}


// 当前记录、编辑状态
const record = ref<DocumentItem>({
  id: 0,
  title: '',
  subtitle: '',
  category: '',
  content: '',
})
const dialog = shallowRef(false)
const isEditing = shallowRef(false)
const showFetchErr = ref<boolean>(false)

// 表头
const headers = [
  {title: '标题', key: 'title'},
  {title: '副标题', key: 'subtitle'},
  {title: '分类', key: 'category'},
  {title: '创建时间', key: 'created_at'},
  {title: '操作', key: 'actions', sortable: false},
]

const searchContent = ref<string>('')


// 获取远程数据
const fetchData = async () => {
  dataIsLoading.value = true
  const res = await fetchAllDocuments(page.value, size.value, searchContent.value ? searchContent.value : '', false)
  if (res.code === 200 && Array.isArray(res.data)) {
    knowledgeArr.value = res.data
    total.value = res.total || 0
    setTimeout(() => dataIsLoading.value = false, 300)
  } else {
    showFetchErr.value = true
  }
}

// 页码或大小变化时重新加载
watch([page, size], fetchData)

// 编辑操作
function edit(item: DocumentItem) {
  record.value = {...item}
  isEditing.value = true
  dialog.value = true
}

// 删除（假删）
function remove(id: number) {
  knowledgeArr.value = knowledgeArr.value.filter(item => item.id !== id)
  total.value--
}

const getSelectSize = computed<{ title: string, value: number }[]>(() => {
  let sizeDataRaw: number[] = [5, 10, 20, 50, 100, 200]
  let displayColumn: { title: string, value: number }[] = []
  sizeDataRaw.forEach((nums: number) => displayColumn.push({
    title: `${nums} 条数据 / 页`,
    value: nums
  }))
  return displayColumn
})

const setSize = (_size: number) => {
  console.log('size:', size)
  page.value = 1
  size.value = _size
  localStorage.setItem('size', JSON.stringify(_size))
  fetchData()
}

const isEmpty = ref<boolean>(false)
const applySearch = () => {
  if (searchContent.value.toString().trim()) {
    isEmpty.value = false
    console.log(searchContent.value)
    fetchData()
    setTimeout(() => showSearchDialog.value = false, 500)
  } else {
    isEmpty.value = true
  }
}

const resetSearch = () => {
  if (searchContent.value.toString().trim()) {
    searchContent.value = ''
    fetchData()
  }
}

onBeforeMount(() => {
  const sizeFromLocal = localStorage.getItem('size')
  if (sizeFromLocal) {
    size.value = JSON.parse(sizeFromLocal) || 10
  }
})

// 初始化加载
onMounted(() => {
  showFetchErr.value = true
  fetchData()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="root">
    <v-card
        variant="outlined"
        :border="0"
        :subtitle="'你可以在这里管理所有的文章，包括编写、修改、删除等，支持MD语法。'"
    >
      <template v-slot:title>
        文章列表
      </template>

      <template v-slot:item>
        <div class="mt-2">
          <v-btn
              color="primary"
              variant="flat"
              @click="navigateTo({path: `/${locale}/admin/knowledge/new`})"
          >
            <template v-slot:prepend>
              <v-icon>mdi-plus</v-icon>
            </template>
            编写新文章
          </v-btn>
          <v-btn
              color="primary"
              variant="tonal"
              class="ml-3"
              @click="showSearchDialog=true"
              style="text-transform: none"
          >
            <template v-slot:prepend>
              <v-icon>mdi-file-search-outline</v-icon>
            </template>
            <template v-slot:append>
              <v-icon size="small">mdi-apple-keyboard-option</v-icon>
              +
              Enter
            </template>
            搜索文章
          </v-btn>

          <v-btn
              color="default"
              variant="tonal"
              class="ml-3"
              style="opacity: 0.7"
              @click="resetSearch"
          >
            <template v-slot:prepend>
              <v-icon>mdi-reload</v-icon>
            </template>
            重置搜索
          </v-btn>
        </div>
      </template>
    </v-card>

    <v-card
        variant="outlined"
        :border="0"
    >

      <template v-slot:item></template>

      <v-card-item class="mt-2">
        <v-sheet rounded border>
          <v-data-table
              :loading="dataIsLoading"
              style="background-color: rgba(0,0,0,0)"
              :headers="headers"
              :items="knowledgeArr"
              :items-per-page="size"
              class="mt-0"
              item-value="id"
              no-data-text="暂无数据"
              density="comfortable"
              hide-default-footer
              striped
          >
            <template v-slot:item.created_at="{ value }">
              {{ new Date(value).toLocaleDateString() }}
            </template>

            <template v-slot:item.actions="{ item }">
              <v-icon size="medium" class="me-2" @click="edit(item)">mdi-pencil</v-icon>
              <v-icon size="medium" color="red" @click="remove(item.id)">mdi-delete</v-icon>
            </template>

            <template v-slot:loading>
              <p style="font-size: 1rem; margin: 30px 0; opacity: 0.6">正在获取数据</p>
            </template>

          </v-data-table>
        </v-sheet>
      </v-card-item>

      <template v-slot:actions>
        <div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%;">
          <div style="font-size: 0.8rem" class="ml-3">每页显示条目： {{ size }}</div>
          <div style="display: flex; flex-direction: row; align-items: center" class="mr-1">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                    variant="outlined"
                    v-bind="props"
                    size="small"
                    style="opacity: 0.8; margin-right: 16px"
                >
                  <v-icon size="small">{{ 'mdi-format-list-numbered' }}</v-icon>
                  <p style="margin-left: 6px">显示条目数</p>
                </v-btn>
              </template>

              <v-list class="pa-1" density="compact">
                <v-list-item
                    v-for="(item, index) in getSelectSize"
                    :key="index"
                    @click="setSize(item.value)"
                    class="pl-1 pr-1 custom-list-item"
                    rounded
                    :style="!(index===getSelectSize.length-1)?{marginBottom: '4px'}:null"
                >
                  <v-list-item-title class="text-caption" style="line-height: 1.2">{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-pagination
                :style="total>1?{opacity: 0.8}:null"
                variant="outlined"
                density="comfortable"
                v-model="page"
                :length="Math.ceil(total / size)"
                total-visible="7"
                size="small"
            ></v-pagination>
          </div>
        </div>
      </template>
    </v-card>

    <v-snackbar
        class="custom-snackbar"
        v-model="showFetchErr" timeout="30000" color="success" location="top" variant="tonal"
    >
      <v-banner-text label="Title">
        操作成功！
        <template v-slot:prepend>
          <v-icon>mdi-check-circle</v-icon>
        </template>
      </v-banner-text>
    </v-snackbar>

    <v-dialog
        v-model="showSearchDialog"
        width="auto"
        @after-leave="() => {isEmpty = false}"
    >
      <v-card
          class="mx-auto pb-3"
          color="surface-light"
          min-width="400px"
          title="搜寻"
          subtitle="输入您要搜寻的文章标题，支持模糊查询。"
      >
        <v-card-text>
          <v-text-field
              :loading="loading"
              append-inner-icon="mdi-magnify"
              density="compact"
              label="标题（点击或按下Enter来搜寻）"
              variant="solo"
              hide-details
              single-line
              v-model="searchContent"
              @click:append-inner="applySearch"
              @keydown.enter="applySearch"
          ></v-text-field>
        </v-card-text>
      </v-card>

      <v-alert class="mt-4" color="info" v-if="isEmpty">
        <template v-slot:prepend>
          <v-icon>mdi-information</v-icon>
        </template>
        搜索内容不可以为空
      </v-alert>
    </v-dialog>
  </div>
</template>

<style scoped lang="less">
.row-sp {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.custom-list-item {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
  min-height: 28px !important;
  font-size: 1rem;
}

.custom-snackbar {
  padding: 16px !important;
  font-size: 16px;
}
</style>