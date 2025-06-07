<script lang="ts" setup>
import {useInitTheme} from "~/composables/useInitTheme.js";

const props = defineProps({
  error: {
    type: Object,
    required: true
  }
})

let stop: () => void

onMounted(() => {
  stop = useInitTheme()

})

onBeforeUnmount(() => stop?.())
</script>

<template>
  <div class="pa-4">

    <v-card
      variant="outlined"
      :border="0"
      density="compact"
    >

      <v-card-title>
        Code {{ error.statusCode }}
      </v-card-title>

      <v-card-subtitle>
        <p>Sorry, there is an error on this page.</p>
        <p>Below is a description of the error and log information, please provide them to the administrator if possible.</p>
      </v-card-subtitle>

      <v-card-text>
        <p style="opacity: 0.5;">{{ error.message }}</p>
      </v-card-text>
      <v-card-actions>
<!--        <NuxtLink to="/note_forest_frontend/public">回首頁</NuxtLink>-->
        <v-btn :to="'/'">BACK</v-btn>
      </v-card-actions>

    </v-card>



  </div>
</template>

<style lang="less">
.root {
  padding: 10px;
}
</style>

