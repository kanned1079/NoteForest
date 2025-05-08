<script setup lang="ts">
definePageMeta({
  layout: 'empty',
  layoutTransition: {
    name: 'fade',
    mode: 'out-in'
  }
})
</script>

<template>
<div class="root">
  <v-card
    title="Login"
    subtitle="Login your account"
    class="login-card"
    variant="flat"
    rounded
    hover
  >
  <v-card-text>
    <div style="height: 340px">
      <v-form v-model="valid">


        <v-text-field
            variant="outlined"
            v-model="firstname"
            :counter="10"
            :rules="nameRules"
            label="First name"
            required
        ></v-text-field>

        <v-text-field
            variant="outlined"
            v-model="firstname"
            :counter="10"
            :rules="nameRules"
            label="First name"
            required
        ></v-text-field>
      </v-form>
    </div>
  </v-card-text>
  </v-card>
</div>
</template>

<style scoped lang="less">
.root {
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .login-card {
    width: 500px;

  }
}
</style>