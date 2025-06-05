<script setup lang="ts">
import useThemeStore from "~/store/themeStore";
import {useTheme} from "vuetify/framework";

const {locales, setLocale} = useI18n()
const theme = useTheme()
const themeStore = useThemeStore()

type LangOption = {
  text: string,
  code: 'en' | 'cn' | 'ja'
}

const langList: LangOption[] = [
  {
    text: 'English',
    code: 'en',
  },
  {
    text: '日本語',
    code: 'ja',
  },
  {
    text: '中文简体',
    code: 'cn'
  }
]

const colorSchemeClick = () => {
  themeStore.toggleDarkMode()
  theme.global.name.value = themeStore.isDarkModeEnabled?'dark':'light'
}

const langClick = (langCode: 'cn' | 'en' | 'ja') => {
  setLocale(langCode)
  themeStore.lang = langCode
}

</script>

<template>
<div class="root">

  <v-menu
      transition="slide-y-transition"
  >
    <template v-slot:activator="{ props }">
      <v-btn
          variant="plain"
          v-bind="props"
      >
        <v-icon size="large">{{ 'mdi-translate-variant' }}</v-icon>
      </v-btn>
    </template>
    <v-list
      density="compact"
    >
      <v-list-item
          v-for="(item, index) in langList"
          :key="index"
          :value="item.text"
          @click="langClick(item.code)"
          rounded
          class="custom-list-item ml-2 mr-2"
      >
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>


<v-btn
    variant="plain"
    @click="colorSchemeClick"
>
  <v-icon size="large">{{ 'mdi-white-balance-sunny' }}</v-icon>
</v-btn>
</div>
</template>

<style lang="less" scoped>
.root {
  margin-right: 14px;
}

.custom-list-item {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
  min-height: 28px !important;
  font-size: 1rem;
}
</style>