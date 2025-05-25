<script setup lang="ts">
import { watch } from 'vue'

interface Props {
  page: number
  size: number
  total: number
}

interface Emits {
  (e: 'update:page', value: number): void
  (e: 'update:size', value: number): void
  (e: 'update'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

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
  emit('update:page', 1)           // 重置页码
  emit('update:size', _size)       // 设置新页大小
  localStorage.setItem('size', JSON.stringify(_size))
}

// 监听 page 和 size，变化时触发 @update 事件
watch(() => [props.page, props.size], () => {
  emit('update')
})

const onPageChange = (val: number) => {
  emit('update:page', val)
}

const onSizeChange = (val: number) => {
  setSize(val)
  emit('update:size', val)
}
</script>

<template>
  <div class="d-flex justify-space-between w-100 align-center">
    <div class="ml-3 text-caption">每页显示条目：{{ size }}</div>
    <div class="d-flex flex-row align-center mr-1">
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
              variant="outlined"
              v-bind="props"
              size="small"
              style="opacity: 0.8; margin-right: 16px"
          >
            <v-icon size="small">mdi-format-list-numbered</v-icon>
            <span class="ml-1">显示条目数</span>
          </v-btn>
        </template>
        <v-list class="pa-1" density="compact">
          <v-list-item
              v-for="(item, index) in getSelectSize"
              :key="index"
              @click="onSizeChange(item.value)"
              class="pl-1 pr-1 custom-list-item"
              rounded
              :style="index !== getSelectSize.length - 1 ? { marginBottom: '4px' } : null"
          >
            <v-list-item-title class="text-caption">{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-pagination
          :style="total > 1 ? { opacity: 0.8 } : null"
          variant="outlined"
          density="comfortable"
          :model-value="page"
          @update:modelValue="onPageChange"
          :length="Math.ceil(total / size)"
          total-visible="7"
          size="small"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.custom-list-item {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
  min-height: 28px !important;
  font-size: 1rem;
}
</style>