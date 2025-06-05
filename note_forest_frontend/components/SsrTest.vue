<script setup lang="ts">

console.log('SsrTest')

// const {data, pending, error} = await useFetch('/api/user')

const { data } = await useAsyncData('users', () => $fetch('/api/user'))
console.log(data.value)
</script>

<template>

</template>

<style scoped lang="less">

</style>