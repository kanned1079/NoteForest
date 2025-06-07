<script setup lang="ts">
import {useI18n} from "vue-i18n";
import useThemeStore from "~/store/themeStore";

definePageMeta({
  layout: 'empty',
  pageTransition: {
    name: 'layout-fade'
  }
})

const themeStore = useThemeStore()
const {locale, t} = useI18n()


type StatisticResponse = {
  users: number,
  documents: {
    total: number,
    deleted: number,
    active: number
  }
}

type ShowStatisticPageDataItem = {
  name: string,
  data: number,
  icon: string
}

const statisticData = ref<StatisticResponse>({
  users: 0,
  documents: {
    total: 0,
    deleted: 0,
    active: 0
  }
})

const showData = computed<ShowStatisticPageDataItem[]>(() => [
  {
    name: 'all',
    data: statisticData.value.documents.total,
    icon: 'book'
  },
  {
    name: 'active',
    data: statisticData.value.documents.active,
    icon: 'book-check-outline'
  },
  {
    name: 'deleted',
    data: statisticData.value.documents.deleted,
    icon: 'book-off-outline'
  },
  {
    name: 'users',
    data: statisticData.value.users,
    icon: 'account-check-outline'
  },
])

const showData2 = ref<ShowStatisticPageDataItem[]>([
  {
    name: 'all',
    data: statisticData.value.documents.total,
  },
  {
    name: 'active',
    data: statisticData.value.documents.active,
  },
  {
    name: 'deleted',
    data: statisticData.value.documents.deleted,
  },
  {
    name: 'users',
    data: statisticData.value.users,
  },
])

const getStatistic = async () => {
  try {
    const token = useCookie('token')
    const data = await $fetch<StatisticResponse>(`/api/v2/statistic`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    console.log(data)
    if (data) {
      statisticData.value = data
    } else themeStore.showMessage(t('adminPage.fetchErr'), 'warning')
  } catch (err: any) {
    if (err?.statusCode) {
      themeStore.showMessage(t('adminPage.fetchErr'), 'warning')
    }
  }
}

onMounted(() => {
  getStatistic()
})

</script>

<template>
  <div class="root">
    <!--  <p style="font-size: 2rem">Nothing here...</p>-->
    <v-card
        variant="outlined"
        :border="0"
        :subtitle="t('adminPage.subtitle')"
        class="pa-1"
        v-if="true"
    >
      <template v-slot:title>
        <p class="card-title">{{ t('adminPage.title') }}</p>
      </template>

      <template v-slot:item>
        <v-card
            variant="outlined"
            :border="0"
            v-for="i in showData"
            class="mt-6"
        >
          <v-card-title>
            <div style="display: flex; flex-direction: row; align-items: center">
              <v-icon :size="20">{{ `mdi-${i.icon}` }}</v-icon>
              <p style="font-size: 1.4rem; font-weight: bold; margin-left: 8px">{{ i.data }}</p>
            </div>
          </v-card-title>

          <v-card-subtitle>
            {{ t(`adminPage.statistic.${i.name}`) }}
          </v-card-subtitle>


        </v-card>
      </template>
    </v-card>
  </div>
</template>

<style scoped lang="less">
.root {
  //background-color: #a5a5a5;
}

.card-title {
  font-size: 1.2rem;
  font-weight: bold;
}

</style>