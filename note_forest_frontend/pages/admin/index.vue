<script setup lang="ts">
import {useI18n} from "vue-i18n";

definePageMeta({
  layout: 'empty',
  pageTransition: {
    name: 'layout-fade'
  }
})

const {locale} = useI18n()

const desserts = ref([
  {
    name: '总文章数',
    calories: 159,
  },
  {
    name: '总推文数',
    calories: 237,
  },
  {
    name: '总通知数',
    calories: 262,
  },
  {
    name: '总注册数',
    calories: 305,
  },
])

</script>

<template>
<div class="root">
  <p style="font-size: 2rem">Nothing here...</p>
  <v-card
      variant="flat"
      :border="0"
      :subtitle="'站点的基本信息，包含主要的统计数据。'"
      hover
      class="pa-1"
      v-if="false"
  >
    <template v-slot:title>
      统计信息
    </template>

  <template v-slot:item>
    <v-table
        density="comfortable"
        class="mt-2"
    >
      <tbody>
      <tr
          v-for="item in desserts"
          :key="item.name"
      >
        <td class="pl-0">{{ item.name }}</td>
        <td>{{ item.calories }}</td>
      </tr>
      </tbody>
    </v-table>
  </template>
  </v-card>
</div>
</template>

<style scoped lang="less">
.root {
//background-color: #a5a5a5;
}
</style>