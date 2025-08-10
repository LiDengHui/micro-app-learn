<template>
  <div id="micro-content">
    <micro-app
      name="react-app"
      url="http://localhost:7101"
      baseroute="/react/*"
      iframe
      ssr
    ></micro-app>
  </div>
</template>

<script setup lang="ts">
// React sub-application view
</script>

<style scoped>
#micro-content {
  height: 100%;
  width: 100%;
}

micro-app {
  height: 100%;
  width: 100%;
}
</style>
