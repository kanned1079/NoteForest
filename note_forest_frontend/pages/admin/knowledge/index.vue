<script setup lang="ts">
import {useFormatTags} from "../../../composables/useFormatTagsStr";

definePageMeta({
  layout: 'empty',
  pageTransition: {
    name: 'layout-fade'
  }
})
import {ref, shallowRef, onMounted, watch, computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {deleteDocumentByUuid, fetchAllDocuments} from '~/api/document'
import type {DocumentItem} from '~/types/doc'
import useThemeStore from "~/store/themeStore";

const themeStore = useThemeStore()
const {locale, t} = useI18n()

const knowledgeArr = ref<DocumentItem[]>([])
const total = ref(0)
const page = ref(1)
const size = ref(10)

const dataIsLoading = ref<boolean>(true)
const showSearchDialog = ref<boolean>(false)
const handleKeydown = (e: KeyboardEvent) => {
  const isMac = /Mac/.test(navigator.platform)
  const isCmdOrAltK = (isMac && e.metaKey && e.key.toLowerCase() === 'k') || (!isMac && e.altKey && e.key.toLowerCase() === 'k')

  if (isCmdOrAltK) {
    e.preventDefault() // 可选：防止浏览器默认行为
    showSearchDialog.value = true
  }
}

const record = ref<DocumentItem>({
  id: '',
  title: '',
  subtitle: '',
  category: '',
  content: '',
})
const dialog = shallowRef(false)
const isEditing = shallowRef(false)
const showFetchErr = ref<boolean>(false)

const headers = [
  // {title: "uuid", key: "id"},
  {title: t('docList.titleColumn'), key: 'title'},
  // {title: t('docList.subtitleColumn'), key: 'subtitle'},
  {title: t('docList.withHeaderImage'), key: 'image_url'},
  {title: t('docList.categoryColumn'), key: 'category'},
  {title: t('docList.createdAtColumn'), key: 'created_at'},
  {title: t('docList.updatedAtColumn'), key: 'updated_at'},
  {title: t('docList.actionsColumn'), key: 'actions', sortable: false},
]

const searchContent = ref<string>('')

const fetchData = async () => {
  console.log(searchContent.value)

  dataIsLoading.value = true
  const res = await fetchAllDocuments(page.value, size.value, searchContent.value || '', false)
  if (res.code === 200 && Array.isArray(res.data)) {
    if (res.data.length > 0) {
      knowledgeArr.value = res.data
    } else {
      themeStore.showMessage(t('docList.searchResultNoData'), 'warning')
    }
    total.value = res.total || 0
    setTimeout(() => dataIsLoading.value = false, 300)
  } else {
    themeStore.showMessage(t('docList.fetchError'), 'error')
  }
}

watch([page, size], fetchData)

function edit(item: DocumentItem) {
  record.value = {...item}
  isEditing.value = true
  dialog.value = true
  if (item.id) {
    navigateTo(`/admin/knowledge/${item.id}`)
  } else {
    themeStore.showMessage(t('docList.missingUuid'), 'error')
  }
}

const showDeleteDialog = ref<boolean>(false)
const deleteUuid = ref<string>('')
const deleteTitle = ref<string>('')

const remove = (item: DocumentItem) => {
  deleteUuid.value = item.id
  deleteTitle.value = item.title
  showDeleteDialog.value = true
}

const runRemove = async () => {
  const {code, err} = await deleteDocumentByUuid(deleteUuid.value)
  if (code === 200) {
    themeStore.showMessage(t('docEdit.saveSuccess'), 'success') // 复用保存成功提示
    showDeleteDialog.value = false
    await fetchData()
  } else if (code === 404) {
    themeStore.showMessage(t('docEdit.docNotFound'), 'warning') // 复用文档未找到提示
  } else {
    themeStore.showMessage(`${t('docEdit.saveError')}${err}`, 'warning') // 复用保存失败提示
  }
}

const getSelectSize = computed<{ title: string, value: number }[]>(() => {
  const sizeDataRaw: number[] = [5, 10, 20, 50, 100, 200]
  return sizeDataRaw.map(nums => ({
    title: `${nums} ${t('docList.itemsPerPage')}`, // 带参数的翻译（需配置参数）
    value: nums
  }))
})

const setSize = (_size: number) => {
  page.value = 1
  size.value = _size
  localStorage.setItem('size', JSON.stringify(_size))
  fetchData()
}

const isEmpty = ref<boolean>(false)
const applySearch = () => {
  if (searchContent.value.trim()) {
    isEmpty.value = false
    fetchData()
    setTimeout(() => showSearchDialog.value = false, 500)
  } else {
    isEmpty.value = true
  }
}

const resetSearch = () => {
  if (searchContent.value.trim()) {
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

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  fetchData()
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
        :subtitle="t('docList.manageTip')"
    >
      <template v-slot:title>
        {{ t('docList.title') }}
      </template>

      <template v-slot:item>
        <div class="mt-2">
          <v-btn
              color="primary"
              variant="flat"
              style="text-transform: none !important;"
              @click="navigateTo({ path: `/${locale}/admin/knowledge/new` })"
          >
            <template v-slot:prepend>
              <v-icon>mdi-plus</v-icon>
            </template>
            {{ t('docEdit.commit') }} <!-- 假设“提交”对应新建操作，可根据实际调整键名 -->
          </v-btn>
          <v-btn
              color="primary"
              variant="tonal"
              class="ml-3"
              @click="showSearchDialog=true"
              style="text-transform: none !important;"
          >
            <template v-slot:prepend>
              <v-icon>mdi-file-search-outline</v-icon>
            </template>
            <template v-slot:append>
              <v-icon size="small">mdi-apple-keyboard-option</v-icon>
              +
              K
            </template>
            {{ t('docList.searchArticles') }}
          </v-btn>

          <v-btn
              color="default"
              variant="tonal"
              class="ml-3"
              style="opacity: 0.7; text-transform: none !important;"
              @click="resetSearch"
          >
            <template v-slot:prepend>
              <v-icon>mdi-reload</v-icon>
            </template>
            {{ t('docList.resetSearch') }}
          </v-btn>
        </div>
      </template>
    </v-card>

    <v-card
        variant="outlined"
        :border="0"
    >
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
              :no-data-text="t('docList.noData')"
              density="comfortable"
              hide-default-footer
              striped
          >


            <template v-slot:item.image_url="{ value }">
              <v-chip
                  class="ma-1"
                  label
                  variant="tonal"
                  size="x-small"
                  :color="value?'success':'default'"
              >
                {{ t(value?t('docList.set'):'docList.unset') }}
              </v-chip>
            </template>

            <template v-slot:item.category="{ value }">
              <v-chip
                  v-for="(tag, index) in useFormatTags(value as string)"
                  :key="index"
                  class="ma-1"
                  label
                  color="primary-darken-1"
                  variant="tonal"
                  size="x-small"
              >
                {{ tag }}
              </v-chip>
            </template>

            <template v-slot:item.title="{ value }">
              {{ value }}
            </template>

<!--            <template v-slot:item.subtitle="{ value }">-->
<!--              {{ value.length > 20 ? value.slice(0, 20) + '...' : value }}-->
<!--            </template>-->

            <template v-slot:item.created_at="{ value }">
              {{ new Date(value).toDateString() }}
            </template>

            <template v-slot:item.updated_at="{ value }">
              {{ new Date(value).toDateString() }}
            </template>

            <template v-slot:item.actions="{ item }">
              <v-icon size="medium" class="me-2" @click="edit(item)">mdi-pencil</v-icon>
              <v-icon size="medium" color="red" @click="remove(item)">mdi-delete</v-icon>
            </template>

            <template v-slot:loading>
              <p style="font-size: 1rem; margin: 30px 0; opacity: 0.6">{{ t('docList.loadingData') }}</p>
            </template>
          </v-data-table>
        </v-sheet>
      </v-card-item>

      <template v-slot:actions>
        <div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%;">
          <div style="font-size: 0.8rem" class="ml-3">
            {{ t('docList.itemsPerPageLabel') }} {{ size }} <!-- 带参数的翻译 -->
          </div>
          <div style="display: flex; flex-direction: row; align-items: center" class="mr-1">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                    variant="outlined"
                    v-bind="props"
                    size="small"
                    style="opacity: 0.8; margin-right: 16px; text-transform: none !important;"
                >
                  <v-icon size="small">mdi-format-list-numbered</v-icon>
                  <p style="margin-left: 6px">{{ t('docList.showItems') }}</p>
                </v-btn>
              </template>

              <v-list class="pa-1" density="compact">
                <v-list-item
                    v-for="(item, index) in getSelectSize"
                    :key="index"
                    @click="setSize(item.value)"
                    class="pl-1 pr-1 custom-list-item"
                    rounded
                    :style="!(index === getSelectSize.length - 1) ? { marginBottom: '4px' } : null"
                >
                  <v-list-item-title class="text-caption" style="line-height: 1.2">
                    {{ item.title }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-pagination
                :style="total > 1 ? { opacity: 0.8 } : null"
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

    <v-dialog
        max-width="500"
        v-model="showDeleteDialog"
    >
      <template v-slot:default>
        <v-card rounded="lg" :title="t('docList.deleteConfirm')" density="comfortable">
          <v-card-text>
            <div>
              <p style="margin-bottom: 10px; font-size: 0.8rem; font-weight: bold">
                {{ t('docList.deleteTip') }}
              </p>
              <p style="font-size: 1.1rem; font-weight: bold">{{ deleteTitle }}</p>
              <p style="font-size: 0.8rem; opacity: 0.6">{{ deleteUuid }}</p>
            </div>
          </v-card-text>

          <v-card-actions class="mb-1">
            <v-spacer></v-spacer>
            <v-btn
                variant="plain"
                :text="t('docEdit.thinkAgain')"
                @click="showDeleteDialog = false;"
                style="text-transform: none !important;"
            ></v-btn>
            <v-btn
                :text="t('docEdit.confirm')"
                color="error"
                @click="runRemove"
                style="text-transform: none !important;"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>

    <v-dialog
        v-model="showSearchDialog"
        width="auto"
        @after-leave="() => { isEmpty = false }"
    >
      <v-card
          class="mx-auto pb-3"
          color="surface-light"
          min-width="400px"
          :title="t('docList.searchTitle')"
          :subtitle="t('docList.searchSubtitle')"
      >
        <v-card-text>
          <v-text-field
              append-inner-icon="mdi-magnify"
              density="compact"
              :label="t('docList.searchLabel')"
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
        {{ t('docList.searchEmptyError') }}
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