<script setup lang="ts">
import AboutMe from "~/components/AboutMe.vue";

import CommonAside from "~/components/CommonAside.vue";
import useThemeStore from "~/store/themeStore";
import {useTheme} from "vuetify/framework";
import CommonHeaderLeft from "~/components/CommonHeaderLeft.vue";
import LatestMoment from "~/components/LatestMoment.vue";

import mihuan51 from "~/public/mihuan51.jpg"

const theme = useTheme()
const themeStore = useThemeStore()
const {t} = useI18n()
</script>

<template>
  <v-responsive>
    <v-app class="app" :style="themeStore.isDarkModeEnabled?{}:{backgroundImage: `url(${mihuan51})`}">
<!--        <v-parallax src="https://ikanned.com:2444/d/Upload/pexels-martin-p%C3%A9chy-5335217.jpg">-->


<!--      <MainPreview />-->

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
              style="background-color: rgba(0,0,0,0.0); backdrop-filter: blur(10px);"
          >
            <template v-slot:prepend>
              <CommonHeaderLeft/>
            </template>

<!--            <v-btn-->
<!--                style="opacity: 0.8;text-transform: none"-->
<!--                variant="flat"-->
<!--                class="ml-3"-->
<!--                density="default"-->
<!--                @click="showSearchDialog=true"-->
<!--            >-->
<!--              <template v-slot:prepend>-->
<!--                <v-icon class="mr-2">mdi-magnify</v-icon>-->
<!--              </template>-->
<!--              {{ t('docList.searchArticles') }}-->
<!--              <template v-slot:append>-->
<!--                <div class="ml-3" style="border: #a5a5a5 1px solid; border-radius: 4px; padding: 1px 4px; font-size: 0.7rem;text-transform: none">-->
<!--                  {{ t('docList.searchShortcut') }}-->
<!--                </div>-->
<!--              </template>-->
<!--            </v-btn>-->

            <template v-slot:append>
              <CommonHeaderRight/>
            </template>
          </v-app-bar>

          <v-main class="ml-2 mr-2" >
            <v-container :max-width="1600">
              <v-row>
                <!-- 区域 A -->
                <v-col
                    cols="12"
                    md="4"
                    order="1"
                    order-md="1"
                    style="height: auto;"
                >
<!--                  <AboutMe />-->
                  <AboutMeNew />
                </v-col>

                <!-- 区域 B -->
                <v-col
                    cols="12"
                    md="8"
                    order="2"
                    order-md="2"
                    class="pa-2"
                    style="height: auto;"
                >
                  <div class="scroll-area">
                    <NuxtPage />
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-main>
<!--        </v-parallax>-->




    </v-app>
  </v-responsive>
</template>

<style lang="less" scoped>

.app {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

}

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