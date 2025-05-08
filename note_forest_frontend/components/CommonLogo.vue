<script setup lang="ts">
import {useTheme} from "vuetify/framework";

const theme = useTheme()
</script>

<template>
<div
    class="root"
    :style="{backgroundColor: theme.global.current.value.colors.secondary}"
>
  <p>Logo</p>
</div>
</template>

<style lang="less" scoped>
.root {
  width: 100%;
  height: 56px;
}
</style>