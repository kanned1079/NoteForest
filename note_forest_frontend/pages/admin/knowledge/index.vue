<script setup lang="ts">
definePageMeta({
  layout: 'empty',
  pageTransition: {
    name: 'layout-fade'
  }
})
import { ref, shallowRef, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchAllDocuments } from '~/api/document'
import type { DocumentItem } from '~/types/doc'

const { locale } = useI18n()

// 表格数据与分页
const knowledgeArr = ref<DocumentItem[]>([])
const total = ref(0)
const page = ref(1)
const size = ref(10)

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

// 表头
const headers = [
  { title: '标题', key: 'title' },
  { title: '副标题', key: 'subtitle' },
  { title: '分类', key: 'category' },
  { title: '创建时间', key: 'created_at' },
  { title: '操作', key: 'actions', sortable: false },
]

// 获取远程数据
const fetchData = async () => {
  const res = await fetchAllDocuments(page.value, size.value, '', false)
  if (res.code === 200 && Array.isArray(res.data)) {
    knowledgeArr.value = res.data
    total.value = res.total || 0
  }
}

// 页码或大小变化时重新加载
watch([page, size], fetchData)

// 编辑操作
function edit(item: DocumentItem) {
  record.value = { ...item }
  isEditing.value = true
  dialog.value = true
}

// 删除（假删）
function remove(id: number) {
  knowledgeArr.value = knowledgeArr.value.filter(item => item.id !== id)
  total.value--
}

// 初始化加载
onMounted(fetchData)
</script>

<template>
<div class="root">
  <v-card
      variant="outlined"
      :border="0"
      :subtitle="'你可以在这里管理所有的文章，包括编写、修改、删除等，支持MD语法。'"
  >
    <template v-slot:title>
      写文章
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
        >
          <template v-slot:prepend>
            <v-icon>mdi-file-search-outline</v-icon>
          </template>
          搜索文章
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
            style="background-color: rgba(0,0,0,0)"
            :headers="headers"
            :items="knowledgeArr"
            class="mt-0"
            item-value="id"
            no-data-text="暂无数据"
        >
          <template v-slot:item.created_at="{ value }">
            {{ new Date(value).toLocaleDateString() }}
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon size="small" class="me-2" @click="edit(item)">mdi-pencil</v-icon>
            <v-icon size="small" color="red" @click="remove(item.id)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-sheet>
    </v-card-item>

    <v-card-actions class="justify-space-between px-4">
      <div class="d-flex align-center">
        <span class="mr-2">每页显示</span>
        <v-select
            v-model="size"
            :items="[5, 10, 20, 50]"
            dense
            hide-details
            style="width: 80px"
        ></v-select>
        <span class="ml-2">条</span>
      </div>

      <v-pagination
          v-model="page"
          :length="Math.ceil(total / size)"
          total-visible="7"
      ></v-pagination>

      <div class="ml-2 text-grey">
        共 {{ total }} 篇文章
      </div>
    </v-card-actions>

    <v-dialog v-model="dialog" max-width="500">
      <v-card
          :subtitle="`${isEditing ? 'Update' : 'Create'} your favorite book`"
          :title="`${isEditing ? 'Edit' : 'Add'} a Book`"
      >
        <template v-slot:text>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="record.title" label="Title"></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="record.author" label="Author"></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-select v-model="record.genre" :items="['Fiction', 'Dystopian', 'Non-Fiction', 'Sci-Fi']" label="Genre"></v-select>
            </v-col>

            <v-col cols="12" md="6">
              <v-number-input v-model="record.year" :max="adapter.getYear(adapter.date())" :min="1" label="Year"></v-number-input>
            </v-col>

            <v-col cols="12" md="6">
              <v-number-input v-model="record.pages" :min="1" label="Pages"></v-number-input>
            </v-col>
          </v-row>
        </template>

        <v-divider></v-divider>

        <v-card-actions class="bg-surface-light">
          <v-btn text="Cancel" variant="plain" @click="dialog = false"></v-btn>

          <v-spacer></v-spacer>

          <v-btn text="Save" @click="save"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>


</div>
</template>

<style scoped lang="less">
.row-sp {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
</style>