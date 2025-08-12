<template>
  <router-view />
  <!-- 子应用不再包含任何自有菜单或头部布局，完全由主应用承载导航 -->
</template>

<script setup lang="ts">
// 空壳应用，路由页面直接渲染
</script>

<style>
/* 全局样式重置 */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
}

#app {
  height: 100vh;
}
</style>
