<script setup lang="ts">

</script>

<template>
  <div class="root">
    <v-card-title>
      最新动态
    </v-card-title>

    <v-card
        v-for="i in 7"
    class="mt-2"
      title="News"
    ></v-card>
  </div>
</template>

<style scoped lang="less">
.root {
  padding-left: 8px;
}
</style>