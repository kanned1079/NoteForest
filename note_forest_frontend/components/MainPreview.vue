<script setup lang="ts">
import rootBg from "~/public/preview_root_bg.jpg"
import useThemeStore from "~/store/themeStore";
const themeStore = useThemeStore()

console.log(themeStore.isDarkModeEnabled)

</script>

<template>
  <div class="root" :style="{
    backgroundImage: `url(${rootBg})`,
    filter: themeStore.isDarkModeEnabled ? 'brightness(50%)' : 'none'
  }">
    <div class="bottom-left">
      <!-- 左下角内容 -->
      <p style="font-size: 3rem">Exploring the World of hiking.</p>
      <p>Take a look at our fresh Design, giving you a sneak peek the concept of Horizone</p>
      <p>Car Rental Page, before its incredible makeover. Let's take a deep dive!</p>

    </div>
    <div class="bottom-right">
      <!-- 右下角内容 -->
      <p style="font-size: 2rem">右下角内容</p>
    </div>
  </div>
</template>

<style scoped lang="less">
.root {
  height: 80vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

  .bottom-left,
  .bottom-right {
    position: absolute;
    bottom: 20px;
    color: white;
    font-size: 16px;
    padding: 8px 12px;
    border-radius: 8px;
  }

  .bottom-left {
    left: 100px;
    bottom: 100px;
  }

  .bottom-right {
    right: 20px;
  }
}
</style>