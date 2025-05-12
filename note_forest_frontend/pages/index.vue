<script setup lang="ts">
definePageMeta({
  layoutTransition: {
    name: 'layout-fade',
  }
})
</script>

<template>
<div class="root">
  <MainPageQuickNavi :overview="true"/>
</div>
</template>

<style lang="less" scoped>
.root {

}
</style>