<script lang="ts" setup>
import useThemeStore from "~/store/themeStore";
import {useTheme} from "vuetify/framework";

const themeStore = useThemeStore()
const sysTheme = useTheme()

onMounted(() => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    themeStore.isDarkModeEnabled = true
    sysTheme.global.name.value = themeStore.isDarkModeEnabled?'dark':'light'
  }
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s;
}
.page-enter,
.page-leave-to {
  opacity: 0;
}


</style>