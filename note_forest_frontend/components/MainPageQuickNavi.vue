<script setup lang="ts">
definePageMeta({})
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
        v-for="i in 100"
        variant="flat"
        hover
        :title="`文章 ${i}`"
        :subtitle="`Provide it as the value of ${i}`"
        class="mt-3"
    >
      <v-card-text>
        Aliasing allows you to use built-in Vuetify components as a baseline for your custom implementations. To get
        started, import the component that you want to extend. Provide it as the value of a unique key that is used for
        the virtual component’s name
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