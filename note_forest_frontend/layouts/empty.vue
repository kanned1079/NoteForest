<script setup lang="ts">
import CommonAside from "~/components/CommonAside.vue";
import useThemeStore from "~/store/themeStore";
import {useTheme} from "vuetify/framework";
import CommonHeaderLeft from "~/components/CommonHeaderLeft.vue";
import LatestMoment from "~/components/LatestMoment.vue";



const theme = useTheme()
const themeStore = useThemeStore()
const {t} = useI18n()
</script>

<template>
  <v-responsive>
    <v-app>

      <v-navigation-drawer
          :width="300"
          v-model="themeStore.isMenuDisplay"
          temporary
      >
        <div class="drawer-root">
          <CommonAside/>
        </div>
      </v-navigation-drawer>

      <v-app-bar
          :elevation="0"
          :height="56"
          style="background-color: rgba(0,0,0,0.0); backdrop-filter: blur(10px)"
      >
        <template v-slot:prepend>
          <CommonHeaderLeft/>
        </template>

        <template v-slot:append>
          <CommonHeaderRight/>
        </template>
      </v-app-bar>

      <v-main class="ml-2 mr-2" >
        <v-container :max-width="1600">
                <NuxtPage />
        </v-container>
      </v-main>

    </v-app>
  </v-responsive>
</template>

<style lang="less" scoped>
.drawer-root {

}

.scroll-area {
  max-height: calc(100vh - 0px);
  overflow-y: auto;
  padding-right: 4px;

  /* 隐藏滚动条：兼容 Chrome, Safari */
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  /* Firefox */
  scrollbar-width: none;

  /* IE / Edge */
  -ms-overflow-style: none;
}

@media (max-width: 960px) {
  .scroll-area {
    max-height: none;
    height: auto;
  }
}
</style>