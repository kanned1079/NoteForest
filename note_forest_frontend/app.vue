<script lang="ts" setup>
import useThemeStore from "~/store/themeStore";
import {useTheme} from "vuetify/framework";
import {useInitTheme} from "~/composables/useInitTheme";

const themeStore = useThemeStore()
const sysTheme = useTheme()
// const snackbarRef = ref(null)

// let showSnackbar = ref<boolean>(true)

let stop: () => void

onMounted(() => {
  stop = useInitTheme()
})

onBeforeUnmount(() => stop?.())

</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <v-snackbar
      class="custom-snackbar"
      v-model="themeStore.messageBody.show"
      :timeout="3000"
      location="top"
      variant="flat"
      :color="themeStore.messageBody.type"
  >
    <div style="display: flex; flex-direction: row; align-items: center; color: #f3f3f3">
              <v-icon size="small" class="mr-1">mdi-information</v-icon>
        <p>{{ themeStore.messageBody.text }}</p>
    </div>

  </v-snackbar>

</template>

<style lang="less">
* {
  margin: 0;
  padding: 0;
 text-transform: none !important;
}
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s;
}
.page-enter,
.page-leave-to {
  opacity: 0;
}

.custom-snackbar {
  padding: 12px !important;
  opacity: 0.8;
}

</style>