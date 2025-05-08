<script setup lang="ts">
import {useI18n} from "vue-i18n";

definePageMeta({
  layout: 'empty',
  layoutTransition: {
    name: 'layout-fade'
  }
});
const {locale} = useI18n()

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